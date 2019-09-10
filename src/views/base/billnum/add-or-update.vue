<template>
    <div>
        <el-dialog :visible.sync="visible" :title="isNew ? '新增' : '修改'"
                   :close-on-click-modal="false" :close-on-press-escape="false" width="55%">
            <el-form :model="dataForm" :rules="rules" ref="dataForm"
                     label-width="110px" :inline="true" labelSuffix="："
                     size="mini">
                <!--dataForm must be showed all-->
                <el-form-item prop="id" v-show="false"/>
                <el-form-item prop="code" v-show="false"/>
                <el-form-item prop="name" :label="data.form.input.name" @click.native="showPid">
                    <el-input v-model="dataForm.name" :placeholder="data.form.input.name"/>
                </el-form-item>
                <el-form-item prop="prefix" :label="data.form.input.prefix">
                    <el-input v-model="dataForm.prefix" :placeholder="data.form.input.prefix"/>
                </el-form-item>
                <el-form-item prop="prefixSeprator" :label="data.form.input.prefixSeprator" >
                    <el-input v-model="dataForm.prefixSeprator" :placeholder="data.form.input.prefixSeprator"/>
                </el-form-item>
                <el-form-item prop="yLength" :label="data.form.input.yLength" >
                    <el-input v-model.number="dataForm.yLength" :placeholder="data.form.input.yLength"/>
                </el-form-item>
                <el-form-item prop="sequenceLength" :label="data.form.input.sequenceLength" >
                    <el-input v-model.number="dataForm.sequenceLength" :placeholder="data.form.input.sequenceLength"/>
                </el-form-item>
                <el-form-item prop="loopType" :label="data.form.input.loopType" v-show="false"
                              >
                    <el-input v-model="dataForm.loopType" :placeholder="data.form.input.loopType"/>
                </el-form-item>
                <el-form-item prop="suffixSeprator" :label="data.form.input.suffixSeprator" >
                    <el-input v-model="dataForm.suffixSeprator" :placeholder="data.form.input.suffixSeprator"/>
                </el-form-item>
                <el-form-item prop="suffix" :label="data.form.input.suffix" >
                    <el-input v-model="dataForm.suffix" :placeholder="data.form.input.suffix"/>
                </el-form-item>
                <el-form-item prop="remark" :label="data.form.input.remark" >
                    <el-input v-model="dataForm.remark" :placeholder="data.form.input.remark"/>
                </el-form-item>
                <el-form-item prop="startDateActive" :label="data.form.input.startDateActive" >
                    <el-date-picker
                            v-model="dataForm.startDateActive"
                            type="date"
                            :placeholder="data.form.input.startDateActive" style="width: 178px">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="endDateActive" :label="data.form.input.endDateActive"  style="margin-left: 20px">
                    <el-date-picker
                            v-model="dataForm.endDateActive"
                            type="date"
                            :placeholder="data.form.input.endDateActive" style="width: 178px">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="year" :label="data.form.input.year" >
                    <el-input v-model.number="dataForm.year" :placeholder="data.form.input.year"/>
                </el-form-item>
                <el-form-item prop="month" :label="data.form.input.month" >
                    <el-input v-model.number="dataForm.month" :placeholder="data.form.input.month"/>
                </el-form-item>
                <el-form-item prop="day" :label="data.form.input.day" >
                    <el-input v-model.number="dataForm.day" :placeholder="data.form.input.day"/>
                </el-form-item>
                <el-form-item prop="yearFlag" :label="data.form.input.yearFlag" >
                    <el-radio-group v-model="dataForm.yearFlag">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="monthFlag" :label="data.form.input.monthFlag" >
                    <el-radio-group v-model="dataForm.monthFlag">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="dayFlag" :label="data.form.input.dayFlag" >
                    <el-radio-group v-model="dataForm.dayFlag">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="enabledFlag" :label="data.form.input.enabledFlag" >
                    <el-radio-group v-model="dataForm.enabledFlag">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template slot="footer">
                <el-button @click="visible = false">{{ $t('views.public.cancel') }}</el-button>
                <el-button type="primary" @click="dataFormSubmit">{{ $t('views.public.confirm') }}</el-button>
            </template>
        </el-dialog>
        <el-dialog title="菜单选择" :visible.sync="menuFormVisible" width="388px">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
            <el-tree
                    :data="menuList"
                    :props="defaultProps"
                    style="height: 300px;"
                    node-key="code"
                    ref="tree"
                    class="filter-tree"
                    default-expand-all
                    :filter-node-method="filterNode"
                    @node-click="getSelectedMenu"
            ></el-tree>
            <template slot="footer">
                <el-button @click="menuFormVisible = false">取消</el-button>
                <el-button type="primary" @click="getSelectedMenu">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import data from './data'
