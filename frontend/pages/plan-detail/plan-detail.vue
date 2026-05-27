<template>
  <view class="detail-page" v-if="plan">
    <image class="cover-img" :src="plan.jihuatupian || 'https://picsum.photos/seed/plan/400/300'" mode="aspectFill" />

    <view class="detail-content">
      <view class="title-row">
        <text class="plan-title">{{ plan.jihuabiaoti }}</text>
        <view :class="['status-tag', plan.wanchengdu === '已完成' ? 'done' : 'ongoing']">
          {{ plan.wanchengdu || '未完成' }}
        </view>
      </view>

      <view class="info-grid">
        <view class="info-item">
          <text class="info-label">开始日期</text>
          <text class="info-value">{{ formatDate(plan.kaishiriqi) }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">结束日期</text>
          <text class="info-value">{{ formatDate(plan.jieshushijian) }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">计划天数</text>
          <text class="info-value">{{ plan.jihuatianshu }} 天</text>
        </view>
        <view class="info-item">
          <text class="info-label">创建者</text>
          <text class="info-value">{{ plan.xingming }}</text>
        </view>
      </view>

      <view class="section">
        <text class="section-title">计划内容</text>
        <text class="section-content">{{ plan.jihuaneirong }}</text>
      </view>

      <!-- 打卡提醒设置 -->
      <view class="reminder-section" v-if="isOwner">
        <view class="reminder-header">
          <text class="section-title">打卡提醒</text>
          <switch :checked="reminderOn" @change="toggleReminder" color="#43b581" />
        </view>
        <view class="reminder-body" v-if="reminderOn">
          <picker mode="time" :value="reminderTime" @change="onTimeChange">
            <view class="time-picker-row">
              <text class="time-label">提醒时间</text>
              <view class="time-value-wrap">
                <text class="time-value">{{ reminderTime }}</text>
                <text class="time-arrow">▶</text>
              </view>
            </view>
          </picker>
          <text class="reminder-hint">将在每天 {{ reminderTime }} 通过弹窗提醒您打卡</text>
        </view>
      </view>

      <!-- 打卡数据统计 -->
      <view class="stats-section" v-if="plan">
        <view class="stats-grid">
          <view class="stat-card">
            <text class="stat-num">{{ checkins.length }}</text>
            <text class="stat-label">打卡次数</text>
          </view>
          <view class="stat-card">
            <text class="stat-num highlight">{{ checkinRate }}%</text>
            <text class="stat-label">打卡率</text>
          </view>
          <view class="stat-card">
            <text class="stat-num">{{ continuousDays }}</text>
            <text class="stat-label">连续天数</text>
          </view>
          <view class="stat-card">
            <text class="stat-num">{{ remainDays }}</text>
            <text class="stat-label">剩余天数</text>
          </view>
        </view>
        <view class="progress-bar-wrap">
          <view class="progress-label">
            <text class="progress-text">完成进度</text>
            <text class="progress-pct">{{ checkinRate }}%</text>
          </view>
          <view class="progress-bar-bg">
            <view class="progress-bar-fill" :style="{ width: checkinRate + '%' }"></view>
          </view>
        </view>
      </view>

      <!-- 打卡记录 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">打卡记录</text>
          <text class="record-count">共 {{ checkins.length }} 次打卡</text>
        </view>

        <view class="checkin-list" v-if="checkins.length > 0">
          <view class="checkin-item" v-for="item in checkins" :key="item.id">
            <view class="checkin-dot"></view>
            <view class="checkin-info">
              <text class="checkin-date">{{ formatDate(item.dakariqi) }}</text>
              <text class="checkin-day">第 {{ item.dakatianshu }} 天</text>
              <text class="checkin-content">{{ item.jihuaneirong }}</text>
            </view>
          </view>
        </view>
        <view v-else class="empty-checkin">
          <text class="empty-text">暂无打卡记录</text>
        </view>
      </view>
    </view>

    <!-- 底部操作按钮 -->
    <view class="bottom-bar safe-bottom" v-if="isOwner">
      <button class="btn-checkin" @tap="goCheckin">去打卡</button>
    </view>
  </view>
</template>

<script>
import { get, getUserInfo } from '../../utils/request.js'

export default {
  data() {
    return {
      planId: null,
      plan: null,
      checkins: [],
      isOwner: false,
      reminderOn: false,
      reminderTime: '20:00'
    }
  },
  computed: {
    checkinRate() {
      if (!this.plan || !this.plan.jihuatianshu) return 0
      const total = Number(this.plan.jihuatianshu) || 1
      const rate = Math.min(100, Math.round((this.checkins.length / total) * 100))
      return rate
    },
    continuousDays() {
      if (this.checkins.length === 0) return 0
      const dates = this.checkins
        .map(c => c.dakariqi ? String(c.dakariqi).substring(0, 10) : '')
        .filter(d => d)
        .sort()
        .reverse()
      let count = 1
      for (let i = 0; i < dates.length - 1; i++) {
        const cur = new Date(dates[i])
        const prev = new Date(dates[i + 1])
        const diff = (cur - prev) / 86400000
        if (diff === 1) count++
        else break
      }
      return count
    },
    remainDays() {
      if (!this.plan || !this.plan.jieshushijian) return 0
      const end = new Date(String(this.plan.jieshushijian).substring(0, 10))
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      const diff = Math.ceil((end - now) / 86400000)
      return Math.max(0, diff)
    }
  },
  onLoad(options) {
    this.planId = options.id
    this.loadDetail()
    this.loadCheckins()
    this.loadReminder()
  },
  methods: {
    async loadDetail() {
      try {
        const res = await get('/xuexijihua/info/' + this.planId)
        if (res.code === 0) {
          this.plan = res.data
          const user = getUserInfo()
          this.isOwner = user.id == this.plan.userid
        }
      } catch (e) {}
    },
    async loadCheckins() {
      try {
        const res = await get('/jihuadaka/list', { jihuaid: this.planId, limit: 100 })
        if (res.code === 0) {
          this.checkins = res.data.list || []
        }
      } catch (e) {}
    },
    formatDate(d) {
      if (!d) return ''
      return String(d).substring(0, 10)
    },
    goCheckin() {
      uni.navigateTo({ url: '/pages/checkin/checkin?planId=' + this.planId })
    },
    loadReminder() {
      const key = 'reminder_' + this.planId
      const saved = uni.getStorageSync(key)
      if (saved) {
        this.reminderOn = saved.on
        this.reminderTime = saved.time || '20:00'
      }
    },
    toggleReminder(e) {
      this.reminderOn = e.detail.value
      this.saveReminder()
      if (this.reminderOn) {
        uni.showToast({ title: '提醒已开启', icon: 'success' })
      }
    },
    onTimeChange(e) {
      this.reminderTime = e.detail.value
      this.saveReminder()
    },
    saveReminder() {
      const key = 'reminder_' + this.planId
      uni.setStorageSync(key, { on: this.reminderOn, time: this.reminderTime, planTitle: this.plan ? this.plan.jihuabiaoti : '' })
    }
  }
}
</script>

<style scoped>
.detail-page {
  padding-bottom: 140rpx;
}

.cover-img {
  width: 100%;
  height: 400rpx;
}

.detail-content {
  padding: 28rpx;
  margin-top: -40rpx;
  background: #f7f8fa;
  border-radius: 32rpx 32rpx 0 0;
  position: relative;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24rpx;
}

.plan-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #2c3e50;
  flex: 1;
  margin-right: 16rpx;
}

.status-tag {
  padding: 6rpx 20rpx;
  border-radius: 10rpx;
  font-size: 22rpx;
  flex-shrink: 0;
}

.status-tag.ongoing {
  background: #e8f5e9;
  color: #43b581;
}

.status-tag.done {
  background: #fff8e1;
  color: #f0a500;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
  margin-bottom: 28rpx;
}

.info-item {
  background: #ffffff;
  border-radius: 14rpx;
  padding: 20rpx 24rpx;
}

.info-label {
  display: block;
  font-size: 22rpx;
  color: #7f8c8d;
  margin-bottom: 8rpx;
}

.info-value {
  display: block;
  font-size: 28rpx;
  color: #2c3e50;
  font-weight: 600;
}

.reminder-section {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
}

.reminder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reminder-body {
  margin-top: 16rpx;
}

.time-picker-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f7f8fa;
  border-radius: 12rpx;
  padding: 20rpx 24rpx;
}

