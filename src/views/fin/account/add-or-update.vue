<template>
    <div>
        <el-dialog :visible.sync="visible" :title="isNew ? '新增' : '修改'"
                   :close-on-click-modal="false" :close-on-press-escape="false" width="40%">
            <el-form :model="dataForm" :rules="rules" ref="dataForm"
                     label-width="110px" labelSuffix="："
                     size="mini" class="ddl-matthew">
                <!--dataForm must be showed all-->
                <el-form-item prop="id" v-show="false" />
                <el-form-item prop="name" :label="data.form.account.name" class="ddl-matthew-child">
                    <el-input v-model="dataForm.name" :placeholder="data.form.account.name"/>
                </el-form-item>
                <el-form-item prop="bankName" :label="data.form.account.bankName" class="ddl-matthew-child">
                    <el-input v-model="dataForm.bankName" :placeholder="data.form.account.bankName"/>
                </el-form-item>
                <el-form-item prop="bankNum" :label="data.form.account.bankNum" class="ddl-matthew-child">
                    <el-input v-model.number="dataForm.bankNum" :placeholder="data.form.account.bankNum"/>
                </el-form-item>
                <el-form-item prop="balance" :label="data.form.account.balance" class="ddl-matthew-child">
                    <el-input v-model.number="dataForm.balance" :placeholder="data.form.account.balance"/>
                </el-form-item>
                <el-form-item prop="initBalance" :label="data.form.account.initBalance" class="ddl-matthew-child">
                    <el-input v-model.number="dataForm.initBalance" :placeholder="data.form.account.initBalance"/>
                </el-form-item>
                <el-form-item prop="status" :label="data.form.account.status" class="ddl-matthew-child">
                    <el-radio-group v-model="dataForm.status" style="width: 178px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="remark" :label="data.form.account.remark" class="ddl-matthew-child">
                    <el-input v-model="dataForm.remark" :placeholder="data.form.account.remark"/>
                </el-form-item>
            </el-form>
            <template slot="footer">
                <el-button @click="visible = false">{{ $t('views.public.cancel') }}</el-button>
                <el-button type="primary" @click="dataFormSubmit">{{ $t('views.public.confirm') }}</el-button>
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
    return {
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
        status: 1,
        remark: undefined
      },
      typeData: [],
      rules: {
        name: [
          { required: true, message: '名称不可缺少' }
        ],
        balance: [
          { type: 'number', message: '余额必须为数字值' }
        ],
        initBalance: [
          { type: 'number', message: '初始余额必须为数字值' }
        ],
        bankNum: [
          { type: 'number', message: '账号必须为数字值' }
        ]
      }
    }
  },
  methods: {
  }
}
</script>

<style>
    .ddl-matthew >.ddl-matthew-child{
            margin-bottom: 8px;
        }

</style>
