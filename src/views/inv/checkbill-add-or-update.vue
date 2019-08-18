<template>
  <el-dialog
    :title="isNew ? '盘点单新增' : '盘点单修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    v-loading.fullscreen.lock="fullscreenLoading"
    class="abow_dialog"
    width="80%"
  >
    <div>
      <el-form
        :model="dataForm"
        labelSuffix="："
        size="mini"
        :rules="dataRule"
        ref="dataForm"
        label-width="120px"
        style="padding-right: 40px"
      >
        <el-row inline>
          <el-col :span="8">
            <el-form-item label="盘点单号" prop="orderNum">
              <el-input disabled="disabled" v-model="dataForm.orderNum" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库" prop="warehouseId">
              <el-select
                v-model="dataForm.warehouseId"
                :loading="warehouseSel.loading"
                :remote-method="selWarehouse"
                filterable
                remote
                default-first-option
                placeholder="请选择"
              >
                <el-option
                  v-for="item in warehouseSel.dataList"
                  :key="item.key"
                  :label="item.key"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="负责人" prop="pic">
              <el-select
                v-model="dataForm.pic"
                :loading="picSel.loading"
                :remote-method="selPic"
                filterable
                remote
                default-first-option
                style="width:270px"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in picSel.dataList"
                  :key="item.key"
                  :label="item.key"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" clearable></el-input>
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
      @edit-closed="jsCy"
      :footer-method="footerMethod"
      show-footer
      :keyboard-config="{isArrow: true, isDel: true, isTab: true, isEdit: true}"
      :edit-config="{trigger: 'dblclick', mode: 'cell',showStatus: true}"
    >
      <template v-slot:buttons>
        <el-button
          size="mini"
          icon="el-icon-circle-plus"
          @click="$refs.sGrid.commitProxy('insert_actived')"
        >新增</el-button>
        <el-button
          type="danger"
          size="mini"
          icon="el-icon-delete"
          @click="removeSelecteds($refs.sGrid)"
        >删除</el-button>
      </template>
    </vxe-grid>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="btnDisable" @click="dataFormSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import XEUtils from 'xe-utils'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/inv/checkbillline/list',
        updateURL: '/inv/checkbill/save',
        prodURL: '/base/product/search',
        getDataListIsPage: false,
        activatedIsNeed: false
      },
      visible: false,
      btnDisable: false,
      dataForm: {
        warehouseId: '',
        pic: '',
        remark: '111'
      },
      dataRule: {
        warehouseId: [
          { required: true, message: '仓库不能为空', trigger: 'blur' }
        ],
        pic: [{ required: true, message: '负责人不能为空', trigger: 'blur' }]
      },
      tableProxy: {
        autoLoad: false
      },
      tableColumn: [
        { type: 'selection', width: 30, align: 'center' },
        { type: 'index', width: 30, align: 'center' },
        {
          title: '商品',
          field: 'productCode',
          sortable: true,
          align: 'center',
          editRender: {
            name: 'ElAutocomplete',
            props: { fetchSuggestions: this.prodSeach, triggerOnFocus: false },
            events: { select: this.handleProcSelect }
          }
        },
        {
          title: '单位',
          field: 'uom',
          sortable: true,
          align: 'center'
        },
        {
          title: '帐面数量',
          field: 'quantityOld',
          sortable: true,
          align: 'center'
        },
        {
          title: '盘点数量',
          field: 'quantityNew',
          sortable: true,
          align: 'center',
          editRender: { name: 'input', autoselect: true }
        },
        {
          title: '差异数',
          field: 'orderQty',
          sortable: true,
          align: 'center'
        },
        {
          title: '差异原因',
          field: 'diffCause',
          sortable: true,
          align: 'center',
          editRender: { name: 'input', autoselect: true }
        },
        {
          title: '备注',
          field: 'remark',
          sortable: true,
          align: 'center',
          editRender: { name: 'input', autoselect: true }
        }
      ],
      picSel: {
        remoteURL: '/common/biz/employee',
        loading: false,
        dataList: [],
        timeout: null
      },
      warehouseSel: {
        remoteURL: '/common/biz/warehouse',
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
  methods: {
    selPic: function (query) {
      this.picSel.loading = true
      this.$axios.post(this.picSel.remoteURL, { query: query }).then(res => {
        this.picSel.loading = false
        if (res && res.length > 0) {
          this.picSel.dataList = []
          for (var i = 0; i < res.length; i++) {
            this.picSel.dataList.push(res[i])
          }
        } else this.picSel.dataList = []
      })
    },
    selWarehouse: function (query) {
      this.warehouseSel.loading = true
      this.$axios
        .post(this.warehouseSel.remoteURL, { query: query })
        .then(res => {
          this.warehouseSel.loading = false
          if (res && res.length > 0) {
            this.warehouseSel.dataList = []
            for (var i = 0; i < res.length; i++) {
              this.warehouseSel.dataList.push(res[i])
            }
          } else this.warehouseSel.dataList = []
        })
    },
    jsCy: function ({ column, row }) {
      if (column.property === 'quantityNew') {
        var quantityNew = row.quantityNew
        var quantityOld = row.quantityOld
        if (!Number.isNaN(quantityNew)) {
          row.orderQty = Number(quantityOld) - quantityNew
        }
      }
      this.$refs.sGrid.updateFooter()
    },
    footerMethod ({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 2) {
            return '汇总'
          }
          if (['quantityOld'].includes(column.property)) {
            return XEUtils.sum(data, column.property)
          }
          if (['quantityNew'].includes(column.property)) {
            return XEUtils.sum(data, column.property)
          }
          if (['orderQty'].includes(column.property)) {
            return XEUtils.sum(data, column.property)
          }
          return null
        })
      ]
    },
    delsGrid: function () {
      this.$refs.sGrid.removeSelecteds().then(() => {
        this.$refs.sGrid.updateFooter()
      })
    },
    prodSeach (queryString, cb) {
      if (queryString) {
        this.$axios
          .post(this.mixinViewModuleOptions.prodURL, { name: queryString })
          .then(res => {
            for (var i = 0; i < res.length; i++) {
              res[i].value = res[i].val
            }
            clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
              cb(res)
            }, 100 * Math.random())
          })
      }
    },
    handleProcSelect (t, item) {
      var row = t.row
      if (item) {
        Object.assign(row, item)
        row.quantityOld = item.stock
        row.uom = item.UNIT
        row.productId = item.ID
        row.productCode = item.CODE
      } else {
      }
    }
  },
  mounted () {}
}
</script>
