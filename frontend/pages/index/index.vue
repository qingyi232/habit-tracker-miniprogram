<template>
  <view class="index-page">
    <!-- 顶部问候 -->
    <view class="header-section">
      <view class="greeting">
        <text class="greeting-text">{{ greetingText }}</text>
        <text class="user-name">{{ userInfo.xingming || '同学' }}</text>
      </view>
      <view class="points-badge" @tap="goLeaderboard">
        <text class="points-icon">&#x2B50;</text>
        <text class="points-num">{{ userInfo.jifen || 0 }}</text>
      </view>
    </view>

    <!-- 搜索栏 -->
    <view class="search-bar">
      <text class="search-icon">&#x1F50D;</text>
      <input class="search-input" v-model="keyword" placeholder="搜索计划标题..." placeholder-class="search-placeholder" @confirm="loadPlans" />
    </view>

    <!-- 快捷入口 -->
    <view class="quick-actions">
      <view class="action-item" @tap="goCreatePlan">
        <view class="action-icon" style="background: rgba(67,181,129,0.12)">
          <text style="font-size: 40rpx">&#x1F4DD;</text>
        </view>
        <text class="action-text">创建计划</text>
      </view>
      <view class="action-item" @tap="goMyPlans">
        <view class="action-icon" style="background: rgba(240,165,0,0.12)">
          <text style="font-size: 40rpx">&#x1F4CB;</text>
        </view>
        <text class="action-text">我的计划</text>
      </view>
      <view class="action-item" @tap="goHistory">
        <view class="action-icon" style="background: rgba(52,152,219,0.12)">
          <text style="font-size: 40rpx">&#x1F3C6;</text>
        </view>
        <text class="action-text">计划历史</text>
      </view>
      <view class="action-item" @tap="goCommunity">
        <view class="action-icon" style="background: rgba(231,76,60,0.12)">
          <text style="font-size: 40rpx">&#x1F4AC;</text>
        </view>
        <text class="action-text">交流社区</text>
      </view>
    </view>

    <!-- 计划列表 -->
    <view class="section-header">
      <text class="section-title">学习计划</text>
      <text class="section-more" @tap="goMyPlans">查看全部 &#x276F;</text>
    </view>

    <view class="plan-list" v-if="plans.length > 0">
      <view class="plan-card" v-for="item in plans" :key="item.id" @tap="goPlanDetail(item.id)">
        <image class="plan-img" :src="item.jihuatupian || 'https://picsum.photos/seed/plan/400/300'" mode="aspectFill" />
        <view class="plan-info">
          <text class="plan-title">{{ item.jihuabiaoti }}</text>
          <text class="plan-desc">{{ item.jihuaneirong }}</text>
          <view class="plan-meta">
            <view class="meta-item">
              <text class="meta-icon">&#x1F4C5;</text>
              <text class="meta-text">{{ item.jihuatianshu }}天</text>
            </view>
            <view :class="['status-tag', item.wanchengdu === '已完成' ? 'done' : 'ongoing']">
              <text>{{ item.wanchengdu || '进行中' }}</text>
            </view>
          </view>
          <text class="plan-user">{{ item.xingming }}</text>
        </view>
      </view>
    </view>

    <view class="empty-state" v-else>
      <text class="empty-icon">&#x1F4DA;</text>
      <text class="empty-text">暂无学习计划</text>
      <text class="empty-hint">点击"创建计划"开始你的自律之旅吧</text>
    </view>

    <!-- 加载更多 -->
    <view class="load-more" v-if="plans.length > 0 && hasMore">
      <text class="load-text" @tap="loadMore">加载更多</text>
    </view>
  </view>
</template>

<script>
import { get, getUserInfo } from '../../utils/request.js'

