<template>
  <d2-container >
    <el-collapse slot="header">
      <el-collapse-item>
        <template slot="title">
          查询条件<i class="el-icon-d-arrow-right" />
        </template>
        <dynamic-form
          v-model="dataForm"
          :formprops="formprops"
          ref="dataForm"
          col-span='6,6,6,6'
          :alldescriptors="descriptors">
          <template slot="btnsearch">
            <el-button type="primary" icon="el-icon-search" @click="search" >查询</el-button>
            <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
          </template>
        </dynamic-form>
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
      :columns="tableColumn"
      :select-config="{reserve: true}"
      :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
      @cell-dblclick="cellDblClick">
      <template v-slot:buttons>
        <el-button ref="btnStatusAdd" size="mini" icon="el-icon-circle-plus"
                   v-if="$hasPermission('fin:realpayrec:save')"
                   @click="addHandle">新增</el-button>
        <el-button ref="btnStatusEdit"
                   enablestatus='NEW'
                   row-dbclick
                   form-readonly
                   type="primary" size="mini" icon="el-icon-edit"
                   v-if="$hasPermission('fin:realpayrec:save')"
                   @click="e => cellDblClick({row: $refs.pGrid.getCurrentRow()}, e)">修改</el-button>
        <el-button ref="btnStatusDelete" type="danger"  size="mini" icon="el-icon-delete"
                   v-if="$hasPermission('fin:realpayrec:delete')"
                   @click="deleteHandle($refs.pGrid)">删除</el-button>
        <el-button ref="btnStatusSubmit" type="success" size="mini" icon="el-icon-check"
                   v-if="$hasPermission('fin:realpayrec:save')" >提交</el-button>
        <el-button type="info" size="mini" icon="el-icon-printer"
                   v-if="$hasPermission('fin:realpayrec:print')" >打印</el-button>
        <el-button type="info" size="mini" icon="fa fa-file-excel-o"
                   v-if="$hasPermission('fin:realpayrec:export')" @click="$refs.pGrid.exportCsv()">  导出</el-button>
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
      @size-change="val => pageSizeChangeHandle(val, 'vxe')"
      @current-change="val => pageCurrentChangeHandle(val, 'vxe')"
    ></el-pagination>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </d2-container>
</template>

<script>
import AddOrUpdate from './realpayrec-add-or-update'
import mixinViewModule from '@/mixins/view-module'
export default {
  name: 'fin-realpayrec',
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/fin/realpayrec/list',
        getDataListIsPage: true,
        updateURL: '/fin/realpayrec/update',
        deleteURL: '/fin/realpayrec/delete',
        deleteIsBatch: true,
        exportURL: '/fin/realpayrec/export'
      },
      dataForm: {
          id: null,
          custId: null,
          custName: null,
          payDate: null,
          summary: null,
          payrecId: null,
          amount: null,
          subjectId: null,
          accountId: null,
          status: null,
          pic: null,
          remark: null,
          companyId: null,
          deletedFlag: null,
          createBy: null,
          createDate: null,
          updateBy: null,
          updateDate: null,
          },
      descriptors: {
    id: {
        type: 'string',
        label: 'id'
      },
          custId: {
        type: 'string',
        label: '往来单位id'
      },
          custName: {
        type: 'string',
        label: '往来单位名称'
      },
       btnSearch: {
        type: 'slot',
        name: 'btnsearch'
      },
  separate4: this.$g.separate,
      summary: {
        type: 'string',
        label: '收付款类型（预收客户款、预付供应商款、核销预收客户款、核销预付供应商款、采购订单、销售退货、其他等）'
      },
          payrecId: {
        type: 'string',
        label: '关联应收/应付id'
      },
          amount: {
        type: 'string',
        label: '收付款金额'
      },
        separate8: this.$g.separate,
      accountId: {
        type: 'string',
        label: '银行账户'
      },
          status: {
        type: 'string',
        label: '状态'
      },
          pic: {
        type: 'string',
        label: '收付款负责人'
      },
        separate12: this.$g.separate,
      companyId: {
        type: 'string',
        label: '公司'
      },
          deletedFlag: {
        type: 'string',
        label: '删除标记'
      },
          createBy: {
        type: 'string',
        label: '创建人'
      },
        separate16: this.$g.separate,
      updateBy: {
        type: 'string',
        label: '修改人'
      },
          updateDate: {
        type: 'string',
        label: '修改日期'
      },
        },
      tableColumn: [
        { type: 'selection', width: 30, align: 'center' },
        { type: 'index', width: 30, align: 'center' },
        {
          title: 'id',
          field: 'id',
          sortable: true,
          align: 'center'
        },
        {
          title: '往来单位id',
          field: 'custId',
          sortable: true,
          align: 'center'
        },
        {
          title: '往来单位名称',
          field: 'custName',
          sortable: true,
          align: 'center'
        },
        {
          title: '收付款日期',
          field: 'payDate',
          sortable: true,
          align: 'center',
          formatter: ['toDateString', 'yyyy-MM-dd']
        },
        {
          title: '收付款类型（预收客户款、预付供应商款、核销预收客户款、核销预付供应商款、采购订单、销售退货、其他等）',
          field: 'summary',
          sortable: true,
          align: 'center'
        },
        {
          title: '关联应收/应付id',
          field: 'payrecId',
          sortable: true,
          align: 'center'
        },
        {
          title: '收付款金额',
          field: 'amount',
          sortable: true,
          align: 'center'
        },
        {
          title: '科目',
          field: 'subjectId',
          sortable: true,
          align: 'center'
        },
        {
          title: '银行账户',
          field: 'accountId',
          sortable: true,
          align: 'center'
        },
        {
          title: '状态',
          field: 'status',
          sortable: true,
          align: 'center'
        },
        {
          title: '收付款负责人',
          field: 'pic',
          sortable: true,
          align: 'center'
        },
        {
          title: '备注',
          field: 'remark',
          sortable: true,
          align: 'center'
        },
        {
          title: '公司',
          field: 'companyId',
          sortable: true,
          align: 'center'
        },
        {
          title: '删除标记',
          field: 'deletedFlag',
          sortable: true,
          align: 'center'
        },
        {
          title: '创建人',
          field: 'createBy',
          sortable: true,
          align: 'center'
        },
        {
          title: '创建日期',
          field: 'createDate',
          sortable: true,
          align: 'center',
          formatter: ['toDateString', 'yyyy-MM-dd']
        },
        {
          title: '修改人',
          field: 'updateBy',
          sortable: true,
          align: 'center'
        },
        {
          title: '修改日期',
          field: 'updateDate',
          sortable: true,
          align: 'center',
          formatter: ['toDateString', 'yyyy-MM-dd']
        },
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
      this.$refs.dataForm.resetFields()
    }
  },
  mounted () {
  }
}
</script>
