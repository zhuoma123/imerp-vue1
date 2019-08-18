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
          @click="addOrUpdateHandle({})"
        >{{ $t('views.public.add') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="$hasPermission('sys:user:delete')"
          type="danger"
          @click="deleteHandle()"
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
      remote-filter
      height="100%"
      row-id="id"
      :toolbar="toolbar"
      :proxy-config="tableProxy"
      :columns="tableColumn"
      :select-config="{reserve: true}"
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
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './user-add-or-update'

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
          }
        ]
      },
      tableColumn: [
        { type: 'selection', width: 50, align: 'center' },
        { type: 'index', width: 50, align: 'center' },
        {
          title: this.$t('views.public.user.username'),
          field: 'username',
          sortable: true,
          align: 'center'
        },
        {
          title: this.$t('views.public.user.deptName'),
          field: 'deptName',
          sortable: true,
          align: 'center'
        },
        {
          title: this.$t('views.public.user.email'),
          field: 'email',
          sortable: true,
          align: 'center',
          editRender: { name: 'input' }
        },
        {
          title: this.$t('views.public.user.mobile'),
          field: 'mobile',
          sortable: true,
          align: 'center',
          editRender: { name: 'input' }
        },
        {
          title: this.$t('views.public.user.status'),
          field: 'status',
          align: 'center',
          width: '70px',
          filters: [
            { label: this.$t('views.public.user.status0'), value: 0 },
            { label: this.$t('views.public.user.status1'), value: 1 }
          ]
        },
        {
          title: this.$t('views.public.createDate'),
          field: 'createTime',
          sortable: true,
          align: 'center'
        }
      ],
      tableProxy: {
        index: true, // 启用动态序号代理
        sort: true, // 启用排序代理
        filter: true, // 启用筛选代理
        ajax: {
          query: ({ page, sort, filters }) => {
            // 处理排序条件
            let formData = {
              sort: sort.property,
              order: sort.order
            }
            // 处理筛选条件
            filters.forEach(({ column, property, values }) => {
              formData[property] = values.join(',')
            })
            return new Promise(async (resolve, reject) => {
              await this.$axios.post(
                this.mixinViewModuleOptions.getDataListURL,
                {
                  pageForm: {
                    order: this.order,
                    orderField: this.orderField,
                    page: this.mixinViewModuleOptions.getDataListIsPage ? this.page : null,
                    limit: this.mixinViewModuleOptions.getDataListIsPage ? this.limit : null
                  },
                  dataForm: {
                    data: this.dataForm,
                    op: this.dataFormOp
                  }
                }
              ).then(res => {
                console.log(this.mixinViewModuleOptions.getDataListIsPage)
                this.total = res.totalCount
                this.dataList = res.list
              })
              resolve({
                total: this.total,
                list: this.dataList
              })
            })
          },
          save: ({ body }) => { console.log(body) }
        },
        props: {
          list: 'list',
          result: 'list',
          total: 'totalCount'
        }
      },
      toolbar: {
        id: 'full_edit_1',
        buttons: [
          { code: 'reload', name: '刷新' },
          { code: 'insert_actived', name: '新增' },
          //          { code: "mark_cancel", name: "取消" },
          { code: 'remove_selection', name: '移除' },
          { code: 'save', name: '保存' },
          { code: 'export', name: '导出.csv' }
        ],
        resizable: {
          storage: true
        },
        setting: {
          storage: true
        }
      }
    }
  },
  components: {
    AddOrUpdate
  }
}
</script>

<style>
</style>
