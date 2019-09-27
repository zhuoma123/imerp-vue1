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
				<el-button ref="btnStatusAdd" enablestatus='NEW,SUBMIT,SENDED,COMPLETED' size="mini" icon="el-icon-circle-plus"
				           v-if="$hasPermission('pur:poheader:save')" @click="addHandle">新增
				</el-button>
				<el-button ref="btnStatusEdit"
				           enablestatus='NEW'
				           row-dbclick
				           form-readonly type="primary" size="mini" icon="el-icon-edit"
				           v-if="$hasPermission('pur:poheader:save')"
				           @click="e => cellDblClick({row: $refs.pGrid.getCurrentRow()}, e)">修改
				</el-button>
				<el-button ref="btnStatusSubmit"
				           enablestatus='NEW' type="success" size="mini" icon="el-icon-check"
				           v-if="$hasPermission('pur:poheader:submit')" @click="submitPoHandle($refs.pGrid,true)">提交
				</el-button>
				<el-button ref="btnStatusDelete"
				           enablestatus='NEW' type="danger" size="mini" icon="el-icon-delete"
				           v-if="$hasPermission('pur:poheader:delete')" @click="deleteEntityHandle($refs.pGrid)">删除
				</el-button>
        <el-button ref="btnStatusPick"
                   enablestatus='SUBMIT,SENDED' type="success" size="mini" icon="el-icon-check"
                   v-if="$hasPermission('pur:poheader:submit')" 
                   @click="e => cellDblClick({row: $refs.pGrid.getCurrentRow()}, e)">收货
        </el-button>
				<el-button ref="btnStatusRollback"
				           enablestatus='SUBMIT,SENDED' type="warning" size="mini" icon="fa fa-undo"
				           v-if="$hasPermission('pur:poheader:rollback')" @click="rollbackHandle($refs.pGrid)">撤回
				</el-button>
				<el-button type="info" size="mini" icon="el-icon-printer">打印
				</el-button>
				<el-button type="info" size="mini" icon="fa fa-file-excel-o"
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
import AddOrUpdate from './poheader-add-or-update'
import mixinViewModule from '@/mixins/view-module'
const separate = { type: 'separate' }
export default {
  name: 'pur-poheader',
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/pur/poheader/list',
        getDataListIsPage: true,
        updateURL: '/pur/poheader/save',
        submitURL: '/pur/poheader/submit',
        submitPoURL: '/pur/poheader/posubmit',
        rollbackURL: '/pur/poheader/rollback',
        exportURL: '/pur/poheader/export'
      },
      order: 'desc',
      orderField: 'id',
      dataForm: {
        orderType: 'PO',
        orderNum: '',
        vendorId: '',
        warehouseId: '',
        vendorName: '',
        status: ''
      },
      descriptors: {
        orderNum: {
          type: 'string',
          label: '采购单号',
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
	        ruletype: 'integer',
          name: 'im-selector',
          props: {
            mapKeyVal: 'warehouseCode:warehouseId',
            dataType: 'biz.warehouse',
            clearable: true
          }
        },
        orderDate: {
          type: 'date',
          label: '采购日期',
          colspan: 2,
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
          title: '采购单号',
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
          title: '采购日期',
          field: 'orderDate',
          sortable: true,
          align: 'center',
          formatter: ['toDateString', 'yyyy-MM-dd']
        },
        {
          title: '采购员',
          field: 'agentName',
          sortable: true,
          align: 'center'
        },
        {
          title: '计划交货期',
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
          title: '采购总金额',
          field: 'orderAmount',
          sortable: true,
          align: 'right',
          formatter: this.formatterMoney,
          footerRender: this.footerSum
        },
        {
          title: '采购总运费',
          field: 'totalFreight',
          sortable: true,
          align: 'right',
          formatter: this.formatterMoney,
          footerRender: this.footerSum
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
    },
    // 提交
    submitPoHandle (event) {
      let row = this.pGrid.getCurrentRow()
      if (!row) {
        return this.$message({
          message: '请选择要提交的记录',
          type: 'warning'
        })
      }
      this.$confirm('确定要提交吗，提交后不能在修改！', '操作提示', {
        confirmButtonText: this.$t('views.public.confirm'),
        cancelButtonText: this.$t('views.public.cancel'),
        type: 'info'
      }).then(() => {
        this.$axios.post(
          this.mixinViewModuleOptions.submitPoURL, { 'id': row.id }
        ).then(res => {
          this.$message({
            message: this.$t('views.public.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.search()
            }
          })
        }).catch(() => {})
      }).catch(() => {})
    },
     // 双击
    cellDblClick ({row}, event) {
      if(typeof row === 'undefined' || row === null) {
        return this.$message({
          message: '请选择要操作的记录',
          type: 'error'
        })
      }
       //默认自动拣货
      row.isAuto = true
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        let read = null
        for(let r in this.$refs) {
          if(r.startsWith('btnStatus')) {
            let dc = this.$refs[r].$attrs['row-dbclick']
            read = this.$refs[r].$attrs['form-readonly']
            read = (typeof read !== 'undefined' && read !== null)
            if(typeof dc !== 'undefined' && dc !== null) {
              if(this.$refs[r].$el.style.display === 'none') {
                this.$refs.addOrUpdate.init(row, read, false)
                return
              }
            }
          }
        }
        this.$refs.addOrUpdate.init(row, read)
      })
    }
  },
  mounted () {
  }
}
</script>
