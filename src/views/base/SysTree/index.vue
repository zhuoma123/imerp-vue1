<template>
    <d2-container class="mod-sys__user">
        <el-form :inline="true" size="mini" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item>
                <el-input
                    v-model="dataForm.type"
                    :data-operate="dataFormOp.type"
                    :placeholder= "formMap.form.data.type"
                     clearable
                />
            </el-form-item>
            <el-form-item>
                <el-input
                        v-model="dataForm.code"
                        :data-operate="dataFormOp.code"
                        :placeholder="formMap.form.data.code"
                        clearable
                />
            </el-form-item>
            <el-form-item>
                <el-input
                        v-model="dataForm.name"
                        :data-operate="dataFormOp.name"
                        :placeholder="formMap.form.data.name"
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
                        @click="addOrUpdateHandle()"
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
        <d2-crud
                :columns="columns"
                :options="options"
                selectionRow
                :row-handle="rowHandler"
                :loading="dataListLoading"
                :data="dataList"
                @selection-change="dataListSelectionChangeHandle"
                @sort-change="dataListSortChangeHandle"
                @user-update="addOrUpdateHandle"
                @user-delete="deleteHandle"
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
    </d2-container>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from '@/views/sys/user-add-or-update'
import formMap from '../data'

export default {
  mixins: [mixinViewModule],
  data () {
    return {
      formMap: formMap,
      mixinViewModuleOptions: {
        getDataListURL: '/sys/tree/list',
        getDataListIsPage: true,
        deleteURL: '/sys/tree',
        deleteIsBatch: true
        // exportURL: '/sys/tree/export'
      },
      dataForm: {
        type: '',
        code: '',
        name: ''
      },
      dataFormOp: {
        type: 'like',
        code: 'like',
        name: 'like'
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
      columns: [
        {
          title: '类型',
          key: 'code',
          sortable: true,
          align: 'center'
        },
        {
          title: '编码',
          key: 'type',
          sortable: true,
          align: 'center'
        },
        {
          title: '名称',
          key: 'name',
          sortable: true,
          align: 'center'
        },
        {
          title: '序号',
          key: 'orderNum',
          sortable: true,
          align: 'center'
        },
        {
          title: '是否系统数据',
          key: 'sys',
          align: 'center'
        },
        {
          title: '',
          key: 'remark',
          sortable: true,
          align: 'center'
        },
        {
          title: '创建人',
          key: 'createdBy',
          sortable: true,
          align: 'center'
        },
        {
          title: this.$t('views.public.createDate'),
          key: 'createDate',
          sortable: true,
          align: 'center'
        },
        {
          title: '更新人',
          key: 'updateBy',
          sortable: true,
          align: 'center'
        },
        {
          title: '修改日期',
          key: 'updateDate',
          sortable: true,
          align: 'center'
        }
      ]
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {}
}
</script>
