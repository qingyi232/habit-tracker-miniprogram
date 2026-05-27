<template>
  <view class="register-page">
    <view class="login-bg">
      <view class="circle c1"></view>
      <view class="circle c2"></view>
    </view>

    <view class="register-content">
      <view class="header">
        <view class="back-btn" @tap="goBack">
          <text class="back-icon">&#x2190;</text>
        </view>
        <text class="page-title">创建账号</text>
        <text class="page-desc">开始你的自律之旅</text>
      </view>

      <view class="form-card">
        <view class="input-group">
          <text class="input-label">账号</text>
          <input class="form-input" v-model="form.zhanghao" placeholder="请输入账号" placeholder-class="placeholder" />
        </view>

        <view class="input-group">
          <text class="input-label">姓名</text>
          <input class="form-input" v-model="form.xingming" placeholder="请输入姓名" placeholder-class="placeholder" />
        </view>

        <view class="input-group">
          <text class="input-label">密码</text>
          <input class="form-input" v-model="form.mima" type="password" placeholder="请输入密码" placeholder-class="placeholder" />
        </view>

        <view class="input-group">
          <text class="input-label">确认密码</text>
          <input class="form-input" v-model="form.confirmPwd" type="password" placeholder="请再次输入密码" placeholder-class="placeholder" />
        </view>

        <button class="register-btn" @tap="handleRegister" :loading="loading">注 册</button>

        <view class="form-footer">
          <text class="link" @tap="goBack">已有账号？返回登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { post } from '../../utils/request.js'

export default {
  data() {
    return {
      form: { zhanghao: '', xingming: '', mima: '', confirmPwd: '' },
      loading: false
    }
  },
  methods: {
    async handleRegister() {
      if (!this.form.zhanghao || !this.form.xingming || !this.form.mima) {
        uni.showToast({ title: '请填写完整信息', icon: 'none' })
        return
      }
      if (this.form.mima !== this.form.confirmPwd) {
        uni.showToast({ title: '两次密码不一致', icon: 'none' })
        return
      }
      this.loading = true
      try {
        const res = await post('/common/register', {
          zhanghao: this.form.zhanghao,
          mima: this.form.mima,
          xingming: this.form.xingming
        })
        if (res.code === 0) {
          uni.showToast({ title: '注册成功', icon: 'success' })
          setTimeout(() => { uni.navigateBack() }, 1000)
        } else {
          uni.showToast({ title: res.msg || '注册失败', icon: 'none' })
        }
      } catch (e) {
        uni.showToast({ title: '注册失败', icon: 'none' })
      }
      this.loading = false
    },
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(160deg, #e8f5e9 0%, #f1f8e9 40%, #fff8e1 100%);
  position: relative;
  overflow: hidden;
}

.login-bg {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.12;
}

.c1 {
  width: 360rpx;
  height: 360rpx;
  background: #43b581;
  top: -60rpx;
  left: -80rpx;
}

.c2 {
  width: 240rpx;
  height: 240rpx;
  background: #f0a500;
  bottom: 60rpx;
  right: -40rpx;
}

.register-content {
  position: relative;
  z-index: 1;
  padding: 0 48rpx;
}

.header {
  padding-top: 120rpx;
  padding-bottom: 40rpx;
}

.back-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30rpx;
}

.back-icon {
  font-size: 32rpx;
  color: #2c3e50;
  font-weight: 700;
}

.page-title {
  display: block;
  font-size: 44rpx;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 10rpx;
}

.page-desc {
  display: block;
  font-size: 26rpx;
  color: #7f8c8d;
}

.form-card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 44rpx 40rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.06);
}

.input-group {
  margin-bottom: 30rpx;
}

.input-label {
  display: block;
  font-size: 26rpx;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 12rpx;
}

.form-input {
  width: 100%;
  height: 86rpx;
  background: #f7f8fa;
  border-radius: 14rpx;
  padding: 0 28rpx;
  font-size: 28rpx;
  color: #2c3e50;
  box-sizing: border-box;
  border: 2rpx solid transparent;
}

.form-input:focus {
  border-color: #43b581;
  background: #fff;
}

.placeholder {
  color: #bdc3c7;
}

.register-btn {
  width: 100%;
  height: 92rpx;
  background: linear-gradient(135deg, #43b581 0%, #2d8a5e 100%);
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 600;
  border-radius: 14rpx;
  border: none;
  margin-top: 16rpx;
  letter-spacing: 8rpx;
  line-height: 92rpx;
}

.register-btn::after {
  border: none;
}

.form-footer {
  display: flex;
  justify-content: center;
  margin-top: 28rpx;
}

.link {
  font-size: 26rpx;
  color: #43b581;
}
</style>
