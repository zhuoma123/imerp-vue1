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
              <el-input style="display: none" v-model="dataForm.custId" ></el-input>
              <el-input v-model="dataForm.custName" clearable />
            </el-form-item>
          <!--</el-col>-->

          <!--<el-col :span="6">-->
            <el-form-item label="单据状态" prop="status">
              <el-select v-model="dataForm.status" placeholder="请选择单据状态">
                <el-option label="新建" value="NEW"></el-option>
                <el-option label="已提交" value="SUBMIT"></el-option>
              </el-select>
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
            <el-input v-model="dataForm.shipType" clearable></el-input>
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
            <el-input v-model="dataForm.productId" style="display:none"/>
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
        show-footer
        :sort-config="sortConfig"
        :loading="dataListLoading"
        :toolbar="toolbar"
        :proxy-config="tableProxy"
        :columns="tableColumn"
        :select-config="{reserve: true}"
        :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
        :footer-method="footerMethod"
        @cell-dblclick="cellDblClick">
      <template v-slot:buttons>
        <vxe-button @click="search">刷新</vxe-button>
        <vxe-button @click="addHandle">新增</vxe-button>
        <vxe-button @click="updateHandle($refs.pGrid)">修改</vxe-button>
        <vxe-button @click="deleteHandle($refs.pGrid)">删除</vxe-button>
        <vxe-button @click="deleteHandle()">提交</vxe-button>
        <vxe-button @click="deleteHandle()">打印</vxe-button>
        <vxe-button @click="$refs.pGrid.exportCsv()">导出.csv</vxe-button>
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
import AddOrUpdate from './salesorder-add-or-update'
import XEUtils from 'xe-utils'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/so/salesorder/list',
        updateURL: '/so/salesorder/update',
        deleteURL: '/so/salesorder/delete',
        exportURL: '/so/salesorder/export',
        getDataListIsPage: true
      },
      dataForm: {
        custName: ''
      },
      dataFormOp: {
      },
      tableColumn: [
        { type: 'selection', width: 40, align: 'center' },
        { type: 'index', width: 50, align: 'center' },
        {
          title: '下单日期',
          field: 'orderDate',
          sortable: true,
          width: '100px',
          align: 'center',
          formatter: ['toDateString', 'yyyy-MM-dd']
        },
        {
          title: '销售单号',
          field: 'orderNum',
          sortable: true,
          align: 'center'
        },
        {
          title: '客户名称',
          field: 'customerName',
          sortable: true,
          align: 'left'
        },
        {
          title: '状态',
          field: 'status',
          sortable: true,
          align: 'left'
        },
        {
          title: '订单金额',
          field: 'orderAmount',
          sortable: true,
          align: 'left'
        },
        {
          title: '发运方式',
          field: 'shipType',
          align: 'center'
        },
        {
          title: '销售员',
          field: 'pic',
          sortable: true,
          align: 'center'
        },
        {
          title: this.$t('views.public.createDate'),
          field: 'createDate',
          sortable: true,
          align: 'center'
        }
      ],
      tableProxy: {
        index: true, // 启用动态序号代理
        sort: true, // 启用排序代理
        filter: true, // 启用筛选代理
        ajax: {
          query: ({ page, sort, filters }) => {
            return this.vxeTabQuery({ page, sort, filters })
          }
        },
        props: {
          list: 'list',
          result: 'list',
          total: 'totalCount'
        }
      },
      toolbar: {
        id: 'full_edit_1',
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
    },
    footerMethod ({ columns, data }) {
      console.log(data)
        return [
          
          columns.map((column, columnIndex) => {
            if (columnIndex === 2) {
              return '汇总'
            }
            if (['orderAmount'].includes(column.property)) {
              return XEUtils.sum(data, column.property)
            }
            return null
          })
        ]
      }
  }
}
</script>