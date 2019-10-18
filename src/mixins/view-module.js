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
      updatePasswordVisible:false, // 更改密码弹窗visible状态
      // 表单属性
      formprops: {
        labelSuffix:'：'
      },
      // 子页面表单是否只读
      formReadOnly: false,
      // 子页面表单是否提交
      enableSubmit: true,
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
      curStatus: '',
      visible: false,
      btnDisable: false,
      pGrid: {},
      sGrid: {},
      addOrUpdate: {},
      updatePassword: {},
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
      toolbar: {
        id: 'vxe_toolbar_1',
        refresh: true,
        resizable: {
          storage: true
        },
        setting: {
          storage: true
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
    init (item, read=false, submit=true) {
      this.isNew = !item
      if (item) {
        this.entityModel = Object.assign({}, item)
      } else {
        this.entityModel = {}
      }
      this.enableSubmit = submit
      this.visible = true
      this.initCB()
    },
    // 初始化回调
    initCB() {

    },
    initSelData () {

    },
    // 获取数据列表
    async getDataList (vxeDataForm) {
      if(this.mixinViewModuleOptions.getDataListURL == '')return;
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
        this.getDataListCB(this, res)
      }).catch(() => {
        this.dataList = []
        this.total = 0
      })
      this.dataListLoading = false
    },
    getDataListCB(self, res) {

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
        this.dataListLoading = false
        if (this.$refs.sGrid) {
          this.$refs.sGrid.loadData(this.dataList)
          this.$refs.sGrid.updateFooter()
          this.$refs.sGrid.clearCurrentRow()
        } else if (this.$refs.pGrid) {
          this.$refs.pGrid.loadData(this.dataList)
          this.$refs.pGrid.updateFooter()
          this.$refs.pGrid.clearCurrentRow()
        }
        this.vxeQueryCB(this)
      })
    },
    vxeQueryCB (self) {

    },
    // 表单提交
    dataFormSubmit () {
      Promise.all([
        this.checkForm(),
        this.checkGrid(this.$refs.sGrid)
      ]).then(() => {
        this.$confirm('确定要保存吗！', '操作提示', {
          confirmButtonText: this.$t('views.public.confirm'),
          cancelButtonText: this.$t('views.public.cancel'),
          type: 'info'
        }).then(() => {
          this.doSubmit()
        }).catch(() => {})
      }).catch(err => {})

      /*
      this.checkForm().then(function(data){
        if (data) {
          if (this.$refs.sGrid) {
            return this.checkGrid(this.$refs.sGrid)
          }else{
            suss =true;
          }
        }
      }).then(function(data){
        suss = data
      })
      */

      // this.$refs.dataForm.validate(valid => {
      // })
    },

    doSubmit () {
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
    cellDblClick ({row}, event) {
      if(typeof row === 'undefined' || row === null) {
        return this.$message({
          message: '请选择要修改的记录',
          type: 'warning'
        })
      }
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
    },
    // 新增
    addHandle () {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init()
      })
    },
    // 修改
    updateHandle () {
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
      this.$confirm('确定要提交吗，提交后不能在修改！', '操作提示', {
        confirmButtonText: this.$t('views.public.confirm'),
        cancelButtonText: this.$t('views.public.cancel'),
        type: 'info'
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
    rollbackHandle (event) {
      let row = this.pGrid.getCurrentRow()
      if (!row) {
        return this.$message({
          message: '请选择要撤回的记录',
          type: 'warning'
        })
      }
      this.$confirm('确定要撤回吗！', '操作提示', {
        confirmButtonText: this.$t('views.public.confirm'),
        cancelButtonText: this.$t('views.public.cancel'),
        type: 'warning'
      }).then(() => {
        this.$axios.get(
          this.mixinViewModuleOptions.rollbackURL + '?sourceId=' + row.id
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
    deleteEntityHandle (grid) {
      let row = this.pGrid.getCurrentRow()
      if (!row) {
        return this.$message({
          message: '请选择要删除的记录',
          type: 'error'
        })
      }
      this.$confirm('确定要删除选中的记录吗！', '操作提示', {
        confirmButtonText: this.$t('views.public.confirm'),
        cancelButtonText: this.$t('views.public.cancel'),
        type: 'error'
      }).then(() => {
        row.__state='DELETED'
        this.$axios.post(
          this.mixinViewModuleOptions.updateURL,row
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
      this.$confirm('确定要删除选中的记录', '操作提示', {
        confirmButtonText: this.$t('views.public.confirm'),
        cancelButtonText: this.$t('views.public.cancel'),
        type: 'error'
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
    deleteHandleSetter (grid) {
      let ids = ''
      this.dataListSelections = grid.getSelectRecords()
      if (grid.getSelectRecords().length === 0) {
        if (!grid.getCurrentRow()) {
          return this.$message({
            message: '请选择要删除的记录',
            type: 'warning'
          })
        }
        ids = [grid.getCurrentRow().id]
      } else {
        ids = this.dataListSelections.map(item => item.id).join()
      }
      this.$confirm('确定要删除选中的记录', '操作提示', {
        confirmButtonText: this.$t('views.public.confirm'),
        cancelButtonText: this.$t('views.public.cancel'),
        type: 'error'
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
    deliverData (custId, custName) {
      this.$nextTick(() => {
        let dataForm = this.$refs.addOrUpdate.dataForm
        dataForm.custId = custId
        dataForm.custName = custName
      })
    },
    // 导出
    exportHandle () {
      let params = qs.stringify({
        'token': util.cookies.get('Mema-Token'),
        ...this.dataForm
      })
      window.location.href = `${window.SITE_CONFIG['apiURL']}${this.mixinViewModuleOptions.exportURL}?${params}`
    },
    // 获取行表数据
    getItemListDate (grid) {
      let rlist = []
      if(this.subTableAll){//获取所有数据
        let allDate = grid.getTableData()
        if (allDate.fullData && allDate.fullData.length > 0) {
          for (let i = 0; i < allDate.fullData.length; i++) {
            allDate.fullData[i].__state = 'NEW'
          }
          rlist = rlist.concat(allDate.fullData)
        }

      }else{
        let allDate = grid.getRecordset()
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
          if (formatter && cellValue !='汇总') {
            if (XEUtils.isString(formatter)) {
              cellLabel = XEUtils[formatter](cellValue)
            } else if (XEUtils.isArray(formatter)) {
              cellLabel = XEUtils[formatter[0]].apply(XEUtils, [cellValue].concat(formatter.slice(1)))
            } else {
              cellLabel = formatter(Object.assign({ cellValue }))
            }
          }

          //将汇总金额放回给页面某个元素.需要定义setAmount方法
          let needReturnAmount = column.own.needReturnAmount
          if (needReturnAmount) {
            this.setAmount(cellLabel)
          }
          return cellLabel
        }

        return null
      })
      ]
    },

    
    removeSelecteds (grid) {
      grid.removeSelecteds().then(() => {
        grid.updateFooter();
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
    currentChange ({row}) {
      this.curStatus = row.status
    },
    btnStatus (obj, val) {
      let enablestatus = obj.$attrs.enablestatus
      if(enablestatus && enablestatus.length > 0) {
        enablestatus = enablestatus.split(',')
        obj.$el.style = 'display:' + (enablestatus.includes(val) ? 'inline-block' : 'none')
      }
    },
    reset () {
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },


    //表单校验
    checkForm(){
      return new Promise((resolve, reject) => {
        //模拟接口调用
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            resolve(true);
          }else{
            reject(false);
          }
        })
      })
    },
    //列表校验
    checkGrid(grid){
      return new Promise((resolve, reject) => {
        if(!grid)
          resolve(true)
        else {
          grid.fullValidate((valid, errMap) => {
            if (valid) {
              resolve(true);
              //this.$XMsg.message({ status: 'success', message: '校验成功！' })
            } else {
              let msgList = []
              Object.values(errMap).forEach(errList => {
                errList.forEach(params => {
                  let { rowIndex, column, rules } = params
                  rules.forEach(rule => {
                    msgList.push(`第 ${rowIndex} 行 ${column.title} 校验错误：${rule.message}`)
                  })
                })
              })
              this.$XMsg.message({
                status: 'error',
                message: () => {
                  return [
                    <div class="red" style="max-height: 400px;overflow: auto;">
                      {
                        msgList.map(msg => {
                          return <div>{ msg }</div>
                        })
                      }
                    </div>
                  ]
                }
              })
              reject(false);
            }
          })
        }
      })
    },
    footerSum(column, data) {
      return XEUtils.sum(data, column.property);
    },
    formatMoney(number, places, symbol, thousand, decimal) {
      number = number || 0
      places = !isNaN(places = Math.abs(places)) ? places : 2
      symbol = symbol !== undefined ? symbol : ""
      thousand = thousand || ","
      decimal = decimal || "."
      var negative = number < 0 ? "-" : "",
          i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
          j = (j = i.length) > 3 ? j % 3 : 0
      return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
    },
    formatterMoney({cellValue, row, rowIndex, column, columnIndex}) {
      return this.formatMoney(cellValue)
    },
  },
  watch: {
    visible: function (newName, oldName) {
      if (newName) {
        this.$nextTick(() => {
          if (this.$refs.sGrid && this.mixinViewModuleOptions.getDataListURL != '') {
            this.dataList = []
            this.$refs.sGrid.loadData(this.dataList)
            if (this.isNew) {
              this.reset()
              this.$refs.sGrid.updateFooter()
            } else {
              this.dataForm = this.entityModel
              this.initSelData()
              this.search(this.entityModel)
            }
          } else {
            if (this.isNew) {
              this.reset()
            } else {
              this.dataForm = this.entityModel
            }
          }
        })
      }
    },
    curStatus: function(val, oldVal) {
      for(let item in this.$refs) {
        if(item.startsWith('btnStatus'))
          this.btnStatus(this.$refs[item], val)
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
