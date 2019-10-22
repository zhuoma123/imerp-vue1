<template>
    <el-dialog :visible.sync="visible" :title="isNew ? $t('views.public.add') : $t('views.public.update')"
               :close-on-click-modal="false" :close-on-press-escape="false" width="400px" class="dlg-matthew">
        <el-form :model="dataForm" :rules="rules" ref="dataForm"
                 label-width="120px" labelSuffix="："
                 size="mini" class="tb-matthew">
            <el-form-item prop="id" v-show="false" />
            <el-form-item prop="productId" :label="data.form.input.productId">
                <im-selector
                        placeholder="请选择产品"
                        v-model="dataForm.productId"
                        :mapModel.sync="dataForm"
                        mapKeyVal="productName:productId"
                        dataType="bizall.product"
                        style="width: 300px" :disabled="dataForm.id">
                </im-selector>
            </el-form-item>
            <el-form-item prop="warehouseId" :label="data.form.input.warehouse">
                <im-selector
                        placeholder="请选择仓库"
                        v-model="dataForm.warehouseId"
                        :mapModel.sync="dataForm"
                        mapKeyVal="warehouseName:warehouseId"
                        dataType="biz.warehouse">
                </im-selector>
            </el-form-item>
            <el-form-item prop="name" :label="data.form.input.name">
                <el-input v-model="dataForm.name" :placeholder="data.form.input.name" style="width: 200px"/>
            </el-form-item>
            <el-form-item prop="remark" :label="data.form.input.remark" >
                <el-input v-model="dataForm.remark" :placeholder="data.form.input.remark" style="width: 200px"/>
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
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/base/warehouseslot/list',
        updateURL: '/base/warehouseslot/save',
        getDataListIsPage: false,
        activatedIsNeed: false
      },
      data: data,
      visible: false,
      dataForm: {
        id: undefined,
        warehouseId: undefined,
        name: undefined,
        remark: undefined,
        productId: undefined
      },
      rules: {
        name: [{
          required: true, message: '名称不可缺少'
        }],
        code: [{
          required: true, message: '编码不可缺少'
        }],
        warehouseId: [{
          required: true, message: '仓库不可缺少'
        }],
        productId: [{
          required: true, message: '产品不可缺少'
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
          url: '/base/warehouseslot/save',
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
        .el-form-item{
            input.el-input__inner{
                width: 200px;
            }
        }
    }
    .dlg-matthew{
        .el-dialog__footer {
            margin-right: 38px;
        }
    }
</style>
