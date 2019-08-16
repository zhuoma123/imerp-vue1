import imSelector from './components/im-selector.vue'
export default {
  name: 'im-selector',
  components: {
    imSelector
  },
  data () {
    return {
      id: this.value,
      mapObj: this.mapModel,
      mapKey: 'name',
      mapVal: 'id'
    }
  },
  props: {
    value: {
      default: ''
    },
    // 容器样式
    type: {
      type: String,
      required: false,
      default: 'select'
    },
    // 组件业务类型
    dataType: {
      type: String,
      required: true
    },
    mapModel: {
      type: Object,
      default: () => ({})
    },
    // 下拉框对象的下拉显示属性-对应的值
    mapKeyVal: {
      type: String,
      required: false,
      default: 'id:name'
    }
  },
  computed: {
    // 始终返回渲染组件
    component() {
      if (this.type === 'select') return imSelector
      else {
        return 'div'
      }
    }
  },
  render(h) {
    return h('div', {
      ref: 'selector',
      class: 'selector-component'
    }, [
        h(this.component, {
          ref: 'component',
          props: {
            dataType: this.dataType
          },
          on: {
            change: e => this.$emit('change', e),
            input: e=> {
              if(!e.value) {
                this.mapModel[this.mapKey]=null
                this.mapModel[this.mapVal]=null
              } else {
                this.mapModel[this.mapKey]=e.key
                this.mapModel[this.mapVal]=Number(e.value)
              }
            }
          }
        })
      ])
  },
  methods: {

  },
  watch: {
    value: function(val, oldVal) {
      let obj = {
        key: this.mapModel[this.mapKey],
        value: this.mapModel[this.mapVal]
      }
      this.$refs.component._selChange(obj)
    }
  },
  mounted () {
    if(this.mapKeyVal) {
      let kv = this.mapKeyVal.split(":")
      if(kv.length == 2) {
        this.mapVal = kv[0]
        this.mapKey = kv[1]
      }
    }
    this.$nextTick(() => {
      let obj = {
        key: this.mapModel[this.mapKey],
        value: this.mapModel[this.mapVal]
      }
      this.$refs.component._selChange(obj)
    })
  }
}
