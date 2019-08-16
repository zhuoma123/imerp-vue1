<template>
  <el-submenu :index="menu.path || uniqueId">
    <template slot="title">
      <i v-if="menu.icon" :class="`fa fa-${menu.icon}`"></i>
      <i v-if="menu.icon === undefined & !menu.iconSvg" class="fa fa-folder-o"></i>
      <d2-icon-svg v-if="menu.iconSvg" :name="menu.iconSvg"/>
      <span @click="handleClick">{{menu.title}}</span>
    </template>
    <template v-for="(child, childIndex) in menu.children">
      <d2-layout-header-aside-menu-item v-if="child.children === undefined" :menu="child" :key="childIndex"/>
      <d2-layout-header-aside-menu-sub v-else :menu="child" :key="childIndex"/>
    </template>
  </el-submenu>
</template>

<script>
// 组件
import d2LayoutMainMenuItem from '../menu-item'
import util from '@/libs/util.js'
import {} from '../../mixin/menu'

export default {
  name: 'd2-layout-header-aside-menu-sub',
  components: {
    'd2-layout-header-aside-menu-item': d2LayoutMainMenuItem
  },
  props: {
    menu: {
      type: Object,
      required: false,
      default: () => {}
    }
  },
  data () {
    return {
      uniqueId: this._.uniqueId('d2-menu-empty-')
    }
  },
  methods: {
    handleClick () {
      if (this.menu.children && this.menu.children.length > 0) {
        let index = this.menu.children[0].path
        if (/^d2-menu-empty-\d+$/.test(index) || index === undefined) {
          this.$message.warning(this.$t('layout.header-aside.message.warning.temporary-menu'))
        } else if (/^https:\/\/|http:\/\//.test(index)) {
          util.open(index)
        } else {
          const pid = this.menu.id
          const curPid = this.$store.getters.menu.curAsidePid
          if (!pid || pid === curPid) return
          console.log('切换菜单-------' + this.menu.title)
          const menuList = this.$store.getters.menu.header || []
          const _side = menuList.filter(menu => menu.id === pid)
          this.$store.commit('d2admin/menu/asideSet', { menu: _side.length > 0 ? _side[0].children : [], pid: pid })
        }
      }
    }
  }
}
</script>
