const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- ✅ 1. MIDDLEWARES & CORS CONFIG ---
// Deployment ke waqt allowedOrigins mein apna Vercel URL zaroori add karein
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  // "https://your-frontend-name.vercel.app" // 👈 Apna Vercel URL yahan paste karein
];

app.use(cors({
  origin: function (origin, callback) {
    // Postman ya mobile apps ke liye (!origin) check zaroori hai
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS - Production Security Check'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"]
}));

app.use(express.json());

// Request Logger (Development ke waqt help karega)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
  next();
});

// --- ✅ 2. DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // Agar DB connect na ho toh server band kar dein
  });

// --- ✅ 3. MODELS & CONTROLLERS ---
const User = require('./models/User');
const protect = require('./middleware/authMiddleware');
const { getProfile } = require('./controllers/authController');

// --- ✅ 4. API ROUTES ---

// Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({ message: "ExpenseGuard API is running smoothly!" });
});

// User Profile Routes
app.get('/api/user/profile', protect, getProfile);

app.patch('/api/user/profile', protect, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).json({ error: "Failed to update profile data" });
  }
});

// External Route Files
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));

// --- ✅ 5. GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// --- ✅ 6. START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is flying on port ${PORT}`);
  console.log(`👉 API Base: http://localhost:${PORT}/api`);
});