<template>
  <el-dialog
          :title="!dataForm.id ? '新增' : '修改'"
          :close-on-click-modal="false"
          :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="订单类型(销售/退货/报价)" prop="orderType">
        <el-input v-model="dataForm.orderType" placeholder="订单类型(销售/退货/报价)"></el-input>
      </el-form-item>
      <el-form-item label="订单号" prop="orderNum">
        <el-input v-model="dataForm.orderNum" placeholder="订单号"></el-input>
      </el-form-item>
      <el-form-item label="客户id" prop="customerId">
        <el-input v-model="dataForm.customerId" placeholder="客户id"></el-input>
      </el-form-item>
      <el-form-item label="销售日期" prop="orderDate">
        <el-input v-model="dataForm.orderDate" placeholder="销售日期"></el-input>
      </el-form-item>
      <el-form-item label="业务员id" prop="pic">
        <el-input v-model="dataForm.pic" placeholder="业务员id"></el-input>
      </el-form-item>
      <el-form-item label="要求交货期" prop="planDeliveryDate">
        <el-input v-model="dataForm.planDeliveryDate" placeholder="要求交货期"></el-input>
      </el-form-item>
      <el-form-item label="单据状态" prop="status">
        <el-input v-model="dataForm.status" placeholder="单据状态"></el-input>
      </el-form-item>
      <el-form-item label="订单金额" prop="orderAmount">
        <el-input v-model="dataForm.orderAmount" placeholder="订单金额"></el-input>
      </el-form-item>
      <el-form-item label="收货地址" prop="receiveAddress">
        <el-input v-model="dataForm.receiveAddress" placeholder="收货地址"></el-input>
      </el-form-item>
      <el-form-item label="收货人" prop="receiveName">
        <el-input v-model="dataForm.receiveName" placeholder="收货人"></el-input>
      </el-form-item>
      <el-form-item label="收货人电话" prop="receivePhone">
        <el-input v-model="dataForm.receivePhone" placeholder="收货人电话"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="公司" prop="companyId">
        <el-input v-model="dataForm.companyId" placeholder="公司"></el-input>
      </el-form-item>
      <el-form-item label="删除标记" prop="deletedFlag">
        <el-input v-model="dataForm.deletedFlag" placeholder="删除标记"></el-input>
      </el-form-item>
      <el-form-item label="创建人" prop="createBy">
        <el-input v-model="dataForm.createBy" placeholder="创建人"></el-input>
      </el-form-item>
      <el-form-item label="创建日期" prop="createDate">
        <el-input v-model="dataForm.createDate" placeholder="创建日期"></el-input>
      </el-form-item>
      <el-form-item label="修改人" prop="updateBy">
        <el-input v-model="dataForm.updateBy" placeholder="修改人"></el-input>
      </el-form-item>
      <el-form-item label="修改日期" prop="updateDate">
        <el-input v-model="dataForm.updateDate" placeholder="修改日期"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
    export default {
        data () {
            return {
                visible: false,
                dataForm: {
                    id: 0,
                    orderType: '',
                    orderNum: '',
                    customerId: '',
                    orderDate: '',
                    pic: '',
                    planDeliveryDate: '',
                    status: '',
                    orderAmount: '',
                    receiveAddress: '',
                    receiveName: '',
                    receivePhone: '',
                    remark: '',
                    companyId: '',
                    deletedFlag: '',
                    createBy: '',
                    createDate: '',
                    updateBy: '',
                    updateDate: ''
                },
                dataRule: {
                    orderType: [
                        { required: true, message: '订单类型(销售/退货/报价)不能为空', trigger: 'blur' }
                    ],
                    orderNum: [
                        { required: true, message: '订单号不能为空', trigger: 'blur' }
                    ],
                    customerId: [
                        { required: true, message: '客户id不能为空', trigger: 'blur' }
                    ],
                    orderDate: [
                        { required: true, message: '销售日期不能为空', trigger: 'blur' }
                    ],
                    pic: [
                        { required: true, message: '业务员id不能为空', trigger: 'blur' }
                    ],
                    planDeliveryDate: [
                        { required: true, message: '要求交货期不能为空', trigger: 'blur' }
                    ],
                    status: [
                        { required: true, message: '单据状态不能为空', trigger: 'blur' }
                    ],
                    orderAmount: [
                        { required: true, message: '订单金额不能为空', trigger: 'blur' }
                    ],
                    receiveAddress: [
                        { required: true, message: '收货地址不能为空', trigger: 'blur' }
                    ],
                    receiveName: [
                        { required: true, message: '收货人不能为空', trigger: 'blur' }
                    ],
                    receivePhone: [
                        { required: true, message: '收货人电话不能为空', trigger: 'blur' }
                    ],
                    remark: [
                        { required: true, message: '备注不能为空', trigger: 'blur' }
                    ],
                    companyId: [
                        { required: true, message: '公司不能为空', trigger: 'blur' }
                    ],
                    deletedFlag: [
                        { required: true, message: '删除标记不能为空', trigger: 'blur' }
                    ],
                    createBy: [
                        { required: true, message: '创建人不能为空', trigger: 'blur' }
                    ],
                    createDate: [
                        { required: true, message: '创建日期不能为空', trigger: 'blur' }
                    ],
                    updateBy: [
                        { required: true, message: '修改人不能为空', trigger: 'blur' }
                    ],
                    updateDate: [
                        { required: true, message: '修改日期不能为空', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            init (id) {
                this.dataForm.id = id || 0
                this.visible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                    if (this.dataForm.id) {
                        this.$http({
                            url: this.$http.adornUrl(`/so/salesorder/info/${this.dataForm.id}`),
                            method: 'get',
                            params: this.$http.adornParams()
                        }).then(({data}) => {
                            if (data && data.code === 0) {
                                this.dataForm.orderType = data.salesorder.orderType
                                this.dataForm.orderNum = data.salesorder.orderNum
                                this.dataForm.customerId = data.salesorder.customerId
                                this.dataForm.orderDate = data.salesorder.orderDate
                                this.dataForm.pic = data.salesorder.pic
                                this.dataForm.planDeliveryDate = data.salesorder.planDeliveryDate
                                this.dataForm.status = data.salesorder.status
                                this.dataForm.orderAmount = data.salesorder.orderAmount
                                this.dataForm.receiveAddress = data.salesorder.receiveAddress
                                this.dataForm.receiveName = data.salesorder.receiveName
                                this.dataForm.receivePhone = data.salesorder.receivePhone
                                this.dataForm.remark = data.salesorder.remark
                                this.dataForm.companyId = data.salesorder.companyId
                                this.dataForm.deletedFlag = data.salesorder.deletedFlag
                                this.dataForm.createBy = data.salesorder.createBy
                                this.dataForm.createDate = data.salesorder.createDate
                                this.dataForm.updateBy = data.salesorder.updateBy
                                this.dataForm.updateDate = data.salesorder.updateDate
                            }
                        })
                    }
                })
            },
            // 表单提交
            dataFormSubmit () {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: this.$http.adornUrl(`/so/salesorder/${!this.dataForm.id ? 'save' : 'update'}`),
                            method: 'post',
                            data: this.$http.adornData({
                                'id': this.dataForm.id || undefined,
                                'orderType': this.dataForm.orderType,
                                'orderNum': this.dataForm.orderNum,
                                'customerId': this.dataForm.customerId,
                                'orderDate': this.dataForm.orderDate,
                                'pic': this.dataForm.pic,
                                'planDeliveryDate': this.dataForm.planDeliveryDate,
                                'status': this.dataForm.status,
                                'orderAmount': this.dataForm.orderAmount,
                                'receiveAddress': this.dataForm.receiveAddress,
                                'receiveName': this.dataForm.receiveName,
                                'receivePhone': this.dataForm.receivePhone,
                                'remark': this.dataForm.remark,
                                'companyId': this.dataForm.companyId,
                                'deletedFlag': this.dataForm.deletedFlag,
                                'createBy': this.dataForm.createBy,
                                'createDate': this.dataForm.createDate,
                                'updateBy': this.dataForm.updateBy,
                                'updateDate': this.dataForm.updateDate
                            })
                        }).then(({data}) => {
                            if (data && data.code === 0) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 1500,
                                    onClose: () => {
                                        this.visible = false
                                        this.$emit('refreshDataList')
                                    }
                                })
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    }
                })
            }
        }
    }
</script>
