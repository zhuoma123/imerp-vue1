<template>
    <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('views.public.add') : $t('views.public.update')"
               :close-on-click-modal="false" :close-on-press-escape="false" width="800px">
        <el-form :model="dataForm" :rules="rules" ref="dataForm"
                 label-width="120px" :inline="true">
            <el-form-item prop="requirementDate" :label="data.form.input.requirementDate">
                <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="dataForm.requirementDate"
                        type="date"
                        :placeholder="data.form.input.requirementDate">
                </el-date-picker>
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
        requirementDate: undefined,
        companyId: undefined,
        productId: undefined,
        warehouseId: undefined,
        tranType: undefined,
        demandSourceHeaderId: undefined,
        demandSourceLineId: undefined,
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
        if (this.dataForm.id) {
          this.dataForm.id = undefined
        }
        this.$refs['dataForm'].clearValidate()
      })
    },
    update (row) {
      this.visible = true
      this.$nextTick(() => {
        this.dataForm = Object.assign({}, row)
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 表单提交
    dataFormSubmitHandle () {
      debugger
      let th = this
      this.$refs['dataForm'].validate(valid => {
        if (!valid) {
          return false
        }
        th.$axios({
          url: '/base/reservation/save',
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
