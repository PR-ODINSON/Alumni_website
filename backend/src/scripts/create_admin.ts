import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function createAdmin() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGODB_URI missing');

  await mongoose.connect(mongoUri);

  let admin = await User.findOne({ email: 'admin@gmail.com' });
  if (!admin) {
    admin = new User({
      firstName: 'Admin',
      lastName: 'System',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'admin',
      isEmailVerified: true,
      isVerified: true,
      verificationStatus: 'verified',
      isProfileComplete: true,
      isActive: true,
    });
  } else {
    admin.password = 'admin123';
    admin.role = 'admin';
    admin.isEmailVerified = true;
    admin.isVerified = true;
    admin.verificationStatus = 'verified';
    admin.isProfileComplete = true;
    admin.isActive = true;
  }

  await admin.save();
  console.log('Successfully created/updated admin account admin@gmail.com');

  const checkPass = await admin.comparePassword('admin123');
  console.log('Password validation match (admin123):', checkPass);

  process.exit(0);
}

createAdmin().catch((err) => {
  console.error('Error creating admin:', err);
  process.exit(1);
});
