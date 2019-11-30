/**
 * Created by Mr.Liu on 2019/4/19.
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    token: '',
    role: '' // 角色
  },
  mutations: {
    setToken (state, token) {
      this.state.token = token
      // console.log(this.state.token)
    },
    // 设置角色
    setRole (state, role) {
      this.state.role = role
    }
  }
})
