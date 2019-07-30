<template>
  <d2-container class="mod-sys__user">
    <el-form :inline="true" size="mini" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input
          v-model="dataForm.username"
          :data-operate="dataFormOp.username"
          :placeholder="$t('views.public.user.username')"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="dataForm.mobile"
          :data-operate="dataFormOp.mobile"
          :placeholder="$t('views.public.user.mobile')"
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
          @click="addOrUpdateHandle()"
        >{{ $t('views.public.add') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="$hasPermission('sys:user:delete')"
          type="danger"
          @click="deleteHandle()"
        >{{ $t('views.public.deleteBatch') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="$hasPermission('sys:user:export')"
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
import mixinViewModule from "@/mixins/view-module";
import AddOrUpdate from "./user-add-or-update";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/sys/user/list",
        getDataListIsPage: true,
        deleteURL: "/sys/user",
        deleteIsBatch: true,
        exportURL: "/sys/user/export"
      },
      dataForm: {
        username: "",
        mobile:""
      },
      dataFormOp: {
        username: "like"
      },
      rowHandler: {
        custom: [
          {
            text: this.$t("views.public.update"),
            type: 'primary',
            size: 'mini',
            emit: 'user-update',
            show: (index, row) => {
              return this.$hasPermission("sys:user:update");
            }
          },
          {
            text: this.$t("views.public.delete"),
            type: 'danger',
            size: 'mini',
            emit: 'user-delete',
            show: (index, row) => {
              return this.$hasPermission("sys:user:delete");
            }
          }
        ]
      },
      columns: [
        {
          title: this.$t("views.public.user.username"),
          key: "username",
          sortable: true,
          align: "center"
        },
        {
          title: this.$t("views.public.user.deptName"),
          key: "deptName",
          sortable: true,
          align: "center"
        },
        {
          title: this.$t("views.public.user.email"),
          key: "email",
          sortable: true,
          align: "center"
        },
        {
          title: this.$t("views.public.user.mobile"),
          key: "mobile",
          sortable: true,
          align: "center"
        },
        {
          title: this.$t("views.public.user.status"),
          key: "status",
          align: "center",
          width: "70px",
          component: {
            render: function(createElement) {
              let s = 'views.public.user.status'+ this.scope.row.status
              let type = this.scope.row.status == '0' ? 'danger' : 'success'
              return createElement(
                "el-tag",
                {
                  attrs: {
                    type,
                    size: 'mini'
                  }
                },
                `${this.$t(s)}`
              );
            }
          }
        },
        {
          title: this.$t("views.public.createDate"),
          key: "createDate",
          sortable: true,
          align: "center"
        }
      ]
    };
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
