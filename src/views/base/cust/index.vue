<template>
    <d2-container class="mod-sys__user">
        <el-form :inline="true" size="mini" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item>
                <el-input
                        v-model="dataForm.name"
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
            <el-form-item>
                <el-button
                        v-if="$hasPermission('sys:user:export')"
                        type="info"
                        @click="exportHandle()"
                >{{ $t('views.public.export') }}
                </el-button>
            </el-form-item>
        </el-form>
        <el-card>
            <!-- 查询结果 -->
            <el-table v-loading="dataListLoading" :data="dataList" row-key="id" element-loading-text="正在查询中。。。"
                      border fit highlight-current-row @selection-change="dataListSelectionChangeHandle"
                      @row-dblclick="add">
                <el-table-column type="selection" width="36"/>
                <el-table-column label="序号" type="index" align="center" show-overflow-tooltip width="50px"/>
                <el-table-column label="客户|供应商" align="center" prop="custVendor">
                    <template slot-scope="scope">
                        <el-tag >{{ vendor[scope.row.custVendor] }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="名称" align="center" prop="name"/>
                <el-table-column label="编号" align="center" prop="code"/>
                <el-table-column label="职称" align="center" prop="shortName"/>
                <el-table-column label="类型" align="center" prop="type"/>
                <el-table-column label="公司电话" align="center" prop="tel"/>
                <el-table-column label="公司传真" align="center" prop="fax"/>
                <el-table-column label="公司邮箱" align="center" prop="email"/>
                <el-table-column label="公司微信" align="center" prop="mm"/>
                <el-table-column label="公司地址" align="center" prop="companyAddress"/>
                <el-table-column label="法人" align="center" prop="legalMan"/>
                <el-table-column label="公司网址" align="center" prop="webSite"/>
                <el-table-column label="开户银行" align="center" prop="bank"/>
                <el-table-column label="银行账号" align="center" prop="bankAccount"/>
                <el-table-column label="纳税号" align="center" prop="taxNum"/>
                <el-table-column label="拼音码" align="center" prop="pinyinCode"/>
                <el-table-column label="五笔码" align="center" prop="wbCode"/>
                <el-table-column label="业务员" align="center" prop="pic"/>
                <el-table-column label="备注" align="center" prop="remark"/>
                <el-table-column label="更新人" align="center" prop="updateBy"/>
                <el-table-column label="更新时间" align="center" prop="updateDate"/>
                <el-table-column align="center" label="操作" class-name="small-padding" width="160px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="addOrUpdateHandleSetter(scope)">编辑</el-button>
                        <el-button type="danger" size="mini" @click="deleteHandleSetter(scope)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
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

export default {
  name: 'cust',
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/base/cust/list',
        getDataListIsPage: true,
        deleteURL: '/base/cust/delete',
        deleteIsBatch: true
      },
      dataForm: {
        custVendor: undefined,
        code: undefined,
        name: undefined,
        shortName: undefined,
        type: undefined,
        tel: undefined,
        fax: undefined,
        email: undefined,
        mm: undefined,
        companyId: undefined,
        companyAddress: undefined,
        legalMan: undefined,
        webSite: undefined,
        bank: undefined,
        bankAccount: undefined,
        taxNum: undefined,
        pinyinCode: undefined,
        wbCode: undefined,
        pic: undefined,
        remark: undefined
      },
      dataFormOp: {
        username: 'like'
      },
      vendor: {
        CUST: '顾客',
        VENDOR: '供应商'
      }
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
