const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/list', async (req, res) => {
  const { page = 1, limit = 10, username } = req.query;
  const offset = (page - 1) * limit;
  let where = '1=1';
  const params = [];
  if (username) { where += ' AND username LIKE ?'; params.push(`%${username}%`); }
  try {
    const [countRes] = await pool.query(`SELECT COUNT(*) as total FROM admin WHERE ${where}`, params);
    const [rows] = await pool.query(`SELECT * FROM admin WHERE ${where} ORDER BY id DESC LIMIT ? OFFSET ?`, [...params, Number(limit), offset]);
    res.json({ code: 0, data: { list: rows, total: countRes[0].total } });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.get('/info/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM admin WHERE id = ?', [req.params.id]);
    res.json({ code: 0, data: rows[0] || null });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.post('/add', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO admin (username, password, role) VALUES (?, ?, ?)', [username, password, role || '管理员']);
    res.json({ code: 0, data: { id: result.insertId } });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.put('/update/:id', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    await pool.query('UPDATE admin SET username=?, password=?, role=? WHERE id=?', [username, password, role, req.params.id]);
    res.json({ code: 0, msg: '修改成功' });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM admin WHERE id=?', [req.params.id]);
    res.json({ code: 0, msg: '删除成功' });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

module.exports = router;
