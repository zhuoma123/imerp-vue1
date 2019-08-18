<template>
  <d2-container class="mod-sys__user">
    <el-form :inline="true" size="mini" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input
          v-model="dataForm.name"
          :data-operate="dataFormOp.name"
          :placeholder="$t('views.public.menu.name')"
          clearable
        />
      </el-form-item>

      <el-form-item>
        <el-button @click="getDataList()">{{ $t('views.public.query') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="$hasPermission('sys:menu:save')"
          type="primary"
           icon="el-icon-edit"
          @click="addOrUpdateHandle({})"
        >{{ $t('views.public.add') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="$hasPermission('sys:menu:delete')"
          type="danger"
           icon="el-icon-delete"
          @click="deleteHandle()"
        >{{ $t('views.public.deleteBatch') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="$hasPermission('sys:menu:export')"
          type="info"
          @click="exportHandle()"
        >{{ $t('views.public.export') }}</el-button>
      </el-form-item>
    </el-form>
    <d2-crud
      :columns="columns"
      :options="options"
      selectionRow
      :row-handle="rowHandler"
      :loading="dataListLoading"
      :data="dataList"
      @selection-change="dataListSelectionChangeHandle"
      @sort-change="dataListSortChangeHandle"
      @user-update="addOrUpdateHandle"
      @user-delete="deleteHandle"
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
  </d2-container>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './user-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/menu/list',
        getDataListIsPage: true,
        deleteURL: '/sys/menu',
        deleteIsBatch: true,
        exportURL: '/sys/menu/export'
      },
      dataForm: {
        name: ''
      },
      dataFormOp: {
        name: 'like'
      },
      rowHandler: {
        custom: [
          {
            text: this.$t('views.public.update'),
            type: 'primary',
            size: 'mini',
            emit: 'user-update',
            show: (index, row) => {
              return this.$hasPermission('sys:menu:update')
            }
          },
          {
            text: this.$t('views.public.delete'),
            type: 'danger',
            size: 'mini',
            emit: 'user-delete',
            show: (index, row) => {
              return this.$hasPermission('sys:menu:delete')
            }
          }
        ]
      },
      columns: [
        {
          title: this.$t('views.public.menu.name'),
          key: 'name',
          sortable: true,
          align: 'center'
        },
        {
          title: this.$t('views.public.menu.parentId'),
          key: 'parentId',
          sortable: true,
          align: 'center'
        },
        {
          title: this.$t('views.public.menu.url'),
          key: 'url',
          sortable: true,
          align: 'center'
        },
        {
          title: this.$t('views.public.menu.perms'),
          key: 'perms',
          sortable: true,
          align: 'center'
        },
        {
          title: this.$t('views.public.menu.type'),
          key: 'type',
          sortable: true,
          align: 'center'
        },
        {
          title: this.$t('views.public.menu.icon'),
          key: 'icon',
          sortable: true,
          align: 'center'
        },
        {
          title: this.$t('views.public.menu.orderNum'),
          key: 'orderNum',
          sortable: true,
          align: 'center'
        }
      ]
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {

  }

}

</script>

<style>

</style>
