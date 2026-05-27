<template>
  <view class="leaderboard-page">
    <!-- 顶部横幅 -->
    <view class="top-banner">
      <text class="banner-icon">&#x1F3C6;</text>
      <text class="banner-title">积分排行榜</text>
      <text class="banner-desc">坚持自律，超越自我</text>
    </view>

    <!-- 前三名 -->
    <view class="top3" v-if="list.length >= 3">
      <view class="top-item second" @tap="viewUser(list[1])">
        <view class="rank-badge">2</view>
        <image class="top-avatar" :src="list[1].zhaopian || defaultAvatar" mode="aspectFill" />
        <text class="top-name">{{ list[1].xingming }}</text>
        <text class="top-score">{{ list[1].jifen }} 分</text>
      </view>
      <view class="top-item first" @tap="viewUser(list[0])">
        <text class="crown">&#x1F451;</text>
        <view class="rank-badge gold">1</view>
        <image class="top-avatar big" :src="list[0].zhaopian || defaultAvatar" mode="aspectFill" />
        <text class="top-name">{{ list[0].xingming }}</text>
        <text class="top-score">{{ list[0].jifen }} 分</text>
      </view>
      <view class="top-item third" @tap="viewUser(list[2])">
        <view class="rank-badge">3</view>
        <image class="top-avatar" :src="list[2].zhaopian || defaultAvatar" mode="aspectFill" />
        <text class="top-name">{{ list[2].xingming }}</text>
        <text class="top-score">{{ list[2].jifen }} 分</text>
      </view>
    </view>

    <!-- 其余排名 -->
    <view class="rank-list">
      <view class="rank-item" v-for="(item, index) in restList" :key="item.id">
        <text class="rank-num">{{ index + 4 }}</text>
        <image class="rank-avatar" :src="item.zhaopian || defaultAvatar" mode="aspectFill" />
        <view class="rank-info">
          <text class="rank-name">{{ item.xingming }}</text>
        </view>
        <view class="rank-score-box">
          <text class="rank-score">{{ item.jifen }}</text>
          <text class="rank-unit">分</text>
        </view>
      </view>

      <view class="empty-hint" v-if="list.length === 0">
        <text>暂无排行数据</text>
      </view>
    </view>
  </view>
</template>

<script>
import { get } from '../../utils/request.js'

export default {
  data() {
    return {
      list: [],
      defaultAvatar: 'https://picsum.photos/seed/avatar/100/100'
    }
  },
  computed: {
    restList() {
      return this.list.slice(3)
    }
  },
  onShow() {
    this.loadLeaderboard()
  },
  methods: {
    async loadLeaderboard() {
      try {
        const res = await get('/common/leaderboard')
        if (res.code === 0) {
          this.list = res.data || []
        }
      } catch (e) {}
    },
    viewUser(item) {}
  }
}
</script>

<style scoped>
.leaderboard-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.top-banner {
  background: linear-gradient(135deg, #43b581 0%, #2d8a5e 60%, #1a6b42 100%);
  padding: 48rpx 0 100rpx;
  text-align: center;
  border-radius: 0 0 40rpx 40rpx;
}

.banner-icon {
  display: block;
  font-size: 64rpx;
  margin-bottom: 12rpx;
}

.banner-title {
  display: block;
  font-size: 38rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8rpx;
}

.banner-desc {
  display: block;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
}

.top3 {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-top: -60rpx;
  padding: 0 24rpx;
  margin-bottom: 28rpx;
}

.top-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  border-radius: 20rpx;
  padding: 28rpx 16rpx 20rpx;
  width: 30%;
  margin: 0 8rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
  position: relative;
}

.top-item.first {
  padding-top: 48rpx;
  margin-top: -20rpx;
}

.crown {
  position: absolute;
  top: -20rpx;
  font-size: 48rpx;
}

.rank-badge {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  background: #bdc3c7;
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}

.rank-badge.gold {
  background: linear-gradient(135deg, #f0a500, #f5c400);
}

.top-item.second .rank-badge {
  background: linear-gradient(135deg, #95a5a6, #bdc3c7);
}

.top-item.third .rank-badge {
  background: linear-gradient(135deg, #cd7f32, #daa06d);
}

.top-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  margin-bottom: 12rpx;
  border: 4rpx solid #e8f5e9;
}

.top-avatar.big {
  width: 112rpx;
  height: 112rpx;
  border: 6rpx solid #fff8e1;
}

.top-name {
  font-size: 24rpx;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 6rpx;
}

.top-score {
  font-size: 22rpx;
  color: #f0a500;
  font-weight: 700;
}

.rank-list {
  padding: 0 28rpx;
}

.rank-item {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.rank-num {
  width: 48rpx;
  font-size: 28rpx;
  font-weight: 700;
  color: #7f8c8d;
  text-align: center;
}

.rank-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  margin: 0 20rpx;
}

.rank-info {
  flex: 1;
}

.rank-name {
  font-size: 28rpx;
  color: #2c3e50;
  font-weight: 600;
}

.rank-score-box {
  display: flex;
  align-items: baseline;
}

.rank-score {
  font-size: 32rpx;
  font-weight: 700;
  color: #f0a500;
}

.rank-unit {
  font-size: 22rpx;
  color: #7f8c8d;
  margin-left: 4rpx;
}

.empty-hint {
  text-align: center;
  padding: 80rpx 0;
  color: #bdc3c7;
  font-size: 28rpx;
}
</style>
