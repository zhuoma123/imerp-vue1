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
          label-width="120px"
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
        <el-button ref="btnStatusEdit"
                   enablestatus='NEW'
                   row-dbclick
                   form-readonly
                   type="primary" size="mini" icon="el-icon-edit"
                   v-if="$hasPermission('fin:payrec:save')"
                   @click="e => cellDblClick({row: $refs.pGrid.getCurrentRow()}, e)">修改</el-button>
        <el-button ref="btnStatusDelete" type="danger"  size="mini" icon="el-icon-delete"
                   v-if="$hasPermission('fin:payrec:delete')"
                   @click="deleteHandle($refs.pGrid)">删除</el-button>
        <el-button ref="btnStatusSubmit" type="success" size="mini" icon="el-icon-check"
                   v-if="$hasPermission('fin:payrec:save')" >提交</el-button>
        <el-button type="info" size="mini" icon="el-icon-printer"
                   v-if="$hasPermission('fin:payrec:print')" >打印</el-button>
        <el-button type="info" size="mini" icon="fa fa-file-excel-o"
                   v-if="$hasPermission('fin:payrec:export')" @click="$refs.pGrid.exportCsv()">  导出</el-button>
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
import AddOrUpdate from './payrec-add-or-update'
import mixinViewModule from '@/mixins/view-module'
export default {
  name: 'fin-payrec',
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/fin/payrec/list',
        getDataListIsPage: true,
        updateURL: '/fin/payrec/update',
        deleteURL: '/fin/payrec/delete',
        deleteIsBatch: true,
        exportURL: '/fin/payrec/export'
      },
      dataForm: {
          id: null,
          type: null,
          typeName: null,
          sourceOrderType: null,
          sourceOrderId: null,
          sourceOrderNum: null,
          custId: null,
          amount: null,
          orderDate: null,
          pic: null,
          status: null,
          remark: null
          },
      descriptors: {
        typeName: {
          type: 'enum',
          label: '类型',
          enum: ['RECEIVABLE', 'PAYABLE'],
          options: [
            { label: '应收', value: 'RECEIVABLE' },
            { label: '应付', value: 'PAYABLE' }
          ]
        },
        status: {
          type: 'enum', 
          label: '付款状态',
          enum: ['PAID', 'UNPAID'],
          options: [
            { label: '已付款', value: 'PAID' },
            { label: '未付款', value: 'UNPAID' }
          ]
        },
        sourceOrderType: {
          type: 'cust', 
          label: '业务类型',
          placeholder: '请选择业务类型',
          name: 'im-selector',
          required: true,
          props: {
            mapKeyVal: "sourceOrderType",
            dataType: "code.tran_type",
            clearable: true
          }
        },
        separate1: this.$g.separate,
        sourceOrderNum: {
          type: 'string',
          label: '来源订单号',
          required: true,
          props: {
            clearable: true
          }
        },
        custId: {
          type: 'string',
          label: '往来单位',
          placeholder: '请输入单位名称',
          name: 'im-selector',
          props: {
            mapKeyVal: "status",
            dataType: "biz.cust",
            clearable: true
          }
        },
        btnSearch: {
          type: 'slot',
          name: 'btnsearch'
        }
      },
      tableColumn: [
        { type: 'selection', width: 50, align: 'center' },
        { type: 'index', width: 50, align: 'center' },
        {
          title: '应收/应付款',
          field: 'typeName',
          sortable: true,
          align: 'center'
        },
        {
          title: '业务类型',
          field: 'sourceOrderType',
          sortable: true,
          align: 'center'
        },
        {
          title: '来源订单号',
          field: 'sourceOrderNum',
          sortable: true,
          align: 'center'
        },
        {
          title: '往来单位',
          field: 'custId',
          sortable: true,
          align: 'center'
        },
        {
          title: '金额',
          field: 'amount',
          sortable: true,
          align: 'center'
        },
        {
          title: '创建日期',
          field: 'orderDate',
          sortable: true,
          align: 'center',
          formatter: ['toDateString', 'yyyy-MM-dd']
        },
        {
          title: '经办人',
          field: 'pic',
          sortable: true,
          align: 'center'
        },
        {
          title: '付款状态',
          field: 'status',
          sortable: true,
          align: 'center'
        },
        {
          title: '备注',
          field: 'remark',
          sortable: true,
          align: 'center'
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
      this.$refs.dataForm.resetFields()
    }
  },
  mounted () {
  }
}
</script>
