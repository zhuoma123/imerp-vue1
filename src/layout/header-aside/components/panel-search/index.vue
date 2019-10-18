<template>
  <div class="panel-search" flex="dir:top">
    <div
      class="panel-search__input-group"
      flex-box="0"
      flex="dir:top main:center cross:center"
      @click.self="handlePanelClick"
    >
      <el-form
        :model="dataForm"
        labelSuffix="："
        size=""
        :rules="dataRule"
        ref="dataForm"
        width = "100%"
      >
        <el-row>
          <el-col :span="8">
            <im-selector
                v-model="dataForm.customerId"
                :mapModel.sync="dataForm"
                mapKeyVal="customerName:customerId"
                data-type="biz.customer"
                placeholder="请选择客户"
              ></im-selector>
          </el-col>
          <el-col :span="8">
              <im-selector
                v-model="dataForm.shipType"
                :mapModel.sync="dataForm"
                mapKeyVal="shipType"
                data-type="dict.SHIP_TYPE"
                placeholder="请选择发运方式"
              ></im-selector>
          </el-col>
        
        <el-col :span="8">
              <el-checkbox v-model="dataForm.autoPeaking">仓库是否自动拣货</el-checkbox>
          </el-col>
      </el-row>


      <div style="margin: 15px 0px 15px 0px;">
        <el-input ref="searchInput" placeholder="请输入物料编号/名称/车型/品牌等等信息进行搜索" 
          v-model="dataForm.name" class="input-with-select" @focus="clearCurrentRow()" @keyup.enter.native="searchEnterFun" @keyup.tab.native="searchEnterFun">
          
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </div>

      </el-form>
      
      
          
    </div>
 
    <SplitPane :min-percent="20" :default-percent="70" split="vertical">
      <template slot="paneL" style="width:70%">
        <vxe-grid
          border
          resizable
          height="400px"
          size="mini"
          highlight-current-row
          class="vxe-table-element"
          remote-filter
          ref="pGrid"
          :loading="dataListLoading"
          :proxy-config="tableProxy"
          :keyboard-config="{isArrow: true, isEnter:true ,isSearch :true}"
          :columns="itableColumn"
          :enter-method="addItem"
          :okey-focus="focusSearch"
          @cell-dblclick="addItem"
        >
          <template v-slot:buttons></template>
        </vxe-grid>
      </template>
      <template slot="paneR" style="width:30%">
        <vxe-grid
          border
          resizable
          size="mini"
          height="400px"
          highlight-current-row
          class="vxe-table-element"
          remote-filter
          ref="sGrid2"
          :proxy-config="tableProxy"
          :edit-rules="validRules"
          :columns="itableColumn2"
          :select-config="{reserve: true}"
          :mouse-config="{selected: true}"
          :keyboard-config="{isDel: true,isDelRow: true, isTab: true, isEdit: true}"
          :edit-config="{trigger: 'dblclick', mode: 'cell'}"
          :footer-cell-class-name="footerCellClassName"
          :footer-method="footerMethod"
          show-footer
        ></vxe-grid>
      </template>
    </SplitPane>

    <span slot="footer" class="dialog-footer" style="text-align:center">      
      <el-button type="info" icon="el-icon-question" @click="centerDialogVisible = true" circle></el-button>
      <el-button type="primary" :disabled="btnDisable" @click="dataFormSubmit(null)">保 存</el-button>
      <el-button type="success" :disabled="btnDisable" @click="dataFormSubmit(1)">保存并提交</el-button>
      <span >订单金额:{{dataForm.orderAmount}}</span>
    </span>
 

  <el-dialog title="添加至购物车" :visible.sync="dialogFormVisible" width="35%" >
  <el-form :model="mtlAddForm"
        labelSuffix="："
        size="mini"
        :rules="dataRule2"
        ref="dataForm2"
        label-width="100px" @keyup.enter.native="addItemToGrid()" >
      <el-form-item label="物料信息" >
        <span >{{mtlAddForm.productName+" "+mtlAddForm.productCode}}</span>
      </el-form-item>
      <el-form-item label="当前库存" >
        <el-input v-model="mtlAddForm.stock" disabled></el-input>
      </el-form-item>
    <el-form-item label="数量" >
      <el-input ref="dlgQtyInput" v-model="mtlAddForm.orderQty" ></el-input>
    </el-form-item>
    <el-form-item label="销售价" >
      <el-input v-model="mtlAddForm.price" ></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="addItemToGrid">确 定</el-button>
  </div>
