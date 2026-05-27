<template>
  <view class="create-page">
    <!-- 模版快捷选择 -->
    <view class="template-section">
      <text class="section-label">快捷模版</text>
      <text class="section-hint">选择模版自动填充，也可手动修改</text>
      <scroll-view scroll-x class="template-scroll">
        <view class="template-list">
          <view
            v-for="(tpl, idx) in templates"
            :key="idx"
            :class="['template-item', selectedTpl === idx ? 'active' : '']"
            @tap="applyTemplate(idx)"
          >
            <text class="tpl-icon">{{ tpl.icon }}</text>
            <text class="tpl-name">{{ tpl.name }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="form-section">
      <view class="input-group">
        <text class="label">计划标题</text>
        <input class="form-input" v-model="form.jihuabiaoti" placeholder="输入计划标题" placeholder-class="placeholder" />
      </view>

      <view class="input-group">
        <text class="label">计划图片</text>
        <input class="form-input" v-model="form.jihuatupian" placeholder="输入图片链接（可选）" placeholder-class="placeholder" />
        <view class="img-preview" v-if="form.jihuatupian">
          <image :src="form.jihuatupian" mode="aspectFill" class="preview-img" />
        </view>
      </view>

      <view class="input-group">
        <text class="label">开始日期</text>
        <picker mode="date" :value="form.kaishiriqi" @change="onStartDateChange">
          <view class="picker-view">
            <text :class="form.kaishiriqi ? 'picker-text' : 'picker-placeholder'">
              {{ form.kaishiriqi || '选择开始日期' }}
            </text>
            <text class="picker-arrow">&#x276F;</text>
          </view>
        </picker>
      </view>

      <view class="input-group">
        <text class="label">结束日期</text>
        <picker mode="date" :value="form.jieshushijian" @change="onEndDateChange">
          <view class="picker-view">
            <text :class="form.jieshushijian ? 'picker-text' : 'picker-placeholder'">
              {{ form.jieshushijian || '选择结束日期' }}
            </text>
            <text class="picker-arrow">&#x276F;</text>
          </view>
        </picker>
      </view>

      <view class="input-group">
        <text class="label">计划天数</text>
        <input class="form-input" v-model="form.jihuatianshu" type="number" placeholder="自动计算或手动输入" placeholder-class="placeholder" />
      </view>

      <view class="input-group">
        <text class="label">计划内容</text>
        <textarea class="form-textarea" v-model="form.jihuaneirong" placeholder="详细描述你的计划内容..." placeholder-class="placeholder" :maxlength="500" />
      </view>
    </view>

    <button class="submit-btn" @tap="handleSubmit" :loading="loading">提交计划</button>
  </view>
</template>

<script>
import { post, getUserInfo } from '../../utils/request.js'

export default {
  data() {
    return {
      selectedTpl: -1,
      templates: [
        { name: '减肥', icon: '🏃', title: '每日减肥打卡', days: 30, content: '每天运动30分钟+控制饮食，记录体重变化和运动内容。', image: 'https://picsum.photos/seed/fitness/400/300' },
        { name: '读书', icon: '📚', title: '每日阅读打卡', days: 21, content: '每天阅读30分钟以上，记录阅读书目和心得体会。', image: 'https://picsum.photos/seed/reading/400/300' },
        { name: '运动', icon: '💪', title: '每日运动打卡', days: 30, content: '每天坚持运动，跑步、健身或球类运动，记录运动时长和类型。', image: 'https://picsum.photos/seed/sport/400/300' },
        { name: '喝水', icon: '💧', title: '每日喝水打卡', days: 14, content: '每天喝够8杯水（约2000ml），分时段记录饮水量。', image: 'https://picsum.photos/seed/water/400/300' },
        { name: '练字', icon: '✍️', title: '每日练字打卡', days: 21, content: '每天练字30分钟，临摹字帖或自由书写，拍照记录进步。', image: 'https://picsum.photos/seed/writing/400/300' },
        { name: '早起', icon: '🌅', title: '早起打卡挑战', days: 21, content: '每天6:30前起床，利用早晨时间学习或运动，养成早起习惯。', image: 'https://picsum.photos/seed/morning/400/300' }
      ],
      form: {
        jihuabiaoti: '',
        jihuatupian: '',
        kaishiriqi: '',
        jieshushijian: '',
        jihuatianshu: '',
        jihuaneirong: ''
      },
      loading: false
    }
  },
  methods: {
    applyTemplate(idx) {
      if (this.selectedTpl === idx) {
        this.selectedTpl = -1
        return
      }
      this.selectedTpl = idx
      const tpl = this.templates[idx]
      this.form.jihuabiaoti = tpl.title
      this.form.jihuatupian = tpl.image
      this.form.jihuaneirong = tpl.content
      this.form.jihuatianshu = String(tpl.days)
      const today = new Date()
      this.form.kaishiriqi = today.toISOString().substring(0, 10)
      const end = new Date(today.getTime() + tpl.days * 86400000)
      this.form.jieshushijian = end.toISOString().substring(0, 10)
    },
    onStartDateChange(e) {
      this.form.kaishiriqi = e.detail.value
      this.calcDays()
    },
    onEndDateChange(e) {
      this.form.jieshushijian = e.detail.value
      this.calcDays()
    },
    calcDays() {
      if (this.form.kaishiriqi && this.form.jieshushijian) {
        const start = new Date(this.form.kaishiriqi)
        const end = new Date(this.form.jieshushijian)
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
        if (diff > 0) this.form.jihuatianshu = String(diff)
      }
    },
    async handleSubmit() {
      if (!this.form.jihuabiaoti) {
        uni.showToast({ title: '请输入计划标题', icon: 'none' }); return
      }
      if (!this.form.kaishiriqi || !this.form.jieshushijian) {
        uni.showToast({ title: '请选择起止日期', icon: 'none' }); return
      }
      if (!this.form.jihuaneirong) {
        uni.showToast({ title: '请输入计划内容', icon: 'none' }); return
      }

      const user = getUserInfo()
      this.loading = true
      try {
        const images = [
          'https://picsum.photos/seed/english/400/300',
          'https://picsum.photos/seed/math/400/300',
          'https://picsum.photos/seed/plan/400/300',
          'https://picsum.photos/seed/python/400/300',
          'https://picsum.photos/seed/morning/400/300'
        ]
        const randomImg = images[Math.floor(Math.random() * images.length)]

        const res = await post('/xuexijihua/add', {
          ...this.form,
          jihuatupian: this.form.jihuatupian || randomImg,
          wanchengdu: '未完成',
          zhanghao: user.zhanghao,
          xingming: user.xingming,
          userid: user.id
        })
        if (res.code === 0) {
          uni.showToast({ title: '创建成功', icon: 'success' })
          setTimeout(() => uni.navigateBack(), 1000)
        } else {
          uni.showToast({ title: res.msg || '创建失败', icon: 'none' })
        }
      } catch (e) {
        uni.showToast({ title: '创建失败', icon: 'none' })
      }
      this.loading = false
    }
  }
}
</script>

<style scoped>
.create-page {
  padding: 28rpx;
  padding-bottom: 60rpx;
}

.template-section {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 24rpx 28rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);
}

