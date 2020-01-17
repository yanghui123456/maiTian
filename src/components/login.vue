<template>
  <div class="login">
    <div class="left">
      <img src="../assets/logo.png" alt="logo图标" style="width=100%;height=100%" class="logo">
    </div>
    <div class="right">
      <div class="loginBox">
        <div class="box">
          <p class="title">超级销控表</p>
          <div>
            <Input  v-model="account" prefix="ios-phone-portrait" placeholder="请输入账号" class="input"/>
          </div>
          <div>
            <Input v-model="password" prefix="md-lock" placeholder="请输入密码" class="input" type="password"/>
          </div>
          <Button type="primary" class="logBtn" :loading="loading" @click="login">{{text}}</Button>
          <p class="forget mt20" @click="forget">忘记密码？</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import store from '@/store'
export default {
  store,
  data () {
    return {
      loading: false,
      text: '登录',
      account: '', // 账号
      password: '' // 密码
    }
  },
  created () {
    var that = this
    document.onkeydown = function (event) {
      var e = event || window.event
      if (e && e.keyCode === 13) {
        that.login()
      }
    }
  },
  methods: {
    login () {
      if (this.account === '') {
        this.$Message.warning('请输入正确的账号')
      } else {
        this.loading = true
        this.text = '登录中'
        // manage-管理员； areaManager-区域经理； shoper-店长； agent-经纪人
        this.signIn()
      }
    },
    signIn () {
      const params = {
        name: this.account,
        pwd: this.password
      }
      this.$axios.post(window.serverIp + '/adminlogin', params)
        .then(res => {
          this.loading = false
          this.text = '登录'
          if (res.status === 'success' || 'reset') {
            // 缓存token 和 role 角色
            // 1:管理员；2：城市总经理；3：片区总经理；4：大区总监；5：区域经理；6：店长；7：经纪人
            // 管理用户名密码： 15901569118
            // 区经用户名密码： 13811467522 张宏
            // 店长用户名密码： 13810424573 崔传宏
            // 经纪人用户名密码： 13609072023 张海洋
            var data = res.data
            var role = res.data.user.roleId
            store.commit('setToken', data.token)
            localStorage.setItem('token', data.token)
            store.commit('setRole', data.user.roleId)
            localStorage.setItem('role', data.user.roleId)
            store.commit('setUserId', data.user.userId)
            localStorage.setItem('userId', data.user.userId)
            if (res.status === 'reset') {
              localStorage.setItem('reset', 1)
            }
            localStorage.setItem('departmentId', data.user.departmentId)
            // 根据不同的角色跳转到不同的页面;
            if (role === 1) {
              // 管理员
              this.$router.replace('/home/sq-activity')
            } else if (role === 5) {
              // 区域经理
              this.$router.replace('/home/news')
            } else if (role === 6) {
              // 店长 把departmentId缓存起来
              this.$router.replace('/home/news')
            } else if (role === 7) {
              // 经纪人
              this.$router.replace('/home/customerlist')
            }
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    forget () {
      this.$router.push('/findpass')
    }
  }
}
</script>

<style scoped lang="stylus">
.login
  width:100%;
  height:100%;
  background: #FEA202;
  .left,.right
    height:100%;
    float left;
  .left
    width:60%;
    display flex;
    align-items center;
    justify-content center ;
    .logo
      width:50%;
      margin-top:-20px;
  .right
    width:40%;
    display flex;
    align-items center;
    justify-content center;
    .loginBox
      width:400px;
      padding: 10px;
      background #FEA202;
      margin-top:-20px;
      border-radius 2px;
      box-sizing border-box;
      margin-left:-35%;
      .box
        width:100%;
        padding:30px 10% 44px 10%;
        background white;
        border-radius 2px;
        box-sizing border-box;
        .title
          color:#FEA202;
          font-size:20px;
          text-align center;
          font-weight 700;
          width:100%;
        .logBtn
          width:100%;
          height:40px;
          line-height:27px;
          color:white;
          font-size:15px;
          margin-top:16px;
        .input
          margin-top:20px;
        .forget
          color:#FEA202;
          cursor:pointer;
          text-align:right;
  .text
    width:100%;
    text-align center;
    position absolute;
    bottom:30px;
    left:0;
    color:white;
    font-size:13px;
@media (max-width:1200px) and (min-width:501px) {
  .login .right .loginBox{
    width:400px;
    margin-left:1%;
  }
}
@media screen and (max-width:800px) {
.login .left{
 width:0;
}
  .login .right{
    width:100%
    position: relative;
  }
 .login .right .loginBox{
   width:400px;
   position: absolute;
   left:50%;
   margin:0;
   top:50%;
   margin-top:-180px;
   margin-left:-200px;
 }
}
</style>
