const BASE_URL = 'http://localhost:3900/api'

export function request(options) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success(res) {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          uni.showToast({ title: '请求失败', icon: 'none' })
          reject(res)
        }
      },
      fail(err) {
        uni.showToast({ title: '网络异常', icon: 'none' })
        reject(err)
      }
    })
  })
}

export function get(url, data) {
  return request({ url, method: 'GET', data })
}

export function post(url, data) {
  return request({ url, method: 'POST', data })
}

export function put(url, data) {
  return request({ url, method: 'PUT', data })
}

export function del(url, data) {
  return request({ url, method: 'DELETE', data })
}

export function getUserInfo() {
  try {
    return JSON.parse(uni.getStorageSync('userInfo') || '{}')
  } catch (e) {
    return {}
  }
}

export function setUserInfo(info) {
  uni.setStorageSync('userInfo', JSON.stringify(info))
}

export function clearUserInfo() {
  uni.removeStorageSync('userInfo')
}

export function checkLogin() {
  const info = getUserInfo()
  if (!info || !info.id) {
    uni.reLaunch({ url: '/pages/login/login' })
    return false
  }
  return true
}