export default {
  data() {
    return {
      userInfo: {},
      plans: [],
      keyword: '',
      page: 1,
      limit: 10,
      total: 0,
      hasMore: false
    }
  },
  computed: {
    greetingText() {
      const h = new Date().getHours()
      if (h < 6) return '夜深了'
      if (h < 12) return '早上好'
      if (h < 14) return '中午好'
      if (h < 18) return '下午好'
      return '晚上好'
    }
  },
  onShow() {
    this.userInfo = getUserInfo()
    if (!this.userInfo.id) {
      uni.reLaunch({ url: '/pages/login/login' })
      return
    }
    this.refreshUserInfo()
    this.page = 1
    this.loadPlans()
    this.checkReminders()
  },
  onPullDownRefresh() {
    this.page = 1
    this.loadPlans().then(() => uni.stopPullDownRefresh())
  },
  methods: {
    async refreshUserInfo() {
      try {
        const res = await get('/yonghu/info/' + this.userInfo.id)
        if (res.code === 0 && res.data) {
          this.userInfo = { ...this.userInfo, ...res.data }
        }
      } catch (e) {}
    },
    async loadPlans() {
      try {
        const params = { page: this.page, limit: this.limit }
        if (this.keyword) params.jihuabiaoti = this.keyword
        const res = await get('/xuexijihua/list', params)
        console.log('loadPlans response:', JSON.stringify(res))
        if (res.code === 0 && res.data) {
          const list = res.data.list || []
          if (this.page === 1) {
            this.plans = list
          } else {
            this.plans = [...this.plans, ...list]
          }
          this.total = res.data.total || 0
          this.hasMore = this.plans.length < this.total
        }
      } catch (e) {
        console.error('loadPlans error:', e)
      }
    },
    loadMore() {
      if (this.hasMore) {
        this.page++
        this.loadPlans()
      }
    },
    goPlanDetail(id) {
      uni.navigateTo({ url: '/pages/plan-detail/plan-detail?id=' + id })
    },
    goCreatePlan() {
      uni.navigateTo({ url: '/pages/create-plan/create-plan' })
    },
    goMyPlans() {
      uni.navigateTo({ url: '/pages/my-plans/my-plans' })
    },
    goHistory() {
      uni.navigateTo({ url: '/pages/plan-history/plan-history' })
    },
    goCommunity() {
      uni.switchTab({ url: '/pages/community/community' })
    },
    goLeaderboard() {
      uni.switchTab({ url: '/pages/leaderboard/leaderboard' })
    },
    checkReminders() {
      const now = new Date()
      const nowTime = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0')
      const todayKey = 'reminder_shown_' + now.toISOString().substring(0, 10)
      const shownToday = uni.getStorageSync(todayKey) || {}
      const res = uni.getStorageInfoSync()
      const reminderKeys = res.keys.filter(k => k.startsWith('reminder_') && !k.startsWith('reminder_shown_'))
      const pendingReminders = []
      reminderKeys.forEach(key => {
        const data = uni.getStorageSync(key)
        if (data && data.on && data.time) {
          const planId = key.replace('reminder_', '')
          if (data.time <= nowTime && !shownToday[planId]) {
            pendingReminders.push({ planId, title: data.planTitle || '学习计划', time: data.time })
          }
        }
      })
      if (pendingReminders.length > 0) {
        const first = pendingReminders[0]
        shownToday[first.planId] = true
        uni.setStorageSync(todayKey, shownToday)
        uni.showModal({
          title: '打卡提醒',
          content: `「${first.title}」该打卡啦！坚持就是胜利💪`,
          confirmText: '去打卡',
          cancelText: '稍后',
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({ url: '/pages/checkin/checkin?planId=' + first.planId })
            }
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.index-page {
  padding: 24rpx 28rpx;
  padding-bottom: 40rpx;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 8rpx 30rpx;
}

.greeting-text {
  display: block;
  font-size: 26rpx;
  color: #7f8c8d;
  margin-bottom: 6rpx;
}

.user-name {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  color: #2c3e50;
}

.points-badge {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
  padding: 12rpx 24rpx;
  border-radius: 40rpx;
}

.points-icon {
  font-size: 28rpx;
  margin-right: 8rpx;
}

.points-num {
  font-size: 28rpx;
  font-weight: 700;
  color: #f0a500;
}

.search-bar {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 0 24rpx;
  height: 80rpx;
  margin-bottom: 28rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.search-icon {
  font-size: 30rpx;
  margin-right: 16rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #2c3e50;
}

.search-placeholder {
  color: #bdc3c7;
}

.quick-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 36rpx;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
}

.action-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}

.action-text {
  font-size: 24rpx;
  color: #7f8c8d;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding: 0 4rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #2c3e50;
}

.section-more {
  font-size: 24rpx;
  color: #43b581;
}

.plan-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.plan-card {
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.plan-img {
  width: 100%;
  height: 280rpx;
}

.plan-info {
  padding: 24rpx 28rpx;
}

.plan-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 10rpx;
}

.plan-desc {
  display: block;
  font-size: 24rpx;
  color: #7f8c8d;
  margin-bottom: 16rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.plan-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.meta-item {
  display: flex;
  align-items: center;
}

.meta-icon {
  font-size: 24rpx;
  margin-right: 6rpx;
}

.meta-text {
  font-size: 24rpx;
  color: #7f8c8d;
}

.status-tag {
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
}

.status-tag.ongoing {
  background: #e8f5e9;
  color: #43b581;
}

.status-tag.done {
  background: #fff8e1;
  color: #f0a500;
}

.plan-user {
  font-size: 22rpx;
  color: #bdc3c7;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
}

.empty-icon {
  font-size: 100rpx;
  margin-bottom: 24rpx;
}

.empty-text {
  font-size: 30rpx;
  color: #7f8c8d;
  margin-bottom: 12rpx;
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
