<template>
	<d2-container>
		<el-collapse slot="header" @change="collapseChange">
			<el-collapse-item>
				<template slot="title">
					查询条件
					<i class="el-icon-d-arrow-right"/>
				</template>
				<el-form
					size="mini"
					:inline="true"
					:model="dataForm"
					ref="dataForm"
					@keyup.enter.native="getDataList()"
					label-width="90px"
					label-suffix="："
				>
					<el-form-item label="盘点单号" prop="orderNum">
						<el-input v-model="dataForm.orderNum" clearable></el-input>
					</el-form-item>
					<el-form-item label="仓库" prop="warehouseId">
						<el-select
							v-model="dataForm.warehouseId"
							:loading="warehouseSel.loading"
							:remote-method="selWarehouse"
							filterable
							remote
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
					<el-form-item label="状态" prop="status">
						<el-select v-model="dataForm.status" :loading="statusSel.loading">
							<el-option
								v-for="item in statusSel.dataList"
								:key="item.key"
								:label="item.key"
								:value="item.value"
							></el-option>
						</el-select>
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
							:picker-options="pickerOptions"
						></el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button
							type="primary"
							icon="el-icon-search"
							@click="search"
						>{{ $t('views.public.query') }}
						</el-button>
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
			@cell-click="enableTlbBtn"
		>
			<template v-slot:buttons>
				<el-button
					ref="btnAdd"
					size="mini"
					icon="el-icon-circle-plus"
					v-if="$hasPermission('inv:checkbill:save')"
					@click="addHandle"
				>新增
				</el-button>
				<el-button
					ref="btnEdit"
					type="primary"
					size="mini"
					icon="el-icon-edit"
					v-if="$hasPermission('inv:checkbill:save')"
					@click="updateHandle($refs.pGrid)"
				>修改
				</el-button>
				<el-button
					ref="btnDelete"
					type="danger"
					size="mini"
					icon="el-icon-delete"
					v-if="$hasPermission('inv:checkbill:delete')"
					@click="deleteHandle($refs.pGrid)"
				>删除
				</el-button>
				<el-button
					ref="btnAutoPick"
					type="success"
					size="mini"
					icon="el-icon-check"
					v-if="$hasPermission('inv:checkbill:submit')"
					@click="submitHandle($refs.pGrid,true)"
				>自动拣货
				</el-button>
				<el-button
					ref="btnPick"
					type="success"
					size="mini"
					icon="el-icon-check"
					v-if="$hasPermission('inv:checkbill:submit')"
					@click="submitHandle($refs.pGrid,false)"
				>人工拣货
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
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
	</d2-container>
</template>

<script>
    import AddOrUpdate from './checkbill-add-or-update'
    import mixinViewModule from '@/mixins/view-module'

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
                btnVisible:true,
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
            selWarehouse: function (query) {
                this.warehouseSel.loading = true
                this.$axios
                    .post(this.warehouseSel.remoteURL, {query: query})
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
            selStatus: function () {
                this.statusSel.loading = true
                this.$axios.post(this.statusSel.remoteURL, {}).then(res => {
                    this.statusSel.loading = false
                    if (res && res.length > 0) {
                        for (var i = 0; i < res.length; i++) {
                            this.statusSel.dataList.push(res[i])
                        }
                    } else this.statusSel.dataList = []
                })
            },
            handleFormReset() {
                this.$refs.dataForm.resetFields()
            }
        },
        mounted() {
            this.selStatus()
        }
    }
</script>
