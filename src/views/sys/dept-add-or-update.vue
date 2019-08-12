<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.deptId ? $t('views.public.add') : $t('views.public.update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="name" :label="$t('views.public.dept.name')" :rules="{required: true, message: '部门名称不能为空', trigger: 'blur'}">
        <el-input v-model="dataForm.name" :placeholder="$t('views.public.dept.name')" />
      </el-form-item>
      <el-form-item prop="parentName" :label="$t('views.public.dept.parentId')" class="dept-list" >
        <el-popover v-model="deptListVisible" ref="deptListPopover" placement="bottom-start" trigger="click">
          <el-tree
            :data="deptList"
            :props="{ label: 'name', children: 'children' }"
            node-key="deptId"
            ref="deptListTree"
            :highlight-current="true"
            :expand-on-click-node="false"
            accordion
            @current-change="deptListTreeCurrentChangeHandle">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:deptListPopover :readonly="true" :placeholder="$t('views.public.dept.parentId')"/>
      </el-form-item>
      <el-form-item prop="parentId" :label="$t('views.public.dept.parentId')" v-show="false" >
        <el-input v-model="dataForm.parentId" :placeholder="$t('views.public.dept.parentId')"/>
      </el-form-item>
      <el-form-item prop="orderNum" :label="$t('views.public.dept.orderNum')">
        <el-input v-model="dataForm.orderNum" :placeholder="$t('views.public.dept.orderNum')"/>
      </el-form-item>
      <el-form-item prop="delFlag" :label="$t('views.public.dept.delFlag')">
        <el-input v-model="dataForm.delFlag" :placeholder="$t('views.public.dept.delFlag')"/>
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
        deptId: '',
        name: '',
        parentId: '',
        parentName: '',
        orderNum: '1',
        delFlag: '0'
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
          if (this.dataForm.deptId) {
            // this.getInfo()
          }
        })
      })
    },
    // 获取部门列表
    getDeptList () {
      return this.$axios.get('/sys/dept/select').then(res => {
        this.deptList = res
      }).catch(() => {})
    },
    
    // 获取信息
    getInfo () {
      this.$axios.get(`/sys/dept/info/${this.dataForm.deptId}`).then(res => {
        this.dataForm = {
          ...this.dataForm,
          ...res
        }
        this.$refs.deptListTree.setCurrentKey(this.dataForm.deptId)
      }).catch(() => {})
    },
    // 所属部门树, 选中
    deptListTreeCurrentChangeHandle (data, node) {
      this.dataForm.parentId = data.dept_id
      this.dataForm.parentName = data.name
      this.deptListVisible = false
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$axios[!this.dataForm.deptId ? 'post' : 'put']('/sys/dept/save', {
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
