<template>
    <d2-container class="mod-sys__user">
        <el-collapse slot="header" v-model="activeName">
            <el-collapse-item name="1">
                <template slot="title">
                    查询条件<i class="el-icon-d-arrow-right"/>
                </template>
                <el-form :inline="true" size="mini" :model="dataForm"
                         ref="dataForm"
                         @keyup.enter.native="search">
                    <el-form-item prop="type">
                        <el-input
                                v-model="dataForm.type"
                                :placeholder="formMap.form.data.type"
                                clearable
                        />
                    </el-form-item>
                    <el-form-item prop="code">
                        <el-input
                                v-model="dataForm.code"
                                :placeholder="formMap.form.data.code"
                                clearable
                        />
                    </el-form-item>
                    <el-form-item prop="name">
                        <el-input
                                v-model="dataForm.name"
                                :placeholder="formMap.form.data.name"
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
        <AddOrUpdate v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="search"/>
    </d2-container>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './add-or-update'
import formMap from '../data'
import data from './data'

export default {
  name: 'tree',
  mixins: [mixinViewModule],
  data () {
    return {
      activeName: '1',
      data: data,
      formMap: formMap,
      mixinViewModuleOptions: {
        getDataListURL: '/base/tree/list',
        getDataListIsPage: true,
        deleteURL: '/base/tree/delete',
        deleteIsBatch: true
      },
      dataForm: {
        type: undefined,
        code: undefined,
        name: undefined
      },
      sysDic: ['是', '否'],
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
        { type: 'index', width: 30 },
        {
          title: '类型',
          field: 'type',
          sortable: true,
          align: 'left',
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
          field: 'orderNum',
          sortable: true,
          align: 'center'
        },
        {
          title: '是否系统数据',
          field: 'sys',
          align: 'center',
          width: '100px',
          formatter: this.flagSelector
        },
        {
          title: '备注',
          field: 'remark',
          sortable: true,
          align: 'center'
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
        if (row.sys === 0) {
          this.$nextTick(() => {
            this.$refs.addOrUpdate.init(row)
          })
        } else if (row.sys === 1) {
          return this.$message({
            message: '系统数据已被设置为不能被编辑',
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
        if (row.sys === 0) {
          this.deleteHandleSetter(this.$refs.pGrid)
        } else if (row.sys === 1) {
          return this.$message({
            message: '系统数据不能被删除',
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
    this.getDataList()
  }
}
</script>
