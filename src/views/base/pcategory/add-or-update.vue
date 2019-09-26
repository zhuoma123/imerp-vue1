<template>
    <div>
        <el-dialog :visible.sync="visible" :title="isNew ? $t('views.public.add') : $t('views.public.update')"
                   :close-on-click-modal="false" :close-on-press-escape="false" width="388px">
            <el-form :model="dataForm" :rules="rules" ref="dataForm"
                     label-width="120px" labelSuffix="："
                     size="mini">
                <el-form-item prop="id" v-show="false" />
                <el-form-item prop="pname" :label="data.form.input.pname" @click.native="showPid">
                    <el-input v-model="dataForm.pname" :placeholder="data.form.input.pname"/>
                </el-form-item>
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
        <el-dialog title="菜单选择" :visible.sync="menuFormVisible" width="388px">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
            <el-tree
                    :data="menuList"
                    :props="defaultProps"
                    style="height: 300px;"
                    node-key="id"
                    ref="tree"
                    class="tree-container"
                    default-expand-all
                    :filter-node-method="filterNode"
                    @node-click="getSelectedMenu"/>
            <div slot="footer" class="dialog-footer">
                <div class="menuDia">
                    <el-button @click="menuFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="getSelectedMenu">确定</el-button>
                </div>
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
    let checkCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('编码必须被填写'))
      } else {
        let form = {}
        if (this.dataForm.id) {
          form.id = this.dataForm.id
        }
        form.code = value
        this.$axios({
          url: '/base/productcategory/checkCode',
          method: 'post',
          data: form
        }).then(res => {
          if (res > 0) {
            callback(new Error('编码重复，请重新指定'))
          } else {
            callback()
          }
        })
      }
    }
    return {
      defaultProps: {
        children: 'children',
        label: 'name',
        id: 'id'
      },
      filterText: undefined,
      menuList: [],
      mixinViewModuleOptions: {
        getDataListURL: '/base/productcategory/list',
        updateURL: '/base/productcategory/save',
        getDataListIsPage: false,
        activatedIsNeed: false
      },
      data: data,
      visible: false,
      dataForm: {
        pname: undefined,
        parentId: undefined,
        id: undefined,
        code: undefined,
        name: undefined,
        pinyinCode: undefined,
        wbCode: undefined,
        remark: undefined
      },
      rules: {
        name: [{
          required: true, message: '名称不可缺少'
        }],
        code: [{
          validator: checkCode, trigger: 'blur'
        }],
        pname: [{
          required: true, message: '父类菜单不可缺少'
        }]
      },
      menuFormVisible: false
    }
  },
  props: {
    parentDataList: {
      type: Array
    }
  },
  watch: {
    filterText: function (val) {
      console.log(val)
      // this.$refs.tree.filter(val)
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
          url: '/base/productcategory/save',
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
    showPid () {
      this.menuFormVisible = true
      this.$nextTick(() => {
        this.menuList = [{ id: 0, name: '顶级菜单', children: this.parentDataList }]
      })
    },
    getSelectedMenu () {
      let data = this.$refs.tree.getCurrentNode()
      this.dataForm.pname = data.name
      this.dataForm.parentId = data.id
      this.menuFormVisible = false
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getMenuList () {
      this.$axios.post('/base/productcategory/list',
        { 'name': this.filterText }).then(res => {
        this.menuList = res
      })
    },
    created () {
      this.getMenuList()
    }
  }
}
</script>

<style lang="scss">

</style>
