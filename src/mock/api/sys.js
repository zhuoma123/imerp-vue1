import _ from 'lodash'
import dataMap from '../data'

const userDB = [
  { username: 'admin', password: 'admin', uuid: 'admin-uuid', name: 'Admin' },
  { username: 'editor', password: 'editor', uuid: 'editor-uuid', name: 'Editor' },
  { username: 'user1', password: 'user1', uuid: 'user1-uuid', name: 'User1' }
]

const R = r => {
  return _.assign({
    'msg': '',
    'code': 0,
    'data': {}
  }, r)
}

const custApi = [{
  path: '/sys/login',
  method: '*',
  handle ({ body }) {
    const user = userDB.find(e => e.username === body.username && e.password === body.password)
    if (user) {
      return R({ 'data': dataMap['/sys/login'] })
    } else {
      return R({ 'code': 401, 'msg': '账号或密码不对' })
    }
  }
}]

export default custApi
