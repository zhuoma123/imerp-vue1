import Vue from 'vue'
import VueRouter from 'vue-router'
// 静态路由数据
import constantRouterMap from './routes'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'
import util from '@/libs/util.js'

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  // mode: 'history',
  routes: constantRouterMap
})

const whiteList = ['/sys/login']

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
  // 确认已经加载多标签页数据 https://github.com/d2-projects/d2-admin/issues/201
  await store.dispatch('d2admin/page/isLoaded')
  // 确认已经加载组件尺寸设置 https://github.com/d2-projects/d2-admin/issues/198
  await store.dispatch('d2admin/size/isLoaded')
  // 进度条
  NProgress.start()
  // 关闭搜索面板
  store.commit('d2admin/search/set', false)
  if (whiteList.includes(to.path)) {
    // 在免登录白名单，直接进入
    next()
    NProgress.done()
  } else {
    // 这里暂时将cookie里是否存有token作为验证是否登录的条件
    // 请根据自身业务需要修改
    const token = util.cookies.get('token')
    const hasToken = token && token !== 'undefined'
    // 根据routers的值判断动态的菜单是否已经加载完成
    const isDynamicAddRoute = store.getters.permission.isDynamicAddRoute
    if (hasToken) {
      try {
        if (isDynamicAddRoute) {
          console.log('动态的菜单已经加载完成--->', to.path)
          next()
          NProgress.done()
        }
        // 已经登录，根据后台返回菜单生成路由
        await store.dispatch('d2admin/permission/generateRoutes').then(() => {
          const redirect = decodeURIComponent(from.query.redirect || to.path)
          console.log('路由路径--->', to.path, redirect)
          if (to.path === redirect || to.path === '/index') {
            // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            next({ ...to, replace: true })
          } else {
            // 跳转到目的路由
            next({ path: redirect })
            NProgress.done()
          }
        })
      } catch (err) {
        next({ path: '/sys/login', query: { redirect: to.fullPath } })
        NProgress.done()
      }
    } else {
      // 没有登录的时候跳转到登录界面
      // 携带上登陆成功之后需要跳转的页面完整路径
      next({ path: '/sys/login', query: { redirect: to.fullPath } })
      NProgress.done()
    }
  }
})

router.afterEach(to => {
  // 进度条
  NProgress.done()
  // 多页控制 打开新的页面
  store.dispatch('d2admin/page/open', to)
  // 更改标题
  util.title(to.meta.title)
})

export default router
