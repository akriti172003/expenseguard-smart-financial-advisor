const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const protect = require('../middleware/authMiddleware');

// --- ✅ 1. GET ALL EXPENSES (Charts ke liye data yahan se jata hai) ---
router.get('/', protect, async (req, res, next) => {
  try {
    // Search by 'user' (kyunki humne model update kiya hai)
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    
    // Hamesha array bhejein taaki Frontend charts empty state handle kar sakein
    res.json(expenses || []); 
  } catch (err) {
    next(err); 
  }
});

// --- ✅ 2. ADD NEW EXPENSE ---
router.post('/', protect, async (req, res, next) => {
  try {
    const { title, amount, category, date } = req.body;

    // Strict Validation
    if (!title || amount === undefined || !category) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing fields: title, amount, and category are required." 
      });
    }

    const newExpense = new Expense({
      user: req.user.id, // 👈 'userId' ki jagah 'user'
      title: title.trim(),
      amount: Number(amount), // Frontend se string aaye toh bhi Number ban jaye
      category,
      date: date || Date.now()
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    next(err); 
  }
});

// --- ✅ 3. DELETE EXPENSE ---
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    // Authorization check
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: "Not authorized to delete this" });
    }

    await expense.deleteOne();
    res.json({ success: true, message: "Expense removed" });
  } catch (err) {
    next(err);
  }
});

// --- ✅ 4. CLEAR ALL (Frontend ke 'Clear' button ke liye) ---
router.delete('/clear/all', protect, async (req, res, next) => {
  try {
    await Expense.deleteMany({ user: req.user.id });
    res.json({ success: true, message: "All expenses cleared" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;