const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const authController = require(`../controllers/authController`)

router.post('/login', authController.loginUser);
router.post('/user', authController.createUser);

module.exports = router;