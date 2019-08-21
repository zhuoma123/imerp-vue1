<template>
  <d2-container >
    <el-collapse slot="header">
      <el-collapse-item>
        <template slot="title">
          查询条件<i class="el-icon-d-arrow-right" />
        </template>
        <el-form size="mini" :inline="true" :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()"
            label-width="90px" label-suffix="：" >
          <el-form-item label="业务单号" prop="billNum">
              <el-input v-model="dataForm.billNum" clearable ></el-input>
          </el-form-item>
          <el-form-item label="业务类型" prop="transactionType">
              <el-input v-model="dataForm.transactionType" clearable ></el-input>
          </el-form-item>
          <el-form-item label-width="100px" label="上游业务单号" prop="sourceOrderNum">
              <el-input v-model="dataForm.sourceOrderNum" clearable ></el-input>
          </el-form-item>
          <el-form-item label-width="120px" label="上游业务单据类型" prop="sourceOrderType">
              <el-input v-model="dataForm.sourceOrderType" clearable ></el-input>
          </el-form-item>
          <el-form-item label="经办人" prop="pic">
            <im-selector
              v-model="dataForm.pic"
              :mapModel.sync="dataForm"
              mapKeyVal="pic"
              dataType="biz/employee">
              </im-selector>
          </el-form-item>
          <el-form-item label="状态" prop="status">
              <im-selector
              v-model="dataForm.status"
              :mapModel.sync="dataForm"
              mapKeyVal="status"
              :clearable="false"
              dataType="code.status">
              </im-selector>
          </el-form-item>
          <el-form-item label="出入库日期" prop="inDate">
            <el-date-picker
            v-model="dataForm.inDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions">
          </el-date-picker>
          </el-form-item>
          <el-form-item label="出入库仓库" prop="warehouse">
              <el-input v-model="dataForm.warehouseId" clearable ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search" >{{ $t('views.public.query') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleFormReset"> <d2-icon name="refresh"/> 重置 </el-button>
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
      :columns="tableColumn"
      :select-config="{reserve: true}"
      :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
      @cell-dblclick="cellDblClick"
      :footer-method="footerMethod"
      show-footer
      >
      <template v-slot:buttons>
        <el-button size="mini" icon="el-icon-circle-plus" v-if="$hasPermission('inv:inoutbill:save')" @click="addHandle">新增</el-button>
        <el-button type="primary" size="mini" icon="el-icon-edit" v-if="$hasPermission('inv:inoutbill:save')" @click="updateHandle($refs.pGrid)">修改</el-button>
        <el-button type="danger"  size="mini" icon="el-icon-delete" v-if="$hasPermission('inv:inoutbill:delete')" @click="deleteHandle($refs.pGrid)">删除</el-button>
        <el-button type="success" size="mini" icon="el-icon-check" v-if="$hasPermission('inv:inoutbill:save')" >提交</el-button>
        <el-button size="mini" icon="el-icon-user" v-if="$hasPermission('inv:inoutbill:save')" @click="pickHandle($refs.pGrid)">拣货</el-button>
        <el-button type="info" size="mini" icon="el-icon-printer" v-if="$hasPermission('inv:inoutbill:print')" >打印</el-button>
        <el-button type="info" size="mini" icon="fa fa-file-excel-o" v-if="$hasPermission('inv:inoutbill:export')" @click="$refs.pGrid.exportCsv()">  导出</el-button>
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
import AddOrUpdate from './inoutbill-add-or-update'
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/inv/inoutbill/list',
        getDataListIsPage: true,
        updateURL: '/inv/inoutbill/update',
        deleteURL: '/inv/inoutbill/delete',
        deleteIsBatch: true,
        exportURL: '/inv/inoutbill/export'
      },
      dataForm: {
          billNum:'',
          transactionType:'',
          sourceOrderType:'',
          sourceOrderNum:'',
          pic:'',
          inDate:'',
          status:'',
          warehouse:''
          },
      tableColumn: [
        { type: 'selection', width: 50, align: 'center' },
        { type: 'index', width: 50, align: 'center' },
        {
          title: '业务单号',
          field: 'billNum',
          sortable: true,
          width: 110,
          align: 'center'
        },
        {
          title: '业务类型',
          field: 'transactionTypeMean',
          sortable: true,
          align: 'center'
        },
        {
          title: '上游业务单号',
          field: 'sourceOrderNum',
          sortable: true,
          width: 110,
          align: 'center'
        },
        {
          title: '上游业务单据类型',
          field: 'sourceOrderTypeMean',
          sortable: true,
          width: 120,
          align: 'center'
        },
        {
          title: '经办人',
          field: 'pic',
          sortable: true,
          align: 'center'
        },
        {
          title: '出入库日期',
          field: 'inDate',
          sortable: true,
          align: 'center',
          formatter: ['toDateString', 'yyyy-MM-dd']
        },
        {
          title: '状态',
          field: 'statusMean',
          sortable: true,
          align: 'center'
        },
        {
          title: '出入库仓库',
          field: 'warehouseCode',
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
        id: 'inoutbill_toolbar_1',
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