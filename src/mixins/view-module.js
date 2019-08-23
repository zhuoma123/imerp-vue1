import qs from 'qs'
import XEUtils from 'xe-utils'
import util from '@/libs/util.js'

export default {
  data () {
    /* eslint-disable */
    return {
      // 设置属性
      mixinViewModuleOptions: {
        activatedIsNeed: true,    // 此页面是否在激活（进入）时，调用查询数据列表接口？
        getDataListURL: '',       // 数据列表接口，API地址
        getDataListIsPage: false, // 数据列表接口，是否需要分页？
        deleteURL: '',            // 删除接口，API地址
        deleteIsBatch: false,     // 删除接口，是否需要批量？
        deleteIsBatchKey: 'id',   // 删除接口，批量状态下由那个key进行标记操作？比如：pid，uid...
        exportURL: ''             // 导出接口，API地址
      },
      // 默认属性
      dataForm: {},               // 查询条件
      dataFormOp: {},             // 查询条件操作
      dataList: [],               // 数据列表
      order: '',                  // 排序，asc／desc
      orderField: '',             // 排序，字段
      page: 1,                    // 当前页码
      limit: 10,                  // 每页数
      total: 0,                   // 总条数
      dataListLoading: false,     // 数据列表，loading状态
      fullscreenLoading: false,   // 全页面遮罩
      dataListSelections: [],     // 数据列表，多选项
      addOrUpdateVisible: false,   // 新增／更新，弹窗visible状态
      // 表单属性
      formprops: {
        labelSuffix:'：'
      },
      // 表格属性
      selectionRow: false,
      sortConfig: {
        trigger: 'cell'
      },
      options: {
        size: 'mini',
        stripe: true,
        border: true
      },
      visible: false,
      btnDisable: false,
      pGrid: {},
      sGrid: {},
      addOrUpdate: {},
      entityModel: {},
      isNew: false,
      tableProxy: {
        index: true, // 启用动态序号代理
        sort: true, // 启用排序代理
        filter: true, // 启用筛选代理,
        autoLoad: true,
        ajax: {
          query: ({ page, sort, filters }) => {
            return this.vxeTabQuery({ page, sort, filters })
          }
        },
        props: {
          list: 'list',
          result: 'list',
          total: 'totalCount'
        }
      },
      //时间联动框
      pickerOptions: {
        shortcuts: [{
            text: '最近一周',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '最近一个月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '最近三个月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
            }
        }]
      },
    }
    /* eslint-enable */
  },
  methods: {
    /**
     * 该方法只用于子页面
     * @param {*} item
     */
    init (item) {
      this.isNew = !item
      if (item) { this.entityModel = Object.assign({}, item) }

      this.visible = true
    },
    initSelData () {

    },
    // 获取数据列表
    async getDataList (vxeDataForm) {
      this.dataListLoading = true
      await this.$axios.post(
        this.mixinViewModuleOptions.getDataListURL,
        {
          pageForm: this.mixinViewModuleOptions.getDataListIsPage ? {
            order: this.order,
            orderField: this.orderField,
            page: this.mixinViewModuleOptions.getDataListIsPage ? this.page : null,
            limit: this.mixinViewModuleOptions.getDataListIsPage ? this.limit : null
          } : {},
          dataForm: {
            data: Object.assign({}, this.dataForm, vxeDataForm),
            op: this.dataFormOp
          }
        }
      ).then(res => {
        this.dataList = this.mixinViewModuleOptions.getDataListIsPage ? res.list : res
        this.total = this.mixinViewModuleOptions.getDataListIsPage ? res.totalCount : 0
      }).catch(() => {
        this.dataList = []
        this.total = 0
      })
      this.dataListLoading = false
    },
    vxeTabQuery ({ page, sort, filters }, dataForm) {
      // 处理排序条件
      if (sort && sort.field && sort.field !== '') {
        this.order = sort.order
        this.orderField = sort.field
      }
      let vxeDataForm = dataForm || {}
      // 处理筛选条件
      filters.forEach(({ column, property, values }) => {
        vxeDataForm[property] = values.join(',')
      })
      return new Promise((resolve, reject) => {
        this.getDataList(vxeDataForm).then(() => {
          resolve({
            total: this.total,
            list: this.dataList
          })
        }).catch(err => {
          reject(err)
        })
      })
    },
    search (dataForm) {
      this.dataListLoading = true
      let vxeParams = { page: null, sort: null, filters: [] }
      this.vxeTabQuery(vxeParams, dataForm).then((resolve, rejects) => {
        if (this.$refs.sGrid) {
          this.$refs.sGrid.loadData(this.dataList)
        } else { this.pGrid.loadData(this.dataList) }

        this.dataListLoading = false
        if (this.$refs.sGrid) {
          this.$refs.sGrid.updateFooter()
        } else if (this.$refs.pGrid) {
          this.$refs.pGrid.updateFooter()
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      if(this.$refs.dataForm) {
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            this.doSubmit()
          }
        })
      } else {
        this.doSubmit()
      }
    },
    doSubmit() {
      this.btnDisable = true
      if (this.$refs.sGrid) {
        this.dataForm.lineList = this.getItemListDate(this.$refs.sGrid)
      }
      if (this.isNew) {
        this.dataForm.__state = 'NEW'
      } else {
        this.dataForm.__state = 'MODIFIED'
      }
      this.fullscreenLoading = true
      this.$axios
        .post(this.mixinViewModuleOptions.updateURL, this.dataForm)
        .then(() => {
          this.fullscreenLoading = false
          this.visible = false
          this.$emit('refreshDataList')
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1000,
            onClose: () => {
              this.btnDisable = false
            }
          })
        }).catch(() => {
          this.btnDisable = false
          this.fullscreenLoading = false
        })
    },
    // 多选
    dataListSelectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 排序
    dataListSortChangeHandle (data) {
      if (!data.order || !data.prop) {
        this.order = ''
        this.orderField = ''
        return false
      }
      this.order = data.order.replace(/ending$/, '')
      this.orderField = data.prop.replace(/([A-Z])/g, '_$1').toLowerCase()
      this.getDataList()
    },
    // 分页, 每页条数
    pageSizeChangeHandle (val, vxe) {
      this.page = 1
      this.limit = val
      if (vxe) {
        this.search()
      } else {
        this.getDataList()
      }
    },
    // 分页, 当前页
    pageCurrentChangeHandle (val, vxe) {
      this.page = val
      if (vxe) {
        this.search()
      } else {
        this.getDataList()
      }
    },
    // 双击
    cellDblClick ({ row }) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row)
      })
    },
    // 新增
    addHandle () {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init()
      })
    },
    // 修改
    updateHandle (event) {
      let row = this.pGrid.getCurrentRow()
      this.addOrUpdateVisible = true
      if (row) {
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(row)
        })
      } else {
        return this.$message({
          message: '请选择要修改的记录',
          type: 'warning'
        })
      }
    },
    // 提交
    submitHandle (event, isAuto) {
      let row = this.pGrid.getCurrentRow()
      if (!row) {
        return this.$message({
          message: '请选择要提交的记录',
          type: 'warning'
        })
      }
      this.$confirm('确定要提交吗，提交后不能在修改！', { 'handle': '提交' }, '确认操作', {
        confirmButtonText: this.$t('views.public.confirm'),
        cancelButtonText: this.$t('views.public.cancel'),
        type: 'warning'
      }).then(() => {
        this.$axios.post(
          this.mixinViewModuleOptions.submitURL, { 'id': row.id, 'isAuto': isAuto }
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
    // 新增 / 修改
    addOrUpdateHandleSetter (row) {
      this.addOrUpdateVisible = true
      if (row) {
        this.$nextTick(() => {
          this.$refs.addOrUpdate.dataForm.id = row.row.id
          this.$refs.addOrUpdate.update(row.row)
        })
      } else {
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init()
        })
      }
    },
    add (row) {
      let map = {}
      map.row = row
      this.addOrUpdateHandleSetter(map)
    },
    // 删除
    deleteHandle (grid) {
      let ids = ''
      this.dataListSelections = grid.getSelectRecords()
      if (grid.getSelectRecords().length === 0) {
        if (!grid.getCurrentRow()) {
          return this.$message({
            message: '请选择要删除的记录',
            type: 'warning'
          })
        }
        ids = grid.getCurrentRow().id
      } else {
        ids = this.dataListSelections.map(item => item.id).join()
      }
      this.$confirm('确定要删除选中的记录', { 'handle': '删除' }, '确认操作', {
        confirmButtonText: this.$t('views.public.confirm'),
        cancelButtonText: this.$t('views.public.cancel'),
        type: 'warning'
      }).then(() => {
        this.$axios.post(
          this.mixinViewModuleOptions.deleteURL,
          { 'ids': ids }
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
    // 删除
    deleteHandleSetter (index) {
      let data
      if (this.mixinViewModuleOptions.deleteIsBatch && this.dataListSelections.length > 0) {
        data = this.dataListSelections.map(item => item[this.mixinViewModuleOptions.deleteIsBatchKey])
      }
      let row
      if (!index) {
        row = undefined
      } else {
        row = index.row
      }
      if (row) {
        const id = row.id
        if (id) {
          data = [id]
        }
      }
      if (data===undefined){
        return
      }
      for (let i = 0; i < this.dataListSelections.length; i++) {
        const id=this.mixinViewModuleOptions.deleteIsBatchKey
        let e=this.dataListSelections[i]
        let childs=e.children
        if (childs){
          for(let i in childs){
            let child=childs[i]
            if (!data.includes(child[id])){
              this.$message.error('被包含的子项必须被全部删除')
              return
            }
          }
        }
      }
      this.$confirm(this.$t('public.prompt.info', { 'handle': this.$t('views.public.delete') }), this.$t('public.prompt.title'), {
        confirmButtonText: this.$t('views.public.confirm'),
        cancelButtonText: this.$t('views.public.cancel'),
        type: 'warning'
      }).then(() => {
        this.$axios.post(
          this.mixinViewModuleOptions.deleteURL,
          {
            'data': data
          }
        ).then(res => {
          this.$message({
            message: this.$t('views.public.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.getDataList()
            }
          })
        }).catch(() => {})
      }).catch(() => {})
    },
    // 导出
    exportHandle () {
      let params = qs.stringify({
        'token': util.cookies.get('token'),
        ...this.dataForm
      })
      window.location.href = `${window.SITE_CONFIG['apiURL']}${this.mixinViewModuleOptions.exportURL}?${params}`
    },
    // 获取行表数据
    getItemListDate (grid) {
      let allDate = grid.getRecordset()
      let rlist = []
      if (allDate) {
        if (allDate.insertRecords && allDate.insertRecords.length > 0) {
          for (let i = 0; i < allDate.insertRecords.length; i++) {
            allDate.insertRecords[i].__state = 'NEW'
          }
          rlist = rlist.concat(allDate.insertRecords)
        }
        if (allDate.updateRecords && allDate.updateRecords.length > 0) {
          for (let i = 0; i < allDate.updateRecords.length; i++) {
            allDate.updateRecords[i].__state = 'MODIFIED'
          }
          rlist = rlist.concat(allDate.updateRecords)
        }
        if (allDate.removeRecords && allDate.removeRecords.length > 0) {
          for (let i = 0; i < allDate.removeRecords.length; i++) {
            allDate.removeRecords[i].__state = 'DELETED'
          }
          rlist = rlist.concat(allDate.removeRecords)
        }
      }
      return rlist
    },
    footerCellClassName ({ $rowIndex, column, columnIndex, $columnIndex }) {
      if (column.align) {
        return 'col--' + column.align
      }
    },
    footerMethod ({ columns, data }) {
      return [columns.map((column, columnIndex) => {
        data.map((row) => {
          let editPost = column.own.editPost
          if (editPost) {
            row[column.property] = editPost(column, row)
          }
        })

        let footerRender = column.own.footerRender
        if (footerRender) {
          let cellValue = footerRender(column, data)
          let cellLabel = cellValue
          let { formatter } = column
          if (formatter) {
            if (XEUtils.isString(formatter)) {
              cellLabel = XEUtils[formatter](cellValue)
            } else if (XEUtils.isArray(formatter)) {
              cellLabel = XEUtils[formatter[0]].apply(XEUtils, [cellValue].concat(formatter.slice(1)))
            } else {
              cellLabel = formatter(Object.assign({ cellValue }))
            }
          }

          return cellLabel
        }

        return null
      })
      ]
    },
    removeSelecteds (grid) {
      grid.removeSelecteds().then(() => {
        grid.updateFooter()
      })
    },
    computeHeight () {
      let self = this
      if (self.$refs.pGrid) {
        let toolbar = document.getElementsByClassName('vxe-toolbar')[0] ? `${document.getElementsByClassName('vxe-toolbar')[0].clientHeight}` : 0
        let tableHeader = document.getElementsByClassName('vxe-table--header-wrapper')[0] ? `${document.getElementsByClassName('vxe-table--header-wrapper')[0].clientHeight}` : 0
        let bodyClientHeight = document.getElementsByClassName('d2-container-full__body')[0] ? `${document.getElementsByClassName('d2-container-full__body')[0].clientHeight}` : 0
        let tableBody = self.$refs.pGrid.$el.getElementsByClassName('vxe-table--body-wrapper')[0]
        let tableFoot = self.$refs.pGrid.showFooter ? 30 : 0
        if(tableBody)
          tableBody.style.height = Number(bodyClientHeight) - Number(toolbar) - Number(tableHeader) - tableFoot + 'px'
      }
    },
    collapseChange () {
      setTimeout(this.computeHeight, 500)
    },
    enableTlbBtn({columns,row}) {
      if(row.status==='NEW'){
        if(this.$refs.btnAdd)this.$refs.btnAdd.disabled=false;
        if(this.$refs.btnEdit)this.$refs.btnEdit.disabled=false;
        if(this.$refs.btnDelete)this.$refs.btnDelete.disabled=false;
        if(this.$refs.btnSubmit)this.$refs.btnSubmit.disabled=false;
        if(this.$refs.btnAutoPick)this.$refs.btnAutoPick.disabled=false;
        if(this.$refs.btnPick)this.$refs.btnPick.disabled=false;
      }else if (row.status==='SUBMIT'){
        if(this.$refs.btnAdd)this.$refs.btnAdd.disabled=false;
        if(this.$refs.btnEdit)this.$refs.btnEdit.disabled=true;
        if(this.$refs.btnDelete)this.$refs.btnDelete.disabled=true;
        if(this.$refs.btnSubmit)this.$refs.btnSubmit.disabled=true;
        if(this.$refs.btnAutoPick)this.$refs.btnAutoPick.disabled=false;
        if(this.$refs.btnPick)this.$refs.btnPick.disabled=false;
      }else if (row.status==='SENDED'){
        if(this.$refs.btnAdd)this.$refs.btnAdd.disabled=false;
        if(this.$refs.btnEdit)this.$refs.btnEdit.disabled=true;
        if(this.$refs.btnDelete)this.$refs.btnDelete.disabled=true;
        if(this.$refs.btnSubmit)this.$refs.btnSubmit.disabled=true;
        if(this.$refs.btnAutoPick)this.$refs.btnAutoPick.disabled=true;
        if(this.$refs.btnPick)this.$refs.btnPick.disabled=true;
      }else if (row.status==='PICKUP'){
        if(this.$refs.btnAdd)this.$refs.btnAdd.disabled=false;
        if(this.$refs.btnEdit)this.$refs.btnEdit.disabled=true;
        if(this.$refs.btnDelete)this.$refs.btnDelete.disabled=true;
        if(this.$refs.btnSubmit)this.$refs.btnSubmit.disabled=true;
        if(this.$refs.btnAutoPick)this.$refs.btnAutoPick.disabled=true;
        if(this.$refs.btnPick)this.$refs.btnPick.disabled=true;
      }else if (row.status==='CANCEL'){
        if(this.$refs.btnAdd)this.$refs.btnAdd.disabled=false;
        if(this.$refs.btnEdit)this.$refs.btnEdit.disabled=true;
        if(this.$refs.btnDelete)this.$refs.btnDelete.disabled=true;
        if(this.$refs.btnSubmit)this.$refs.btnSubmit.disabled=true;
        if(this.$refs.btnAutoPick)this.$refs.btnAutoPick.disabled=true;
        if(this.$refs.btnPick)this.$refs.btnPick.disabled=true;
      }else if (row.status==='COMPLETED'){
        if(this.$refs.btnAdd)this.$refs.btnAdd.disabled=false;
        if(this.$refs.btnEdit)this.$refs.btnEdit.disabled=true;
        if(this.$refs.btnDelete)this.$refs.btnDelete.disabled=true;
        if(this.$refs.btnSubmit)this.$refs.btnSubmit.disabled=true;
        if(this.$refs.btnAutoPick)this.$refs.btnAutoPick.disabled=true;
        if(this.$refs.btnPick)this.$refs.btnPick.disabled=true;
      }
    }
  },
  watch: {
    visible: function (newName, oldName) {
      if (newName) {
        this.$nextTick(() => {
          this.dataList = []
          this.$refs.sGrid.loadData(this.dataList)
          if (this.isNew) {
            this.$refs.dataForm.resetFields()
            this.$refs.sGrid.updateFooter()
          } else {
            debugger;
            this.dataForm = this.entityModel
            this.initSelData()
            this.search(this.entityModel)
          }
        })
      }
    }
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
      this.pGrid = this.$refs.pGrid
      this.sGrid = this.$refs.sGrid
      this.addOrUpdate = this.$refs.addOrUpdate
      if (this.$refs.pGrid) {
        // 窗口变化事件
        window.onresize = () => {
          this.computeHeight()
        }
        // 初始化
        this.computeHeight()
      }
    })
  },
  activated () {
    console.log('---------------->activated')
  }
}
