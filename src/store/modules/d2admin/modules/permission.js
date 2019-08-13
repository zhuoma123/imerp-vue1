import layoutHeaderAside from '@/layout/header-aside'
import router from '@/router'
// store
import store from '@/store/index'
// 静态路由数据
import { sysMenuService } from '@api'
import util from '@/libs/util.js'
import { isURL } from '@/libs/validate'
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

/**
 * @param {Array} routeNameDict 生成的菜单名称和 id 的对照表
 * @param {Array} routePathDict 生成的菜单名称和 path 的对照表
 */
const routeNameDict = {}
const routePathDict = {}

/**
 * 将后台返回的数据转化成 d2admin/menu/headerSet 使用的【菜单】数据
 * 删除无用的 children 字段以及精简数据
 * @param {Array} menuArray 后台返回的菜单格式
 */
function toD2AdminMenu (menuArray) {
  const transform = menu => ({
    ...(menu.children && menu.children.length > 0) ? { children: menu.children.map(e => transform(e)) } : {},
    id: menu.menuId,
    icon: menu.icon,
    title: menu.name,
    name: routeNameDict[menu.menuId],
    path: routePathDict[menu.menuId]
  })
  return menuArray.map(e => transform(e))
}

/**
 * 将后台返回的数据转化成 d2admin/page/init 使用的【路由】数据，得到每一级的路由设置，用于处理layout里面的tab页
 * @param {Array} menuArray 后台返回的菜单格式
 */
function toD2AdminPageInitData (menuArray) {
  const transform = menu => ({
    ...(menu.children && menu.children.length > 0) ? { children: menu.children.map(e => transform(e)) } : {},
    meta: {
      cache: true,
      title: menu.name
    },
    name: routeNameDict[menu.menuId],
    path: routePathDict[menu.menuId]
  })
  return menuArray.map(e => transform(e))
}

/**
 * 将后台返回的数据转化成 d2admin/search/init 使用的数据
 * @param {Array} menuArray 后台返回的菜单格式
 */
function toD2AdminSearchInitData (menuArray) {
  const transform = menu => ({
    ...(menu.children && menu.children.length > 0) ? { children: menu.children.map(e => transform(e)) } : {},
    path: routePathDict[menu.menuId],
    title: menu.name,
    icon: menu.icon
  })
  return menuArray.map(e => transform(e))
}

/**
 * 组装一级路由
 * @param {Array} menuList
 */
