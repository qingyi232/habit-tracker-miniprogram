<template>
  <view class="calendar-page">
    <!-- 月份切换 -->
    <view class="month-header">
      <view class="month-btn" @tap="prevMonth">◀</view>
      <text class="month-title">{{ year }}年{{ month }}月</text>
      <view class="month-btn" @tap="nextMonth">▶</view>
    </view>

    <!-- 视图切换 -->
    <view class="view-tabs">
      <view :class="['tab', viewMode === 'month' ? 'active' : '']" @tap="viewMode = 'month'">月视图</view>
      <view :class="['tab', viewMode === 'week' ? 'active' : '']" @tap="viewMode = 'week'">周视图</view>
    </view>

    <!-- 星期头部 -->
    <view class="week-header">
      <text class="week-day" v-for="d in weekDays" :key="d">{{ d }}</text>
    </view>

    <!-- 日历格子 -->
    <view class="cal-grid">
      <view
        v-for="(day, idx) in displayDays"
        :key="idx"
        :class="['cal-cell', day.isToday ? 'today' : '', day.hasCheckin ? 'checked' : '', day.isOtherMonth ? 'other' : '', selectedDate === day.dateStr ? 'selected' : '']"
        @tap="selectDate(day)"
      >
        <text class="cal-day">{{ day.day }}</text>
        <view class="dot" v-if="day.hasCheckin"></view>
      </view>
    </view>

    <!-- 选中日期的打卡记录 -->
    <view class="day-detail" v-if="selectedDate">
      <text class="detail-title">{{ selectedDate }} 打卡记录</text>
      <view class="detail-list" v-if="dayCheckins.length > 0">
        <view class="detail-card" v-for="item in dayCheckins" :key="item.id">
          <text class="detail-plan">{{ item.jihuabiaoti }}</text>
          <text class="detail-content">{{ item.jihuaneirong }}</text>
          <text class="detail-day">第 {{ item.dakatianshu }} 天</text>
        </view>
      </view>
      <view class="empty-day" v-else>
        <text class="empty-day-text">当天无打卡记录</text>
      </view>
    </view>

    <!-- 月度统计 -->
    <view class="month-stats">
      <view class="ms-item">
        <text class="ms-num">{{ monthCheckinDays }}</text>
        <text class="ms-label">打卡天数</text>
      </view>
      <view class="ms-item">
        <text class="ms-num">{{ monthTotalCheckins }}</text>
        <text class="ms-label">打卡次数</text>
      </view>
      <view class="ms-item">
        <text class="ms-num">{{ monthRate }}%</text>
        <text class="ms-label">出勤率</text>
      </view>
    </view>
  </view>
</template>

<script>
import { get, getUserInfo } from '../../utils/request.js'

