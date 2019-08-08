<template>
  <div>
    <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('views.public.add') : $t('views.public.update')"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="dataForm" :rules="rules" :inline="true" ref="dataForm"
               @keyup.enter.native="dataFormSubmitHandle()" label-width="105px">
        <el-form-item prop="pname" :label="data.data.input.pname" @click.native="showPid">
          <el-input v-model="dataForm.pname" :placeholder="data.data.input.pname"/>
        </el-form-item>
        <el-form-item prop="type" :label="data.data.input.type">
          <el-input v-model="dataForm.type" :placeholder="data.data.input.type"/>
        </el-form-item>
        <el-form-item prop="code" :label="data.data.input.code">
          <el-input v-model="dataForm.code" :placeholder="data.data.input.code"/>
        </el-form-item>
        <el-form-item prop="name" :label="data.data.input.name">
          <el-input v-model="dataForm.name" :placeholder="data.data.input.name"/>
        </el-form-item>
        <el-form-item prop="orderNum" :label="data.data.input.orderNum">
          <el-input v-model="dataForm.orderNum" :placeholder="data.data.input.orderNum"/>
        </el-form-item>
        <el-form-item prop="sys" :label="data.data.input.sys">
          <el-radio-group v-model="dataForm.sys">
            <el-radio :label='1'>是</el-radio>
            <el-radio :label='0'>否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="remark" :label="data.data.input.remark">
          <el-input v-model="dataForm.remark" :placeholder="data.data.input.remark"/>
        </el-form-item>
        <el-form-item prop="attr1" :label="data.data.input.attr1">
          <el-input v-model="dataForm.attr1" :placeholder="data.data.input.attr1"/>
        </el-form-item>
        <el-form-item prop="attr2" :label="data.data.input.attr2">
          <el-input v-model="dataForm.attr2" :placeholder="data.data.input.attr2"/>
        </el-form-item>
        <el-form-item prop="attr3" :label="data.data.input.attr3">
          <el-input v-model="dataForm.attr3" :placeholder="data.data.input.attr3"/>
        </el-form-item>
        <el-form-item prop="attr4" :label="data.data.input.attr4">
          <el-input v-model="dataForm.attr4" :placeholder="data.data.input.attr4"/>
        </el-form-item>
        <el-form-item prop="attr5" :label="data.data.input.attr5">
          <el-input v-model="dataForm.attr5" :placeholder="data.data.input.attr5"/>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button @click="visible = false">{{ $t('views.public.cancel') }}</el-button>
        <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('views.public.confirm') }}</el-button>
      </template>
    </el-dialog>
    <el-dialog title="菜单选择" :visible.sync="menuFormVisible" width="388px">
      <div>
        <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
        <el-tree
                :data="menuList"
                :props="defaultProps"
                style="height: 300px;"
                node-key="id"
                ref="tree"
                class="filter-tree"
                default-expand-all
                :filter-node-method="filterNode"
        ></el-tree>
        <div slot="footer" class="dialog-footer">
          <div class="menuDia">
            <el-button @click="menuFormVisible = false">取消</el-button>
            <el-button type="primary" @click="getSelectedMenu">确定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import data from './data'
export default {
  data () {
    return {
      filterText: '',
      menuList: [],
      defaultProps: {
        children: 'children',
        label: 'pname',
        id: 'id'
      },
      data: data,
      visible: false,
      dataForm: {
        id: undefined,
        parentId: undefined,
        type: undefined,
        code: undefined,
        name: undefined,
        orderNum: 0,
        sys: '0',
        companyId: undefined,
        remark: undefined,
        attr1: undefined,
        attr2: undefined,
        attr3: undefined,
        attr4: undefined,
        attr5: undefined,
        pname: undefined
      },
      rules: {
        name: [{
          required: true, message: '名称不可缺少'
        }],
        parentId: [{
          required: true, message: '父级菜单不可缺少'
        }],
        type: [{
          required: true, message: '类型不可缺少'
        }],
        code: [{
          required: true, message: '编码不可缺少'
        }]
      },
      menuFormVisible: false
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
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
    update (row) {
      this.dataForm = Object.assign({}, row)
      this.visible = true
      this.$nextTick(() => {
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
          url: '/base/tree/save',
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
        this.menuList = [{ id: 0, pname: '顶级菜单', children: this.dataList }]
      })
    },
    getSelectedMenu () {
      let data = this.$refs.tree.getCurrentNode()
      this.dataForm.pname = data.pname
      this.dataForm.parentId = data.id
      this.menuFormVisible = false
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
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
