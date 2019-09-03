<template>
    <el-dialog :visible.sync="visible" :title="isNew ? $t('views.public.add') : $t('views.public.update')"
               :close-on-click-modal="false" :close-on-press-escape="false" width="700px">
        <el-form :inline="true" :model="dataForm" :rules="rules"
                 class="ddl-form" label-width="120px" labelSuffix="："
                 ref="dataForm" size="mini">
            <el-form-item prop="id" v-show="false" class="ddl-form-item" />
            <el-form-item prop="name" :label="data.form.input.name">
                <el-input v-model="dataForm.name" :placeholder="data.form.input.name"/>
            </el-form-item>
            <el-form-item prop="code" :label="data.form.input.code" class="ddl-form-item" >
                <el-input v-model="dataForm.code" :placeholder="data.form.input.code"/>
            </el-form-item>
            <el-form-item prop="virtualFlag" :label="data.form.input.virtualFlag" class="ddl-form-item">
                <el-radio-group v-model="dataForm.virtualFlag">
                    <el-radio :label=1>是</el-radio>
                    <el-radio :label=0>否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item prop="address" :label="data.form.input.address" class="ddl-form-item">
                <el-input v-model="dataForm.address" :placeholder="data.form.input.address"/>
            </el-form-item>
            <el-form-item prop="pic" :label="data.form.input.pic" class="ddl-form-item">
                <el-input v-model="dataForm.pic" :placeholder="data.form.input.pic"/>
            </el-form-item>
            <el-form-item prop="mobileNo" :label="data.form.input.mobileNo" class="ddl-form-item">
                <el-input v-model="dataForm.mobileNo" :placeholder="data.form.input.mobileNo"/>
            </el-form-item>
            <el-form-item prop="tel" :label="data.form.input.tel" class="ddl-form-item">
                <el-input v-model="dataForm.tel" :placeholder="data.form.input.tel"/>
            </el-form-item>
            <el-form-item prop="remark" :label="data.form.input.remark" class="ddl-form-item">
                <el-input v-model="dataForm.remark" :placeholder="data.form.input.remark"/>
            </el-form-item>
        </el-form>
        <template slot="footer">
            <el-button @click="visible = false">{{ $t('views.public.cancel') }}</el-button>
            <el-button type="primary" @click="dataFormSubmit">{{ $t('views.public.confirm') }}</el-button>
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
        getDataListURL: '/base/warehouse/list',
        updateURL: '/base/warehouse/save',
        getDataListIsPage: false,
        activatedIsNeed: false
      },
      data: data,
      visible: false,
      dataForm: {
        id: undefined,
        code: undefined,
        name: undefined,
        address: undefined,
        remark: undefined,
        virtualFlag: 1,
        pic: undefined,
        mobileNo: undefined,
        companyId: undefined,
        tel: undefined
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
          url: '/base/warehouse/save',
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

    .ddl-form {
        .ddl-form-item {
            margin-bottom: 5px;
        }
    }

</style>
