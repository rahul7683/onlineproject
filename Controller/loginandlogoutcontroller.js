const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Dummy users for demonstration (passwords should be hashed)
const users = [
  {
    username: 'user1',
    password: '$2a$10$g6yzfJFSFgk6v4Fodr0ZOeFQjR9g.wYy4ghm/4xKQlRfttq4daFfy', // password is 'password123'
  },
];

// Secret key for JWT signing
const secretKey = 'your-secret-key';

// Function to generate JWT token
const generateToken = (username) => {
  return jwt.sign({ username }, secretKey, { expiresIn: '1h' });
};

// **Login Controller**
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists
  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  // Compare the provided password with the stored hashed password
  bcrypt.compare(password, user.password, (err, isMatch) => {
    if (err) throw err;

    if (isMatch) {
      // If the password is correct, generate and return a JWT token
      const token = generateToken(user.username);
      return res.json({ token, message: 'Login successful' });
    } else {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
  });
});

// **Logout Controller**
app.post('/api/logout', (req, res) => {
  // On the client side, simply discard the JWT token (remove it from storage)
  // We can optionally invalidate tokens on the server, but typically, tokens are stateless.
  
  // For demonstration purposes, we'll just return a message.
  return res.json({ message: 'Logout successful, please remove the token from your client' });
});

// Middleware to protect routes (for checking JWT validity)
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }

    // Save the decoded token payload for use in the request (e.g., `req.user = decoded;`)
    req.username = decoded.username;
    next();
  });
};

// Protected route example (requires JWT)
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: `Welcome ${req.username}, you have access to this protected route.` });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});