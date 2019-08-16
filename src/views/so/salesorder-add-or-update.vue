<template>
  <el-dialog :title="isNew ? '销售单新增' : '销售单修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    v-loading.fullscreen.lock="fullscreenLoading"
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
        <el-row inline>
          <el-col :span="8">
            <el-form-item label="客户" prop="customerId">
              <im-selector 
              v-model="dataForm.customerId" 
              :mapModel.sync="dataForm"
              mapKeyVal="customerId:customerName" 
              dataType="customer" 
              @change="changeCust">
              </im-selector>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售日期" prop="orderDate">
              <el-date-picker
                v-model="dataForm.orderDate"
                placeholder="销售日期"
                style="width:160px"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="要求交货期" prop="planDeliveryDate">
              <el-date-picker
                v-model="dataForm.planDeliveryDate"
                placeholder="要求交货期"
                value-format="yyyy-MM-dd"
                style="width:160px"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row inline>
          <el-col :span="8">
            <el-form-item label="发运方式" prop="shipType">
              <el-input v-model="dataForm.shipType" placeholder="发运方式"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单金额" prop="orderAmount">
              <el-input v-model="dataForm.orderAmount" placeholder="订单金额"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row inline>
          <el-col :span="8">
            <el-form-item label="收货人" prop="receiveName">
              <el-input v-model="dataForm.receiveName" placeholder="收货人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收货人电话" prop="receivePhone">
              <el-input v-model="dataForm.receivePhone" placeholder="收货人电话"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收货地址" prop="receiveAddress">
              <el-input v-model="dataForm.receiveAddress" placeholder="收货地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
        </el-form-item>
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
      :columns="itableColumn"
      :select-config="{reserve: true}"
      :mouse-config="{selected: true}"
      :keyboard-config="{isArrow: true, isDel: true, isTab: true, isEdit: true}"
      :edit-config="{trigger: 'dblclick', mode: 'cell'}"
      :footer-cell-class-name="footerCellClassName"
      show-footer
    >
    <template v-slot:buttons>
        <el-button size="mini" icon="el-icon-circle-plus" @click="$refs.sGrid.insert({})">新增</el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeSelecteds($refs.sGrid)">删除</el-button>
    </template>
    </vxe-grid>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="btnDisable" @click="dataFormSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import mixinViewModule from "@/mixins/view-module"
import { Promise } from 'q';
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/so/salesorderline/list",
        getDataListIsPage: false,
        updateURL: "/so/salesorder/update",
        deleteIsBatch: true,
        prodURL: "/so/salesorder/prod"
      },

      visible: false,
      btnDisable: false,
      dataForm: {
        id: 0,
        orderType: "",
        customerId: "",
        orderDate: new Date(),
        planDeliveryDate: new Date(),
        orderAmount: "",
        shipType: "",
        remark: "",
        deletedFlag: "N"
      },
      dataRule: {
        orderType: [
          { required: true, message: "订单类型(销售/退货/报价)不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "订单号不能为空", trigger: "blur" }
        ],
        customerId: [
          { required: true, message: "客户id不能为空", trigger: "blur" }
        ],
        orderDate: [
          { required: true, message: "销售日期不能为空", trigger: "blur" }
        ],
        pic: [
          { required: true, message: "业务员id不能为空", trigger: "blur" }
        ],
        planDeliveryDate: [
          { required: true, message: "要求交货期不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "单据状态不能为空", trigger: "blur" }
        ],
        orderAmount: [
          { required: true, message: "订单金额不能为空", trigger: "blur" }
        ],
        receiveAddress: [
          { required: true, message: "收货地址不能为空", trigger: "blur" }
        ],
        receiveName: [
          { required: true, message: "收货人不能为空", trigger: "blur" }
        ],
        receivePhone: [
          { required: true, message: "收货人电话不能为空", trigger: "blur" }
        ],
        remark: [{ required: true, message: "备注不能为空", trigger: "blur" }],
        companyId: [
          { required: true, message: "公司不能为空", trigger: "blur" }
        ],
        deletedFlag: [
          { required: true, message: "删除标记不能为空", trigger: "blur" }
        ],
        createBy: [
          { required: true, message: "创建人不能为空", trigger: "blur" }
        ],
        createDate: [
          { required: true, message: "创建日期不能为空", trigger: "blur" }
        ],
        updateBy: [
          { required: true, message: "修改人不能为空", trigger: "blur" }
        ],
        updateDate: [
          { required: true, message: "修改日期不能为空", trigger: "blur" }
        ]
      },

      itableColumn: [
        { type: "selection", width: 30, align: "center" },
        { type: "index", width: 30, align: "center" },
        {
          title: "物料名称",
          field: "productName",
          width: "200px",
          align: "center",
          editRender: {
            name: "ElAutocomplete",
            props: { fetchSuggestions: this.prodSeach, triggerOnFocus: false},
            events: { select: this.handleProcSelect }
          },
          footerRender: function (column, data) {
            return '汇总'
          }
        },
        {
          title: "当前库存",
          field: "stock",
          align: "left"
        },
        {
          title: "指导售价",
          field: "bPrice",
          align: "left"
        },
        {
          title: "下单数量",
          field: "orderQty",
          align: "left",
          editRender: { name: "input" }
        },
        {
          title: "销售价",
          field: "price",
          sortable: true,
          align: "center",
          editRender: { name: "input" }
        },
        {
          title: "总金额",
          field: "totalPrice",
          align: "left",
          formatter: ["toFixedString", 2],
          editPost: function (column, row) {
            var qty = row.orderQty;
            var price = row.price;
            if (!Number.isNaN(qty) && !Number.isNaN(price)) {
              return Number(qty) * Number(price).toFixed(2);
            }
          },
          footerRender: function (column, data) {
            return XEUtils.sum(data, column.property)
          }
        },
        {
          title: "条码",
          field: "barCode",
          align: "center"
        },
        {
          title: "品牌",
          field: "brand",
          align: "center"
        },
        {
          title: "车型",
          field: "vehicle",
          align: "center"
        },
        {
          title: "产地",
          field: "madein",
          align: "center"
        },
        {
          title: "规格属性",
          field: "specialParam",
          align: "center"
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
      var restaurants = this.restaurants;
      var results = [];

      if (queryString) {
        this.$axios
          .post(this.mixinViewModuleOptions.prodURL, { name: queryString })
          .then(res => {
            for (var i = 0; i < res.length; i++) {
              res[i].value = res[i].val;
            }
            results = res;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
              cb(res);
            }, 100 * Math.random());
          });
      }
      //                clearTimeout(this.timeout)
      //                this.timeout = setTimeout(() => {
      //                    cb(results)
      //                }, 100 * Math.random())
    },
    handleProcSelect(t, item) {
      //                var row = this.$refs.sGrid.getCurrentRow();
      var row = t.row;
      if (item) {
        Object.assign(row, item);
        row.bPrice = item.salePrice;
      } else {
      }
    },
    search () {
      this.dataListLoading = true
      let vxeParams = {page:null, sort: null, filters: []}
      this.vxeTabQuery(vxeParams).then((resolve, rejects) => {
        this.$refs.sGrid.loadData(this.dataList)
        this.dataListLoading = false
      })
    },
    changeCust(e) {
      console.log('------', e, this.dataForm)
    }
  }, 
  mounted () {
  }
};
</script>
