<template>
  <el-dialog class="abow-dialog" :visible.sync="visible" :title="!dataForm.menuId ? $t('views.public.add') : $t('views.public.update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="name" label="菜单名称" :rules="{required: true, message: '菜单名称不能为空', trigger: 'blur'}">
        <el-input v-model="dataForm.name" placeholder="菜单名称" />
      </el-form-item>
      <el-form-item prop="parentName" label="上级菜单" class="dept-list" >
        <el-popover v-model="deptListVisible" ref="deptListPopover" placement="bottom-start" trigger="click">
          <el-tree
            :data="deptList"
            :props="{ label: 'name', children: 'children' }"
            node-key="menuId"
            ref="deptListTree"
            :highlight-current="true"
            :expand-on-click-node="false"
            accordion
            @current-change="deptListTreeCurrentChangeHandle">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:deptListPopover :readonly="true" :placeholder="$t('views.public.dept.parentId')"/>
      </el-form-item>
      <el-form-item prop="parentId" label="上级菜单" v-show="false" >
        <el-input v-model="dataForm.parentId" />
      </el-form-item>
      <el-form-item prop="url" label="菜单URL">
        <el-input v-model="dataForm.url" placeholder="菜单URL"/>
      </el-form-item>
      <el-form-item prop="perms" label="授权">
        <el-input v-model="dataForm.perms" placeholder="多个用逗号分隔：如：sys.menu.save,sys.menu.update"/>
      </el-form-item>
     <el-form-item prop="icon" label="菜单图标">
        <el-input v-model="dataForm.icon" aria-describedby="el-popover-5679" class="el-input el-popover__reference" placeholder="菜单图标"/>
      </el-form-item>
      <el-form-item prop="orderNum" label="排序">
        <el-input v-model="dataForm.orderNum" placeholder="排序"/>
      </el-form-item>
      <el-form-item label="菜单类型">
       <template>
      <el-radio-group v-model="dataForm.type">
        <el-radio :label="0">导航栏</el-radio>
        <el-radio :label="1">菜单</el-radio>
        <el-radio :label="2">按钮</el-radio>
      </el-radio-group>
      </template>
      </el-form-item>
    </el-form>
  
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('views.public.cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('views.public.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { debounce } from 'lodash'
export default {
  data () {
    return {
      visible: false,
      deptList: [],
      deptListVisible: false,
      dataForm: {
        menuId: '',
        name: '',
        parentId: '',
        parentName: '',
        orderNum: '1',
        url: '',
        perms:'',
        type:1,
        icon:''
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.roleIdListDefault = []
        Promise.all([
          this.getDeptList()
        ]).then(() => {
          if (this.dataForm.menuId) {
            // this.getInfo()
          }
        })
      })
    },
    update(row){
      this.visible = true
      this.$nextTick(() => {
        this.dataForm = Object.assign({}, row)
        this.$refs['dataForm'].clearValidate()
        Promise.all([
          this.getDeptList()
        ]).then(() => {
          if (this.dataForm.menuId) {
             
          }
        })
      })
    },
    // 获取菜单列表
    getDeptList () {
      return this.$axios.get('/sys/menu/select').then(res => {
        this.deptList = res
      }).catch(() => {})
    },
    
    // 所属菜单树, 选中
    deptListTreeCurrentChangeHandle (data, node) {
      this.dataForm.parentId = data.menuId
      this.dataForm.parentName = data.name
      this.deptListVisible = false
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$axios[!this.dataForm.menuId ? 'post' : 'put']('/sys/menu/save', {
          ...this.dataForm
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
        }).catch(() => {})
      })
    }, 1000, { 'leading': true, 'trailing': false })
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
