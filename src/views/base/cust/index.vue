<template>
    <d2-container class="mod-sys__user">
        <el-collapse slot="header">
            <el-collapse-item>
                <template slot="title">
                    查询条件<i class="el-icon-d-arrow-right"/>
                </template>
                <el-form :inline="true" size="mini" :model="dataForm" @keyup.enter.native="search" ref="dataForm">
                    <el-form-item prop="name">
                        <el-input
                                v-model="dataForm.name"
                                :placeholder=data.form.input.name
                                clearable
                        />
                    </el-form-item>
                    <el-form-item prop="mobile">
                        <el-input
                                v-model="dataForm.tel"
                                :placeholder=data.form.input.tel
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
        <!--show data-->
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
import data from './data'

export default {
  name: 'cust',
  mixins: [mixinViewModule],
  data: function () {
    return {
      data: data,
      mixinViewModuleOptions: {
        getDataListURL: '/base/cust/list',
        getDataListIsPage: true,
        deleteURL: '/base/cust/delete',
        deleteIsBatch: true
      },
      dataForm: {
        custVendor: undefined,
        code: undefined,
        name: undefined,
        shortName: undefined,
        type: undefined,
        tel: undefined,
        fax: undefined,
        email: undefined,
        mm: undefined,
        companyId: undefined,
        companyAddress: undefined,
        legalMan: undefined,
        webSite: undefined,
        bank: undefined,
        bankAccount: undefined,
        taxNum: undefined,
        pinyinCode: undefined,
        wbCode: undefined,
        pic: undefined,
        remark: undefined
      },
      dataFormOp: {
        username: 'like'
      },
      vendor: {
        CUST: '顾客',
        VENDOR: '供应商'
      },
      columns: [
        { type: 'index', width: 30 },
        {
          title: '客户 | 供应商',
          field: 'custVendor',
          sortable: true,
          align: 'center',
          width: '120px',
          formatter: this.flagSelector
        },
        {
          title: '名称',
          field: 'name',
          sortable: true,
          align: 'center',
          width: '150px'
        },
        {
          title: '职称',
          field: 'shortName',
          sortable: true,
          align: 'center',
          width: '150px'
        }, {
          title: '类型',
          field: 'type',
          sortable: true,
          align: 'center'
        },
        {
          title: '公司电话',
          field: 'tel',
          sortable: true,
          align: 'center',
          width: '120px'
        },
        {
          title: '公司传真',
          field: 'fax',
          sortable: true,
          align: 'center',
          width: '120px'
        },
        {
          title: '公司邮箱',
          field: 'email',
          sortable: true,
          align: 'center',
          width: '120px'
        },
        {
          title: '公司微信号',
          field: 'mm',
          sortable: true,
          align: 'center',
          width: '130px'
        },
        {
          title: '公司地址',
          field: 'companyAddress',
          sortable: true,
          align: 'center',
          width: '120px'
        },
        {
          title: '法人',
          field: 'legalMan',
          sortable: true,
          align: 'center'
        },
        {
          title: '公司网址',
          field: 'webSite',
          sortable: true,
          align: 'center',
          width: '120px'
        },
        {
          title: '开户银行',
          field: 'bank',
          sortable: true,
          align: 'center',
          width: '120px'
        },
        {
          title: '银行账号',
          field: 'bankAccount',
          sortable: true,
          align: 'center',
          width: '120px'
        },
        {
          title: '纳税号',
          field: 'taxNum',
          sortable: true,
          align: 'center',
          width: '120px'
        },
        {
          title: '拼音码',
          field: 'pinyinCode',
          sortable: true,
          align: 'center',
          width: '120px'
        },
        {
          title: '五笔码',
          field: 'wbCode',
          sortable: true,
          align: 'center',
          width: '120px'
        },
        {
          title: '业务员',
          field: 'pic',
          sortable: true,
          align: 'center',
          width: '120px'
        },
        {
          title: '备注',
          field: 'remark',
          sortable: true,
          align: 'center'
        },
        {
          title: '修改人',
          field: 'updateBy',
          sortable: true,
          align: 'center',
          width: '120px'
        },
        {
          title: '修改日期',
          field: 'updateDate',
          sortable: true,
          align: 'center',
          width: '200px',
          formatter: ['toDateString', 'yyyy-MM-dd']
        }
      ],
      toolbar: {
        id: 'full_edit_1',
        refresh: true,
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
  },
  methods: {
    handleFormReset () {
      this.$refs['dataForm'].resetFields()
    },
    flagSelector ({ cellValue }) {
      if (cellValue === 'CUST') {
        return '客户'
      } else {
        return '供应商'
      }
    }
  }
}
</script>

<style>

</style>
