import qs from 'qs'
export default {
  data () {
    
    return {
      /* 客户下拉框数组 */
      d_custSelect: {
        remoteURL:'/common/biz/customer',
        dataList: [],
        loading: false
      }
    }
    
  },
  methods: {
    /* 客户下拉框事件 begin */
    _selCustList(queryString){
        this.d_custSelect.loading = true;
        this.$axios
          .post(this.d_custSelect.remoteURL, {query: queryString })
          .then(res => {
            this.d_custSelect.dataList = res;
          }).catch(() => {
            this.d_custSelect.dataList = [];
          })
          this.d_custSelect.loading = false;
    },
    _selectCust(item, key,val){
      // this.dataForm[val] = item.key;
      // this.dataForm[key] = item.value;
    }
    /* 客户下拉框事件 end */
  },
  watch: {
    visible: function () {
      if(this.dataForm && this.dataForm.customerId) {
        this.d_custSelect.dataList = [{key:this.dataForm.customerName,value:this.dataForm.customerId}];
      }
    }
  },
  created () {
  },
  mounted () {
  }
}
