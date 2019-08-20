import store from '@/store'

/**
 * 权限
 * @param {*} key
 */
export default {
  install (Vue, options) {
    // 权限验证
    Vue.prototype.$hasPermission = key => {
      const permissions = store.getters.permission.permissions
      return permissions && permissions.includes(key)
    }
  }
}
