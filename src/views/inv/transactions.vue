<template>
  <d2-container class="mod-sys__user">
    <el-form :inline="true" size="mini" :model="dataForm" @keyup.enter.native="getDataList()">
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
        <el-date-picker
                v-model="dataForm.beginTransactionDate"
                type="date"
                :editable="false"
                :clearable="false"
                :placeholder="$t('views.public.transactions.beginTransactionDate')">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker
                v-model="dataForm.endTransactionDate"
                type="date"
                :editable="false"
                :clearable="false"
                :placeholder="$t('views.public.transactions.endTransactionDate')">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-input
                v-model="dataForm.tranType"
                :placeholder="$t('views.public.transactions.tranType')"
                clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getDataList()">{{ $t('views.public.query') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="$hasPermission('inv:transactions:export')"
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
        getDataListURL: '/inv/transactions/list',
        getDataListIsPage: true,
        exportURL: '/inv/transactions/export'
      },
      dataForm: {
        warehouseCode: '',
        productCode: '',
        beginTransactionDate: new Date(),
        endTransactionDate: new Date(),
        tranType: ''
      },
      columns: [
        {
          title: this.$t('views.public.common.companyName'),
          key: 'companyName',
          sortable: true,
          align: 'center',
          minWidth: '100'
        },
        {
          title: this.$t('views.public.common.warehouseCode'),
          key: 'warehouseCode',
          sortable: true,
          align: 'center',
          minWidth: '100'
        },
        {
          title: this.$t('views.public.common.productCode'),
          key: 'productCode',
          sortable: true,
          align: 'center',
          minWidth: '100'
        },
        {
          title: this.$t('views.public.transactions.sourceCode'),
          key: 'sourceCode',
          sortable: true,
          align: 'center',
          minWidth: '100'
        },
        {
          title: this.$t('views.public.transactions.transactionReference'),
          key: 'transactionReference',
          sortable: true,
          align: 'center',
          minWidth: '140'
        },
        {
          title: this.$t('views.public.transactions.transactionQuantity'),
          key: 'transactionQuantity',
          sortable: true,
          align: 'center',
          minWidth: '100'
        },
        {
          title: this.$t('views.public.transactions.transactionUom'),
          key: 'transactionUom',
          sortable: true,
          align: 'center',
          minWidth: '100'
        },
        {
          title: this.$t('views.public.common.salePrice'),
          key: 'salePrice',
          sortable: true,
          align: 'center',
          minWidth: '100'
        },
        {
          title: this.$t('views.public.common.costPrice'),
          key: 'costPrice',
          sortable: true,
          align: 'center',
          minWidth: '100'
        },
        {
          title: this.$t('views.public.transactions.transactionDate'),
          key: 'transactionDate',
          sortable: true,
          align: 'center',
          minWidth: '100'
        },
        {
          title: this.$t('views.public.transactions.tranType'),
          key: 'tranType',
          sortable: true,
          align: 'center',
          minWidth: '100'
        },
        {
          title: this.$t('views.public.transactions.priorQuantity'),
          key: 'priorQuantity',
          sortable: true,
          align: 'center',
          minWidth: '100'
        },
        {
          title: this.$t('views.public.transactions.balanceQuantity'),
          key: 'balanceQuantity',
          sortable: true,
          align: 'center',
          minWidth: '100'
        },
        {
          title: this.$t('views.public.transactions.employeeName'),
          key: 'employeeName',
          sortable: true,
          align: 'center',
          minWidth: '120'
        }
      ]
    }
  }
}
</script>
