const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- ✅ 1. MIDDLEWARES & CORS (Fixed for your Vercel Domains) ---
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://expenseguard-smart-financial-adviso-gamma.vercel.app",
  "https://expenseguard-smart-financial-adviso.vercel.app" // 👈 Added this to fix CORS error
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Isse aapko Render logs mein dikhega ki kaunsa URL block ho raha hai
      console.error(`🚫 CORS Blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS - Production Security Check'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
  next();
});

// --- ✅ 2. DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// --- ✅ 3. MODELS & CONTROLLERS ---
const User = require('./models/User'); 
const Expense = require('./models/Expense'); 
const protect = require('./middleware/authMiddleware');
const { getProfile } = require('./controllers/authController');

// --- ✅ 4. ADVANCED AI LOGIC (Analyze Finance) ---
app.get('/api/user/analyze-finance', protect, async (req, res, next) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    const user = await User.findById(req.user.id);
    
    if (!user) return res.status(404).json({ message: "User not found" });

    const totalSpent = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const income = user.monthlyIncome || 0;
    const burnRate = income > 0 ? (totalSpent / income) * 100 : 0;

    let analysis = {
      type: 'balanced',
      problem: 'Routine spending',
      strategy: 'Standard Saving',
      outcome: 'Stable',
      weeklySavings: 200
    };

    if (burnRate > 70) {
      analysis = {
        type: 'aggressive',
        problem: 'High Burn Rate',
        cause: `Spending ${Math.round(burnRate)}% of income`,
        strategy: 'Emergency Budgeting',
        outcome: 'High Impact',
        weeklySavings: 800
      };
    }

    res.json(analysis);
  } catch (err) {
    next(err); 
  }
});

// --- ✅ 5. API ROUTES ---

app.get('/', (req, res) => {
  res.status(200).json({ message: "ExpenseGuard API is running smoothly!" });
});

app.get('/api/user/profile', protect, getProfile);

app.patch('/api/user/profile', protect, async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
});

// Modular Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));

// --- ✅ 6. IMPROVED GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error("Backend Error Log:", err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: Object.values(err.errors).map(val => val.message).join(', ')
    });
  }

  if (err.name === 'UnauthorizedError' || err.message === 'Not authorized') {
    return res.status(401).json({ success: false, message: 'Invalid or Missing Token' });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || "An unexpected error occurred",
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// --- ✅ 7. START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is flying on port ${PORT}`);
});