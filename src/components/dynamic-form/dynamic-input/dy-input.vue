<template>
  <span class='el-form-item__label' v-if="isMapKey">{{isMapKey}}</span>
  <span class='el-form-item__label' v-else-if="custProps.readonly">{{_value}}</span>
  <component
    class="dynamic-input"
    v-model="_value"
    v-else-if="!isSpecialType(type)"
    v-bind="custProps"
    :map-model="mapModel"
    :is="name"
    :size="size"
    :disabled="disabled"
    :placeholder="placeholder">
  </component>
  <!-- integer, number type use el-input with v-model.number -->
  <el-input v-bind="custProps" v-else-if="['integer'].includes(type)" v-only-number=0
  v-model.number="_value" :size="size" :disabled="disabled" :placeholder="placeholder"></el-input>
  <!-- float type use el-input with v-only-number -->
  <el-input v-bind="custProps" v-else-if="['number', 'float'].includes(type)" v-only-number=2
  v-model="_value" :size="size" :disabled="disabled" :placeholder="placeholder"></el-input>
  <!-- enum type use el-select -->
  <el-select v-bind="custProps" v-else-if="type === 'enum'" class="dynamic-input" v-model="_value" :size="size" :disabled="disabled" :placeholder="placeholder" :multiple="extend && extend.multiple">
    <el-option v-for="option in _options" :key="option.label" :value="option.value" :label="option.label" :disabled="option.disabled"></el-option>
  </el-select>
  <!-- date type use el-date-picker -->
  <el-date-picker v-bind="custProps" v-else-if="type === 'date'" class="dynamic-input" v-model="_value" :size="size" :disabled="disabled" :type="custProps.type || 'datetime'" :placeholder="placeholder"></el-date-picker>
</template>

<script>
const TYPE_COMPONENT_MAP = {
  string: 'el-input',
  number: 'el-input-number',
  boolean: 'el-switch',
  regexp: 'el-input',
  integer: 'el-input-number',
  float: 'el-input-number',
  enum: 'el-select',
  url: 'el-input'
}

export default {
  name: 'dynamic-input',
  componentName: 'dynamic-input',
  props: {
    value: {
      required: true
    },
    placeholder: String,
    size: {
      type: String,
      default: 'small'
    },
    /**
     * value type
     * options: ['string', 'number', 'boolean', 'regexp', 'integer', 'float', 'enum', 'date', 'url', 'hex', 'email']
     */
    type: {
      type: String,
      required: true
    },
    custName: String,
    custProps: Object,
    /**
     * extend options of component
     * extends.options: [{ label: String, value: Any }] || [String] // select component's options
     */
    extend: Object,
    mapModel: Object
  },
  components: {},
  computed: {
    _value: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    _options () {
      if (this.extend && this.extend.options instanceof Array) {
        return this.extend.options.map(item => {
          if (typeof item === 'string') {
            return { label: item, value: item }
          } else {
            return item
          }
        })
      } else {
        return []
      }
    },
    isMapKey() {
      if(this.custProps.readonly && this.custProps.mapKeyVal && this.mapModel) {
        return this.mapModel[this.custProps.mapKeyVal.split(':')[0]+'Mean'] || this.mapModel[this.custProps.mapKeyVal.split(':')[0]]
      } else 
        return null
    },
    disabled() {
      return this.custProps.disabled
    }
  },
  watch: {
    _value: function(val, oldVal) {
      // console.log('----input---', val, oldVal)
    }
  },
  data () {
    return {
      name: ''
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      if(this.type === 'cust') {
        this.name = (this.custName ? this.custName : null) || 'el-input'
      } else 
        this.name = TYPE_COMPONENT_MAP[this.type] || 'el-input'
    },
    isSpecialType (type) {
      return ['integer', 'float', 'number', 'enum', 'date'].includes(type)
    }
  }
}
</script>

<style lang="scss">

</style>
