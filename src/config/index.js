let apiUrl = '/apis'

// window.apiObj.apiUrl 配置，在public/static/config.js
if (process.env.NODE_ENV === 'production' && window.apiObj.apiUrl) {
  apiUrl = window.apiObj.apiUrl
}

if (window.apiObj.apiUrl) {
  apiUrl = window.apiObj.apiUrl
}

// url加参数apiDomain，配置后台地址保存
const apiDomain = localStorage.getItem('apiDomain')
if (apiDomain) {
  apiUrl = decodeURI(apiDomain)
}

export const apiBaseUrl = apiUrl

// 上传文件的地址/图片预览的地址
export const imgBaseUrl = apiUrl //测试
// export const imgBaseUrl = 'http://192.168.6.223:92/twoaR6_war_exploded';

// 配置附件上传时间限制
export const imgUpdateTimeout = 3600000 * 30
// 配置附件上传文件大小
export const imgUpdateSize = 1024 * 200 //200M

// wps 的 版本类型 'web'.'pro'
export const wpsVsion = sessionStorage.getItem('wpsVsion') || window.apiObj.wpsVsion

export const websvrpwd = 'suncnihold654321'

// 时间选择的 最大值和最小值
export const defaultMinDate = new Date(2020, 0, 1)
export const defaultMaxDate = new Date(2025, 12, 31)
