<template>
  <d2-container class="mod-sys__user">
    <el-form slot="header" :inline="true" size="mini" :model="dataForm" @keyup.enter.native="search()">
      <el-form-item>
        <el-input
          v-model="dataForm.name"
          :data-operate="dataFormOp.name"
          :placeholder="$t('views.public.dept.name')"
          clearable
        />
      </el-form-item>
      
      <el-form-item>
        <el-button @click="search()">{{ $t('views.public.query') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="$hasPermission('sys:dept:save')"
          type="primary"
           icon="el-icon-edit"
          @click="addOrUpdateData()"
        >{{ $t('views.public.add') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="$hasPermission('sys:dept:delete')"
          type="danger"
           icon="el-icon-delete"
          @click="deleteHandleSetter()"
        >{{ $t('views.public.deleteBatch') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="$hasPermission('sys:user:export')"
          type="info"
          @click="exportHandle()"
        >{{ $t('views.public.export') }}</el-button>
      </el-form-item>
    </el-form>
    <vxe-grid
      border
      resizable
      highlight-hover-row
      size="mini"
      ref="pGrid"
      :proxy-config="tableProxy"
      :columns="tableColumn"
      :tree-config="{ children: 'children', expandAll: true, indent: 8}"
      :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
      >
    </vxe-grid>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="search" />
  </d2-container>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
import AddOrUpdate from "./dept-add-or-update";
import XEUtils from "xe-utils"
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/sys/dept/list",
        getDataListIsPage: false,
        deleteURL: "/sys/dept/delete",
        deleteIsBatch: true,
        deleteIsBatchKey: 'deptId',
        exportURL: "/sys/dept/export"
      },  
      //增改
      addOrUpdateVisible: false,
      dataForm: {
        name: ""
      },
      dataFormOp: {
        name: "like"
      },
      rowHandler: {
        custom: [
          {
            text: this.$t("views.public.update"),
            type: 'primary',
            size: 'mini',
            emit: 'user-update',
            show: (index,row) => {
              return this.$hasPermission("sys:dept:update");
            }
          },
          {
            text: this.$t("views.public.delete"),
            type: 'danger',
            size: 'mini',
            emit: 'user-delete',
            show: ( index) => {
              return this.$hasPermission("sys:dept:delete");
            }
          }
        ]
      },
      tableColumn: [
        { type: 'selection', title: '全选', width: 100, treeNode: true },
        {
          title: '部门名称',
          field: 'name',
          sortable: true,
          width: 400,
          align: 'left',
          treeNode: true
        },
        {
          title: '上级部门名称',
          field: 'parentName',
          sortable: true,
          align: 'center'
        },
        {
          title: '排序',
          field: 'orderNum',
          sortable: true,
          width: 110,
          align: 'center'
        }
      ]
    };
  },
  components: {
    AddOrUpdate
  },
  methods: {
    getDataListCB(self, res) {
      self.dataList = XEUtils.toArrayTree(self.dataList, { key: 'deptId', parentKey: 'parentId', children: 'children' })
    },
    vxeQueryCB (self) {
      this.$refs.pGrid.setAllTreeExpansion(true)
    },
    //增改
   addOrUpdateData (row) {
      this.addOrUpdateVisible = true;
      if (row) {
        this.$nextTick(() => {
          this.$refs.addOrUpdate.dataForm.id = row.row.deptId;
          this.$refs.addOrUpdate.update(row.row);
        })
      } else {
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init();
        })
      }
    },
     // 删除
    deleteHandleSetter (index) {
      let data
      if (this.mixinViewModuleOptions.deleteIsBatch && this.dataListSelections.length > 0) {
        data = this.dataListSelections.map(item => item[this.mixinViewModuleOptions.deleteIsBatchKey])
      }
      let row
      if (!index) {
        row = undefined
      } else {
        row = index.row
      }
      if (row) {
        const id = row.deptId
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
  }
}
</script>

<style>

</style>
