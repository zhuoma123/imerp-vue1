<template>
    <d2-container class="mod-sys__user">
        <el-collapse slot="header">
            <el-collapse-item>
                <template slot="title">
                    查询条件<i class="el-icon-d-arrow-right"/>
                </template>
                <el-form :inline="true" size="mini" @keyup.enter.native="getDataList()" :model="dataForm"
                         ref="dataForm">
                    <el-form-item prop="name">
                        <el-input
                                v-model="dataForm.name"
                                :placeholder="data.form.account.name"
                                clearable
                        />
                    </el-form-item>
                    <el-form-item prop="bankName">
                        <el-input
                                v-model="dataForm.bankName"
                                :placeholder="data.form.account.bankName"
                                clearable
                        />
                    </el-form-item>
                    <el-form-item prop="bankNum">
                        <el-input
                                v-model="dataForm.bankNum"
                                :placeholder="data.form.account.bankNum"
                                clearable
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="search" icon="el-icon-search" type="primary">{{
                            $t('views.public.query') }}
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="handleFormReset">
                            <d2-icon name="refresh"/>
                            重置
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-collapse-item>

        </el-collapse>
        <vxe-grid
                border
                resizable
                highlight-current-row
                remote-filter
                size="mini"
                ref="pGrid"
                row-id="id"
                :toolbar="toolbar"
                :proxy-config="tableProxy"
                :columns="columns"
                :select-config="{reserve: true}"
                :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
                @cell-dblclick="cellDblClick"
                :tree-config="{children: 'children'}"
        >
            <template v-slot:buttons>
                <el-button
                        ref="btnAdd"
                        size="mini"
                        icon="el-icon-circle-plus"
                        @click="addHandle"
                >新增
                </el-button>
                <el-button
                        ref="btnEdit"
                        type="primary"
                        size="mini"
                        icon="el-icon-edit"
                        @click="updateHandle($refs.pGrid)"
                >修改
                </el-button>
                <el-button
                        ref="btnDelete"
                        type="danger"
                        size="mini"
                        icon="el-icon-delete"
                        @click="deleteHandleSetter($refs.pGrid)"
                >删除
                </el-button>
            </template>
        </vxe-grid>
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
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="search"/>
    </d2-container>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './add-or-update'
import data from '../data'

export default {
  name: 'fin-account',
  mixins: [mixinViewModule],
  data () {
    return {
      data: data,
      mixinViewModuleOptions: {
        getDataListURL: '/fin/account/list',
        getDataListIsPage: true,
        deleteURL: '/fin/account/delete',
        deleteIsBatch: true,
        deleteIsBatchKey: 'id'
      },
      dataForm: {
        bankName: undefined,
        bankNum: undefined,
        name: undefined
      },
      toolbar: {
        id: 'full_edit_1',
        refresh: true,
        resizable: {
          storage: true
        },
        setting: {
          storage: true
        }
      },
      columns: [
{ type: 'index', width: 30, fixed: 'left' },
        { type: 'index', width: 30, fixed: 'left' },
        {
          title: '账户名称',
          field: 'name',
          sortable: true,
          align: 'center'
        }, {
          title: '开户行',
          field: 'bankName',
          sortable: true,
          align: 'center'
        }, {
          title: '账号',
          field: 'bankNum',
          sortable: true,
          align: 'center'
        }, {
          title: '账户初始余额',
          field: 'initBalance',
          sortable: true,
          align: 'center'
        }, {
          title: '当前余额',
          field: 'balance',
          sortable: true,
          align: 'center'
        }, {
          title: '状态',
          field: 'status',
          sortable: true,
          align: 'center'
        }, {
          title: '备注',
          field: 'remark',
          sortable: true,
          align: 'center'
        }, {
          title: '更新人',
          field: 'updateBy',
          sortable: true,
          align: 'center'
        }, {
          title: '更新日期',
          field: 'updateDate',
          sortable: true,
          align: 'center'
        }
      ]
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    handleFormReset () {
      this.$refs['dataForm'].resetFields()
    }
  },
  created () {}
}
</script>

<style>

</style>