</el-dialog>

<el-dialog
  title="下单帮助文档"
  :visible.sync="centerDialogVisible"
  width="40%"
  center>
  <span>1.物料搜索框中可以输入配件的编号/名称/品牌/车型/产地/条码/图号/特征属性/描述等信息进行模糊查询.<span style="color:red">多个条件用空格隔开</span>. 例如 柴机油 英壳 4L。按回车<span style="color:red">Enter</span>键执行搜索，搜索结果在左下列表显示。</span><br>
  <span>2.搜索出自己想要的结果之后，按<span style="color:red">Tab键</span>将光标跳转到列表页面，列表页面可以按↑↓键进行定位数据,找到需要下单的物料之后按回车Enter(或者鼠标双击)弹出确认框输入数量和单价之后按Enter进行添加.</span><br>
  <span>3.如果左边搜索结果中没找到想要的物料,按除功能键之外的任意键光标将跳回搜索框进行再次搜索.</span><br>
  <span>4.右下表格是购物车列表,在购物车列表可以直接修改数量和单价,如想删除某一行,则光标选择那行之后按Delete键进行删除.</span><br>

  <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
  </span>
</el-dialog>


 </div>
</template>




<script>
import Fuse from "fuse.js";
import { mapState, mapGetters, mapActions } from "vuex";
import mixin from "../mixin/menu";

import mixinViewModule from "@/mixins/view-module";
import XEUtils from "xe-utils";
import { nextTick } from 'q';

