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
      <dynamic-form
        v-model="dataForm"
        :formprops="formprops"
        ref="dataForm"
        col-span='8,8,8'
        :read-only='formReadOnly'
        :alldescriptors="descriptors">
      </dynamic-form>
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
	    :edit-rules="validRules"
	    :columns="tableColumn"
	    :select-config="{reserve: true}"
	    :mouse-config="{selected: true}"
	    :keyboard-config="{isArrow: true, isDel: true, isTab: true, isEdit: true}"
	    :edit-config="{trigger: 'dblclick', mode: 'cell'}"
	    :footer-cell-class-name="footerCellClassName"
	    :footer-method="footerMethod"
	    show-footer
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
      <el-button type="danger"  @click="visible = false">取消</el-button>
      <el-button type="primary" v-show="enableSubmit" :disabled="btnDisable" @click="dataFormSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import XEUtils from 'xe-utils'
const separate = { type: 'separate' }
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
        remark: '',
        warehouseCode: '',
        picName: ''
      },
      descriptors: {
        orderNum: { type: 'string',
          label: '盘点单号',
          disabled: 'disabled',
          props: {
            clearable: true
          }
        },
        warehouseId: { type: 'cust',
          label: '仓库',
          ruletype: 'integer',
          required: true,
          message: '仓库不能为空',
          ruletype: 'integer',
          name: 'im-selector',
          props: {
            mapKeyVal: 'warehouseCode:warehouseId',
            dataType: 'biz.warehouse',
            clearable: true
          }
        },
        pic: { type: 'cust',
          label: '负责人',
          required: true,
          name: 'im-selector',
          props: {
            mapKeyVal: 'picName:pic',
            dataType: 'biz.employee',
            clearable: true
          }
        },
        separate1: separate,
        remark: { type: 'string', label: '备注', colspan: 3 }
      },
      tableProxy: {
        autoLoad: false
      },
	    validRules: {
		    productCode: [
			    { required: true, message: '物料必填' }
		    ],
		    quantityNew: [
			    { required: true, message: '盘点数量必填'},
			    { type:"number",message: '请输入数字'}
		    ]
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
            props: { fetchSuggestions: this.prodSeach, triggerOnFocus: false, popperClass:'prod-popper' },
            events: { select: this.handleProcSelect }
          },
          footerRender: function (column, data) {
            return '汇总'
          }
        },
        {
          title: '单位',
          field: 'uom',
          sortable: true,
          align: 'center'
        },
        {
          title: '盘点数量',
          field: 'quantityNew',
          sortable: true,
          align: 'center',
          editRender: { name: 'input', autoselect: true },
          footerRender: function (column, data) {
            return XEUtils.sum(data, column.property)
          }
        },
        {
          title: '帐面数量',
          field: 'quantityOld',
          sortable: true,
          align: 'center',
          footerRender: function (column, data) {
            return XEUtils.sum(data, column.property)
          }
        },
        {
          title: '差异数',
          field: 'orderQty',
          sortable: true,
          align: 'center',
          editPost: function (column, row) {
            var quantityNew = row.quantityNew
            var quantityOld = row.quantityOld
            if (!Number.isNaN(quantityNew)) {
              return quantityNew - Number(quantityOld)
            }
          },
          footerRender: function (column, data) {
            return XEUtils.sum(data, column.property)
          }
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
      debugger
      if (item) {
        Object.assign(row, item)
        row.quantityOld = item.stock
        row.uom = item.unit
        row.productId = item.id
        row.productCode = item.code
      } else {
      }
    },
    initCB () {
      this.$nextTick(() => {
        if (this.isNew) {
          this.$refs.dataForm.readOnly(false)
        } else {
          if (this.entityModel.status == 'NEW') {
            this.$refs.dataForm.readOnly(false)
          } else {
            this.$refs.dataForm.readOnly(true)
          }
        }
      })
    }
  },
  mounted () {}
}
</script>
