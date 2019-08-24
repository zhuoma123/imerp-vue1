// Vue
import Vue from 'vue'
import i18n from './i18n'
import App from './App'
// 核心插件
import d2Admin from '@/plugin/d2admin'
// store
import store from '@/store/index'

// [ 可选组件 ]D2-Crud
import D2Crud from '@d2-projects/d2-crud'
// [ 可选组件 ] 图表
import VCharts from 'v-charts'
// [ 可选组件 ] 右键菜单
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
// [ 可选组件 ] JSON 树状视图
import vueJsonTreeView from 'vue-json-tree-view'
// [ 可选组件 ] 网格布局
import { GridLayout, GridItem } from 'vue-grid-layout'
// [ 可选组件 ] 区域划分
import SplitPane from 'vue-splitpane'
// [ 可选组件 ] UEditor
import VueUeditorWrap from 'vue-ueditor-wrap'
// [ 可选插件 ] 数据导入导出
import pluginExport from '@d2-projects/vue-table-export'
import pluginImport from '@d2-projects/vue-table-import'
// [ 可选过滤器 ] 日期相关过滤器
import d2VueFiltersDayjs from '@d2-admin/filters-dayjs'
// [ 可选数据表 ] 数据表插件
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
// [vxe表格] 表格插件
import VXETablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table-plugin-element/dist/style.css'
// [] 动态表单插件
import DynamicForm from './components/dynamic-form'

import ElAutocompleteItem from './views/so/select-item'
import ImSelector from './components/imema/im-selector'

// 菜单和路由设置
import router from './router'

import _ from 'lodash'
Vue.prototype._ = _

// 核心插件
Vue.use(d2Admin)

// 可选插件组件
Vue.use(D2Crud)
Vue.use(VCharts)
Vue.use(contentmenu)
Vue.use(vueJsonTreeView)
Vue.use(pluginExport)
Vue.use(pluginImport)
Vue.use(d2VueFiltersDayjs)
VXETable.use(VXETablePluginElement)
Vue.use(VXETable)
Vue.use(DynamicForm)
Vue.component('ElAutocompleteItem', ElAutocompleteItem)
Vue.component('ImSelector', ImSelector)
Vue.component('d2-grid-layout', GridLayout)
Vue.component('d2-grid-item', GridItem)
Vue.component('SplitPane', SplitPane)
Vue.component('VueUeditorWrap', VueUeditorWrap)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  created () {
    /*
    // 处理路由 得到每一级的路由设置
    this.$store.commit('d2admin/page/init', frameInRoutes)
    // 设置顶栏菜单
    this.$store.commit('d2admin/menu/headerSet', menuHeader)
    // 初始化菜单搜索功能
    this.$store.commit('d2admin/search/init', menuHeader)
    */
  },
  mounted () {
    // 展示系统信息
    this.$store.commit('d2admin/releases/versionShow')
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('d2admin/account/load')
    // 获取并记录用户 UA
    this.$store.commit('d2admin/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('d2admin/fullscreen/listen')
  },
  watch: {
    // 检测路由变化切换侧边栏内容
    '$route.matched': {
      handler (matched) {
        if (matched.length > 0) {
          const rootMenu = matched[0]
          const pid = rootMenu.meta.menuId
          const curPid = this.$store.getters.menu.curAsidePid
          if (!pid || pid === curPid) return
          console.log('切换菜单-------' + rootMenu.meta.title)
          const menuList = this.$store.getters.menu.header || []
          const _side = menuList.filter(menu => menu.id === pid)
          this.$store.commit('d2admin/menu/asideSet', { menu: _side.length > 0 ? _side[0].children : [], pid: pid })
        }
      },
      immediate: true
    }
  }
}).$mount('#app')
