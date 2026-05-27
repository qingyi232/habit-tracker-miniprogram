const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/list', async (req, res) => {
  const { page = 1, limit = 10, zhanghao, xingming } = req.query;
  const offset = (page - 1) * limit;
  let where = '1=1';
  const params = [];
  if (zhanghao) { where += ' AND zhanghao LIKE ?'; params.push(`%${zhanghao}%`); }
  if (xingming) { where += ' AND xingming LIKE ?'; params.push(`%${xingming}%`); }
  try {
    const [countRes] = await pool.query(`SELECT COUNT(*) as total FROM yonghu WHERE ${where}`, params);
    const [rows] = await pool.query(`SELECT * FROM yonghu WHERE ${where} ORDER BY id DESC LIMIT ? OFFSET ?`, [...params, Number(limit), offset]);
    res.json({ code: 0, data: { list: rows, total: countRes[0].total } });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.get('/info/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM yonghu WHERE id = ?', [req.params.id]);
    res.json({ code: 0, data: rows[0] || null });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.post('/add', async (req, res) => {
  const { zhanghao, mima, xingming, xingbie, nianling, shouji, youxiang, zhaopian } = req.body;
  try {
    const [exists] = await pool.query('SELECT id FROM yonghu WHERE zhanghao = ?', [zhanghao]);
    if (exists.length > 0) return res.json({ code: -1, msg: '账号已存在' });
    const [result] = await pool.query(
      'INSERT INTO yonghu (zhanghao, mima, xingming, xingbie, nianling, shouji, youxiang, zhaopian) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [zhanghao, mima, xingming, xingbie, nianling, shouji, youxiang, zhaopian]
    );
    res.json({ code: 0, data: { id: result.insertId } });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.put('/update/:id', async (req, res) => {
  const { zhanghao, mima, xingming, xingbie, nianling, shouji, youxiang, zhaopian } = req.body;
  try {
    await pool.query(
      'UPDATE yonghu SET zhanghao=?, mima=?, xingming=?, xingbie=?, nianling=?, shouji=?, youxiang=?, zhaopian=? WHERE id=?',
      [zhanghao, mima, xingming, xingbie, nianling, shouji, youxiang, zhaopian, req.params.id]
    );
    res.json({ code: 0, msg: '修改成功' });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM yonghu WHERE id=?', [req.params.id]);
    res.json({ code: 0, msg: '删除成功' });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.put('/updateJifen/:id', async (req, res) => {
  const { jifen } = req.body;
  try {
    await pool.query('UPDATE yonghu SET jifen = jifen + ? WHERE id = ?', [jifen, req.params.id]);
    res.json({ code: 0, msg: '积分更新成功' });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

module.exports = router;
