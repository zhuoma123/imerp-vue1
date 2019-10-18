<template>
  <el-dialog
    :title="isNew ? '收付款单新增' : '收付款单修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    v-loading.fullscreen.lock="fullscreenLoading"
    class="abow_dialog max_heigth"
    width="50%"
  >
    <div>
      <dynamic-form
        v-model="dataForm"
        :formprops="formprops"
        ref="dataForm"
        :alldescriptors="descriptors"
      ></dynamic-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="btnDisable" @click="dataFormSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
import XEUtils from "xe-utils";
const separate = { type: "separate" };
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/fin/realpayrecline/list",
        updateURL: "/fin/realpayrec/save",
        deleteIsBatch: true,
        getDataListIsPage: false
      },
      visible: false,
      btnDisable: false,
      dataForm: {
        custId: null,
        custName: null,
        payDate: new Date(),
        summary: null,
        summaryMean: null,
        sourceOrderNum: null,
        amount: null,
        gatheringTypeName: null,
        gatheringType: null,
        salesman: null,
        pic: null,
        remark: null
      },
      descriptors: {
        custName: {
          type: "cust",
          label: "往来单位",
          placeholder: "请输入单位名称",
          name: "im-selector",
          props: {
            mapKeyVal: "custName:custId",
            dataType: "biz.customervendor",
            clearable: true
          }
        },
        separate1: separate,
        sourceOrderNum: {
          type: "string",
          label: "业务单号",
          props: {
            clearable: true
          }
        },
        separate2: separate,
        summaryMean: {
            type: 'cust',
            label: '收付款类型',
            placeholder: '请选择收付款类型',
            name: 'im-selector',
            props: {
              mapKeyVal: "summaryMean:summary",
              dataType: "dict.GATHERING_TYPE",
              clearable: true
            }
          },
          separate3: separate,
        amount: {
          type: "string",
          label: "收付款金额"
        },
        separate4: separate,
        gatheringTypeName: {
          type: "cust",
          label: "收/付款账号",
          name: "im-selector",
          props: {
            mapKeyVal: "gatheringTypeName:gatheringType",
            dataType: "biz.gatheringType",
            clearable: true
          }
        },
        separate5: separate,
        salesman: {
          type: "cust",
          label: "业务员",
          name: "im-selector",
          props: {
            mapKeyVal: "salesman:",
            dataType: "biz.employee",
            clearable: true
          }
        },
        separate6: separate,
        pic: {
          type: "cust",
          label: "经办人",
          name: "im-selector",
          props: {
            mapKeyVal: "pic:",
            dataType: "biz.employee",
            clearable: true
          }
        },
        separate7: separate,
        payDate: {
          name: "el-date-picker",
          type: "cust",
          label: "收/付款日期",
          props: {
            valueFormat: "yyyy-MM-dd"
          }
        },
        separate8: separate,
        remark: {
          type: "string",
          label: "备注"
        }
      }
    };
  },
  methods: {},
  mounted() {}
};
</script>


<style lang="scss" scoped>
.max_heigth {
  height: 500px;
  overflow: auto;
}
</style>
