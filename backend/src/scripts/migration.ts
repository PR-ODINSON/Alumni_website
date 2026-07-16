import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/database';
import User from '../models/User';
import Job from '../models/Job';
import Event from '../models/Event';
import SuccessStory from '../models/SuccessStory';
import ResearchProject from '../models/ResearchProject';

const runMigration = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully.');

    // 1. Migrate Users
    console.log('Migrating Users...');
    const users = await User.find({
      $or: [
        { verificationStatus: { $exists: false } },
        { privacySettings: { $exists: false } },
      ],
    });
    console.log(`Found ${users.length} users to migrate.`);
    let userCount = 0;
    for (const user of users) {
      if (!user.verificationStatus) {
        user.verificationStatus = user.isVerified ? 'verified' : 'pending';
      }
      if (!user.privacySettings) {
        user.privacySettings = {
          email: 'connections',
          phone: 'connections',
          company: 'public',
          linkedin: 'public',
          resume: 'connections',
          socialLinks: 'public',
        };
      }
      await user.save();
      userCount++;
    }
    console.log(`Migrated ${userCount} users.`);

    // 2. Migrate Jobs
    console.log('Migrating Jobs...');
    const jobs = await Job.find({ status: { $exists: false } });
    let jobCount = 0;
    for (const job of jobs) {
      job.status = job.isActive ? 'published' : 'archived';
      await job.save();
      jobCount++;
    }
    console.log(`Migrated ${jobCount} jobs.`);

    // 3. Migrate Events
    console.log('Migrating Events...');
    const events = await Event.find({ status: { $exists: false } });
    let eventCount = 0;
    for (const event of events) {
      event.status = 'published';
      await event.save();
      eventCount++;
    }
    console.log(`Migrated ${eventCount} events.`);

    // 4. Migrate Stories
    console.log('Migrating Success Stories...');
    const stories = await SuccessStory.find({ status: { $exists: false } });
    let storyCount = 0;
    for (const story of stories) {
      story.status = story.isPublished ? 'published' : 'draft';
      await story.save();
      storyCount++;
    }
    console.log(`Migrated ${storyCount} success stories.`);

    // 5. Migrate Research
    console.log('Migrating Research Projects...');
    const research = await ResearchProject.find({ status: { $exists: false } });
    let researchCount = 0;
    for (const r of research) {
      r.status = 'open';
      await r.save();
      researchCount++;
    }
    console.log(`Migrated ${researchCount} research projects.`);

    console.log('Migration finished successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

runMigration();
