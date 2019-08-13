<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible"
    v-loading.fullscreen.lock="fullscreenLoading"
    width="80%"
  >
    <div slot="title">
      <el-form
        :model="dataForm"
        labelSuffix="："
        size="mini"
        :rules="dataRule"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
        label-width="120px"
      >
                <el-form-item label="盘点单号" prop="orderNum">
                          <el-input v-model="dataForm.orderNum" clearable ></el-input>
                      </el-form-item>
                <el-form-item label="盘点主题" prop="topic">
                          <el-input v-model="dataForm.topic" clearable ></el-input>
                      </el-form-item>
                <el-form-item label="盘点仓id" prop="warehouseId">
                          <el-input v-model="dataForm.warehouseId" clearable ></el-input>
                      </el-form-item>
                <el-form-item label="负责人" prop="pic">
                          <el-autocomplete
                class="inline-input"
                value-key="key"
                v-model="dataForm.pic"
                :fetch-suggestions="queryPic"
                placeholder="请输入"
                :trigger-on-focus="false"
                @select="handlePicSelect"
              ></el-autocomplete>
                      </el-form-item>
                <el-form-item label="状态" prop="status">
                                          <el-select
                  v-model="dataForm.status"
                  :loading="statusSel.loading"
                >
                  <el-option
                    v-for="item in statusSel.dataList"
                    :key="item.key"
                    :label="item.key"
                    :value="item.value">
                  </el-option>
                </el-select>
                                    </el-form-item>
                <el-form-item label="审批状态" prop="wfStatus">
                                          <el-select v-model="dataForm.wfStatus" placeholder="请选择审批状态">
                                      <el-option label="草稿" value="1"></el-option>
                                      <el-option label="审核" value="2"></el-option>
                                      <el-option label="通过" value="3"></el-option>
                                  </el-select>
                                    </el-form-item>
                <el-form-item label="审批意见" prop="wfOpinion">
                          <el-input v-model="dataForm.wfOpinion" clearable ></el-input>
                      </el-form-item>
                <el-form-item label="备注" prop="remark">
                          <el-input v-model="dataForm.remark" clearable ></el-input>
                      </el-form-item>
                <el-form-item label="公司" prop="companyId">
                          <el-input v-model="dataForm.companyId" clearable ></el-input>
                      </el-form-item>
              </el-form>
    </div>
    <vxe-grid
      border
      resizable
      size="mini"
      highlight-current-row
      class="vxe-table-element"
      remote-filter
      ref="sGrid"
      :toolbar="toolbar"
      :proxy-config="tableProxy"
      :columns="tableColumn"
      :select-config="{reserve: true}"
      :mouse-config="{selected: true}"
      :keyboard-config="{isArrow: true, isDel: true, isTab: true, isEdit: true}"
      :edit-config="{trigger: 'dblclick', mode: 'cell'}"
    ></vxe-grid>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="btnDisable" @click="dataFormSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import mixinViewModule from "@/mixins/view-module"
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/inv/checkbillline/list',
        updateURL: '/inv/checkbill/save',
        getDataListIsPage: false
      },
      visible: false,
      btnDisable: false,
      dataForm: {
        id:'',
        orderNum:'',
        topic:'',
        warehouseId:'',
        checkDate:'',
        pic:'',
        status:'',
        wfStatus:'',
        wfOpinion:'',
        remark:'',
        companyId:'',
        deletedFlag:'',
        createBy:'',
        createDate:'',
        updateBy:'',
        updateDate:'',
      },
      dataRule: {
        id:[
            { required: true, message: "id不能为空", trigger: "blur" }
        ],
        orderNum:[
            { required: true, message: "盘点单号不能为空", trigger: "blur" }
        ],
        topic:[
            { required: true, message: "盘点主题不能为空", trigger: "blur" }
        ],
        warehouseId:[
            { required: true, message: "盘点仓id不能为空", trigger: "blur" }
        ],
        checkDate:[
            { required: true, message: "盘点日期不能为空", trigger: "blur" }
        ],
        pic:[
            { required: true, message: "负责人不能为空", trigger: "blur" }
        ],
        status:[
            { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        wfStatus:[
            { required: true, message: "审批状态不能为空", trigger: "blur" }
        ],
        wfOpinion:[
            { required: true, message: "审批意见不能为空", trigger: "blur" }
        ],
        remark:[
            { required: true, message: "备注不能为空", trigger: "blur" }
        ],
        companyId:[
            { required: true, message: "公司不能为空", trigger: "blur" }
        ],
        deletedFlag:[
            { required: true, message: "删除标记不能为空", trigger: "blur" }
        ],
        createBy:[
            { required: true, message: "创建人不能为空", trigger: "blur" }
        ],
        createDate:[
            { required: true, message: "创建日期不能为空", trigger: "blur" }
        ],
        updateBy:[
            { required: true, message: "修改人不能为空", trigger: "blur" }
        ],
        updateDate:[
            { required: true, message: "修改日期不能为空", trigger: "blur" }
        ],
      },
      tableColumn: [
        { type: "selection", width: 30, align: "center" },
        { type: "index", width: 30, align: "center" },
          {
          title: 'id',
          field: 'id',
          sortable: true,
          align: 'center',
          editRender: { name: "input" }
        },
            {
          title: '盘点单id',
          field: 'checkBillId',
          sortable: true,
          align: 'center',
          editRender: { name: "input" }
        },
            {
          title: '货位id',
          field: 'warehouseSlotId',
          sortable: true,
          align: 'center',
          editRender: { name: "input" }
        },
            {
          title: '商品id',
          field: 'productId',
          sortable: true,
          align: 'center',
          editRender: { name: "input" }
        },
            {
          title: '单位',
          field: 'uom',
          sortable: true,
          align: 'center',
          editRender: { name: "input" }
        },
            {
          title: '帐面数量',
          field: 'quantityOld',
          sortable: true,
          align: 'center',
          editRender: { name: "input" }
        },
            {
          title: '盘点数量',
          field: 'quantityNew',
          sortable: true,
          align: 'center',
          editRender: { name: "input" }
        },
            {
          title: '差异数',
          field: 'orderQty',
          sortable: true,
          align: 'center',
          editRender: { name: "input" }
        },
            {
          title: '差异原因',
          field: 'diffCause',
          sortable: true,
          align: 'center',
          editRender: { name: "input" }
        },
            {
          title: '解决方案',
          field: 'solution',
          sortable: true,
          align: 'center',
          editRender: { name: "input" }
        },
            {
          title: '备注',
          field: 'remark',
          sortable: true,
          align: 'center',
          editRender: { name: "input" }
        },
            {
          title: '删除标记',
          field: 'deletedFlag',
          sortable: true,
          align: 'center',
          editRender: { name: "input" }
        },
            {
          title: '创建人',
          field: 'createBy',
          sortable: true,
          align: 'center',
          editRender: { name: "input" }
        },
            {
          title: '创建日期',
          field: 'createDate',
          sortable: true,
          align: 'center',
          formatter: ['toDateString', 'yyyy-MM-dd'],
	      editRender: { name: "ElDatePicker" }
        },
            {
          title: '修改人',
          field: 'updateBy',
          sortable: true,
          align: 'center',
          editRender: { name: "input" }
        },
            {
          title: '修改日期',
          field: 'updateDate',
          sortable: true,
          align: 'center',
          formatter: ['toDateString', 'yyyy-MM-dd'],
	      editRender: { name: "ElDatePicker" }
        },
        ],
    picAuto: {
      remoteURL:'/common/biz/employee',
      dataList: [],
      timeout: null
    },
    statusSel: {
      remoteURL:'/common/code/status',
      loading: false,
      dataList: [],
      timeout: null
    },
      toolbar: {
        id: "full_edit_1",
        buttons: [
            { code: "insert_actived", name: "新增" },
            { code: "remove_selection", name: "删除" }
        ],
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
      queryPic: function (query, cb) {
      if(query) {
        this.$axios.post (
          this.picAuto.remoteURL,
          {query: query}
        ).then(res => {
          this.picAuto.dataList = [];
          for(let i=0;i<res.length;i++){
            this.picAuto.dataList.push(res[i])
          }
          cb(this.picAuto.dataList);
        });
      }
    },
    handlePicSelect: function () {

    },
        selStatus: function () {
      this.statusSel.loading = true;
      this.$axios.post (
        this.statusSel.remoteURL,
        {}
      ).then(res => {
        this.statusSel.loading = false;
        if (res && res.length > 0) {
          for (let i = 0; i < res.length; i++) {
            this.statusSel.dataList.push(res[i])
          }
        } else
          this.statusSel.dataList = [];
      })
    },
    },
  mounted () {
  this.selStatus();
  }
};
</script>
