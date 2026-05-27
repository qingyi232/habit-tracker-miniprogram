const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.post('/toggle', async (req, res) => {
  const { liuyanid, userid, username } = req.body;
  if (!liuyanid || !userid) {
    return res.json({ code: -1, msg: '参数缺失' });
  }
  try {
    const [existing] = await pool.query('SELECT id FROM dianzan WHERE liuyanid=? AND userid=?', [liuyanid, userid]);
    if (existing.length > 0) {
      await pool.query('DELETE FROM dianzan WHERE liuyanid=? AND userid=?', [liuyanid, userid]);
      const [countRes] = await pool.query('SELECT COUNT(*) as cnt FROM dianzan WHERE liuyanid=?', [liuyanid]);
      res.json({ code: 0, data: { liked: false, count: countRes[0].cnt } });
    } else {
      await pool.query('INSERT INTO dianzan (liuyanid, userid, username) VALUES (?, ?, ?)', [liuyanid, userid, username]);
      const [countRes] = await pool.query('SELECT COUNT(*) as cnt FROM dianzan WHERE liuyanid=?', [liuyanid]);
      res.json({ code: 0, data: { liked: true, count: countRes[0].cnt } });
    }
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.get('/count', async (req, res) => {
  const { liuyanid } = req.query;
  try {
    const [countRes] = await pool.query('SELECT COUNT(*) as cnt FROM dianzan WHERE liuyanid=?', [liuyanid]);
    res.json({ code: 0, data: { count: countRes[0].cnt } });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.get('/check', async (req, res) => {
  const { liuyanid, userid } = req.query;
  try {
    const [rows] = await pool.query('SELECT id FROM dianzan WHERE liuyanid=? AND userid=?', [liuyanid, userid]);
    res.json({ code: 0, data: { liked: rows.length > 0 } });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

router.get('/batch', async (req, res) => {
  const { ids, userid } = req.query;
  if (!ids) return res.json({ code: 0, data: {} });
  try {
    const idArr = String(ids).split(',').map(Number).filter(n => n > 0);
    if (idArr.length === 0) return res.json({ code: 0, data: {} });
    const placeholders = idArr.map(() => '?').join(',');
    const [counts] = await pool.query(`SELECT liuyanid, COUNT(*) as cnt FROM dianzan WHERE liuyanid IN (${placeholders}) GROUP BY liuyanid`, idArr);
    const [userLikes] = userid
      ? await pool.query(`SELECT liuyanid FROM dianzan WHERE liuyanid IN (${placeholders}) AND userid=?`, [...idArr, userid])
      : [[]];
    const result = {};
    idArr.forEach(id => { result[id] = { count: 0, liked: false }; });
    counts.forEach(r => { result[r.liuyanid].count = r.cnt; });
    userLikes.forEach(r => { result[r.liuyanid].liked = true; });
    res.json({ code: 0, data: result });
  } catch (err) { res.json({ code: -1, msg: err.message }); }
});

module.exports = router;
