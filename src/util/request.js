import axios from 'axios'
import qs from 'qs'
import { apiBaseUrl, websvrpwd } from '@/config'
import { validateStatus, addPending, removePending, clearPending } from './requestUtil'
import router from '../router/index'

import { Toast } from 'vant'

// 创建时自定义默认配置，超时设置为全局默认值0秒
let service = axios.create({
  baseURL: apiBaseUrl,
  timeout: 600000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'x-requested-with': 'XMLHttpRequest',
    strEquipmentType: 2
  },
  validateStatus: validateStatus
})

// service.defaults.timeout = 600000;
// service.defaults.withCredentials = true; // 设置允许跨域设置cookie

// http request 拦截器
service.interceptors.request.use(
  config => {
    // console.log('config====', config);
    removePending(config) // 在请求开始前，对之前的请求做检查取消操作
    addPending(config) // 将当前请求添加到 pending 中

    const _strSid = localStorage.getItem('strSid')

    if (config.data instanceof Object) {
      config.data.strSid = config.data.strSid || _strSid
      config.data.websvrpwd = config.data.websvrpwd || websvrpwd
    } else {
      config.data = {}
      config.data.strSid = config.data.strSid || _strSid
      config.data.websvrpwd = websvrpwd
    }

    if (config.method === 'post' && config.headers['Content-Type'] != 'multipart/form-data') {
      config.data = qs.stringify(config.data)
    }

    if (config.data instanceof FormData) {
      config.data.append('websvrpwd', websvrpwd)
      if (!config.data.get('strSid')) {
        config.data.append('strSid', _strSid)
      }
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http request 拦截器
service.interceptors.response.use(
  resp => {
    removePending(resp)
    if (!resp.data || resp.data.constructor != Object) {
      Toast.fail('接口有误')
      return Promise.reject('wrong')
    }
    if (resp.data.constructor == Object) {
      resp.data.strMsg = resp.data.strMsg || '操作失败' + resp.data.intCode

      let { intCode, strMsg } = resp.data
      if (!validateStatus(intCode) && intCode !== undefined) {
        Toast.fail(strMsg)
        //返回错误状态
        // return Promise.reject('wrong');
      }
      if (resp.data.globa_sessionTimeOut == -1) {
        Toast.fail(resp.data.tip)
      }
    }

    setTimeout(() => {
      Toast.clear()
    }, 1000)
    return resp
  },
  error => {
    if (axios.isCancel(error)) {
      return Promise.reject('isCancel_wrong')
    }
    if (!axios.isCancel(error)) {
      Toast.fail('网络异常\n请稍后重试')
    }
    return Promise.reject('wrong')
  }
)

router.beforeEach((to, from, next) => {
  clearPending()
  next()
})

export default service
