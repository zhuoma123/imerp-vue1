<template>
	<d2-container>
		<el-collapse slot="header">
      <dynamic-form
        v-model="dataForm"
        :formprops="formprops"
        ref="dataForm"
        col-span='6,6,6,*'
        :alldescriptors="descriptors">
        <template slot="btnsearch">
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
        </template>
      </dynamic-form>
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
				           v-if="$hasPermission('inv:onhand:export')" @click="$refs.pGrid.exportCsv()"> 导出
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
  name: 'inv-onhand',
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/inv/onhand/list',
        getDataListIsPage: true,
        exportURL: '/inv/onhand/export'
      },
      dataForm: {
        productCode: null,
        warehouseId: null,
        warehouseCode: null
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
        btnSearch: {
          type: 'slot',
          name: 'btnsearch'
        }
      },
      tableColumn: [
        { type: 'index', width: 30, align: 'center' },
        {
          title: '物料编码',
          field: 'productCode',
          sortable: true,
          align: 'center'
        },
        {
          title: '仓库',
          field: 'warehouseCode',
          sortable: true,
          align: 'center'
        },
        {
          title: '单位',
          field: 'uom',
          sortable: true,
          align: 'center'
        },
        {
          title: '库存现有量',
          field: 'inventoryQuantity',
          sortable: true,
          align: 'center'
        },
        {
          title: '成本价',
          field: 'price',
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
  components: {},
  methods: {
    handleFormReset () {
      this.$refs.dataForm.resetFields()
    }
  },
  mounted () {
  }
}
</script>
