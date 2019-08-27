<template>
    <div>
        <el-dialog :visible.sync="visible" :title="isNew ? '新增' : '修改'"
                   :close-on-click-modal="false" :close-on-press-escape="false" width="55%">
            <el-form :model="dataForm" :rules="rules" ref="dataForm"
                     label-width="110px" :inline="true" labelSuffix="："
                     size="mini" class="ddl-matthew">
                <!--dataForm must be showed all-->
                <el-form-item prop="id" v-show="false" />
                <el-form-item prop="code" v-show="false" />
                <el-form-item prop="name" :label="data.form.input.name" @click.native="showPid" class="ddl-matthew-child">
                    <el-input v-model="dataForm.name" :placeholder="data.form.input.name"/>
                </el-form-item>
                <el-form-item prop="prefix" :label="data.form.input.prefix" class="ddl-matthew-child">
                    <el-input v-model="dataForm.prefix" :placeholder="data.form.input.prefix"/>
                </el-form-item>
                <el-form-item prop="prefixSeprator" :label="data.form.input.prefixSeprator" class="ddl-matthew-child">
                    <el-input v-model="dataForm.prefixSeprator" :placeholder="data.form.input.prefixSeprator"/>
                </el-form-item>
                <el-form-item prop="yLength" :label="data.form.input.yLength" class="ddl-matthew-child">
                    <el-input v-model="dataForm.yLength" :placeholder="data.form.input.yLength"/>
                </el-form-item>
                <el-form-item prop="sequenceLength" :label="data.form.input.sequenceLength" class="ddl-matthew-child">
                    <el-input v-model="dataForm.sequenceLength" :placeholder="data.form.input.sequenceLength"/>
                </el-form-item>
                <el-form-item prop="loopType" :label="data.form.input.loopType" v-show="false" class="ddl-matthew-child">
                    <el-input v-model="dataForm.loopType" :placeholder="data.form.input.loopType"/>
                </el-form-item>
                <el-form-item prop="suffixSeprator" :label="data.form.input.suffixSeprator" class="ddl-matthew-child">
                    <el-input v-model="dataForm.suffixSeprator" :placeholder="data.form.input.suffixSeprator"/>
                </el-form-item>
                <el-form-item prop="suffix" :label="data.form.input.suffix" class="ddl-matthew-child">
                    <el-input v-model="dataForm.suffix" :placeholder="data.form.input.suffix"/>
                </el-form-item>
                <el-form-item prop="remark" :label="data.form.input.remark" class="ddl-matthew-child">
                    <el-input v-model="dataForm.remark" :placeholder="data.form.input.remark"/>
                </el-form-item>
                <el-form-item prop="startDateActive" :label="data.form.input.startDateActive" class="ddl-matthew-child">
                    <el-date-picker
                            v-model="dataForm.startDateActive"
                            type="date"
                            :placeholder="data.form.input.startDateActive" style="width: 178px">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="endDateActive" :label="data.form.input.endDateActive" class="ddl-matthew-child">
                    <el-date-picker
                            v-model="dataForm.endDateActive"
                            type="date"
                            :placeholder="data.form.input.endDateActive" style="width: 178px">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="year" :label="data.form.input.year" class="ddl-matthew-child">
                    <el-input v-model="dataForm.year" :placeholder="data.form.input.year"/>
                </el-form-item>
                <el-form-item prop="month" :label="data.form.input.month" class="ddl-matthew-child">
                    <el-input v-model="dataForm.month" :placeholder="data.form.input.month"/>
                </el-form-item>
                <el-form-item prop="day" :label="data.form.input.day" class="ddl-matthew-child">
                    <el-input v-model="dataForm.day" :placeholder="data.form.input.day"/>
                </el-form-item>
                <el-form-item prop="yearFlag" :label="data.form.input.yearFlag" class="ddl-matthew-child">
                    <el-radio-group v-model="dataForm.yearFlag" style="width: 178px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="monthFlag" :label="data.form.input.monthFlag" class="ddl-matthew-child">
                    <el-radio-group v-model="dataForm.monthFlag" style="width: 178px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="dayFlag" :label="data.form.input.dayFlag" class="ddl-matthew-child">
                    <el-radio-group v-model="dataForm.dayFlag" style="width: 220px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="enabledFlag" :label="data.form.input.enabledFlag" class="ddl-matthew-child">
                    <el-radio-group v-model="dataForm.enabledFlag" style="width: 220px">
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
            <div>
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
import data from './data'
import mixinViewModule from '@/mixins/view-module'

export default {
  mixins: [mixinViewModule],
  data () {
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
          { required: true, message: '名称不可缺少' }
        ]
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
    .ddl-matthew >.ddl-matthew-child{
            margin-bottom: 8px;
        }

</style>
