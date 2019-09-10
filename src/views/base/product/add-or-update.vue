<template>
    <el-dialog :visible.sync="visible" :title="isNew ? $t('views.public.add') : $t('views.public.update')"
               :close-on-click-modal="false" :close-on-press-escape="false" width="750px">
        <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="120px" :inline="true" labelSuffix="："
                 size="mini">
            <el-form-item prop="id" v-show="false" />
            <el-form-item prop="name" :label="data.form.input.name">
                <el-input v-model="dataForm.name" :placeholder="data.form.input.name"/>
            </el-form-item>
            <el-form-item prop="code" :label="data.form.input.code">
                <el-input v-model="dataForm.code" :placeholder="data.form.input.code"/>
            </el-form-item>
            <el-form-item prop="alisaName" :label="data.form.input.alisaName">
                <el-input v-model="dataForm.alisaName" :placeholder="data.form.input.alisaName"/>
            </el-form-item>
            <el-form-item prop="categoryId" :label="data.form.input.categoryId">
                <im-selector
                        placeholder="请选择物料分类"
                        v-model="dataForm.categoryId"
                        :mapModel.sync="dataForm"
                        mapKeyVal="cName:categoryId"
                        dataType="biz.pcategory"
                        style="width: 200px">
                </im-selector>
            </el-form-item>
            <el-form-item prop="vehicleId" :label="data.form.input.vehicleId">
                <im-selector
                        placeholder="请选择物料车型"
                        v-model="dataForm.vehicleId"
                        :mapModel.sync="dataForm"
                        mapKeyVal="vName:vehicleId"
                        dataType="biz.pvehicle"
                        style="width: 200px">
                </im-selector>
            </el-form-item>
            <el-form-item prop="brandId" :label="data.form.input.brandId">
                <im-selector
                        placeholder="请选择物料品牌"
                        v-model="dataForm.brandId"
                        :mapModel.sync="dataForm"
                        mapKeyVal="bName:brandId"
                        dataType="biz.pbrand" style="width: 200px">
                </im-selector>
            </el-form-item>
            <el-form-item prop="madeinId" :label="data.form.input.madeinId">
                <im-selector
                        placeholder="请选择物料产地"
                        v-model="dataForm.madeinId"
                        :mapModel.sync="dataForm"
                        mapKeyVal="mName:madeinId"
                        dataType="biz.pmadein"
                        style="width: 200px">
                </im-selector>
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
                <el-input v-model="dataForm.weight" :placeholder="data.form.input.weight"/>
            </el-form-item>
            <el-form-item prop="defaultVendorId" :label="data.form.input.defaultVendorId">
                <im-selector
                        placeholder="请选择供应商"
                        v-model="dataForm.defaultVendorId"
                        :mapModel.sync="dataForm"
                        mapKeyVal="dName:defaultVendorId"
                        dataType="biz.customer"
                        style="width: 200px">
                </im-selector>
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
import data from './data'
import mixinViewModule from '@/mixins/view-module'

export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/base/product/list',
        updateURL: '/base/product/save',
        getDataListIsPage: false,
        activatedIsNeed: false
      },
      data: data,
      visible: false,
      dataForm: {
        id: undefined,
        code: undefined,
        name: undefined,
        alisaName: undefined,
        categoryId: undefined,
        vehicleId: undefined,
        brandId: undefined,
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
          url: '/base/product/save',
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
</style>
