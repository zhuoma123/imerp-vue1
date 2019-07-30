import dataMap from '../data'
import { assign } from 'lodash'

const req = context => context.keys().map(context)
const apiMap = []
const options = req(require.context('.', true, /(?!index)\.js$/))
  .filter(e => e.default)
  .map(e => e.default)

options.forEach(option => {
  apiMap.push(...option)
})

const R = r => {
  return assign({
    'msg': '',
    'code': 0,
    'data': {}
  }, r)
}

for (let key in dataMap) {
  let notExisit = apiMap.every(api => {
    return api.path !== key
  })

  if (notExisit) {
    apiMap.push({
      path: key,
      method: '*',
      handle ({ body }) {
        return R({ 'data': dataMap[key] })
      }
    })
  }
}

export default apiMap
