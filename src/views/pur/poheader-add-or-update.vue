<template>
  <el-dialog
    :title="pageTitle"
    :close-on-click-modal="false"
    :visible.sync="visible"
    v-loading.fullscreen.lock="fullscreenLoading"
    class="abow_dialog"
    width="80%"
  >
    <div>
      <dynamic-form
        v-model="dataForm"
        :formprops="formprops"
        ref="dataForm"
        col-span="8,8,8"
        :read-only="formReadOnly"
        :alldescriptors="descriptors"
      ></dynamic-form>
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
      :edit-rules="validRules"
      @edit-closed="editClosed"
      :edit-config="{trigger: 'dblclick', mode: 'cell'}"
      :columns="tableColumn"
      :select-config="{reserve: true}"
      :mouse-config="{selected: true}"
      :keyboard-config="{isArrow: true, isDel: true, isTab: true, isEdit: true}"
      :footer-cell-class-name="footerCellClassName"
      :footer-method="footerMethod"
      show-footer
    >
      <template v-slot:buttons>
        <el-button v-show="enableSubmit && (entityModel.status !== 'SUBMIT' && entityModel.status !== 'SENDED')" size="mini" icon="el-icon-circle-plus" @click="$refs.sGrid.insert({})">新增</el-button>
        <el-button
          v-show="enableSubmit &&  (entityModel.status !== 'SUBMIT' && entityModel.status !== 'SENDED')" 
          type="danger"
          size="mini"
          icon="el-icon-delete"
          @click="removeSelecteds($refs.sGrid)"
        >删除</el-button>
      </template>
    </vxe-grid>
    <span slot="footer" class="dialog-footer">
      <el-button 
        v-show="enableSubmit" type="danger" @click="visible = false">取消</el-button>
      <el-button
        type="primary"
        v-show="enableSubmit"
        :disabled="btnDisable"
        @click="dataFormSubmit"
      >确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
import XEUtils from "xe-utils";