function fnAddDynamicRootRoutes (menuList = []) {
  let rootRoutes = []
  menuList.forEach(item => {
    if (item.children && item.children.length >= 1) {
      // 如果为空则挂在 / 路由下
      let root = {
        path: item.url || '/',
        component: layoutHeaderAside,
        redirect: { name: item.url ? item.children[0].url.replace(/^\//, '').replace('/', '-') : 'index' },
        meta: {
          title: item.name,
          menuId: item.menuId
        },
        name: item.url ? item.url.replace(/^\//, '') : ''
      }
      let routes = []
      root['children'] = fnAddDynamicSubRoutes(item.children, routes)
      rootRoutes.push(root)
    }
  })
  return rootRoutes
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicSubRoutes (menuList = [], routes = []) {
  var temp = []
  menuList.forEach(item => {
    if (item.children && item.children.length >= 1) {
      temp = temp.concat(item.children)
    } else if (item.url && /\S/.test(item.url)) {
      let relPath = item.url.replace(/^\//, '')
      let path = item.url.replace(/^\//, '').replace('/', '-')
      var route = {
        path: path,
        component: null,
        name: path,
        meta: {
          ...window.SITE_CONFIG['contentTabDefault'],
          cache: true,
          menuId: item.menuId,
          title: item.name
        }
      }
      // TODO: 因为下面的 eval(s2) 导致暂时只能使用 window.SITE_CONFIG 全局变量。s2 的值中存在这短代码
      // eslint-disable-next-line
      let URL = (relPath || '').replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2)) // URL支持{{ window.xxx }}占位符变量
      if (isURL(URL)) {
        route['path'] = route['name'] = `i-${item.menuId}`
        route['meta']['iframeURL'] = URL
        route['component'] = {
          render (h) {
            return h('d2-container', {}, [
              h('iframe', {
                style: {
                  position: 'absolute',
                  top: '0px',
                  left: '0px',
                  height: '100%',
                  width: '100%'
                },
                attrs: {
                  src: URL,
                  frameborder: 0
                }
              })
            ])
          }
        }
      } else {
        try {
          route['component'] = _import(URL)
        } catch (err) {
          // console.log(err)
        }
      }
      Object.defineProperty(routeNameDict, item.menuId, {
        value: route.name
      })
      Object.defineProperty(routePathDict, item.menuId, {
        value: route.path
      })
      routes.push(route)
    }
  })
  if (temp.length >= 1) {
    fnAddDynamicSubRoutes(temp, routes)
  }
  return routes
}

/**
 * 错误页面
 */
const errorPage = {
  path: '*',
  name: '404',
  component: _import('system/error/404')
}

const state = {
  isLock: false,
  isDynamicAddRoute: false,
  permissions: [],
  addRouters: [],
  routers: []
}

const mutations = {
  SET_ROUTERS: (state, routes) => {
    state.routers = routes
  },
  SET_ADDROUTERS: (state, routes) => {
    let needAdd = []
    // 去重合并路由
    routes.forEach(a => {
      let noExisit = state.routers.every(e => {
        return e.path !== a.path
      })

      if (noExisit) {
        needAdd.push(a)
      }
    })
    state.addRouters = state.addRouters.concat(needAdd)
    state.routers = state.routers.concat(needAdd)
    // 这里将动态组装的路由添加到路由里面
    if (needAdd.length > 0) {
      needAdd.push(errorPage)
      router.addRoutes(needAdd)
    }
    state.isDynamicAddRoute = true
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  SET_ISLOCK: (state, isLock) => {
    state.isLock = isLock
    if (!isLock) {
      state.isDynamicAddRoute = false
    }
  }
}

const actions = {
  generateRoutes ({ commit, state }) {
    console.log('lock--->', state.isLock)
    // 确保只做一次请求
    if (state.isLock) return
    console.log('setlock--->', true)
    commit('SET_ISLOCK', true)

    const fnGenerator = menuList => {
      console.log('-----------------加载动态路由---------------')
      // 设置动态路由
      commit('SET_ADDROUTERS', fnAddDynamicRootRoutes(menuList))
      commit('SET_PERMISSIONS', util.session.get('permissions'))
      // 处理路由 得到每一级的路由设置
      store.commit('d2admin/page/init', toD2AdminPageInitData(menuList))
      // 设置顶栏菜单
      store.commit('d2admin/menu/headerSet', toD2AdminMenu(menuList))
      // store.commit('d2admin/menu/asideSet', toD2AdminMenu(menu.menuList, routeNameDict))
      store.commit('d2admin/search/init', toD2AdminSearchInitData(menuList))

      /*
      // 处理路由 得到每一级的路由设置
      store.commit('d2admin/page/init', menu.menuList)
      // 设置顶栏菜单
      store.commit('d2admin/menu/headerSet', menu.menuList)
      // 初始化菜单搜索功能
      store.commit('d2admin/search/init', menuHeader)
      */
    }
    return new Promise((resolve, reject) => {
      // 获取缓存中的菜单信息
      const menuList = util.session.get('menuList')
      if (!menuList || menuList === null) {
        console.log('请求后台菜单----------')
        // 获取菜单列表, 添加保存到本地存储
        sysMenuService
          .getNav()
          .then(menu => {
            commit('SET_PERMISSIONS', menu.permissions)
            util.session.set('menuList', menu.menuList)
            util.session.set('permissions', menu.permissions)
            fnGenerator(menu.menuList)
            resolve()
          }).catch(error => {
            reject(error)
          })
        resolve()
      } else if (!state.isDynamicAddRoute) {
        fnGenerator(menuList)
      }
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
