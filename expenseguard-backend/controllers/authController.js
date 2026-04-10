const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function for JWT
const generateToken = (id) => {
  return jwt.sign(
    { id }, 
    process.env.JWT_SECRET || 'secret', 
    { expiresIn: '30d' } // Production ke liye thoda lamba expiry better hai
  );
};

// 1. Signup Function
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // User create
    const user = await User.create({ 
      name, 
      email: email.toLowerCase(), // Email consistency
      password: hashedPassword 
    });
    
    const token = generateToken(user._id);
    
    // ✅ Remove password and return
    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({ 
      success: true,
      token, 
      user: userData 
    });
  } catch (err) {
    next(err); // Global error handler ko bhej dein
  }
};

// 2. Login Function
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Email ko normalize karein
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id);
      
      const userData = user.toObject();
      delete userData.password;

      res.json({ 
        success: true,
        token, 
        user: userData 
      });
    } else {
      // Security tip: "Invalid credentials" hi likhein, "User not found" nahi
      res.status(401).json({ success: false, error: "Invalid email or password" });
    }
  } catch (err) {
    next(err);
  }
};

// 3. Get Profile Function
exports.getProfile = async (req, res, next) => {
  try {
    // req.user.id 'protect' middleware se aata hai
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    
    res.json(user);
  } catch (err) {
    next(err);
  }
};