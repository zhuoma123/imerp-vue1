export function save (url, data) {
  return this.$axios({
    method: 'post',
    url: url,
    data
  })
}
