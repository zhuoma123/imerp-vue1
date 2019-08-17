<template>
  <d2-container class="mod-sys__user">
    <el-form :inline="true" size="mini" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input
          v-model="dataForm.companyName"
          :placeholder="$t('views.public.common.companyName')"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="dataForm.warehouseCode"
          :placeholder="$t('views.public.common.warehouseCode')"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-input
                v-model="dataForm.productCode"
                :placeholder="$t('views.public.common.productCode')"
                clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getDataList()">{{ $t('views.public.query') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="$hasPermission('inv:onhand:export')"
          type="info"
          @click="exportHandle()"
        >{{ $t('views.public.export') }}</el-button>
      </el-form-item>
    </el-form>
    <d2-crud
      :columns="columns"
      :options="options"
      :loading="dataListLoading"
      :data="dataList"
      @sort-change="dataListSortChangeHandle"
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
  </d2-container>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/inv/onhand/list',
        getDataListIsPage: true,
        exportURL: '/inv/onhand/export'
      },
      dataForm: {
        companyName: '',
        warehouseCode: '',
        productCode: ''
      },
      columns: [
        {
          title: this.$t('views.public.common.companyName'),
          key: 'companyName',
          sortable: true,
          align: 'center'
        },
        {
          title: this.$t('views.public.common.warehouseCode'),
          key: 'warehouseCode',
          sortable: true,
          align: 'center'
        },
        {
          title: this.$t('views.public.common.productCode'),
          key: 'productCode',
          sortable: true,
          align: 'center'
        },
        {
          title: this.$t('views.public.common.uom'),
          key: 'uom',
          sortable: true,
          align: 'center'
        },
        {
          title: this.$t('views.public.onhand.inventoryQuantity'),
          key: 'inventoryQuantity',
          sortable: true,
          align: 'center'
        },
        {
          title: this.$t('views.public.onhand.price'),
          key: 'price',
          sortable: true,
          align: 'center'
        }
      ]
    }
  }
}
</script>
