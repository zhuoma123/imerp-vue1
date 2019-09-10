<template>
    <el-dialog :visible.sync="visible" :title="isNew ? $t('views.public.add') : $t('views.public.update')"
               :close-on-click-modal="false" :close-on-press-escape="false" width="388px">
        <el-form :model="dataForm" :rules="rules" ref="dataForm"
                 label-width="120px" labelSuffix="："
                 size="mini">
            <el-form-item prop="id" v-show="false"/>
            <el-form-item prop="productId" :label="data.form.input.productId">
                <im-selector
                        placeholder="请选择产品"
                        v-model="dataForm.productId"
                        :mapModel.sync="dataForm"
                        mapKeyVal="productName:productId"
                        dataType="biz.priceproduct"
                        style="width: 300px">
                </im-selector>
            </el-form-item>
            <el-form-item prop="salePrice" :label="data.form.input.salePrice">
                <el-input v-model.number="dataForm.salePrice" :placeholder="data.form.input.salePrice" style="width: 193px"/>
            </el-form-item>
            <el-form-item prop="costPrice" :label="data.form.input.costPrice">
                <el-input v-model.number="dataForm.costPrice" :placeholder="data.form.input.costPrice" style="width: 193px"/>
            </el-form-item>
            <el-form-item prop="remark" :label="data.form.input.remark">
                <el-input v-model="dataForm.remark" :placeholder="data.form.input.remark" style="width: 193px"/>
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
    let checkProduct = (rule, value, callback) => {
      debugger
      if (value) {
        this.$axios.post('/base/productprice/checkProduct', {
          productId: value
        }).then(res => {
          if (res) {
            callback(new Error('相关产品价格记录已经存在'))
          } else {
            callback()
          }
        })
      } else {
        callback(new Error('产品不可为空'))
      }
    }
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/base/productprice/list',
        updateURL: '/base/productprice/save',
        getDataListIsPage: false,
        activatedIsNeed: false
      },
      data: data,
      visible: false,
      dataForm: {
        id: undefined,
        productId: undefined,
        salePrice: undefined,
        costPrice: undefined,
        remark: undefined
      },
      rules: {
        productId: [{
          required: true, message: '产品不可为空'
        }],
        salePrice: [{
          type: 'number', message: '必须为数字类型', trigger: 'blur'
        }],
        costPrice: [
          { type: 'number', message: '必须为数字类型', trigger: 'blur' }
        ]
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
    input.el-input__inner{
        width: 200px;
    }
    div.el-radio-group{
        width: 200px;
    }
    .el-dialog__footer {
        margin-right: 20px;
    }
</style>
