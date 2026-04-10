const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const protect = require('../middleware/authMiddleware');

// --- ✅ 1. GET ALL EXPENSES ---
router.get('/', protect, async (req, res, next) => {
  try {
    // Note: 'user' field use karein (jo aapke model mein defined hai)
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    
    // Hamesha array bhejein
    res.json(expenses || []); 
  } catch (err) {
    next(err); // server.js ke global handler ko bhej dein
  }
});

// --- ✅ 2. ADD NEW EXPENSE ---
router.post('/', protect, async (req, res, next) => {
  try {
    const { title, amount, category, date } = req.body;

    // Basic Validation check
    if (!title || !amount || !category) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide title, amount, and category" 
      });
    }

    const newExpense = new Expense({
      user: req.user.id, // 👈 'userId' ki jagah 'user' (as per your server.js logic)
      title: title.trim(),
      amount: Number(amount), // Ensure it's a number
      category,
      date: date || Date.now()
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    // "Failed to add expense" ki jagah asli error next(err) se bhejein
    next(err); 
  }
});

// --- ✅ 3. DELETE EXPENSE (Optional but Recommended) ---
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    // Check karein ki user apna hi expense delete kar raha hai
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await expense.deleteOne();
    res.json({ message: "Expense removed" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;