import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Import Models
import User from '../models/User';
import Alumni from '../models/Alumni';
import Post from '../models/Post';
import Event from '../models/Event';
import SuccessStory from '../models/SuccessStory';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in .env');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected successfully!');

    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Alumni.deleteMany({}),
      Post.deleteMany({}),
      Event.deleteMany({}),
      SuccessStory.deleteMany({})
    ]);

    // Create Users
    console.log('Seeding Users...');
    const user1 = new User({
      firstName: 'Aarav',
      lastName: 'Patel',
      email: 'aarav.patel@example.com',
      password: 'password123',
      role: 'alumni',
      isVerified: true,
      isEmailVerified: true,
      isProfileComplete: true,
      isActive: true,
      avatar: 'https://ui-avatars.com/api/?name=Aarav+Patel&background=3b1bf2&color=fff'
    });
    await user1.save();

    const user2 = new User({
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.sharma@example.com',
      password: 'password123',
      role: 'alumni',
      isVerified: true,
      isEmailVerified: true,
      isProfileComplete: true,
      isActive: true,
      avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=14b8a6&color=fff'
    });
    await user2.save();

    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@iitram.ac.in',
      password: 'adminpassword',
      role: 'admin',
      isVerified: true,
      isEmailVerified: true,
      isProfileComplete: true,
      isActive: true
    });
    await adminUser.save();

    const alumniUser = new User({
      firstName: 'Alumni',
      lastName: 'Test',
      email: 'alumni@iitram.ac.in',
      password: 'alumnipassword',
      role: 'alumni',
      isVerified: true,
      isEmailVerified: true,
      isProfileComplete: true,
      isActive: true,
      avatar: 'https://ui-avatars.com/api/?name=Alumni+Test&background=3b1bf2&color=fff'
    });
    await alumniUser.save();

    // Create Alumni Profiles
    console.log('Seeding Alumni Profiles...');
    await Alumni.create({
      user: user1._id,
      batch: 2019,
      graduationYear: 2019,
      department: 'Computer Engineering',
      program: 'B.Tech',
      degreeType: 'B.Tech',
      currentCompany: 'Google',
      currentDesignation: 'Senior Software Engineer',
      currentIndustry: 'Technology',
      employmentStatus: 'employed',
      isMentor: true,
      mentorAreas: ['Software Engineering', 'Career Guidance', 'System Design'],
      mentorAvailability: 'available',
      verificationStatus: 'verified',
      skills: ['React', 'Node.js', 'System Design']
    });

    await Alumni.create({
      user: user2._id,
      batch: 2020,
      graduationYear: 2020,
      department: 'Electrical Engineering',
      program: 'B.Tech',
      degreeType: 'B.Tech',
      currentCompany: 'Tesla',
      currentDesignation: 'Hardware Engineer',
      currentIndustry: 'Automotive',
      employmentStatus: 'employed',
      isMentor: true,
      mentorAreas: ['Hardware Design', 'Embedded Systems'],
      mentorAvailability: 'available',
      verificationStatus: 'verified',
      skills: ['Embedded C', 'IoT', 'Hardware Design']
    });

    await Alumni.create({
      user: alumniUser._id,
      batch: 2021,
      graduationYear: 2021,
      department: 'Civil Engineering',
      program: 'B.Tech',
      degreeType: 'B.Tech',
      currentCompany: 'L&T',
      currentDesignation: 'Civil Engineer',
      currentIndustry: 'Construction',
      employmentStatus: 'employed',
      isMentor: false,
      mentorAreas: [],
      mentorAvailability: 'unavailable',
      verificationStatus: 'verified',
      skills: ['AutoCAD', 'Structural Analysis']
    });

    // Create Posts
    console.log('Seeding Posts...');
    await Post.create({
      author: user1._id,
      content: 'Just launched a new open-source project! I am so excited to share it with the IITRAM community. Let me know your thoughts!',
      postType: 'update',
      likes: [user2._id],
      comments: []
    });

    await Post.create({
      author: user2._id,
      content: 'Happy to announce that I joined Tesla as a Hardware Engineer today! Thanks to all my professors and mentors at IITRAM for the guidance.',
      postType: 'achievement',
      likes: [user1._id, adminUser._id],
      comments: []
    });

    // Create Events
    console.log('Seeding Events...');
    await Event.create({
      title: 'Annual Alumni Meet 2026',
      description: 'Join us for the biggest alumni gathering of the year. Connect with old friends, network with peers, and relive the memories.',
      shortDescription: 'The biggest networking and reunion event for IITRAM alumni this year.',
      eventType: 'reunion',
      startDate: new Date(Date.now() + 86400000 * 15), // 15 days from now
      endDate: new Date(Date.now() + 86400000 * 16),
      isVirtual: false,
      isFree: true,
      city: 'Ahmedabad',
      country: 'India',
      registeredCount: 150,
      isFeatured: true,
      organizer: adminUser._id,
      coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    });

    await Event.create({
      title: 'Tech Talk: Future of AI',
      description: 'An insightful webinar on the future of Artificial Intelligence and its implications on the tech industry.',
      shortDescription: 'Webinar on AI by industry experts.',
      eventType: 'webinar',
      startDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
      endDate: new Date(Date.now() + 86400000 * 5 + 3600000), // +1 hour
      isVirtual: true,
      isFree: true,
      registeredCount: 300,
      isFeatured: false,
      organizer: adminUser._id
    });

    // Create Success Stories
    console.log('Seeding Success Stories...');
    await SuccessStory.create({
      alumni: user1._id,
      title: 'From IITRAM to Silicon Valley: My Journey to Google',
      subtitle: 'Aarav Patel shares his experience on cracking the toughest tech interviews.',
      content: 'It all started back in 2015 when I joined IITRAM...',
      category: 'career',
      isFeatured: true,
      publishedAt: new Date(),
      views: 1250,
      likes: [user2._id],
      quote: "Believe in yourself and keep grinding. IITRAM gave me the right foundation, but self-learning took me to the next level.",
      coverImage: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    });

    await SuccessStory.create({
      alumni: user2._id,
      title: 'Innovating at Tesla: A Hardware Engineer\'s Perspective',
      subtitle: 'Priya Sharma talks about her experience working on cutting edge EV technology.',
      content: 'Working at Tesla is challenging but incredibly rewarding...',
      category: 'career',
      isFeatured: false,
      publishedAt: new Date(Date.now() - 86400000 * 10), // 10 days ago
      views: 890,
      likes: [user1._id],
      quote: "Never stop learning. The engineering principles taught at IITRAM are more relevant in the industry than you think."
    });

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
