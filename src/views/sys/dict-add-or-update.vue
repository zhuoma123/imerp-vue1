<template>
  <div>
    <el-dialog :visible.sync="visible" :title="isNew ? $t('views.public.add') : $t('views.public.update')"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="dataForm" :rules="rules" :inline="true" ref="dataForm" label-width="105px" labelSuffix="："
               size="mini">
        <el-form-item prop="id" v-show="false" />
        <el-form-item prop="editFlag" v-show="false" />
        <el-form-item prop="deleteFlag" v-show="false" />
        <el-form-item prop="dictionaryId" v-show="false" />
        <el-row>
          <el-col :span="12">
            <el-form-item prop="dictType" :label="data.form.dict.dictType">
              <im-selector
                      placeholder="请选择字典类型"
                      v-model="dataForm.dictType"
                      :mapModel.sync="dataForm"
                      mapKeyVal="dictType:dictionaryId"
                      dataType="bizweak.dict"
                      style="width: 200px">
              </im-selector>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="code" :label="data.form.dict.code">
              <el-input v-model="dataForm.code" :placeholder="data.form.dict.code"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item prop="name" :label="data.form.dict.name">
          <el-input v-model="dataForm.name" :placeholder="data.form.dict.name"/>
        </el-form-item>
        <el-form-item prop="extendVal" :label="data.form.dict.extendVal">
          <el-input v-model="dataForm.extendVal" :placeholder="data.form.dict.extendVal"/>
        </el-form-item>
        <el-form-item prop="editFlag" :label="data.form.dict.editFlag">
          <el-radio-group v-model="dataForm.editFlag" style="width: 200px;">
            <el-radio :label=1>是</el-radio>
            <el-radio :label=0>否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="deleteFlag" :label="data.form.dict.deleteFlag">
          <el-radio-group v-model="dataForm.deleteFlag" style="width: 200px">
            <el-radio :label=1>是</el-radio>
            <el-radio :label=0>否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="remark" :label="data.form.dict.remark">
          <el-input v-model="dataForm.remark" :placeholder="data.form.dict.remark"/>
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
import mixinViewModule from '@/mixins/view-module'
import data from './data'
export default {
  mixins: [mixinViewModule],
  data () {
    let codeValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error('编码必须被填写'))
      } else {
        let form = {}
        if (this.dataForm.id) {
          form.id = this.dataForm.id
        }
        form.code = value
        this.$axios({
          url: '/sys/dict/checkCode',
          method: 'post',
          data: form
        }).then(res => {
          if (res) {
            callback(new Error(res))
          } else {
            callback()
          }
        })
      }
    }
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/dict/list',
        updateURL: '/sys/dict/save',
        getDataListIsPage: true,
        activatedIsNeed: true
      },
      data: data,
      visible: false,
      dataForm: {
        id: undefined,
        dictType: undefined,
        code: undefined,
        name: undefined,
        extendVal: undefined,
        remark: undefined,
        editFlag: 1,
        deleteFlag: 1
      },
      rules: {
        dictType: [
          { required: true, message: '类型不可缺少', trigger: 'blur' }
        ],
        code: [
          { validator: codeValidator, trigger: 'blur' }
        ]
      },
      menuFormVisible: false
    }
  },
  props: {
    parentDataList: {
      type: Array
    }
  },
  methods: {}
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
  .el-form-item.el-input__inner{
    width: 200px;
  }
}
</style>
