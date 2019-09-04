<template>
    <div>
        <el-dialog :visible.sync="visible" :title="isNew ? '新增' : '修改'"
                   :close-on-click-modal="false" :close-on-press-escape="false" width="55%">
            <el-form :model="dataForm" :rules="rules" ref="dataForm"
                     label-width="110px" :inline="true" labelSuffix="："
                     size="mini" class="ddl-matthew">
                <!--dataForm must be showed all-->
                <el-form-item prop="id" v-show="false" />
                <el-form-item prop="name" :label="data.form.invoice.name" class="ddl-matthew-child">
                    <el-input v-model="dataForm.name" :placeholder="data.form.invoice.name"/>
                </el-form-item>
                <el-form-item prop="ivDate" :label="data.form.invoice.ivDate" class="ddl-matthew-child">
                    <el-date-picker
                            v-model="data.ivDate"
                            type="date"
                            :placeholder="data.form.invoice.ivDate" style="width: 178px">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="amount" :label="data.form.invoice.amount" class="ddl-matthew-child">
                    <el-input v-model.number="dataForm.amount" :placeholder="data.form.invoice.amount"/>
                </el-form-item>
                <el-form-item prop="ivType" :label="data.form.invoice.ivType" class="ddl-matthew-child">
                    <el-input v-model="dataForm.ivType" :placeholder="data.form.invoice.ivType"/>
                </el-form-item>
                <el-form-item prop="summary" :label="data.form.invoice.summary" class="ddl-matthew-child">
                    <el-input v-model="dataForm.summary" :placeholder="data.form.invoice.summary"/>
                </el-form-item>
                <el-form-item prop="customerName" :label="data.form.invoice.customerName" class="ddl-matthew-child">
                    <im-selector
                            placeholder="请选择单位"
                            v-model="dataForm.customerName"
                            :mapModel.sync="dataForm"
                            mapKeyVal="customerName:customerId"
                            dataType="biz.customersearch"
                            style="width: 178px"
                            @change="changeCust">
                    </im-selector>
                </el-form-item>
                <el-form-item prop="taxNum" :label="data.form.invoice.taxNum" class="ddl-matthew-child">
                    <el-input v-model="dataForm.taxNum" :placeholder="data.form.invoice.taxNum"/>
                </el-form-item>
                <el-form-item prop="cpAddress" :label="data.form.invoice.cpAddress" class="ddl-matthew-child">
                    <el-input v-model="dataForm.cpAddress" :placeholder="data.form.invoice.cpAddress"/>
                </el-form-item>
                <el-form-item prop="cpPhone" :label="data.form.invoice.cpPhone" class="ddl-matthew-child">
                    <el-input v-model="dataForm.cpPhone" :placeholder="data.form.invoice.cpPhone"/>
                </el-form-item>
                <el-form-item prop="cpBank" :label="data.form.invoice.cpBank" class="ddl-matthew-child">
                    <el-input v-model="dataForm.cpBank" :placeholder="data.form.invoice.cpBank"/>
                </el-form-item>
                <el-form-item prop="cpBankNum" :label="data.form.invoice.cpBankNum" class="ddl-matthew-child">
                    <el-input v-model="dataForm.cpBankNum" :placeholder="data.form.invoice.cpBankNum"/>
                </el-form-item>
                <el-form-item prop="status" :label="data.form.invoice.status" class="ddl-matthew-child">
                    <el-radio-group v-model="dataForm.status" style="width: 178px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="remark" :label="data.form.invoice.remark" class="ddl-matthew-child">
                    <el-input v-model="dataForm.remark" :placeholder="data.form.invoice.remark"/>
                </el-form-item>
            </el-form>
            <template slot="footer">
                <el-button @click="visible = false">{{ $t('views.public.cancel') }}</el-button>
                <el-button type="primary" @click="dataFormSubmit">{{ $t('views.public.confirm') }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import data from '../data'
import mixinViewModule from '@/mixins/view-module'

export default {
  mixins: [mixinViewModule],
  data () {
    let checkMobile = (rule, value, callback) => {
      if (value) {
        let pattern = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d)|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d))$)/
        if (pattern.test(value)) {
          callback()
        } else {
          callback(new Error('输入的电话号码不符合格式'))
        }
      } else {
        callback()
      }
    }
    return {
      custVisible: false,
      mixinViewModuleOptions: {
        getDataListURL: '/fin/invoice/list',
        updateURL: '/fin/invoice/save',
        getDataListIsPage: false,
        activatedIsNeed: false
      },
      data: data,
      visible: false,
      dataForm: {
        code: undefined,
        name: undefined,
        customerName: undefined,
        customerId: undefined,
        ivDate: undefined,
        amount: undefined,
        summary: undefined,
        ivType: undefined,
        cpName: undefined,
        taxNum: undefined,
        cpAddress: undefined,
        cpPhone: undefined,
        cpBank: undefined,
        cpBankNum: undefined,
        status: 1,
        remark: undefined
      },
      rules: {
        name: [
          { required: true, message: '名称不可缺少' }
        ],
        cpPhone: [{
          validator: checkMobile, trigger: 'blur'
        }],
        amount: [{
          type: 'number', message: '票据金额必须为数字类型', trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    changeCust (data) {
      if (data) {
        this.dataForm.customerId = data.ID
        this.dataForm.taxNum = data.TAX_NUM
        this.dataForm.cpAddress = data.COMPANY_ADDRESS
        this.dataForm.cpPhone = data.TEL
        this.dataForm.cpBankNum = data.BANK_ACCOUNT
        this.dataForm.cpBank = data.BANK
      }
    }
  },
  watch: {
    visible: function (newName, oldName) {
      if (newName) {
        let date = new Date()
        this.dataForm.ivDate = date
      }
    }
  }
}
</script>

<style>
    input.el-input__inner{
            margin-bottom: 5px;
        }

</style>
