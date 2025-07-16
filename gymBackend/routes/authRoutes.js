// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  login,
  getMe
} = require('../controllers/authController');

const authenticate = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', login);
router.get('/me', authenticate, getMe);

module.exports = router;



// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');
// const authenticate = require('../middleware/authMiddleware');

// // Public routes
// router.post('/register', authController.registerOrUpdateUser);

// // Protected routes
// router.get('/me', authenticate, authController.getCurrentUser);

// module.exports = router;