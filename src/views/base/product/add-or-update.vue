<template>
    <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('views.public.add') : $t('views.public.update')"
               :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="dataForm" :rules="rules" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"
                 label-width="120px">
            <el-form-item prop="code" :label="data.form.input.code">
                <el-input v-model="dataForm.code" :placeholder="data.form.input.code"/>
            </el-form-item>
            <el-form-item prop="name" :label="data.form.input.name">
                <el-input v-model="dataForm.name" :placeholder="data.form.input.name"/>
            </el-form-item>
            <el-form-item prop="alisaName" :label="data.form.input.alisaName">
                <el-input v-model="dataForm.alisaName" :placeholder="data.form.input.alisaName"/>
            </el-form-item>
            <el-form-item prop="categoryId" :label="data.form.input.categoryId">
                <el-input v-model="dataForm.categoryId" :placeholder="data.form.input.categoryId"/>
            </el-form-item>
            <el-form-item prop="vehicleId" :label="data.form.input.vehicleId">
                <el-input v-model="dataForm.vehicleId" :placeholder="data.form.input.vehicleId"/>
            </el-form-item>
            <el-form-item prop="brandId" :label="data.form.input.brandId">
                <el-input v-model="dataForm.brandId" :placeholder="data.form.input.brandId"/>
            </el-form-item>
            <el-form-item prop="madeinId" :label="data.form.input.madeinId">
                <el-input v-model="dataForm.madeinId" :placeholder="data.form.input.madeinId"/>
            </el-form-item>
            <el-form-item prop="barCode" :label="data.form.input.barCode">
                <el-input v-model="dataForm.barCode" :placeholder="data.form.input.barCode"/>
            </el-form-item>
            <el-form-item prop="picCode" :label="data.form.input.picCode">
                <el-input v-model="dataForm.picCode" :placeholder="data.form.input.picCode"/>
            </el-form-item>
            <el-form-item prop="specialParam" :label="data.form.input.specialParam">
                <el-input v-model="dataForm.specialParam" :placeholder="data.form.input.specialParam"/>
            </el-form-item>
            <el-form-item prop="desc" :label="data.form.input.desc">
                <el-input v-model="dataForm.desc" :placeholder="data.form.input.desc"/>
            </el-form-item>
            <el-form-item prop="unit" :label="data.form.input.unit">
                <el-input v-model="dataForm.unit" :placeholder="data.form.input.unit"/>
            </el-form-item>
            <el-form-item prop="volume" :label="data.form.input.volume">
                <el-input v-model="dataForm.volume" :placeholder="data.form.input.volume"/>
            </el-form-item>
            <el-form-item prop="defaultVendorId" :label="data.form.input.weight">
                <el-input v-model="dataForm.defaultVendorId" :placeholder="data.form.input.defaultVendorId"/>
            </el-form-item>
            <el-form-item prop="defaultVendorId" :label="data.form.input.defaultVendorId">
                <el-input v-model="dataForm.defaultVendorId" :placeholder="data.form.input.defaultVendorId"/>
            </el-form-item>
            <el-form-item prop="pinyinCode" :label="data.form.input.status">
                <el-input v-model="dataForm.pinyinCode" :placeholder="data.form.input.pinyinCode"/>
            </el-form-item>
            <el-form-item prop="pinyinCode" :label="data.form.input.pinyinCode">
                <el-input v-model="dataForm.pinyinCode" :placeholder="data.form.input.pinyinCode"/>
            </el-form-item>
            <el-form-item prop="wbCode" :label="data.form.input.wbCode">
                <el-input v-model="dataForm.wbCode" :placeholder="data.form.input.wbCode"/>
            </el-form-item>
            <el-form-item prop="salePrice" :label="data.form.input.salePrice">
                <el-input v-model="dataForm.salePrice" :placeholder="data.form.input.salePrice"/>
            </el-form-item>
            <el-form-item prop="costPrice" :label="data.form.input.costPrice">
                <el-input v-model="dataForm.costPrice" :placeholder="data.form.input.costPrice"/>
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
        code: undefined,
        name: undefined,
        alisaName: undefined,
        categoryId: undefined,
        vehicleId: 0,
        brandId: true,
        madeinId: undefined,
        barCode: undefined,
        picCode: undefined,
        specialParam: undefined,
        desc: undefined,
        unit: undefined,
        volume: undefined,
        weight: undefined,
        defaultVendorId: undefined,
        status: undefined,
        pinyinCode: undefined,
        wbCode: undefined,
        salePrice: undefined,
        costPrice: undefined,
        remark: undefined
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
          save(...this.dataForm, '/base/billnum/save').then(res => {
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
