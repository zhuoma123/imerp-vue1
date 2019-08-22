<template>
    <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('views.public.add') : $t('views.public.update')"
               :close-on-click-modal="false" :close-on-press-escape="false" width="850px">
        <el-form :model="dataForm" :rules="rules" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"
                 label-width="120px" :inline="true">
            <el-form-item label="顾客" prop="custId">
                <im-selector
                    placeholder="请选择客户"
                    v-model="dataForm.custId"
                    :mapModel.sync="dataForm"
                    mapKeyVal="name:custId"
                    dataType="biz.customer"
                    @change="changeCust">
                </im-selector>
            </el-form-item>
            <el-form-item prop="name" :label="data.form.input.name">
                <el-input v-model="dataForm.name" :placeholder="data.form.input.name"/>
            </el-form-item>
            <el-form-item prop="shortName" :label="data.form.input.shortName">
                <el-input v-model="dataForm.shortName" :placeholder="data.form.input.shortName"/>
            </el-form-item>
            <el-form-item prop="linkman" :label="data.form.input.linkman">
                <el-input v-model="dataForm.linkman" :placeholder="data.form.input.linkman"/>
            </el-form-item>
            <el-form-item prop="mobileNo" :label="data.form.input.mobileNo">
                <el-input v-model="dataForm.mobileNo" :placeholder="data.form.input.mobileNo"/>
            </el-form-item>
            <el-form-item prop="tel" :label="data.form.input.tel">
                <el-input v-model="dataForm.tel" :placeholder="data.form.input.tel"/>
            </el-form-item>
            <el-form-item prop="weixinNo" :label="data.form.input.weixinNo">
                <el-input v-model="dataForm.weixinNo" :placeholder="data.form.input.weixinNo"/>
            </el-form-item>
            <el-form-item prop="email" :label="data.form.input.email">
                <el-input v-model="dataForm.email" :placeholder="data.form.input.email"/>
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
        custId: undefined,
        name: undefined,
        shortName: undefined,
        linkman: undefined,
        mobileNo: undefined,
        tel: undefined,
        weixinNo: undefined,
        email: undefined,
        remark: undefined
      },
      rules: {
        name: [{
          required: true, message: '名称不可缺少'
        }],
        code: [{
          required: true, message: '编码不可缺少'
        }]
      },
      vendor: {
        remoteURL: '/common/biz/list',
        loading: false,
        dataList: [],
        timeout: null
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
          url: '/base/custcontact/save',
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
    },
    vendorInfo: function (query) {
      this.vendor.loading = true
      this.$axios
        .post(this.vendor.remoteURL, { query: query })
        .then(res => {
          this.vendor.loading = false
          debugger
          this.vendor.dataList = res
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
