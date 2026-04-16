const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      message: 'User created successfully',
      data: result
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Server error',
      data: null
    });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.json({
      message: 'Login successful',
      data: result
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Server error',
      data: null
    });
  }
};

const getMe = async (req, res) => {
  try {
    const result = await authService.getMe(req.user.id);
    res.json({
      message: 'User fetched successfully',
      data: result
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Server error',
      data: null
    });
  }
};

const logout = async (req, res) => {
  try {
    const result = await authService.logout(req.user.id);
    res.json({
      message: result.message,
      data: null
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Server error',
      data: null
    });
  }
};

module.exports = { register, login, getMe, logout };