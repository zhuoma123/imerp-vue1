<template>
  <d2-container class="mod-sys__user">
    <el-form :inline="true" size="mini" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input
          v-model="dataForm.roleName"
          :data-operate="dataFormOp.roleName"
          placeholder="角色名称"
          clearable
        />
      </el-form-item>
      
      <el-form-item>
        <el-button  icon="el-icon-search" type="primary" @click="getDataList()">{{ $t('views.public.query') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="$hasPermission('sys:role:save')"
          type="primary"
           icon="el-icon-edit"
          @click="addOrUpdateData()"
        >{{ $t('views.public.add') }}</el-button>
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
      :columns="columns"
      :data="dataList"
      :customs.sync="customColumns"
      :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
    ></vxe-grid>
    <!-- 分页 -->
    <el-pagination
      slot="footer"
      :current-page="page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="limit"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="pageSizeChangeHandle"
      @current-change="pageCurrentChangeHandle"
    ></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
  </d2-container>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
import AddOrUpdate from "./role-add-or-update";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/sys/role/list",
        getDataListIsPage: true,
        deleteURL: "/sys/role/delete",
        deleteIsBatch: true,
        deleteIsBatchKey: 'roleId',
        exportURL: "/sys/role/export"
      },  
      //增改
      addOrUpdateVisible: false,
      dataForm: {
        roleName: ""
      },
      customColumns: [
              ],
      dataFormOp: {
        roleName: "like"
      },
      columns: [
        {
          title: '角色名称',
          field: "roleName",
          sortable: true,
          align: "center"
        },
        {
          title: '公司名称',
          field: "companyName",
          sortable: true,
          align: "center",
          
        },
        {
          title: '部门名称',
          field: "deptName",
          sortable: true,
          align: "center"
        },
        {
          title: "创建时间",
          field: "createTime",
          sortable: true,
          align: "center"
        },
        {
          title: '操作',
          field: 'other',
          width:170,
          sortable: true,
          align: "center",
          slots: {
                    default: ({ row }) => {
                      return [
                        <el-button size="mini" icon="el-icon-edit" onClick={ () => this.addOrUpdateData(row) } type="primary">修改</el-button>,
                        <el-button size="mini" icon="el-icon-delete" type="danger" onClick={ () => this.deleteHandleSetter(row) }>删除</el-button>
                      ]
                    }
                  }
        }
        
      ]
    };
  },
  components: {
    AddOrUpdate
  },
  methods: {
    //增改
   addOrUpdateData (row) {
      this.addOrUpdateVisible = true;
      if (row) {
        this.$nextTick(() => {
          this.$refs.addOrUpdate.dataForm.id = row.roleId;
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
        const id = row.roleId
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
  created () {
    
  }
  
 

}


</script>

<style>

</style>
