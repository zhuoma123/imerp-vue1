<template>
	<el-dialog
		:title="isNew ? '采购退货单新增' : '采购退货单修改'"
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
				<el-button size="mini" icon="el-icon-circle-plus" @click="$refs.sGrid.insert({})">新增</el-button>
				<el-button type="danger" size="mini" icon="el-icon-delete" @click="removeSelecteds($refs.sGrid)">删除</el-button>
			</template>
		</vxe-grid>
		<span slot="footer" class="dialog-footer">
      <el-button type="danger" @click="visible = false">取消</el-button>
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
        getDataListURL: '/pur/poline/list',
        updateURL: '/pur/poheader/save',
        prodURL: '/base/product/search',
        deleteIsBatch: true,
        getDataListIsPage: false
      },
      visible: false,
      btnDisable: false,
      dataForm: {
				  orderType: 'PO_RETURN',
        vendorId: '',
        contactName: '',
        contactPhone: '',
        agentId: '',
        warehouseId: '',
        planDeliveryDate: '',
        remark: ''
      },
      descriptors: {
        orderNum: {
          type: 'string',
          label: '采购退货单号',
          disabled: 'disabled',
          props: {
            clearable: true
          }
        },
        vendorId: {
          type: 'cust',
          label: '供应商',
          ruletype: 'integer',
          name: 'im-selector',
          props: {
            mapKeyVal: 'vendorName:vendorId',
            dataType: 'biz.vendor',
            clearable: true
          }
        },
        agentId: {
          type: 'cust',
          label: '负责人',
          name: 'im-selector',
          props: {
            mapKeyVal: 'agentName:agentId',
            dataType: 'biz.employee',
            clearable: true
          }
        },
        separate1: separate,
        contactName: {
          type: 'string',
          label: '供应商联系人',
          props: {
            clearable: true
          }
        },
        planDeliveryDate: {
          type: 'cust',
          label: '计划退回日期',
          name: 'el-date-picker',
          props: {
            valueFormat: 'yyyy-MM-dd'
          }
        },
        warehouseId: { type: 'cust',
          label: '退货仓库',
          ruletype: 'integer',
          name: 'im-selector',
          props: {
            mapKeyVal: 'warehouseCode:warehouseId',
            dataType: 'biz.warehouse',
            clearable: true
          }
        },
        separate2: separate,
        contactPhone: {
          type: 'string',
          label: '供应商联系电话',
          props: {
            clearable: true
          }
        },
        remark: { type: 'string', label: '备注', colspan: 2 }
      },
      dataRule: {
        vendorId: [
          { required: true, message: '供应商不能为空', trigger: 'blur' }
        ],
        agentId: [
          { required: true, message: '负责人不能为空', trigger: 'blur' }
        ]
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
          title: '退货数',
          field: 'orderQty',
          sortable: true,
          align: 'center',
          editRender: { name: 'input' },
          editPost: function (column, row) {
            var qty = row.orderQty
            if (!Number.isNaN(qty)) {
              return -Math.abs(Number(qty))
            }
          }
        },
        {
          title: '实际退货数',
          field: 'realQty',
          sortable: true,
          align: 'center'
        },
        {
          title: '退货价',
          field: 'costPrice',
          sortable: true,
          align: 'center',
          editRender: { name: 'input' }
        },
        {
          title: '退货总金额',
          field: 'totalPrice',
          align: 'left',
          formatter: ['toFixedString', 2],
          editPost: function (column, row) {
            var qty = row.orderQty
            var costPrice = row.costPrice
            if (!Number.isNaN(qty) && !Number.isNaN(costPrice)) {
              return Number(qty) * Number(costPrice).toFixed(2)
            }
          },
          footerRender: function (column, data) {
            return XEUtils.sum(data, column.property)
          }
        },
        {
          title: '备注',
          field: 'remark',
          sortable: true,
          align: 'center',
          editRender: { name: 'input' }
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
      if (item) {
        Object.assign(row, item)
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
  mounted () {
  }
}
</script>
