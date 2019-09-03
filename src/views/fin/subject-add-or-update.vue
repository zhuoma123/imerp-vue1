<template>
    <div>
        <el-dialog :visible.sync="visible" :title="isNew ? $t('views.public.add') : $t('views.public.update')"
                   :close-on-click-modal="false" :close-on-press-escape="false" width="750px">
            <el-form :model="dataForm" :rules="rules" ref="dataForm"
                     label-width="120px" :inline="true" labelSuffix="："
                     size="mini">
                <el-form-item prop="id" v-show="false" />
                <el-form-item prop="pname" :label="data.form.subject.parentId" @click.native="showPid">
                    <el-input v-model="dataForm.pname" :placeHolder="data.form.subject.parentId"/>
                </el-form-item>
                <el-form-item prop="name" :label="data.form.subject.name">
                    <el-input v-model="dataForm.name" :placeholder="data.form.subject.name"/>
                </el-form-item>
                <el-form-item prop="code" :label="data.form.subject.code">
                    <el-input v-model="dataForm.code" :placeholder="data.form.subject.code"/>
                </el-form-item>
                <el-form-item prop="subjectType" :label="data.form.subject.subjectType">
                    <el-input v-model="dataForm.subjectType" :placeholder="data.form.subject.subjectType"/>
                </el-form-item>
                <el-form-item prop="category" :label="data.form.subject.category">
                    <el-input v-model="dataForm.category" :placeholder="data.form.subject.category"/>
                </el-form-item>
                <el-form-item prop="subjectLevel" :label="data.form.subject.subjectLevel">
                    <el-input v-model="dataForm.subjectLevel" :placeholder="data.form.subject.subjectLevel"/>
                </el-form-item>
                <el-form-item prop="direction" :label="data.form.subject.direction">
                    <el-input v-model="dataForm.direction" :placeholder="data.form.subject.direction"/>
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
    return {
      menuFormVisible: false,
      filterText: undefined,
      menuList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        id: 'id'
      },
      mixinViewModuleOptions: {
        getDataListURL: '/fin/subject/list',
        updateURL: '/fin/subject/save',
        getDataListIsPage: false,
        activatedIsNeed: true
      },
      data: data,
      visible: false,
      dataForm: {
        id: undefined,
        parentId: undefined,
        companyId: undefined,
        code: undefined,
        name: undefined,
        subjectType: undefined,
        category: undefined,
        subjectLevel: undefined,
        direction: undefined,
        pname: undefined
      },
      rules: {
        name: [{
          required: true, message: '名称不可缺少'
        }],
        parentId: [{
          required: true, message: '父级不可缺少'
        }]
      }
    }
  },
  props: {
    parentDataList: {
      type: Array
    }
  },
  methods: {
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
    }
  }
}
</script>

<style lang="scss">
    .el-dialog__footer {
        margin-right: 7px;
    }
</style>
