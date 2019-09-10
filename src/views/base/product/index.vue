<template>
    <d2-container class="mod-sys__user">
        <el-collapse slot="header">
            <el-collapse-item>
                <template slot="title">
                    查询条件<i class="el-icon-d-arrow-right"/>
                </template>
                <el-form :inline="true" size="mini" :model="dataForm" @keyup.enter.native="search" ref="dataForm">

                    <el-form-item prop="code">
                        <el-input
                                v-model="dataForm.code"
                                :data-operate="dataFormOp.likeOps"
                                :placeholder="data.form.input.code"
                                clearable
                        />
                    </el-form-item>
                    <el-form-item prop="name">
                        <el-input
                                v-model="dataForm.name"
                                :data-operate="dataFormOp.likeOps"
                                :placeholder="data.form.input.name"
                                clearable
                        />
                    </el-form-item>
                    <el-form-item prop="vehicleId">
                        <el-input
                                v-model="dataForm.vehicleId"
                                :data-operate="dataFormOp.likeOps"
                                :placeholder="data.form.input.vehicleId"
                                clearable
                        />
                    </el-form-item>
                    <el-form-item prop="categoryId">
                        <el-input
                                v-model="dataForm.categoryId"
                                :data-operate="dataFormOp.likeOps"
                                :placeholder="data.form.input.categoryId"
                                clearable
                        />
                    </el-form-item>
                    <el-form-item prop="brandId">
                        <el-input
                                v-model="dataForm.brandId"
                                :data-operate="dataFormOp.likeOps"
                                :placeholder="data.form.input.brandId"
                                clearable
                        />
                    </el-form-item>
                    <el-form-item prop="madeinId">
                        <el-input
                                v-model="dataForm.madeinId"
                                :data-operate="dataFormOp.likeOps"
                                :placeholder="data.form.input.madeinId"
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
import data from './data'

export default {
  name: 'product',
  mixins: [mixinViewModule],
  data () {
    return {
      data: data,
      mixinViewModuleOptions: {
        getDataListURL: '/base/product/list',
        getDataListIsPage: true,
        deleteURL: '/base/product/delete',
        deleteIsBatch: true
      },
      dataForm: {
        code: undefined,
        name: undefined,
        categoryId: undefined,
        vehicleId: undefined,
        brandId: undefined,
        madeinId: undefined
      },
      dataFormOp: {
        likeOps: 'like'
      },
      rowHandler: {
        width: '160px',
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
        { type: 'index', width: 30 },
        {
          title: '编号',
          field: 'code',
          sortable: true,
          align: 'center',
          width: '110px'
        },
        {
          title: '名称',
          field: 'name',
          sortable: true,
          align: 'center',
          width: '110px'
        },
        {
          title: '别名',
          field: 'alisaName',
          sortable: true,
          align: 'center',
          width: '110px'
        },
        {
          title: '配件分类',
          field: 'cName',
          sortable: true,
          align: 'center',
          width: '110px'
        }, {
          title: '车型',
          field: 'vName',
          sortable: true,
          align: 'center',
          width: '110px'
        }, {
          title: '品牌',
          field: 'bName',
          sortable: true,
          align: 'center',
          width: '110px'
        },
        {
          title: '产地',
          field: 'mName',
          sortable: true,
          align: 'center',
          width: '110px'
        }, {
          title: '条码',
          field: 'barCode',
          sortable: true,
          align: 'center',
          width: '110px'
        }, {
          title: '图号',
          field: 'picCode',
          sortable: true,
          align: 'center',
          width: '110px'
        }, {
          title: '规格属性',
          field: 'specialParam',
          sortable: true,
          align: 'center',
          width: '120px'
        },
        {
          title: '描述',
          field: 'desc',
          sortable: true,
          align: 'center',
          width: '110px'
        },
        {
          title: '单位',
          field: 'unit',
          sortable: true,
          align: 'center',
          width: '110px'
        },
        {
          title: '体积',
          field: 'volume',
          sortable: true,
          align: 'center',
          width: '110px'
        },
        {
          title: '重量',
          field: 'weight',
          sortable: true,
          align: 'center',
          width: '110px'
        },
        {
          title: '默认供应商',
          field: 'dName',
          sortable: true,
          align: 'center',
          width: '140px'
        }, {
          title: '物料状态',
          field: 'status',
          sortable: true,
          align: 'center',
          width: '120px'
        }, {
          title: '拼音码',
          field: 'pinyinCode',
          sortable: true,
          align: 'center',
          width: '110px'
        }, {
          title: '五笔码',
          field: 'wbCode',
          sortable: true,
          align: 'center',
          width: '110px'
        },
        {
          title: '备注',
          field: 'remark',
          sortable: true,
          align: 'center',
          width: '200px'
        }, {
          title: '修改人',
          field: 'updateBy',
          sortable: true,
          align: 'center',
          width: '110px'
        },
        {
          title: '修改日期',
          field: 'updateDate',
          sortable: true,
          align: 'center',
          width: '120px',
          formatter: ['toDateString', 'yyyy-MM-dd']
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
  }
}
</script>

<style>

</style>
