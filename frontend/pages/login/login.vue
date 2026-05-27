<template>
  <view class="login-page">
    <view class="login-bg">
      <view class="circle c1"></view>
      <view class="circle c2"></view>
      <view class="circle c3"></view>
    </view>

    <view class="login-content">
      <view class="logo-area">
        <view class="logo-icon">
          <text class="icon-text">&#x1F331;</text>
        </view>
        <text class="app-title">习惯自律养成</text>
        <text class="app-subtitle">每一天，遇见更好的自己</text>
      </view>

      <view class="form-card">
        <view class="input-group">
          <text class="input-label">账号</text>
          <input class="form-input" v-model="form.username" placeholder="请输入账号" placeholder-class="placeholder" />
        </view>

        <view class="input-group">
          <text class="input-label">密码</text>
          <input class="form-input" v-model="form.password" type="password" placeholder="请输入密码" placeholder-class="placeholder" />
        </view>

        <button class="login-btn" @tap="handleLogin" :loading="loading">登 录</button>

        <view class="form-footer">
          <text class="link" @tap="goRegister">还没有账号？立即注册</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { post, setUserInfo } from '../../utils/request.js'

export default {
  data() {
    return {
      form: { username: '', password: '' },
      loading: false
    }
  },
  methods: {
    async handleLogin() {
      if (!this.form.username || !this.form.password) {
        uni.showToast({ title: '请输入账号和密码', icon: 'none' })
        return
      }
      this.loading = true
      try {
        const res = await post('/common/login', {
          username: this.form.username,
          password: this.form.password,
          role: '用户'
        })
        if (res.code === 0) {
          setUserInfo(res.data)
          uni.showToast({ title: '登录成功', icon: 'success' })
          setTimeout(() => {
            uni.switchTab({ url: '/pages/index/index' })
          }, 500)
        } else {
          uni.showToast({ title: res.msg || '登录失败', icon: 'none' })
        }
      } catch (e) {
        uni.showToast({ title: '登录失败', icon: 'none' })
      }
      this.loading = false
    },
    goRegister() {
      uni.navigateTo({ url: '/pages/register/register' })
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(160deg, #e8f5e9 0%, #f1f8e9 40%, #fff8e1 100%);
  position: relative;
  overflow: hidden;
}

.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.12;
}

.c1 {
  width: 400rpx;
  height: 400rpx;
  background: #43b581;
  top: -100rpx;
  right: -80rpx;
}

.c2 {
  width: 260rpx;
  height: 260rpx;
  background: #f0a500;
  top: 200rpx;
  left: -60rpx;
}

.c3 {
  width: 320rpx;
  height: 320rpx;
  background: #43b581;
  bottom: 100rpx;
  right: -40rpx;
}

.login-content {
  position: relative;
  z-index: 1;
  padding: 0 48rpx;
}

.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 180rpx;
  padding-bottom: 60rpx;
}

.logo-icon {
  width: 140rpx;
  height: 140rpx;
  border-radius: 36rpx;
  background: rgba(67, 181, 129, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30rpx;
}

.icon-text {
  font-size: 72rpx;
}

.app-title {
  font-size: 48rpx;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 12rpx;
}

.app-subtitle {
  font-size: 26rpx;
  color: #7f8c8d;
}

.form-card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 48rpx 40rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.06);
}

.input-group {
  margin-bottom: 36rpx;
}

.input-label {
  display: block;
  font-size: 26rpx;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 14rpx;
}

.form-input {
  width: 100%;
  height: 88rpx;
  background: #f7f8fa;
  border-radius: 14rpx;
  padding: 0 28rpx;
  font-size: 28rpx;
  color: #2c3e50;
  box-sizing: border-box;
  border: 2rpx solid transparent;
  transition: all 0.3s;
}

.form-input:focus {
  border-color: #43b581;
  background: #fff;
}

.placeholder {
  color: #bdc3c7;
}

.login-btn {
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

.login-btn::after {
  border: none;
}

.form-footer {
  display: flex;
  justify-content: center;
  margin-top: 32rpx;
}

.link {
  font-size: 26rpx;
  color: #43b581;
}
</style>
