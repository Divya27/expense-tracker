const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const verifyToken = require('../middleware/auth');

router.post('/', verifyToken, expenseController.addExpense);
router.get('/', verifyToken, expenseController.getExpenses);
router.put('/:id', verifyToken, expenseController.editExpense);
router.delete('/:id', verifyToken, expenseController.deleteExpense);

module.exports = router;