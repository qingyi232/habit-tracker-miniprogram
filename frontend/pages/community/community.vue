<template>
  <view class="community-page">
    <!-- 社区打卡活动 -->
    <view class="activity-section" v-if="activities.length > 0">
      <text class="activity-section-title">🔥 打卡活动</text>
      <scroll-view scroll-x class="activity-scroll">
        <view class="activity-list">
          <view class="activity-card" v-for="act in activities" :key="act.id">
            <view class="act-badge">{{ act.days }}天挑战</view>
            <text class="act-title">{{ act.title }}</text>
            <text class="act-date">{{ formatDate(act.start_date) }} ~ {{ formatDate(act.end_date) }}</text>
            <view class="act-footer">
              <text class="act-people">{{ act.participantCount || 0 }}人参与</text>
              <button
                class="act-join-btn"
                size="mini"
                :disabled="act._joined"
                @tap="joinActivity(act)"
              >{{ act._joined ? '已参与' : '参与' }}</button>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 发布区域 -->
    <view class="publish-card">
      <textarea class="publish-input" v-model="newContent" placeholder="分享你的学习心得..." placeholder-class="placeholder" :maxlength="300" />
      <view class="publish-bar">
        <text class="char-count">{{ newContent.length }}/300</text>
        <button class="publish-btn" @tap="handlePublish" :loading="publishing" size="mini">发布</button>
      </view>
    </view>

    <!-- 留言列表 -->
    <view class="message-list">
      <view class="message-card" v-for="item in messages" :key="item.id">
        <view class="msg-header">
          <view class="msg-user">
            <view class="msg-avatar-wrap">
              <text class="avatar-text">{{ getFirstChar(item.username) }}</text>
            </view>
            <view class="msg-user-info">
              <text class="msg-username">{{ item.username || '匿名用户' }}</text>
              <text class="msg-time">{{ formatTime(item.addtime) }}</text>
            </view>
          </view>
        </view>

        <text class="msg-content">{{ item.content }}</text>

        <view class="msg-reply" v-if="item.reply">
          <view class="reply-tag">
            <text class="reply-label">管理员回复</text>
          </view>
          <text class="reply-content">{{ item.reply }}</text>
        </view>

        <!-- 点赞和评论操作栏 -->
        <view class="action-bar">
          <view class="action-item" @tap="toggleLike(item)">
            <text :class="['action-icon', item._liked ? 'liked' : '']">{{ item._liked ? '❤️' : '🤍' }}</text>
            <text class="action-text">{{ item._likeCount || 0 }}</text>
          </view>
          <view class="action-item" @tap="toggleComments(item)">
            <text class="action-icon">💬</text>
            <text class="action-text">{{ item._commentCount || 0 }}</text>
          </view>
        </view>

        <!-- 评论展开区 -->
        <view class="comments-section" v-if="item._showComments">
          <view class="comment-input-row">
            <input class="comment-input" v-model="item._newComment" placeholder="写评论..." placeholder-class="placeholder" />
            <button class="comment-send-btn" size="mini" @tap="sendComment(item)">发送</button>
          </view>
          <view class="comment-list" v-if="item._comments && item._comments.length > 0">
            <view class="comment-item" v-for="c in item._comments" :key="c.id">
              <text class="comment-user">{{ c.username }}</text>
              <text class="comment-body">{{ c.content }}</text>
              <text class="comment-time">{{ formatTime(c.addtime) }}</text>
            </view>
          </view>
          <view class="no-comments" v-else>
            <text class="no-comments-text">暂无评论</text>
          </view>
        </view>
      </view>

      <view class="empty-state" v-if="messages.length === 0">
        <text class="empty-icon">&#x1F4AC;</text>
        <text class="empty-text">还没有人发言</text>
        <text class="empty-hint">成为第一个分享心得的人吧</text>
      </view>
    </view>

    <!-- 加载更多 -->
    <view class="load-more" v-if="hasMore" @tap="loadMore">
      <text class="load-text">加载更多</text>
    </view>
  </view>
</template>

<script>
import { get, post, getUserInfo } from '../../utils/request.js'

