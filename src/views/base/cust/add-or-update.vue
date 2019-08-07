<template>
    <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('views.public.add') : $t('views.public.update')"
               :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="dataForm" :rules="rules" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"
                 label-width="120px">
            <el-form-item prop="custVendor" :label="data.form.input.custVendor">
                <el-input v-model="dataForm.custVendor" :placeholder="data.form.input.custVendor"/>
            </el-form-item>
            <el-form-item prop="code" :label="data.form.input.code">
                <el-input v-model="dataForm.code" :placeholder="data.form.input.code"/>
            </el-form-item>
            <el-form-item prop="name" :label="data.form.input.name">
                <el-input v-model="dataForm.name" :placeholder="data.form.input.name"/>
            </el-form-item>
            <el-form-item prop="shortName" :label="data.form.input.shortName">
                <el-input v-model="dataForm.shortName" :placeholder="data.form.input.shortName"/>
            </el-form-item>
            <el-form-item prop="type" :label="data.form.input.type">
                <el-input v-model="dataForm.type" :placeholder="data.form.input.type"/>
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
            <el-form-item prop="companyId" :label="data.form.input.companyId">
                <el-input v-model="dataForm.companyId" :placeholder="data.form.input.companyId"/>
            </el-form-item>
        </el-form>
        <template slot="footer">
            <el-button @click="visible = false">{{ $t('views.public.cancel') }}</el-button>
            <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('views.public.confirm') }}</el-button>
        </template>
    </el-dialog>
</template>

<script>
import { debounce } from 'lodash'
import data from './data'
import { save } from '@/api/base/base'

export default {
  data () {
    return {
      data: data,
      visible: false,
      dataForm: {
        id: undefined,
        custVendor: undefined,
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
        code: [{
          required: true, message: '编码不可缺少'
        }]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        if (this.dataForm.id) {
          save(...this.dataForm, '/base/cust/save').then(res => {
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
        }
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>

<style lang="scss">
    .mod-sys__user {
        .dept-list {
            .el-input__inner,
            .el-input__suffix {
                cursor: pointer;
            }
        }

        .role-list {
            .el-select {
                width: 100%;
            }
        }
    }
</style>
