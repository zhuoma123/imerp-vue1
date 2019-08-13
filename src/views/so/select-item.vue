<template>
  <el-autocomplete
    :placeholder="placeholder"
    :disabled="disabled"
    :value-key="valueKey"
    :debounce="debounce"
    :placement="placement"
    :trigger-on-focus="triggerOnFocus"
    :popper-class="popperClass"
    :name="name"
    :value="value"
    :select-when-unmatched="selectWhenUnmatched"
    :label="label"
    :prefix-icon="prefixIcon"
    :suffix-icon="suffixIcon"
    :hide-loading="hideLoading"
    :popper-append-to-body="popperAppendToBody"
    :highlight-first-item="highlightFirstItem"
    v-model="state"
    :fetch-suggestions="fetchSuggestions"
    @select="select"
  >
    <template slot-scope="{ item }">
      <div class="name">{{ item.value }}</div>
      <span class="extfield">{{ item[extField] }}</span>
    </template>
  </el-autocomplete>
</template>
<script>
export default {
  name: "ElAutocompleteItem",
  created() {
  },
  data() {
    return {
      value: "",
      state: ""
    };
  },
  methods: {
    select: function(item) {
      this.value = item[this.valueKey];
      this.$emit('select',item);
    },
    handleBlur(event) {
      event.target.value = this.value
      console.log('getData----->', event);
    },
    getData(queryString) {
      console.log('getData----->', queryString)
    },
  },
  props: {
    valueKey: {
      type: String,
      default: "value"
    },
    popperClass: {
      type: String,
      default: "my-autocomplete"
    },
    popperOptions: Object,
    placeholder: String,
    clearable: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    name: String,
    size: String,
    maxlength: Number,
    minlength: Number,
    autofocus: Boolean,
    fetchSuggestions: Function,
    triggerOnFocus: {
      type: Boolean,
      default: true
    },
    customItem: String,
    selectWhenUnmatched: {
      type: Boolean,
      default: false
    },
    prefixIcon: String,
    suffixIcon: String,
    label: String,
    debounce: {
      type: Number,
      default: 300
    },
    placement: {
      type: String,
      default: "bottom-start"
    },
    hideLoading: Boolean,
    popperAppendToBody: {
      type: Boolean,
      default: true
    },
    highlightFirstItem: {
      type: Boolean,
      default: false
    },
    extField: String
  }
};
</script>
<style>
.my-autocomplete {
  width: auto;
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>