<template>
  <d2-container class="mod-sys__user">
    <el-form :inline="true" size="mini" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input
          v-model="dataForm.username"
          :data-operate="dataFormOp.username"
          :placeholder="$t('views.public.user.username')"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="dataForm.mobile"
          :data-operate="dataFormOp.mobile"
          :placeholder="$t('views.public.user.mobile')"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getDataList()">{{ $t('views.public.query') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="$hasPermission('sys:user:save')"
          type="primary"
          icon="el-icon-circle-plus"
          @click="addOrUpdateData()"
          v-show="dataForm.superUser===1?true:false"
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
      :loading="dataListLoading"
      :data="dataList"
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
    <update-password v-if="updatePasswordVisible" ref="updatePassword" @refreshDataList="getDataList" />
  </d2-container>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './user-add-or-update'
import UpdatePassword from './user-update-password'
import store from '@/store/index'
export default {
  name: 'sys-user',
  mixins: [mixinViewModule],
  data () {
    return {
      dataListLoading : false,
      mixinViewModuleOptions: {
        getDataListURL: '/sys/user/list',
        getDataListIsPage: true,
        deleteURL: '/sys/user/delete',
        deleteIsBatch: true,
        exportURL: '/sys/user/export'
      },
     
      dataForm: {
        username: '',
        mobile: '',
        superUser:''
      },
      dataFormOp: {
        username: 'like'
      },
      columns: [
        {
          title: this.$t("views.public.user.username"),
          field: "username",
          sortable: true,
          align: "center"
        },
        {
          title: "用户名称",
          field: "name",
          sortable: true,
          align: "center"
        },
        {
          title: '部门名称',
          field: "deptName",
          sortable: true,
          align: "center"
        },
        {
          title: this.$t("views.public.user.mobile"),
          field: "mobile",
          sortable: true,
          align: "center"
        },
        {
          title: "角色",
          field: "roleNames",
          sortable: true,
          align: "center"
        },
        {
          title: this.$t("views.public.user.email"),
          field: "email",
          sortable: true,
          align: "center",
          width:140
        },
        {
          title: this.$t("views.public.user.status"),
          field: "status",
          sortable: true,
          width:80,
          align: "center",
          slots: {
            default: ({ row }) => {
                      return [
                        <el-tag type={row.status===1?"success":"danger"}>
                        {row.status===1?"正常":"禁用"}
                        </el-tag>
                      ]
                    }
          }
        },
        {
          title: '操作',
          field: 'other',
          width:270,
          sortable: true,
          align: "center",
          slots: {
                    default: ({ row }) => {
                      return [
                        <el-button size="mini" icon="el-icon-edit" disabled={row.superUser==1 && row.currenId != 1 ? true:false} onClick={ () => this.addOrUpdateData(row) } type="primary">修改</el-button>,
                        <el-button size="mini" icon="el-icon-delete" type="danger" disabled={row.superUser==1 && row.currenId != 1 || this.dataForm.superUser !==1 ? true:false} onClick={ () => this.deleteHandleSetter(row) }>删除</el-button>,
                        <el-button size="mini" icon="el-icon-edit" type="success"  onClick={ () => this.updatePasswordData(row) }>更改密码</el-button>
                      ]
                    }
                  }
        }
      ]
    };
  },
  components: {
    AddOrUpdate,
    UpdatePassword
  },
   created() {
     this.findCurrentId()
  },
  methods: {

    async findCurrentId(){
        const user = await store.dispatch('d2admin/db/get',{
        dbName: 'sys',
        path: 'user.info',
        defaultValue: {},
        user: true
        }, { root: true })
        debugger
        this.dataForm.superUser = user.superUser
    },

    //增改
   async addOrUpdateData (row) {

      this.addOrUpdateVisible = true;
      const user = await store.dispatch('d2admin/db/get',{
        dbName: 'sys',
        path: 'user.info',
        defaultValue: {},
        user: true
        }, { root: true })
      if (row) {
        this.$nextTick(() => {
          this.$refs.addOrUpdate.dataForm.userId = row.userId
          this.$refs.addOrUpdate.dataForm.currenId = row.currenId
          this.$refs.addOrUpdate.update(row)
        })
      } else {
        this.$nextTick(() => {
          this.$refs.addOrUpdate.dataForm.currenId = user.id
          this.$refs.addOrUpdate.init()
        })
      }
    },
    //修改密码
    async updatePasswordData(row){
      this.updatePasswordVisible = true
      const user = await store.dispatch('d2admin/db/get',{
        dbName: 'sys',
        path: 'user.info',
        defaultValue: {},
        user: true
        }, { root: true })
      this.$nextTick(() => {
        debugger
        if(user.superUser===1){
          this.$refs.updatePassword.dataForm.password = row.password
          this.$refs.updatePassword.dataForm.superUser = user.superUser
        }
        this.$refs.updatePassword.dataForm.userId = row.userId
        this.$refs.updatePassword.updatepass()
      })
      

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
        const id = row.userId
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
