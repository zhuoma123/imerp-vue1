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
        <el-button @click="getDataList()">{{ $t('views.public.query') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="$hasPermission('sys:user:save')"
          type="primary"
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
    <d2-crud
      ref="d2Crud"
      index-row                                                           
      :columns="columns"
      :options="options"
      selectionRow
      :row-handle="rowHandler"
      :loading="dataListLoading"
      :data="dataList"
      @selection-change="dataListSelectionChangeHandle"
      @sort-change="dataListSortChangeHandle"
      @user-update="addOrUpdateData"
      @user-password="updatePasswordData"
      @user-delete="deleteHandleSetter"
    ></d2-crud>
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

export default {
  name: 'sys-user',
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/user/list',
        getDataListIsPage: true,
        deleteURL: '/sys/user',
        deleteIsBatch: true,
        exportURL: '/sys/user/export'
      },
      dataForm: {
        username: '',
        mobile: ''
      },
      dataFormOp: {
        username: 'like'
      },
      rowHandler: {
        width:240,
        align:"center",
        custom: [
          {
            text: this.$t('views.public.update'),
            type: 'primary',
            size: 'mini',
            emit: 'user-update',
            show: (index, row) => {
              return this.$hasPermission('sys:user:update')
            }
          },
          
          {
            text: this.$t('views.public.delete'),
            type: 'danger',
            size: 'mini',
            emit: 'user-delete',
            show: (index, row) => {
              return this.$hasPermission('sys:user:delete')
            }
          },
          {
            text: '更改密码',
            type: 'primary',
            size: 'mini',
            emit: 'user-password',
            show: (index, row) => {
              return this.$hasPermission('sys:user:update')
            }
          }
        ]
      },
      columns: [
        {
          title: this.$t("views.public.user.username"),
          key: "username",
          sortable: true,
          align: "center"
        },
        {
          title: '部门名称',
          key: "deptName",
          sortable: true,
          align: "center"
        },
        {
          title: this.$t("views.public.user.mobile"),
          key: "mobile",
          sortable: true,
          align: "center"
        },
        {
          title: "角色",
          key: "roleNames",
          sortable: true,
          align: "center"
        },
        {
          title: this.$t("views.public.user.email"),
          key: "email",
          sortable: true,
          align: "center",
          width:140
        },
        {
          title: this.$t("views.public.user.status"),
          key: "status",
          sortable: true,
          align: "center",

        }
      ]
    };
  },
  components: {
    AddOrUpdate,
    UpdatePassword
  },
  methods: {
    //增改
   addOrUpdateData (row) {
      this.addOrUpdateVisible = true;
      if (row) {
        this.$nextTick(() => {
          this.$refs.addOrUpdate.dataForm.userId = row.row.userId;
          this.$refs.addOrUpdate.update(row.row);
        })
      } else {
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init();
        })
      }
    },
    //修改密码
    updatePasswordData(row){
      this.updatePasswordVisible = true;
      this.$nextTick(() => {
        this.$refs.updatePassword.dataForm.userId = row.row.userId;
        this.$refs.updatePassword.updatepass();
      })
      

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
