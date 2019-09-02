<template>
	<d2-container>
		<el-collapse slot="header">
			<el-collapse-item>
				<template slot="title">
					查询条件<i class="el-icon-d-arrow-right"/>
				</template>
				<dynamic-form
					v-model="dataForm"
					:formprops="formprops"
					ref="dataForm"
					col-span='6,6,5,7'
					:alldescriptors="descriptors">
					<template slot="btnsearch">
						<el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
						<el-button icon="el-icon-refresh" @click="reset">重置</el-button>
					</template>
				</dynamic-form>
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
			:edit-config="{trigger: 'click', mode: 'row', showStatus: true}">
			<template v-slot:buttons>
				<el-button type="info" size="mini" icon="fa fa-file-excel-o"
				           v-if="$hasPermission('inv:transactions:export')" @click="$refs.pGrid.exportCsv()"> 导出
				</el-button>
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
	</d2-container>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'

export default {
  name: 'inv-transactions',
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/inv/transactions/list',
        getDataListIsPage: true,
        exportURL: '/inv/transactions/export'
      },
      dataForm: {
        warehouseId: null,
        productCode: null,
        transactionDate: [new Date(), new Date()],
        sourceCode: null,
        transactionReference: null,
        tranType: null
      },
      tableProxy: {
        autoLoad: false
      },
      descriptors: {
        warehouseId: {
          type: 'cust',
          label: '仓库',
          ruletype: 'integer',
          name: 'im-selector',
          props: {
            mapKeyVal: 'warehouseCode:warehouseId',
            dataType: 'biz.warehouse',
            clearable: true
          }
        },
        productCode: {
          type: 'string',
          label: '物料编码'
        },
        transactionDate: {
          type: 'cust',
          label: '事物日期',
          colspan: 2,
          ruletype: 'date',
          name: 'el-date-picker',
          props: {
            type: 'daterange',
            rangeSeparator: '至',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'yyyy-MM-dd',
            class: 'input-class'
          }
        },
        separate1: this.$g.separate,
        sourceCode: {
          type: 'string',
          label: '来源单据'
        },
        transactionReference: {
          type: 'string',
          label: '业务单据'
        },
        tranType: {
          type: 'cust',
          label: '事物类型',
          placeholder: '请选择事物类型',
          name: 'im-selector',
          props: {
            mapKeyVal: 'tranType',
            dataType: 'code.tran_type',
            clearable: true
          }
        },
        btnSearch: {
          type: 'slot',
          name: 'btnsearch'
        }
      },
      tableColumn: [
        { type: 'index', width: 30, align: 'center' },
        {
          title: '仓库',
          field: 'warehouseCode',
          sortable: true,
          align: 'center'
        },
        {
          title: '物料编码',
          field: 'productCode',
          sortable: true,
          align: 'center'
        },
        {
          title: '事物数量',
          field: 'transactionQuantity',
          sortable: true,
          align: 'center'
        },
        {
          title: '事务日期',
          field: 'transactionDate',
          sortable: true,
          align: 'center',
          formatter: ['toDateString', 'yyyy-MM-dd']
        },
        {
          title: '事物类型',
          field: 'tranTypeMean',
          sortable: true,
          align: 'center'
        },
        {
          title: '前期数量',
          field: 'priorQuantity',
          sortable: true,
          align: 'center'
        },
        {
          title: '结余数量',
          field: 'balanceQuantity',
          sortable: true,
          align: 'center'
        },
        {
          title: '来源单据',
          field: 'sourceCode',
          sortable: true,
          align: 'center'
        },
        {
          title: '业务单据',
          field: 'transactionReference',
          sortable: true,
          align: 'center'
        },
        {
          title: '单位',
          field: 'transactionUom',
          sortable: true,
          align: 'center'
        },
        {
          title: '销售价',
          field: 'salePrice',
          sortable: true,
          align: 'center'
        },
        {
          title: '成本价',
          field: 'costPrice',
          sortable: true,
          align: 'center'
        },
        {
          title: '执行人',
          field: 'employeeName',
          sortable: true,
          align: 'center'
        }
      ],
      toolbar: {
        id: 'full_edit_1',
        refresh: true,
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
  },
  methods: {
    handleFormReset () {
      this.$refs.dataForm.resetFields()
    }
  },
  mounted () {
  }
}
</script>
