<template>
    <d2-container class="mod-sys__user">
        <el-collapse slot="header" v-model="activeName">
            <el-collapse-item name="1">
                <template slot="title">
                    查询条件<i class="el-icon-d-arrow-right"/>
                </template>
                <el-form :inline="true" size="mini" :model="dataForm" @keyup.enter.native="search" ref="dataForm">
                    <el-form-item prop="name">
                        <el-input
                                v-model="dataForm.name"
                                :placeholder="data.form.subject.name"
                                clearable
                        />
                    </el-form-item>
                    <el-form-item prop="category">
                        <el-input
                                v-model="dataForm.category"
                                :placeholder="data.form.subject.category"
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
        <!--show data-->
        <vxe-grid
                style="height: 400px"
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
                        @click="updateHandle($refs.pGrid)"
                >修改
                </el-button>
                <el-button
                        ref="btnDelete"
                        type="danger"
                        size="mini"
                        icon="el-icon-delete"
                        @click="deleteHandleSetter($refs.pGrid)"
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
                @current-change="val => pageCurrentChangeHandle(val, 'vxe')"/>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" :parentDataList="dataList" ref="addOrUpdate" @refreshDataList="search"/>
    </d2-container>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './subject-add-or-update'
import data from './data'

export default {
  name: 'fin-subject',
  mixins: [mixinViewModule],
  data: function () {
    return {
      activeName: '1',
      data: data,
      mixinViewModuleOptions: {
        getDataListURL: '/fin/subject/list',
        getDataListIsPage: true,
        deleteURL: '/fin/subject/delete',
        deleteIsBatch: true
      },
      dataForm: {
        id: undefined,
        parentId: undefined,
        companyId: undefined,
        code: undefined,
        name: undefined,
        subjectType: undefined,
        subjectName: undefined,
        category: undefined,
        subjectLevel: undefined,
        direction: undefined
      },
      columns: [
        { type: 'index', width: 70 },
        {
          title: '名称',
          field: 'name',
          sortable: true,
          align: 'center',
          width: '150px',
          treeNode: true
        },
        {
          title: '编码',
          field: 'code',
          sortable: true,
          align: 'center',
          width: '150px'
        },
        {
          title: '科目类别',
          field: 'categoryName',
          sortable: true,
          align: 'center',
          width: '120px'
        },
        {
          title: '级别',
          field: 'subjectLevel',
          sortable: true,
          align: 'center',
          width: '120px'
        },
        {
          title: '余额方向',
          field: 'direction',
          sortable: true,
          align: 'center',
          width: '120px'
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
          align: 'center',
          width: '120px'
        },
        {
          title: '修改日期',
          field: 'updateDate',
          sortable: true,
          align: 'center',
          width: '200px',
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
    handleFormReset () {
      this.$refs['dataForm'].resetFields()
    }
  }
}
</script>

<style>

</style>
