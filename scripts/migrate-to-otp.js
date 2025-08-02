const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// User schema for migration
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['admin', 'teacher', 'user'],
    default: 'user',
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String, // Old field
  emailVerificationOTP: String,   // New field
  emailVerificationExpires: Date,
  otpAttempts: {
    type: Number,
    default: 0,
  },
  otpLastAttempt: Date,
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
  joinedDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

// Migration function
const migrateToOTP = async () => {
  try {
    console.log('Starting migration to OTP-based verification...');
    
    // Find all users with old verification tokens
    const usersWithTokens = await User.find({
      emailVerificationToken: { $exists: true, $ne: null }
    });
    
    console.log(`Found ${usersWithTokens.length} users with old verification tokens`);
    
    for (const user of usersWithTokens) {
      // Clear old verification data
      await User.findByIdAndUpdate(user._id, {
        $unset: {
          emailVerificationToken: 1
        },
        $set: {
          emailVerificationOTP: null,
          otpAttempts: 0,
          otpLastAttempt: null
        }
      });
      
      console.log(`Migrated user: ${user.email}`);
    }
    
    console.log('Migration completed successfully!');
    console.log('\nNote: Users will need to request new OTP verification if they haven\'t verified their email yet.');
    
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
};

// Run migration if this script is executed directly
if (require.main === module) {
  // Load environment variables
  require('dotenv').config({ path: '.env.local' });
  
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI environment variable is required');
    process.exit(1);
  }
  
  connectDB().then(() => {
    migrateToOTP();
  });
}

module.exports = { migrateToOTP }; 