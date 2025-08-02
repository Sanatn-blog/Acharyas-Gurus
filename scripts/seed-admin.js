import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/arya-samaj');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// User Schema (matching the existing model)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'teacher', 'user'], default: 'user' },
  isApproved: { type: Boolean, default: false },
  profileImage: String,
  bio: String,
  title: String,
  specialties: [String],
  yearsOfExperience: Number,
  contactInfo: {
    phone: String,
    website: String,
  },
  socialMedia: {
    twitter: String,
    instagram: String,
    youtube: String,
  },
  joinedDate: { type: Date, default: Date.now },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Admin user data
const adminUsers = [
  {
    name: 'System Admin',
    email: 'admin@aryasamaj.org',
    password: 'admin123456', // Will be hashed
    role: 'admin',
    isApproved: true,
    title: 'System Administrator',
    bio: 'System administrator for Acharyas-Gurus platform',
    specialties: ['System Administration', 'Content Management'],
  },
  {
    name: 'Super Admin',
    email: 'superadmin@aryasamaj.org',
    password: 'superadmin123456', // Will be hashed
    role: 'admin',
    isApproved: true,
    title: 'Super Administrator',
    bio: 'Super administrator with full system access',
    specialties: ['Full System Access', 'User Management'],
  }
];

const seedAdmins = async () => {
  try {
    await connectDB();

    console.log('🌱 Starting admin user seeding...');

    for (const adminData of adminUsers) {
      // Check if admin already exists
      const existingAdmin = await User.findOne({ email: adminData.email });
      
      if (existingAdmin) {
        console.log(`⚠️  Admin with email ${adminData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(adminData.password, 12);
      
      // Create admin user
      const admin = await User.create({
        ...adminData,
        password: hashedPassword,
      });

      console.log(`✅ Admin user created successfully:`);
      console.log(`   Name: ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   ID: ${admin._id}`);
      console.log('');
    }

    console.log('🎉 Admin seeding completed!');
    console.log('');
    console.log('📝 Admin Login Credentials:');
    console.log('==========================');
    adminUsers.forEach((admin, index) => {
      console.log(`Admin ${index + 1}:`);
      console.log(`  Email: ${admin.email}`);
      console.log(`  Password: ${admin.password}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error seeding admin users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📦 Database connection closed');
    process.exit(0);
  }
};

// Run the seeding function
seedAdmins();