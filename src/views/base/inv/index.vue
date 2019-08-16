<template>
    <d2-container class="mod-sys__user">
        <el-form :inline="true" size="mini" :model="dataForm" @keyup.enter.native="getDataList()">
                <el-form-item>
                    <el-input
                            v-model="dataForm.productId"
                            :data-operate="dataFormOp.likeOps"
                            :placeholder="data.form.input.productId"
                            clearable/>
                </el-form-item>
                    <el-form-item>
                        <el-input
                                v-model="dataForm.warehouseId"
                                :data-operate="dataFormOp.likeOps"
                                :placeholder="data.form.input.warehouseId"
                                clearable/>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="getDataList()">{{ $t('views.public.query') }}</el-button>
                    </el-form-item>
        </el-form>
        <d2-crud
                :columns="columns"
                :options="options"
                selectionRow
                :loading="dataListLoading"
                :data="dataList"
                @selection-change="dataListSelectionChangeHandle"
                @sort-change="dataListSortChangeHandle"
                @user-update="addOrUpdateHandleSetter"
                @user-delete="deleteHandleSetter"
        ></d2-crud>
        <!-- 分页 -->
        <el-pagination
                slot="footer"
                :current-page="page"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="limit"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="pageSizeChangeHandle"
                @current-change="pageCurrentChangeHandle"
        ></el-pagination>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"/>
    </d2-container>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './add-or-update'
import data from './data'

export default {
  name: 'inv',
  mixins: [mixinViewModule],
  data () {
    return {
      data: data,
      mixinViewModuleOptions: {
        getDataListURL: '/base/reservation/list',
        getDataListIsPage: true,
        deleteURL: '/base/reservation',
        deleteIsBatch: true
      },
      dataForm: {
        productId: undefined,
        warehouseId: undefined
      },
      dataFormOp: {
        baseOp: 'like'
      },
      rowHandler: {
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
      columns: data.form.columns
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {}
}
</script>

<style>

</style>
