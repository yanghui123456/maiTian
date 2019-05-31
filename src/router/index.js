import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import Index from '@/components/index'
import Customer from '@/components/customer-manager'
import Organization from '@/components/organization-manager'
import Work from '@/components/work-manager'
import Order from '@/components/order-state'
import Dynamic from '@/components/dynamic-manager'
import Login from '@/components/login'

Vue.use(Router)

export default new Router({
  routes: [
    // 登录
    {
      path: '/',
      name: 'login',
      component: Login
    },
    // 首页
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        // 首页
        {
          path: 'index',
          name: 'index',
          component: Index,
          meta: {
            requireToken: true // 有这个字段表示路由跳转至该页面必须需要token值
          }
        },
        // 客户经理管理
        {
          path: 'customer',
          name: 'customer',
          component: Customer,
          meta: {
            requireToken: true // 有这个字段表示路由跳转至该页面必须需要token值
          }
        },
        // 组织架构管理
        {
          path: 'organization',
          name: 'organization',
          component: Organization,
          meta: {
            requireToken: true // 有这个字段表示路由跳转至该页面必须需要token值
          }
        },
        // 业务管理
        {
          path: 'work',
          name: 'work',
          component: Work,
          meta: {
            requireToken: true // 有这个字段表示路由跳转至该页面必须需要token值
          }
        },
        // 预约状态
        {
          path: 'order',
          name: 'order',
          component: Order,
          meta: {
            requireToken: true // 有这个字段表示路由跳转至该页面必须需要token值
          }
        },
        // 动态管理
        {
          path: 'dynamic',
          name: 'dynamic',
          component: Dynamic,
          meta: {
            requireToken: true // 有这个字段表示路由跳转至该页面必须需要token值
          }
        }
      ]
    }
  ]
})
