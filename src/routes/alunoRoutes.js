const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/alunos', verifyToken, alunoController.listarAlunos);

module.exports = router;