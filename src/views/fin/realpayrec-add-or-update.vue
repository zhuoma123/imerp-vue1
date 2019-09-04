<template>
  <el-dialog
    :title="isNew ? '收付款单新增' : '收付款单修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    v-loading.fullscreen.lock="fullscreenLoading"
    class="abow_dialog"
    width="80%"
  >
    <div>
    <dynamic-form
            v-model="dataForm"
            :formprops="formprops"
            ref="dataForm"
            col-span='6,6,6,6'
            :alldescriptors="descriptors">
        <template slot="btnsearch">
            <el-button type="primary" icon="el-icon-search" @click="search" >查询</el-button>
            <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
        </template>
    </dynamic-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="btnDisable" @click="dataFormSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import mixinViewModule from "@/mixins/view-module"
import XEUtils from 'xe-utils'
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
          getDataListURL: '/fin/realpayrecline/list',
	      updateURL: '/fin/realpayrec/update',
          deleteIsBatch: true,
          getDataListIsPage: false
      },
      visible: false,
      btnDisable: false,
      dataForm: {
        id:null,
        custId:null,
        custName:null,
        payDate:null,
        summary:null,
        payrecId:null,
        amount:null,
        subjectId:null,
        accountId:null,
        status:null,
        pic:null,
        remark:null,
        companyId:null,
        deletedFlag:null,
        createBy:null,
        createDate:null,
        updateBy:null,
        updateDate:null,
},
      descriptors: {
   id: {
        type: 'string',
        label: 'id'
      },
         custId: {
        type: 'string',
        label: '往来单位id'
      },
         custName: {
        type: 'string',
        label: '往来单位名称'
      },
        btnSearch: {
        type: 'slot',
        name: 'btnsearch'
      },
separate4:     this.$g.separate,
     summary: {
        type: 'string',
        label: '收付款类型'
      },
         payrecId: {
        type: 'string',
        label: '关联应收/应付id'
      },
         amount: {
        type: 'string',
        label: '收付款金额'
      },
      separate8:     this.$g.separate,
     accountId: {
        type: 'string',
        label: '银行账户'
      },
         status: {
        type: 'string',
        label: '状态'
      },
         pic: {
        type: 'string',
        label: '收付款负责人'
      },
      separate12:     this.$g.separate,
     companyId: {
        type: 'string',
        label: '公司'
      },
         deletedFlag: {
        type: 'string',
        label: '删除标记'
      },
         createBy: {
        type: 'string',
        label: '创建人'
      },
      separate16:     this.$g.separate,
     updateBy: {
        type: 'string',
        label: '修改人'
      },
         updateDate: {
        type: 'string',
        label: '修改日期'
      },
        },
      tableProxy: {
          autoLoad: false
      },
      tableColumn: [
        { type: "selection", width: 30, align: "center" },
        { type: "index", width: 30, align: "center" },
      ],
      toolbar: {
        id: "full_edit_1",
        resizable: {
            storage: true
        },
        setting: {
            storage: true
        }
      }
    }
  },
  methods: {
      },
  mounted () {
  }
};
</script>
