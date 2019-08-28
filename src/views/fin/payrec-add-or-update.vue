<template>
  <el-dialog
    :title="isNew ? '应收应付单新增' : '应收应付单修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    v-loading.fullscreen.lock="fullscreenLoading"
    width="50%"
  >
    <div>
    <dynamic-form
      v-model="dataForm"
      :formprops="formprops"
      ref="dataForm"
      col-span='*,*,3'
      :alldescriptors="descriptors">
      <template slot="typeName">
        <label>应收款</label>
      </template>
      <template slot="sourceOrder">
        <label>{{dataForm.sourceOrderNum}}</label>
      </template>
    </dynamic-form>
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
        updateURL: '/fin/payrec/update'
      },
      visible: false,
      btnDisable: false,
      dataForm: {
        type:'PAYABLE',
        sourceOrderType:null,
        sourceOrderId:null,
        sourceOrderNum:null,
        custId:null,
        amount:null,
        orderDate:null,
        pic:null,
        status:null,
        remark:null
      },
      descriptors: {
        typeName: {
          type: 'slot',
          label: '类型',
          name: 'typeName'
        },
        status: {
          type: 'enum', 
          label: '付款状态',
          enum: ['PAID', 'UNPAID'],
          options: [
            { label: '已付款', value: 'PAID' },
            { label: '未付款', value: 'UNPAID' }
          ]
        },
        separate1:this.$g.separate,
        sourceOrderType: {
          type: 'cust', 
          label: '业务类型',
          placeholder: '请选择业务类型',
          name: 'im-selector',
          props: {
            mapKeyVal: "sourceOrderType",
            dataType: "code.tran_type",
            clearable: true
          }
        },
        sourceOrder: {
          type: 'slot',
          name: 'sourceOrder',
          label: '来源订单号'
        },
        separate2:this.$g.separate,
        custId: {
          type: 'string',
          label: '往来单位'
        },
        amount: {
          type: 'number',
          label: '金额'
        },
        separate3:this.$g.separate,
        pic: {
          type: 'string',
          label: '经办人'
        },
        remark: {
          type: 'string',
          label: '备注'
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
