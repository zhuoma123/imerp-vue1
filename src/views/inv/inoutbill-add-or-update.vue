<template>
  <el-dialog
    :close-on-press-escape="false"
    :title="isNew ? '出入库单新增' : '出入库单修改'"
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
        label-width="130px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="业务单号" prop="billNum">
              <el-input v-model="dataForm.billNum" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务类型" prop="transactionType">
              <el-input v-model="dataForm.transactionType" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="上游业务单号" prop="sourceOrderNum">
              <el-input v-model="dataForm.sourceOrderNum" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="上游业务单据类型" prop="sourceOrderType">
              <el-input v-model="dataForm.sourceOrderType" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经办人" prop="pic">
              <el-input v-model="dataForm.pic" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出入库日期" prop="inDate">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="dataForm.InDate"
                value-format="yyyy-MM-dd"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <im-selector
                v-model="dataForm.status"
                :mapModel.sync="dataForm"
                mapKeyVal="status"
                :clearable="false"
                data-type="code.status"
              ></im-selector>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出入库仓库" prop="warehouseCode">
              <el-input v-model="dataForm.warehouseCode" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="dataForm.remark" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <vxe-grid
      border
      resizable
      size="mini"
      class="vxe-table-element"
      remote-filter
      ref="sGrid"
      height="330"
      :toolbar="toolbar"
      :proxy-config="tableProxy"
      :columns="tableColumn"
      :mouse-config="{selected: true}"
      :keyboard-config="{isArrow: true, isDel: true, isTab: true, isEdit: true}"
      :edit-config="{trigger: 'dblclick', mode: 'cell'}"
      :cell-class-name="cellClassName"
      :footer-cell-class-name="footerCellClassName"
      :footer-method="footerMethod"
      show-footer
    >
      <template v-slot:buttons>
        <label style="margin-left:30px;">产品条码:</label>
        <el-input class="barCode" v-model="dataForm.barCode" size="mini" clearable
        placeholder="请输入产品条码" @keyup.enter.native="doScan"></el-input>
      </template>
    </vxe-grid>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="btnDisable" @click="dataFormSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
import XEUtils from "xe-utils";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/inv/inoutbillline/list",
        updateURL: "/inv/inoutbill/update",
        deleteIsBatch: true,
        getDataListIsPage: false
      },
      visible: false,
      btnDisable: false,
      dataForm: {
        id: "",
        billNum: "",
        transactionType: "",
        sourceOrderType: "",
        sourceOrderId: "",
        sourceOrderNum: "",
        pic: "",
        inDate: "",
        status: "",
        warehouseId: "",
        remark: "",
        companyId: "",
        deletedFlag: "",
        createBy: "",
        createDate: "",
        updateBy: "",
        updateDate: ""
      },
      dataRule: {
        id: [{ required: true, message: "id不能为空", trigger: "blur" }],
        billNum: [
          { required: true, message: "业务单号不能为空", trigger: "blur" }
        ],
        transactionType: [
          { required: true, message: "业务类型不能为空", trigger: "blur" }
        ],
        sourceOrderType: [
          {
            required: true,
            message: "上游业务单据类型不能为空",
            trigger: "blur"
          }
        ],
        sourceOrderId: [
          { required: true, message: "上游业务单id不能为空", trigger: "blur" }
        ],
        sourceOrderNum: [
          { required: true, message: "上游业务单号不能为空", trigger: "blur" }
        ],
        inDate: [
          { required: true, message: "出入库日期不能为空", trigger: "blur" }
        ],
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        warehouseId: [
          { required: true, message: "出入库仓库id不能为空", trigger: "blur" }
        ]
      },
      tableProxy: {
        autoLoad: false
      },
      tableColumn: [
        { type: "selection", width: 50, align: "center" },
        { type: "index", width: 50, align: "center" },
        {
          title: "货位",
          field: "warehouseSlotId",
          sortable: true,
          align: "center"
        },
        {
          title: "产品",
          field: "productCode",
          sortable: true,
          align: "center"
        },
        {
          title: "单位",
          field: "uom",
          align: "center",
          footerRender: function(column, data) {
            return "汇总";
          }
        },
        {
          title: "目标出入库数量",
          field: "qty",
          align: "center",
          footerRender: function(column, data) {
            return XEUtils.sum(data, column.property);
          }
        },
        {
          title: "实际出入库数量",
          field: "realQty",
          align: "center",
          editRender: { name: "input" },
          footerRender: function(column, data) {
            return XEUtils.sum(data, column.property);
          }
        },
        {
          title: "备注",
          field: "remark",
          sortable: true,
          align: "center",
          editRender: { name: "input" }
        }
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
    };
  },
  methods: {
    doScan(e) {
      let val = e.target.value
      if(val && val.length>0) {
        this.dataList.forEach(row => {
          if(row.productCode === val) {
            row.realQty = Number(row.realQty) + 1
          }
        })
        this.$refs.sGrid.updateFooter()
      }
    },
    cellClassName({ row, column }) {
      if(row.qty < row.realQty && column.property  === 'realQty' )
        return 'col-red'
    }
  },
  mounted() {
    this.$nextTick(() => {
      if(this.$refs.dataForm)
        this.$refs.dataForm.$el.readOnly = true 
    })
  }
};
</script>
<style lang="scss">
.barCode {
  width: 200px;
  margin-left: 5px;
}

.vxe-table-element .vxe-body--column.col-red {
  background-color: red;
  color: #fff;
}

</style>
