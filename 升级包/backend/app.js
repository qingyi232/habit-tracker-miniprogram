const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');
const planRouter = require('./routes/plan');
const checkinRouter = require('./routes/checkin');
const historyRouter = require('./routes/history');
const messageRouter = require('./routes/message');
const uploadRouter = require('./routes/upload');
const commonRouter = require('./routes/common');
const likeRouter = require('./routes/like');
const commentRouter = require('./routes/comment');
const activityRouter = require('./routes/activity');

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

app.use('/api/admin', adminRouter);
app.use('/api/yonghu', userRouter);
app.use('/api/xuexijihua', planRouter);
app.use('/api/jihuadaka', checkinRouter);
app.use('/api/jihualishibiao', historyRouter);
app.use('/api/liuyanban', messageRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/common', commonRouter);
app.use('/api/dianzan', likeRouter);
app.use('/api/pinglun', commentRouter);
app.use('/api/huodong', activityRouter);

const PORT = 3900;
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
