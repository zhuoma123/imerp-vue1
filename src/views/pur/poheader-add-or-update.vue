<template>
  <el-dialog
    :title="isNew ? '采购单新增' : '采购单修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    v-loading.fullscreen.lock="fullscreenLoading"
    class="abow_dialog"
    width="80%"
  >
    <div>
      <el-form
        :model="dataForm"
        labelSuffix="："
        size="mini"
        :rules="dataRule"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
        label-width="120px"
      >
        <el-row>
        <el-col :span="8">
        <el-form-item label="id" prop="id">
                          <el-input v-model="dataForm.id" clearable ></el-input>
                      </el-form-item>
        </el-col>
                <el-col :span="8">
        <el-form-item label="订单类型" prop="orderType">
                          <el-input v-model="dataForm.orderType" clearable ></el-input>
                      </el-form-item>
        </el-col>
                <el-col :span="8">
        <el-form-item label="采购订单号" prop="orderNum">
                          <el-input v-model="dataForm.orderNum" clearable ></el-input>
                      </el-form-item>
        </el-col>
                <el-col :span="8">
        <el-form-item label="供应商ID" prop="vendorId">
                          <el-input v-model="dataForm.vendorId" clearable ></el-input>
                      </el-form-item>
        </el-col>
                <el-col :span="8">
        <el-form-item label="供应商联系人" prop="contactName">
                          <el-input v-model="dataForm.contactName" clearable ></el-input>
                      </el-form-item>
        </el-col>
                <el-col :span="8">
        <el-form-item label="供应商联系电话" prop="contactPhone">
                          <el-input v-model="dataForm.contactPhone" clearable ></el-input>
                      </el-form-item>
        </el-col>
                <el-col :span="8">
        <el-form-item label="采购日期" prop="orderDate">
                          <el-date-picker type="date" placeholder="选择日期" v-model="dataForm.OrderDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                      </el-form-item>
        </el-col>
                <el-col :span="8">
        <el-form-item label="采购主题" prop="topic">
                          <el-input v-model="dataForm.topic" clearable ></el-input>
                      </el-form-item>
        </el-col>
                <el-col :span="8">
        <el-form-item label="采购员" prop="agentId">
                          <el-input v-model="dataForm.agentId" clearable ></el-input>
                      </el-form-item>
        </el-col>
                <el-col :span="8">
        <el-form-item label="计划交货期" prop="planDeliveryDate">
                          <el-date-picker type="date" placeholder="选择日期" v-model="dataForm.PlanDeliveryDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                      </el-form-item>
        </el-col>
                <el-col :span="8">
        <el-form-item label="状态" prop="status">
                          <el-input v-model="dataForm.status" clearable ></el-input>
                      </el-form-item>
        </el-col>
                <el-col :span="8">
        <el-form-item label="采购总金额" prop="orderAmount">
                          <el-input v-model="dataForm.orderAmount" clearable ></el-input>
                      </el-form-item>
        </el-col>
                <el-col :span="8">
        <el-form-item label="公司" prop="companyId">
                          <el-input v-model="dataForm.companyId" clearable ></el-input>
                      </el-form-item>
        </el-col>
                <el-col :span="8">
        <el-form-item label="备注" prop="remark">
                          <el-input v-model="dataForm.remark" clearable ></el-input>
                      </el-form-item>
        </el-col>
                <el-col :span="8">
        <el-form-item label="删除标记" prop="deletedFlag">
                          <el-input v-model="dataForm.deletedFlag" clearable ></el-input>
                      </el-form-item>
        </el-col>
                <el-col :span="8">
        <el-form-item label="创建人" prop="createBy">
                          <el-input v-model="dataForm.createBy" clearable ></el-input>
                      </el-form-item>
        </el-col>
                <el-col :span="8">
        <el-form-item label="创建日期" prop="createDate">
                          <el-date-picker type="date" placeholder="选择日期" v-model="dataForm.CreateDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                      </el-form-item>
        </el-col>
                <el-col :span="8">
        <el-form-item label="修改人" prop="updateBy">
                          <el-input v-model="dataForm.updateBy" clearable ></el-input>
                      </el-form-item>
        </el-col>
                <el-col :span="8">
        <el-form-item label="修改日期" prop="updateDate">
                          <el-date-picker type="date" placeholder="选择日期" v-model="dataForm.UpdateDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                      </el-form-item>
        </el-col>
                </el-row>
      </el-form>
    </div>
    <vxe-grid
      border
      resizable
      size="mini"
      highlight-current-row
      class="vxe-table-element"
      remote-filter
      ref="sGrid"
      :toolbar="toolbar"
      :proxy-config="tableProxy"
      :columns="tableColumn"
      :select-config="{reserve: true}"
      :mouse-config="{selected: true}"
      :keyboard-config="{isArrow: true, isDel: true, isTab: true, isEdit: true}"
      :edit-config="{trigger: 'dblclick', mode: 'cell'}"
      :footer-cell-class-name="footerCellClassName"
      :footer-method="footerMethod"
      show-footer
    >
        <template v-slot:buttons>
            <el-button size="mini" icon="el-icon-circle-plus" @click="$refs.sGrid.insert({})">新增</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeSelecteds($refs.sGrid)">删除</el-button>
        </template>
    </vxe-grid>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="btnDisable" @click="dataFormSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import mixinViewModule from "@/mixins/view-module"
