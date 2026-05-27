<template>
  <view class="checkin-page">
    <view class="plan-brief" v-if="plan">
      <image class="brief-img" :src="plan.jihuatupian || 'https://picsum.photos/seed/plan/400/300'" mode="aspectFill" />
      <view class="brief-info">
        <text class="brief-title">{{ plan.jihuabiaoti }}</text>
        <text class="brief-meta">计划 {{ plan.jihuatianshu }} 天 · {{ plan.wanchengdu }}</text>
      </view>
    </view>

    <view class="form-section">
      <view class="input-group">
        <text class="label">打卡日期</text>
        <picker mode="date" :value="form.dakariqi" :end="today" @change="onDateChange">
          <view class="picker-view">
            <text :class="form.dakariqi ? 'picker-text' : 'picker-placeholder'">
              {{ form.dakariqi || '选择打卡日期' }}
            </text>
            <text class="picker-arrow">&#x276F;</text>
          </view>
        </picker>
        <view class="makeup-tag" v-if="isMakeup">
          <text class="makeup-text">📌 补打卡（非当天打卡）</text>
        </view>
      </view>

      <view class="input-group">
        <text class="label">打卡天数（第几天）</text>
        <input class="form-input" v-model="form.dakatianshu" type="number" placeholder="输入第几天" placeholder-class="placeholder" />
      </view>

      <view class="input-group">
        <text class="label">今日心得</text>
        <textarea class="form-textarea" v-model="form.jihuaneirong" placeholder="记录今天的学习心得..." placeholder-class="placeholder" />
      </view>
    </view>

    <view class="reward-hint">
      <text class="hint-icon">&#x2728;</text>
      <text class="hint-text">打卡成功可获得 10 积分奖励</text>
    </view>

    <button class="submit-btn" @tap="handleCheckin" :loading="loading">
      &#x2714; 完成打卡
    </button>
  </view>
</template>

<script>
import { get, post, getUserInfo } from '../../utils/request.js'

export default {
  data() {
    return {
      planId: null,
      plan: null,
      today: '',
      form: {
        dakariqi: '',
        dakatianshu: '',
        jihuaneirong: ''
      },
      loading: false
    }
  },
  computed: {
    isMakeup() {
      return this.form.dakariqi && this.form.dakariqi !== this.today
    }
  },
  onLoad(options) {
    this.planId = options.planId
    this.loadPlan()
    const today = new Date()
    const todayStr = today.toISOString().substring(0, 10)
    this.today = todayStr
    this.form.dakariqi = todayStr
  },
  methods: {
    async loadPlan() {
      try {
        const res = await get('/xuexijihua/info/' + this.planId)
        if (res.code === 0) this.plan = res.data
      } catch (e) {}
    },
    onDateChange(e) {
      this.form.dakariqi = e.detail.value
    },
    async handleCheckin() {
      if (!this.form.dakariqi) {
        uni.showToast({ title: '请选择打卡日期', icon: 'none' }); return
      }
      if (!this.form.dakatianshu) {
        uni.showToast({ title: '请输入打卡天数', icon: 'none' }); return
      }
      if (!this.form.jihuaneirong) {
        uni.showToast({ title: '请填写今日心得', icon: 'none' }); return
      }

      const user = getUserInfo()
      this.loading = true
      try {
        const res = await post('/jihuadaka/add', {
          jihuabiaoti: this.plan.jihuabiaoti,
          jihuatupian: this.plan.jihuatupian,
          kaishiriqi: (this.plan.kaishiriqi || '').substring(0, 10),
          jihuaneirong: this.form.jihuaneirong,
          jieshushijian: (this.plan.jieshushijian || '').substring(0, 10),
          jihuatianshu: this.plan.jihuatianshu,
          wanchengdu: this.plan.wanchengdu,
          dakariqi: this.form.dakariqi,
          dakatianshu: Number(this.form.dakatianshu),
          zhanghao: user.zhanghao,
          xingming: user.xingming,
          userid: user.id,
          jihuaid: this.planId,
          budaka: this.isMakeup ? 1 : 0
        })
        if (res.code === 0) {
          uni.showToast({ title: '打卡成功！积分+10', icon: 'success' })
          setTimeout(() => uni.navigateBack(), 1200)
        } else {
          uni.showToast({ title: res.msg || '打卡失败', icon: 'none' })
        }
      } catch (e) {
        uni.showToast({ title: '打卡失败', icon: 'none' })
      }
      this.loading = false
    }
  }
}
</script>

<style scoped>
.checkin-page {
  padding: 28rpx;
  padding-bottom: 60rpx;
}

.plan-brief {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 28rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.brief-img {
  width: 120rpx;
  height: 90rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
}

.brief-info {
  flex: 1;
}

.brief-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 8rpx;
}

.brief-meta {
  font-size: 24rpx;
  color: #7f8c8d;
}

.form-section {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 32rpx 28rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);
}

.input-group {
  margin-bottom: 32rpx;
}

.input-group:last-child {
  margin-bottom: 0;
}

.label {
  display: block;
  font-size: 26rpx;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 14rpx;
}

.form-input {
  width: 100%;
  height: 86rpx;
  background: #f7f8fa;
  border-radius: 14rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  color: #2c3e50;
  box-sizing: border-box;
}

.form-textarea {
  width: 100%;
  height: 200rpx;
  background: #f7f8fa;
  border-radius: 14rpx;
  padding: 20rpx 24rpx;
  font-size: 28rpx;
  color: #2c3e50;
  box-sizing: border-box;
}

.placeholder {
  color: #bdc3c7;
}

.makeup-tag {
  margin-top: 12rpx;
  background: #fff3e0;
  border-radius: 8rpx;
  padding: 10rpx 16rpx;
}

.makeup-text {
  font-size: 22rpx;
  color: #e67e22;
}

.picker-view {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 86rpx;
  background: #f7f8fa;
  border-radius: 14rpx;
  padding: 0 24rpx;
}

.picker-text {
  font-size: 28rpx;
  color: #2c3e50;
}

.picker-placeholder {
  font-size: 28rpx;
  color: #bdc3c7;
}

.picker-arrow {
  color: #bdc3c7;
}

.reward-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
  margin-bottom: 28rpx;
}

.hint-icon {
  font-size: 28rpx;
  margin-right: 10rpx;
}

.hint-text {
  font-size: 26rpx;
  color: #f0a500;
  font-weight: 500;
}

.submit-btn {
  width: 100%;
  height: 92rpx;
  line-height: 92rpx;
  background: linear-gradient(135deg, #43b581 0%, #2d8a5e 100%);
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 600;
  border-radius: 14rpx;
  border: none;
}

.submit-btn::after {
  border: none;
}
</style>