export default {
  data() {
    return {
      activities: [],
      messages: [],
      newContent: '',
      publishing: false,
      page: 1,
      limit: 10,
      total: 0,
      hasMore: false
    }
  },
  onShow() {
    this.page = 1
    this.loadMessages()
    this.loadActivities()
  },
  methods: {
    async loadActivities() {
      try {
        const res = await get('/huodong/list', { status: 'active', limit: 10 })
        if (res.code === 0) {
          const user = getUserInfo()
          const list = res.data.list || []
          for (const act of list) {
            try {
              const ck = await get('/huodong/check-join', { huodong_id: act.id, userid: user.id })
              act._joined = ck.code === 0 && ck.data.joined
            } catch (e) { act._joined = false }
          }
          this.activities = list
        }
      } catch (e) {}
    },
    async joinActivity(act) {
      const user = getUserInfo()
      if (!user.id) { uni.showToast({ title: '请先登录', icon: 'none' }); return }
      try {
        const res = await post('/huodong/join', { huodong_id: act.id, userid: user.id, username: user.xingming })
        if (res.code === 0) {
          act._joined = true
          act.participantCount = (act.participantCount || 0) + 1
          uni.showToast({ title: '参与成功', icon: 'success' })
        } else {
          uni.showToast({ title: res.msg || '参与失败', icon: 'none' })
        }
      } catch (e) {
        uni.showToast({ title: '参与失败', icon: 'none' })
      }
    },
    formatDate(d) {
      if (!d) return ''
      return String(d).substring(5, 10)
    },
    async loadMessages() {
      try {
        const res = await get('/liuyanban/list', { page: this.page, limit: this.limit })
        if (res.code === 0) {
          const list = (res.data.list || []).map(item => ({
            ...item,
            _liked: false,
            _likeCount: 0,
            _commentCount: 0,
            _showComments: false,
            _comments: [],
            _newComment: ''
          }))
          if (this.page === 1) {
            this.messages = list
          } else {
            this.messages = [...this.messages, ...list]
          }
          this.total = res.data.total
          this.hasMore = this.messages.length < this.total
          this.loadLikeAndCommentData()
        }
      } catch (e) {}
    },
    async loadLikeAndCommentData() {
      const ids = this.messages.map(m => m.id).join(',')
      if (!ids) return
      const user = getUserInfo()
      try {
        const [likeRes, commentRes] = await Promise.all([
          get('/dianzan/batch', { ids, userid: user.id || '' }),
          get('/pinglun/batch-count', { ids })
        ])
        if (likeRes.code === 0) {
          this.messages.forEach(m => {
            const d = likeRes.data[m.id]
            if (d) { m._liked = d.liked; m._likeCount = d.count }
          })
        }
        if (commentRes.code === 0) {
          this.messages.forEach(m => {
            m._commentCount = commentRes.data[m.id] || 0
          })
        }
      } catch (e) {}
    },
    loadMore() {
      if (this.hasMore) {
        this.page++
        this.loadMessages()
      }
    },
    async handlePublish() {
      if (!this.newContent.trim()) {
        uni.showToast({ title: '请输入内容', icon: 'none' })
        return
      }
      const user = getUserInfo()
      if (!user.id) {
        uni.showToast({ title: '请先登录', icon: 'none' })
        return
      }
      this.publishing = true
      try {
        const res = await post('/liuyanban/add', {
          userid: user.id,
          username: user.xingming,
          content: this.newContent.trim()
        })
        if (res.code === 0) {
          uni.showToast({ title: '发布成功', icon: 'success' })
          this.newContent = ''
          this.page = 1
          this.loadMessages()
        } else {
          uni.showToast({ title: res.msg || '发布失败', icon: 'none' })
        }
      } catch (e) {
        uni.showToast({ title: '发布失败', icon: 'none' })
      }
      this.publishing = false
    },
    async toggleLike(item) {
      const user = getUserInfo()
      if (!user.id) { uni.showToast({ title: '请先登录', icon: 'none' }); return }
      try {
        const res = await post('/dianzan/toggle', { liuyanid: item.id, userid: user.id, username: user.xingming })
        if (res.code === 0) {
          item._liked = res.data.liked
          item._likeCount = res.data.count
        }
      } catch (e) {}
    },
    toggleComments(item) {
      item._showComments = !item._showComments
      if (item._showComments && item._comments.length === 0) {
        this.loadComments(item)
      }
    },
    async loadComments(item) {
      try {
        const res = await get('/pinglun/list', { liuyanid: item.id, limit: 50 })
        if (res.code === 0) {
          item._comments = res.data.list || []
        }
      } catch (e) {}
    },
    async sendComment(item) {
      const user = getUserInfo()
      if (!user.id) { uni.showToast({ title: '请先登录', icon: 'none' }); return }
      if (!item._newComment || !item._newComment.trim()) {
        uni.showToast({ title: '请输入评论内容', icon: 'none' }); return
      }
      try {
        const res = await post('/pinglun/add', {
          liuyanid: item.id,
          userid: user.id,
          username: user.xingming,
          content: item._newComment.trim()
        })
        if (res.code === 0) {
          item._newComment = ''
          item._commentCount++
          this.loadComments(item)
          uni.showToast({ title: '评论成功', icon: 'success' })
        }
      } catch (e) {
        uni.showToast({ title: '评论失败', icon: 'none' })
      }
    },
    getFirstChar(name) {
      return name ? name.substring(0, 1) : '匿'
    },
    formatTime(t) {
      if (!t) return ''
      return String(t).substring(0, 16).replace('T', ' ')
    }
  }
}
</script>

