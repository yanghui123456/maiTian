/**
 * Created by Mr.Liu on 2019/4/19.
 */
// 设置axios请求拦截，发送请求时header中携带token
import axios from 'axios'
import store from './store'
import router from './router'
export default function setAxios () {
  // 请求拦截=固定写法
  axios.interceptors.request.use(
    config => {
      config.headers['Content-Type'] = 'application/json;charset=UTF-8' // 设置请求头
      // config.headers['Content-Type'] = 'application/x-www-form-urlencoded' // 设置请求头
      // 如果vuex中存在token,就设置请求头
      if (store.state.token) {
        config.headers.token = store.state.token
      }
      return config
    }
  )
  // 设置服务器响应拦截,直接取后台返回的data,省去了每次请求接口的时候都要在取data
  axios.interceptors.response.use(
    response => {
      if (response.status === 200) {
        var data = response.data
        return data
      }
      return response
    },
    error => {
      // 跟后台约定好状态码，如果token过期，重新登录,并且清空locastorage和vuex中的token数据并返回至登录页
      if (error.response) {
        switch (error.response.status) {
          case 401:
            // 返回 401 清除token信息并跳转到登录页面
            if (error.response.data.code === 5) {
              window.localStorage.clear()
              store.commit('setToken', '')
              router.replace('/')
            }
        }
      }
      return Promise.resolve(error)
    })
}
