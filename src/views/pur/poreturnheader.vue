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
					col-span='6,6,6,*'
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
			:edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
			@cell-dblclick="cellDblClick"
			@current-change='currentChange'>
			<template v-slot:buttons>
				<el-button ref="btnStatusAdd" enablestatus='NEW,SENDED,COMPLETED' size="mini" icon="el-icon-circle-plus"
				           v-if="$hasPermission('pur:poreturnheader:save')" @click="addHandle">新增
				</el-button>
				<el-button ref="btnStatusEdit"
				           enablestatus='NEW'
				           row-dbclick
				           form-readonly type="primary" size="mini" icon="el-icon-edit"
				           v-if="$hasPermission('pur:poreturnheader:save')"
				           @click="e => cellDblClick({row: $refs.pGrid.getCurrentRow()}, e)">修改
				</el-button>
				<el-button ref="btnStatusDelete"
				           enablestatus='NEW' type="danger" size="mini" icon="el-icon-delete"
				           v-if="$hasPermission('pur:poreturnheader:delete')" @click="deleteEntityHandle($refs.pGrid)">删除
				</el-button>
				<el-button ref="btnStatusAutoPick"
				           enablestatus='NEW' type="success" size="mini" icon="el-icon-check"
				           v-if="$hasPermission('pur:poreturnheader:submit')" @click="submitHandle($refs.pGrid,true)">自动入库
				</el-button>
        <el-button ref="btnStatusPick"
                   enablestatus='NEW' type="success" size="mini" icon="el-icon-check"
                   v-if="$hasPermission('pur:poreturnheader:submit')" @click="submitHandle($refs.pGrid,false)">人工入库
        </el-button>
				<el-button ref="btnStatusRollback"
				           enablestatus='SENDED' type="warning" size="mini" icon="fa fa-undo"
				           v-if="$hasPermission('pur:poheader:rollback')" @click="rollbackHandle($refs.pGrid)">撤回
				</el-button>
				<el-button type="info" size="mini" icon="el-icon-printer" v-if="$hasPermission('pur:poreturnheader:print')">打印
				</el-button>
				<el-button type="info" size="mini" icon="fa fa-file-excel-o" v-if="$hasPermission('pur:poreturnheader:export')"
				           @click="$refs.pGrid.exportCsv()"> 导出
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

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="search"></add-or-update>
	</d2-container>
</template>

<script>
import AddOrUpdate from './poreturnheader-add-or-update'
import mixinViewModule from '@/mixins/view-module'
const separate = { type: 'separate' }
export default {
  name: 'pur-poreturnheader',
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/pur/poheader/list',
        getDataListIsPage: true,
        updateURL: '/pur/poheader/save',
        submitURL: '/pur/poheader/submit',
        rollbackURL: '/pur/poheader/rollback',
        exportURL: '/pur/poheader/export'
      },
      order: 'desc',
      orderField: 'id',
      dataForm: {
        orderType: 'PO_RETURN',
        orderNum: '',
        vendorId: '',
        warehouseId: '',
        vendorName: '',
        status: ''
      },
      descriptors: {
        orderNum: {
          type: 'string',
          label: '采购退货单号',
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
        status: {
          type: 'cust',
          label: '单据状态',
          placeholder: '请选择状态',
          name: 'im-selector',
          props: {
            mapKeyVal: 'status',
            dataType: 'code.status',
            clearable: true
          }
        },
        separate1: separate,
        warehouseId: {
          type: 'cust',
          label: '仓库',
          name: 'im-selector',
          props: {
            mapKeyVal: 'warehouseCode:warehouseId',
            dataType: 'biz.warehouse',
            clearable: true
          }
        },
        orderDate: {
          type: 'cust',
          label: '采购退货日期',
          colspan: 2,
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
        /* begingCheckDate: {
						name: 'el-date-picker',
						type: 'cust', label: '盘点日期从',
						props: {
							type:'date',
						}
					},
					endCheckDate: {
						name: 'el-date-picker',
						type: 'cust', label: '至',
						props: {
							type:'date'
						}
					}, */
        btnSearch: {
          type: 'slot',
          name: 'btnsearch'
        }
      },
      tableColumn: [
        { type: 'index', width: 30, align: 'center' },
        {
          title: '采购退货单号',
          field: 'orderNum',
          sortable: true,
          align: 'center'
        },
        {
          title: '供应商',
          field: 'vendorName',
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
          title: '采购退货日期',
          field: 'orderDate',
          sortable: true,
          align: 'center',
          formatter: ['toDateString', 'yyyy-MM-dd']
        },
        {
          title: '负责人',
          field: 'agentName',
          sortable: true,
          align: 'center'
        },
        {
          title: '计划退回日期',
          field: 'planDeliveryDate',
          sortable: true,
          align: 'center',
          formatter: ['toDateString', 'yyyy-MM-dd']
        },
        {
          title: '状态',
          field: 'statusMean',
          sortable: true,
          align: 'center'
        },
        {
          title: '采购退货总金额',
          field: 'orderAmount',
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
  components: {
    AddOrUpdate
  },
  methods: {
    reset () {
      this.$refs.dataForm.resetFields()
    }
  },
  mounted () {
  }
}
</script>
