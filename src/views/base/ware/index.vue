<template>
    <d2-container class="mod-sys__user">
        <el-collapse slot="header">
            <el-collapse-item>
                <template slot="title">
                    查询条件<i class="el-icon-d-arrow-right"/>
                </template>
                <el-form :inline="true" size="mini" :model="dataForm"
                         @keyup.enter.native="search" ref="dataForm">
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
                    <el-form-item prop="mobileNo">
                        <el-input
                                v-model="dataForm.mobileNo"
                                :data-operate="dataFormOp.likeOps"
                                :placeholder="data.form.input.mobileNo"
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
  name: 'ware',
  mixins: [mixinViewModule],
  data () {
    return {
      data: data,
      mixinViewModuleOptions: {
        getDataListURL: '/base/warehouse/list',
        getDataListIsPage: true,
        deleteURL: '/base/warehouse/delete',
        deleteIsBatch: true
      },
      dataForm: {
        code: undefined,
        name: undefined,
        mobileNo: undefined
      },
      dataFormOp: {
        username: 'like'
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
        { type: 'index', width: 30},
        {
          title: '仓库编号',
          field: 'code',
          sortable: true,
          align: 'center',
          width: '110px'
        },
        {
          title: '仓库名称',
          field: 'name',
          sortable: true,
          align: 'center',
          width: '110px'
        },
        {
          title: '虚拟仓标志',
          field: 'virtualFlag',
          sortable: true,
          align: 'center',
          width: '120px',
          formatter: this.flagSelector
        }, {
          title: '仓库地址',
          field: 'address',
          sortable: true,
          align: 'center',
          width: '110px'
        }, {
          title: '仓库负责人',
          field: 'pic',
          sortable: true,
          align: 'center',
          width: '120px'
        },
        {
          title: '负责人手机',
          field: 'mobileNo',
          sortable: true,
          align: 'center',
          width: '130px'
        }, {
          title: '办公电话',
          field: 'tel',
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
    },
    flagSelector ({ cellValue }) {
      if (cellValue) {
        return '是'
      } else {
        return '否'
      }
    }
  }
}
</script>

<style>
    .el-dialog__footer {
        margin-right: 10px;
    }
</style>
