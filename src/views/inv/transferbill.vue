<template>
	<d2-container>
		<el-collapse slot="header">
			<el-collapse-item>
				<template slot="title">
					查询条件<i class="el-icon-d-arrow-right"/>
				</template>
				<el-form size="mini" :inline="true" :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()"
				         label-width="90px" label-suffix="：">
					<el-form-item label="调拨单号" prop="orderNum">
						<el-input v-model="dataForm.orderNum" clearable></el-input>
					</el-form-item>
					<el-form-item label="调出仓" prop="fromWarehouseId">
            <im-selector
              v-model="dataForm.fromWarehouseId"
              :mapModel.sync="dataForm"
              mapKeyVal="fromWarehouseCode:fromWarehouseId"
              dataType="biz.warehouse">
            </im-selector>
					</el-form-item>
					<el-form-item label="调入仓" prop="toWarehouseId">
            <im-selector
              v-model="dataForm.toWarehouseId"
              :mapModel.sync="dataForm"
              mapKeyVal="toWarehouseCode:toWarehouseId"
              dataType="biz.warehouse">
            </im-selector>
					</el-form-item>
					<el-form-item label="调拨日期" prop="transferDate">
						<el-date-picker
							v-model="dataForm.transferDate"
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
					<el-form-item label="状态" prop="status">
						<im-selector
							v-model="dataForm.status"
							:mapModel.sync="dataForm"
							mapKeyVal="status"
							dataType="code.status">
						</im-selector>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" icon="el-icon-search" @click="search">{{ $t('views.public.query') }}</el-button>
					</el-form-item>
					<el-form-item>
						<el-button @click="handleFormReset">
							<d2-icon name="refresh"/>
							重置
						</el-button>
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
			@cell-dblclick="cellDblClick"
			@current-change='currentChange'>
			<template v-slot:buttons>
				<el-button ref="btnStatusAdd" size="mini" icon="el-icon-circle-plus" v-if="$hasPermission('inv:transferbill:save')"
				           @click="addHandle">新增
				</el-button>
				<el-button ref="btnStatusEdit"
				           enablestatus='NEW'
				           row-dbclick
				           form-readonly type="primary" size="mini" icon="el-icon-edit" v-if="$hasPermission('inv:transferbill:save')"
				           @click="updateHandle($refs.pGrid)">修改
				</el-button>
				<el-button ref="btnStatusDelete"
				           enablestatus='NEW' type="danger" size="mini" icon="el-icon-delete" v-if="$hasPermission('inv:transferbill:delete')"
				           @click="deleteHandle($refs.pGrid)">删除
				</el-button>
				<el-button ref="btnStatusAutoPick"
				           enablestatus='NEW' type="success" size="mini" icon="el-icon-check" v-if="$hasPermission('inv:transferbill:submit')"
				           @click="submitHandle($refs.pGrid,true)">自动拣货
				</el-button>
				<el-button ref="btnStatusPick"
				           enablestatus='NEW' type="success" size="mini" icon="el-icon-check" v-if="$hasPermission('inv:transferbill:submit')"
				           @click="submitHandle($refs.pGrid,false)">人工拣货
				</el-button>
				<el-button type="info" size="mini" icon="el-icon-printer" v-if="$hasPermission('inv:transferbill:print')">打印
				</el-button>
				<el-button type="info" size="mini" icon="fa fa-file-excel-o" v-if="$hasPermission('inv:transferbill:export')"
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
	import AddOrUpdate from './transferbill-add-or-update'
	import mixinViewModule from '@/mixins/view-module'

	export default {
		name: 'inv-transferbill',
		mixins: [mixinViewModule],
		data() {
			return {
				mixinViewModuleOptions: {
					getDataListURL: '/inv/transferbill/list',
					getDataListIsPage: true,
					updateURL: '/inv/transferbill/update',
					deleteURL: '/inv/transferbill/delete',
					submitURL: '/inv/transferbill/submit',
					exportURL: '/inv/transferbill/export'
				},
				order: 'desc',
				orderField: 'id',
				dataForm: {
					orderNum: '',
					fromWarehouseId: null,
					toWarehouseId: null,
					transferDate: null,
					status: null
				},
				tableColumn: [
					{type: 'index', width: 30, align: 'center'},
					{
						title: '调拨单号',
						field: 'orderNum',
						sortable: true,
						align: 'center'
					},
					{
						title: '调出仓',
						field: 'fromWarehouseCode',
						sortable: true,
						align: 'center'
					},
					{
						title: '调入仓',
						field: 'toWarehouseCode',
						sortable: true,
						align: 'center'
					},
					{
						title: '调拨日期',
						field: 'transferDate',
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
			handleFormReset() {
				this.$refs.dataForm.resetFields()
			}
		},
		mounted() {
		}
	}
</script>
