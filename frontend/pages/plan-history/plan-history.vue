<template>
  <view class="history-page">
    <view class="history-list" v-if="list.length > 0">
      <view class="history-card" v-for="item in list" :key="item.id">
        <view class="history-header">
          <view class="done-badge">&#x2705; 已完成</view>
        </view>
        <image class="history-img" :src="item.jihuatupian || 'https://picsum.photos/seed/plan/400/300'" mode="aspectFill" />
        <view class="history-body">
          <text class="history-title">{{ item.jihuabiaoti }}</text>
          <text class="history-content">{{ item.jihuaneirong }}</text>
          <view class="history-meta">
            <text class="meta">&#x1F4C5; {{ formatDate(item.kaishiriqi) }} ~ {{ formatDate(item.jieshushijian) }}</text>
            <text class="meta">&#x23F0; {{ item.jihuatianshu }} 天</text>
            <text class="meta">&#x2705; {{ formatDate(item.wanchengriqi) }} 完成</text>
          </view>
        </view>
      </view>
    </view>

    <view class="empty-state" v-else>
      <text class="empty-icon">&#x1F3C6;</text>
      <text class="empty-text">暂无已完成的计划</text>
      <text class="empty-hint">完成计划后将在这里展示</text>
    </view>
  </view>
</template>

<script>
import { get, getUserInfo } from '../../utils/request.js'

export default {
  data() {
    return {
      list: [],
      page: 1,
      limit: 20
    }
  },
  onShow() {
    this.loadHistory()
  },
  methods: {
    async loadHistory() {
      const user = getUserInfo()
      try {
        const res = await get('/jihualishibiao/list', { userid: user.id, page: this.page, limit: this.limit })
        if (res.code === 0) {
          this.list = res.data.list
        }
      } catch (e) {}
    },
    formatDate(d) {
      if (!d) return ''
      return String(d).substring(0, 10)
    }
  }
}
</script>

<style scoped>
.history-page {
  padding: 24rpx 28rpx;
  padding-bottom: 60rpx;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.history-card {
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.history-header {
  padding: 16rpx 24rpx 0;
}

.done-badge {
  display: inline-block;
  font-size: 22rpx;
  color: #43b581;
  background: #e8f5e9;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
}

.history-img {
  width: 100%;
  height: 260rpx;
  margin-top: 12rpx;
}

.history-body {
  padding: 20rpx 24rpx 24rpx;
}

.history-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 10rpx;
}

.history-content {
  display: block;
  font-size: 24rpx;
  color: #7f8c8d;
  margin-bottom: 16rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.meta {
  font-size: 22rpx;
  color: #7f8c8d;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 160rpx 0;
}

.empty-icon {
  font-size: 100rpx;
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
</style>
