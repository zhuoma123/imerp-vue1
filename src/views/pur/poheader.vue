<template>
  <d2-container >
    <el-collapse slot="header">
      <el-collapse-item>
        <template slot="title">
          查询条件<i class="el-icon-d-arrow-right" />
        </template>
        <el-form size="mini" :inline="true" :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()"
                 label-width="90px" label-suffix="：" >
                <el-form-item label="id" prop="id">
                    <el-input v-model="dataForm.id" clearable ></el-input>
                </el-form-item>
                <el-form-item label="订单类型" prop="orderType">
                    <el-input v-model="dataForm.orderType" clearable ></el-input>
                </el-form-item>
                <el-form-item label="采购订单号" prop="orderNum">
                    <el-input v-model="dataForm.orderNum" clearable ></el-input>
                </el-form-item>
                <el-form-item label="供应商ID" prop="vendorId">
                    <el-input v-model="dataForm.vendorId" clearable ></el-input>
                </el-form-item>
                <el-form-item label="供应商联系人" prop="contactName">
                    <el-input v-model="dataForm.contactName" clearable ></el-input>
                </el-form-item>
                <el-form-item label="供应商联系电话" prop="contactPhone">
                    <el-input v-model="dataForm.contactPhone" clearable ></el-input>
                </el-form-item>
                <el-form-item label="采购日期" prop="orderDate">
                  <el-date-picker
            v-model="dataForm.orderDate"
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
                <el-form-item label="采购主题" prop="topic">
                    <el-input v-model="dataForm.topic" clearable ></el-input>
                </el-form-item>
                <el-form-item label="采购员" prop="agentId">
                    <el-input v-model="dataForm.agentId" clearable ></el-input>
                </el-form-item>
                <el-form-item label="计划交货期" prop="planDeliveryDate">
                  <el-date-picker
            v-model="dataForm.planDeliveryDate"
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
                <el-form-item label="状态" prop="status">
                    <el-input v-model="dataForm.status" clearable ></el-input>
                </el-form-item>
                <el-form-item label="采购总金额" prop="orderAmount">
                    <el-input v-model="dataForm.orderAmount" clearable ></el-input>
                </el-form-item>
                <el-form-item label="公司" prop="companyId">
                    <el-input v-model="dataForm.companyId" clearable ></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" clearable ></el-input>
                </el-form-item>
                <el-form-item label="删除标记" prop="deletedFlag">
                    <el-input v-model="dataForm.deletedFlag" clearable ></el-input>
                </el-form-item>
                <el-form-item label="创建人" prop="createBy">
                    <el-input v-model="dataForm.createBy" clearable ></el-input>
                </el-form-item>
                <el-form-item label="创建日期" prop="createDate">
                  <el-date-picker
            v-model="dataForm.createDate"
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
                <el-form-item label="修改人" prop="updateBy">
                    <el-input v-model="dataForm.updateBy" clearable ></el-input>
                </el-form-item>
                <el-form-item label="修改日期" prop="updateDate">
                  <el-date-picker
            v-model="dataForm.updateDate"
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
      @cell-dblclick="cellDblClick">
      <template v-slot:buttons>
        <el-button size="mini" icon="el-icon-circle-plus" v-if="$hasPermission('pur:poheader:save')" @click="addHandle">新增</el-button>
        <el-button type="primary" size="mini" icon="el-icon-edit" v-if="$hasPermission('pur:poheader:save')" @click="updateHandle($refs.pGrid)">修改</el-button>
        <el-button type="danger"  size="mini" icon="el-icon-delete" v-if="$hasPermission('pur:poheader:delete')" @click="deleteHandle($refs.pGrid)">删除</el-button>
        <el-button type="success" size="mini" icon="el-icon-check" v-if="$hasPermission('pur:poheader:save')" >提交</el-button>
        <el-button type="info" size="mini" icon="el-icon-printer" v-if="$hasPermission('pur:poheader:print')" >打印</el-button>
        <el-button type="info" size="mini" icon="fa fa-file-excel-o" v-if="$hasPermission('pur:poheader:export')" @click="$refs.pGrid.exportCsv()">  导出</el-button>
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
import AddOrUpdate from './poheader-add-or-update'
import mixinViewModule from '@/mixins/view-module'
export default {
  name: 'pur-poheader',
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/pur/poheader/list',
        getDataListIsPage: true,
        updateURL: '/pur/poheader/update',
        deleteURL: '/pur/poheader/delete',
        deleteIsBatch: true,
        exportURL: '/pur/poheader/export'
      },
      dataForm: {
          id:'',
          orderType:'',
          orderNum:'',
          vendorId:'',
          contactName:'',
          contactPhone:'',
          orderDate:'',
          topic:'',
          agentId:'',
          planDeliveryDate:'',
          status:'',
          orderAmount:'',
          companyId:'',
          remark:'',
          deletedFlag:'',
          createBy:'',
          createDate:'',
          updateBy:'',
          updateDate:'',
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
          title: '订单类型',
          field: 'orderType',
          sortable: true,
          align: 'center'
        },
                              {
          title: '采购订单号',
          field: 'orderNum',
          sortable: true,
          align: 'center'
        },
                              {
          title: '供应商ID',
          field: 'vendorId',
          sortable: true,
          align: 'center'
        },
                              {
          title: '供应商联系人',
          field: 'contactName',
          sortable: true,
          align: 'center'
        },
                              {
          title: '供应商联系电话',
          field: 'contactPhone',
          sortable: true,
          align: 'center'
        },
                              {
          title: '采购日期',
          field: 'orderDate',
          sortable: true,
          align: 'center',
          formatter: ['toDateString', 'yyyy-MM-dd']
        },
                              {
          title: '采购主题',
          field: 'topic',
          sortable: true,
          align: 'center'
        },
                              {
          title: '采购员',
          field: 'agentId',
          sortable: true,
          align: 'center'
        },
                              {
          title: '计划交货期',
          field: 'planDeliveryDate',
          sortable: true,
          align: 'center',
          formatter: ['toDateString', 'yyyy-MM-dd']
        },
                              {
          title: '状态',
          field: 'status',
          sortable: true,
          align: 'center'
        },
                              {
          title: '采购总金额',
          field: 'orderAmount',
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
          title: '备注',
          field: 'remark',
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
