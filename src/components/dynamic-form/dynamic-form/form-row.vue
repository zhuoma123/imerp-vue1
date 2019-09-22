<template>
  <el-row>
    <dynamic-form-item
      ref="formItem"
      v-for="(descriptor, key, index) in descriptors"
      v-model="_value[key]"
      :key="key"
      :lang="lang"
      :label="findTypeDescriptor(descriptor).label || key"
      :prop="key"
      :map-model="_value"
      :label-width="descriptor.labelWidth || (descriptor.type === 'slot' ? '10px' : labelWidth)"
      :descriptor="descriptor"
      :language="language"
      :size="size"
      :col-span="computedCol(descriptor, colSpan, index)"
      :background-color="backgroundColor"
      :bg-color-offset="bgColorOffset">
      <template v-if="descriptor.type === 'slot'" :slot="descriptor.name">
          <slot :name="descriptor.name">{{descriptor.name}}</slot>
      </template>
    </dynamic-form-item>
  </el-row>
</template>

<script>
import DynamicFormItem from '../dynamic-form-item/form-item'
import { isComplexType, getLabelWidth, findTypeDescriptor, isNumber } from '../utils'
import i18n from '../i18n'

export default {
  name: 'dynamic-form-row',
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
    descriptors: {
      type: Object,
      required: false
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
    labelWidth: String,
    colSpan: String
  },
  components: {
    DynamicFormItem
  },
  computed: {
    _value: {
      get () {
        return this.value
      },
      set (value) {
        this.value = value
      }
    },
    style () {
      const style = {
        fontSize: `${this.fontSize}px`,
        backgroundColor: this.backgroundColor
      }
      return style
    },
    language () {
      return (this.languages || i18n)[this.lang]
    },
    computedCol () {
      return function(descriptor, colSpan, index) {
        const colspans = colSpan.split(',')
        let colspan = Number(colSpan.split(',')[index])
        if(descriptor.colspan && isNumber(descriptor.colspan)) {
          for(let i = 1; i< descriptor.colspan; i++) {
            if(index + i < colspans.length)
              colspan += Number(colSpan.split(',')[index+i])
          }
        }
        return colspan
      }
    }
  },
  data () {
    return {
      i18n
    }
  },
  created () {
    this.init()
  },
  methods: {
    isNumber,
    findTypeDescriptor,
    init () {
      this.initValue()
    },
    initValue () {
      for (const key in this.descriptors) {
        this.setValueKey(this, this._value, key, this.descriptors[key])
      }
    },
    setValueKey (target, value, key, descriptor) {
      if (isComplexType(descriptor.type)) {
        if (descriptor.type === 'object') {
          // object
          if (descriptor.fields) {
            // normal object
            if (value[key] === undefined) {
              target.$set(value, key, {})
            }
            for (const _key in descriptor.fields) {
              target.setValueKey(target, value[key], _key, descriptor.fields[_key])
            }
          } else {
            // hashmap
            if (value[key] === undefined) {
              target.$set(value, key, {})
            }
          }
        } else {
          // array
          if (value[key] === undefined) {
            target.$set(value, key, [])
          }
        }
      } else {
        if (value && value[key] === undefined) {
          target.$set(value, key, null)
        }
      }
    },
    propsChange (formRow) {
      for(const key in this.descriptors) {
        Object.assign(this.descriptors[key].props, formRow[key].props)
      }
      
      this.$refs.formItem.forEach(item =>{
        item.propsChange(this.descriptors)  
      })
    }
  }
}
</script>