.time-label {
  font-size: 28rpx;
  color: #2c3e50;
}

.time-value-wrap {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.time-value {
  font-size: 32rpx;
  font-weight: 700;
  color: #43b581;
}

.time-arrow {
  font-size: 20rpx;
  color: #bdc3c7;
}

.reminder-hint {
  display: block;
  font-size: 22rpx;
  color: #95a5a6;
  margin-top: 12rpx;
  text-align: center;
}

.stats-section {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 12rpx;
  margin-bottom: 24rpx;
}

.stat-card {
  text-align: center;
  background: #f7f8fa;
  border-radius: 12rpx;
  padding: 20rpx 8rpx;
}

.stat-num {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 6rpx;
}

.stat-num.highlight {
  color: #43b581;
}

.stat-label {
  display: block;
  font-size: 20rpx;
  color: #95a5a6;
}

.progress-bar-wrap {
  margin-top: 8rpx;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.progress-text {
  font-size: 24rpx;
  color: #7f8c8d;
}

.progress-pct {
  font-size: 24rpx;
  color: #43b581;
  font-weight: 600;
}

.progress-bar-bg {
  height: 16rpx;
  background: #ecf0f1;
  border-radius: 8rpx;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #43b581, #2d8a5e);
  border-radius: 8rpx;
  transition: width 0.5s;
}

.section {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 16rpx;
}

.section-content {
  font-size: 28rpx;
  color: #555;
  line-height: 1.8;
}

.record-count {
  font-size: 24rpx;
  color: #7f8c8d;
}

.checkin-list {
  border-left: 3rpx solid #e8f5e9;
  padding-left: 24rpx;
}

.checkin-item {
  position: relative;
  padding-bottom: 28rpx;
  margin-bottom: 20rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.checkin-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.checkin-dot {
  position: absolute;
  left: -31rpx;
  top: 8rpx;
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: #43b581;
}

.checkin-date {
  display: block;
  font-size: 24rpx;
  color: #7f8c8d;
  margin-bottom: 6rpx;
}

.checkin-day {
  display: block;
  font-size: 26rpx;
  color: #43b581;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.checkin-content {
  display: block;
  font-size: 26rpx;
  color: #555;
  line-height: 1.6;
}

.empty-checkin {
  padding: 40rpx 0;
  text-align: center;
}

.empty-text {
  font-size: 26rpx;
  color: #bdc3c7;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 28rpx;
  background: #ffffff;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.btn-checkin {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: linear-gradient(135deg, #43b581 0%, #2d8a5e 100%);
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 600;
  border-radius: 14rpx;
  border: none;
}

.btn-checkin::after {
  border: none;
}

.safe-bottom {
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}
</style>
