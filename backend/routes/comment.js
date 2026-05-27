const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/list', async (req, res) => {
  const { liuyanid, page = 1, limit = 20 } = req.query;
  if (!liuyanid) return res.json({ code: -1, msg: '参数缺失' });
  const offset = (page - 1) * limit;
  try {
    const [countRes] = await pool.query('SELECT COUNT(*) as total FROM pinglun WHERE liuyanid=?', [liuyanid]);
    const [rows] = await pool.query('SELECT * FROM pinglun WHERE liuyanid=? ORDER BY id DESC LIMIT ? OFFSET ?', [liuyanid, Number(limit), offset]);
    res.json({ code: 0, data: { list: rows, total: countRes[0].total } });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.post('/add', async (req, res) => {
  const { liuyanid, userid, username, content } = req.body;
  if (!liuyanid || !userid || !content) {
    return res.json({ code: -1, msg: '参数缺失' });
  }
  try {
    const [result] = await pool.query('INSERT INTO pinglun (liuyanid, userid, username, content) VALUES (?, ?, ?, ?)', [liuyanid, userid, username, content]);
    res.json({ code: 0, data: { id: result.insertId }, msg: '评论成功' });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM pinglun WHERE id=?', [req.params.id]);
    res.json({ code: 0, msg: '删除成功' });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.get('/count', async (req, res) => {
  const { liuyanid } = req.query;
  try {
    const [countRes] = await pool.query('SELECT COUNT(*) as total FROM pinglun WHERE liuyanid=?', [liuyanid]);
    res.json({ code: 0, data: { count: countRes[0].total } });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.get('/batch-count', async (req, res) => {
  const { ids } = req.query;
  if (!ids) return res.json({ code: 0, data: {} });
  try {
    const idArr = String(ids).split(',').map(Number).filter(n => n > 0);
    if (idArr.length === 0) return res.json({ code: 0, data: {} });
    const placeholders = idArr.map(() => '?').join(',');
    const [counts] = await pool.query(`SELECT liuyanid, COUNT(*) as cnt FROM pinglun WHERE liuyanid IN (${placeholders}) GROUP BY liuyanid`, idArr);
    const result = {};
    idArr.forEach(id => { result[id] = 0; });
    counts.forEach(r => { result[r.liuyanid] = r.cnt; });
    res.json({ code: 0, data: result });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

module.exports = router;
