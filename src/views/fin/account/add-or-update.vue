<template>
    <div>
        <el-dialog :visible.sync="visible" :title="isNew ? '新增' : '修改'"
                   :close-on-click-modal="false" :close-on-press-escape="false" width="30%">
            <el-form :model="dataForm" :rules="rules" ref="dataForm"
                     label-width="110px" labelSuffix="："
                     size="mini" class="ddl-matthew">
                <!--dataForm must be showed all-->
                <el-form-item prop="id" v-show="false" />
                <el-form-item prop="name" :label="data.form.account.name" >
                    <el-input v-model="dataForm.name" :placeholder="data.form.account.name"/>
                </el-form-item>
                <el-form-item prop="bankName" :label="data.form.account.bankName" >
                    <el-input v-model="dataForm.bankName" :placeholder="data.form.account.bankName"/>
                </el-form-item>
                <el-form-item prop="bankNum" :label="data.form.account.bankNum" >
                    <el-input v-model.number="dataForm.bankNum" :placeholder="data.form.account.bankNum"/>
                </el-form-item>
                <el-form-item prop="balance" :label="data.form.account.balance" >
                    <el-input v-model.number="dataForm.balance" :placeholder="data.form.account.balance"/>
                </el-form-item>
                <el-form-item prop="initBalance" :label="data.form.account.initBalance" >
                    <el-input v-model.number="dataForm.initBalance" :placeholder="data.form.account.initBalance"/>
                </el-form-item>
                <el-form-item prop="remark" :label="data.form.account.remark" >
                    <el-input v-model="dataForm.remark" :placeholder="data.form.account.remark"/>
                </el-form-item>
            </el-form>
            <template slot="footer">
                <el-button @click="visible = false">{{ $t('views.public.cancel') }}</el-button>
                <el-button type="primary" @click="dataFormSubmit" :disabled="btnDisable">{{ $t('views.public.confirm') }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import data from '../data'
import mixinViewModule from '@/mixins/view-module'

export default {
  mixins: [mixinViewModule],
  data () {
    let checkValidName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('账户名称不能为空'))
      }
      this.$axios({
        url: '/fin/account/nameValid',
        method: 'post',
        data: { 'name': value }
      }).then(res => {
        if (res) {
          callback(new Error(res))
        } else {
          callback()
        }
      })
    }
    return {
      btnDisable: false,
      mixinViewModuleOptions: {
        getDataListURL: '/fin/account/list',
        updateURL: '/fin/account/save',
        getDataListIsPage: false,
        activatedIsNeed: false
      },
      menuFormVisible: false,
      menuList: [],
      data: data,
      visible: false,
      dataForm: {
        name: undefined,
        bankNum: undefined,
        bankName: undefined,
        initBalance: undefined,
        balance: undefined,
        remark: undefined
      },
      typeData: [],
      rules: {
        name: [
          { validator: checkValidName, trigger: 'blur' }
        ],
        balance: [
          { type: 'number', message: '余额必须为数字值' }
        ],
        initBalance: [
          { type: 'number', message: '初始余额必须为数字值' }
        ]
      }
    }
  },
  methods: {}
}
</script>

<style>
     >-child{
            margin-bottom: 8px;
        }
    .el-dialog__footer{
        margin-right: 60px;
    }

</style>
