<template>
  <d2-container >
    <el-collapse slot="header">
      <el-collapse-item>
        <template slot="title">
          查询条件<i class="el-icon-d-arrow-right" />
        </template>
      <el-form size="mini" :inline="true" :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()"
              label-width="90px" label-suffix="：" >

        <!--<el-row >-->
          <!--<el-col :span="6">-->
            <el-form-item label="客户名称" prop="custName">
              <el-input v-model="dataForm.custName" clearable />
            </el-form-item>
          <!--</el-col>-->

          <!--<el-col :span="6">-->
            <el-form-item label="单据状态" prop="status">
              <im-selector
              v-model="dataForm.status"
              :mapModel.sync="dataForm"
              mapKeyVal="status"
              dataType="code.ORDER_STATUS">
              </im-selector>
            </el-form-item>
          <!--</el-col>-->
          <!--<el-col :span="12">-->
            <el-form-item label="下单时间" prop="bDate">
              <el-date-picker
                v-model="dataForm.bDate"
                type="daterange"
                align="right"
                unlink-panels
                size="mini"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions">
              </el-date-picker>

              <!--<el-col :span="11">-->
                <!--<el-date-picker type="date" placeholder="选择日期" v-model="dataForm.bDate" style="width: 100%;"></el-date-picker>-->
              <!--</el-col>-->
              <!--<el-col class="line" align="center" :span="1">-</el-col>-->
              <!--<el-col :span="11" prop="eDate">-->
                <!--<el-date-picker type="date" placeholder="选择日期" v-model="dataForm.eDate" style="width: 100%;"></el-date-picker>-->
              <!--</el-col>-->
            </el-form-item>
          <!--</el-col>-->
        <!--</el-row>-->

        <!--<el-row >-->
          <!--<el-col :span="6">-->
          <el-form-item label="配送方式" prop="shipType">
            <im-selector
              v-model="dataForm.shipType"
              :mapModel.sync="dataForm"
              mapKeyVal="shipType"
              dataType="dict.SHIP_TYPE">
              </im-selector>
          </el-form-item>
          <!--</el-col>-->
          <!--<el-col :span="6">-->
          <el-form-item label="收货地址" prop="receiveAddress">
            <el-input v-model="dataForm.receiveAddress" clearable></el-input>
          </el-form-item>
          <!--</el-col>-->
          <!--<el-col :span="12">-->
          <el-form-item label="收货人" prop="receiveName">
            <el-input v-model="dataForm.receiveName" placeholder="收货人/手机" clearable></el-input>
          </el-form-item>
          <!--</el-col>-->
        <!--</el-row>-->

        <!--<el-row >-->
          <!--<el-col :span="6">-->
          <el-form-item label="销售员" prop="pic">
            <el-input v-model="dataForm.pic" clearable/>
          </el-form-item>
          <!--</el-col>-->
          <!--<el-col :span="6">-->
          <el-form-item label="配件信息" prop="productName">
            <el-input v-model="dataForm.productName" placeholder="名称/品牌/产地/车型/图号" clearable />
          </el-form-item>
          <!--</el-col>-->
            <!--<el-col :span="6">-->
              <el-form-item label="销售单号" prop="orderNum">
                <el-input v-model="dataForm.orderNum" clearable/>
              </el-form-item>
            <!--</el-col>-->

          <!--<el-col :span="6">-->
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
        remote-sort
        size="mini"
        ref="pGrid"
        row-id="id"
        auto-resize
        :sort-config="sortConfig"
        :loading="dataListLoading"
        :toolbar="toolbar"
        :proxy-config="tableProxy"
        :columns="tableColumn"
        :select-config="{reserve: true}"
        :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
        :footer-method="footerMethod"
        :footer-cell-class-name="footerCellClassName"
        show-footer
        @cell-dblclick="cellDblClick">
      <template v-slot:buttons>
        <el-button size="mini" icon="el-icon-circle-plus" 
          v-if="$hasPermission('so:salesorder:save')" @click="addHandle">新增</el-button>
        <el-button size="mini" type="primary" icon="el-icon-edit" 
          v-if="$hasPermission('so:salesorder:update')" @click="updateHandle($refs.pGrid)">修改</el-button>
        <el-button size="mini" type="danger" icon="el-icon-delete" 
          v-if="$hasPermission('so:salesorder:delete')" @click="deleteHandle($refs.pGrid)">删除</el-button>
        <el-button size="mini" type="success" icon="el-icon-check" @click="submitHandle()">提交</el-button>
        <el-button size="mini" type="info" icon="el-icon-printer" @click="deleteHandle()">打印</el-button>
        <el-button size="mini" type="info" icon="fa fa-file-excel-o" @click="$refs.pGrid.exportCsv()">导出</el-button>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
  </d2-container>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import XEUtils from 'xe-utils'
import AddOrUpdate from './salesorder-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/so/salesorder/list',
        updateURL: '/so/salesorder/update',
        deleteURL: '/so/salesorder/delete',
        exportURL: '/so/salesorder/export',
        submitURL: '/so/salesorder/submit',
        getDataListIsPage: true
      },
      dataForm: {
        custName: '',
        status: '',
        bDate: null,
        shipType: '',
        receiveAddress: '',
        receiveName: '',
        pic: '',
        productName: '',
        orderNum: ''
      },
      dataFormOp: {
      },
      tableColumn: [
        { type: 'selection', width: 30, align: 'center' },
        { type: 'index', width: 40, align: 'center' },
        {
          title: '下单日期',
          field: 'orderDate',
          sortable: true,
          width: '110px',
          align: 'center',
          formatter: ['toDateString', 'yyyy-MM-dd']
        },
        {
          title: '销售单号',
          field: 'orderNum',
          width: '120px',
          sortable: true,
          align: 'center'
        },
        {
          title: '客户名称',
          field: 'customerName',
          width: '180px',
          sortable: true,
          align: 'left'
        },
        {
          title: '状态',
          field: 'statusMean',
          width: '80px',
          align: 'left'
        },
        {
          title: '订单金额',
          field: 'orderAmount',
          sortable: true,
          width: '100px',
          align: 'left',
          formatter: ['toFixedString', 2],
          footerRender: function (column, data) {
            return XEUtils.sum(data, column.property)
          }
        },
        {
          title: '发运方式',
          field: 'shipTypeMean',
          width: '80px',
          align: 'center'
        },
        {
          title: '销售员',
          field: 'pic',
          width: '100px',
          align: 'center'
        },
        {
          title: '备注',
          field: 'remark',
          sortable: true
        },
        {
          title: this.$t('views.public.createDate'),
          field: 'createDate',
          sortable: true,
          width: '120px',
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

    //提交

  }
}
</script>
