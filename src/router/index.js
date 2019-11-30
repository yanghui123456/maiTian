import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import FindPass from '@/components/findPass'
import Login from '@/components/login'
import CustomerList from '@/components/role-agent/customer-list'
import DataList from '@/components/role-admin/data-report'
import UserManage from '@/components/role-admin/user-manage'
import SaleControlManage from '@/components/role-admin/sale-control-manage'
import SysTrigger from '@/components/role-admin/content-library/system-trigger'
import RealTimePublish from '@/components/role-admin/content-library/real-time-publish'
import RestivalSeason from '@/components/role-admin/content-library/festival-season'
import CommunityActivity from '@/components/role-admin/activity/community-activity'
import CustomerGiving from '@/components/role-admin/activity/customer-thanksgiving'
import DataMainTain from '@/components/role-admin/data-maintain'
import News from '@/components/news'
import AgentManager from '@/components/agent-manager'
import MarketControl from '@/components/market-control'

Vue.use(Router)

export default new Router({
  routes: [
    // 登录
    {
      path: '/',
      name: 'login',
      component: Login
    },
    // 忘记密码
    {
      path: '/findpass',
      name: 'FindPass',
      component: FindPass
    },
    // 首页
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        // 经纪人--》顾客列表
        {
          path: 'customerlist',
          name: 'customerlist',
          component: CustomerList,
          meta: {
            requireToken: true
          }
        },
        // 管理员--》数据报表
        {
          path: 'datalist',
          name: 'datalist',
          component: DataList,
          meta: {
            requireToken: true
          }
        },
        // 管理员--》用户管理
        {
          path: 'usermanage',
          name: 'usermanage',
          component: UserManage,
          meta: {
            requireToken: true
          }
        },
        // 管理员--》销控管理表
        {
          path: 'salecontrolmanage',
          name: 'salecontrolmanage',
          component: SaleControlManage,
          meta: {
            requireToken: true
          }
        },
        // 管理员-->内容库管理-->系统触发
        {
          path: 'systrigger',
          name: 'systrigger',
          component: SysTrigger,
          meta: {
            requireToken: true
          }
        },
        // 管理员-->内容库管理-->实时发布
        {
          path: 'realtimepublish',
          name: 'realtimepublish',
          component: RealTimePublish,
          meta: {
            requireToken: true
          }
        },
        // 节日节气
        {
          path: 'restivalseason',
          name: 'restivalseason',
          component: RestivalSeason,
          meta: {
            requireToken: true
          }
        },
        // 管理员-->社区活动管理-->社群活动
        {
          path: 'communityactivity',
          name: 'communityactivity',
          component: CommunityActivity,
          meta: {
            requireToken: true
          }
        },
        // 管理员-->社区活动管理-->客户感恩礼
        {
          path: 'customergiving',
          name: 'customergiving',
          component: CustomerGiving,
          meta: {
            requireToken: true
          }
        },
        // 基础数据维护
        {
          path: 'datamaintain',
          name: 'datamaintain',
          component: DataMainTain,
          meta: {
            requireToken: true
          }
        },
        // 消息
        {
          path: 'news',
          name: 'news',
          component: News,
          meta: {
            requireToken: true
          }
        },
        // 经纪人管理
        {
          path: 'agentmanager',
          name: 'agentmanager',
          component: AgentManager,
          meta: {
            requireToken: true
          }
        },
        // 销控表
        {
          path: 'marketcontrol',
          name: 'marketcontrol',
          component: MarketControl,
          meta: {
            requireToken: true
          }
        }
      ]
    },
    // 没有匹配到访问的路径时显示登录页
    {
      path: '/*',
      name: 'Login',
      component: Login
    }
  ]
})
