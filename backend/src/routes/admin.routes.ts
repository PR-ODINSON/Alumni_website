import { Router } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { protect, authorize } from '../middleware/auth';
import User from '../models/User';
import Alumni from '../models/Alumni';
import Student from '../models/Student';
import Post from '../models/Post';
import Job from '../models/Job';
import Event from '../models/Event';
import SuccessStory from '../models/SuccessStory';
import { AuthRequest } from '../middleware/auth';
import { resolveConvocationPhotoUrl } from '../utils/convocationPhoto';

const router = Router();
router.use(protect, authorize('admin'));

// Dashboard Overview
router.get('/dashboard', asyncHandler(async (_req: AuthRequest, res) => {
  const [
    totalUsers, totalAlumni, totalStudents, totalFaculty,
    pendingVerifications, totalJobs, totalEvents, recentUsers,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'alumni' }),
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'faculty' }),
    User.countDocuments({ verificationStatus: 'under_review' }),
    Job.countDocuments(),
    Event.countDocuments(),
    User.find().sort('-createdAt').limit(10).select('firstName lastName email role createdAt isEmailVerified'),
  ]);

  res.json({
    success: true,
    data: { totalUsers, totalAlumni, totalStudents, totalFaculty, pendingVerifications, totalJobs, totalEvents, recentUsers },
  });
}));

// User Management
router.get('/users', asyncHandler(async (req: AuthRequest, res) => {
  const { page = 1, limit = 20, role, status, search } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter: any = {};
  if (role) filter.role = role;
  if (status === 'active') filter.isActive = true;
  if (status === 'banned') filter.isBanned = true;
  if (search) filter.$or = [
    { firstName: new RegExp(search as string, 'i') },
    { lastName: new RegExp(search as string, 'i') },
    { email: new RegExp(search as string, 'i') },
  ];

  const [users, total] = await Promise.all([
    User.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  res.json({ success: true, data: users, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
}));

router.patch('/users/:userId/ban', asyncHandler(async (req: AuthRequest, res, next) => {
  const { reason } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.userId,
    { isBanned: true, banReason: reason, isActive: false },
    { new: true }
  );
  if (!user) return next(new AppError('User not found.', 404));
  res.json({ success: true, message: 'User banned.', data: user });
}));

router.patch('/users/:userId/unban', asyncHandler(async (req: AuthRequest, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.userId,
    { isBanned: false, banReason: undefined, isActive: true },
    { new: true }
  );
  if (!user) return next(new AppError('User not found.', 404));
  res.json({ success: true, message: 'User unbanned.', data: user });
}));

router.patch('/users/:userId/verify', asyncHandler(async (req: AuthRequest, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) return next(new AppError('User not found.', 404));
  
  user.verificationStatus = 'verified';
  user.isVerified = true;
  user.verificationHistory.push({
    status: 'verified',
    updatedBy: req.user._id,
    notes: 'Manually verified via user list.',
    updatedAt: new Date(),
  });
  await user.save();

  res.json({ success: true, data: user });
}));

// Content Moderation
router.get('/posts/reported', asyncHandler(async (_req: AuthRequest, res) => {
  const posts = await Post.find({ isPublished: true })
    .populate('author', 'firstName lastName avatar email')
    .sort('-createdAt')
    .limit(50);
  res.json({ success: true, data: posts });
}));

router.patch('/posts/:postId/remove', asyncHandler(async (req: AuthRequest, res, next) => {
  const post = await Post.findByIdAndUpdate(req.params.postId, { isPublished: false }, { new: true });
  if (!post) return next(new AppError('Post not found.', 404));
  res.json({ success: true, message: 'Post removed from feed.' });
}));

// Event Management
router.patch('/events/:eventId/publish', asyncHandler(async (req: AuthRequest, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.eventId, { isPublished: true }, { new: true });
  if (!event) return next(new AppError('Event not found.', 404));
  res.json({ success: true, data: event });
}));