.section-label {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 6rpx;
}

.section-hint {
  display: block;
  font-size: 22rpx;
  color: #95a5a6;
  margin-bottom: 20rpx;
}

.template-scroll {
  white-space: nowrap;
}

.template-list {
  display: inline-flex;
  gap: 16rpx;
}

.template-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 140rpx;
  height: 130rpx;
  background: #f7f8fa;
  border-radius: 16rpx;
  border: 2rpx solid transparent;
  transition: all 0.2s;
}

.template-item.active {
  background: #e8f5e9;
  border-color: #43b581;
}

.tpl-icon {
  font-size: 40rpx;
  margin-bottom: 8rpx;
}

.tpl-name {
  font-size: 24rpx;
  font-weight: 600;
  color: #2c3e50;
}

.template-item.active .tpl-name {
  color: #2d8a5e;
}

.form-section {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 32rpx 28rpx;
  margin-bottom: 32rpx;
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
  border: 2rpx solid transparent;
}

.form-input:focus {
  border-color: #43b581;
  background: #fff;
}

.form-textarea {
  width: 100%;
  height: 240rpx;
  background: #f7f8fa;
  border-radius: 14rpx;
  padding: 20rpx 24rpx;
  font-size: 28rpx;
  color: #2c3e50;
  box-sizing: border-box;
  border: 2rpx solid transparent;
}

.form-textarea:focus {
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

.picker-placeholder {
  font-size: 28rpx;
  color: #bdc3c7;
}

.picker-arrow {
  color: #bdc3c7;
}

.img-preview {
  margin-top: 16rpx;
}

.preview-img {
  width: 100%;
  height: 280rpx;
  border-radius: 14rpx;
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
