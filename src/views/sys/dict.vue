<template>
    <d2-container class="mod-sys__user">
        <el-collapse slot="header">
            <el-collapse-item>
                <template slot="title">
                    查询条件<i class="el-icon-d-arrow-right"/>
                </template>
                <el-form :inline="true" size="mini" :model="dataForm"
                         ref="dataForm"
                         @keyup.enter.native="search">
                    <el-form-item prop="dictType">
                        <el-input
                                v-model="dataForm.dictType"
                                :placeholder="data.form.dict.dictType"
                                clearable
                        />
                    </el-form-item>
                    <el-form-item prop="name">
                        <el-input
                                v-model="dataForm.name"
                                :placeholder="data.form.dict.name"
                                clearable
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="search" icon="el-icon-search" type="primary">{{
                            $t('views.public.query') }}
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
        <!--data show-->
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
                :columns="columns"
                :select-config="{reserve: true}"
                :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
                @cell-dblclick="cellDblClick"
                :tree-config="{children: 'children'}"
        >
            <template v-slot:buttons>
                <el-button
                        ref="btnAdd"
                        size="mini"
                        icon="el-icon-circle-plus"
                        @click="addHandle"
                >新增
                </el-button>
                <el-button
                        ref="btnEdit"
                        type="primary"
                        size="mini"
                        icon="el-icon-edit"
                        @click="updateHandleRefer($refs.pGrid)"
                >修改
                </el-button>
                <el-button
                        ref="btnDelete"
                        type="danger"
                        size="mini"
                        icon="el-icon-delete"
                        @click="deleteHandleSetterRefer($refs.pGrid)"
                >删除
                </el-button>
            </template>
        </vxe-grid>
        <!-- 弹窗, 新增 / 修改 -->
        <AddOrUpdate v-if="addOrUpdateVisible" :parentDataList="dataList" ref="addOrUpdate" @refreshDataList="search"/>
    </d2-container>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './dict-add-or-update'
import data from './data'

export default {
  name: 'sys-dict',
  mixins: [mixinViewModule],
  data () {
    return {
      data: data,
      mixinViewModuleOptions: {
        getDataListURL: '/sys/dict/list',
        getDataListIsPage: true,
        deleteURL: '/sys/dict/delete',
        deleteIsBatch: true
      },
      dataForm: {
        dictType: undefined,
        name: undefined
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
      },
      columns: [
        {
          title: '字典类型',
          field: 'dictType',
          sortable: true,
          align: 'center',
          treeNode: true
        },
        {
          title: '编码',
          field: 'code',
          sortable: true,
          align: 'center'
        },
        {
          title: '名称',
          field: 'name',
          sortable: true,
          align: 'center'
        },
        {
          title: '序号',
          field: 'extendVal',
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
          title: '可否编辑',
          field: 'editFlag',
          sortable: true,
          align: 'center',
          formatter: this.flagSelector
        },
        {
          title: '可否删除',
          field: 'deleteFlag',
          sortable: true,
          align: 'center',
          formatter: this.flagSelector
        },
        {
          title: '更新人',
          field: 'updateBy',
          sortable: true,
          align: 'center'
        },
        {
          title: '修改日期',
          field: 'updateDate',
          sortable: true,
          align: 'center',
          width: '100px',
          formatter: ['toDateString', 'yyyy-MM-dd']
        }
      ]
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    handleFormReset () {
      this.$refs['dataForm'].resetFields()
    },
    flagSelector ({ cellValue }) {
      if (cellValue) {
        return '是'
      } else {
        return '否'
      }
    },
    updateHandleRefer () {
      let row = this.pGrid.getCurrentRow()
      this.addOrUpdateVisible = true
      if (row) {
        if (row.editFlag) {
          this.$nextTick(() => {
            this.$refs.addOrUpdate.init(row)
          })
        } else {
          return this.$message({
            message: '当前记录已被设置为不能被编辑',
            type: 'warning'
          })
        }
      } else {
        return this.$message({
          message: '请选择要修改的记录',
          type: 'warning'
        })
      }
    },
    deleteHandleSetterRefer () {
      let row = this.pGrid.getCurrentRow()
      if (row) {
        if (row.deleteFlag) {
          debugger
          this.deleteHandleSetter(this.$refs.pGrid)
        } else {
          return this.$message({
            message: '当前记录已被设置不能被删除',
            type: 'warning'
          })
        }
      } else {
        return this.$message({
          message: '请选择要删除的记录',
          type: 'warning'
        })
      }
    }
  },
  created () {
    this.search()
  }
}
</script>
