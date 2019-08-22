<template>
    <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('views.public.add') : $t('views.public.update')"
               :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="dataForm" :rules="rules" ref="dataForm"
                 label-width="120px">
            <el-form-item prop="productId" :label="data.form.input.productId" style="width: 520px">
                <im-selector
                        placeholder="请选择产品"
                        v-model="dataForm.productId"
                        :mapModel.sync="dataForm"
                        mapKeyVal="productName:productId"
                        dataType="biz.product"
                        @change="changeCust">
                </im-selector>
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
import data from './data'

export default {
  data () {
    return {
      data: data,
      visible: false,
      dataForm: {
        id: undefined,
        productId: undefined,
        salePrice: undefined,
        costPrice: undefined,
        remark: undefined
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
      let th = this
      this.$refs['dataForm'].validate(valid => {
        if (!valid) {
          return false
        }
        th.$axios({
          url: '/base/productprice/save',
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
