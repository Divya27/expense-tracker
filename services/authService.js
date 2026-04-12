const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const register = async ({ first_name, last_name, email, password }) => {
  if (!first_name || !last_name || !email || !password)
    throw { status: 400, message: 'All fields are required' };

  const [existing] = await db.query(
    'SELECT id FROM users WHERE email = ?', [email]
  );
  if (existing.length > 0)
    throw { status: 400, message: 'Email already registered' };

  const hashed = await bcrypt.hash(password, 10);
  await db.query(
    'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
    [first_name, last_name, email, hashed]
  );

  return { message: 'User created successfully' };
};

const login = async ({ email, password }) => {
  if (!email || !password)
    throw { status: 400, message: 'Email and password required' };

  const [rows] = await db.query(
    'SELECT * FROM users WHERE email = ?', [email]
  );
  if (rows.length === 0)
    throw { status: 400, message: 'Invalid email or password' };

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match)
    throw { status: 400, message: 'Invalid email or password' };

  const token = jwt.sign(
    { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    }
  };
};

const getMe = async (userId) => {
  const [rows] = await db.query(
    'SELECT id, first_name, last_name, email, created_at FROM users WHERE id = ?',
    [userId]
  );
  if (rows.length === 0)
    throw { status: 404, message: 'User not found' };

  return rows[0];
};

const logout = async (userId) => {
  // JWT is stateless — client drops the token
  // Future: add token to blacklist table here
  return { message: 'Logged out successfully' };
};


module.exports = { register, login, getMe, logout };