export default {
  data() {
    return {
      year: 0,
      month: 0,
      viewMode: 'month',
      weekDays: ['日', '一', '二', '三', '四', '五', '六'],
      allCheckins: [],
      checkinDateSet: new Set(),
      selectedDate: '',
      dayCheckins: []
    }
  },
  computed: {
    displayDays() {
      if (this.viewMode === 'month') return this.getMonthDays()
      return this.getWeekDays()
    },
    monthCheckinDays() {
      const prefix = `${this.year}-${String(this.month).padStart(2, '0')}`
      const days = new Set()
      this.allCheckins.forEach(c => {
        const d = String(c.dakariqi || '').substring(0, 10)
        if (d.startsWith(prefix)) days.add(d)
      })
      return days.size
    },
    monthTotalCheckins() {
      const prefix = `${this.year}-${String(this.month).padStart(2, '0')}`
      return this.allCheckins.filter(c => String(c.dakariqi || '').substring(0, 10).startsWith(prefix)).length
    },
    monthRate() {
      const daysInMonth = new Date(this.year, this.month, 0).getDate()
      const now = new Date()
      const isCurrentMonth = this.year === now.getFullYear() && this.month === now.getMonth() + 1
      const totalDays = isCurrentMonth ? now.getDate() : daysInMonth
      if (totalDays === 0) return 0
      return Math.round((this.monthCheckinDays / totalDays) * 100)
    }
  },
  onLoad() {
    const now = new Date()
    this.year = now.getFullYear()
    this.month = now.getMonth() + 1
    this.selectedDate = now.toISOString().substring(0, 10)
    this.loadCheckins()
  },
  methods: {
    async loadCheckins() {
      const user = getUserInfo()
      if (!user.id) return
      try {
        const res = await get('/jihuadaka/list', { userid: user.id, limit: 999 })
        if (res.code === 0) {
          this.allCheckins = res.data.list || []
          this.checkinDateSet = new Set(this.allCheckins.map(c => String(c.dakariqi || '').substring(0, 10)))
          this.filterDayCheckins()
        }
      } catch (e) {}
    },
    getMonthDays() {
      const firstDay = new Date(this.year, this.month - 1, 1).getDay()
      const daysInMonth = new Date(this.year, this.month, 0).getDate()
      const today = new Date().toISOString().substring(0, 10)
      const days = []
      const prevMonthDays = new Date(this.year, this.month - 1, 0).getDate()
      for (let i = firstDay - 1; i >= 0; i--) {
        const d = prevMonthDays - i
        const m = this.month - 1 <= 0 ? 12 : this.month - 1
        const y = this.month - 1 <= 0 ? this.year - 1 : this.year
        const ds = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
        days.push({ day: d, dateStr: ds, isToday: ds === today, hasCheckin: this.checkinDateSet.has(ds), isOtherMonth: true })
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const ds = `${this.year}-${String(this.month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
        days.push({ day: d, dateStr: ds, isToday: ds === today, hasCheckin: this.checkinDateSet.has(ds), isOtherMonth: false })
      }
      const remaining = 42 - days.length
      for (let d = 1; d <= remaining; d++) {
        const m = this.month + 1 > 12 ? 1 : this.month + 1
        const y = this.month + 1 > 12 ? this.year + 1 : this.year
        const ds = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
        days.push({ day: d, dateStr: ds, isToday: ds === today, hasCheckin: this.checkinDateSet.has(ds), isOtherMonth: true })
      }
      return days
    },
    getWeekDays() {
      const today = new Date()
      const dayOfWeek = today.getDay()
      const days = []
      const todayStr = today.toISOString().substring(0, 10)
      for (let i = 0; i < 7; i++) {
        const d = new Date(today)
        d.setDate(today.getDate() - dayOfWeek + i)
        const ds = d.toISOString().substring(0, 10)
        days.push({ day: d.getDate(), dateStr: ds, isToday: ds === todayStr, hasCheckin: this.checkinDateSet.has(ds), isOtherMonth: false })
      }
      return days
    },
    prevMonth() {
      if (this.month === 1) { this.year--; this.month = 12 }
      else this.month--
    },
    nextMonth() {
      if (this.month === 12) { this.year++; this.month = 1 }
      else this.month++
    },
    selectDate(day) {
      this.selectedDate = day.dateStr
      this.filterDayCheckins()
    },
    filterDayCheckins() {
      this.dayCheckins = this.allCheckins.filter(c => String(c.dakariqi || '').substring(0, 10) === this.selectedDate)
    }
  }
}
</script>

<style scoped>
.calendar-page { padding: 24rpx 28rpx; padding-bottom: 60rpx; }
.month-header { display: flex; justify-content: space-between; align-items: center; padding: 20rpx 0; margin-bottom: 16rpx; }
.month-btn { width: 64rpx; height: 64rpx; display: flex; align-items: center; justify-content: center; background: #f7f8fa; border-radius: 50%; font-size: 28rpx; color: #2c3e50; }
.month-title { font-size: 34rpx; font-weight: 700; color: #2c3e50; }
.view-tabs { display: flex; background: #f7f8fa; border-radius: 12rpx; padding: 4rpx; margin-bottom: 20rpx; }
.tab { flex: 1; text-align: center; padding: 14rpx 0; font-size: 26rpx; color: #7f8c8d; border-radius: 10rpx; }
.tab.active { background: #43b581; color: #fff; font-weight: 600; }
.week-header { display: grid; grid-template-columns: repeat(7, 1fr); margin-bottom: 8rpx; }
.week-day { text-align: center; font-size: 24rpx; color: #95a5a6; font-weight: 600; padding: 12rpx 0; }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6rpx; margin-bottom: 24rpx; }
.cal-cell { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 80rpx; border-radius: 12rpx; position: relative; background: #fff; }
.cal-cell.other { opacity: 0.3; }
.cal-cell.today { background: #e8f5e9; }
.cal-cell.checked { background: #43b581; }
.cal-cell.checked .cal-day { color: #fff; }
.cal-cell.selected { border: 3rpx solid #2d8a5e; }
.cal-day { font-size: 28rpx; color: #2c3e50; font-weight: 500; }
.dot { width: 8rpx; height: 8rpx; border-radius: 50%; background: #fff; position: absolute; bottom: 8rpx; }
.day-detail { background: #fff; border-radius: 16rpx; padding: 24rpx; margin-bottom: 20rpx; box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04); }
.detail-title { display: block; font-size: 28rpx; font-weight: 700; color: #2c3e50; margin-bottom: 16rpx; }
.detail-list { display: flex; flex-direction: column; gap: 12rpx; }
.detail-card { background: #f7f8fa; border-radius: 12rpx; padding: 20rpx; border-left: 6rpx solid #43b581; }
.detail-plan { display: block; font-size: 28rpx; font-weight: 600; color: #2c3e50; margin-bottom: 8rpx; }
.detail-content { display: block; font-size: 26rpx; color: #555; line-height: 1.6; margin-bottom: 6rpx; }
.detail-day { font-size: 22rpx; color: #43b581; }
.empty-day { text-align: center; padding: 30rpx; }
.empty-day-text { font-size: 26rpx; color: #bdc3c7; }
.month-stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16rpx; background: #fff; border-radius: 16rpx; padding: 28rpx; box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04); }
.ms-item { text-align: center; }
.ms-num { display: block; font-size: 40rpx; font-weight: 700; color: #43b581; margin-bottom: 6rpx; }
.ms-label { font-size: 22rpx; color: #95a5a6; }
</style>
