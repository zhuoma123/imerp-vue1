<template scope="scope">
  <d2-container class="mod-sys__user">
    <el-form :inline="true" size="mini" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button
          v-if="$hasPermission('sys:menu:save')"
          type="primary"
           icon="el-icon-edit"
          @click="addOrUpdateData()"
        >{{ $t('views.public.add') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="$hasPermission('sys:menu:export')"
          type="info"
          @click="exportHandle()"
        >{{ $t('views.public.export') }}</el-button>
      </el-form-item>
    </el-form>
    <el-table
    :data="dataList"
    style="width: 100%;margin-bottom: 20px;"
    row-key="menuId"
    border
    :tree-props="{children: 'children'}">
      <el-table-column prop="name" label="菜单名称" width="200" align="left" ></el-table-column>
      <el-table-column prop="parentName" label="上级菜单" width="100" align="center"></el-table-column>
      <el-table-column prop="url" label="菜单URL" align="center"></el-table-column>
      <el-table-column prop="perms" label="授权" width="200" align="center"></el-table-column>
      <el-table-column prop="type" label="类型" align="center"></el-table-column>
      <el-table-column prop="icon" label="菜单图标" align="center"></el-table-column>
      <el-table-column prop="orderNum" label="排序" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="addOrUpdateData(scope.row)">编辑</el-button><br>
        <el-button
          size="mini"
          type="danger"
          @click="deleteHandleSetter(scope.row)">删除</el-button>
      </template>
    </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
  </d2-container>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
import AddOrUpdate from "./menu-add-or-update";

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
            show: (index, row) => {
              return this.$hasPermission("sys:menu:update");
            }
          },
          {
            text: this.$t("views.public.delete"),
            type: 'danger',
            size: 'mini',
            emit: 'user-delete',
            show: (index, row) => {
              return this.$hasPermission("sys:menu:delete");
            }
          }
        ]
      },
      
    };
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
    this.search()
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
    
}
</style>
