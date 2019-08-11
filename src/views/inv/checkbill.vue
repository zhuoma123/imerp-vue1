<template>
  <d2-container >
    <el-form slot="header" size="mini" :inline="true" :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()"
             label-width="90px" label-suffix="：">
                        <el-form-item label="id" prop="id">
            <el-input v-model="dataForm.id" clearable ></el-input>
          </el-form-item>
                                <el-form-item label="盘点单号" prop="盘点单号">
            <el-input v-model="dataForm.orderNum" clearable ></el-input>
          </el-form-item>
                                <el-form-item label="盘点主题" prop="盘点主题">
            <el-input v-model="dataForm.topic" clearable ></el-input>
          </el-form-item>
                                <el-form-item label="盘点仓id" prop="盘点仓id">
            <el-input v-model="dataForm.warehouseId" clearable ></el-input>
          </el-form-item>
                                <el-form-item label="盘点日期">
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
                                <el-form-item label="负责人" >
            <el-autocomplete
              class="inline-input"
              v-model="dataForm.pic"
              value-key="key"
              :fetch-suggestions="queryPic"
              placeholder="请输入"
              :trigger-on-focus="false"
              @select="handlePicSelect"
            ></el-autocomplete>
          </el-form-item>
           <el-form-item label="状态" >
             <el-select
              v-model="dataForm.status"
              filterable
              remote
              reserve-keyword
              placeholder="请输入"
              no-data-text="无匹配数据"
              :remote-method="remoteStatus"
              :loading="StatusSel.loading">
              <el-option
                v-for="item in StatusSel.dataList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
                    </el-form-item>
                                <el-form-item label="审批状态" >
                      <el-select v-model="dataForm.wfStatus" placeholder="请选择审批状态">
                              <el-option label="草稿" value="1"></el-option>
                              <el-option label="审核" value="2"></el-option>
                              <el-option label="通过" value="3"></el-option>
                          </el-select>
                    </el-form-item>
                                <el-form-item label="审批意见" prop="审批意见">
            <el-input v-model="dataForm.wfOpinion" clearable ></el-input>
          </el-form-item>
                                <el-form-item label="备注" prop="备注">
            <el-input v-model="dataForm.remark" clearable ></el-input>
          </el-form-item>
                                <el-form-item label="公司" prop="公司">
            <el-input v-model="dataForm.companyId" clearable ></el-input>
          </el-form-item>
                                <el-form-item label="删除标记" prop="删除标记">
            <el-input v-model="dataForm.deletedFlag" clearable ></el-input>
          </el-form-item>
                                <el-form-item label="创建人" prop="创建人">
            <el-input v-model="dataForm.createBy" clearable ></el-input>
          </el-form-item>
                                <el-form-item label="创建日期">
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
                                <el-form-item label="修改人" prop="修改人">
            <el-input v-model="dataForm.updateBy" clearable ></el-input>
          </el-form-item>
                                <el-form-item label="修改日期">
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
        <el-button @click="handleFormReset">
          <d2-icon name="refresh"/>重置
        </el-button>
      </el-form-item>
    </el-form>
    <vxe-grid
      border
      resizable
      highlight-current-row
      remote-filter
      size="mini"
      ref="xGrid"
      row-id="id"
      :toolbar="toolbar"
      :proxy-config="tableProxy"
      :columns="tableColumn"
      :select-config="{reserve: true}"
      :edit-config="{trigger: 'click', mode: 'row', showStatus: true}">
      <template v-slot:buttons>
        <vxe-button @click="$refs.xGrid.commitProxy('reload')">刷新</vxe-button>
        <vxe-button v-if="$hasPermission('inv:checkbill:save')"   @click="addOrUpdateHandle()">新增</vxe-button>
        <vxe-button v-if="$hasPermission('inv:checkbill:delete')" @click="deleteHandle()">删除</vxe-button>
        <vxe-button v-if="$hasPermission('inv:checkbill:save')"   @click="deleteHandle()">提交</vxe-button>
        <vxe-button v-if="$hasPermission('inv:checkbill:print')"  @click="deleteHandle()">打印</vxe-button>
        <vxe-button v-if="$hasPermission('inv:checkbill:export')" @click="$refs.xGrid.exportCsv()">导出.csv</vxe-button>
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
      @size-change="pageSizeChangeHandle"
      @current-change="pageCurrentChangeHandle"
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
        key: ''
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
          field: 'statusMean',
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
          field: 'companyName',
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
        }
      ],
      tableProxy: {
        index: true, // 启用动态序号代理
        sort: true, // 启用排序代理
        filter: true, // 启用筛选代理
        ajax: {
          query: ({ page, sort, filters }) => {
            // 处理排序条件
            let formData = {
              sort: sort.property,
              order: sort.order
            }
            // 处理筛选条件
            filters.forEach(({ column, property, values }) => {
              formData[property] = values.join(',')
            })
            return new Promise(async (resolve, reject) => {
              await this.$axios.post(
                this.mixinViewModuleOptions.getDataListURL,
                {
                  pageForm: {
                    order: this.order,
                    orderField: this.orderField,
                    page: this.mixinViewModuleOptions.getDataListIsPage ? this.page : null,
                    limit: this.mixinViewModuleOptions.getDataListIsPage ? this.limit : null
                  },
                  dataForm: {
                    data: this.dataForm,
                    op: this.dataFormOp
                  }
                }
              ).then(res => {
                this.total = res.totalCount
                this.dataList = res.list
              })
              resolve({
                total: this.total,
                list: this.dataList
              })
            })
          },
          save: ({ body }) => { console.log(body) }
        },
        props: {
          list: 'list',
          result: 'list',
          total: 'totalCount'
        }
      },
      PicAuto: {
        remoteURL: '/common/employee',
        dataList: [],
        timeout: null
      },
      StatusSel: {
        remoteURL: '/inv/checkbill/remoteStatus',
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
      if (query) {
        this.$axios.post(
          this.PicAuto.remoteURL,
          { query: query }
        ).then(res => {
          this.PicAuto.dataList = []
          for (var i = 0; i < res.length; i++) {
            this.PicAuto.dataList.push(res[i])
          }
          clearTimeout(this.PicAuto.timeout)
          this.PicAuto.timeout = setTimeout(() => {
            cb(this.PicAuto.dataList)
          }, 100 * Math.random())
        })
      }
    },
    handlePicSelect: function () {

    },
    remoteStatus: function (query) {
      if (query) {
        this.StatusSel.loading = true
        this.$axios.post(
          this.StatusSel.remoteURL,
          { query: query }
        ).then(res => {
          this.StatusSel.loading = false
          if (res && res.length > 0) {
            for (var i = 0; i < res.length; i++) {
              this.StatusSel.dataList.push(res[i])
            }
          } else { this.StatusSel.dataList = [] }
        })
      }
    },
    handleFormReset () {
      this.$refs.dataForm.resetFields()
    }
  },
  activated () {
    this.getDataList()
  }
}
</script>
