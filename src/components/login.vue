<template>
  <div class="login">
    <div class="left">
    </div>
    <div class="right">
      <div class="loginBox">
        <div class="box">
          <p class="title">欢迎登陆客户经理+管理后台系统</p>
          <div>
            <Input  v-model="account" prefix="ios-phone-portrait" placeholder="请输入账号" class="input"/>
          </div>
          <div>
            <Input v-model="password" prefix="md-lock" placeholder="请输入密码" class="input" type="password"/>
          </div>
          <Button type="primary" class="logBtn" :loading="loading" @click="login">登陆</Button>
        </div>
      </div>
    </div>
    <!--<p class="text">京ICP备  xxxx号 Copyright 2016-2017 旭金科技有限公司</p>-->
  </div>
</template>
<script>
import store from '@/store'
export default {
  store,
  data () {
    return {
      loading: false,
      account: 'zhangsan', // 账号
      password: '432423' // 密码
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
        this.$Message.warning('请输入账号')
      } else if (this.password === '') {
        this.$Message.warning('请输入密码')
      } else {
        this.loading = true
        this.signIn()
      }
    },
    signIn () {
      const params = {
        userName: this.account,
        password: Number(this.password)
      }
      this.$axios.post(window.serverIp + '/sys/user/login', params)
        .then(res => {
          this.loading = false
          console.log(res)
          if (res.code === 0) {
            // 缓存token
            var data = res.body
            store.commit('setToken', data.sid)
            localStorage.setItem('token', data.sid)
            this.$router.replace('/home/index')
          } else {
            this.$Message.warning(res.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped lang="stylus">
.login
  width:100%;
  height:100%;
  background: radial-gradient(30% 50% at 30% 50%, #60C1FB, #4567E9);
  .left,.right
    height:100%;
    float left;
  .left
    width:48%;
    display flex;
    align-items center;
    justify-content center;
    .logo
      width:40%;
      margin-top:-104px;
  .right
    width:52%;
    display flex;
    align-items center;
    justify-content center;
    .loginBox
      width:400px;
      padding: 10px;
      background #79b7f7;
      margin-top:-80px;
      border-radius 2px;
      box-sizing border-box;
      margin-left:26%;
      .box
        width:100%;
        padding:30px 10% 44px 10%;
        background white;
        border-radius 2px;
        box-sizing border-box;
        .title
          color:#3859d7;
          font-size:20px;
          text-align center;
          font-weight 700;
        .logBtn
          width:100%;
          height:40px;
          line-height:27px;
          background #6181fb;
          color:white;
          font-size:15px;
          margin-top:16px;
        .input
          margin-top:20px;
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
