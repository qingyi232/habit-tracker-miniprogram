CREATE DATABASE IF NOT EXISTS habit_app DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE habit_app;

-- 管理员表
CREATE TABLE IF NOT EXISTS admin (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(100) DEFAULT '管理员',
  addtime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 用户表
CREATE TABLE IF NOT EXISTS yonghu (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  addtime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  zhanghao VARCHAR(200) NOT NULL COMMENT '账号',
  mima VARCHAR(200) NOT NULL COMMENT '密码',
  xingming VARCHAR(200) NOT NULL COMMENT '姓名',
  xingbie VARCHAR(200) DEFAULT NULL COMMENT '性别',
  nianling INT(11) DEFAULT NULL COMMENT '年龄',
  shouji VARCHAR(200) DEFAULT NULL COMMENT '手机',
  youxiang VARCHAR(200) DEFAULT NULL COMMENT '邮箱',
  zhaopian VARCHAR(200) DEFAULT NULL COMMENT '照片',
  jifen INT(11) DEFAULT 0 COMMENT '积分',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 学习计划表
CREATE TABLE IF NOT EXISTS xuexijihua (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  addtime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  jihuabiaoti VARCHAR(200) NOT NULL COMMENT '计划标题',
  jihuatupian VARCHAR(200) DEFAULT NULL COMMENT '计划图片',
  kaishiriqi DATE DEFAULT NULL COMMENT '开始日期',
  jihuaneirong LONGTEXT DEFAULT NULL COMMENT '计划内容',
  jieshushijian DATE DEFAULT NULL COMMENT '结束时间',
  jihuatianshu VARCHAR(200) DEFAULT NULL COMMENT '计划天数',
  wanchengdu VARCHAR(200) DEFAULT NULL COMMENT '完成度',
  zhanghao VARCHAR(200) DEFAULT NULL COMMENT '账号',
  xingming VARCHAR(200) DEFAULT NULL COMMENT '姓名',
  userid BIGINT(20) DEFAULT NULL COMMENT '用户id',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 计划打卡表
CREATE TABLE IF NOT EXISTS jihuadaka (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  addtime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  jihuabiaoti VARCHAR(200) NOT NULL COMMENT '计划标题',
  jihuatupian VARCHAR(200) DEFAULT NULL COMMENT '计划图片',
  kaishiriqi DATE DEFAULT NULL COMMENT '开始日期',
  jihuaneirong LONGTEXT DEFAULT NULL COMMENT '计划内容',
  jieshushijian DATE DEFAULT NULL COMMENT '结束时间',
  jihuatianshu VARCHAR(200) DEFAULT NULL COMMENT '计划天数',
  wanchengdu VARCHAR(200) DEFAULT NULL COMMENT '完成度',
  dakariqi DATE DEFAULT NULL COMMENT '打卡日期',
  dakatianshu INT(11) DEFAULT NULL COMMENT '打卡天数',
  zhanghao VARCHAR(200) DEFAULT NULL COMMENT '账号',
  xingming VARCHAR(200) DEFAULT NULL COMMENT '姓名',
  userid BIGINT(20) DEFAULT NULL COMMENT '用户id',
  jihuaid BIGINT(20) DEFAULT NULL COMMENT '关联计划id',
  budaka TINYINT(1) DEFAULT 0 COMMENT '是否补打卡:0否1是',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 计划历史表
CREATE TABLE IF NOT EXISTS jihualishibiao (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  addtime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  jihuabiaoti VARCHAR(200) NOT NULL COMMENT '计划标题',
  jihuatupian VARCHAR(200) DEFAULT NULL COMMENT '计划图片',
  kaishiriqi DATE DEFAULT NULL COMMENT '开始日期',
  jihuaneirong LONGTEXT DEFAULT NULL COMMENT '计划内容',
  jieshushijian DATE DEFAULT NULL COMMENT '结束时间',
  jihuatianshu INT(11) DEFAULT NULL COMMENT '计划天数',
  wanchengdu VARCHAR(200) DEFAULT NULL COMMENT '完成度',
  wanchengriqi DATE DEFAULT NULL COMMENT '完成日期',
  zhanghao VARCHAR(200) DEFAULT NULL COMMENT '账号',
  xingming VARCHAR(200) DEFAULT NULL COMMENT '姓名',
  userid BIGINT(20) DEFAULT NULL COMMENT '用户id',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 留言板表
CREATE TABLE IF NOT EXISTS liuyanban (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  addtime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  userid BIGINT(20) NOT NULL COMMENT '留言人id',
  username VARCHAR(200) DEFAULT NULL COMMENT '用户名',
  content LONGTEXT NOT NULL COMMENT '留言内容',
  reply LONGTEXT DEFAULT NULL COMMENT '回复内容',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 点赞表
CREATE TABLE IF NOT EXISTS dianzan (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  addtime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  liuyanid BIGINT(20) NOT NULL COMMENT '留言ID',
  userid BIGINT(20) NOT NULL COMMENT '点赞人ID',
  username VARCHAR(200) DEFAULT NULL COMMENT '点赞人用户名',
  PRIMARY KEY (id),
  UNIQUE KEY uk_liuyan_user (liuyanid, userid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 评论表
CREATE TABLE IF NOT EXISTS pinglun (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  addtime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  liuyanid BIGINT(20) NOT NULL COMMENT '留言ID',
  userid BIGINT(20) NOT NULL COMMENT '评论人ID',
  username VARCHAR(200) DEFAULT NULL COMMENT '评论人用户名',
  content TEXT NOT NULL COMMENT '评论内容',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 社区打卡活动表
CREATE TABLE IF NOT EXISTS shequ_huodong (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  addtime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  title VARCHAR(200) NOT NULL COMMENT '活动标题',
  description TEXT DEFAULT NULL COMMENT '活动描述',
  image VARCHAR(500) DEFAULT NULL COMMENT '活动图片',
  days INT(11) NOT NULL COMMENT '活动天数(7/14/21)',
  start_date DATE NOT NULL COMMENT '开始日期',
  end_date DATE NOT NULL COMMENT '结束日期',
  status VARCHAR(20) DEFAULT 'active' COMMENT '状态:active/ended',
  admin_id BIGINT(20) DEFAULT NULL COMMENT '创建管理员ID',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 活动参与表
CREATE TABLE IF NOT EXISTS huodong_canyuzhe (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  addtime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  huodong_id BIGINT(20) NOT NULL COMMENT '活动ID',
  userid BIGINT(20) NOT NULL COMMENT '用户ID',
  username VARCHAR(200) DEFAULT NULL COMMENT '用户名',
  PRIMARY KEY (id),
  UNIQUE KEY uk_activity_user (huodong_id, userid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 清空并重新插入示例数据
TRUNCATE TABLE liuyanban;
TRUNCATE TABLE jihualishibiao;
TRUNCATE TABLE jihuadaka;
TRUNCATE TABLE xuexijihua;
TRUNCATE TABLE yonghu;
TRUNCATE TABLE admin;

-- 插入管理员数据
INSERT INTO admin (username, password, role) VALUES
('admin', 'admin', '管理员'),
('abo', 'abo', '管理员');

-- 插入用户数据
INSERT INTO yonghu (zhanghao, mima, xingming, xingbie, nianling, shouji, youxiang, zhaopian, jifen) VALUES
('user1', '123456', '张明', '男', 22, '13823688881', '77389001@qq.com', 'https://api.dicebear.com/7.x/avataaars/png?seed=zhangming&size=100', 520),
('user2', '123456', '李芳', '女', 21, '13823688882', '77389002@qq.com', 'https://api.dicebear.com/7.x/avataaars/png?seed=lifang&size=100', 380),
('user3', '123456', '王磊', '男', 23, '13823688883', '77389003@qq.com', 'https://api.dicebear.com/7.x/avataaars/png?seed=wanglei&size=100', 290),
('user4', '123456', '陈雪', '女', 20, '13823688884', '77389004@qq.com', 'https://api.dicebear.com/7.x/avataaars/png?seed=chenxue&size=100', 450),
('user5', '123456', '赵阳', '男', 24, '13823688885', '77389005@qq.com', 'https://api.dicebear.com/7.x/avataaars/png?seed=zhaoyang&size=100', 610);

-- 插入学习计划数据
INSERT INTO xuexijihua (jihuabiaoti, jihuatupian, kaishiriqi, jihuaneirong, jieshushijian, jihuatianshu, wanchengdu, zhanghao, xingming, userid) VALUES
('每日英语阅读30分钟', 'https://picsum.photos/seed/english/400/300', '2026-04-01', '每天坚持阅读英语原版书籍30分钟，记录生词和优美句子，提高英语阅读能力和词汇量。', '2026-04-30', '30', '未完成', 'user1', '张明', 1),
('高数复习计划', 'https://picsum.photos/seed/math/400/300', '2026-04-05', '系统复习高等数学上下册，重点攻克微积分、线性代数和概率论知识点，每天做5道练习题。', '2026-05-05', '30', '未完成', 'user2', '李芳', 2),
('每日跑步5公里', 'https://picsum.photos/seed/running/400/300', '2026-04-10', '早晨6:30起床，进行5公里慢跑，提高身体素质，培养健康生活习惯。', '2026-05-10', '30', '未完成', 'user3', '王磊', 3),
('Python编程学习', 'https://picsum.photos/seed/python/400/300', '2026-04-15', '学习Python编程语言基础语法，完成数据分析和Web开发入门，每天学习1小时。', '2026-05-15', '30', '未完成', 'user4', '陈雪', 4),
('早起打卡21天', 'https://picsum.photos/seed/morning/400/300', '2026-04-20', '连续21天6:00起床，养成早起习惯，利用早晨时间进行学习和运动。', '2026-05-11', '21', '未完成', 'user5', '赵阳', 5);

-- 插入计划打卡数据
INSERT INTO jihuadaka (jihuabiaoti, jihuatupian, kaishiriqi, jihuaneirong, jieshushijian, jihuatianshu, wanchengdu, dakariqi, dakatianshu, zhanghao, xingming, userid, jihuaid) VALUES
('每日英语阅读30分钟', 'https://picsum.photos/seed/english/400/300', '2026-04-01', '今天阅读了《The Great Gatsby》第三章，记录了15个生词。', '2026-04-30', '30', '未完成', '2026-04-28', 12, 'user1', '张明', 1, 1),
('每日英语阅读30分钟', 'https://picsum.photos/seed/english/400/300', '2026-04-01', '继续阅读第四章，学习了5个新的短语表达。', '2026-04-30', '30', '未完成', '2026-04-29', 13, 'user1', '张明', 1, 1),
('高数复习计划', 'https://picsum.photos/seed/math/400/300', '2026-04-05', '今天复习了极限与连续性，完成了课后习题。', '2026-05-05', '30', '未完成', '2026-04-28', 8, 'user2', '李芳', 2, 2),
('每日跑步5公里', 'https://picsum.photos/seed/running/400/300', '2026-04-10', '今天用时28分钟完成5公里，比昨天快了1分钟。', '2026-05-10', '30', '未完成', '2026-04-29', 5, 'user3', '王磊', 3, 3),
('Python编程学习', 'https://picsum.photos/seed/python/400/300', '2026-04-15', '学习了Python列表和字典操作，完成了3道练习题。', '2026-05-15', '30', '未完成', '2026-04-28', 3, 'user4', '陈雪', 4, 4);

-- 插入计划历史数据
INSERT INTO jihualishibiao (jihuabiaoti, jihuatupian, kaishiriqi, jihuaneirong, jieshushijian, jihuatianshu, wanchengdu, wanchengriqi, zhanghao, xingming, userid) VALUES
('21天读书计划', 'https://picsum.photos/seed/reading/400/300', '2026-03-01', '每天阅读一小时课外书籍，开阔视野，提升自我。', '2026-03-21', 21, '已完成', '2026-03-21', 'user1', '张明', 1),
('14天健身挑战', 'https://picsum.photos/seed/fitness/400/300', '2026-03-10', '每天进行30分钟力量训练+20分钟有氧运动。', '2026-03-24', 14, '已完成', '2026-03-24', 'user3', '王磊', 3),
('CET-4备考计划', 'https://picsum.photos/seed/study/400/300', '2026-02-15', '每天背50个单词，做一套真题阅读理解。', '2026-03-15', 28, '已完成', '2026-03-15', 'user2', '李芳', 2);

-- 插入留言板数据
INSERT INTO liuyanban (userid, username, content, reply) VALUES
(1, '张明', '大家有什么好的英语学习方法推荐吗？最近觉得阅读速度提升很慢。', '可以试试泛读和精读结合的方法，先快速浏览了解大意，再精读重点段落。'),
(2, '李芳', '高数真的好难啊，有没有一起复习的小伙伴？', NULL),
(3, '王磊', '坚持跑步第五天了，虽然很累但感觉精神状态好了很多！加油！', '坚持就是胜利，注意跑后拉伸哦！'),
(4, '陈雪', '分享一个Python学习网站：learnpython.org，免费又好用！', '感谢分享，已收藏！'),
(5, '赵阳', '早起的秘诀就是早睡！大家11点前一定要睡觉。', NULL);
