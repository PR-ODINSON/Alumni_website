import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  UserPlus,
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Users,
  KeyRound,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { adminApi } from '../../lib/api';
import toast from 'react-hot-toast';

interface ParsedAccount {
  fullName: string;
  email: string;
  enrollmentNumber: string;
  department: string;
  degreeType: string;
  batch: string | number;
  currentYear: string | number;
  role: 'student' | 'alumni';
  temporaryPassword?: string;
}

export default function AccountGeneratorTab() {
  const queryClient = useQueryClient();

  // Mode: 'file' | 'paste' | 'single'
  const [inputMode, setInputMode] = useState<'file' | 'paste' | 'single'>('file');
  const [rawCsvText, setRawCsvText] = useState('');
  const [defaultPassword, setDefaultPassword] = useState('Student@2026');
  const [defaultRole, setDefaultRole] = useState<'student' | 'alumni'>('student');
  const [defaultDept, setDefaultDept] = useState('Computer Science & Engineering');
  const [defaultDegree, setDefaultDegree] = useState('B.Tech');
  const [defaultBatch, setDefaultBatch] = useState('2023');

  // Single form state
  const [singleName, setSingleName] = useState('');
  const [singleEmail, setSingleEmail] = useState('');
  const [singleEnrollment, setSingleEnrollment] = useState('');
  const [singleDept, setSingleDept] = useState('Computer Science & Engineering');
  const [singleDegree, setSingleDegree] = useState('B.Tech');
  const [singleBatch, setSingleBatch] = useState('2023');
  const [singleRole, setSingleRole] = useState<'student' | 'alumni'>('student');
  const [singlePassword, setSinglePassword] = useState('');

  // Parsed accounts preview
  const [parsedAccounts, setParsedAccounts] = useState<ParsedAccount[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Result accounts after generation
  const [generationResults, setGenerationResults] = useState<any[] | null>(null);
  const [summaryMeta, setSummaryMeta] = useState<{ created: number; updated: number; skipped: number } | null>(null);

  // Parse CSV line into fields
  const parseCsvContent = (content: string) => {
    const lines = content
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      setParsedAccounts([]);
      return;
    }

    // Check if line 0 is a header
    const firstLineLower = lines[0].toLowerCase();
    const hasHeader =
      firstLineLower.includes('email') ||
      firstLineLower.includes('name') ||
      firstLineLower.includes('enrollment');

    const dataLines = hasHeader ? lines.slice(1) : lines;

    const list: ParsedAccount[] = [];

    dataLines.forEach((line) => {
      // Split by comma while respecting quotes
      const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((p) => p.replace(/^"|"$/g, '').trim());
      if (parts.length === 0 || !parts.some((p) => p.length > 0)) return;

      // Extract fields flexibly: Full Name, Enrollment No, Email, Department, Degree, Batch, Current Year, Role
      const fullName = parts[0] || 'Student Member';
      const enrollmentNumber = parts[1] || '';
      const email = parts[2] || (enrollmentNumber ? `${enrollmentNumber}@iitram.ac.in` : '');
      const department = parts[3] || defaultDept;
      const degreeType = parts[4] || defaultDegree;
      const batch = parts[5] || defaultBatch;
      const currentYear = parts[6] || 1;
      const role = (parts[7]?.toLowerCase() === 'alumni' ? 'alumni' : defaultRole) as 'student' | 'alumni';

      if (email || enrollmentNumber || fullName) {
        list.push({
          fullName,
          enrollmentNumber,
          email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@iitram.ac.in`,
          department,
          degreeType,
          batch,
          currentYear,
          role,
        });
      }
    });

    setParsedAccounts(list);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setRawCsvText(text);
      parseCsvContent(text);
      toast.success(`Loaded file: ${file.name}`);
    };
    reader.readAsText(file);
  };

  // Mutation for generating accounts
  const generateMutation = useMutation({
    mutationFn: (payload: { users: any[]; defaultPassword?: string }) =>
      adminApi.bulkCreateUsers(payload),
    onSuccess: (response) => {
      const { results, createdCount, updatedCount, skippedCount } = response.data?.data || {};
      setGenerationResults(results || []);
      setSummaryMeta({ created: createdCount || 0, updated: updatedCount || 0, skipped: skippedCount || 0 });
      toast.success(`Success! Created ${createdCount} accounts, updated ${updatedCount}.`);
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['admin-academic-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-academic-records'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Account generation failed.');
    },
  });

  // Trigger bulk generation
  const handleGenerateBulk = () => {
    if (parsedAccounts.length === 0) {
      toast.error('No valid accounts detected. Upload a CSV file or paste CSV rows first.');
      return;
    }

    generateMutation.mutate({
      users: parsedAccounts,
      defaultPassword,
    });
  };

  // Trigger single account generation
  const handleGenerateSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleName.trim() || !singleEmail.trim()) {
      toast.error('Name and Email are required.');
      return;
    }

    const payload = {
      users: [
        {
          fullName: singleName.trim(),
          email: singleEmail.trim().toLowerCase(),
          enrollmentNumber: singleEnrollment.trim(),
          department: singleDept,
          degreeType: singleDegree,
          batch: Number(singleBatch) || 2024,
          role: singleRole,
          temporaryPassword: singlePassword.trim() || defaultPassword,
        },
      ],
      defaultPassword,
    };

    generateMutation.mutate(payload);
  };

  // Download Sample CSV template
  const handleDownloadSampleTemplate = async () => {
    try {
      const res = await adminApi.downloadSampleStudentCsv();
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'student_onboarding_template.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Downloaded sample template.');
    } catch {
      toast.error('Failed to download template.');
    }
  };

  // Download Generated Credentials CSV
  const handleDownloadCredentialsCsv = () => {
    if (!generationResults || generationResults.length === 0) return;

    const headers = [
      'Full Name',
      'Enrollment Number',
      'Email / Username',
      'Temporary Password',
      'Role',
      'Department',
      'Degree',
      'Batch',
      'Status',
    ];

    const rows = generationResults.map((r) => [
      `"${r.fullName}"`,
      `"${r.enrollmentNumber}"`,
      `"${r.email}"`,
      `"${r.temporaryPassword}"`,
      `"${r.role}"`,
      `"${r.department}"`,
      `"${r.degreeType}"`,
      `"${r.batch}"`,
      `"${r.status}"`,
    ]);

    const csvString = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `iitram_student_credentials_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    toast.success('Credentials CSV downloaded! Ready to share with students.');
  };

  const copyPasswordToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    toast.success(`Copied password: ${text}`);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 text-slate-800 font-sans">
      {/* ── Top Header Banner ────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#001f54] text-xs font-bold mb-2">
            <KeyRound size={13} className="text-[#0169FC]" />
            Bulk Onboarding &amp; Credential Generator
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 tracking-tight">
            Student &amp; Alumni Account Generator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 max-w-2xl leading-relaxed">
            Generate student accounts in bulk from your Excel/CSV lists with secure temporary passwords. Students can log in at the portal, change their passwords, and complete their skills and projects.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleDownloadSampleTemplate}
            className="btn btn-outline btn-sm text-xs font-bold gap-1.5"
            title="Download CSV template format"
          >
            <Download size={13} />
            <span>Sample CSV Template</span>
          </button>
        </div>
      </div>

      {/* ── Mode Selection & Options Card ────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-5">
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold self-start">
            <button
              onClick={() => setInputMode('file')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                inputMode === 'file' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Upload CSV File
            </button>
            <button
              onClick={() => setInputMode('paste')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                inputMode === 'paste' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Paste CSV Text
            </button>
            <button
              onClick={() => setInputMode('single')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                inputMode === 'single' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Single Account Form
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-semibold">Default Password:</span>
            <input
              type="text"
              value={defaultPassword}
              onChange={(e) => setDefaultPassword(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-36"
              placeholder="Student@2026"
            />
          </div>
        </div>

        {/* MODE 1: File Upload */}
        {inputMode === 'file' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-8 text-center bg-slate-50/50 transition-colors">
              <Upload size={32} className="text-[#0169FC] mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">Select or drop student CSV file here</p>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                CSV columns: <span className="font-semibold text-slate-600">Full Name, Enrollment Number, Email, Department, Degree, Batch, Current Year</span>
              </p>
              <label className="btn btn-primary btn-sm mt-4 text-xs font-bold cursor-pointer inline-flex items-center gap-1.5">
                <FileSpreadsheet size={14} />
                <span>Choose File (.csv)</span>
                <input type="file" accept=".csv,text/csv" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>
        )}

        {/* MODE 2: Paste Raw CSV Text */}
        {inputMode === 'paste' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-600">Paste CSV Rows from Excel / Spreadsheet:</label>
              <span className="text-[11px] text-slate-400">Header row optional</span>
            </div>
            <textarea
              rows={6}
              value={rawCsvText}
              onChange={(e) => {
                setRawCsvText(e.target.value);
                parseCsvContent(e.target.value);
              }}
              placeholder={`Aryan Patel, 231010011001, aryan.patel@iitram.ac.in, Civil Engineering, B.Tech, 2023, 2, student\nPooja Sharma, 231020011002, pooja.sharma@iitram.ac.in, Electrical Engineering, B.Tech, 2023, 2, student\nRohan Mehta, 231030011003, rohan.mehta@iitram.ac.in, Mechanical Engineering, B.Tech, 2023, 2, student`}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        )}

        {/* MODE 3: Single Account Form */}
        {inputMode === 'single' && (
          <form onSubmit={handleGenerateSingle} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aryan Patel"
                  value={singleName}
                  onChange={(e) => setSingleName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. aryan.patel@iitram.ac.in"
                  value={singleEmail}
                  onChange={(e) => setSingleEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Enrollment Number</label>
                <input
                  type="text"
                  placeholder="e.g. 231010011001"
                  value={singleEnrollment}
                  onChange={(e) => setSingleEnrollment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Department / Branch</label>
                <select
                  value={singleDept}
                  onChange={(e) => setSingleDept(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Chemical Engineering">Chemical Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Degree Program</label>
                <select
                  value={singleDegree}
                  onChange={(e) => setSingleDegree(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="B.Tech">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="PhD">PhD</option>
                  <option value="Diploma">Diploma</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Batch / Role</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="2023"
                    value={singleBatch}
                    onChange={(e) => setSingleBatch(e.target.value)}
                    className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <select
                    value={singleRole}
                    onChange={(e) => setSingleRole(e.target.value as any)}
                    className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="student">Student</option>
                    <option value="alumni">Alumni</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Password will default to <span className="font-mono font-bold text-slate-600">{defaultPassword}</span> if blank.
              </span>
              <button
                type="submit"
                disabled={generateMutation.isPending}
                className="btn btn-primary btn-sm text-xs font-bold gap-1.5 shadow-xs"
              >
                {generateMutation.isPending ? <RefreshCw size={14} className="animate-spin" /> : <UserPlus size={14} />}
                <span>Create Student Account</span>
              </button>
            </div>
          </form>
        )}

        {/* ── Parsed Preview Table (for bulk modes) ─────────────────────── */}
        {inputMode !== 'single' && parsedAccounts.length > 0 && (
          <div className="mt-5 pt-5 border-t border-slate-100 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  Detected {parsedAccounts.length} student account{parsedAccounts.length === 1 ? '' : 's'} ready to generate
                </p>
                <p className="text-[11px] text-slate-400 font-medium">Review rows before executing account generation</p>
              </div>

              <button
                onClick={handleGenerateBulk}
                disabled={generateMutation.isPending}
                className="btn btn-primary btn-sm text-xs font-bold gap-1.5 shadow-xs self-start sm:self-auto"
              >
                {generateMutation.isPending ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={14} />
                )}
                <span>Generate All {parsedAccounts.length} Accounts</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-64">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px] sticky top-0 bg-slate-100">
                    <th className="px-3.5 py-2.5">Full Name</th>
                    <th className="px-3.5 py-2.5">Enrollment No</th>
                    <th className="px-3.5 py-2.5">Email</th>
                    <th className="px-3.5 py-2.5">Department</th>
                    <th className="px-3.5 py-2.5">Degree</th>
                    <th className="px-3.5 py-2.5">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parsedAccounts.slice(0, 50).map((acc, i) => (
                    <tr key={i} className="hover:bg-slate-50/70">
                      <td className="px-3.5 py-2 font-bold text-slate-800">{acc.fullName}</td>
                      <td className="px-3.5 py-2 font-mono text-[11px] text-slate-600">{acc.enrollmentNumber || '—'}</td>
                      <td className="px-3.5 py-2 text-slate-600 font-mono text-[11px]">{acc.email}</td>
                      <td className="px-3.5 py-2 font-medium text-slate-700">{acc.department}</td>
                      <td className="px-3.5 py-2 text-slate-600">{acc.degreeType}</td>
                      <td className="px-3.5 py-2">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold capitalize">
                          {acc.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsedAccounts.length > 50 && (
              <p className="text-[11px] text-slate-400 italic">Showing first 50 of {parsedAccounts.length} rows.</p>
            )}
          </div>
        )}
      </div>

      {/* ── Generated Results & Download Credentials Card ────────────────── */}
      {generationResults && generationResults.length > 0 && (
        <div className="bg-white border-2 border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-1 border border-emerald-200">
                <CheckCircle2 size={13} /> Generation Completed
              </div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Generated {generationResults.length} Accounts Successfully
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Created: <span className="font-bold text-emerald-700">{summaryMeta?.created ?? 0}</span> · Updated:{' '}
                <span className="font-bold text-blue-700">{summaryMeta?.updated ?? 0}</span> · Skipped:{' '}
                <span className="font-bold text-slate-500">{summaryMeta?.skipped ?? 0}</span>
              </p>
            </div>

            <button
              onClick={handleDownloadCredentialsCsv}
              className="btn btn-primary btn-sm text-xs font-bold gap-2 shadow-xs bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
            >
              <Download size={14} />
              <span>Download Credentials CSV (with Passwords)</span>
            </button>
          </div>

          <p className="text-xs text-slate-600 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 leading-relaxed font-medium">
            <span className="font-bold text-emerald-900 block mb-0.5">Distribution Instructions:</span>
            Download the credentials CSV file above and distribute the temporary passwords to students. When students sign in at{' '}
            <code className="bg-emerald-100/80 px-1.5 py-0.5 rounded text-emerald-900 font-bold">/login</code>, they can update their skills, career goals, resume, and set a new password.
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-72">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px] sticky top-0 bg-slate-100">
                  <th className="px-3.5 py-2.5">Full Name</th>
                  <th className="px-3.5 py-2.5">Enrollment No</th>
                  <th className="px-3.5 py-2.5">Email / Login ID</th>
                  <th className="px-3.5 py-2.5 bg-amber-50/70 text-amber-900">Temporary Password</th>
                  <th className="px-3.5 py-2.5">Role</th>
                  <th className="px-3.5 py-2.5">Department</th>
                  <th className="px-3.5 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {generationResults.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/70">
                    <td className="px-3.5 py-2 font-bold text-slate-900">{r.fullName}</td>
                    <td className="px-3.5 py-2 font-mono text-[11px] text-slate-700">{r.enrollmentNumber || '—'}</td>
                    <td className="px-3.5 py-2 font-mono text-[11px] text-slate-700">{r.email}</td>
                    <td className="px-3.5 py-2 bg-amber-50/40">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-extrabold text-amber-900 text-xs">{r.temporaryPassword}</span>
                        <button
                          onClick={() => copyPasswordToClipboard(r.temporaryPassword, i)}
                          className="p-1 text-slate-400 hover:text-amber-800 rounded transition-colors"
                          title="Copy temporary password"
                        >
                          {copiedIndex === i ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </td>
                    <td className="px-3.5 py-2 font-semibold capitalize text-slate-700">{r.role}</td>
                    <td className="px-3.5 py-2 text-slate-600">{r.department}</td>
                    <td className="px-3.5 py-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                          r.status === 'created'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
