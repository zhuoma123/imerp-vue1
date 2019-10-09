<template>
  <el-dialog class="abow-dialog" :visible.sync="visible" :title="!dataForm.userId ? $t('views.public.add') : $t('views.public.update')" 
  :close-on-click-modal="false" :close-on-press-escape="false" width="700px">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px" size="mini" :inline="true" labelSuffix="：" >
      <el-form-item prop="username" :label="$t('views.public.user.username')" >
        <el-input v-model="dataForm.username" :placeholder="$t('views.public.user.username')"  :disabled="!dataForm.userId ? false:true"/>
      </el-form-item>
      <el-form-item prop="name" label="用户名称">
        <el-input v-model="dataForm.name" placeholder="用户名称"/>
      </el-form-item>
      <el-form-item prop="deptName" :label="$t('views.public.user.deptName')" class="dept-list">
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
        <el-input v-model="dataForm.deptName" v-popover:deptListPopover :readonly="true" :placeholder="$t('views.public.user.deptName')"/>
      </el-form-item>
      <el-form-item prop="deptId" v-show="false" >
        <el-input v-model="dataForm.deptId"/>
      </el-form-item>
      <el-form-item prop="password"  :label="$t('views.public.user.password')" v-show="!this.dataForm.userId?true:false">
        <el-input v-model="dataForm.password" type="password" show-password :placeholder="$t('views.public.user.password')"/>
      </el-form-item>
      <el-form-item prop="mobile" :label="$t('views.public.user.mobile')">
        <el-input v-model="dataForm.mobile" :placeholder="$t('views.public.user.mobile')"/>
      </el-form-item>
      <el-form-item  prop="comPassword" :label="$t('views.public.user.comfirmPassword')" v-show="!this.dataForm.userId?true:false">
        <el-input v-model="dataForm.comPassword" type="password" show-password  :placeholder="$t('views.public.user.comfirmPassword')"/>
      </el-form-item>
      <el-form-item prop="email" :label="$t('views.public.user.email')">
        <el-input v-model="dataForm.email" :placeholder="$t('views.public.user.email')"/>
      </el-form-item>
      
      <el-form-item prop="roleIds" :label="$t('views.public.user.roleIdList')" class="role-list">
        <el-select v-model="dataForm.roleIds" multiple :placeholder="$t('views.public.user.roleIdList')">
          <el-option v-for="role in roleList" :key="role.roleId" :label="role.roleName" :value="role.roleId" >
          <span style="float: left">{{ role.roleName }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px" v-show="dataForm.currenId ==1 ? true:false">{{ role.companyName }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="status" :label="$t('views.public.user.status')" size="mini" v-show="!this.dataForm.userId ? false:true">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">{{ $t('views.public.user.status0') }}</el-radio>
          <el-radio :label="1">{{ $t('views.public.user.status1') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="superUser" label="是否设置超级用户" size="mini" v-show="this.dataForm.currenId ==1 ? true:false">
        <el-radio-group v-model="dataForm.superUser">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
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
import schema from 'async-validator';
export default {
  data () {
    return {
      visible: false,
      deptList: [],
      deptListVisible: false,
      fullscreenLoading: false,
      roleList: [],
      roleIdListDefault: [],
      dataForm: {
        userId: '',
        username: '',
        deptId: '0',
        deptName: '',
        password: '',
        comPassword: '',
        roleIds: '',
        gender: 0,
        email: '',
        mobile: '',
        roleIdList: [],
        status: 1 ,
        superUser:0 ,
        currenId:'',
        name:''
      }
    }
  },
  created() {
    this.getDeptList()
    this.getRoleList()
  },
  computed: {
    dataRule () {
      
      var validatePassword = (rule, value, callback) => {
        if (!this.dataForm.userId && !/\S/.test(value)) {
          return callback(new Error(this.$t('public.rules.required', { 'name': this.$t('views.public.user.password') })))
        }
        callback()
      }
      var validateName = (rule, value, callback) => {
        if (!this.dataForm.userId && !/\S/.test(value)) {
          return callback(new Error(this.$t('public.rules.required', { 'name': "用户名不能为空！" })))
        }
        callback()
      }
      var validateComfirmPassword = (rule, value, callback) => {

        if (!this.dataForm.userId && !/\S/.test(value)) {
          return callback(new Error(this.$t('public.rules.required', { 'name': this.$t('views.public.user.comfirmPassword') })))
        }
        if (this.dataForm.password !== value) {
        return callback(new Error(this.$t('views.public.user.validate.comfirmPassword')))
        
        }
        callback()
      }
      var validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          return callback(new Error(this.$t('public.rules.format', { 'name': this.$t('views.public.user.email') })))
        }
        callback()
      }
      var validateMobileAsync = (rule, value, callback) => {
        if (!isMobile(value)) {
          return callback(new Error(this.$t('public.rules.format', { 'name': this.$t('views.public.user.mobile') })))
        }else{
          this.$axios.post('/sys/user/checkmobile', { mobile: value,userId: this.dataForm.userId }).then(res => {
          if(res === '') {
            callback()
          } else {
            return callback(new Error(res))
          }
        })
        }
      }
      var validateUsernameAsync = (rule, value, callback) => {
        if(!this.dataForm.userId){
          this.$axios.post('/sys/user/checkusername', { username: value }).then(res => {
              if(res === '') {
            callback()
          } else {
            return callback(new Error(res))
          }
            })
        }else{
          return callback()
        }
      }
      return {
        username: [
          { required: true, message: "用户帐户不能为空!", trigger: 'blur' },
          { validator: validateUsernameAsync, trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: this.$t('public.rules.required', { 'name': this.$t('views.public.user.deptName') }), trigger: 'change' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        comPassword: [
          { validator: validateComfirmPassword, trigger: 'blur' }
        ],
        email: [
          { required: true, message: this.$t('public.rules.required', { 'name': this.$t('views.public.user.email') }), trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: this.$t('public.rules.required', { 'name': this.$t('views.public.user.mobile') }), trigger: 'blur' },
          //{ validator: validateMobile, trigger: 'blur' }
          { validator: validateMobileAsync, trigger: 'blur' }
        ],
        name: [
          { required: true, message: "用户名称不能为空！", trigger: 'blur' },
          {validator: validateName, trigger: 'blur'}
          
        ],
        roleIds: [
          { required: true, message: "角色不能为空！", trigger: 'change' },
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.dataForm.userId=null
      this.dataForm.roleIds=null
      this.dataForm.password=null
      this.dataForm.comPassword=null
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.roleIdListDefault = []
       
      })
    },    
    update(row){
      this.visible = true
      this.$nextTick(() => {
        this.dataForm = Object.assign({}, row)
        this.dataForm.comPassword=row.password
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 获取部门列表
    getDeptList () {
      return this.$axios.get('/sys/dept/select').then(res => {
        this.deptList = res
      }).catch(() => {})
    },
    // 获取角色列表
    getRoleList () {
      return this.$axios.get('/sys/role/select').then(res => {
        this.roleList = res
      }).catch(() => {})
    },
   
    // 所属部门树, 选中
    deptListTreeCurrentChangeHandle (data, node) {
      this.dataForm.deptId = data.deptId
      this.dataForm.deptName = data.name
      this.deptListVisible = false
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      debugger
      this.$refs['dataForm'].validate((valid) => {
        console.log(valid+"--+++++-----------")
        if (!valid) {
          return false
        }
        this.$axios['post']('/sys/user/save', {
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
