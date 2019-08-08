<template>
    <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('views.public.add') : $t('views.public.update')"
               :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="dataForm" :rules="rules" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"
                 label-width="110px" :inline="true" style="width: 700px" >
            <el-form-item prop="code" :label="data.form.input.code">
                <el-input v-model="dataForm.code" :placeholder="data.form.input.code"/>
            </el-form-item>
            <el-form-item prop="name" :label="data.form.input.name">
                <el-input v-model="dataForm.name" :placeholder="data.form.input.name"/>
            </el-form-item>
            <el-form-item prop="prefix" :label="data.form.input.prefix">
                <el-input v-model="dataForm.prefix" :placeholder="data.form.input.prefix"/>
            </el-form-item>
            <el-form-item prop="prefixSeprator" :label="data.form.input.prefixSeprator">
                <el-input v-model="dataForm.prefixSeprator" :placeholder="data.form.input.prefixSeprator"/>
            </el-form-item>
            <el-form-item prop="yLength" :label="data.form.input.yLength">
                <el-input v-model="dataForm.yLength" :placeholder="data.form.input.yLength"/>
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
            <el-form-item prop="startDateActive" :label="data.form.input.startDateActive">
                <el-date-picker
                        v-model="dataForm.startDateActive"
                        type="date"
                        :placeholder="data.form.input.startDateActive">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="endDateActive" :label="data.form.input.endDateActive">
                <el-date-picker
                        v-model="dataForm.endDateActive"
                        type="date"
                        :placeholder="data.form.input.endDateActive">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="yearFlag" :label="data.form.input.yearFlag">
                <el-radio-group v-model="dataForm.yearFlag" style="width: 280px">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item prop="monthFlag" :label="data.form.input.monthFlag">
                <el-radio-group v-model="dataForm.monthFlag" style="width: 280px">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item prop="dayFlag" :label="data.form.input.dayFlag">
                <el-radio-group v-model="dataForm.dayFlag" style="width: 280px">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item prop="enabledFlag" :label="data.form.input.enabledFlag">
                <el-radio-group v-model="dataForm.enabledFlag" style="width: 280px">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                </el-radio-group>
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

export default {
  data () {
    return {
      data: data,
      visible: false,
      dataForm: {
        code: undefined,
        name: undefined,
        prefix: undefined,
        prefixSeprator: undefined,
        yearFlag: 1,
        yLength: undefined,
        monthFlag: 1,
        dayFlag: 1,
        sequenceLength: undefined,
        loopType: undefined,
        suffixSeprator: undefined,
        suffix: undefined,
        remark: undefined,
        year: undefined,
        month: undefined,
        day: undefined,
        sequenceNum: undefined,
        enabledFlag: 1,
        deletedFlag: undefined,
        startDateActive: undefined,
        endDateActive: undefined
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
        let date = new Date()
        this.dataForm.startDateActive = date
        this.dataForm.year = date.getFullYear()
        this.dataForm.month = date.getMonth() + 1
        this.dataForm.day = date.getDate()
        debugger
      })
    },
    // 表单提交
    dataFormSubmitHandle () {
      let th = this
      this.$refs['dataForm'].validate(valid => {
        if (!valid) {
          return false
        }
        th.$axios({
          url: '/base/billnum/save',
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
