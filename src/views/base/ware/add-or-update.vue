<template>
    <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('views.public.add') : $t('views.public.update')"
               :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="dataForm" :rules="rules" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"
                 label-width="120px">
            <el-form-item prop="code" :label="data.form.input.code">
                <el-input v-model="dataForm.code" :placeholder="data.form.input.code"/>
            </el-form-item>
            <el-form-item prop="name" :label="data.form.input.name">
                <el-input v-model="dataForm.name" :placeholder="data.form.input.type"/>
            </el-form-item>
            <el-form-item prop="prefix" :label="data.form.input.prefix">
                <el-input v-model="dataForm.prefix" :placeholder="data.form.input.prefix"/>
            </el-form-item>
            <el-form-item prop="prefixSeprator" :label="data.form.input.prefixSeprator">
                <el-input v-model="dataForm.prefixSeprator" :placeholder="data.form.input.prefixSeprator"/>
            </el-form-item>
            <el-form-item prop="yearFlag" :label="data.form.input.yearFlag">
                <el-input v-model="dataForm.yearFlag" :placeholder="data.form.input.yearFlag"/>
            </el-form-item>
            <el-form-item prop="yLength" :label="data.form.input.yLength">
                <el-input v-model="dataForm.yLength" :placeholder="data.form.input.yLength"/>
            </el-form-item>
            <el-form-item prop="monthFlag" :label="data.form.input.monthFlag">
                <el-input v-model="dataForm.monthFlag" :placeholder="data.form.input.monthFlag"/>
            </el-form-item>
            <el-form-item prop="dayFlag" :label="data.form.input.dayFlag">
                <el-input v-model="dataForm.dayFlag" :placeholder="data.form.input.dayFlag"/>
            </el-form-item>
            <el-form-item prop="sequenceLength" :label="data.form.input.sequenceLength">
                <el-input v-model="dataForm.sequenceLength" :placeholder="data.form.input.sequenceLength"/>
            </el-form-item>
            <el-form-item prop="loopType" :label="data.form.input.loopType">
                <el-input v-model="dataForm.loopType" :placeholder="data.form.input.loopType"/>
            </el-form-item>
            <el-form-item prop="suffixSeprator" :label="data.form.input.suffixSeprator">
                <el-input v-model="dataForm.suffixSeprator" :placeholder="data.form.input.suffixSeprator"/>
            </el-form-item>
            <el-form-item prop="suffix" :label="data.form.input.suffix">
                <el-input v-model="dataForm.suffix" :placeholder="data.form.input.suffix"/>
            </el-form-item>
            <el-form-item prop="remark" :label="data.form.input.remark">
                <el-input v-model="dataForm.remark" :placeholder="data.form.input.remark"/>
            </el-form-item>
            <el-form-item prop="year" :label="data.form.input.year">
                <el-input v-model="dataForm.year" :placeholder="data.form.input.year"/>
            </el-form-item>
            <el-form-item prop="month" :label="data.form.input.month">
                <el-input v-model="dataForm.month" :placeholder="data.form.input.month"/>
            </el-form-item>
            <el-form-item prop="day" :label="data.form.input.day">
                <el-input v-model="dataForm.day" :placeholder="data.form.input.day"/>
            </el-form-item>
            <el-form-item prop="sequenceNum" :label="data.form.input.sequenceNum">
                <el-input v-model="dataForm.sequenceNum" :placeholder="data.form.input.sequenceNum"/>
            </el-form-item>
            <el-form-item prop="enabledFlag" :label="data.form.input.enabledFlag">
                <el-input v-model="dataForm.enabledFlag" :placeholder="data.form.input.enabledFlag"/>
            </el-form-item>
            <el-form-item prop="startDateActive" :label="data.form.input.startDateActive">
                <el-input v-model="dataForm.startDateActive" :placeholder="data.form.input.startDateActive"/>
            </el-form-item>
            <el-form-item prop="endDateActive" :label="data.form.input.endDateActive">
                <el-input v-model="dataForm.endDateActive" :placeholder="data.form.input.endDateActive"/>
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
        parentId: undefined,
        type: undefined,
        code: undefined,
        name: undefined,
        orderNum: 0,
        sys: true,
        companyId: undefined,
        remark: undefined,
        attr1: undefined,
        attr2: undefined,
        attr3: undefined,
        attr4: undefined,
        attr5: undefined
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
