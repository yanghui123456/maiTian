// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview' // 引入iview依赖
import 'iview/dist/styles/iview.css' // 引入iview css样式
import VeLine from 'v-charts/lib/histogram.common' // 引入图表插件的柱状图
import store from './store' // 引入vuex-store文件
import axios from 'axios'
import setAxios from './setAxios'
import './assets/css/common.css' // 引入公共css文件
setAxios()
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(iView) // 使用iview组件
Vue.component(VeLine.name, VeLine)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
// 路由守卫，无论是刷新页面还是路由跳转，第一个进入的就是这个路由前置钩子函数
router.beforeEach((to, from, next) => {
  // to= 将要去到的路由地址， form=从A 到 B ， from代表的是A的路由信息，
  store.commit('setToken', localStorage.getItem('token'))
  // 先判断是否存在meta标签，再判断是否存在token，如果不存在，就去到登录页
  if (to.meta.requireToken) {
    if (store.state.token) {
      next()
    } else {
      next({
        path: '/'
      })
    }
  } else {
    next()
  }
})
