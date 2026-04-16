const Expense = require('../models/Expense');

// @desc    Get all expenses
// @route   GET /api/expenses
exports.getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses || []);
  } catch (err) {
    next(err);
  }
};

// @desc    Add new expense + Anomaly Detection Logic
// @route   POST /api/expenses
exports.addExpense = async (req, res, next) => {
  try {
    const { title, amount, category, date } = req.body;

    if (!title || amount === undefined || !category) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    // --- 🚀 BUSINESS LOGIC: ANOMALY DETECTION ---
    // Calculate average of last 5 expenses to see if this one is a "Spike"
    const previousExpenses = await Expense.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(5);

    let isAnomaly = false;
    if (previousExpenses.length > 0) {
      const avg = previousExpenses.reduce((sum, exp) => sum + exp.amount, 0) / previousExpenses.length;
      if (amount > avg * 3) { 
        isAnomaly = true; // Flags if current expense is 3x higher than average
      }
    }

    const newExpense = new Expense({
      user: req.user.id,
      title: title.trim(),
      amount: Number(amount),
      category,
      date: date || Date.now(),
      isAnomaly // Storing this helps the frontend show a "Warning" badge
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ success: false, message: "Not found" });

    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    await expense.deleteOne();
    res.json({ success: true, message: "Expense removed" });
  } catch (err) {
    next(err);
  }
};

// @desc    Clear all expenses
// @route   DELETE /api/expenses/clear/all
exports.clearAllExpenses = async (req, res, next) => {
  try {
    await Expense.deleteMany({ user: req.user.id });
    res.json({ success: true, message: "All expenses cleared" });
  } catch (err) {
    next(err);
  }
};