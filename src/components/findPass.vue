
<template>
  <div class="findPass">
    <p class="title mt20">找回密码</p>
    <Divider />
    <Row type="flex" justify="center" class="mb20">
      <Col span="10">
      <Alert type="warning" show-icon>请输入您 需要找回密码的手机号，凭验证码重置密码</Alert>
      </Col>
    </Row>
    <Row class="mb20" type="flex" justify="center">
      <Col span="10">
      <span class="lableName"><span class="star">*</span>手机号：</span>
      <Input placeholder="请输入您的手机号" style="width: 70%" clearable type="text" v-model="tel"/>
      </Col>
    </Row>
    <Row class="mb20" type="flex" justify="center">
      <Col span="10">
      <span class="lableName"><span class="star">*</span>验证码：</span>
      <Input placeholder="请输入验证码" style="width: 40%" clearable type="text" v-model="code"/>
      <Button v-if="showTimer" type="info" @click="getCode">获取验证码</Button>
      <Button v-if="!showTimer" disabled>重新获取{{count}}'s</Button>
      </Col>
    </Row>
    <Row class="mb20" type="flex" justify="center">
      <Col span="10">
      <span class="lableName"><span class="star">*</span>新密码：</span>
      <Input placeholder="大于等于6位数的密码" style="width: 70%" clearable type="password" v-model="pass"/>
      </Col>
    </Row>
    <Row class="mb20" type="flex" justify="center">
      <Col span="10">
      <span class="lableName"><span class="star">*</span>确认新密码：</span>
      <Input placeholder="确认密码" style="width: 70%" clearable type="password" v-model="confrimPass"/>
      </Col>
    </Row>
    <Row class="mb20" type="flex" justify="center">
      <Col span="24" class="tc">
        <Button type="info" @click="submint" :loading="loading">提交</Button>
        <Button type="success" @click="backLogin">返回登录页</Button>
      </Col>
    </Row>

  </div>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      tel: '',
      code: '',
      pass: '',
      confrimPass: '',
      showCode: true,
      count: '',
      timer: false,
      showTimer: true
    }
  },
  created () {},
  methods: {
    // 返回登录页
    backLogin () {
      this.$router.replace('/')
    },
    submint () {
      if (this.tel === '' || this.tel.length !== 11 || this.tel.substr(0, 1) !== '1') {
        this.$Message.error('请输入正确的手机号码')
      } else if (this.code === '') {
        this.$Message.error('请输入验证码')
      } else if (this.pass === '' || this.pass.length < 6) {
        this.$Message.error('请输入正确密码')
      } else if (this.confrimPass === '') {
        this.$Message.error('请确认密码')
      } else if (this.pass !== this.confrimPass) {
        this.$Message.error('两次密码输入不一致，请确认密码')
      } else {
        this.loading = true
        this.httpSubmit(this.tel, this.code, this.pass)
      }
    },
    // 获取验证码
    getCode () {
      if (this.tel === '' || this.tel.length !== 11 || this.tel.substr(0, 1) !== '1') {
        this.$Message.error('请输入正确的手机号码')
      } else {
        this.httpCode()
      }
    },
    // 获取验证码
    httpCode: function () {
      var param = {
        phoneNumber: this.tel
      }
      this.$axios.post(window.serverIp + '/phonelogin', param).then((res) => {
        if (res.status === 'success') {
          this.showTimer = false
          this.timer_count_down()
          this.$Message.success('验证码已发送')
        } else {
          this.$Message.warning(res.message)
        }
      })
    },
    // 倒计时
    timer_count_down () {
      var that = this
      var TIME_COUNT = 60
      if (!that.timer) {
        this.count = TIME_COUNT
        setInterval(function () {
          if (that.count > 0 && that.count <= TIME_COUNT) {
            that.count--
            that.count = that.count--
          } else {
            clearInterval(that.timer)
            that.timer = false
            that.showTimer = true
          }
        }, 1000)
      }
    },
    // 修改密码
    httpSubmit: function (tel, code, pass) {
      var params = {
        phoneNumber: tel,
        checkNumber: code,
        newpwd: pass
      }
      this.$axios.post(window.serverIp + '/phonecheck', params).then((res) => {
        this.loading = false
        if (res.status === 'success') {
          this.$Message.success('密码修改成功')
          this.backLogin()
        } else {
          this.password = ''
          this.confirmPassword = ''
          this.$Message.warning(res.message)
        }
      })
    }
  },
  // 计算属性
  computed: {},
  // 自定义指令
  directives: {}
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .findPass
    width:100%;
    height:100%;
    overflow hidden;
  .title
    font-size:20px;
    font-weight:700;
    padding-left:20px;
    box-sizing: border-box;
    width:300px;
  .lableName
    display inline-block;
    width:90px;
    text-align right;
    .star
      color:red;
</style>
