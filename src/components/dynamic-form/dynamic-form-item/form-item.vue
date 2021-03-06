<template>
  <el-col :span="colSpan">
    <el-form-item
      v-show="!curDescriptor.hidden"
      class="dynamic-form-item"
      :ref="prop"
      :label="(labelWidth === '0px' ? '' : (typeDescriptor.type === 'slot' ? typeDescriptor.label : (label || prop)))"
      :prop="prop"
      :size="size"
      :language="language"
      :rules="ruleDescriptor"
      :required="typeDescriptor.required"
      :label-width="labelWidth">
      <slot :name="typeDescriptor.name" v-if="typeDescriptor.type === 'slot'"></slot>
      <dynamic-input
        v-else-if="!isComplexType(typeDescriptor.type)"
        v-model="_value"
        :map-model="mapModel"
        :size="size"
        :type="typeDescriptor.type"
        :custName="typeDescriptor.name"
        :custProps="curProps"
        :extend="{ options: typeDescriptor.options || typeDescriptor.enum }"
        :placeholder="typeDescriptor.placeholder">
      </dynamic-input>
      <!-- complex type, object or array -->
      <template v-else>
        <!-- normal object or hashmap object -->
        <template v-if="typeDescriptor.type === 'object'">
          <!-- normal object with known keys -->
          <div
            v-if="!typeDescriptor.defaultField"
            class="sub-dynamic-form"
            :style="{backgroundColor: subFormBackgroundColor}">
            <dynamic-form-item
              v-for="(_descriptor, key) in typeDescriptor.fields"
              v-model="_value[key]"
              :key="key"
              :label="(findTypeDescriptor(_descriptor)).label || key"
              :prop="prop ? prop + '.' + key : key"
              :descriptor="_descriptor"
              :language="language"
              :label-width="getLabelWidth(typeDescriptor.fields, fontSize)"
              :background-color="subFormBackgroundColor">
            </dynamic-form-item>
          </div>
          <!-- hashmap object -->
          <div
            v-else
            class="sub-dynamic-form hashmap"
            :style="{backgroundColor: subFormBackgroundColor}">
            <dynamic-form-item
              v-for="(temp, key) in _value"
              v-model="_value[key]"
              :ref="prop + '.' + key"
              :key="key"
              :label="key"
              :prop="prop ? prop + '.' + key : key"
              :deletable="true"
              :descriptor="typeDescriptor.defaultField"
              :language="language"
              :label-width="getLabelWidth(_value, fontSize)"
              :background-color="subFormBackgroundColor"
              @delete="deleteKey(key)">
            </dynamic-form-item>
            <el-form-item>
              <div class="add-key-input-group">
                <el-input v-model="hashMapKey" :placeholder="language.addKeyPlaceholder" :size="size"></el-input>
                <el-button type="primary" icon="el-icon-plus" :size="size" :disabled="!hashMapKey || _value[hashMapKey] !== undefined" @click="addHashMapKey" plain>{{ language.addKeyButtonText }}</el-button>
              </div>
            </el-form-item>
          </div>
        </template>
        <!-- array -->
        <template v-else>
          <div v-if="typeDescriptor.defaultField.type === 'enum' && typeDescriptor.defaultField.multiple" class="multi-select">
            <dynamic-input
              v-model="_value"
              :size="size"
              :disabled="typeDescriptor.defaultField.disabled"
              :type="typeDescriptor.defaultField.type"
              :custName="typeDescriptor.name"
              :custProps="typeDescriptor.props"
              :extend="{ multiple: typeDescriptor.defaultField.multiple, options: typeDescriptor.defaultField.options || typeDescriptor.defaultField.enum }"
              :placeholder="typeDescriptor.defaultField.placeholder">
            </dynamic-input>
          </div>
          <div v-else class="sub-dynamic-form array" :style="{backgroundColor: subFormBackgroundColor}">
            <dynamic-form-item
              v-for="(temp, key) in _value"
              v-model="_value[key]"
              :key="key"
              :prop="prop ? prop + '.' + key : key"
              :deletable="true"
              :descriptor="typeDescriptor.defaultField"
              :language="language"
              label-width="0px"
              :background-color="subFormBackgroundColor"
              @delete="deleteItem(key)">
            </dynamic-form-item>
            <div class="add-key-input-group">
              <el-button type="primary" icon="el-icon-plus" :size="size" @click="addArrayItem" plain>{{ language.addArrayItemButtonText }}</el-button>
            </div>
          </div>
        </template>
      </template>
      <el-button v-if="deletable" class="delete-button" type="text" icon="el-icon-close" @click="emitDelete"></el-button>
    </el-form-item>
  </el-col>
