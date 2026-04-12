const db = require('../db');

const VALID_CATEGORIES = [
  'Food', 'Transport', 'Shopping', 'Health',
  'Entertainment', 'Utilities', 'Housing', 'Other'
];

const isValidDate = (date) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

const addExpense = async (userId, { description, amount, category, date, note }) => {
  if (!description || !amount || !category || !date)
    throw { status: 400, message: 'Required fields missing' };

  if (!isValidDate(date))
    throw { status: 400, message: 'Invalid date format. Use YYYY-MM-DD' };

  if (!VALID_CATEGORIES.includes(category))
    throw { status: 400, message: 'Invalid category' };

  const [result] = await db.query(
    'INSERT INTO expenses (user_id, description, amount, category, date, note) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, description, amount, category, date, note || null]
  );

  const [rows] = await db.query(
    'SELECT * FROM expenses WHERE id = ? AND is_deleted = 0',
    [result.insertId]
  );
  return rows[0];
};

const getExpenses = async (userId, { from, to, category, page = 1, limit = 20 }) => {
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  let whereClause = 'WHERE user_id = ? AND is_deleted = 0';
  const params = [userId];

  if (from) { whereClause += ' AND date >= ?'; params.push(from); }
  if (to) { whereClause += ' AND date <= ?'; params.push(to); }
  if (category && category !== 'All') { whereClause += ' AND category = ?'; params.push(category); }

  const [countResult] = await db.query(
    `SELECT COUNT(*) as total FROM expenses ${whereClause}`,
    params
  );
  const total = countResult[0].total;

  const [rows] = await db.query(
    `SELECT id, user_id, description, amount, category, 
   DATE_FORMAT(date, '%Y-%m-%d') as date,
   note, created_at, updated_at, is_deleted
   FROM expenses ${whereClause} 
   ORDER BY date DESC, created_at DESC LIMIT ? OFFSET ?`,
    [...params, limitNum, offset]
  );

  return {
    expenses: rows,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      total_pages: Math.ceil(total / limitNum),
      has_next: pageNum < Math.ceil(total / limitNum),
      has_prev: pageNum > 1
    }
  };
};

const editExpense = async (userId, expenseId, body) => {
  // check expense exists and belongs to user
  const [existing] = await db.query(
    'SELECT * FROM expenses WHERE id = ? AND user_id = ? AND is_deleted = 0',
    [expenseId, userId]
  );
  if (existing.length === 0)
    throw { status: 404, message: 'Expense not found' };

  const current = existing[0];

  // validate only if field is provided
  if (body.date !== undefined && !isValidDate(body.date))
    throw { status: 400, message: 'Invalid date format. Use YYYY-MM-DD' };

  if (body.category !== undefined && !VALID_CATEGORIES.includes(body.category))
    throw { status: 400, message: 'Invalid category' };

  if (body.amount !== undefined && (isNaN(body.amount) || body.amount <= 0))
    throw { status: 400, message: 'Invalid amount' };

  // merge — only update fields that are provided
  const updated = {
    description: body.description !== undefined ? body.description : current.description,
    amount: body.amount !== undefined ? body.amount : current.amount,
    category: body.category !== undefined ? body.category : current.category,
    date: body.date !== undefined ? body.date : current.date,
    note: body.note !== undefined ? body.note : current.note,
  };

  await db.query(
    `UPDATE expenses 
     SET description = ?, amount = ?, category = ?, date = ?, note = ?
     WHERE id = ? AND user_id = ? AND is_deleted = 0`,
    [updated.description, updated.amount, updated.category, updated.date, updated.note, expenseId, userId]
  );

  const [rows] = await db.query(
    'SELECT * FROM expenses WHERE id = ?',
    [expenseId]
  );
  return rows[0];
};

const deleteExpense = async (userId, expenseId) => {
  const [existing] = await db.query(
    'SELECT id FROM expenses WHERE id = ? AND user_id = ? AND is_deleted = 0',
    [expenseId, userId]
  );
  if (existing.length === 0)
    throw { status: 404, message: 'Expense not found' };

  // soft delete — just flip the flag
  await db.query(
    'UPDATE expenses SET is_deleted = 1 WHERE id = ? AND user_id = ?',
    [expenseId, userId]
  );

  return null;
};

module.exports = { addExpense, getExpenses, editExpense, deleteExpense };