// Success Stories
router.patch('/stories/:storyId/publish', asyncHandler(async (req: AuthRequest, res, next) => {
  const story = await SuccessStory.findByIdAndUpdate(
    req.params.storyId,
    { isPublished: true, isFeatured: req.body.isFeatured || false, publishedAt: new Date() },
    { new: true }
  );
  if (!story) return next(new AppError('Story not found.', 404));
  res.json({ success: true, data: story });
}));

// Helper to normalize department names for consistent reporting
function normalizeDepartment(dept?: string): string {
  if (!dept) return 'General Engineering';
  const trimmed = dept.trim();
  const lower = trimmed.toLowerCase();
  if (lower === 'civil' || lower === 'civil engineering') return 'Civil Engineering';
  if (lower === 'mechanical' || lower === 'mechanical engineering') return 'Mechanical Engineering';
  if (lower === 'electrical' || lower === 'electrical engineering') return 'Electrical Engineering';
  if (
    lower === 'computer engineering' ||
    lower === 'computer science & engineering' ||
    lower === 'computer science and engineering' ||
    lower === 'cse'
  ) return 'Computer Science & Engineering';
  if (lower === 'chemical' || lower === 'chemical engineering') return 'Chemical Engineering';
  return trimmed;
}

// ── Academic & Field Statistics (Field vs Passing Year) ───────────────────
router.get('/academic-stats', asyncHandler(async (req: AuthRequest, res) => {
  const { degree, department, yearFrom, yearTo } = req.query;

  const alumniMatch: any = {};
  const studentMatch: any = {};

  if (degree && degree !== 'All') {
    alumniMatch.degreeType = degree;
    studentMatch.degreeType = degree;
  }

  if (department && department !== 'All') {
    const deptRegex = new RegExp(`^${department}$`, 'i');
    alumniMatch.department = deptRegex;
    studentMatch.department = deptRegex;
  }

  if (yearFrom || yearTo) {
    alumniMatch.graduationYear = {};
    if (yearFrom) alumniMatch.graduationYear.$gte = Number(yearFrom);
    if (yearTo) alumniMatch.graduationYear.$lte = Number(yearTo);
  }

  // Aggregate alumni grouped by department, graduationYear, and degreeType
  const [alumniAgg, studentAgg, allAlumniDegrees, allStudentDegrees] = await Promise.all([
    Alumni.aggregate([
      { $match: alumniMatch },
      {
        $group: {
          _id: {
            department: '$department',
            graduationYear: '$graduationYear',
            degreeType: '$degreeType',
          },
          count: { $sum: 1 },
        },
      },
    ]),
    Student.aggregate([
      { $match: studentMatch },
      {
        $group: {
          _id: {
            department: '$department',
            currentYear: '$currentYear',
            degreeType: '$degreeType',
          },
          count: { $sum: 1 },
        },
      },
    ]),
    Alumni.distinct('degreeType'),
    Student.distinct('degreeType'),
  ]);

  // Combined distinct degrees
  const degreesSet = new Set<string>();
  allAlumniDegrees.filter(Boolean).forEach((d) => degreesSet.add(d));
  allStudentDegrees.filter(Boolean).forEach((d) => degreesSet.add(d));
  ['B.Tech', 'M.Tech', 'PhD', 'Diploma'].forEach((d) => degreesSet.add(d));
  const distinctDegrees = Array.from(degreesSet);

  // Department map for normalized aggregation
  interface DeptSummary {
    department: string;
    enrolledStudents: number;
    graduatedByYear: Record<number, number>;
    totalGraduated: number;
    grandTotal: number;
    degreeDistribution: Record<string, { enrolled: number; graduated: number }>;
  }

  const deptMap = new Map<string, DeptSummary>();
  const allGradYearsSet = new Set<number>();
  const yearTotalsMap: Record<number, number> = {};

  function getOrCreateDept(deptRaw: string): DeptSummary {
    const norm = normalizeDepartment(deptRaw);
    if (!deptMap.has(norm)) {
      deptMap.set(norm, {
        department: norm,
        enrolledStudents: 0,
        graduatedByYear: {},
        totalGraduated: 0,
        grandTotal: 0,
        degreeDistribution: {},
      });
    }
    return deptMap.get(norm)!;
  }

  // Populate alumni records
  for (const item of alumniAgg) {
    const { department: rawDept, graduationYear, degreeType } = item._id;
    const count = item.count;
    const entry = getOrCreateDept(rawDept);

    const yearNum = Number(graduationYear) || 0;
    if (yearNum > 0) {
      allGradYearsSet.add(yearNum);
      entry.graduatedByYear[yearNum] = (entry.graduatedByYear[yearNum] || 0) + count;
      entry.totalGraduated += count;
      yearTotalsMap[yearNum] = (yearTotalsMap[yearNum] || 0) + count;
    }

    const deg = degreeType || 'Other';
    if (!entry.degreeDistribution[deg]) entry.degreeDistribution[deg] = { enrolled: 0, graduated: 0 };
    entry.degreeDistribution[deg].graduated += count;
  }

  // Populate student records
  for (const item of studentAgg) {
    const { department: rawDept, degreeType } = item._id;
    const count = item.count;
    const entry = getOrCreateDept(rawDept);

    entry.enrolledStudents += count;

    const deg = degreeType || 'Other';
    if (!entry.degreeDistribution[deg]) entry.degreeDistribution[deg] = { enrolled: 0, graduated: 0 };
    entry.degreeDistribution[deg].enrolled += count;
  }

  // Compute grand totals
  let totalEnrolledAll = 0;
  let totalGraduatedAll = 0;
  const sortedYears = Array.from(allGradYearsSet).sort((a, b) => a - b);

  deptMap.forEach((entry) => {
    entry.grandTotal = entry.enrolledStudents + entry.totalGraduated;
    totalEnrolledAll += entry.enrolledStudents;
    totalGraduatedAll += entry.totalGraduated;
  });

  const matrixRows = Array.from(deptMap.values()).sort((a, b) => b.grandTotal - a.grandTotal);

  // Peak year
  let peakYear: { year: number; count: number } | null = null;
  for (const y of sortedYears) {
    const cnt = yearTotalsMap[y] || 0;
    if (!peakYear || cnt > peakYear.count) {
      peakYear = { year: y, count: cnt };
    }
  }

  // Year breakdown for charts
  const passingYearBreakdown = sortedYears.map((year) => {
    const deptsInYear: Record<string, number> = {};
    for (const row of matrixRows) {
      if (row.graduatedByYear[year]) {
        deptsInYear[row.department] = row.graduatedByYear[year];
      }
    }
    return {
      year,
      totalPassed: yearTotalsMap[year] || 0,
      departments: deptsInYear,
    };
  });

  res.json({
    success: true,
    data: {
      summary: {
        totalEnrolled: totalEnrolledAll,
        totalGraduated: totalGraduatedAll,
        grandTotal: totalEnrolledAll + totalGraduatedAll,
        totalDepartments: matrixRows.length,
        peakYear,
        topDepartment: matrixRows.length > 0 ? { department: matrixRows[0].department, count: matrixRows[0].grandTotal } : null,
      },
      distinctYears: sortedYears,
      distinctDepartments: matrixRows.map((r) => r.department),
      distinctDegrees,
      matrix: {
        years: sortedYears,
        yearTotals: yearTotalsMap,
        rows: matrixRows,
      },
      passingYearBreakdown,
    },
  });
}));

