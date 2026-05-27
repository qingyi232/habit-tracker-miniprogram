<template>
  <view class="my-page">
    <!-- 个人信息卡片 -->
    <view class="profile-card">
      <view class="profile-bg"></view>
      <view class="profile-content">
        <image class="avatar" :src="userInfo.zhaopian || 'https://picsum.photos/seed/avatar/100/100'" mode="aspectFill" />
        <text class="nickname">{{ userInfo.xingming || '未设置' }}</text>
        <text class="account">账号：{{ userInfo.zhanghao || '' }}</text>
        <view class="stats-row">
          <view class="stat-item">
            <text class="stat-num">{{ userInfo.jifen || 0 }}</text>
            <text class="stat-label">积分</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-num">{{ planCount }}</text>
            <text class="stat-label">计划</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-num">{{ checkinCount }}</text>
            <text class="stat-label">打卡</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 菜单列表 -->
    <view class="menu-card">
      <view class="menu-item" @tap="goEditProfile">
        <text class="menu-icon">&#x1F464;</text>
        <text class="menu-text">编辑资料</text>
        <text class="menu-arrow">&#x276F;</text>
      </view>
      <view class="menu-item" @tap="goMyPlans">
        <text class="menu-icon">&#x1F4CB;</text>
        <text class="menu-text">我的计划</text>
        <text class="menu-arrow">&#x276F;</text>
      </view>
      <view class="menu-item" @tap="goCalendar">
        <text class="menu-icon">&#x1F4C5;</text>
        <text class="menu-text">打卡日历</text>
        <text class="menu-arrow">&#x276F;</text>
      </view>
      <view class="menu-item" @tap="goHistory">
        <text class="menu-icon">&#x1F3C6;</text>
        <text class="menu-text">计划历史</text>
        <text class="menu-arrow">&#x276F;</text>
      </view>
      <view class="menu-item" @tap="goLeaderboard">
        <text class="menu-icon">&#x1F4CA;</text>
        <text class="menu-text">积分排行</text>
        <text class="menu-arrow">&#x276F;</text>
      </view>
    </view>

    <view class="menu-card">
      <view class="menu-item" @tap="goCommunity">
        <text class="menu-icon">&#x1F4AC;</text>
        <text class="menu-text">交流社区</text>
        <text class="menu-arrow">&#x276F;</text>
      </view>
      <view class="menu-item" @tap="goCreatePlan">
        <text class="menu-icon">&#x2795;</text>
        <text class="menu-text">创建计划</text>
        <text class="menu-arrow">&#x276F;</text>
      </view>
    </view>

    <button class="logout-btn" @tap="handleLogout">退出登录</button>
  </view>
</template>

<script>
import { get, getUserInfo, clearUserInfo } from '../../utils/request.js'

export default {
  data() {
    return {
      userInfo: {},
      planCount: 0,
      checkinCount: 0
    }
  },
  onShow() {
    this.userInfo = getUserInfo()
    if (!this.userInfo.id) {
      uni.reLaunch({ url: '/pages/login/login' })
      return
    }
    this.loadStats()
  },
  methods: {
    async loadStats() {
      try {
        const userRes = await get('/yonghu/info/' + this.userInfo.id)
        if (userRes.code === 0 && userRes.data) {
          this.userInfo = { ...this.userInfo, ...userRes.data }
        }
      } catch (e) {}
      try {
        const planRes = await get('/xuexijihua/list', { userid: this.userInfo.id, limit: 1 })
        if (planRes.code === 0) this.planCount = planRes.data.total
      } catch (e) {}
      try {
        const checkRes = await get('/jihuadaka/list', { userid: this.userInfo.id, limit: 1 })
        if (checkRes.code === 0) this.checkinCount = checkRes.data.total
      } catch (e) {}
    },
    goEditProfile() {
      uni.navigateTo({ url: '/pages/edit-profile/edit-profile' })
    },
    goMyPlans() {
      uni.navigateTo({ url: '/pages/my-plans/my-plans' })
    },
    goCalendar() {
      uni.navigateTo({ url: '/pages/calendar/calendar' })
    },
    goHistory() {
      uni.navigateTo({ url: '/pages/plan-history/plan-history' })
    },
    goLeaderboard() {
      uni.switchTab({ url: '/pages/leaderboard/leaderboard' })
    },
    goCommunity() {
      uni.switchTab({ url: '/pages/community/community' })
    },
    goCreatePlan() {
      uni.navigateTo({ url: '/pages/create-plan/create-plan' })
    },
    handleLogout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            clearUserInfo()
            uni.reLaunch({ url: '/pages/login/login' })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.my-page {
  padding-bottom: 60rpx;
}

.profile-card {
  position: relative;
  margin-bottom: 24rpx;
}

.profile-bg {
  height: 280rpx;
  background: linear-gradient(135deg, #43b581 0%, #2d8a5e 60%, #1a6b42 100%);
  border-radius: 0 0 40rpx 40rpx;
}

.profile-content {
  position: relative;
  margin-top: -140rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 40rpx;
}

.avatar {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  border: 6rpx solid #ffffff;
  margin-bottom: 16rpx;
  background: #e8f5e9;
}

.nickname {
  font-size: 36rpx;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 6rpx;
}

.account {
  font-size: 24rpx;
  color: #7f8c8d;
  margin-bottom: 28rpx;
}

.stats-row {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 20rpx;
  padding: 28rpx 48rpx;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);
  width: 100%;
  justify-content: space-around;
  box-sizing: border-box;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-size: 36rpx;
  font-weight: 700;
  color: #2c3e50;
}

.stat-label {
  font-size: 22rpx;
  color: #7f8c8d;
  margin-top: 6rpx;
}

.stat-divider {
  width: 2rpx;
  height: 48rpx;
  background: #eef0f2;
}

.menu-card {
  background: #ffffff;
  border-radius: 20rpx;
  margin: 0 28rpx 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 32rpx 28rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  font-size: 36rpx;
  margin-right: 20rpx;
}

.menu-text {
  flex: 1;
  font-size: 28rpx;
  color: #2c3e50;
}

.menu-arrow {
  font-size: 28rpx;
  color: #bdc3c7;
}

.logout-btn {
  margin: 40rpx 28rpx 0;
  height: 88rpx;
  line-height: 88rpx;
  background: #ffffff;
  color: #e74c3c;
  font-size: 30rpx;
  border-radius: 20rpx;
  border: 2rpx solid #fde8e8;
}

.logout-btn::after {
  border: none;
}
</style>