const separate = { type: "separate" };
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/pur/poline/list",
        updateURL: "/pur/poheader/save",
        prodURL: "/base/product/search",
        deleteIsBatch: true,
        getDataListIsPage: false
      },
      visible: false,
      btnDisable: false,
      pageTitle: "采购单新增",
      dataForm: {
        orderType: "PO",
        vendorId: "",
        contactName: "",
        contactPhone: "",
        agentId: "",
        warehouseId: "",
        planDeliveryDate: "",
        payType: null,
        shipType: null,
        shipName: null,
        shipId: null,
        shipNum: null,
        freight: null,
        isAuto: true,
        remark: ""
      },
      descriptors: {
        orderNum: {
          type: "string",
          label: "采购单号",
          disabled: "disabled",
          props: {
            clearable: true
          }
        },
        agentId: {
          type: "cust",
          label: "采购员",
          name: "im-selector",
          props: {
            mapKeyVal: "agentName:agentId",
            dataType: "biz.employee",
            clearable: true
          },
          required: true
        },
        warehouseId: {
          type: "cust",
          label: "仓库",
          ruletype: "integer",
          name: "im-selector",
          props: {
            mapKeyVal: "warehouseCode:warehouseId",
            dataType: "biz.warehouse",
            clearable: true
          },
          required: true
        },
        separate1: separate,
        vendorId: {
          type: "cust",
          label: "供应商",
          ruletype: "integer",
          name: "im-selector",
          props: {
            mapKeyVal: "vendorName:vendorId",
            dataType: "biz.vendor",
            clearable: true
          },
          required: true
        },
        contactName: {
          type: "string",
          label: "供应商联系人",
          props: {
            clearable: true
          }
        },
        contactPhone: {
          type: "string",
          label: "供应商联系电话",
          props: {
            clearable: true
          }
        },
        separate2: separate,
        payType: {
          type: "cust",
          label: "运费付款方式",
          name: "im-selector",
          props: {
            mapKeyVal: "payType",
            dataType: "code.SHIP_PAYTYPE",
            clearable: true
          }
        },
        shipType: {
          type: "cust",
          label: "发运方式",
          name: "im-selector",
          ruletype: "integer",
          props: {
            mapKeyVal: "shipType",
            dataType: "dict.SHIP_TYPE",
            clearable: true
          }
        },
        shipId: {
          type: "cust",
          label: "发运公司",
          ruletype: "integer",
          name: "im-selector",
          props: {
            mapKeyVal: "shipName:shipId",
            dataType: "biz.shipComp",
            clearable: true
          }
        },
        separate3: separate,
        shipNum: {
          type: "string",
          label: "发运单号",
          props: {
            clearable: true
          }
        },
        freight: {
          type: "string",
          label: "运费",
          props: {
            clearable: true
          }
        },
        isAuto: {
          label: "拣货方式",
          type: "boolean",
          required: true,
          props: {
            inactiveText: "人工",
            activeText: "自动"
          }
        },
        separate4: separate,
        remark: { type: "string", label: "备注", colspan: 3 }
      },
      tableProxy: {
        autoLoad: false
      },
      validRules: {
        productCode: [{ required: true, message: "物料必填" }],
        orderQty: [
          { required: true, message: "下单数必填" },
          { type: "number", message: "请输入数字" }
        ],
        costPrice: [
          { required: true, message: "采购价必填" },
          { type: "number", message: "请输入数字" }
        ],
        acceptQty: [
          {
            validator: (rule, val, callback,{row})=>{
              if(val) {
                if(Number(val)> (Number(row.orderQty)-Number(row.totalAcceptQty))) {
                  callback(new Error('收货数不能大于剩余收货数'))
                  return
                }
              }
             callback()
            }
          }
        ]
      },
      tableColumn: [
        { type: "selection", width: 30, align: "center" }, 
        { type: "index", width: 40, align: "center" },
        {
          title: "商品",
          field: "productCode",
          sortable: true,
          align: "center",
          editRender: {
            name: "ElAutocomplete",
            props: {
              fetchSuggestions: this.prodSeach,
              triggerOnFocus: false,
              popperClass: "prod-popper"
            },
            events: { select: this.handleProcSelect },
            autoselect: true
          },
          footerRender: function(column, data) {
            return "汇总";
          }
        },
        {
          title: "单位",
          field: "uom",
          sortable: true,
          align: "center"
        },
        {
          title: "物料描述",
          field: "description",
          sortable: true,
          align: "center"
        },
        {
          title: "下单数",
          field: "orderQty",
          sortable: true,
          align: "center",
          editRender: { name: "input" },
          footerRender: this.footerSum
        },
        {
          title: "累计收货数",
          field: "totalAcceptQty",
          sortable: true,
          align: "center",
          footerRender: this.footerSum
        },
        {
          title: "收货数",
          field: "acceptQty",
          sortable: true,
          align: "center",
          footerRender: this.footerSum
        },
        {
          title: "采购价",
          field: "costPrice",
          sortable: true,
          align: "right",
          formatter: this.formatterMoney,
          editRender: { name: "input" }
        },
        {
          title: "分摊运费",
          field: "freight",
          sortable: true,
          align: "right",
          formatter: this.formatterMoney,
          editRender: { name: "input" },
          footerRender: this.footerSum
        },
        {
          title: "采购总金额",
          field: "totalPrice",
          align: "right",
          formatter: this.formatterMoney,
          editPost: function(column, row) {
            var qty = row.orderQty;
            var costPrice = row.costPrice;
            if (!Number.isNaN(qty) && !Number.isNaN(costPrice)) {
              return Number(qty) * Number(costPrice).toFixed(2);
            }
          },
          footerRender: this.footerSum
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
    prodSeach(queryString, cb) {
      if (queryString) {
        this.$axios
          .post(this.mixinViewModuleOptions.prodURL, { name: queryString })
          .then(res => {
            for (var i = 0; i < res.length; i++) {
              res[i].value = res[i].val;
            }
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
              cb(res);
            }, 100 * Math.random());
          });
      }
    },
    handleProcSelect(t, item) {
      var row = t.row;
      if (item) {
        Object.assign(row, item);
        row.uom = item.unit;
        row.productId = item.id;
        row.productCode = item.code;
      } else {
      }
    },
    initCB() {
      this.pageTitle = this.isNew ? "采购单新增" : "采购单修改";
      this.$nextTick(() => {
        if (this.isNew) {
          this.$refs.dataForm.readOnly(false);
        } else {
          if (this.entityModel.status === "NEW") {
            this.$refs.dataForm.readOnly(false);
          } else {
            if (this.entityModel.status === "SUBMIT" || this.entityModel.status === 'SENDED') {
              this.entityModel.saveType='pick'
              this.enableSubmit = true;
              this.pageTitle = "采购单收货";
              this.$refs.dataForm.readOnly(true, [
                "shipId",
                "shipType",
                "payType",
                "shipNum",
                "freight",
                "isAuto",
                "remark"
              ]);
              delete this.tableColumn[2].editRender
              delete this.tableColumn[5].editRender
              Object.assign(this.tableColumn[7] ,{editRender: { name: "input" }})
              Object.assign(this.tableColumn[9] ,{editRender: { name: "input" }})
              this.$refs.sGrid.loadColumn(this.tableColumn)
              return
            } else {
              this.$refs.dataForm.readOnly(true);
            }
          }
        }
        delete this.dataForm.saveType
        delete this.tableColumn[7].editRender
        delete this.tableColumn[9].editRender
        Object.assign(this.tableColumn[5] ,{editRender: { name: "input" }})
        Object.assign(this.tableColumn[2] ,{
          editRender: {
            name: "ElAutocomplete",
            props: {
              fetchSuggestions: this.prodSeach,
              triggerOnFocus: false,
              popperClass: "prod-popper"
            },
            events: { select: this.handleProcSelect },
            autoselect: true
          }
        })
        this.$refs.sGrid.loadColumn(this.tableColumn)
      });
    },
    editClosed({row,rowIndex,$rowIndex,column,columnIndex,$columnIndex,cell}) {
      if(column.property === 'freight'){
        const totalData = this.$refs.sGrid.getTableData().fullData
        const totalFrei = XEUtils.sum(totalData, 'freight')
        if(totalFrei > this.totalFreight) {
          alert('分摊运费之和不能大于总运费')
          row.freight = 0
          this.$refs.sGrid.updateFooter()
          return
        }
        //this.calFreight(this.totalFreight)
      }else if(column.property === 'acceptQty'){
        this.calFreight(this.totalFreight)
      }
    },
    calFreight(freight) {
      const totalData = this.$refs.sGrid.getTableData().fullData
      const totalQty = XEUtils.sum(totalData, 'acceptQty')
      if(totalQty <= 0)return
      if(!freight)freight = 0
      let average =  freight/totalQty | 0
      let mod = freight % totalQty
      this.$nextTick(() => {
        for(var i = 0; i < totalData.length ; i++) {
          if(freight <= 0) {
            totalData[i].freight = 0;
            continue;
          }
          totalData[i].freight = totalData[i].acceptQty * average
          if(average === 0) {
            mod = 0
            if(totalData[i].acceptQty >= freight) {
               totalData[i].freight = freight;
            } else {
              totalData[i].freight = totalData[i].acceptQty;
            }
          }
          if(!totalData[i].freight) {
            totalData[i].freight = 0;
            continue;
          }
          if(totalData[i].acceptQty>0){
            totalData[i].freight += mod
            mod=0
          }
          /*if(i === totalData.length -1) {
            totalData[i].freight += mod
          }*/
          freight -= totalData[i].freight
          this.$refs.sGrid.reloadRow(totalData[i])
        }
        this.$refs.sGrid.updateFooter()
      })
    }
  },
  computed: {
    totalFreight() {
      return Number(this.dataForm.freight)
    }
  },
  watch: {
    totalFreight: function(newValue, oldValue) {
     this.calFreight(Number(newValue))
    }
  },
  mounted() {}
};
</script>
