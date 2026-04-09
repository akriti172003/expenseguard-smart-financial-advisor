const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const protect = require('../middleware/authMiddleware');

// Saare expenses mangwane ke liye
router.get('/', protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    // Sabse zaroori: Hamesha array bhejein, bhale hi wo khali [] ho
    res.json(expenses || []); 
  } catch (err) {
    res.status(500).json([]); // Error hone par bhi khali array bhejein taaki frontend na phate
  }
});

// Naya expense add karne ke liye
router.post('/', protect, async (req, res) => {
  try {
    const { title, amount, category } = req.body;
    const newExpense = new Expense({
      userId: req.user.id,
      title,
      amount,
      category
    });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(400).json({ error: "Failed to add expense" });
  }
});

module.exports = router;