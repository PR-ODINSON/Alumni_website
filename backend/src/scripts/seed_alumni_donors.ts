import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Alumni from '../models/Alumni';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iitram-alumni';

async function seedDonorsInstant() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    const jsonPath = path.join(__dirname, '../../../alumni_donors_data.json');
    if (!fs.existsSync(jsonPath)) {
      console.error(`JSON file not found at ${jsonPath}`);
      process.exit(1);
    }

    const records: any[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    console.log(`Loaded ${records.length} donor records from JSON.`);

    console.log('Hashing passwords...');
    const defaultHash = await bcrypt.hash('Alumni@2026', 10);

    const userOps: any[] = [];
    const alumniOps: any[] = [];

    for (const rec of records) {
      const userId = new mongoose.Types.ObjectId();
      const pwdHash = rec.password ? await bcrypt.hash(rec.password, 6) : defaultHash;
      
      userOps.push({
        updateOne: {
          filter: {
            $or: [
              { email: rec.email.toLowerCase() },
              { enrollmentNumber: rec.enrollmentNumber }
            ]
          },
          update: {
            $setOnInsert: {
              _id: userId,
              firstName: rec.firstName,
              lastName: rec.lastName,
              email: rec.email.toLowerCase(),
              password: pwdHash,
              role: 'alumni',
              authProvider: 'local',
              isEmailVerified: true,
              isProfileComplete: true,
              isVerified: true,
              verificationStatus: 'verified',
            },
            $set: {
              enrollmentNumber: rec.enrollmentNumber,
              hasDonated: true,
              donationAmount: rec.donationAmount,
              donationDate: new Date(rec.receiptDate),
              donationPurpose: rec.purpose,
              avatar: rec.photoUrl || '/images/iitram-logo.png',
            }
          },
          upsert: true
        }
      });
    }

    console.log('Bulk writing Users to MongoDB...');
    const userResult = await User.bulkWrite(userOps);
    console.log(`User BulkWrite Done: Upserted=${userResult.upsertedCount}, Modified=${userResult.modifiedCount}`);

    console.log('Syncing Alumni profiles...');
    const allUsers = await User.find({ hasDonated: true }).lean();
    const userMapByEnr = new Map(allUsers.map(u => [u.enrollmentNumber, u._id]));

    for (const rec of records) {
      const uId = userMapByEnr.get(rec.enrollmentNumber);
      if (!uId) continue;

      alumniOps.push({
        updateOne: {
          filter: { user: uId },
          update: {
            $setOnInsert: {
              user: uId,
              batch: rec.graduationYear - 4,
              graduationYear: rec.graduationYear,
              department: rec.branch || 'Mechanical Engineering',
              program: rec.degreeType || 'B.Tech',
              degreeType: ['B.Tech', 'M.Tech', 'MBA', 'PhD', 'Diploma'].includes(rec.degreeType) ? rec.degreeType : 'B.Tech',
            },
            $set: {
              enrollmentNumber: rec.enrollmentNumber,
              hasDonated: true,
              donationAmount: rec.donationAmount,
              verificationStatus: 'verified',
            }
          },
          upsert: true
        }
      });
    }

    if (alumniOps.length > 0) {
      const alumniResult = await Alumni.bulkWrite(alumniOps);
      console.log(`Alumni BulkWrite Done: Upserted=${alumniResult.upsertedCount}, Modified=${alumniResult.modifiedCount}`);
    }

    // Ensure Hemanshu Tala has donation access
    const hemanshuUser = await User.findOne({
      $or: [
        { email: 'hemanshu.tala@iitram.ac.in' },
        { enrollmentNumber: '2310400011011' }
      ]
    });
    if (hemanshuUser) {
      hemanshuUser.hasDonated = true;
      hemanshuUser.enrollmentNumber = '2310400011011';
      hemanshuUser.donationAmount = 5000;
      await hemanshuUser.save();
      console.log('Updated Hemanshu Tala demo user with donation access.');
    }

    console.log('\n✅ SEEDING COMPLETED SUCCESSFULLY!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during instant seeding:', err);
    process.exit(1);
  }
}

seedDonorsInstant();
