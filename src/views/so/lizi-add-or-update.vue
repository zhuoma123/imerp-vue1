<template>
  <el-dialog
          :title="!dataForm.id ? '新增' : '修改'"
          :close-on-click-modal="false"
          :visible.sync="visible"
          width="80%">
    <div slot="title" >
    <el-form :model="dataForm" labelSuffix="：" size="mini" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-row inline>
        <el-col :span="8" >
          <el-form-item label="客户" prop="customerId">
            <el-input v-model="dataForm.customerId" placeholder="客户" style="width:220px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" >
          <el-form-item label="销售日期" prop="orderDate">
            <el-date-picker v-model="dataForm.orderDate" placeholder="销售日期" style="width:160px"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" >
          <el-form-item label="要求交货期" prop="planDeliveryDate">
            <el-date-picker v-model="dataForm.planDeliveryDate" placeholder="要求交货期" style="width:160px"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row inline>
        <el-col :span="8" >
          <el-form-item label="发运方式" prop="shipType">
            <el-input v-model="dataForm.shipType" placeholder="发运方式"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" >
          <el-form-item label="订单金额" prop="orderAmount">
            <el-input v-model="dataForm.orderAmount" placeholder="订单金额"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row inline>
        <el-col :span="8" >
          <el-form-item label="收货人" prop="receiveName">
            <el-input v-model="dataForm.receiveName" placeholder="收货人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" >
          <el-form-item label="收货人电话" prop="receivePhone">
            <el-input v-model="dataForm.receivePhone" placeholder="收货人电话"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" >
      <el-form-item label="收货地址" prop="receiveAddress">
        <el-input v-model="dataForm.receiveAddress" placeholder="收货地址"></el-input>
      </el-form-item>
        </el-col>
      </el-row>




      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>

    </el-form>

    </div>
    <vxe-grid
            border
            resizable
            size="mini"
            highlight-current-row
            class="vxe-table-element"
            remote-filter
            ref="xGrid2"
            row-id="id"
            @edit-closed = "setTotal"
            :toolbar="toolbar"
            :proxy-config="itableProxy"
            :columns="itableColumn"
            :select-config="{reserve: true}"
            :mouse-config="{selected: true}"
            :keyboard-config="{isArrow: true, isDel: true, isTab: true, isEdit: true}"
            :edit-config="{trigger: 'dblclick', mode: 'cell'}">
    </vxe-grid>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
    import ElCol from "element-ui/packages/col/src/col";
    import ElInput from "../../../node_modules/element-ui/packages/input/src/input";
    import mixinViewModule from "@/mixins/view-module";
    export default {
        mixins: [mixinViewModule],
        components: {
            ElInput,
            ElCol},
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: "/so/salesorderline/list",
                    getDataListIsPage: false,
                    updateURL: "/so/salesorder/update",
                    deleteIsBatch: true,
                    prodURL: "/so/salesorder/prod"
                },

                visible: false,
                dataForm: {
                    id: 0,
                    orderType: 'SO',
                    orderNum: '',
                    customerId: '1',
                    orderDate: '2019-08-05',
                    pic: '销售员1',
                    shipType: '1',
                    planDeliveryDate: '2019-08-05',
                    status: '',
                    orderAmount: '',
                    receiveAddress: '地址',
                    receiveName: '收货人',
                    receivePhone: '收货电话',
                    remark: '',
                    deletedFlag: 'N'
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
                },

                restaurants: [
                    {id: 1, value: '前端', name: '前端' },
                    {id: 2, value: '后端', name: '后端' }
                ],

                itableColumn: [
                    { type: "selection", width: 30, align: "center" },
                    { type: "index", width: 30, align: "center" },
                    {
                        title: "物料名称",
                        field: "productName",
                        width: "200px",
                        align: "center",
                        editRender: {name: 'ElAutocomplete', props: {fetchSuggestions: this.prodSeach,triggerOnFocus:false }, events :{select: this.handleProcSelect}}
                    },
                    {
                        title: "当前库存",
                        field: "stock",
                        align: "left"
                    },
                    {
                        title: "指导售价",
                        field: "bPrice",
                        align: "left"
                    },
                    {
                        title: "下单数量",
                        field: "orderQty",
                        align: "left",
                        editRender: { name: 'input' }
                    },
                    {
                        title: "销售价",
                        field: "price",
                        sortable: true,
                        align: "center",
                        editRender: { name: 'input' }
                    },
                    {
                        title: "总金额",
                        field: "totalPrice",
                        align: "center",
                        formatter : ['toFixedString', 2]
                    },
                    {
                        title: "条码",
                        field: "barCode",
                        align: "center"
                    },
                    {
                        title: "品牌",
                        field: "brand",
                        align: "center"
                    },
                    {
                        title: "车型",
                        field: "vehicle",
                        align: "center"
                    },
                    {
                        title: "产地",
                        field: "madein",
                        align: "center"
                    },
                    {
                        title: "规格属性",
                        field: "specialParam",
                        align: "center"
                    }


                ],

                itableProxy: {
                    index: true, // 启用动态序号代理
                    sort: true, // 启用排序代理
                    filter: true, // 启用筛选代理
                    ajax: {
                        query: ({ page, sort, filters }) => {
                            // 处理排序条件
                            let formData = {
                                sort: sort.property,
                                order: sort.order
                            };
                            // 处理筛选条件
                            filters.forEach(({ column, property, values }) => {
                                formData[property] = values.join(",");
                            });
                            return new Promise(async (resolve, reject) => {
                                await this.$axios.post(
                                    this.mixinViewModuleOptions.getDataListURL,
                                    {
                                        pageForm: {
                                            order: this.order,
                                            orderField: this.orderField,
                                            page: this.mixinViewModuleOptions.getDataListIsPage ? this.page : null,
                                            limit: this.mixinViewModuleOptions.getDataListIsPage ? this.limit : null
                                        },
                                        dataForm: {
                                            data: this.dataForm
                                        }
                                    }
                                ).then(res => {
                                    this.dataList = res
                                })
                                resolve({
                                    total: this.total,
                                    list: this.dataList
                                })
                            })
                        },
                        save: ({ body }) => {console.log(body)}

                    },
                    props: {
                        list: 'list',
                        result: 'list',
                        total: 'totalCount'
                    }
                },
                toolbar: {
                    id: "full_edit_1",
                    buttons: [
                        { code: "insert_actived", name: "新增" },
                        { code: "remove_selection", name: "删除" },
                        { code: "save", name: "保存" }
                    ],
                    resizable: {
                        storage: true
                    },
                    setting: {
                        storage: true
                    }
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
                var line = this.saveAll();
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        this.$axios.post(
                            this.mixinViewModuleOptions.updateURL,
                            {
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
                                'updateDate': this.dataForm.updateDate,
                                'lineList': line
                            }
                        ).then(({data}) => {
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
            },


            prodSeach (queryString, cb) {
                var restaurants = this.restaurants
                var results =[];

                if(queryString){
                    this.$axios.post(
                      this.mixinViewModuleOptions.prodURL,
                      {name:queryString}
                  ).then(res => {
                      for(var i=0;i<res.length;i++){
                          res[i].value = res[i].val;
                      }
                      debugger
                      results = res;
                      clearTimeout(this.timeout);
                      this.timeout = setTimeout(() => {
                          cb(res);
                      }, 100 * Math.random());
                  });
                }
//                clearTimeout(this.timeout)
//                this.timeout = setTimeout(() => {
//                    cb(results)
//                }, 100 * Math.random())
            },
            handleProcSelect(t,item) {
//                var row = this.$refs.xGrid2.getCurrentRow();
                var row = t.row;
                if(item){
                    debugger
                    row.barCode = item.barCode;
                    row.brand = item.brand;
                    row.vehicle = item.vehicle;
                    row.madein = item.madein;
                    row.specialParam = item.specialParam;
                    row.stock = item.stock;
                    row.bPrice = item.salePrice;
                }else{

                }


            },

            saveAll(){
                var d = this.getItemListDate(this.$refs.xGrid2);
                console.log(d);
            },
            setTotal({column,row}){
                if(column.property == "orderQty" || column.property == "price" ){
                    var qty = row.orderQty;
                    var price = row.price;
                    if(!Number.isNaN(qty) && !Number.isNaN(price)){
                        row.totalPrice = Number(qty)*Number(price).toFixed(2);
                    }
                }

                console.log(row.totalPrice);
                console.log(column);
                console.log(row);
            }

        }
    }
</script>
