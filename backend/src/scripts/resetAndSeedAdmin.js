/**
 * resetAndSeedAdmin.js
 * ──────────────────────────────────────────────────────────────────────────────
 * Wipes ALL users from the database and creates a single admin user.
 *
 * Admin credentials:
 *   Email:    admin@alumni.ac.in
 *   Password: admin123
 *   Role:     admin
 *   Status:   verified + email verified
 *
 * Usage (from project root):
 *   node backend/src/scripts/resetAndSeedAdmin.js
 * ──────────────────────────────────────────────────────────────────────────────
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iitram-alumni';

const RESET  = '\x1b[0m';
const BOLD   = '\x1b[1m';
const GREEN  = '\x1b[32m';
const RED    = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN   = '\x1b[36m';
const DIM    = '\x1b[2m';

async function main() {
  const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });

  console.log(`\n${BOLD}${CYAN}IITRAM Alumni — Database Reset & Admin Seed${RESET}`);
  console.log('─'.repeat(60));

  try {
    await client.connect();
    const dbName = new URL(MONGODB_URI).pathname.replace('/', '') || 'iitram-alumni';
    const db = client.db(dbName);

    // ── 1. Count and wipe all users ─────────────────────────────────────────
    const users   = db.collection('users');
    const alumni  = db.collection('alumni');
    const students= db.collection('students');

    const userCount = await users.countDocuments();
    console.log(`\n${YELLOW}⚠  Found ${userCount} user(s). Deleting all...${RESET}`);

    const deleteResult = await users.deleteMany({});
    await alumni.deleteMany({});
    await students.deleteMany({});

    console.log(`${GREEN}✓  Deleted ${deleteResult.deletedCount} user record(s) from users collection.${RESET}`);
    console.log(`${GREEN}✓  Cleared alumni and students collections.${RESET}`);

    // ── 2. Hash the admin password ──────────────────────────────────────────
    const passwordHash = await bcrypt.hash('admin123', 12);

    // ── 3. Create the admin document ────────────────────────────────────────
    const now = new Date();
    const adminDoc = {
      firstName: 'Admin',
      lastName:  'IITRAM',
      email:     'admin@alumni.ac.in',
      password:  passwordHash,
      role:      'admin',
      authProvider: 'local',

      // Email verification — pre-verified
      isEmailVerified: true,

      // Verification — verified immediately
      verificationStatus: 'verified',
      isVerified: true,
      verificationDocuments: [],
      verificationHistory: [{
        status: 'verified',
        notes: 'Seeded as system administrator.',
        updatedAt: now,
      }],

      // Profile
      avatar:           '',
      coverImage:       '',
      bio:              'Platform administrator for IITRAM Alumni Portal.',
      phone:            '',
      location:         { city: 'Ahmedabad', state: 'Gujarat', country: 'India' },
      socialLinks:      { linkedin: '', twitter: '', github: '', website: '', instagram: '' },
      isProfileComplete: true,
      isActive:          true,
      isBanned:          false,

      // Mentorship
      mentorStatus: 'inactive',

      // Privacy
      privacySettings: {
        email:       'college',
        phone:       'connections',
        company:     'public',
        linkedin:    'public',
        resume:      'connections',
        socialLinks: 'college',
      },

      // Notifications
      notificationPreferences: {
        email:              true,
        push:               true,
        connectionRequests: true,
        messages:           true,
        jobAlerts:          false,
        eventReminders:     true,
        mentorshipUpdates:  false,
      },

      loginCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    const insertResult = await users.insertOne(adminDoc);

    console.log(`\n${GREEN}${BOLD}✅ Admin user created successfully!${RESET}`);
    console.log(`\n  ${DIM}MongoDB _id:${RESET}  ${insertResult.insertedId}`);
    console.log(`  ${BOLD}Email:${RESET}        admin@alumni.ac.in`);
    console.log(`  ${BOLD}Password:${RESET}     admin123`);
    console.log(`  ${BOLD}Role:${RESET}         admin`);
    console.log(`  ${BOLD}Verified:${RESET}     ✅ Yes`);
    console.log(`\n${DIM}You can now log in at /login with these credentials.${RESET}\n`);

  } catch (err) {
    console.error(`\n${RED}❌ Error:${RESET}`, err.message);
    console.error(err.stack);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
