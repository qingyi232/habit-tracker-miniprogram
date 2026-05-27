<template>
  <view class="edit-page">
    <view class="form-section">
      <view class="input-group">
        <text class="label">姓名</text>
        <input class="form-input" v-model="form.xingming" placeholder="请输入姓名" placeholder-class="placeholder" />
      </view>

      <view class="input-group">
        <text class="label">性别</text>
        <picker :range="genderList" :value="genderIndex" @change="onGenderChange">
          <view class="picker-view">
            <text class="picker-text">{{ form.xingbie || '请选择' }}</text>
            <text class="picker-arrow">&#x276F;</text>
          </view>
        </picker>
      </view>

      <view class="input-group">
        <text class="label">年龄</text>
        <input class="form-input" v-model="form.nianling" type="number" placeholder="请输入年龄" placeholder-class="placeholder" />
      </view>

      <view class="input-group">
        <text class="label">手机</text>
        <input class="form-input" v-model="form.shouji" placeholder="请输入手机号" placeholder-class="placeholder" />
      </view>

      <view class="input-group">
        <text class="label">邮箱</text>
        <input class="form-input" v-model="form.youxiang" placeholder="请输入邮箱" placeholder-class="placeholder" />
      </view>

      <view class="input-group">
        <text class="label">头像链接</text>
        <input class="form-input" v-model="form.zhaopian" placeholder="输入头像图片链接" placeholder-class="placeholder" />
        <view class="avatar-preview" v-if="form.zhaopian">
          <image :src="form.zhaopian" mode="aspectFill" class="preview-avatar" />
        </view>
      </view>

      <view class="input-group">
        <text class="label">修改密码</text>
        <input class="form-input" v-model="form.mima" type="password" placeholder="不修改请留空" placeholder-class="placeholder" />
      </view>
    </view>

    <button class="save-btn" @tap="handleSave" :loading="loading">保存修改</button>
  </view>
</template>

<script>
import { get, put, getUserInfo, setUserInfo } from '../../utils/request.js'

export default {
  data() {
    return {
      form: {
        zhanghao: '',
        mima: '',
        xingming: '',
        xingbie: '',
        nianling: '',
        shouji: '',
        youxiang: '',
        zhaopian: ''
      },
      genderList: ['男', '女'],
      genderIndex: 0,
      loading: false,
      userId: null
    }
  },
  onLoad() {
    this.loadUserInfo()
  },
  methods: {
    async loadUserInfo() {
      const user = getUserInfo()
      this.userId = user.id
      try {
        const res = await get('/yonghu/info/' + user.id)
        if (res.code === 0 && res.data) {
          const d = res.data
          this.form = {
            zhanghao: d.zhanghao || '',
            mima: '',
            xingming: d.xingming || '',
            xingbie: d.xingbie || '',
            nianling: d.nianling ? String(d.nianling) : '',
            shouji: d.shouji || '',
            youxiang: d.youxiang || '',
            zhaopian: d.zhaopian || ''
          }
          this.genderIndex = this.genderList.indexOf(d.xingbie) >= 0 ? this.genderList.indexOf(d.xingbie) : 0
        }
      } catch (e) {}
    },
    onGenderChange(e) {
      this.genderIndex = e.detail.value
      this.form.xingbie = this.genderList[this.genderIndex]
    },
    async handleSave() {
      if (!this.form.xingming) {
        uni.showToast({ title: '请输入姓名', icon: 'none' }); return
      }
      this.loading = true
      try {
        const data = { ...this.form }
        if (!data.mima) {
          const currentUser = await get('/yonghu/info/' + this.userId)
          data.mima = currentUser.data.mima
        }
        data.nianling = data.nianling ? Number(data.nianling) : null
        const res = await put('/yonghu/update/' + this.userId, data)
        if (res.code === 0) {
          const oldUser = getUserInfo()
          setUserInfo({ ...oldUser, xingming: data.xingming, zhanghao: data.zhanghao })
          uni.showToast({ title: '保存成功', icon: 'success' })
          setTimeout(() => uni.navigateBack(), 800)
        } else {
          uni.showToast({ title: res.msg || '保存失败', icon: 'none' })
        }
      } catch (e) {
        uni.showToast({ title: '保存失败', icon: 'none' })
      }
      this.loading = false
    }
  }
}
</script>

<style scoped>
.edit-page {
  padding: 28rpx;
  padding-bottom: 60rpx;
}

.form-section {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 32rpx 28rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);
}

.input-group {
  margin-bottom: 28rpx;
}

.input-group:last-child {
  margin-bottom: 0;
}

.label {
  display: block;
  font-size: 26rpx;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12rpx;
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
  border: 2rpx solid transparent;
}

.form-input:focus {
  border-color: #43b581;
  background: #fff;
}

.placeholder {
  color: #bdc3c7;
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

.picker-arrow {
  color: #bdc3c7;
}

.avatar-preview {
  margin-top: 16rpx;
  display: flex;
  justify-content: center;
}

.preview-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid #e8f5e9;
}

.save-btn {
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

.save-btn::after {
  border: none;
}
</style>
