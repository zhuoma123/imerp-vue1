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
                                v-model="dataForm.code"
                                :data-operate="dataFormOp.likeOps"
                                :placeholder="data.form.input.code"
                                clearable
                        />
                    </el-form-item>
                    <el-form-item prop="code">
                        <el-input
                                v-model="dataForm.name"
                                :data-operate="dataFormOp.likeOps"
                                :placeholder="data.form.input.name"
                                clearable
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="getDataList()" icon="el-icon-search" type="primary">{{
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
                height="420px"
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
                @cell-click="enableTlbBtn"
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
                        @click="deleteHandle($refs.pGrid)"
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
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"/>
    </d2-container>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './add-or-update'
import data from './data'

export default {
  name: 'billnum',
  mixins: [mixinViewModule],
  data () {
    return {
      data: data,
      mixinViewModuleOptions: {
        getDataListURL: '/base/billnum/list',
        getDataListIsPage: true,
        deleteURL: '/base/billnum/delete',
        deleteIsBatch: true,
        deleteIsBatchKey: 'code'
      },
      dataForm: {
        code: undefined,
        name: undefined
      },
      dataFormOp: {
        likeOps: 'like',
        equalsOps: '='
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
        { type: 'index', width: 60, fixed: 'left' },
        {
          title: '编号',
          field: 'code',
          sortable: true,
          align: 'center',
          width: '110px'
        }, {
          title: '名称',
          field: 'name',
          sortable: true,
          align: 'center',
          width: '110px'
        }, {
          title: '前缀',
          field: 'prefix',
          sortable: true,
          align: 'center',
          width: '110px'
        }, {
          title: '前缀分隔符',
          field: 'prefixSeprator',
          sortable: true,
          align: 'center',
          width: '110px'
        }, {
          title: '年份包含',
          field: 'yearFlag',
          sortable: true,
          align: 'center',
          width: '110px'
        }, {
          title: '年份位数',
          field: 'yLength',
          sortable: true,
          align: 'center',
          width: '110px'
        }, {
          title: '月份包含',
          field: 'monthFlag',
          sortable: true,
          align: 'center',
          width: '110px'
        }, {
          title: '日份包含',
          field: 'dayFlag',
          sortable: true,
          align: 'center',
          width: '110px'
        }, {
          title: '流水号长度',
          field: 'sequenceLength',
          sortable: true,
          align: 'center',
          width: '110px'
        }, {
          title: '流水号循环类型',
          field: 'loopType',
          sortable: true,
          align: 'center',
          width: '130px'
        }, {
          title: '后缀前加分隔符',
          field: 'suffixSeprator',
          sortable: true,
          align: 'center',
          width: '130px'
        }, {
          title: '后缀',
          field: 'suffix',
          sortable: true,
          align: 'center',
          width: '110px'
        }, {
          title: '备注',
          field: 'remark',
          sortable: true,
          align: 'center',
          width: '110px'
        }, {
          title: '当前年份',
          field: 'year',
          sortable: true,
          align: 'center',
          width: '110px'
        }, {
          title: '当前月',
          field: 'month',
          sortable: true,
          align: 'center',
          width: '110px'
        }, {
          title: '当前日',
          field: 'day',
          sortable: true,
          align: 'center',
          width: '200px'
        }, {
          title: '当前流水号',
          field: 'sequenceNum',
          sortable: true,
          align: 'center',
          width: '110px'
        }, {
          title: '可用性',
          field: 'enableFlag',
          sortable: true,
          align: 'center',
          width: '110px'
        }, {
          title: '有效开始日期',
          field: 'startDateActive',
          sortable: true,
          align: 'center',
          width: '130px',
          formatter: ['toDateString', 'yyyy-MM-dd']
        }, {
          title: '有效结束日期',
          field: 'endDateActive',
          sortable: true,
          align: 'center',
          width: '130px',
          formatter: ['toDateString', 'yyyy-MM-dd']
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
          width: '150px',
          formatter: ['toDateString', 'yyyy-MM-dd'],
          showOverflow: true
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
