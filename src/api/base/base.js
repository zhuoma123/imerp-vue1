export function save (url, data) {
  return this.$axios({
    method: 'post',
    url: url,
    data
  })
}

export function getDataList (url, query) {
  return this.$axios({
    url: url,
    method: 'get',
    params: query
  })
}
