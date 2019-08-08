<template>
    <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('views.public.add') : $t('views.public.update')"
               :close-on-click-modal="false" :close-on-press-escape="false" width="850px">
        <el-form :model="dataForm" :rules="rules" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"
                 label-width="120px" :inline="true">
            <el-form-item prop="code" :label="data.form.input.code">
                <el-input v-model="dataForm.code" :placeholder="data.form.input.code"/>
            </el-form-item>
            <el-form-item prop="name" :label="data.form.input.name">
                <el-input v-model="dataForm.name" :placeholder="data.form.input.name"/>
            </el-form-item>
            <el-form-item prop="pinyinCode" :label="data.form.input.pinyinCode">
                <el-input v-model="dataForm.pinyinCode" :placeholder="data.form.input.pinyinCode"/>
            </el-form-item>
            <el-form-item prop="wbCode" :label="data.form.input.wbCode">
                <el-input v-model="dataForm.wbCode" :placeholder="data.form.input.wbCode"/>
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
    dataFormSubmitHandle () {
      let th = this
      this.$refs['dataForm'].validate(valid => {
        if (!valid) {
          return false
        }
        th.$axios({
          url: '/base/productbrand/save',
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
