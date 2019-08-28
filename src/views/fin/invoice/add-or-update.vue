<template>
    <div>
        <el-dialog :visible.sync="visible" :title="isNew ? '新增' : '修改'"
                   :close-on-click-modal="false" :close-on-press-escape="false" width="55%">
            <el-form :model="dataForm" :rules="rules" ref="dataForm"
                     label-width="110px" :inline="true" labelSuffix="："
                     size="mini" class="ddl-matthew">
                <!--dataForm must be showed all-->
                <el-form-item prop="id" v-show="false" />
                <el-form-item prop="name" :label="data.form.invoice.name" class="ddl-matthew-child">
                    <el-input v-model="dataForm.name" :placeholder="data.form.invoice.name"/>
                </el-form-item>
                <el-form-item prop="ivDate" :label="data.form.invoice.ivDate" class="ddl-matthew-child">
                    <el-date-picker
                            v-model="data.ivDate"
                            type="date"
                            :placeholder="data.form.invoice.ivDate" style="width: 178px">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="amount" :label="data.form.invoice.amount" class="ddl-matthew-child">
                    <el-input v-model="dataForm.amount" :placeholder="data.form.invoice.amount"/>
                </el-form-item>
                <el-form-item prop="ivType" :label="data.form.invoice.ivType" class="ddl-matthew-child">
                    <el-input v-model="dataForm.ivType" :placeholder="data.form.invoice.ivType"/>
                </el-form-item>
                <el-form-item prop="summary" :label="data.form.invoice.summary" class="ddl-matthew-child">
                    <el-input v-model="dataForm.summary" :placeholder="data.form.invoice.summary"/>
                </el-form-item>
                <el-form-item prop="customerId" :label="data.form.invoice.customerId" @click.native="showCust" class="ddl-matthew-child">
                    <el-input v-model="dataForm.customerId" :placeholder="data.form.invoice.customerId"/>
                </el-form-item>
                <el-form-item prop="taxNum" :label="data.form.invoice.taxNum" class="ddl-matthew-child">
                    <el-input v-model="dataForm.taxNum" :placeholder="data.form.invoice.taxNum"/>
                </el-form-item>
                <el-form-item prop="apAddress" :label="data.form.invoice.cpAddress" class="ddl-matthew-child">
                    <el-input v-model="dataForm.cpAddress" :placeholder="data.form.invoice.cpAddress"/>
                </el-form-item>
                <el-form-item prop="cpPhone" :label="data.form.invoice.cpPhone" class="ddl-matthew-child">
                    <el-input v-model="dataForm.cpPhone" :placeholder="data.form.invoice.cpPhone"/>
                </el-form-item>
                <el-form-item prop="cpBank" :label="data.form.invoice.cpBank" class="ddl-matthew-child">
                    <el-input v-model="dataForm.cpBank" :placeholder="data.form.invoice.cpBank"/>
                </el-form-item>
                <el-form-item prop="cpBankNum" :label="data.form.invoice.cpBankNum" class="ddl-matthew-child">
                    <el-input v-model="dataForm.cpBankNum" :placeholder="data.form.invoice.cpBankNum"/>
                </el-form-item>
                <el-form-item prop="status" :label="data.form.invoice.status" class="ddl-matthew-child">
                    <el-radio-group v-model="dataForm.status" style="width: 178px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="remark" :label="data.form.invoice.remark" class="ddl-matthew-child">
                    <el-input v-model="dataForm.remark" :placeholder="data.form.invoice.remark"/>
                </el-form-item>
            </el-form>
            <template slot="footer">
                <el-button @click="visible = false">{{ $t('views.public.cancel') }}</el-button>
                <el-button type="primary" @click="dataFormSubmit">{{ $t('views.public.confirm') }}</el-button>
            </template>
        </el-dialog>

        <el-dialog title="选择公司" :visible.sync="custVisible" width="388px">
            <div>
                <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
                <el-tree
                        :data="options"
                        :props="defaultProps"
                        style="height: 300px;"
                        node-key="id"
                        ref="tree"
                        class="filter-tree"
                        default-expand-all
                        :filter-node-method="filterNode"
                        @node-click="getSelectedMenu"
                ></el-tree>
                <div slot="footer" class="dialog-footer">
                    <div class="menuDia">
                        <el-button @click="menuFormVisible = false">取消</el-button>
                        <el-button type="primary" @click="getSelectedMenu">确定</el-button>
                    </div>
                </div>id
            </div>
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
      custVisible:false,
      mixinViewModuleOptions: {
        getDataListURL: '/fin/invoice/list',
        updateURL: '/fin/invoice/save',
        getDataListIsPage: false,
        activatedIsNeed: false
      },
      data: data,
      visible: false,
      options: [],
      defaultProps: {
        label: 'name',
        id: 'id'
      },
      loading: false,
      dataForm: {
        code: undefined,
        name: undefined,
        customerName: undefined,
        customerId: undefined,
        ivDate: undefined,
        amount: undefined,
        summary: undefined,
        ivType: undefined,
        cpName: undefined,
        taxNum: undefined,
        cpAddress: undefined,
        cpPhone: undefined,
        cpBank: undefined,
        cpBankNum: undefined,
        status: 1,
        remark: undefined
      },
      rules: {
        name: [
          { required: true, message: '名称不可缺少' }
        ]
      }
    }
  },
  methods: {
    showCust () {
      this.custVisible = true
      this.$nextTick(() => {
        // this.menuList
      })
    },
    selectCustomer (query) {
      this.$axios.post('/base/cust/search', { data: query }).then(res => {
        this.options = res
      })
    },
    getSelectedMenu () {
      let data = this.$refs.tree.getCurrentNode()
      this.dataForm.customerId=data.id
      this.dataForm.customerName=data.name
      this.dataForm.ivDate=new Date()
      this.dataForm.taxNum=data.taxNum
      this.dataForm.cpAddress=data.companyAddress
      this.dataForm.cpPhone=data.tel
      this.dataForm.cpBankNum=data.bankAccount
      this.dataForm.cpBank=data.bank

      this.custVisible=false
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    }
  },
  created () {
    this.selectCustomer()
  }
}
</script>

<style>
    .ddl-matthew >.ddl-matthew-child{
            margin-bottom: 8px;
        }

</style>
