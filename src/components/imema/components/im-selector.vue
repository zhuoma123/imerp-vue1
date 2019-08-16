<template>
  <el-select 
    :value="selectVal"
    filterable 
    :placeholder="placeholder"
    remote 
    automatic-dropdown
    default-first-option 
    :loading="loading"
    :remote-method="_selCustList" 
    @change="e => _selChange(e)">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.key"
      :value="item">
    </el-option>
  </el-select>
</template>

<script>
import { last, get } from 'lodash'

// dataType对应的映射，用于生成对应的服务器访问地址
const TYPE_MAP = {
  customer: {
    text: '请选择客户',
    url: 'biz/customer'
  }
}

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    // 组件业务类型
    dataType: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      dataForm: {
        //customerId: 1
      },
      selectVal: this.value,
      loading: false,
      placeholder:'',
      options: []
    }
  },
  mounted () {
    this._selCustList('')
    this.placeholder = get(TYPE_MAP, this.dataType).text
  },
  methods: {
    _selCustList (query) {
      this.loading = true;
      this.$axios.post (
        '/common/' + get(TYPE_MAP, this.dataType).url.replace(/^\//, ''),
        {query: query}
      ).then(res => {
        this.loading = false;
        if (res && res.length > 0) {
          this.options = res
        } else
          this.options = []
      })
    },
    _selChange (e) {
      this.selectVal = e
      this.$emit('change', e)
    }
  },
  watch:{
      //判断下拉框的值是否有改变
      value(val) {
        this.selectVal = val //②监听外部对props属性result的变更，并同步到组件内的data属性myResult中
      },
      //③组件内对myResult变更后向外部发送事件通知
      selectVal (val, oldVal){
        this.$emit("input", val)
      }
  }
}
</script>

<style lang="scss" scoped>
.im-selector {
  
}
</style>