<style scoped>
.community-page {
  padding: 24rpx 28rpx;
  padding-bottom: 60rpx;
}

.activity-section {
  margin-bottom: 20rpx;
}

.activity-section-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 16rpx;
}

.activity-scroll {
  white-space: nowrap;
}

.activity-list {
  display: inline-flex;
  gap: 16rpx;
}

.activity-card {
  display: inline-flex;
  flex-direction: column;
  width: 280rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
  position: relative;
}

.act-badge {
  position: absolute;
  top: 12rpx;
  right: 12rpx;
  background: #e8f5e9;
  color: #43b581;
  font-size: 20rpx;
  font-weight: 600;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.act-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8rpx;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.act-date {
  font-size: 22rpx;
  color: #95a5a6;
  margin-bottom: 12rpx;
}

.act-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.act-people {
  font-size: 22rpx;
  color: #7f8c8d;
}

.act-join-btn {
  background: #43b581;
  color: #fff;
  font-size: 22rpx;
  border: none;
  border-radius: 8rpx;
  padding: 0 20rpx;
  height: 52rpx;
  line-height: 52rpx;
}

.act-join-btn::after {
  border: none;
}

.act-join-btn[disabled] {
  background: #bdc3c7;
  color: #fff;
}

.publish-card {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);
}

.publish-input {
  width: 100%;
  height: 160rpx;
  font-size: 28rpx;
  color: #2c3e50;
  box-sizing: border-box;
}

.placeholder {
  color: #bdc3c7;
}

.publish-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #f5f5f5;
}

.char-count {
  font-size: 22rpx;
  color: #bdc3c7;
}

.publish-btn {
  background: linear-gradient(135deg, #43b581 0%, #2d8a5e 100%);
  color: #ffffff;
  font-size: 24rpx;
  border-radius: 10rpx;
  border: none;
  padding: 0 32rpx;
  height: 60rpx;
  line-height: 60rpx;
}

.publish-btn::after {
  border: none;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.message-card {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 28rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.03);
}

.msg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.msg-user {
  display: flex;
  align-items: center;
}

.msg-avatar-wrap {
  width: 68rpx;
  height: 68rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #43b581, #2d8a5e);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
}

.avatar-text {
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 700;
}

.msg-username {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #2c3e50;
}

.msg-time {
  display: block;
  font-size: 22rpx;
  color: #bdc3c7;
}

.msg-content {
  display: block;
  font-size: 28rpx;
  color: #555;
  line-height: 1.7;
  margin-bottom: 8rpx;
}

.msg-reply {
  background: #f7f8fa;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-top: 16rpx;
  border-left: 6rpx solid #43b581;
}

.reply-tag {
  margin-bottom: 8rpx;
}

.reply-label {
  font-size: 22rpx;
  color: #43b581;
  font-weight: 600;
}

.reply-content {
  font-size: 26rpx;
  color: #555;
  line-height: 1.6;
}

.action-bar {
  display: flex;
  gap: 40rpx;
  padding-top: 16rpx;
  margin-top: 16rpx;
  border-top: 1rpx solid #f0f0f0;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.action-icon {
  font-size: 28rpx;
}

.action-icon.liked {
  transform: scale(1.1);
}

.action-text {
  font-size: 24rpx;
  color: #7f8c8d;
}

.comments-section {
  margin-top: 20rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #f5f5f5;
}

.comment-input-row {
  display: flex;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.comment-input {
  flex: 1;
  height: 64rpx;
  background: #f7f8fa;
  border-radius: 32rpx;
  padding: 0 24rpx;
  font-size: 26rpx;
}

.comment-send-btn {
  background: #43b581;
  color: #fff;
  font-size: 24rpx;
  border: none;
  border-radius: 32rpx;
  height: 64rpx;
  line-height: 64rpx;
  padding: 0 28rpx;
}

.comment-send-btn::after {
  border: none;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.comment-item {
  background: #f7f8fa;
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
}

.comment-user {
  font-size: 24rpx;
  font-weight: 600;
  color: #43b581;
  margin-right: 12rpx;
}

.comment-body {
  font-size: 26rpx;
  color: #555;
}

.comment-time {
  display: block;
  font-size: 20rpx;
  color: #bdc3c7;
  margin-top: 6rpx;
}

.no-comments {
  text-align: center;
  padding: 20rpx;
}

.no-comments-text {
  font-size: 24rpx;
  color: #bdc3c7;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #7f8c8d;
  margin-bottom: 10rpx;
}

.empty-hint {
  font-size: 24rpx;
  color: #bdc3c7;
}

.load-more {
  display: flex;
  justify-content: center;
  padding: 32rpx 0;
}

.load-text {
  font-size: 26rpx;
  color: #43b581;
}
</style>
