<template>
  <view class="myplans-page">
    <view class="plan-list" v-if="plans.length > 0">
      <view class="plan-card" v-for="item in plans" :key="item.id" @tap="goPlanDetail(item.id)">
        <image class="plan-img" :src="item.jihuatupian || 'https://picsum.photos/seed/plan/400/300'" mode="aspectFill" />
        <view class="plan-body">
          <text class="plan-title">{{ item.jihuabiaoti }}</text>
          <text class="plan-desc">{{ item.jihuaneirong }}</text>
          <view class="plan-footer">
            <view class="meta">
              <text class="meta-text">{{ formatDate(item.kaishiriqi) }} ~ {{ formatDate(item.jieshushijian) }}</text>
            </view>
            <view :class="['tag', item.wanchengdu === '已完成' ? 'done' : 'ongoing']">
              {{ item.wanchengdu || '进行中' }}
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="empty-state" v-else>
      <text class="empty-icon">&#x1F4CB;</text>
      <text class="empty-text">还没有计划</text>
      <button class="create-btn" @tap="goCreate">创建计划</button>
    </view>

    <view class="load-more" v-if="hasMore" @tap="loadMore">
      <text>加载更多</text>
    </view>
  </view>
</template>

<script>
import { get, getUserInfo } from '../../utils/request.js'

export default {
  data() {
    return {
      plans: [],
      page: 1,
      limit: 10,
      total: 0,
      hasMore: false
    }
  },
  onShow() {
    this.page = 1
    this.loadPlans()
  },
  methods: {
    async loadPlans() {
      const user = getUserInfo()
      try {
        const res = await get('/xuexijihua/list', { userid: user.id, page: this.page, limit: this.limit })
        if (res.code === 0) {
          if (this.page === 1) {
            this.plans = res.data.list
          } else {
            this.plans = [...this.plans, ...res.data.list]
          }
          this.total = res.data.total
          this.hasMore = this.plans.length < this.total
        }
      } catch (e) {}
    },
    loadMore() {
      this.page++
      this.loadPlans()
    },
    goPlanDetail(id) {
      uni.navigateTo({ url: '/pages/plan-detail/plan-detail?id=' + id })
    },
    goCreate() {
      uni.navigateTo({ url: '/pages/create-plan/create-plan' })
    },
    formatDate(d) {
      if (!d) return ''
      return String(d).substring(0, 10)
    }
  }
}
</script>

<style scoped>
.myplans-page {
  padding: 24rpx 28rpx;
  padding-bottom: 60rpx;
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
  display: flex;
}

.plan-img {
  width: 200rpx;
  height: 200rpx;
  flex-shrink: 0;
}

.plan-body {
  flex: 1;
  padding: 20rpx 24rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.plan-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 8rpx;
}

.plan-desc {
  font-size: 24rpx;
  color: #7f8c8d;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 12rpx;
}

.plan-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta-text {
  font-size: 22rpx;
  color: #bdc3c7;
}

.tag {
  font-size: 20rpx;
  padding: 4rpx 14rpx;
  border-radius: 8rpx;
}

.tag.ongoing {
  background: #e8f5e9;
  color: #43b581;
}

.tag.done {
  background: #fff8e1;
  color: #f0a500;
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
  margin-bottom: 32rpx;
}

.create-btn {
  background: linear-gradient(135deg, #43b581 0%, #2d8a5e 100%);
  color: #ffffff;
  font-size: 28rpx;
  border-radius: 40rpx;
  border: none;
  padding: 0 48rpx;
  height: 76rpx;
  line-height: 76rpx;
}

.create-btn::after {
  border: none;
}

.load-more {
  text-align: center;
  padding: 32rpx 0;
  color: #43b581;
  font-size: 26rpx;
}
</style>
