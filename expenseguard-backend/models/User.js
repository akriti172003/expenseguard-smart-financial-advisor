const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  // ✅ Dashboard calculation ke liye ye fields mandatory hain
  monthlyIncome: { 
    type: Number, 
    default: 0 
  },
  savingsGoal: { 
    type: Number, 
    default: 0 
  },
  // Onboarding flow control karne ke liye
  onboarded: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true // Isse 'createdAt' aur 'updatedAt' automatic ban jayenge
});

// Model export
module.exports = mongoose.model('User', UserSchema);