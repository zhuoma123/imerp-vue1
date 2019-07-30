const jsonData = require.context('.', true, /\.json$/)

const dataMap = {}

// 进行名称转换 ./sys.login.json -> /sys/login
jsonData.keys().forEach(key => {
  dataMap[key.replace(/(\.\/)/g, '/').replace(/(\.json)/g, '').replace(/(\.)/g, '/')] = jsonData(key)
})

export default dataMap
