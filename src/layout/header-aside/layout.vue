<template>
  <div
    class="d2-layout-header-aside-group"
    :style="styleLayoutMainGroup"
    :class="{grayMode: grayActive}"
  >
    <!-- 半透明遮罩 -->
    <div class="d2-layout-header-aside-mask"></div>
    <!-- 主体内容 -->
    <div class="d2-layout-header-aside-content" flex="dir:top">
      <!-- 顶栏 -->
      <div
        class="d2-theme-header"
        :style="{
          opacity: this.searchActive ? 0.5 : 1
        }"
        flex-box="0"
        flex
      >
        <div
          class="logo-group"
          :style="{width: asideCollapse ? asideWidthCollapse : asideWidth}"
          flex-box="0"
        >
          <img
            v-if="asideCollapse"
            :src="`${$baseUrl}image/theme/${themeActiveSetting.name}/logo/icon-only.png`"
          />
          <img v-else :src="`${$baseUrl}image/theme/${themeActiveSetting.name}/logo/all.png`" />
        </div>
        <div class="toggle-aside-btn" @click="handleToggleAside" flex-box="0">
          <d2-icon name="bars" />
        </div>
        <d2-menu-header flex-box="1" />
        <!-- 顶栏右侧 -->
        <div class="d2-header-right" flex-box="0">
          <!-- 如果你只想在开发环境显示这个按钮请添加 v-if="$env === 'development'" -->
          <d2-header-search @click="handleSearchClick" />
          <d2-header-log />
          <d2-header-fullscreen />
          <d2-header-theme />
          <!-- <d2-header-size/>
          <d2-header-locales/>-->
          <d2-header-color />
          <d2-header-user />
        </div>
      </div>
      <!-- 下面 主体 -->
      <div class="d2-theme-container" flex-box="1" flex>
        <!-- 主体 侧边栏 -->
        <div
          flex-box="0"
          ref="aside"
          class="d2-theme-container-aside"
          :style="{
            width: asideCollapse ? asideWidthCollapse : asideWidth,
            opacity: this.searchActive ? 0.5 : 1,
            marginTop: '30px'
          }"
        >
          <d2-menu-side />
        </div>
        <!-- 主体 -->
        <div class="d2-theme-container-main" flex-box="1" flex>
          <!-- 搜索 -->
          <transition name="fade-scale">
            <div v-if="searchActive" class="d2-theme-container-main-layer" flex>
              <d2-panel-search ref="panelSearch" @close="searchPanelClose" />
            </div>
          </transition>
          <!-- 内容 -->
          <transition name="fade-scale">
            <div v-if="!searchActive" class="d2-theme-container-main-layer" flex="dir:top">
              <!-- tab -->
              <div class="d2-theme-container-main-header" flex-box="0">
                <d2-tabs />
              </div>
              <!-- 页面 -->
              <div class="d2-theme-container-main-body" flex-box="1">
                <transition :name="transitionActive ? 'fade-transverse' : ''">
                  <!--<keep-alive>
                      <router-view v-if="$route.meta.cache"></router-view>
                  </keep-alive>
                  <router-view v-if="!$route.meta.cache"></router-view>
                  -->
                  <keep-alive :include="keepAlive">
                    <router-view />
                  </keep-alive>
                </transition>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sysUserService } from '@api'
import d2MenuSide from './components/menu-side'
import d2MenuHeader from './components/menu-header'
import d2Tabs from './components/tabs'
import d2HeaderFullscreen from './components/header-fullscreen'
// import d2HeaderLocales from './components/header-locales'
import d2HeaderSearch from './components/header-search'
// import d2HeaderSize from './components/header-size'
import d2HeaderTheme from './components/header-theme'
import d2HeaderUser from './components/header-user'
import d2HeaderLog from './components/header-log'
import d2HeaderColor from './components/header-color'
import { mapState, mapGetters, mapActions } from 'vuex'
import mixinSearch from './mixins/search'
export default {
  name: 'd2-layout-header-aside',
  mixins: [mixinSearch],
  components: {
    d2MenuSide,
    d2MenuHeader,
    d2Tabs,
    d2HeaderFullscreen,
    // d2HeaderLocales,
    d2HeaderSearch,
    // d2HeaderSize,
    d2HeaderTheme,
    d2HeaderUser,
    d2HeaderLog,
    d2HeaderColor
  },
  data () {
    return {
      // [侧边栏宽度] 正常状态
      asideWidth: '200px',
      // [侧边栏宽度] 折叠状态
      asideWidthCollapse: '65px'
    }
  },
  computed: {
    ...mapState('d2admin', {
      keepAlive: state => state.page.keepAlive,
      grayActive: state => state.gray.active,
      transitionActive: state => state.transition.active,
      asideCollapse: state => state.menu.asideCollapse
    }),
    ...mapGetters('d2admin', {
      themeActiveSetting: 'theme/activeSetting'
    }),

    /**
     * @description 最外层容器的背景图片样式
     */
    styleLayoutMainGroup () {
      return {
        ...(this.themeActiveSetting.backgroundImage
          ? {
            backgroundImage: `url('${this.$baseUrl}${this.themeActiveSetting.backgroundImage}')`
          }
          : {})
      }
    }
  },
  created () {
    Promise.all([this.getUserInfo(), this.getPermissions()]).then(() => {
      this.loading = false
    })
  },
  methods: {
    ...mapActions('d2admin/menu', ['asideCollapseToggle']),
    ...mapActions('d2admin/user', {
      userInfoSet: 'set'
    }),
    /**
     * 接收点击切换侧边栏的按钮
     */
    handleToggleAside () {
      this.asideCollapseToggle()
    },
    // [ renren ] 获取当前管理员信息
    getUserInfo () {
      return sysUserService
        .getInfo()
        .then(res => {
          this.userInfoSet({
            id: res.userId,
            name: res.username,
            superUser: res.superUser
          })
        })
        .catch(() => {})
    },
    // [ renren ] 获取权限
    getPermissions () {
      /*
      return sysMenuService
        .getPermissions()
        .then(res => {
          window.SITE_CONFIG['permissions'] = res
        })
        .catch(() => {})
        */
    }
  }
}
</script>

