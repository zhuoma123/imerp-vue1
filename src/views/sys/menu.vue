<template scope="scope">
  <d2-container class="mod-sys__user">
    <vxe-toolbar slot="header"  size="mini">
      <template v-slot:buttons>
        <vxe-input v-model="filterName2" type="search" placeholder="根据名称查询"></vxe-input>
        <el-button
          v-if="$hasPermission('sys:menu:save')"
          type="primary"
          icon="el-icon-edit"
          size="mini"
          @click="addOrUpdateData()"
        >{{ $t('views.public.add') }}</el-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      :data="list2"
      border
      size="mini"
      ref="pGrid"
      highlight-hover-row
      :tree-config="{children: 'children', expandAll: !!filterName2,accordion:true}">
      <vxe-table-column field="name" title="菜单名称" align="left" tree-node>
        <template v-slot="{ row }">
          <span v-html="row.name"></span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="parentName" title="上级菜单" align="center">
        <template v-slot="{ row }">
          <span v-html="row.parentName"></span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="url" title="菜单URL" align="center">
        <template v-slot="{ row }">
          <span v-html="row.url"></span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="perms" title="授权" align="center">
        <template v-slot="{ row }">
          <span v-html="row.perms"></span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="type" title="类型" align="center">
        <template v-slot="{ row }">
          <el-tag
          :type="row.type === 2 ? 'primary' : (row.type === 0 ? 'success' : 'danger')">
          {{tags[row.type].name}}
          </el-tag>
      </template>
      </vxe-table-column>
      <vxe-table-column field="icon" title="图标" align="center">
        <template v-slot="{ row }">
          <i :class="'fa fa-' + row.icon"/>
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作" align="center">
        <template v-slot="{ row }">
          <el-button size="mini" @click="addOrUpdateData(row)" type="primary">修改</el-button>
          <el-button size="mini" type="danger"
          @click="deleteHandleSetter(row)">删除</el-button>
        </template>
      </vxe-table-column>
    </vxe-table>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
  </d2-container>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
import AddOrUpdate from "./menu-add-or-update";
import XEUtils from 'xe-utils'
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/sys/menu/list",
        deleteURL: "/sys/menu/delete",
        deleteIsBatchKey: 'menuId',
        deleteIsBatch: true,
        exportURL: "/sys/menu/export"
      },
      filterName2: '',
      dataList: [],
      tags: [
          { name: '导航栏', type: 'primary' },
          { name: '菜单', type: 'success' },
          { name: '按键', type: 'warning' }
        ]
      
    };
  },
  computed:{
    list2 () {
      let filterName = XEUtils.toString(this.filterName2).trim().toLowerCase()
      if (filterName) {
        let filterRE = new RegExp(filterName, 'gi')
        let options = { children: 'children' }
        let searchProps = ['name', 'parentName']
        let rest = XEUtils.searchTree(this.dataList, item => searchProps.some(key => XEUtils.toString(item[key]).toLowerCase().indexOf(filterName) > -1), options)
        XEUtils.eachTree(rest, item => {
          searchProps.forEach(key => {
            //item[key] = XEUtils.toString(item[key]).replace(filterRE, match => `<span class="keyword-lighten">${match}</span>`)
          })
        }, options)
        return rest
      }
      return this.dataList
    }
  },
  
  components: {
    AddOrUpdate
  },
  methods: {
 //增改
   addOrUpdateData (row) {
     debugger
      this.addOrUpdateVisible = true;
      if (row) {
        this.$nextTick(() => {
          this.$refs.addOrUpdate.dataForm.id = row.menuId;
          this.$refs.addOrUpdate.update(row);
        })
      } else {
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init();
        })
      }
    },
     // 删除
    deleteHandleSetter (index) {
      debugger
      let data
      if (this.mixinViewModuleOptions.deleteIsBatch && this.dataListSelections.length > 0) {
        data = this.dataListSelections.map(item => item[this.mixinViewModuleOptions.deleteIsBatchKey])
      }
      let row
      if (!index) {
        row = undefined
      } else {
        row = index
      }
      if (row) {
        const id = row.menuId
        if (id) {
          data = [id]
        }
      }
      this.$confirm(this.$t('public.prompt.info', { 'handle': this.$t('views.public.delete') }), this.$t('public.prompt.title'), {
        confirmButtonText: this.$t('views.public.confirm'),
        cancelButtonText: this.$t('views.public.cancel'),
        type: 'warning'
      }).then(() => {
        this.$axios.post(
          `${this.mixinViewModuleOptions.deleteURL}${this.mixinViewModuleOptions.deleteIsBatch ? '' : '/' + id}`,
          this.mixinViewModuleOptions.deleteIsBatch ? {
            'data': data
          } : {}
        ).then(res => {
          this.$message({
            message: this.$t('views.public.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.getDataList()
            }
          })
        }).catch(() => {})
      }).catch(() => {})
    }
  },

  mounted() {
    this.getDataList()
  }

}


</script>

<style>
.statistics {
    padding: 10px;
    .hiddenRow {
        display: none;
    }
    .searchForm{
        padding: 10px;
        span.label{
            margin-right: 10px;
        }
        span.attention{
            color: #e50021;
        }
    }
  .el-table-column .cell {
  white-space: pre-line;
}
    
}

</style>