import XEUtils from 'xe-utils'
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
          getDataListURL: '/pur/poheaderline/list',
	      updateURL: '/pur/poheader/update',
          deleteIsBatch: true,
          getDataListIsPage: false
      },
      visible: false,
      btnDisable: false,
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
      dataRule: {
        id:[
            { required: true, message: "id不能为空", trigger: "blur" }
        ],
        orderType:[
            { required: true, message: "订单类型不能为空", trigger: "blur" }
        ],
        orderNum:[
            { required: true, message: "采购订单号不能为空", trigger: "blur" }
        ],
        vendorId:[
            { required: true, message: "供应商ID不能为空", trigger: "blur" }
        ],
        contactName:[
            { required: true, message: "供应商联系人不能为空", trigger: "blur" }
        ],
        contactPhone:[
            { required: true, message: "供应商联系电话不能为空", trigger: "blur" }
        ],
        orderDate:[
            { required: true, message: "采购日期不能为空", trigger: "blur" }
        ],
        topic:[
            { required: true, message: "采购主题不能为空", trigger: "blur" }
        ],
        agentId:[
            { required: true, message: "采购员不能为空", trigger: "blur" }
        ],
        planDeliveryDate:[
            { required: true, message: "计划交货期不能为空", trigger: "blur" }
        ],
        status:[
            { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        orderAmount:[
            { required: true, message: "采购总金额不能为空", trigger: "blur" }
        ],
        companyId:[
            { required: true, message: "公司不能为空", trigger: "blur" }
        ],
        remark:[
            { required: true, message: "备注不能为空", trigger: "blur" }
        ],
        deletedFlag:[
            { required: true, message: "删除标记不能为空", trigger: "blur" }
        ],
        createBy:[
            { required: true, message: "创建人不能为空", trigger: "blur" }
        ],
        createDate:[
            { required: true, message: "创建日期不能为空", trigger: "blur" }
        ],
        updateBy:[
            { required: true, message: "修改人不能为空", trigger: "blur" }
        ],
        updateDate:[
            { required: true, message: "修改日期不能为空", trigger: "blur" }
        ],
      },
      tableProxy: {
          autoLoad: false
      },
      tableColumn: [
        { type: "selection", width: 30, align: "center" },
        { type: "index", width: 30, align: "center" },
        {
          title: 'id',
          field: 'id',
          sortable: true,
          align: 'center',
          editRender: { name: "input" }
        },
        {
          title: '订单id',
          field: 'orderId',
          sortable: true,
          align: 'center',
          editRender: { name: "input" }
        },
        {
          title: '商品id',
          field: 'productId',
          sortable: true,
          align: 'center',
          editRender: { name: "input" }
        },
        {
          title: '下单数',
          field: 'orderQty',
          sortable: true,
          align: 'center',
          editRender: { name: "input" }
        },
        {
          title: '实际收货数',
          field: 'realQty',
          sortable: true,
          align: 'center',
          editRender: { name: "input" }
        },
        {
          title: '采购价',
          field: 'price',
          sortable: true,
          align: 'center',
          editRender: { name: "input" }
        },
        {
          title: '备注',
          field: 'remark',
          sortable: true,
          align: 'center',
          editRender: { name: "input" }
        },
        {
          title: '创建人',
          field: 'createBy',
          sortable: true,
          align: 'center',
          editRender: { name: "input" }
        },
        {
          title: '创建日期',
          field: 'createDate',
          sortable: true,
          align: 'center',
          formatter: ['toDateString', 'yyyy-MM-dd'],
	      editRender: { name: "ElDatePicker" }
        },
        {
          title: '修改人',
          field: 'updateBy',
          sortable: true,
          align: 'center',
          editRender: { name: "input" }
        },
        {
          title: '修改日期',
          field: 'updateDate',
          sortable: true,
          align: 'center',
          formatter: ['toDateString', 'yyyy-MM-dd'],
	      editRender: { name: "ElDatePicker" }
        },
      ],
      toolbar: {
        id: "full_edit_1",
        resizable: {
            storage: true
        },
        setting: {
            storage: true
        }
      }
    }
  },
  methods: {
      },
  mounted () {
  }
};
</script>
