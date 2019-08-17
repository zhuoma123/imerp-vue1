<template>
  <d2-container >

    <el-form slot="header" size="mini" :inline="true" :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()"
             label-width="90px" label-suffix="：" style="margin-bottom: -18px;">

      <el-row >
        <el-col :span="6">
          <el-form-item label="客户名称" prop="custName">
            <el-input style="display: none" v-model="dataForm.custId" ></el-input>
            <el-input v-model="dataForm.custName" clearable />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="单据状态" >
            <el-select v-model="dataForm.status" placeholder="请选择单据状态">
              <el-option label="新建" value="NEW"></el-option>
              <el-option label="已提交" value="SUBMIT"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下单时间">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="dataForm.bDate" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line" align="center" :span="1">-</el-col>
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="dataForm.eDate" style="width: 100%;"></el-date-picker>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row >
        <el-col :span="6">
          <el-form-item label="配送方式" prop="shipType">
            <el-input v-model="dataForm.shipType" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收货地址">
            <el-input v-model="dataForm.receiveAddress" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收货人/手机" label-width="100px">
            <el-input v-model="dataForm.receiveName" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row >
        <el-col :span="6">
          <el-form-item label="销售员">
            <el-input v-model="dataForm.pic" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="配件信息">
            <el-input v-model="dataForm.productId" style="display:none"/>
            <el-input v-model="dataForm.productName" placeholder="名称/品牌/产地/车型/图号" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getDataList()" >{{ $t('views.public.query') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
                    @click="handleFormReset">
              <d2-icon name="refresh"/>
              重置
            </el-button>
          </el-form-item>

          <el-form-item>
            <el-button v-if="$hasPermission('so:salesorder:save')" type="success" @click="addOrUpdateHandle()" >{{ $t('views.public.add') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-if="$hasPermission('so:salesorder:delete')" type="danger" @click="deleteHandle()" >{{ $t('views.public.deleteBatch') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-if="$hasPermission('so:salesorder:export')" type="info" @click="exportHandle()" >{{ $t('views.public.export') }}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
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
import AddOrUpdate from './lizi-add-or-update'
import ElInput from '../../../node_modules/element-ui/packages/input/src/input'
import ElCol from 'element-ui/packages/col/src/col'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/so/salesorder/list',
        getDataListIsPage: true,
        updateURL: '/so/salesorder/update',
        deleteURL: '/so/salesorder/delete',
        deleteIsBatch: true,
        exportURL: '/so/salesorder/export'
      },
      dataForm: {
        bDate: new Date(),
        custName: '11'
      },
      dataFormOp: {
        username: 'like'
      },
      rowHandler: {
        width: 160,
        custom: [
          {
            text: this.$t('views.public.update'),
            type: 'primary',
            size: 'mini',
            emit: 'user-update',
            show: (index, row) => {
              return this.$hasPermission('so:salesorder:update')
            }
          },
          {
            text: this.$t('views.public.delete'),
            type: 'danger',
            size: 'mini',
            emit: 'user-delete',
            show: (index, row) => {
              return this.$hasPermission('so:salesorder:delete')
            }
          }
        ]
      },
      columns: [
        {
          title: '下单日期',
          key: 'orderDate',
          sortable: true,
          width: '100px',
          align: 'center'
        },
        {
          title: '销售单号',
          key: 'orderNum',
          sortable: true,
          align: 'center'
        },
        {
          title: '客户名称',
          key: 'custName',
          sortable: true,
          align: 'left'
        },
        {
          title: '状态',
          key: 'status',
          sortable: true,
          align: 'left'
        },
        {
          title: '订单金额',
          key: 'orderAmount',
          sortable: true,
          align: 'left'
        },
        {
          title: '发运方式',
          key: 'shipType',
          sortable: true,
          align: 'center'
        },
        {
          title: '销售员',
          key: 'pic',
          sortable: true,
          align: 'center'
        },
        {
          title: this.$t('views.public.user.status'),
          key: 'status',
          align: 'center',
          width: '70px'
          // component: {
          //     render: function(createElement) {
          //         let s = "新增"
          //         let type = this.scope.row.status == 'NEW' ? 'danger' : 'success'
          //         return createElement(
          //             "el-tag",
          //             {
          //                 attrs: {
          //                     type,
          //                     size: 'mini'
          //                 }
          //             },
          //             `${this.$t(s)}`
          //         );
          //     }
          // }
        },
        {
          title: this.$t('views.public.createDate'),
          key: 'createDate',
          sortable: true,
          align: 'center'
        }
      ]
    }
  },
  components: {
    ElCol,
    ElInput,
    AddOrUpdate
  },
  methods: {
    handleFormReset () {
      this.$refs.dataForm.resetFields()
    }
  }
}
</script>

<style>

</style>
