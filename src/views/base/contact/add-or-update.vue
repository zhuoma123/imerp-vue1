<template>
    <el-dialog :visible.sync="visible" :title="isNew ? $t('views.public.add') : $t('views.public.update')"
               :close-on-click-modal="false" :close-on-press-escape="false"  width="55%">
        <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="120px" :inline="true" labelSuffix="："
                 size="mini" class="tb-matthew">
            <el-form-item prop="id" v-show="false" />
            <el-form-item label="顾客" prop="custId">
                <im-selector
                    placeholder="请选择客户"
                    v-model="dataForm.custId"
                    :mapModel.sync="dataForm"
                    mapKeyVal="custName:custId"
                    dataType="biz.customer">
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
                <el-input v-model.number="dataForm.mobileNo" :placeholder="data.form.input.mobileNo"/>
            </el-form-item>
            <el-form-item prop="tel" :label="data.form.input.tel">
                <el-input v-model.number="dataForm.tel" :placeholder="data.form.input.tel"/>
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
    let checkMobile = (rule, value, callback) => {
      if (value) {
        let pattern = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
        pattern.test(value) ? callback() : callback(new Error('手机号码格式不正确'))
      } else {
        callback()
      }
    }
    let checkTel = (rule, value, callback) => {
      if (value) {
        let pattern = /\d{3}-\d{8}|\d{4}-\d{7}/
        pattern.test(value) ? callback() : callback(new Error('电话格式不正确'))
      } else {
        callback()
      }
    }
    let checkEmail = (rule, value, callback) => {
      if (value) {
        let pattern = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        pattern.test(value) ? callback() : callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    }
    let checkWechat = (rule, value, callback) => {
      if (value) {
        let pattern = /^[a-zA-Z\d_]{5,}$/
        pattern.test(value) ? callback() : callback(new Error('微信号格式不正确'))
      } else {
        callback()
      }
    }
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/base/custcontact/list',
        updateURL: '/base/custcontact/save',
        getDataListIsPage: false,
        activatedIsNeed: false
      },
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
        }],
        mobileNo: [{
          validator: checkMobile, trigger: 'blur'
        }],
        tel: [{
          validator: checkTel, trigger: 'blur'
        }],
        email: [{
          validator: checkEmail, trigger: 'blur'
        }],
        weixinNo: [{
          validator: checkWechat, trigger: 'blur'
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
  methods: {}
}
</script>

<style lang="scss">
    .tb-matthew{
        .el-form-item{
            input.el-input__inner{
                width: 200px;
            }
            div.el-radio-group{
                width: 200px;
            }
        }
    }
</style>
