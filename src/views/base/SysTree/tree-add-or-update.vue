<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('views.public.add') : $t('views.public.update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="rules" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="username" :label="$t('views.public.user.username')">
        <el-input v-model="dataForm.username" :placeholder="$t('views.public.user.username')"/>
      </el-form-item>
      <el-form-item prop="deptName" :label="$t('views.public.user.deptName')" class="dept-list">
        <el-popover v-model="deptListVisible" ref="deptListPopover" placement="bottom-start" trigger="click">
          <el-tree
            :data="deptList"
            :props="{ label: 'name', children: 'children' }"
            node-key="id"
            ref="deptListTree"
            :highlight-current="true"
            :expand-on-click-node="false"
            accordion
            @current-change="deptListTreeCurrentChangeHandle">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.deptName" v-popover:deptListPopover :readonly="true" :placeholder="$t('views.public.user.deptName')"/>
      </el-form-item>
      <el-form-item prop="password" :label="$t('views.public.user.password')" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.password" type="password" :placeholder="$t('views.public.user.password')"/>
      </el-form-item>
      <el-form-item prop="comfirmPassword" :label="$t('views.public.user.comfirmPassword')" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.comfirmPassword" type="password" :placeholder="$t('views.public.user.comfirmPassword')"/>
      </el-form-item>
      <el-form-item prop="realName" :label="$t('views.public.user.realName')">
        <el-input v-model="dataForm.realName" :placeholder="$t('views.public.user.realName')"/>
      </el-form-item>
      <el-form-item prop="gender" :label="$t('views.public.user.gender')" size="mini">
        <el-radio-group v-model="dataForm.gender">
          <el-radio :label="0">{{ $t('views.public.user.gender0') }}</el-radio>
          <el-radio :label="1">{{ $t('views.public.user.gender1') }}</el-radio>
          <el-radio :label="2">{{ $t('views.public.user.gender2') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="email" :label="$t('views.public.user.email')">
        <el-input v-model="dataForm.email" :placeholder="$t('views.public.user.email')"/>
      </el-form-item>
      <el-form-item prop="mobile" :label="$t('views.public.user.mobile')">
        <el-input v-model="dataForm.mobile" :placeholder="$t('views.public.user.mobile')"/>
      </el-form-item>
      <el-form-item prop="roleIdList" :label="$t('views.public.user.roleIdList')" class="role-list">
        <el-select v-model="dataForm.roleIdList" multiple :placeholder="$t('views.public.user.roleIdList')">
          <el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="status" :label="$t('views.public.user.status')" size="mini">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">{{ $t('views.public.user.status0') }}</el-radio>
          <el-radio :label="1">{{ $t('views.public.user.status1') }}</el-radio>
        </el-radio-group>
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
import { isEmail, isMobile } from '@/libs/validate'
export default {
  data () {
    return {
      visible: false,
      deptList: [],
      deptListVisible: false,
      roleList: [],
      roleIdListDefault: [],
      dataForm: {
        id: undefined,
        parentId: undefined,
        type: undefined,
        code: undefined,
        name: undefined,
        orderNum: 0,
        sys: true,
        companyId: undefined,
        remark: undefined,
        attr1: undefined,
        attr2: undefined,
        attr3: undefined,
        attr4: undefined,
        attr5: undefined
      },
      rules: {
        name: [{
          required: true, message: '名称不可缺少'
        }]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.roleIdListDefault = []
        // Promise.all([
        //   this.getDeptList(),
        //   this.getRoleList()
        // ]).then(() => {
        //   if (this.dataForm.id) {
        //     // this.getInfo()
        //   }
        // })
      })
    },
    // 获取部门列表
    getDeptList () {
      return this.$axios.get('/sys/dept/list').then(res => {
        this.deptList = res
      }).catch(() => {})
    },
    // 获取角色列表
    getRoleList () {
      return this.$axios.get('/sys/role/list').then(res => {
        this.roleList = res
      }).catch(() => {})
    },
    // 获取信息
    getInfo () {
      this.$axios.get(`/sys/user/${this.dataForm.id}`).then(res => {
        this.dataForm = {
          ...this.dataForm,
          ...res,
          roleIdList: []
        }
        this.$refs.deptListTree.setCurrentKey(this.dataForm.deptId)
        // 角色配置, 区分是否为默认角色
        for (var i = 0; i < res.roleIdList.length; i++) {
          if (this.roleList.filter(item => item.id === res.roleIdList[i])[0]) {
            this.dataForm.roleIdList.push(res.roleIdList[i])
            continue
          }
          this.roleIdListDefault.push(res.roleIdList[i])
        }
      }).catch(() => {})
    },
    // 所属部门树, 选中
    deptListTreeCurrentChangeHandle (data, node) {
      this.dataForm.deptId = data.id
      this.dataForm.deptName = data.name
      this.deptListVisible = false
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$axios[!this.dataForm.id ? 'post' : 'put']('/sys/user', {
          ...this.dataForm,
          roleIdList: [
            ...this.dataForm.roleIdList,
            ...this.roleIdListDefault
          ]
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