import mixinViewModule from '@/mixins/view-module'

export default {
  mixins: [mixinViewModule],
  data () {
    let checkType = (rule, value, callback) => {
      if (value) {
        let form = new Map()
        form.typeId = this.dataForm.typeId
        let id = this.dataForm.id
        if (id) {
          form.id = id
        }
        this.$axios({
          url: '/base/billnum/checkType',
          method: 'post',
          data: form
        }).then(res => {
          if (res) {
            callback(new Error(res))
          } else {
            callback()
          }
        })
      } else {
        callback()
      }
    }
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/base/billnum/list',
        updateURL: '/base/billnum/save',
        getDataListIsPage: false,
        activatedIsNeed: false
      },
      filterText: '',
      menuFormVisible: false,
      menuList: [],
      data: data,
      visible: false,
      dataForm: {
        id: undefined,
        typeId: undefined,
        code: undefined,
        name: undefined,
        prefix: undefined,
        prefixSeprator: undefined,
        yearFlag: 1,
        yLength: undefined,
        monthFlag: 1,
        dayFlag: 1,
        sequenceLength: undefined,
        loopType: undefined,
        suffixSeprator: undefined,
        suffix: undefined,
        remark: undefined,
        year: undefined,
        month: undefined,
        day: undefined,
        sequenceNum: undefined,
        enabledFlag: 1,
        deletedFlag: undefined,
        startDateActive: undefined,
        endDateActive: undefined
      },
      typeData: [],
      rules: {
        name: [
          { validator: checkType }
        ],
        yLength: [
          { type: 'number', message: '必须为数字类型' }
        ],
        sequenceLength: [{
          type: 'number', message: '必须为数字类型', trigger: 'blur'
        }],
        year: [{
          type: 'number', message: '必须为数字类型 w', trigger: 'blur'
        }],
        month: [{
          type: 'number', message: '必须为数字类型', trigger: 'blur'
        }],
        day: [{
          type: 'number', message: '必须为数字类型', trigger: 'blur'
        }]
      },
      defaultProps: {
        label: 'name',
        id: 'code'
      }
    }
  },
  methods: {
    showPid () {
      this.menuFormVisible = true
      this.$nextTick(() => {
        // this.menuList
      })
    },
    getSelectedMenu () {
      let data = this.$refs.tree.getCurrentNode()
      data.id = undefined
      this.dataForm = Object.assign({}, data)

      let date = new Date()

      this.dataForm.year = date.getFullYear()
      this.dataForm.month = date.getMonth() + 1
      this.dataForm.day = date.getDate()
      this.dataForm.startDateActive = date

      let endDate = new Date()
      endDate.setFullYear(date.getFullYear() + 1)
      this.dataForm.endDateActive = endDate

      this.menuFormVisible = false
    },
    filterNode (value, data) {
      // let data = this.menuList
      debugger
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    typeProvider () {
      this.$axios.post(
        `${this.mixinViewModuleOptions.deleteURL}${this.mixinViewModuleOptions.deleteIsBatch ? '' : '/' + data}`,
        this.mixinViewModuleOptions.deleteIsBatch ? {
          'data': data
        } : {}
      ).then(res => {
        this.$message({
          message: this.$t('views.public.success'),
          type: 'success',
          duration: 500,
          onClose: () => {
            this.getDataList()
          }
        })
      }).catch(() => {
      })
    },
    getMenuList () {
      this.$axios.post('/base/ruletype/list',
        { 'name': this.filterText }).then(res => {
        this.menuList = res
      })
    }
  },
  created () {
    this.getMenuList()
  },
  watch: {
    filterText: function (val) {
      this.$refs.tree.filter(val)
    }
  }
}
</script>

<style>
    input.el-input__inner{
        width: 200px;
    }
    div.el-radio-group{
        width: 200px;
    }

</style>
