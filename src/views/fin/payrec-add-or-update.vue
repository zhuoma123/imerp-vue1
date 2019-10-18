<template>
  <el-dialog
    title="应收应付单收款"
    :close-on-click-modal="false"
    :visible.sync="visible"
    v-loading.fullscreen.lock="fullscreenLoading"
    width="80%"
  >
    <div>

      <el-container>
        <el-aside width="650px">
          <vxe-grid
            border
            resizable
            size="mini"
            highlight-current-row
            class="vxe-table-element"
            ref="sGrid"
            :data="tableData"
            :columns="itableColumn"
            :select-config="{reserve: true}"
            :mouse-config="{selected: true}"
            :footer-cell-class-name="footerCellClassName"
            :footer-method="footerMethod"
            show-footer

            
          >
          </vxe-grid>

        </el-aside>
        <el-container>
          
          <el-main style="padding:0px">
            <dynamic-form
              v-model="dataForm"
              :formprops="formprops"
              ref="dataForm"
              col-span='*'
              :alldescriptors="descriptors">
              <template slot="sourceOrder">
                <label>{{dataForm.sourceOrderNum}}</label>
              </template>
            </dynamic-form>
            
          </el-main>


        </el-container>
      </el-container>


    
    </div>
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
        updateURL: '/fin/realpayrec/save'
      },
      visible: false,
      btnDisable: false,
      dataForm: {
        custId:null,
        custName:null,
        amount:null,
        pic:null,
        gatheringTypeName:null,
        gatheringType:null,
        remark:null,
        payDate:new Date()
      },
      descriptors: {
        custName: {
          type: 'string',
          disabled: 'disabled',
          label: '往来单位'
        },
        amount: {
          type: 'number',
          disabled: 'disabled',
          label: '收/付款金额'
        },
        gatheringTypeName: {
          type: 'cust',
          label: '收/付款账号',
          name: 'im-selector',
          props: {
            mapKeyVal: 'gatheringTypeName:gatheringType',
            dataType: 'biz.gatheringType',
            clearable: true
          }
        },
        pic: {
          type: 'cust',
          label: '经办人',
          name: 'im-selector',
          props: {
            mapKeyVal: 'pic',
            dataType: 'biz.employee',
            clearable: true
          }

        },

        
        payDate: {
          name: 'el-date-picker',
          type: 'cust',
          label: '收/付款日期',
          props: {
            valueFormat: 'yyyy-MM-dd'
          }

        },
        remark: {
          type: 'string',
          label: '备注'
        }
      },
      //表单数据
      tableData:[],
      //提交的时候获取表单中所有数据行
      subTableAll: true,
      itableColumn: [
        { type: 'index', width: 50, align: 'center' },
        {
          title: '业务类型',
          field: 'sourceOrderTypeMean',
          align: 'center',
          footerRender: function (column, data) {
            return "汇总"
          }
        },
        {
          title: '来源订单号',
          field: 'sourceOrderNum',
          align: 'center'
        },
        
        {
          title: '金额',
          field: 'amount',
          align: 'center',
          formatter: ['toFixedString', 2],
          footerRender: function (column, data) {
            return XEUtils.sum(data, column.property)
          }
        },
        {
          title: '已收/付金额',
          field: 'yamount',
          align: 'center',
          formatter: ['toFixedString', 2],
          footerRender: function (column, data) {
            return XEUtils.sum(data, column.property)
          }
        },
        {
          title: '本次收/付金额',
          field: 'pamount',
          align: 'center',
          formatter: ['toFixedString', 2],
          footerRender: function (column, data) {
            return XEUtils.sum(data, column.property)
          }
        }
        
      ],
      validRules: {
        pamount: [
          { required: true, message: '本次收/付金额必填' },
          { type:"number",message: '请输入数字'}
        ]
      }

    }
  },
  methods: {
    init(payList,obj){
      this.tableData = payList;
      this.entityModel = Object.assign({}, obj);
      console.log(this.entityModel);
      this.visible = true
    }
  },
  created () {

  },
  mounted () {
  }
};
</script>
