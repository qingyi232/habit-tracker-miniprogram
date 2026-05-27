const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/list', async (req, res) => {
  const { page = 1, limit = 10, jihuabiaoti, userid, zhanghao, jihuaid } = req.query;
  const offset = (page - 1) * limit;
  let where = '1=1';
  const params = [];
  if (jihuabiaoti) { where += ' AND jihuabiaoti LIKE ?'; params.push(`%${jihuabiaoti}%`); }
  if (userid) { where += ' AND userid = ?'; params.push(userid); }
  if (zhanghao) { where += ' AND zhanghao = ?'; params.push(zhanghao); }
  if (jihuaid) { where += ' AND jihuaid = ?'; params.push(jihuaid); }
  try {
    const [countRes] = await pool.query(`SELECT COUNT(*) as total FROM jihuadaka WHERE ${where}`, params);
    const [rows] = await pool.query(`SELECT * FROM jihuadaka WHERE ${where} ORDER BY id DESC LIMIT ? OFFSET ?`, [...params, Number(limit), offset]);
    res.json({ code: 0, data: { list: rows, total: countRes[0].total } });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.get('/info/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM jihuadaka WHERE id = ?', [req.params.id]);
    res.json({ code: 0, data: rows[0] || null });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.post('/add', async (req, res) => {
  const { jihuabiaoti, jihuatupian, kaishiriqi, jihuaneirong, jieshushijian, jihuatianshu, wanchengdu, dakariqi, dakatianshu, zhanghao, xingming, userid, jihuaid, budaka } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO jihuadaka (jihuabiaoti, jihuatupian, kaishiriqi, jihuaneirong, jieshushijian, jihuatianshu, wanchengdu, dakariqi, dakatianshu, zhanghao, xingming, userid, jihuaid, budaka) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [jihuabiaoti, jihuatupian, kaishiriqi, jihuaneirong, jieshushijian, jihuatianshu, wanchengdu || '未完成', dakariqi, dakatianshu, zhanghao, xingming, userid, jihuaid, budaka || 0]
    );
    if (userid) {
      await pool.query('UPDATE yonghu SET jifen = jifen + 10 WHERE id = ?', [userid]);
    }
    res.json({ code: 0, data: { id: result.insertId }, msg: '打卡成功，积分+10' });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.put('/update/:id', async (req, res) => {
  const fields = req.body;
  const keys = Object.keys(fields).filter(k => k !== 'id');
  const values = keys.map(k => fields[k]);
  const setStr = keys.map(k => `${k}=?`).join(', ');
  try {
    await pool.query(`UPDATE jihuadaka SET ${setStr} WHERE id=?`, [...values, req.params.id]);
    res.json({ code: 0, msg: '修改成功' });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM jihuadaka WHERE id=?', [req.params.id]);
    res.json({ code: 0, msg: '删除成功' });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

module.exports = router;
