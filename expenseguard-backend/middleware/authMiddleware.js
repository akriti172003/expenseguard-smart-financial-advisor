const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Get token after 'Bearer'
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // User ID request object mein daal di
      next();
    } catch (error) {
      res.status(401).json({ error: 'Token is not valid' });
    }
  }

  if (!token) {
    res.status(401).json({ error: 'No token, access denied' });
  }
};

module.exports = protect;