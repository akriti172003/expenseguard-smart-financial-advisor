const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  // ✅ Linked to the User model for multi-user support
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'User ID is required to link the expense'] 
  },
  
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true, // Extra spaces remove kar dega
    maxlength: [50, 'Title cannot be more than 50 characters']
  },
  
  amount: { 
    type: Number, 
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative'] // Negative expenses allow nahi honge
  },
  
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    default: 'General',
    trim: true
  },
  
  date: { 
    type: Date, 
    default: Date.now 
  }
}, {
  // Isse 'createdAt' aur 'updatedAt' fields automatically add ho jayengi
  timestamps: true 
});

module.exports = mongoose.model('Expense', ExpenseSchema);