<template>
  <el-dialog class="abow-dialog" :visible.sync="visible" title="修改密码" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" width="300px" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px" size="mini">
      <el-form-item prop="password"  label="原来密码" v-show="this.dataForm.superUser ===1 ? false:true" >
        <el-input v-model="dataForm.password" type="password" show-password placeholder="原来密码"/>
      </el-form-item>
      <el-form-item prop="newPassword" label="新密码" >
        <el-input v-model="dataForm.newPassword" type="password" show-password placeholder="新密码"/>
      </el-form-item>
      <el-form-item prop="comfirmPassword" label="确认新密码">
        <el-input v-model="dataForm.comfirmPassword" type="password" show-password placeholder="确认新密码"/>
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
      dataForm: {
        userId: '',
        password: '',
        newPassword: '',
        comfirmPassword:'',
        surperUser:undefined
      }
    }
  },
  computed: {
    dataRule () {
      var validatePassword = (rule, value, callback) => {
        if (this.dataForm.userId && !/\S/.test(value)) {
          return callback(new Error(this.$t('public.rules.required', { 'name': "新密码！" })))
        }
        callback()
      }
      var validateComfirmPassword = (rule, value, callback) => {
        if (this.dataForm.userId && !/\S/.test(value)) {
          return callback(new Error(this.$t('public.rules.required', { 'name': "新密码！" })))
        }
        if (this.dataForm.newPassword !== value) {
          return callback(new Error(this.$t('views.public.user.validate.comfirmPassword')))
        }
        callback()
      }
      var validatePasswordAsync = (rule, value, callback) => {
          this.$axios.post('/sys/user/checkpassword', { password: value,userId: this.dataForm.userId }).then(res => {
          if(res === '') {
            callback()
          } else {
            return callback(new Error(res))
          }
        })
      }
      return {
        newPassword: [
          {  required: true, message:"新密码不能为空！", trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        comfirmPassword: [
          {  required: true, message:"确认新密码不能为空！", trigger: 'blur' },
          { validator: validateComfirmPassword, trigger: 'blur' }
        ],
        password: [
          {  required: true, message:"密码不能为空！", trigger: 'blur' },
          { validator: validatePasswordAsync, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {   
    updatepass(){
      this.visible = true
      
      this.dataForm.newPassword=null
      this.dataForm.comfirmPassword=null
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
  
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        console.log(valid)
        if (!valid) {
          return false
        }
        this.$axios['post']('/sys/user/password', {
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
