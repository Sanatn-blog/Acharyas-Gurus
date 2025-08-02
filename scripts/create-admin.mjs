import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import readline from 'readline';
import 'dotenv/config';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

// Helper function to get user input
const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
};

// Helper function to get password input (hidden)
const askPassword = (question) => {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    
    let password = '';
    process.stdin.on('data', (char) => {
      char = char.toString();
      
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004': // Ctrl+D
          process.stdin.setRawMode(false);
          process.stdin.pause();
          console.log('');
          resolve(password);
          break;
        case '\u0003': // Ctrl+C
          process.exit();
          break;
        case '\u007f': // Backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write('\b \b');
          }
          break;
        default:
          password += char;
          process.stdout.write('*');
          break;
      }
    });
  });
};

const createAdmin = async () => {
  try {
    await connectDB();

    console.log('🔐 Admin User Creation Tool');
    console.log('==========================\n');

    // Get admin details from user
    const name = await askQuestion('👤 Enter admin name: ');
    const email = await askQuestion('📧 Enter admin email: ');
    const password = await askPassword('🔒 Enter admin password: ');
    const title = await askQuestion('💼 Enter admin title (optional): ');
    const bio = await askQuestion('📝 Enter admin bio (optional): ');

    // Validation
    if (!name || !email || !password) {
      console.log('❌ Name, email, and password are required!');
      process.exit(1);
    }

    if (password.length < 6) {
      console.log('❌ Password must be at least 6 characters long!');
      process.exit(1);
    }

    // Check if admin already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      console.log(`❌ User with email ${email} already exists!`);
      process.exit(1);
    }

    // Hash password
    console.log('\n🔄 Creating admin user...');
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create admin user
    const admin = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'admin',
      isApproved: true,
      title: title.trim() || 'Administrator',
      bio: bio.trim() || 'System Administrator',
      specialties: ['System Administration', 'Content Management'],
    });

    console.log('✅ Admin user created successfully!\n');
    console.log('📋 Admin Details:');
    console.log('================');
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
    console.log(`Title: ${admin.title}`);
    console.log(`ID: ${admin._id}\n`);

    console.log('🎉 You can now login with these credentials at /auth/signin');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    rl.close();
    await mongoose.connection.close();
    console.log('\n📦 Database connection closed');
    process.exit(0);
  }
};

// Run the admin creation function
createAdmin();