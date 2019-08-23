<template>
  <el-dialog
    :close-on-press-escape="false"
    title="仓库拣货"
    :close-on-click-modal="false"
    :visible.sync="visible"
    v-loading.fullscreen.lock="fullscreenLoading"
    class="abow_dialog"
    width="80%"
  >
    <vxe-grid
      border
      resizable
      size="mini"
      class="vxe-table-element"
      remote-filter
      ref="sGrid"
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
        <label style="margin-left:30px;">产品条码：</label>
        <el-input class="barCode" v-model="dataForm.barCode" size="mini" clearable
        placeholder="请输入产品条码" @keyup.enter.native="doScan"></el-input>
        <label style="margin-left:30px;">业务单据：</label>
        <span>{{dataForm.billNum}}</span>
        <label style="margin-left:30px;">业务类型：</label>
        <span>{{dataForm.transactionTypeMean}}</span>
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
import XEUtils from "xe-utils"
export default {
  name: 'inv-inoutbillline',
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/inv/inoutbillline/list",
        updateURL: "/inv/inoutbill/save",
        deleteIsBatch: true,
        getDataListIsPage: false
      },
      visible: false,
      btnDisable: false,
      dataForm: {
      },
      tableProxy: {
        autoLoad: false
      },
      tableColumn: [
        { type: "index", width: 50, align: "center" },
        {
          title: "产品",
          field: "productCode",
          sortable: true,
          align: "center"
        }, 
        {
          title: "条码",
          field: "barCode",
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
      },
      statusProps: {
        clearable: true,
        placeholder:"请选择状态"
      }
    }
  },
  created() {
    
  },
  methods: {
    doScan(e) {
      let val = e.target.value
      if(val && val.length>0) {
        let isExist = false;
        let isComplete = false;
        this.dataList.forEach(row => {
          let rQty = row.realQty || 0
          if(row.barCode === val) {
            isExist = true
            if(rQty < row.qty)
              row.realQty = Number(row.realQty) + 1
            else 
              isComplete = true
          }
        })
        if(!isExist) {
          this.dataForm.barCode = ''
          return this.$message({
            message: '条码不存在',
            type: 'error',
            duration: 2000
          })
        }
        if(isComplete) {
          this.dataForm.barCode = ''
          return this.$message({
            message: '条码['+val+']已完成拣货',
            type: 'warn',
            duration: 2000
          })
        }
        this.$refs.sGrid.updateFooter()
      }
    },
    cellClassName({ row, column }) {
      let rQty = row.realQty || 0
      if(row.qty > rQty && column.property  === 'realQty' )
        return 'col-red'
    }
  },
  computed: {
    
  },
  mounted() {
    
  }
}
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
