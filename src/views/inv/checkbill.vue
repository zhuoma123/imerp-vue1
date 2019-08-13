<template>
  <d2-container >
    <el-collapse slot="header">
      <el-collapse-item>
        <template slot="title">
          查询条件<i class="el-icon-d-arrow-right" />
        </template>
        <el-form size="mini" :inline="true" :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()"
                 label-width="90px" label-suffix="：" >
                <el-form-item label="id" prop="id">
                    <el-input v-model="dataForm.id" clearable ></el-input>
                </el-form-item>
                <el-form-item label="盘点单号" prop="orderNum">
                    <el-input v-model="dataForm.orderNum" clearable ></el-input>
                </el-form-item>
                <el-form-item label="盘点主题" prop="topic">
                    <el-input v-model="dataForm.topic" clearable ></el-input>
                </el-form-item>
                <el-form-item label="盘点仓id" prop="warehouseId">
                    <el-input v-model="dataForm.warehouseId" clearable ></el-input>
                </el-form-item>
                <el-form-item label="盘点日期" prop="checkDate">
                  <el-date-picker
            v-model="dataForm.checkDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions">
          </el-date-picker>
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
                <el-form-item label="删除标记" prop="deletedFlag">
                    <el-input v-model="dataForm.deletedFlag" clearable ></el-input>
                </el-form-item>
                <el-form-item label="创建人" prop="createBy">
                    <el-input v-model="dataForm.createBy" clearable ></el-input>
                </el-form-item>
                <el-form-item label="创建日期" prop="createDate">
                  <el-date-picker
            v-model="dataForm.createDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions">
          </el-date-picker>
                </el-form-item>
                <el-form-item label="修改人" prop="updateBy">
                    <el-input v-model="dataForm.updateBy" clearable ></el-input>
                </el-form-item>
                <el-form-item label="修改日期" prop="updateDate">
                  <el-date-picker
            v-model="dataForm.updateDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions">
          </el-date-picker>
                </el-form-item>
                <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search" >{{ $t('views.public.query') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleFormReset"> <d2-icon name="refresh"/> 重置 </el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>

    <vxe-grid
      border
      resizable
      highlight-current-row
      remote-filter
      size="mini"
      ref="pGrid"
      row-id="id"
      :toolbar="toolbar"
      :proxy-config="tableProxy"
      :columns="tableColumn"
      :select-config="{reserve: true}"
      :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
      @cell-dblclick="cellDblClick">
      <template v-slot:buttons>
        <vxe-button @click="search">刷新</vxe-button>
        <vxe-button v-if="$hasPermission('inv:checkbill:save')" @click="addHandle()">新增</vxe-button>
        <vxe-button v-if="$hasPermission('inv:checkbill:save')" @click="updateHandle($refs.pGrid)">修改</vxe-button>
        <vxe-button v-if="$hasPermission('inv:checkbill:delete')" @click="deleteHandle($refs.pGrid)">删除</vxe-button>
        <vxe-button v-if="$hasPermission('inv:checkbill:save')" >提交</vxe-button>
        <vxe-button v-if="$hasPermission('inv:checkbill:print')" >打印</vxe-button>
        <vxe-button v-if="$hasPermission('inv:checkbill:export')" @click="$refs.pGrid.exportCsv()">导出.csv</vxe-button>
      </template>
    </vxe-grid>

    <!-- 分页 -->
    <el-pagination
      slot="footer"
      :current-page="page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="limit"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="val => pageSizeChangeHandle(val, 'vxe')"
      @current-change="val => pageCurrentChangeHandle(val, 'vxe')"
    ></el-pagination>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </d2-container>
</template>

<script>
import AddOrUpdate from './checkbill-add-or-update'
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/inv/checkbill/list',
        getDataListIsPage: true,
        updateURL: '/inv/checkbill/update',
        deleteURL: '/inv/checkbill/delete',
        deleteIsBatch: true,
        exportURL: '/inv/checkbill/export'
      },
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
      tableColumn: [
        { type: 'selection', width: 30, align: 'center' },
        { type: 'index', width: 30, align: 'center' },
                      {
          title: 'id',
          field: 'id',
          sortable: true,
          align: 'center'
        },
                              {
          title: '盘点单号',
          field: 'orderNum',
          sortable: true,
          align: 'center'
        },
                              {
          title: '盘点主题',
          field: 'topic',
          sortable: true,
          align: 'center'
        },
                              {
          title: '盘点仓id',
          field: 'warehouseId',
          sortable: true,
          align: 'center'
        },
                              {
          title: '盘点日期',
          field: 'checkDate',
          sortable: true,
          align: 'center',
          formatter: ['toDateString', 'yyyy-MM-dd']
        },
                              {
          title: '负责人',
          field: 'pic',
          sortable: true,
          align: 'center'
        },
                              {
          title: '状态',
          field: 'status',
          sortable: true,
          align: 'center'
        },
                              {
          title: '审批状态',
          field: 'wfStatus',
          sortable: true,
          align: 'center'
        },
                              {
          title: '审批意见',
          field: 'wfOpinion',
          sortable: true,
          align: 'center'
        },
                              {
          title: '备注',
          field: 'remark',
          sortable: true,
          align: 'center'
        },
                              {
          title: '公司',
          field: 'companyId',
          sortable: true,
          align: 'center'
        },
                              {
          title: '删除标记',
          field: 'deletedFlag',
          sortable: true,
          align: 'center'
        },
                              {
          title: '创建人',
          field: 'createBy',
          sortable: true,
          align: 'center'
        },
                              {
          title: '创建日期',
          field: 'createDate',
          sortable: true,
          align: 'center',
          formatter: ['toDateString', 'yyyy-MM-dd']
        },
                              {
          title: '修改人',
          field: 'updateBy',
          sortable: true,
          align: 'center'
        },
                              {
          title: '修改日期',
          field: 'updateDate',
          sortable: true,
          align: 'center',
          formatter: ['toDateString', 'yyyy-MM-dd']
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
        id: 'full_edit_1',
        resizable: {
          storage: true
        },
        setting: {
          storage: true
        }
      }
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
      queryPic: function (query, cb) {
      if(query) {
        this.$axios.post (
          this.picAuto.remoteURL,
          {query: query}
        ).then(res => {
          this.picAuto.dataList = [];
          for(var i=0;i<res.length;i++){
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
          for (var i = 0; i < res.length; i++) {
            this.statusSel.dataList.push(res[i])
          }
        } else
          this.statusSel.dataList = [];
      })
    },
      handleFormReset () {
      this.$refs.dataForm.resetFields()
    }
  },
  mounted () {
    this.selStatus();
  }
}
</script>
