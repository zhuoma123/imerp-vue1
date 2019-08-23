<template>
  <div class="dynamic-form" :style="style">
    <el-form
      v-if="_value"
      ref="dynamic-form"
      :model="_value"
      v-bind="formprops"
      :rules="descriptors"
    >
      <dynamic-form-row
        v-for="(row, key) in rowDescriptors"
        v-model="_value"
        :key="key"
        :descriptors="row"
        :col-span="curColSpan"
        v-bind="$props"
        :label-width="labelWidth"
      ></dynamic-form-row>
      <el-form-item :size="size"  v-if="$slots.operations" class="operations" :label-width="labelWidth">
        <slot name="operations"></slot>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import DynamicFormRow from './form-row'
import { isComplexType, getLabelWidth, findTypeDescriptor, isNumber } from '../utils'

export default {
  name: 'dynamic-form',
  props: {
    value: {
      type: Object,
      required: true
    },
    lang: {
      type: String,
      default: 'zh_CN'
    },
    /**
     * custom languages, format refer to packages/i18n.js
     */
    languages: Object,
    /**
     * descriptor of value, extend from https://github.com/yiminghe/async-validator
     */
    alldescriptors: {
      type: Object,
      required: true
    },
    /**
     * size of the input component
     */
    size: {
      type: String,
      default: 'mini'
    },
    /**
     * background-color of form
     */
    backgroundColor: {
      type: String,
      default: '#FFFFFF'
    },
    /**
     * font-size of form
     */
    fontSize: {
      type: Number,
      default: 12
    },
    /**
     * darken sub-form's background-color with offset while get positive integer
     */
    bgColorOffset: {
      type: Number,
      default: 8
    },
    formprops: Object,
    colSpan: {
      type: String,
      default: '*'
    }
  },
  components: {
    DynamicFormRow
  },
  computed: {
    _value: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    style () {
      const style = {
        fontSize: `${this.fontSize}px`,
        backgroundColor: this.backgroundColor
      }
      return style
    },
    labelWidth () {
      return getLabelWidth(this.alldescriptors, this.fontSize)
    },
    curColSpan () {
      const span = this.colSpan.split(",")
      let count = (this.colSpan.match(/\*,?/ig) || []).length
      let all = 24
      let every = 1
      span.map(item => {
          if(this.isNumber(item) && Number(item)<=24) {
            all -= item
          }
      })
      every = parseInt(all/count)
      all = all%count

      let ret = ''
      if(all === 0) {
        ret = this.colSpan.replace(/\*/ig, every)
      } else {
        ret = this.colSpan.replace(/(.*)\*/ig, '$1' + (all+every)).replace(/\*/ig, every)
      }
      return ret
    }
  },
  data () {
    return {
      descriptors:{},
      rowDescriptors: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    isNumber,
    getLabelWidth,
    init () {
      this.initValue()
    },
    initValue () {
      let row = null
      for (let key in this.alldescriptors) {
        if(!row)
          row = {}
        if(this.alldescriptors[key] && this.alldescriptors[key].type === 'separate') {
          this.rowDescriptors.push(row)
          row = {}
          continue;
        }

        row[key] = this.alldescriptors[key]
        if(row[key] && row[key].type !== 'cust') {
          this.descriptors[key] = this.alldescriptors[key]
        }
      }
      if(row)
        this.rowDescriptors.push(row)
    }
  }
}
</script>

<style lang="scss" scoped>
.operations {
  float: right;
}
</style>
