<template>
    <el-dialog :visible.sync="visible" :title="isNew ? $t('views.public.add') : $t('views.public.update')"
               :close-on-click-modal="false" :close-on-press-escape="false" width="55%">
        <el-form :model="dataForm" :rules="rules" ref="dataForm"
                 label-width="120px" :inline="true" labelSuffix="："
                 size="mini" class="tb-matthew">
            <el-form-item prop="id" v-show="false" />
            <el-form-item prop="custVendor" :label="data.form.input.custVendor">
                <el-radio-group v-model="dataForm.custVendor">
                    <el-radio label='CUST'>客户</el-radio>
                    <el-radio label='VENDOR'>供应商</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item prop="name" :label="data.form.input.name">
                <el-input v-model="dataForm.name" :placeholder="data.form.input.name"/>
            </el-form-item>
            <el-form-item prop="shortName" :label="data.form.input.shortName">
                <el-input v-model="dataForm.shortName" :placeholder="data.form.input.shortName"/>
            </el-form-item>
            <el-form-item prop="type" :label="data.form.input.type">
                <im-selector v-show="this.dataForm.custVendor==='CUST'"
                        placeholder="请选择客户类型"
                        v-model="dataForm.type"
                        :mapModel.sync="dataForm"
                        mapKeyVal="tName:type"
                        dataType="biz.custType" style="width: 200px">
                </im-selector>
                <im-selector  v-show="this.dataForm.custVendor==='VENDOR'"
                        placeholder="请选择供应商类型"
                        v-model="dataForm.type"
                        :mapModel.sync="dataForm"
                        mapKeyVal="tName:type"
                        dataType="biz.vendorType" style="width: 200px">
                </im-selector>
            </el-form-item>
            <el-form-item prop="tel" :label="data.form.input.tel">
                <el-input v-model="dataForm.tel" :placeholder="data.form.input.tel"/>
            </el-form-item>
            <el-form-item prop="fax" :label="data.form.input.fax">
                <el-input v-model="dataForm.fax" :placeholder="data.form.input.fax"/>
            </el-form-item>
            <el-form-item prop="email" :label="data.form.input.email">
                <el-input v-model="dataForm.email" :placeholder="data.form.input.email"/>
            </el-form-item>
            <el-form-item prop="mm" :label="data.form.input.mm">
                <el-input v-model="dataForm.mm" :placeholder="data.form.input.mm"/>
            </el-form-item>
            <el-form-item prop="companyAddress" :label="data.form.input.companyAddress">
                <el-input v-model="dataForm.companyAddress" :placeholder="data.form.input.companyAddress"/>
            </el-form-item>
            <el-form-item prop="legalMan" :label="data.form.input.legalMan">
                <el-input v-model="dataForm.legalMan" :placeholder="data.form.input.legalMan"/>
            </el-form-item>
            <el-form-item prop="webSite" :label="data.form.input.webSite">
                <el-input v-model="dataForm.webSite" :placeholder="data.form.input.webSite"/>
            </el-form-item>
            <el-form-item prop="bank" :label="data.form.input.bank">
                <el-input v-model="dataForm.bank" :placeholder="data.form.input.bank"/>
            </el-form-item>
            <el-form-item prop="bankAccount" :label="data.form.input.bankAccount">
                <el-input v-model="dataForm.bankAccount" :placeholder="data.form.input.bankAccount"/>
            </el-form-item>
            <el-form-item prop="taxNum" :label="data.form.input.taxNum">
                <el-input v-model="dataForm.taxNum" :placeholder="data.form.input.taxNum"/>
            </el-form-item>
            <el-form-item prop="pinyinCode" :label="data.form.input.pinyinCode">
                <el-input v-model="dataForm.pinyinCode" :placeholder="data.form.input.pinyinCode"/>
            </el-form-item>
            <el-form-item prop="wbCode" :label="data.form.input.wbCode">
                <el-input v-model="dataForm.wbCode" :placeholder="data.form.input.wbCode"/>
            </el-form-item>
            <el-form-item prop="pic" :label="data.form.input.pic">
                <el-input v-model="dataForm.pic" :placeholder="data.form.input.pic"/>
            </el-form-item>
            <el-form-item prop="remark" :label="data.form.input.remark">
                <el-input v-model="dataForm.remark" :placeholder="data.form.input.remark"/>
            </el-form-item>
        </el-form>
        <template slot="footer">
            <el-button @click="visible = false">{{ $t('views.public.cancel') }}</el-button>
            <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('views.public.confirm') }}</el-button>
        </template>
    </el-dialog>
</template>

<script>
import data from './data'
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  data () {
    let checkEmail = (rule, value, callback) => {
      if (value) {
        let pattern = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        pattern.test(value) ? callback() : callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    }
    let checkTel = (rule, value, callback) => {
      if (value) {
        let pattern = /\d{3}-\d{8}|\d{4}-\d{7}/
        pattern.test(value) ? callback() : callback(new Error('电话格式不正确'))
      } else {
        callback()
      }
    }
    let checkFax = (rule, value, callback) => {
      if (value) {
        let pattern = /^(\d{3,4}-)?\d{7,8}$/
        pattern.test(value) ? callback() : callback(new Error('传真号码格式不正确'))
      } else {
        callback()
      }
    }
    let checkMM = (rule, value, callback) => {
      if (value) {
        let pattern = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/
        pattern.test(value) ? callback() : callback(new Error('微信号码格式不正确'))
      } else {
        callback()
      }
    }
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/base/cust/list',
        updateURL: '/base/cust/save',
        getDataListIsPage: false,
        activatedIsNeed: false
      },
      data: data,
      visible: false,
      dataForm: {
        id: undefined,
        custVendor: 'CUST',
        code: undefined,
        name: undefined,
        shortName: undefined,
        type: undefined,
        tel: undefined,
        fax: undefined,
        email: undefined,
        mm: undefined,
        companyAddress: undefined,
        legalMan: undefined,
        webSite: undefined,
        bank: undefined,
        bankAccount: undefined,
        taxNum: undefined,
        pinyinCode: undefined,
        wbCode: undefined,
        pic: undefined,
        remark: undefined,
        companyId: undefined
      },
      rules: {
        name: [{
          required: true, message: '名称不可缺少'
        }],
        tel: [{
          validator: checkTel, trigger: 'blur'
        }],
        fax: [{
          validator: checkFax, trigger: 'blur'
        }],
        email: [{
          validator: checkEmail, trigger: 'blur'
        }],
        mm: [{
          validator: checkMM, trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    // 表单提交
    dataFormSubmitHandle () {
      let th = this
      this.$refs['dataForm'].validate(valid => {
        if (!valid) {
          return false
        }
        th.$axios({
          url: '/base/cust/save',
          method: 'post',
          data: th.dataForm
        }).then(res => {
          this.$message({
            message: this.$t('views.public.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        }).catch(() => {
        })
      })
    }
  }
}
</script>

<style lang="scss">
  .tb-matthew{
    div.el-radio-group {
        width: 200px
    }
    input.el-input__inner{
        width: 200px;
    }
  }
</style>
