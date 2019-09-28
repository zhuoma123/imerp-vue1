<template>
  <el-dialog class="abow_dialog" :visible.sync="visible" 
  :title="dataForm.roleId==null ? $t('views.public.add') : $t('views.public.update')" 
  :close-on-click-modal="false" :close-on-press-escape="false" width="80%">
    <el-form  :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px" size="mini">
      <el-form-item prop="roleName" label="角色名称" >
        <el-input v-model="dataForm.roleName" placeholder="角色名称" />
      </el-form-item>
      <el-form-item prop="deptName" label="所属部门" class="dept-list" >
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
        <el-input v-model="dataForm.deptName" v-popover:deptListPopover :readonly="true" :placeholder="$t('views.public.dept.parentId')"/>
      </el-form-item>
      <el-form-item prop="deptId" label="所属部门" v-show="false" >
        <el-input v-model="dataForm.deptId" placeholder="所属部门"/>
      </el-form-item>
      <el-row>
        <el-col :span="12">
      <el-form-item prop="menuName" label="菜单授权" class="dept-list" >      
        <el-tree
          :data="menuList"
          :props="{ label: 'name', children: 'children' }"
          node-key="menuId"
          ref="menuListTree"
          :highlight-current="true"
          :expand-on-click-node="false"
          accordion
          show-checkbox
         >
        </el-tree>
      </el-form-item>
        </el-col>
      
        <el-col :span="12">
      <el-form-item prop="deptNames" label="数据授权" class="dept-list" >        
        <el-tree
          :data="deptList"
          :props="{ label: 'name', children: 'children' }"
          node-key="deptId"
          ref="deptTree"
          :highlight-current="true"
          :expand-on-click-node="false"
          accordion
          show-checkbox
          >
        </el-tree>       
      </el-form-item>
        </el-col>
      </el-row>
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
      menuList: [],
      deptListVisible: false,
      dataForm: {
        roleId: '',
        roleName: '',
        deptId: '',
        deptName: '',
        deptNames:'',
        companyId:'',
        companyName:'',
        deptIdList:[],
        menuIdList:[]
      }
    }
  },
  created() {
    this.getDeptList()
    this.getMenuList()
  },
  computed: {
      dataRule () {
        var validateRoleName = (rule, value, callback) => {
          if (!this.dataForm.roleId && !/\S/.test(value)) {
            return callback(new Error("角色名称不能为空！"))
          }
          callback()
          }
          
      return{
         roleName: [
          { required: true, message: "角色名称不能为空！", trigger: 'blur' },
          { validator: validateRoleName, trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: "所属部门不能为空！", trigger: 'blur' },
        ]
        
      }
    }
  },
  methods: {
    
    init () {
      this.visible = true
      this.dataForm.roleId=null
      this.$nextTick(() => { 
        this.resetTree();
       this.$refs.dataForm.resetFields()
      })
    },
    
    update(row){
      this.visible = true
      this.$nextTick(() => {
        this.dataForm = Object.assign({}, row)
        let timer = setInterval(() => {
          if(this.menuList.length > 0 && this.deptList.length > 0) {
            this.setTree(row)
            clearInterval(timer)
          }
          console.log('---------wait')
        }, 500)
        // while(true) {
        //   console.log('--------wait', this.menuList.length, this.deptList.length)
        //   if(this.menuList.length > 0 && this.deptList.length > 0)
        //     break;
        // }
        
        this.$refs['dataForm'].clearValidate()
      })
    },
    setTree(row) {
      this.$refs.menuListTree.setCheckedKeys([]);
      this.$refs.deptTree.setCheckedKeys([])
      for(let item in row.menuIdList) {
        this.$refs.menuListTree.setChecked(row.menuIdList[item], true, false)
      }
      for(let item in row.deptIdList) {
        this.$refs.deptTree.setChecked(row.deptIdList[item], true, false)
      } 
    },
    resetTree(){
      this.$refs.menuListTree.setCheckedKeys([]);
      this.$refs.deptTree.setCheckedKeys([])
    },
    // 获取部门列表
    getDeptList () {
      return this.$axios.get('/sys/dept/select').then(res => {
        this.deptList = res
      }).catch(() => {})
    },
       // 获取菜单列表
    getMenuList () {
      return this.$axios.get('/sys/menu/select').then(res => {
        this.menuList = res
      }).catch(() => {})
    },
    
    // 所属部门树, 选中
    deptListTreeCurrentChangeHandle (data, node) {
      this.dataForm.deptId = data.deptId
      this.dataForm.deptName = data.name
      this.dataForm.deptNames = data.naem
      this.deptListVisible = false
    },
    // 数据, 选中
    deptIdListTreeCurrentChangeHandle (self) {
      let res = self.$refs.deptTree.getCheckedNodes(false,true)
      self.dataForm.deptIdList = []
      res.forEach((item) => {
        self.dataForm.deptIdList.push(item.deptId)
      })

    },
       // 所属菜单树, 选中
    menuListTreeCurrentChangeHandle (self) {
      debugger
       let res = self.$refs.menuListTree.getCheckedNodes(false,true)
       self.dataForm.menuIdList = []
      res.forEach((item) => {
        self.dataForm.menuIdList.push(item.menuId)
      })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        debugger
        this.menuListTreeCurrentChangeHandle(this)
        this.deptIdListTreeCurrentChangeHandle(this)
        this.$axios['post']('/sys/role/save', {
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
