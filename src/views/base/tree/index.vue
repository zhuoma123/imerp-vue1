<template>
    <d2-container class="mod-sys__user">
        <el-form :inline="true" size="mini" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item>
                <el-input
                        v-model="dataForm.type"
                        :placeholder="formMap.form.data.type"
                        clearable
                />
            </el-form-item>
            <el-form-item>
                <el-input
                        v-model="dataForm.code"
                        :placeholder="formMap.form.data.code"
                        clearable
                />
            </el-form-item>
            <el-form-item>
                <el-input
                        v-model="dataForm.name"
                        :placeholder="formMap.form.data.name"
                        clearable
                />
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataList()">{{ $t('views.public.query') }}</el-button>
            </el-form-item>
            <el-form-item>
                <el-button
                        v-if="$hasPermission('sys:user:save')"
                        type="primary"
                        @click="addOrUpdateHandleSetter()"
                >{{ $t('views.public.add') }}
                </el-button>
            </el-form-item>
            <el-form-item>
                <el-button
                        v-if="$hasPermission('sys:user:delete')"
                        type="danger"
                        @click="deleteHandleSetter()"
                >{{ $t('views.public.deleteBatch') }}
                </el-button>
            </el-form-item>
        </el-form>
        <!--data show-->
        <el-card>
            <!-- 查询结果 -->
            <el-table v-loading="dataListLoading" :data="dataList" row-key="id" element-loading-text="正在查询中。。。"
                      border fit highlight-current-row @selection-change="dataListSelectionChangeHandle">
                <el-table-column type="selection" width="55"/>
                <el-table-column label="序号" type="index" align="center" show-overflow-tooltip width="50px"/>
                <el-table-column align="center" label="类型" prop="type"/>
                <el-table-column align="center" label="编码" prop="code"/>
                <el-table-column align="center" label="名称" prop="name"/>
                <el-table-column align="center" label="排序序号" prop="orderNum"/>
                <el-table-column align="center" label="是否系统数据" prop="sys">
                    <template slot-scope="scope">
                        <el-tag >{{ sysDic[scope.row.sys] }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="备注" prop="remark"/>
                <el-table-column align="center" label="更新人" prop="orderNum"/>
                <el-table-column align="center" label="更新时间" prop="orderNum"/>
                <el-table-column align="center" label="操作" class-name="small-padding" width="80px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="add(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 弹窗, 新增 / 修改 -->
        <AddOrUpdate v-if="addOrUpdateVisible" :parentDataList="dataList" ref="addOrUpdate" @refreshDataList="getDataList"/>
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
      formMap: formMap,
      mixinViewModuleOptions: {
        getDataListURL: '/base/tree/list',
        getDataListIsPage: false,
        deleteURL: '/base/tree/delete',
        deleteIsBatch: true
      },
      dataForm: {
        type: undefined,
        code: undefined,
        name: undefined
      },
      dataFormOp: {
        likeOps: 'like'
      },
      rowHandler: {
        width: '160px',
        custom: [
          {
            text: this.$t('views.public.update'),
            type: 'primary',
            size: 'mini',
            emit: 'user-update',
            show: (index, row) => {
              return this.$hasPermission('sys:user:update')
            }
          },
          {
            text: this.$t('views.public.delete'),
            type: 'danger',
            size: 'mini',
            emit: 'user-delete',
            show: (index, row) => {
              return this.$hasPermission('sys:user:delete')
            }
          }
        ]
      },
      columns: data.data.form,
      sysDic: ['是', '否']
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    add (row) {
      let map = {}
      map.row = row
      this.addOrUpdateHandleSetter(map)
    },
    del (row) {
      debugger
      let map = {}
      map.row = row
      // this.deleteHandleSetter(map)
    }
  },
  created () {
    this.getDataList()
  }
}
</script>