<style lang="scss">
// 注册主题
@import "~@/assets/style/theme/register.scss";

/*-----layout start-------*/
.el-tabs__item {
  height: 30px;
  line-height: 30px;
}
.d2-theme-container-main-header .el-button {
  padding: 8px 20px;
}

.d2-layout-header-aside-group
  .d2-layout-header-aside-content
  .d2-theme-container
  .d2-theme-container-main
  .d2-theme-container-main-header {
  height: 31px;
}

.d2-layout-header-aside-group .d2-layout-header-aside-content .d2-theme-header {
  height: 50px;
}

.d2-layout-header-aside-group
  .d2-layout-header-aside-content
  .d2-theme-header
  .toggle-aside-btn {
  height: 50px;
}

.d2-layout-header-aside-group
  .d2-layout-header-aside-content
  .d2-theme-header
  .d2-header-right {
  height: 50px;
}

.d2-layout-header-aside-group
  .d2-layout-header-aside-content
  .d2-theme-header
  .d2-header-right
  .btn-text {
  padding: 14px 12px;
}

.el-menu--horizontal > .el-submenu .el-submenu__title {
  height: 50px;
  line-height: 50px;
}

.d2-layout-header-aside-group
  .d2-layout-header-aside-content
  .d2-theme-container
  .d2-theme-container-main
  .d2-theme-container-main-body
  .container-component
  .d2-container-full
  .d2-container-full__footer {
  padding: 3px 5px;
}

.d2-layout-header-aside-group
  .d2-layout-header-aside-content
  .d2-theme-container
  .d2-theme-container-main
  .d2-theme-container-main-body
  .container-component
  .d2-container-full
  .d2-container-full__body {
  overflow: hidden;
}

.el-table--mini td,
.el-table--mini th {
  padding: 0px 0;
}

.el-submenu__title {
  padding: 0 5px;
}
/*-----layout end-------*/

.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 3px;
}

.el-form-item__label {
  font-size: 12px;
}

.el-form-item__error {
  position: relative;
}

/*查询条件折叠*/
.el-collapse-item__header {
  height: 25px;
  line-height: 25px;
}
.el-collapse-item__content {
  padding-bottom: 0;
}

.el-collapse {
  border: 0;
}

/*表格*/
.vxe-toolbar.size--mini, .vxe-toolbar.size--small {
  padding: 8px 8px !important;
}

.vxe-table.size--mini .vxe-body--column, .vxe-table.size--mini .vxe-footer--column, .vxe-table.size--mini .vxe-header--column {
  padding: 3px 0 !important;
}

.vxe-table .vxe-cell {
  padding: 0 3px !important;
}

.vxe-table.fixed--left.size--mini .vxe-body--column, .vxe-table.fixed--right.size--mini .vxe-body--column, .vxe-table.vxe-editable.size--mini .vxe-body--column {
  height: 28px !important;
}

.vxe-table .vxe-body--column.col--selected:not(.col--checked) {
    -webkit-box-shadow: inset 0 0 0 1px #409eff !important;
    box-shadow: inset 0 0 0 1px #409eff !important;
}
/*商品下拉框宽度*/
.prod-popper {
    width: auto !important;
}

/*弹出框*/
.abow_dialog {
  display: flex;
  justify-content: center;
  align-items: Center;
  overflow: hidden;

  .el-dialog {
    margin: 0 auto !important;
    height: 90%;
    overflow: hidden;

    .el-dialog__body {
      position: absolute;
      left: 0;
      top: 54px;
      bottom: 70px;
      right: 0;
      padding: 0;
      z-index: 1;
      overflow: hidden;
      overflow-y: auto;
      padding: 10px;
    }
    .el-dialog__footer{
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
}
</style>
