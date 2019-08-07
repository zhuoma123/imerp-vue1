<template>
    <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('views.public.add') : $t('views.public.update')"
               :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="dataForm" :rules="rules" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"
                 label-width="120px">
            <el-form-item prop="requirementDate" :label="data.form.input.requirementDate">
                <el-input v-model="dataForm.requirementDate" :placeholder="data.form.input.requirementDate"/>
            </el-form-item>
            <el-form-item prop="companyId" :label="data.form.input.companyId">
                <el-input v-model="dataForm.companyId" :placeholder="data.form.input.companyId"/>
            </el-form-item>
            <el-form-item prop="productId" :label="data.form.input.productId">
                <el-input v-model="dataForm.productId" :placeholder="data.form.input.productId"/>
            </el-form-item>
            <el-form-item prop="warehouseId" :label="data.form.input.warehouseId">
                <el-input v-model="dataForm.warehouseId" :placeholder="data.form.input.warehouseId"/>
            </el-form-item>
            <el-form-item prop="tranType" :label="data.form.input.tranType">
                <el-input v-model="dataForm.tranType" :placeholder="data.form.input.tranType"/>
            </el-form-item>
            <el-form-item prop="demandSourceHeaderId" :label="data.form.input.demandSourceHeaderId">
                <el-input v-model="dataForm.demandSourceHeaderId" :placeholder="data.form.input.demandSourceHeaderId"/>
            </el-form-item>
            <el-form-item prop="demandSourceLineId" :label="data.form.input.demandSourceLineId">
                <el-input v-model="dataForm.demandSourceLineId" :placeholder="data.form.input.demandSourceLineId"/>
            </el-form-item>
            <el-form-item prop="reservationUomCode" :label="data.form.input.reservationUomCode">
                <el-input v-model="dataForm.reservationUomCode" :placeholder="data.form.input.reservationUomCode"/>
            </el-form-item>
            <el-form-item prop="reservationQuantity" :label="data.form.input.reservationQuantity">
                <el-input v-model="dataForm.reservationQuantity" :placeholder="data.form.input.reservationQuantity"/>
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
        requirementDate: undefined,
        companyId: undefined,
        productId: undefined,
        warehouseId: undefined,
        tranType: undefined,
        demandSourceHeaderId: 0,
        demandSourceLineId: true,
        reservationUomCode: undefined,
        reservationQuantity: undefined,
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
          save(...this.dataForm, '/base/reservation/save').then(res => {
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
