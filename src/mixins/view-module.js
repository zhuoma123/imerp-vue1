import qs from 'qs'
import { getDataList } from '../api/base/base'
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
      dataListSelections: [],     // 数据列表，多选项
      addOrUpdateVisible: false,   // 新增／更新，弹窗visible状态
      // 表格属性
      selectionRow: false,
      options: {
        size: 'mini',
        stripe: true,
        border: true
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
  activated () {
    if (this.mixinViewModuleOptions.activatedIsNeed) {
      this.getDataList()
    }
  },
  created () {
    if (this.mixinViewModuleOptions.activatedIsNeed) {
      this.getDataList()
    }
  },
  methods: {
    // 获取数据列表
    async getDataList () {
      return new Promise((resolve, reject) => {
        this.dataListLoading = true
        this.$axios.post(
          this.mixinViewModuleOptions.getDataListURL,
          {
            pageForm: {
              order: this.order,
              orderField: this.orderField,
              page: this.mixinViewModuleOptions.getDataListIsPage ? this.page : null,
              limit: this.mixinViewModuleOptions.getDataListIsPage ? this.limit : null
            },
            dataForm: {
              data: this.dataForm,
              op: this.dataFormOp
            }
          }
        ).then(res => {
          this.dataListLoading = false
          this.dataList = this.mixinViewModuleOptions.getDataListIsPage ? res.list : res
          this.total = this.mixinViewModuleOptions.getDataListIsPage ? res.totalCount : 0
          resolve()
        }).catch(() => {
          this.dataList = []
          this.total = 0
          this.dataListLoading = false
        })
      })
    },
    vxeTabQuery () {
      return new Promise(async (resolve, reject) => {
        await this.getDataList().then((res, rej) => {
          resolve({
            total: this.total,
            list: this.dataList
          })
        })
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
    pageSizeChangeHandle (val) {
      this.page = 1
      this.limit = val
      this.getDataList()
    },
    // 分页, 当前页
    pageCurrentChangeHandle (val) {
      this.page = val
      this.getDataList()
    },
    // 新增
    addHandle () {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init()
      })
    },
    // 修改
    updateHandle (grid) {
      var row = grid.getCurrentRow()
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        if (row) {
          this.$refs.addOrUpdate.dataForm.id = row.id
        }
        this.$refs.addOrUpdate.init(row.id)
      })
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
    // 删除
    deleteHandle ({ index, row }) {
      const id = row.id
      if (this.mixinViewModuleOptions.deleteIsBatch && !id && this.dataListSelections.length <= 0) {
        return this.$message({
          message: this.$t('public.prompt.deleteBatch'),
          type: 'warning',
          duration: 500
        })
      }
      this.$confirm(this.$t('public.prompt.info', { 'handle': this.$t('views.public.delete') }), this.$t('public.prompt.title'), {
        confirmButtonText: this.$t('views.public.confirm'),
        cancelButtonText: this.$t('views.public.cancel'),
        type: 'warning'
      }).then(() => {
        this.$axios.delete(
          `${this.mixinViewModuleOptions.deleteURL}${this.mixinViewModuleOptions.deleteIsBatch ? '' : '/' + id}`,
          this.mixinViewModuleOptions.deleteIsBatch ? {
            'data': id ? [id] : this.dataListSelections.map(item => item[this.mixinViewModuleOptions.deleteIsBatchKey])
          } : {}
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
      this.$confirm(this.$t('public.prompt.info', { 'handle': this.$t('views.public.delete') }), this.$t('public.prompt.title'), {
        confirmButtonText: this.$t('views.public.confirm'),
        cancelButtonText: this.$t('views.public.cancel'),
        type: 'warning'
      }).then(() => {
        this.$axios.post(
          `${this.mixinViewModuleOptions.deleteURL}${this.mixinViewModuleOptions.deleteIsBatch ? '' : '/' + id}`,
          this.mixinViewModuleOptions.deleteIsBatch ? {
            'data': data
          } : {}
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
      var params = qs.stringify({
        'token': cookieGet('token'),
        ...this.dataForm
      })
      window.location.href = `${window.SITE_CONFIG['apiURL']}${this.mixinViewModuleOptions.exportURL}?${params}`
    },
    // 获取行表数据
    getItemListDate (grid) {
      var allDate = grid.getRecordset()
      var rlist = []
      if (allDate) {
        if (allDate.insertRecords && allDate.insertRecords.length > 0) {
          for (var i = 0; i < allDate.insertRecords.length; i++) {
            allDate.insertRecords[i].__state = 'INSERT'
          }
          rlist = rlist.concat(allDate.insertRecords)
        }
        if (allDate.updateRecords && allDate.updateRecords.length > 0) {
          for (var i = 0; i < allDate.updateRecords.length; i++) {
            allDate.updateRecords[i].__state = 'UPDATE'
          }
          rlist = rlist.concat(allDate.updateRecords)
        }
        if (allDate.removeRecords && allDate.removeRecords.length > 0) {
          for (var i = 0; i < allDate.removeRecords.length; i++) {
            allDate.removeRecords[i].__state = 'DELETE'
          }
          rlist = rlist.concat(allDate.removeRecords)
        }
      }
      return rlist
    }
  }
}
