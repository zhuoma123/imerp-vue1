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
          col-span='6,6,7,5'
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
          summaryMean: null,
          payrecId: null,
          amount: null,
          subjectId: null,
          gatheringTypeName: null,
          gatheringType: null,
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
          custName: {
            type: "cust",
            label: "往来单位",
            placeholder: "请输入单位名称",
            name: "im-selector",
            props: {
              mapKeyVal: "custName:custId",
              dataType: "biz.customervendor",
              clearable: true
            }
          },
          summaryMean: {
            type: 'cust', 
            label: '收付款类型',
            placeholder: '请选择收付款类型',
            name: 'im-selector',
            props: {
              mapKeyVal: "summaryMean:summary",
              dataType: "dict.GATHERING_TYPE",
              clearable: true
            }
          },
          bDate: { 
            type: 'date',
            label: '收款日期',
            colSpan: 2,
            props: {
              type: 'daterange',
              rangeSeparator: '至',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期',
              valueFormat: 'yyyy-MM-dd'
            }
          },
          separate8: this.$g.separate,
            gatheringTypeName: {
            type: "cust",
            ruletype: "integer",
            label: "收/付款账户",
            name: "im-selector",
            props: {
              mapKeyVal: "gatheringTypeName:gatheringType",
              dataType: "biz.gatheringType",
              clearable: true
            }
          },

          status: {
          type: 'enum', 
          label: '付款状态',
          enum: ['NEW', 'SUBMIT'],
          options: [
            { label: '新增', value: 'NEW' },
            { label: '已确定', value: 'SUBMIT' }
          ]
        },
          pic: {
            type: "cust",
            label: "经办人",
            name: "im-selector",
            props: {
              mapKeyVal: "pic",
              dataType: "biz.employee",
              clearable: true
            }
          },
          btnSearch: {
            type: 'slot',
            name: 'btnsearch'
          }
        },
      tableColumn: [
        { type: 'selection', width: 30, align: 'center' },
        { type: 'index', width: 30, align: 'center' },
        
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
          title: '收付款类型',
          field: 'summaryMean',
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
          title: '银行账户',
          field: 'accountMean',
          sortable: true,
          align: 'center'
        },
        {
          title: '状态',
          field: 'statusMean',
          sortable: true,
          align: 'center'
        },
        {
          title: '经办人',
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