export default {
  mixins: [mixin, mixinViewModule],

  data() {
    return {
      searchText: "",
      results: [],
      mixinViewModuleOptions: {
        getDataListURL: "/base/product/search",
        getDataListIsPage: false,
        updateURL: "/so/salesorder/update",
        deleteIsBatch: true,
        prodURL: "/base/product/search"
      },
      dialogFormVisible: false,
      centerDialogVisible: false,
      visible: false,
      btnDisable: false,
      isNew: true,
      subTableAll:true,
      dataForm: {
        id: undefined,
        orderNum: "",
        orderType: "SO",
        customerId: "",
        orderDate: new Date(),
        planDeliveryDate: new Date(),
        orderAmount: "0",
        shipType: "",
        remark: "",
        autoPeaking: true,
        deletedFlag: "N",
        name: "",
        lastPrice: true
      },
      mtlAddForm: {
        productId: undefined,
        productName: "",
        orderQty: 1,
        price: 0,
        productCode: "",
        stock : 0,
        amount : 0
      },
      dataRule: {
        customerId: [
          { required: true, message: "客户不能为空", trigger: "blur" }
        ],
        orderDate: [
          { required: true, message: "销售日期不能为空", trigger: "blur" }
        ]
      },
      
      dataRule2: {
        orderQty: [
          { required: true, message: "下单数量不能为空", trigger: "blur" }
        ],
        price: [
          { required: true, message: "销售价格不能为空", trigger: "blur" }
        ]
      },
      tableProxy: {
        autoLoad: false
      },
      validRules: {
        productName: [{ required: true, message: "物料必填" }],
        productCode: [{ required: true, message: "物料必填" }],
        orderQty: [
          { required: true, message: "销售数量必填" },
          { type: "number", message: "请输入数字" }
        ],
        price: [
          { required: true, message: "销售价格必填" },
          { type: "number", message: "请输入数字" }
        ]
      },
      itableColumn: [
        { type: "index", width: 30, align: "center" },
        {
          title: "物料名称",
          field: "name",
          width: "150px",
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
          title: "物料编码",
          field: "code",
          width: "110px",
          align: "left"
        },
        {
          title: "库存",
          field: "stock",
          width: "40px",
          align: "left"
        },
        {
          title: "指导售价",
          field: "salePrice",
          width: "60px",
          align: "left"
        },
        {
          title: "上次价",
          field: "lastPrice",
          width: "60px",
          align: "left"
        },

        {
          title: "单位",
          field: "unit",
          width: "40px"
        },
        {
          title: "条码",
          field: "barCode",
          width: "110px",
          align: "left"
        },
        {
          title: "品牌",
          field: "brand",
          width: "80px",
          align: "left"
        },
        {
          title: "车型",
          field: "vehicle",
          width: "80px",
          align: "left"
        },
        {
          title: "产地",
          field: "madein",
          width: "80px",
          align: "left"
        },
        {
          title: "规格属性",
          field: "specialParam",
          width: "250px",
          align: "left"
        },
        {
          title: "描述",
          field: "description",
          width: "250px",
          align: "left"
        }
      ],
      itableColumn2: [
        { type: "index", width: 30, align: "center" },
        {
          title: "物料名称",
          field: "productName",
          width: "120px",
          align: "center",
          footerRender: function(column, data) {
            return "汇总";
          }
        },

        {
          title: "数量",
          field: "orderQty",
          align: "left",
          width: "60px",
          editRender: { name: "input", autoselect: true }
        },
        {
          title: "销售价",
          field: "price",
          align: "center",
          width: "70px",
          editRender: { name: "input", autoselect: true }
        },
        {
          title: "总金额",
          field: "amount",
          align: "left",
          width: "70px",
          formatter: ["toFixedString", 2],
          needReturnAmount : true,
          editPost: function(column, row) {
            var qty = row.orderQty;
            var price = row.price;
            if (!Number.isNaN(qty) && !Number.isNaN(price)) {
              return Number(qty) * Number(price).toFixed(2);
            }
          },
          footerRender: function(column, data) {
            return XEUtils.sum(data, column.property);
          }
        },
        {
          title: "物料编码",
          field: "productCode",
          width: "110px",
          align: "left"
        }
      ]
    };
  },
  computed: {
    ...mapGetters("d2admin", {
      themeActiveSetting: "theme/activeSetting"
    }),
    ...mapState("d2admin/search", ["hotkey", "pool"]),
    
  },
  mounted (){
    this.focus(this.$refs.searchInput);
  },
  methods: {
    setAmount(value){
      this.dataForm.orderAmount = value;
    },
    
    /**
     * @description 聚焦输入框
     */
    focus(obj) {
      setTimeout(() => {
        if (obj) {
          obj.focus();
        }
      }, 500);
    },
    focusSearch(obj) {
      if(document.activeElement.nodeName != "INPUT"){
        this.clearCurrentRow();
        this.$refs.searchInput.focus();
      }
    },
    clearCurrentRow() {
      this.pGrid.clearCurrentRow();
    },
    /**
     * @description 接收用户在下拉菜单中选中事件
     */
    handleSelect({ path }) {
      // 如果用户选择的就是当前页面 就直接关闭搜索面板
      if (path === this.$route.path) {
        this.handleEsc();
        return;
      }
      // 用户选择的是其它页面
      this.$nextTick(() => {
        this.handleMenuSelect(path);
      });
    },
    /**
     * @augments 接收用户点击空白区域的关闭
     */
    handlePanelClick() {
      //this.handleEsc();
    },
    /**
     * @augments 接收用户触发的关闭
     */
    handleEsc() {
      if(this.dialogFormVisible || this.centerDialogVisible){
        return;
      }
      this.closeSuggestion();
      
      this.$nextTick(() => {
        this.$emit("close");
      });
    },
    searchEnterFun(e){
      var keyCode = window.event? e.keyCode:e.which;
        // console.log('回车搜索',keyCode,e);
        
      if(keyCode == 13){
        var item = this.pGrid.getCurrentRow();
        if(item) {
          return;
        }else{
          this.search();
        }
      }else if(keyCode == 9){//tab
        this.pGrid.setCurrentRow(this.pGrid.getTableData().fullData[0]);
        this.$refs.searchInput.blur();
      }
    },
    addItem(){
      console.log(11111111);
      if(document.activeElement.nodeName == "INPUT"){
        return;
      }
      var item = this.pGrid.getCurrentRow();
      if(typeof item === 'undefined' || item === null) {
        return;
      }

      //判断是否重复添加
      let allDate = this.$refs.sGrid2.getTableData()
      if (allDate.fullData && allDate.fullData.length > 0) {
        for (let i = 0; i < allDate.fullData.length; i++) {
          if(allDate.fullData[i].productId == item.id){
            this.$message({
              message: '物料无法重复添加!',
              type: 'error',
              duration: 2000,
              onClose: () => {
                
              }
            });
            return;
          }
        }
      }


      this.mtlAddForm.productId=item.id;
      this.mtlAddForm.productName = item.name;
      this.mtlAddForm.productCode = item.code;
      this.mtlAddForm.price = item.lastPrice?item.lastPrice:item.salePrice;
      this.mtlAddForm.stock = item.stock;
      this.mtlAddForm.amount = Number(1) * Number(this.mtlAddForm.price).toFixed(2)

      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.focus(this.$refs.dlgQtyInput);
      })
      //Object.assign(mtlAddForm, this.sGrid.getCurrentRow());
    },
    addItemToGrid(){
      this.dialogFormVisible = false;
      this.$refs.sGrid2.insertAt(this.mtlAddForm, -1);
      this.$refs.sGrid2.updateFooter();
        //.then(({ row }) => this.$refs.sGrid2.setActiveCell(row, 'price'));
      this.clearCurrentRow();
      this.focus(this.$refs.searchInput);
    },
    dataFormSubmit (isSubmit) {
        this.dataForm.isSubmit=isSubmit;
      Promise.all([
        this.checkForm(),
        this.checkGrid(this.$refs.sGrid2)
      ]).then(() => {
        this.$confirm('确定要保存吗！', '操作提示', {
          confirmButtonText: this.$t('views.public.confirm'),
          cancelButtonText: this.$t('views.public.cancel'),
          type: 'info'
        }).then(() => {
          this.doSubmit()
        }).catch(() => {})
      }).catch(err => {})
    },

    doSubmit () {
      
      this.btnDisable = true
      if (this.$refs.sGrid2) {
        this.dataForm.lineList = this.getItemListDate(this.$refs.sGrid2)
      }
      
      this.dataForm.__state = 'NEW'
      
      this.fullscreenLoading = true
      this.$axios
        .post(this.mixinViewModuleOptions.updateURL, this.dataForm)
        .then(() => {
          this.fullscreenLoading = false
          this.visible = false
          this.$emit('refreshDataList')
          this.$message({
            message: '订单创建成功',
            type: 'success',
            duration: 2000,
            onClose: () => {
              this.btnDisable = false
            }
          })
          //清空数据
          this.$refs['dataForm'].resetFields();
          this.dataForm.customerId = null;
          this.dataForm.name = null;
          this.dataForm.shipType = null;
          this.pGrid.loadData(null);
          this.$refs.sGrid2.loadData(null);
        }).catch(() => {
          this.btnDisable = false
          this.fullscreenLoading = false
        })
    }
  }
};
</script>

<style lang="scss" scoped>
.panel-search {
  margin: 20px;
  width: 100%;
  .panel-search__input-group {
    .panel-search__logo {
      width: 80px;
      height: 80px;
      margin-bottom: 20px;
    }
    .panel-search__input {
      width: 500px;
    }
    .panel-search__tip {
      @extend %unable-select;
      margin-top: 20px;
      margin-bottom: 40px;
      font-size: 12px;
      color: $color-text-sub;
    }
  }
  .panel-search__results-group {
    overflow: auto;
    margin-bottom: -20px;
    .panel-search__results-group-inner {
      margin: -20px;
    }
  }
}
</style>
