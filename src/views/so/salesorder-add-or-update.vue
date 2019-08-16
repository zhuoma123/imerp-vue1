<template>
  <el-dialog
    :title="isNew ? '销售单新增' : '销售单修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    v-loading.fullscreen.lock="fullscreenLoading"
    width="80%"
  >
    <div >
      <el-form
        :model="dataForm"
        labelSuffix="："
        size="mini"
        :rules="dataRule"
        ref="dataForm"
        label-width="120px"
        :disabled="isReadOnly"
      >
        <el-row inline>
          <el-col :span="8">
            <el-form-item label="客户" prop="customerId">
              <!-- <el-input style="display: none" v-model="dataForm.customerId" ></el-input> -->

              <el-select v-model="dataForm.customerId" filterable placeholder="请选择客户"
              
                remote automatic-dropdown default-first-option :loading="d_custSelect.loading"
                value-key="value" :remote-method="_selCustList" @change="item => _selectCust(item, 'customerId','customerName')" >
                <el-option
                  v-for="item in d_custSelect.dataList"
                  :key="item.value"
                  :label="item.key"
                  :value="item.value">
                </el-option>
              </el-select>
            
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售日期" prop="orderDate">
              <el-date-picker
                v-model="dataForm.orderDate"
                placeholder="销售日期"
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
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row inline>
          <el-col :span="8">
            <el-form-item label="发运方式" prop="shipType">
              <el-select v-model="dataForm.shipType" :loading="shipTypeSel.loading">
                <el-option
                v-for="item in shipTypeSel.dataList"
                :key="item.value"
                :label="item.key"
                :value="item.value">
              </el-option>
              </el-select>
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
      :data.sync="dataList"
      @edit-closed="setTotal"
      :toolbar="toolbar"
      :proxy-config="itableProxy"
      :columns="itableColumn"
      :select-config="{reserve: true}"
      :mouse-config="{selected: true}"
      :keyboard-config="{isArrow: true, isDel: true, isTab: true, isEdit: true}"
      :edit-config="{trigger: 'dblclick', mode: 'cell'}"
      :footer-method="footerMethod"
      show-footer
    ></vxe-grid>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isReadOnly?true:btnDisable" @click="dataFormSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import mixinViewModule from "@/mixins/view-module"
import publicJs from "@/mixins/view-public"
import XEUtils from 'xe-utils'
import { Promise } from 'q';
export default {
  mixins: [mixinViewModule,publicJs],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/so/salesorderline/list",
        getDataListIsPage: false,
        updateURL: "/so/salesorder/update",
        deleteIsBatch: true,
        prodURL: "/base/product/search",
        custURL: "/so/salesorder/cust"
      },

      visible: false,
      btnDisable: false,
      isReadOnly:false,
      dataList:[],
      dataForm: {
        id: null,
        orderType: "SO",
        customerId: null,
        orderDate: new Date(),
        planDeliveryDate: new Date(),
        orderAmount: "0",
        shipType: null,
        remark: "",
        deletedFlag: "N",
        receiveAddress: '',
        receiveName: '',
        receivePhone: ''
      },
      dataRule: {
        customerId: [
          { required: true, message: "客户不能为空,请在下拉选项中选择客户", trigger: "blur" }
        ],
        orderDate: [
          { required: true, message: "销售日期不能为空", trigger: "blur" }
        ]
      },

      itableColumn: [
        { type: "selection", width: 50, align: "center" },
        { type: "index", width: 50, align: "center" },
        {
          title: "物料名称",
          field: "productName",
          width: "200px",
          align: "center",
          editRender: {
            name: "ElAutocomplete",
            props: { fetchSuggestions: this.prodSeach, triggerOnFocus: false},
            events: { select: this.handleProcSelect }
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
          field: "amount",
          align: "left",
          formatter: ["toFixedString", 2]
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

      itableProxy: {
        index: true, // 启用动态序号代理
        sort: true, // 启用排序代理
        filter: true, // 启用筛选代理
        ajax: {
          query: ({ page, sort, filters }) => {
            return new Promise((resolve, reject) => {
              resolve()
            })
          },
          save: ({ body }) => {
            console.log(body);
          }
        },
        props: {
          list: "list",
          result: "list",
          total: "totalCount"
        }
      },
      toolbar: {
        id: "full_edit_1",
        buttons: [
          { code: "insert_actived", name: "新增" },
          { code: "remove_selection", name: "删除" }
        ],
        refresh: true,
        resizable: {
          storage: true
        },
        setting: {
          storage: true
        }
      },
      shipTypeSel: {
        remoteURL:'/common/dict/SHIP_TYPE',
        loading: false,
        dataList: [],
        timeout: null
      }
      
    };
  },
  methods: {
    prodSeach(queryString, cb) {
      var restaurants = this.restaurants;
      var results = [];

      if (queryString) {
        this.$axios
          .post(this.mixinViewModuleOptions.prodURL, { name: queryString ,lastPrice:1,customerId:this.dataForm.customerId})
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
    },
    handleProcSelect(t, item) {
      //                var row = this.$refs.sGrid.getCurrentRow();
      var row = t.row;
      if (item) {
        Object.assign(row, item);
        row.productId = item.id;
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
    setTotal({ column, row }) {
      if (column.property == "orderQty" || column.property == "price") {
        var qty = row.orderQty;
        var price = row.price;
        if (!Number.isNaN(qty) && !Number.isNaN(price)) {
          row.amount = Number(qty) * Number(price).toFixed(2);
        }
      }

    },
    shipType: function () {
      this.shipTypeSel.loading = true;
      this.$axios.post (
        this.shipTypeSel.remoteURL,
        {}
      ).then(res => {
        this.shipTypeSel.loading = false;
        if (res && res.length > 0) {
          for (var i = 0; i < res.length; i++) {
            this.shipTypeSel.dataList.push(res[i])
          }
        } else
          this.shipTypeSel.dataList = [];
      })
    },
    footerMethod ({ columns, data }) {
      
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 2) {
              return '汇总'
            }
            if (['amount'].includes(column.property)) {
              return XEUtils.sum(data, column.property)
            }
            return null
          })
        ]
      }

  }, 
  watch: {
  //   dataList: function () {
  //     this.$nextTick(() => {
  //       this.$refs.sGrid.updateFooter();
  //     })
  //   }
  },
  computed: {
    d11111: function () {
        //this.$refs.sGrid.updateFooter();
        console.log(33333333333333333333);
        return this.dataList;
      }
    
  },
  
  mounted () {
    console.log('-----11', this.d_custSelect)
    this.shipType();
  },
  created(){
    console.log('-----222', this.d_custSelect)
  }
};
</script>
