class SessionStorage {
  // 构造函数
  constructor (pre) {
    this.pre = pre + '-'
  }
  get (key) {
    let keyStr = sessionStorage.getItem(this.pre + key)
    return keyStr ? JSON.parse(keyStr) : keyStr
  }
  set (key, val) {
    sessionStorage.setItem(this.pre + key, JSON.stringify(val))
  }
  clear () {
    sessionStorage.clear()
  }
  unset (key) {
    sessionStorage.removeItem(key)
  }
}

export default new SessionStorage(`d2admin-session-${process.env.VUE_APP_VERSION}`)
