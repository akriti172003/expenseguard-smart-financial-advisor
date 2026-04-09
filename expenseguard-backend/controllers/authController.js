const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Signup Function
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // User create (Schema defaults like monthlyIncome: 0 will apply here)
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword 
    });
    
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '1d' }
    );
    
    // ✅ Convert to object and remove password
    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({ 
      token, 
      user: userData 
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(400).json({ error: "Invalid data provided" });
  }
};

// 2. Login Function
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user._id }, 
        process.env.JWT_SECRET || 'secret', 
        { expiresIn: '1d' }
      );
      
      // ✅ Pure user details (Income, Goal, Onboarded status) bhejna zaroori hai
      const userData = user.toObject();
      delete userData.password;

      res.json({ 
        token, 
        user: userData 
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 3. Get Profile Function
exports.getProfile = async (req, res) => {
  try {
    // req.user.id 'protect' middleware se aata hai
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("GetProfile Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};