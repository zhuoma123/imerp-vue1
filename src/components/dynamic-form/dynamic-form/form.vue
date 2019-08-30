<template>
  <div class="dynamic-form" :style="style">
    <el-form
      v-if="_value"
      ref="dynamic-form"
      :model.sync="_value"
      v-bind="formprops"
      :rules="descriptors"
    >
      <dynamic-form-row
        ref="formRow"
        v-for="(row, key) in rowDescriptors"
        v-model="_value"
        :key="key"
        :descriptors="row"
        :col-span="curColSpan"
        v-bind="$props"
        :label-width="computedlabelWidth"
      >
      <template v-for="(item, key) in $slots" :slot="key">
        <slot :name="key"></slot>
      </template>
      </dynamic-form-row>
      <el-form-item :size="size"  v-if="$slots.operations" class="operations" :label-width="computedlabelWidth">
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
    },
    readOnly: Boolean,
    labelWidth: {
      type: String,
      default: '0px'
    }
  },
  components: {
    DynamicFormRow
  },
  computed: {
    _value: {
      get () {
        console.log('-----val----', this.value)
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
    computedlabelWidth () {
      return this.labelWidth === '0px' ? getLabelWidth(this.alldescriptors, this.fontSize) : this.labelWidth
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
  watch: {
    readOnly: function(val, oldVal) {
      this.rowDescriptors.forEach((row, idx) =>{
        Object.keys(row).forEach(key => {
          if(row[key].name === 'im-selector') {
            Object.assign(row[key].props, {disabled: val})
          } else {
            Object.assign(row[key].props, {readonly: val})
          }
        })
        this.$refs.formRow[idx].propsChange(row)
      })
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
        if(this.readOnly) {
          if(row[key].name === 'im-selector') {
            row[key].disabled = this.readOnly
          } else {
            row[key].props = Object.assign({}, {readonly: this.readOnly}, row[key].props || {})
          }
        }
        if(row[key] && row[key].type !== 'cust') {
          this.descriptors[key] = this.alldescriptors[key]
        }
      }
      if(row)
        this.rowDescriptors.push(row)
    },
    validate (func) {
      if (typeof func === 'function') {
        this.$refs['dynamic-form'].validate(valid => {
          func(valid)
        })
      } else {
        return new Promise((resolve, reject) => {
          this.$refs['dynamic-form'].validate(valid => {
            resolve(valid)
          })
        })
      }
    },
    resetFields () {
      this.$refs['dynamic-form'].resetFields()
    },
    clearValidate () {
      this.$refs['dynamic-form'].clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped>
.operations {
  float: right;
}
</style>
