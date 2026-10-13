import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User';
import Student from '../models/Student';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function createOrUpdateStudent() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGODB_URI missing');

  await mongoose.connect(mongoUri);

  const email = 'mranjana9094@gmail.com';
  const password = 'Hello@123';

  let user = await User.findOne({ email });
  if (!user) {
    user = new User({
      firstName: 'Ranjana',
      lastName: 'M',
      email,
      password,
      role: 'student',
      isEmailVerified: true,
      isVerified: true,
      verificationStatus: 'verified',
      isProfileComplete: true,
      isActive: true,
    });
  } else {
    user.password = password;
    user.role = 'student';
    user.isEmailVerified = true;
    user.isVerified = true;
    user.verificationStatus = 'verified';
    user.isProfileComplete = true;
    user.isActive = true;
  }

  await user.save();
  console.log('User mranjana9094@gmail.com saved successfully!');

  let student = await Student.findOne({ user: user._id });
  if (!student) {
    await Student.create({
      user: user._id,
      batch: 2024,
      department: 'Computer Engineering',
      program: 'Computer Engineering',
      degreeType: 'B.Tech',
      currentYear: 3,
      currentSemester: 5,
      graduationYear: 2026,
    });
    console.log('Student profile created.');
  }

  const passValid = await user.comparePassword(password);
  console.log('Student password validation (Hello@123):', passValid);

  process.exit(0);
}

createOrUpdateStudent().catch((err) => {
  console.error('Error creating student:', err);
  process.exit(1);
});
