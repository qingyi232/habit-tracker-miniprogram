const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/list', async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const offset = (page - 1) * limit;
  let where = '1=1';
  const params = [];
  if (status) { where += ' AND status = ?'; params.push(status); }
  try {
    const [countRes] = await pool.query(`SELECT COUNT(*) as total FROM shequ_huodong WHERE ${where}`, params);
    const [rows] = await pool.query(`SELECT * FROM shequ_huodong WHERE ${where} ORDER BY id DESC LIMIT ? OFFSET ?`, [...params, Number(limit), offset]);
    for (const row of rows) {
      const [pRes] = await pool.query('SELECT COUNT(*) as cnt FROM huodong_canyuzhe WHERE huodong_id=?', [row.id]);
      row.participantCount = pRes[0].cnt;
    }
    res.json({ code: 0, data: { list: rows, total: countRes[0].total } });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.get('/info/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM shequ_huodong WHERE id=?', [req.params.id]);
    if (rows.length === 0) return res.json({ code: -1, msg: '活动不存在' });
    const [pRes] = await pool.query('SELECT COUNT(*) as cnt FROM huodong_canyuzhe WHERE huodong_id=?', [req.params.id]);
    rows[0].participantCount = pRes[0].cnt;
    res.json({ code: 0, data: rows[0] });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.post('/add', async (req, res) => {
  const { title, description, image, days, start_date, end_date, admin_id } = req.body;
  if (!title || !days || !start_date || !end_date) {
    return res.json({ code: -1, msg: '参数不完整' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO shequ_huodong (title, description, image, days, start_date, end_date, admin_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description, image, days, start_date, end_date, admin_id]
    );
    res.json({ code: 0, data: { id: result.insertId }, msg: '活动创建成功' });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM huodong_canyuzhe WHERE huodong_id=?', [req.params.id]);
    await pool.query('DELETE FROM shequ_huodong WHERE id=?', [req.params.id]);
    res.json({ code: 0, msg: '删除成功' });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.post('/join', async (req, res) => {
  const { huodong_id, userid, username } = req.body;
  if (!huodong_id || !userid) return res.json({ code: -1, msg: '参数缺失' });
  try {
    const [existing] = await pool.query('SELECT id FROM huodong_canyuzhe WHERE huodong_id=? AND userid=?', [huodong_id, userid]);
    if (existing.length > 0) return res.json({ code: -1, msg: '您已参与该活动' });
    await pool.query('INSERT INTO huodong_canyuzhe (huodong_id, userid, username) VALUES (?, ?, ?)', [huodong_id, userid, username]);
    res.json({ code: 0, msg: '参与成功' });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.get('/check-join', async (req, res) => {
  const { huodong_id, userid } = req.query;
  try {
    const [rows] = await pool.query('SELECT id FROM huodong_canyuzhe WHERE huodong_id=? AND userid=?', [huodong_id, userid]);
    res.json({ code: 0, data: { joined: rows.length > 0 } });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.get('/participants/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM huodong_canyuzhe WHERE huodong_id=? ORDER BY id DESC', [req.params.id]);
    res.json({ code: 0, data: rows });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

module.exports = router;
