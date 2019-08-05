export function create (data) {
  return this.$axios({
    url: '/base/tree/save',
    method: 'post',
    data
  })
}

export function update (data) {
  return this.$axios({
    url: '/base/tree/update',
    method: 'post',
    data
  })
}

export function remove (data) {
  return this.$axios({
    url: '/base/tree/delete',
    method: 'post',
    data
  })
}
