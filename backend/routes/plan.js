const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/list', async (req, res) => {
  const { page = 1, limit = 10, jihuabiaoti, userid, zhanghao } = req.query;
  const offset = (page - 1) * limit;
  let where = '1=1';
  const params = [];
  if (jihuabiaoti) { where += ' AND jihuabiaoti LIKE ?'; params.push(`%${jihuabiaoti}%`); }
  if (userid) { where += ' AND userid = ?'; params.push(userid); }
  if (zhanghao) { where += ' AND zhanghao = ?'; params.push(zhanghao); }
  try {
    const [countRes] = await pool.query(`SELECT COUNT(*) as total FROM xuexijihua WHERE ${where}`, params);
    const [rows] = await pool.query(`SELECT * FROM xuexijihua WHERE ${where} ORDER BY id DESC LIMIT ? OFFSET ?`, [...params, Number(limit), offset]);
    res.json({ code: 0, data: { list: rows, total: countRes[0].total } });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.get('/info/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM xuexijihua WHERE id = ?', [req.params.id]);
    res.json({ code: 0, data: rows[0] || null });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.post('/add', async (req, res) => {
  const { jihuabiaoti, jihuatupian, kaishiriqi, jihuaneirong, jieshushijian, jihuatianshu, wanchengdu, zhanghao, xingming, userid } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO xuexijihua (jihuabiaoti, jihuatupian, kaishiriqi, jihuaneirong, jieshushijian, jihuatianshu, wanchengdu, zhanghao, xingming, userid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [jihuabiaoti, jihuatupian, kaishiriqi, jihuaneirong, jieshushijian, jihuatianshu, wanchengdu || '未完成', zhanghao, xingming, userid]
    );
    res.json({ code: 0, data: { id: result.insertId } });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.put('/update/:id', async (req, res) => {
  const { jihuabiaoti, jihuatupian, kaishiriqi, jihuaneirong, jieshushijian, jihuatianshu, wanchengdu, zhanghao, xingming } = req.body;
  try {
    await pool.query(
      'UPDATE xuexijihua SET jihuabiaoti=?, jihuatupian=?, kaishiriqi=?, jihuaneirong=?, jieshushijian=?, jihuatianshu=?, wanchengdu=?, zhanghao=?, xingming=? WHERE id=?',
      [jihuabiaoti, jihuatupian, kaishiriqi, jihuaneirong, jieshushijian, jihuatianshu, wanchengdu, zhanghao, xingming, req.params.id]
    );
    res.json({ code: 0, msg: '修改成功' });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM xuexijihua WHERE id=?', [req.params.id]);
    res.json({ code: 0, msg: '删除成功' });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

module.exports = router;
