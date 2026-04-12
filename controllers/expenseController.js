const expenseService = require('../services/expenseService');

const addExpense = async (req, res) => {
  try {
    const result = await expenseService.addExpense(req.user.id, req.body);
    res.status(201).json({
      message: 'Expense added successfully',
      data: result
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Server error',
      data: null
    });
  }
};

const getExpenses = async (req, res) => {
  try {
    const result = await expenseService.getExpenses(req.user.id, req.query);
    res.json({
      message: 'Expenses fetched successfully',
      data: result
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Server error',
      data: null
    });
  }
};

const editExpense = async (req, res) => {
  try {
    const result = await expenseService.editExpense(req.user.id, req.params.id, req.body);
    res.json({
      message: 'Expense updated successfully',
      data: result
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Server error',
      data: null
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const result = await expenseService.deleteExpense(req.user.id, req.params.id);
    res.json({
      message: 'Expense deleted successfully',
      data: result
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Server error',
      data: null
    });
  }
};

module.exports = { addExpense, getExpenses, editExpense, deleteExpense };