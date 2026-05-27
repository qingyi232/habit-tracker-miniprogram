const { createApp, ref, computed, onMounted, watch } = Vue

const BASE_URL = 'http://localhost:3900/api'

async function request(url, options = {}) {
  const res = await fetch(BASE_URL + url, {
    method: options.method || 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: options.body ? JSON.stringify(options.body) : undefined
  })
  return res.json()
}

createApp({
  setup() {
    const isLoggedIn = ref(false)
    const loginLoading = ref(false)
    const loginForm = ref({ username: '', password: '' })
    const adminInfo = ref({})
    const currentPage = ref('users')

    // User management
    const users = ref([])
    const userSearch = ref('')
    const userPage = ref(1)
    const userTotal = ref(0)
    const showUserDialog = ref(false)
    const editingUser = ref(null)
    const userForm = ref({ zhanghao: '', mima: '', xingming: '', xingbie: '男', nianling: '', shouji: '', youxiang: '', zhaopian: '' })

    // Plan management
    const plans = ref([])
    const planSearch = ref('')
    const planPage = ref(1)
    const planTotal = ref(0)
    const showPlanDialog = ref(false)
    const planForm = ref({})

    // Checkin management
    const checkins = ref([])
    const checkinSearch = ref('')
    const checkinPage = ref(1)
    const checkinTotal = ref(0)

    // Message management
    const messageList = ref([])
    const messagePage = ref(1)
    const messageTotal = ref(0)
    const showReplyDialog = ref(false)
    const replyTarget = ref({})
    const replyContent = ref('')

    const pageTitle = computed(() => {
      const map = { users: '用户管理', plans: '学习计划管理', checkins: '计划打卡管理', messages: '留言板管理' }
      return map[currentPage.value] || ''
    })

    // Check saved login
    const saved = localStorage.getItem('adminInfo')
    if (saved) {
      try {
        adminInfo.value = JSON.parse(saved)
        isLoggedIn.value = true
      } catch (e) {}
    }

    async function handleLogin() {
      if (!loginForm.value.username || !loginForm.value.password) {
        alert('请输入账号和密码')
        return
      }
      loginLoading.value = true
      try {
        const res = await request('/common/login', {
          method: 'POST',
          body: { username: loginForm.value.username, password: loginForm.value.password, role: '管理员' }
        })
        if (res.code === 0) {
          adminInfo.value = res.data
          localStorage.setItem('adminInfo', JSON.stringify(res.data))
          isLoggedIn.value = true
          loadUsers()
        } else {
          alert(res.msg || '登录失败')
        }
      } catch (e) {
        alert('登录失败')
      }
      loginLoading.value = false
    }

    function handleLogout() {
      if (confirm('确定退出登录？')) {
        localStorage.removeItem('adminInfo')
        isLoggedIn.value = false
        adminInfo.value = {}
      }
    }

    // Users
    async function loadUsers() {
      const params = new URLSearchParams({ page: userPage.value, limit: 10 })
      if (userSearch.value) {
        params.append('zhanghao', userSearch.value)
        params.append('xingming', userSearch.value)
      }
      const res = await request('/yonghu/list?' + params)
      if (res.code === 0) {
        users.value = res.data.list
        userTotal.value = res.data.total
      }
    }

    function openUserDialog(item) {
      editingUser.value = item || null
      if (item) {
        userForm.value = {
          zhanghao: item.zhanghao, mima: '', xingming: item.xingming,
          xingbie: item.xingbie || '男', nianling: item.nianling || '',
          shouji: item.shouji || '', youxiang: item.youxiang || '', zhaopian: item.zhaopian || ''
        }
      } else {
        userForm.value = { zhanghao: '', mima: '', xingming: '', xingbie: '男', nianling: '', shouji: '', youxiang: '', zhaopian: '' }
      }
      showUserDialog.value = true
    }

    async function saveUser() {
      const f = userForm.value
      if (!f.zhanghao || !f.xingming) { alert('请填写账号和姓名'); return }
      try {
        if (editingUser.value) {
          const data = { ...f }
          if (!data.mima) {
            const info = await request('/yonghu/info/' + editingUser.value.id)
            data.mima = info.data.mima
          }
          await request('/yonghu/update/' + editingUser.value.id, { method: 'PUT', body: data })
        } else {
          if (!f.mima) { alert('请填写密码'); return }
          await request('/yonghu/add', { method: 'POST', body: f })
        }
        showUserDialog.value = false
        loadUsers()
      } catch (e) { alert('操作失败') }
    }

    async function deleteUser(id) {
      if (!confirm('确定删除该用户？')) return
      await request('/yonghu/delete/' + id, { method: 'DELETE' })
      loadUsers()
    }

    // Plans
    async function loadPlans() {
      const params = new URLSearchParams({ page: planPage.value, limit: 10 })
      if (planSearch.value) params.append('jihuabiaoti', planSearch.value)
      const res = await request('/xuexijihua/list?' + params)
      if (res.code === 0) {
        plans.value = res.data.list
        planTotal.value = res.data.total
      }
    }

    function openPlanDialog(item) {
      planForm.value = {
        id: item.id,
        jihuabiaoti: item.jihuabiaoti,
        jihuatupian: item.jihuatupian,
        kaishiriqi: formatDate(item.kaishiriqi),
        jihuaneirong: item.jihuaneirong,
        jieshushijian: formatDate(item.jieshushijian),
        jihuatianshu: item.jihuatianshu,
        wanchengdu: item.wanchengdu,
        zhanghao: item.zhanghao,
        xingming: item.xingming
      }
      showPlanDialog.value = true
    }

    async function savePlan() {
      try {
        const f = planForm.value
        await request('/xuexijihua/update/' + f.id, { method: 'PUT', body: f })
        showPlanDialog.value = false
        loadPlans()
      } catch (e) { alert('操作失败') }
    }

    async function deletePlan(id) {
      if (!confirm('确定删除该计划？')) return
      await request('/xuexijihua/delete/' + id, { method: 'DELETE' })
      loadPlans()
    }

    // Checkins
    async function loadCheckins() {
      const params = new URLSearchParams({ page: checkinPage.value, limit: 10 })
      if (checkinSearch.value) params.append('jihuabiaoti', checkinSearch.value)
      const res = await request('/jihuadaka/list?' + params)
      if (res.code === 0) {
        checkins.value = res.data.list
        checkinTotal.value = res.data.total
      }
    }

    async function deleteCheckin(id) {
      if (!confirm('确定删除该打卡记录？')) return
      await request('/jihuadaka/delete/' + id, { method: 'DELETE' })
      loadCheckins()
    }

    // Messages
    async function loadMessages() {
      const params = new URLSearchParams({ page: messagePage.value, limit: 10 })
      const res = await request('/liuyanban/list?' + params)
      if (res.code === 0) {
        messageList.value = res.data.list
        messageTotal.value = res.data.total
      }
    }

    function openReplyDialog(item) {
      replyTarget.value = item
      replyContent.value = item.reply || ''
      showReplyDialog.value = true
    }

    async function saveReply() {
      if (!replyContent.value.trim()) { alert('请输入回复内容'); return }
      try {
        await request('/liuyanban/reply/' + replyTarget.value.id, {
          method: 'PUT',
          body: { reply: replyContent.value.trim() }
        })
        showReplyDialog.value = false
        loadMessages()
      } catch (e) { alert('回复失败') }
    }

    async function deleteMessage(id) {
      if (!confirm('确定删除该留言？')) return
      await request('/liuyanban/delete/' + id, { method: 'DELETE' })
      loadMessages()
    }

    function formatDate(d) {
      if (!d) return ''
      return String(d).substring(0, 10)
    }

    watch(currentPage, (val) => {
      if (val === 'users') loadUsers()
      else if (val === 'plans') loadPlans()
      else if (val === 'checkins') loadCheckins()
      else if (val === 'messages') loadMessages()
    })

    watch(isLoggedIn, (val) => {
      if (val) loadUsers()
    })

    return {
      isLoggedIn, loginLoading, loginForm, adminInfo, currentPage, pageTitle,
      users, userSearch, userPage, userTotal, showUserDialog, editingUser, userForm,
      plans, planSearch, planPage, planTotal, showPlanDialog, planForm,
      checkins, checkinSearch, checkinPage, checkinTotal,
      messageList, messagePage, messageTotal, showReplyDialog, replyTarget, replyContent,
      handleLogin, handleLogout,
      loadUsers, openUserDialog, saveUser, deleteUser,
      loadPlans, openPlanDialog, savePlan, deletePlan,
      loadCheckins, deleteCheckin,
      loadMessages, openReplyDialog, saveReply, deleteMessage,
      formatDate
    }
  }
}).mount('#app')
