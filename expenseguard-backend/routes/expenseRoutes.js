const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

// Import the controller functions
const { 
  getExpenses, 
  addExpense, 
  deleteExpense, 
  clearAllExpenses 
} = require('../controllers/expenseController');

// Global Middleware for this router - All routes below are protected
router.use(protect);

// Endpoint: /api/expenses
router.route('/')
  .get(getExpenses)  // Fetch all
  .post(addExpense); // Add new

// Endpoint: /api/expenses/clear/all (Specific route)
router.delete('/clear/all', clearAllExpenses);

// Endpoint: /api/expenses/:id (Dynamic ID route)
router.route('/:id')
  .delete(deleteExpense);

module.exports = router;