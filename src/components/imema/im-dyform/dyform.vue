<script>
export default {
  name: 'im-dyform',
  data() {
    return {
      imDescriptors: {}
    }
  },
  props: {
    value: {
      type: Object,
      required: true,
      default: () => {}
    },
    descriptors: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  created() {
    for(let des in this.descriptors){
      if(this.descriptors[des].type === 'select') {

      } else {
        this.imDescriptors[des] = this.descriptors[des]
      }
    }
  },
  render(h) {
    return (
      <dynamic-form
        v-model={this.value}
        descriptors={this.imDescriptors}>
      </dynamic-form>
    );
  }
}
</script>
