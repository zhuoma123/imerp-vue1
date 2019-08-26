<template>
	<d2-container>
		<el-collapse slot="header" @change="collapseChange">
			<el-collapse-item>
				<template slot="title">
					查询条件
					<i class="el-icon-d-arrow-right"/>
				</template>
				<dynamic-form
					v-model="dataForm"
					:formprops="formprops"
					ref="dynamic-form"
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
				<el-button
					ref="btnStatusAdd"
					size="mini"
					icon="el-icon-circle-plus"
					enablestatus='NEW,COMPLETED'
					v-if="$hasPermission('inv:checkbill:save')"
					@click="addHandle"
				>新增
				</el-button>
				<el-button
					ref="btnStatusEdit"
					enablestatus='NEW'
					row-dbclick
					form-readonly
					type="primary"
					size="mini"
					icon="el-icon-edit"
					v-if="$hasPermission('inv:checkbill:save')"
					@click="e => cellDblClick({row: $refs.pGrid.getCurrentRow()}, e)"
				>修改
				</el-button>
				<el-button
					ref="btnStatusDelete"
					enablestatus='NEW'
					type="danger"
					size="mini"
					icon="el-icon-delete"
					v-if="$hasPermission('inv:checkbill:delete')"
					@click="deleteHandle($refs.pGrid)"
				>删除
				</el-button>
				
				<el-button
					ref="btnStatusSubmit"
					enablestatus='NEW'
					type="success"
					size="mini"
					icon="el-icon-check"
					v-if="$hasPermission('inv:checkbill:submit')"
					@click="submitHandle($refs.pGrid,true)"
				>提交
				</el-button>
				<el-button
					type="info"
					size="mini"
					icon="el-icon-printer"
					v-if="$hasPermission('inv:checkbill:print')"
				>打印
				</el-button>
				<el-button
					type="info"
					size="mini"
					icon="fa fa-file-excel-o"
					v-if="$hasPermission('inv:checkbill:export')"
					@click="$refs.pGrid.exportCsv()"
				>导出
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
	import AddOrUpdate from './checkbill-add-or-update'
	import mixinViewModule from '@/mixins/view-module'

	const separate = {type: 'separate'}
	export default {
		name: 'inv-checkbill',
		mixins: [mixinViewModule],
		data() {
			return {
				mixinViewModuleOptions: {
					getDataListURL: '/inv/checkbill/list',
					getDataListIsPage: true,
					updateURL: '/inv/checkbill/update',
					deleteURL: '/inv/checkbill/delete',
					submitURL: '/inv/checkbill/submit',
					deleteIsBatch: true,
					exportURL: '/inv/checkbill/export'
				},
				order: 'desc',
				orderField: 'id',
				dataForm: {
					orderNum: '',
					warehouseId: '',
					status: ''
				},
				descriptors: {
					orderNum: {
						type: 'string', label: '盘点单号',
						props: {
							clearable: true
						}
					},
					warehouseId: {
						type: 'cust', label: '仓库',
						name: 'im-selector',
						props: {
							mapKeyVal: "warehouseCode:warehouseId",
							dataType: "biz.warehouse",
							clearable: true
						}
					},
					status: {
						type: 'cust', label: '单据状态',
						placeholder: '请选择状态',
						name: 'im-selector',
						props: {
							mapKeyVal: "status",
							dataType: "code.status",
							clearable: true
						}
					},
					separate1: separate,
					checkDate: {
						type: 'cust', label: '盘点日期', colspan: 2,
						name: 'el-date-picker',
						props: {
							type: 'daterange',
							rangeSeparator: "至",
							startPlaceholder: "开始日期",
							endPlaceholder: "结束日期",
							valueFormat: "yyyy-MM-dd",
							class: 'input-class'
						}
					},
					/*begingCheckDate: {
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
					},*/
					btnSearch: {
						type: 'slot',
						name: 'btnsearch'
					},
				},
				tableColumn: [
					{type: 'index', width: 30, align: 'center'},
					{
						title: '盘点单号',
						field: 'orderNum',
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
						title: '仓库',
						field: 'warehouseCode',
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
						field: 'picName',
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
						title: '备注',
						field: 'remark',
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
				warehouseSel: {
					remoteURL: '/common/biz/warehouse',
					loading: false,
					dataList: [],
					timeout: null
				},
				statusSel: {
					remoteURL: '/common/code/status',
					loading: false,
					dataList: [],
					timeout: null
				},
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
			reset() {
				this.$refs.dataForm.resetFields()
			}
		},
		mounted() {
		}
	}
</script>
