const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.post('/login', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    if (role === '管理员') {
      const [rows] = await pool.query('SELECT * FROM admin WHERE username = ? AND password = ?', [username, password]);
      if (rows.length > 0) {
        const user = rows[0];
        return res.json({ code: 0, data: { id: user.id, username: user.username, role: user.role, token: 'admin-token-' + user.id } });
      }
    } else {
      const [rows] = await pool.query('SELECT * FROM yonghu WHERE zhanghao = ? AND mima = ?', [username, password]);
      if (rows.length > 0) {
        const user = rows[0];
        return res.json({ code: 0, data: { id: user.id, zhanghao: user.zhanghao, xingming: user.xingming, role: '用户', token: 'user-token-' + user.id } });
      }
    }
    res.json({ code: -1, msg: '账号或密码错误' });
  } catch (err) {
    res.json({ code: -1, msg: err.message });
  }
});

router.post('/register', async (req, res) => {
  const { zhanghao, mima, xingming } = req.body;
  try {
    const [exists] = await pool.query('SELECT id FROM yonghu WHERE zhanghao = ?', [zhanghao]);
    if (exists.length > 0) return res.json({ code: -1, msg: '账号已存在' });
    const [result] = await pool.query('INSERT INTO yonghu (zhanghao, mima, xingming) VALUES (?, ?, ?)', [zhanghao, mima, xingming]);
    res.json({ code: 0, data: { id: result.insertId }, msg: '注册成功' });
  } catch (err) {
    res.json({ code: -1, msg: err.message });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, xingming, zhaopian, jifen FROM yonghu ORDER BY jifen DESC LIMIT 20');
    res.json({ code: 0, data: rows });
  } catch (err) {
    res.json({ code: -1, msg: err.message });
  }
});

module.exports = router;
