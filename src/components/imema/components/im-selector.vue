<template>
  <el-select 
    :value="selectVal"
    :filterable="selType == 'dyamic'"
    :placeholder="placeholder"
    :remote="selType == 'dyamic'" 
    :automatic-dropdown="selType == 'dyamic'"
    default-first-option 
    :loading="loading"
    :remote-method="_selDyamicList" 
    @change="e => _selChange(e)">
    <el-option
      v-for="item in options"
      :key="item.key"
      :label="item.key"
      :value="item">
    </el-option>
  </el-select>
</template>

<script>
import { last, get } from 'lodash'
import { Promise } from 'q';

// dataType对应的映射，用于生成对应的服务器访问地址
const TYPE_MAP = {
  customer: {
    text: '请选择客户',
    url: 'biz/customer',
    type: 'dyamic'
  },
  code: {
    text: '请选择',
    url: 'code/',
    type: 'static'
  },
  dict: {
    text: '请选择',
    url: 'dict/',
    type: 'static'
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
      options: [],
      codeType: '',
      dType: '',
      selType:'static',
      lock: false
    }
  },
  created () {
    if(this.dataType.includes('.')) {
      this.dType = this.dataType.split('.')[0]
      this.codeType = this.dataType.split('.')[1]
    } else {
      this.dType = this.dataType
    }
    this.selType = get(TYPE_MAP, this.dType).type
    if('static' === this.selType) {
      this._selLoadCode()
    }
    this.placeholder = get(TYPE_MAP, this.dType).text
  },
  mounted () {
    
  },
  methods: {
    _selLoadCode() {
      this.lock = true
      this._selDyamicList('').then(() => {
        this.lock = false
      })
    },
    async _selDyamicList(query) {
      this.loading = true;
      await this.$axios.post (
        '/common/' + get(TYPE_MAP, this.dType).url.replace(/^\//, '') + this.codeType,
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
    },
    _setVal(e) {
      if(e.value && 'dyamic' == this.selType) {
        this.options=[e]
      }
      if(e.value && 'static' == this.selType) {
        let timer = setInterval(() => {
            if(this.lock) {
              return;
            }
            this.options.map(item => {
              if(e.value == item.value)
                this.selectVal = item
            })
            clearInterval(timer)
          }, 500);
      } else
        this.selectVal = e
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
