const { z } = require('zod');

// Expense ke liye validation rules
const expenseSchema = z.object({
  title: z.string().min(3, "Title at least 3 chars long"),
  amount: z.number().positive("Amount must be positive"),
  category: z.string().nonempty("Category is required"),
  date: z.string().datetime().optional()
});

const validateExpense = (req, res, next) => {
  try {
    expenseSchema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ errors: err.errors });
  }
};

module.exports = { validateExpense };