// ── Scalable Academic Records (Searchable & Exportable Cohort Drill-Down) ─
router.get('/academic-records', asyncHandler(async (req: AuthRequest, res) => {
  const {
    cohortType = 'all', // 'all' | 'students' | 'alumni'
    department,
    graduationYear,
    degree,
    search,
    page = 1,
    limit = 20,
    exportCsv = 'false',
  } = req.query;

  const records: any[] = [];

  const shouldFetchAlumni = cohortType === 'all' || cohortType === 'alumni';
  const shouldFetchStudents = cohortType === 'all' || cohortType === 'students';

  // Build filter for Alumni
  const alumniFilter: any = {};
  if (department && department !== 'All') {
    alumniFilter.department = new RegExp(department as string, 'i');
  }
  if (graduationYear && graduationYear !== 'All') {
    alumniFilter.graduationYear = Number(graduationYear);
  }
  if (degree && degree !== 'All') {
    alumniFilter.degreeType = degree;
  }

  // Build filter for Students
  const studentFilter: any = {};
  if (department && department !== 'All') {
    studentFilter.department = new RegExp(department as string, 'i');
  }
  if (degree && degree !== 'All') {
    studentFilter.degreeType = degree;
  }

  const [alumniDocs, studentDocs] = await Promise.all([
    shouldFetchAlumni
      ? Alumni.find(alumniFilter)
          .populate('user', 'firstName lastName email phone avatar')
          .sort('-graduationYear')
          .lean()
      : [],
    shouldFetchStudents
      ? Student.find(studentFilter)
          .populate('user', 'firstName lastName email phone avatar')
          .sort('-batch')
          .lean()
      : [],
  ]);

  // Format alumni
  for (const a of alumniDocs) {
    const user: any = a.user || {};
    const normDept = normalizeDepartment(a.department);
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Alumni Member';
    const email = user.email || '';
    const enr = a.enrollmentNumber || '';

    // Search filter
    if (search) {
      const q = String(search).toLowerCase();
      const match =
        fullName.toLowerCase().includes(q) ||
        email.toLowerCase().includes(q) ||
        enr.toLowerCase().includes(q) ||
        normDept.toLowerCase().includes(q);
      if (!match) continue;
    }

    records.push({
      id: a._id,
      fullName,
      email,
      phone: user.phone || '—',
      enrollmentNumber: enr,
      cohortType: 'Alumni',
      department: normDept,
      rawDepartment: a.department,
      degreeType: a.degreeType || 'B.Tech',
      program: a.program || a.degreeType || 'B.Tech',
      graduationYear: a.graduationYear || a.batch || '—',
      status: a.verificationStatus || 'verified',
      hasDonated: Boolean(a.hasDonated),
      donationAmount: a.donationAmount || 0,
      avatar: user.avatar || '',
      currentCompany: a.currentCompany || '—',
      currentDesignation: a.currentDesignation || '—',
    });
  }

  // Format students
  for (const s of studentDocs) {
    const user: any = s.user || {};
    const normDept = normalizeDepartment(s.department);
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Student Member';
    const email = user.email || '';
    const enr = s.enrollmentNumber || '';

    // Search filter
    if (search) {
      const q = String(search).toLowerCase();
      const match =
        fullName.toLowerCase().includes(q) ||
        email.toLowerCase().includes(q) ||
        enr.toLowerCase().includes(q) ||
        normDept.toLowerCase().includes(q);
      if (!match) continue;
    }

    records.push({
      id: s._id,
      fullName,
      email,
      phone: user.phone || '—',
      enrollmentNumber: enr,
      cohortType: 'Student',
      department: normDept,
      rawDepartment: s.department,
      degreeType: s.degreeType || 'B.Tech',
      program: s.program || s.degreeType || 'B.Tech',
      graduationYear: s.batch ? `Batch ${s.batch} (Yr ${s.currentYear || 1})` : `Year ${s.currentYear || 1}`,
      status: 'Enrolled',
      hasDonated: false,
      donationAmount: 0,
      avatar: user.avatar || '',
      currentCompany: 'IITRAM',
      currentDesignation: `Student (Sem ${s.currentSemester || 1})`,
    });
  }

  // Sort: alumni by graduation year descending, then students
  records.sort((a, b) => {
    const numA = typeof a.graduationYear === 'number' ? a.graduationYear : 9999;
    const numB = typeof b.graduationYear === 'number' ? b.graduationYear : 9999;
    return numB - numA;
  });

  // Handle CSV export request
  if (exportCsv === 'true') {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="iitram_academic_cohort_report.csv"');

    const csvHeaders = [
      'Full Name',
      'Enrollment Number',
      'Cohort Type',
      'Degree',
      'Department',
      'Passing / Current Year',
      'Email',
      'Phone',
      'Current Designation / Company',
      'Verification / Enrollment Status',
    ];

    const csvRows = records.map((r) => [
      `"${r.fullName.replace(/"/g, '""')}"`,
      `"${r.enrollmentNumber}"`,
      `"${r.cohortType}"`,
      `"${r.degreeType}"`,
      `"${r.department}"`,
      `"${r.graduationYear}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      `"${r.currentDesignation} at ${r.currentCompany}"`,
      `"${r.status}"`,
    ]);

    const csvContent = [csvHeaders.join(','), ...csvRows.map((r) => r.join(','))].join('\n');
    return res.status(200).send(csvContent);
  }

  // Paginated JSON response
  const total = records.length;
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const paginated = records.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  res.json({
    success: true,
    data: paginated,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum) || 1,
    },
  });
}));

// ── Bulk Account Generation from CSV data ────────────────────────────────────
router.post('/bulk-create-users', asyncHandler(async (req: AuthRequest, res) => {
  const { users, defaultPassword: customDefaultPassword } = req.body as {
    defaultPassword?: string;
    users: Array<{
      fullName?: string;
      firstName?: string;
      lastName?: string;
      email: string;
      role?: 'student' | 'alumni' | 'faculty';
      enrollmentNumber?: string;
      department?: string;
      batch?: string | number;
      passingYear?: string | number;
      degreeType?: string;
      currentYear?: string | number;
      currentSemester?: string | number;
      temporaryPassword?: string;
      phone?: string;
      address?: string;
      permanentAddress?: string;
      dateOfIssue?: string;
    }>;
  };

  if (!Array.isArray(users) || users.length === 0) {
    return res.status(400).json({ success: false, message: 'No users provided.' });
  }
  if (users.length > 1000) {
    return res.status(400).json({ success: false, message: 'Max 1000 users per batch.' });
  }

  const bcrypt = await import('bcryptjs');
  const results: Array<{
    fullName: string;
    email: string;
    enrollmentNumber: string;
    role: string;
    department: string;
    degreeType: string;
    batch: string | number;
    passingYear: string | number;
    temporaryPassword: string;
    photoUrl?: string;
    status: 'created' | 'updated' | 'pending';
    reason?: string;
  }> = [];

  for (const u of users) {
    let fName = (u.firstName || '').trim();
    let lName = (u.lastName || '').trim();
    if (!fName && u.fullName) {
      const parts = u.fullName.trim().split(/\s+/);
      fName = parts[0] || 'Student';
      lName = parts.slice(1).join(' ') || (u.role === 'alumni' ? 'Alumni' : 'Member');
    }
    if (!fName) fName = 'Student';
    if (!lName) lName = 'Member';

    const email = (u.email || '').toLowerCase().trim();
    const enrollment = (u.enrollmentNumber || '').trim();
    const photoUrl = resolveConvocationPhotoUrl(enrollment);

    if (!email) {
      results.push({
        fullName: `${fName} ${lName}`.trim(),
        email: '',
        enrollmentNumber: enrollment,
        role: u.role || 'student',
        department: u.department || 'General Engineering',
        degreeType: u.degreeType || 'B.Tech',
        batch: u.batch || '',
        passingYear: u.passingYear || '',
        temporaryPassword: '',
        photoUrl,
        status: 'pending',
        reason: 'Email is required',
      });
      continue;
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      results.push({
        fullName: `${fName} ${lName}`.trim(),
        email,
        enrollmentNumber: enrollment,
        role: u.role || 'alumni',
        department: u.department || 'General Engineering',
        degreeType: u.degreeType || 'B.Tech',
        batch: u.batch || '',
        passingYear: u.passingYear || '',
        temporaryPassword: '',
        photoUrl,
        status: 'pending',
        reason: 'Email format is invalid',
      });
      continue;
    }

    if (!enrollment) {
      results.push({
        fullName: `${fName} ${lName}`.trim(),
        email,
        enrollmentNumber: '',
        role: u.role || 'alumni',
        department: u.department || 'General Engineering',
        degreeType: u.degreeType || 'B.Tech',
        batch: u.batch || '',
        passingYear: u.passingYear || '',
        temporaryPassword: '',
        photoUrl,
        status: 'pending',
        reason: 'Enrollment number is required for first-login password setup',
      });
      continue;
    }

    const assignedRole = u.role && ['student', 'alumni', 'faculty'].includes(u.role) ? u.role : 'alumni';
    const suppliedBatch = Number(u.batch) || 0;
    const suppliedPassingYear = Number(u.passingYear) || 0;
    if ((assignedRole === 'alumni' && (!suppliedBatch || !suppliedPassingYear)) || (assignedRole === 'student' && !suppliedBatch)) {
      results.push({
        fullName: `${fName} ${lName}`.trim(),
        email,
        enrollmentNumber: enrollment,
        role: assignedRole,
        department: u.department || 'General Engineering',
        degreeType: u.degreeType || 'B.Tech',
        batch: suppliedBatch || '',
        passingYear: suppliedPassingYear || '',
        temporaryPassword: '',
        photoUrl,
        status: 'pending',
        reason: assignedRole === 'alumni'
          ? 'Batch and passing year are required; no degree-duration estimate was applied'
          : 'Batch is required',
      });
      continue;
    }

    // Generate temporary password
    let plainPassword = (u.temporaryPassword || '').trim();
    if (!plainPassword) {
      if (customDefaultPassword && customDefaultPassword.trim().length >= 6) {
        plainPassword = customDefaultPassword.trim();
      } else {
        const suffix = enrollment ? enrollment.slice(-4) : String(Math.floor(1000 + Math.random() * 9000));
        const namePart = `${fName.charAt(0).toUpperCase()}${fName.slice(1, 8).toLowerCase()}`;
        plainPassword = `${namePart}@${suffix}`;
        if (plainPassword.length < 8) plainPassword = `${plainPassword}${suffix}`.slice(0, 12);
      }
    }

    const phone = (u.phone || '').trim();
    const address = (u.permanentAddress || u.address || '').trim();

    const hashedPassword = await bcrypt.default.hash(plainPassword, 10);
    const existingUser = await User.findOne({
      $or: [
        { email },
        ...(enrollment ? [{ enrollmentNumber: enrollment }] : []),
      ],
    });

    const normDept = normalizeDepartment(u.department || 'General Engineering');
    const validDegree = (u.degreeType && ['B.Tech', 'M.Tech', 'MBA', 'PhD', 'Diploma'].includes(u.degreeType))
      ? u.degreeType as any
      : 'B.Tech';
    const parsedBatch = suppliedBatch || '';
    const passingYear = suppliedPassingYear || '';
    const parsedYear = Number(u.currentYear) || 1;
    const parsedSem = Number(u.currentSemester) || parsedYear * 2;

    let userDoc: any;

    if (existingUser) {
      // Update existing user with credentials & details
      existingUser.firstName = fName;
      existingUser.lastName = lName;
      existingUser.password = hashedPassword;
      existingUser.role = assignedRole;
      existingUser.mustChangePassword = true;
      if (enrollment) existingUser.enrollmentNumber = enrollment;
      if (photoUrl) existingUser.avatar = photoUrl;
      if (phone) existingUser.phone = phone;
      if (address) existingUser.permanentAddress = address;
      existingUser.isEmailVerified = true;
      existingUser.isVerified = true;
      existingUser.verificationStatus = 'verified';
      await existingUser.save();
      userDoc = existingUser;

      results.push({
        fullName: `${fName} ${lName}`.trim(),
        email,
        enrollmentNumber: enrollment || userDoc.enrollmentNumber || '—',
        role: assignedRole,
        department: normDept,
        degreeType: validDegree,
        batch: parsedBatch,
        passingYear,
        temporaryPassword: plainPassword,
        photoUrl,
        status: 'updated',
      });
    } else {
      // Create fresh user
      userDoc = await User.create({
        firstName: fName,
        lastName: lName,
        email,
        password: hashedPassword,
        role: assignedRole,
        authProvider: 'local',
        isEmailVerified: true,
        isProfileComplete: false,
        isVerified: true,
        verificationStatus: 'verified',
        enrollmentNumber: enrollment || undefined,
        mustChangePassword: true,
        avatar: photoUrl || '',
        phone: phone || undefined,
        permanentAddress: address || '',
      });

      results.push({
        fullName: `${fName} ${lName}`.trim(),
        email,
        enrollmentNumber: enrollment || '—',
        role: assignedRole,
        department: normDept,
        degreeType: validDegree,
        batch: parsedBatch,
        passingYear,
        temporaryPassword: plainPassword,
        photoUrl,
        status: 'created',
      });
    }

    // Sync corresponding Student or Alumni profile
    if (assignedRole === 'student') {
      await Student.findOneAndUpdate(
        { user: userDoc._id },
        {
          $set: {
            user: userDoc._id,
            enrollmentNumber: enrollment || userDoc.enrollmentNumber,
            batch: parsedBatch,
            department: normDept,
            program: validDegree,
            degreeType: validDegree,
            currentYear: parsedYear,
            currentSemester: parsedSem,
            ...(suppliedPassingYear ? { graduationYear: suppliedPassingYear } : {}),
            isActive: true,
          },
        },
        { upsert: true }
      );
    } else if (assignedRole === 'alumni') {
      await Alumni.findOneAndUpdate(
        { user: userDoc._id },
        {
          $set: {
            user: userDoc._id,
            enrollmentNumber: enrollment || userDoc.enrollmentNumber,
            batch: parsedBatch,
            graduationYear: passingYear,
            department: normDept,
            program: validDegree,
            degreeType: validDegree,
            verificationStatus: 'verified',
            isVerified: true,
          },
        },
        { upsert: true }
      );
    }
  }

  const createdCount = results.filter((r) => r.status === 'created').length;
  const updatedCount = results.filter((r) => r.status === 'updated').length;
  const pendingCount = results.filter((r) => r.status === 'pending').length;

  res.json({
    success: true,
    message: `Account processing complete: ${createdCount} created, ${updatedCount} updated, ${pendingCount} pending.`,
    data: {
      results,
      createdCount,
      updatedCount,
      pendingCount,
      totalProcessed: results.length,
    },
  });
}));

// ── Download Sample CSV Template ─────────────────────────────────────────────
router.get('/sample-student-csv', (_req: AuthRequest, res) => {
  const sampleCsv = `Full Name,Enrollment Number,Email,Department,Degree,Batch,Phone,Address,Date of Issue,Current Year,Role
Aryan Patel,231010011001,aryan.patel@iitram.ac.in,Civil Engineering,B.Tech,2023,+91 98765 43210,"Ahmedabad, Gujarat - 380026",07/09/2026,2,student
Pooja Sharma,231020011002,pooja.sharma@iitram.ac.in,Electrical Engineering,B.Tech,2023,+91 98765 43211,"Ahmedabad, Gujarat - 380026",07/09/2026,2,student
Rohan Mehta,231030011003,rohan.mehta@iitram.ac.in,Mechanical Engineering,B.Tech,2023,+91 98765 43212,"Ahmedabad, Gujarat - 380026",07/09/2026,2,student
Sneha Joshi,231040011004,sneha.joshi@iitram.ac.in,Computer Science & Engineering,B.Tech,2023,+91 98765 43213,"Ahmedabad, Gujarat - 380026",07/09/2026,2,student
Karan Dave,211030011005,karan.dave@alumni.iitram.ac.in,Mechanical Engineering,B.Tech,2021,+91 98765 43214,"Ahmedabad, Gujarat - 380026",07/09/2026,4,alumni`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="student_onboarding_template.csv"');
  res.status(200).send(sampleCsv);
});

export default router;