</template>

<script>
import { isComplexType, isSeparateType, getLabelWidth, darkenColor, parseDescriptor, findTypeDescriptor } from '../utils'
import DynamicInput from '../dynamic-input/dy-input'

export default {
  name: 'dynamic-form-item',
  props: {
    value: {
      required: true
    },
    prop: {
      type: String,
      default: ''
    },
    label: String,
    /**
     * descriptor of value, extend from https://github.com/yiminghe/async-validator
     */
    descriptor: {
      type: [Object, Array],
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
     * font-size of form
     */
    fontSize: {
      type: Number,
      default: 12
    },
    /**
     * background-color of form
     */
    backgroundColor: {
      type: String,
      default: '#FFFFFF'
    },
    /**
     * darken sub-form's background-color with offset while get positive integer
     */
    bgColorOffset: {
      type: Number,
      default: 8
    },
    deletable: {
      type: Boolean,
      default: false
    },
    labelWidth: String,
    language: Object,
    mapModel: Object,
    colSpan: Number
  },
  components: {
    DynamicInput
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
    typeDescriptor () {
      return findTypeDescriptor(this.curDescriptor)
    },
    subFormBackgroundColor () {
      return this.bgColorOffset ? darkenColor(this.backgroundColor, this.bgColorOffset) : 'none'
    },
    curProps () {
      return Object.assign({
        readonly: this.typeDescriptor.readonly,
        disabled: this.typeDescriptor.disabled,
      },this.typeDescriptor.props)
    }
  },
  data () {
    return {
      hashMapKey: '',
      curDescriptor: this.descriptor,
      ruleDescriptor: {}
    }
  },
  created () {
    this.initRules()
  },
  methods: {
    isComplexType,
    isSeparateType,
    getLabelWidth,
    findTypeDescriptor,
    initRules () {
      let tem = Object.assign({}, this.curDescriptor)
      tem.type = tem.ruletype || (tem.type === 'cust'?'string':tem.type)
      if(tem.required) {
        tem.message = tem.message || ((tem.label || tem.prop) + '为必填项')
      }
      this.ruleDescriptor = tem
    },
    clearValidate () {
      this.$refs[this.prop].clearValidate()
    },
    resetField () {
      this.$refs[this.prop].resetField()
    },
    addHashMapKey () {
      this.$set(this._value, this.hashMapKey, parseDescriptor(this.typeDescriptor.defaultField))
      this.hashMapKey = ''
      this.$refs[this.prop].resetField() // reset field to clear validate status while adding fist hashmap key
    },
    addArrayItem () {
      this._value.push(parseDescriptor(this.typeDescriptor.defaultField))
    },
    emitDelete () {
      this.$emit('delete')
    },
    deleteKey (key) {
      this.$delete(this._value, key)
    },
    deleteItem (index) {
      this._value.splice(index, 1)
    },
    propsChange (descriptors) {
      this.curDescriptor = descriptors[this.prop]
    }
  }
}
</script>

<style lang="scss" scoped>
.sub-dynamic-form {
  border-radius: 5px;
  padding: 10px;
  .el-form-item:last-child {
    margin-bottom: 0;
  }
}
.add-key-input-group {
  display: flex;
  margin-top: 10px;

  .el-input {
    width: 250px;
    margin-right: 10px;
  }
}
.add-key-input-group:first-child {
  margin-top: 0;
}
.delete-button {
  position: absolute;
  top: 0;
  right: 5px;
  font-size: 20px;
  color: #F56C6C;
  padding: 5px 0;
}
.delete-button:hover {
  color: red;
}
.dynamic-input + .delete-button {
  top: auto;
  right: auto;
}
</style>
