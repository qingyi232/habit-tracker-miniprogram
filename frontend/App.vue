<script>
export default {
  onLaunch() {
    const userInfo = uni.getStorageSync('userInfo')
    if (!userInfo) {
      uni.reLaunch({ url: '/pages/login/login' })
    }
  }
}
</script>

<style>
page {
  background-color: #f7f8fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  color: #2c3e50;
  font-size: 28rpx;
  line-height: 1.6;
}

.container {
  padding: 24rpx;
}

.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
