<template>
  <div class="layout">
    <Layout>
      <!--头部-->
      <Header>
        <Menu mode="horizontal" theme="primary" active-name="1">
          <div class="layout-logo">
             <img src="../assets/logo.png" alt="logo图标" style="width=100%;height=100%" class="logo">
          </div>
          <div class="layout-nav">
            <span class="editPass" @click="editPass">修改密码</span>
            <Icon type="md-power" size="24" class="ml30" @click="signOut"/></Icon>
          </div>
        </Menu>
      </Header>
      <Layout>
        <!--左侧菜单-->
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu :active-name="activeMenu" theme="light" width="auto" @on-select="menuSelect">
            <MenuItem name="news" to="news" v-if="role === '5' || role === '6'">
              <Icon type="ios-chatboxes"></Icon>
              <span>待办事项</span>
            </MenuItem>
            <!--经纪人-->
            <MenuItem name="customerlist" to="customerlist" v-if="role === '7'">
              <Icon type="ios-people"></Icon>
              <span>顾客列表</span>
            </MenuItem>
            <!--<MenuItem name="datalist" to="datalist" v-if="role !== '7'">-->
            <!--<Icon type="ios-stats" />-->
            <!--<span>数据报表</span>-->
          <!--</MenuItem>-->
            <Submenu name="dataIndex" v-if="role !== '7'">
              <template slot="title">
                <Icon type="ios-paper" />
                活动数据指标
              </template>
              <MenuItem name="sq-activity" to="sq-activity">社区活动</MenuItem>
              <MenuItem name="gel-activity" to="gel-activity">成交客户感恩礼活动</MenuItem>
            </Submenu>
            <!--店长角色下：显示经纪人管理，其余角色（不包括经纪人）：展示用户管理-->
            <MenuItem name="usermanage" to="usermanage" v-if="role !== '7'&&role !== '5'&&role !== '6'">
              <Icon type="ios-person-add"></Icon>
              <span v-if="role === '1'">用户管理</span>
              <!-- <span v-if="role === '6'">经纪人管理</span> -->
            </MenuItem>
            <!--<MenuItem name="marketcontrol" to="marketcontrol"  v-if="role === '5' || role === '6'">-->
              <!--<Icon type="ios-grid" />-->
              <!--<span>销控表</span>-->
            <!--</MenuItem>-->
            <Submenu name="xkb" v-if="role !== '7'">
              <template slot="title">
                <Icon type="ios-paper" />
                销控表
              </template>
              <MenuItem name="salecontrolmanage" to="salecontrolmanage" v-if="role === '5' || role === '1' || role === '6'">组织角度</MenuItem>
              <MenuItem name="estateangle" to="estateangle" v-if="role === '5' || role === '1' || role === '6'">楼盘角度</MenuItem>
              <MenuItem name="allocatedhouse" to="allocatedhouse" v-if="role === '6'">待分配房屋</MenuItem>
              <MenuItem name="pendingdisks" to="pendingdisks" v-if="role === '6'">待补盘房屋</MenuItem>
            </Submenu>
            <Submenu name="content" v-if="role === '1'">
              <template slot="title">
                <Icon type="ios-paper" />
                内容库管理
              </template>
              <MenuItem name="SysTrigger" to="SysTrigger">系统触发</MenuItem>
              <!--<MenuItem name="restivalseason" to="restivalseason">节日节气</MenuItem>-->
              <MenuItem name="realtimepublish" to="realtimepublish">实时发布</MenuItem>
            </Submenu>
            <Submenu name="activity" v-if="role === '1' || role === '5' || role === '6'">
              <template slot="title">
                <Icon type="ios-chatbubbles" />
                社区活动管理
              </template>
              <MenuItem name="communityactivity" to="communityactivity" v-if="role === '1' || role === '5' || role === '6'">社区活动</MenuItem>
              <MenuItem name="customergiving" to="customergiving" v-if="role === '1' || role === '6'">客户感恩礼</MenuItem>
            </Submenu>
            <!--<MenuItem name="datamaintain" to="datamaintain" v-if="role === '1'">-->
              <!--<Icon type="md-build" />-->
              <!--<span>基础数据维护</span>-->
            <!--</MenuItem>-->
            <!--<MenuItem name="agentmanager" to="agentmanager" v-if="role === '6'">-->
              <!--<Icon type="ios-person" />-->
              <!--<span>经纪人管理</span>-->
            <!--</MenuItem>-->
          </Menu>
        </Sider>
        <!--内容-->
        <Layout>
          <Content :style="{width:'100%', height:'100%', padding: '20px', minHeight: '280px', boxSizing:'border-box', background: '#f7f8fc', overflow: 'auto'}">
            <router-view @checkMenu="getMenu"></router-view>
          </Content>
        </Layout>
      </Layout>
      <!--修改密码弹窗-->
      <!--弹层-->
      <Modal
        v-model="modal"
        width="500px"
        @on-visible-change="checkModal"
        >
        <p slot="header" class="tc">修改密码</p>
        <div class="modalCentenr">
          <Row class="mb20" type="flex" justify="center" >
            <Col span="24">
            <span class="lableName"><span class="star">*</span>新密码：</span>
            <Input placeholder="请输入新密码(至少6位)" style="width: 70%" clearable type="password" v-model="modalData.pass"/>
            </Col>
         </Row>
          <Row class="mb20" type="flex" justify="center">
            <Col span="24">
            <span class="lableName"><span class="star">*</span>确认新密码：</span>
            <Input placeholder="请确认密码" style="width: 70%" clearable type="password" v-model="modalData.ensurePass"/>
            </Col>
          </Row>
        </div>
        <div slot="footer" class="tc">
          <Button type="info" @click="save">保存</Button>
          <Button type="info" @click="cancel">取消</Button>
        </div>
      </Modal>
    </Layout>
  </div>
</template>
<script>
import store from '@/store'
export default {
  store,
  data () {
    return {
      modal: false,
      modalData: {
        pass: '', // 新密码
        ensurePass: '' // 确认新密码
      },
      activeMenu: '',
      role: '' // 1:管理员；2：城市总经理；3：片区总经理；4：大区总监；5：区域经理；6：店长；7：经纪人
    }
  },
  created: function () {
    var reset2 = localStorage.getItem('reset')
    if (reset2 === '1') {
      this.modal = true
      this.checkModal(true)
    }
  },
  mounted () {
    this.$nextTick(() => {
      // 页面刷新时菜单选中项与路由不一致问题：通过页面url获取最后的路由，设置为菜单默认选中项
      var pageRoute = this.$route.path.split('/')
      var lastItem = pageRoute[pageRoute.length - 1]
      this.activeMenu = lastItem
      // 刷新时让vuex中的token值与localStorage中的同步,因为刷新时vuex中的数据会丢失
      var token = localStorage.getItem('token')
      store.commit('setToken', token)
      // 获取角色
      var roles = localStorage.getItem('role')
      store.commit('setRole', roles)
      this.role = roles
    })
  },
  computed: {
  },
  watch: {
  },
  methods: {
    // 菜单选择
    menuSelect (name) {
      this.activeMenu = name
      localStorage.setItem('activeMenu', name)
    },
    // 子组件传递过来的值
    getMenu (res) {
      this.menuSelect(res)
    },
    // 退出
    signOut () {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>是否退出?</p>',
        okText: '退出',
        cancelText: '取消',
        onOk: () => {
          localStorage.clear()
          this.$router.replace('/')
        },
        onCancel: () => {
          this.$Message.warning('您已取消退出')
        }
      })
    },
    checkModal (status) {
      // true=显示；false=隐藏
      if (status === false) {
        this.modal = false
        this.modalData = {
          pass: '', // 互动内容
          ensurePass: '' // 发布时间
        }
      }
    },
    // 修改密码
    editPass () {
      this.cancel()
    },
    save () {
      var pass1 = this.modalData.pass
      var pass2 = this.modalData.ensurePass
      if (pass1 === '') {
        this.$Message.warning('请输入新密码')
        return false
      } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(pass1)) {
        this.$Message.warning('密码必须是6位或以上字母和数字组合')
        return false
      } else if (pass2 === '') {
        this.$Message.warning('请确认新密码')
        return false
      } else if (pass2 !== pass1) {
        this.$Message.warning('抱歉，两次密码输入不一致')
        return false
      } else {
        this.$axios.put(window.serverIp + '/api/user', {
          userId: localStorage.getItem('userId'),
          password: pass1
        })
          .then(res => {
            if (res.status === 'success') {
              this.$Message.success('密码修改成功，请重新登录')
              this.cancel()
              // 需要重新登录
              localStorage.clear()
              this.$router.replace('/')
            } else {
              this.$Message.error(res.message)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    cancel () {
      this.modal = !this.modal
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .layout
    height:100%;
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    .ivu-layout-header
      background #FEA202;
      height 60px;
      line-height 60px;
    .ivu-layout
      height:100%;
    .layout-logo
      width: 210px;
      height: 100%;
      border-radius: 3px;
      float: left;
      position: relative;
      top: 0;
      left: -26px;
      .logo
        width:143px;
        height:55px;
        margin:5px 10px 0 0;
      .title
        display inline-block;
        height:100%;
        line-height 60px;
        color:white;
        position absolute;
        font-size 26px;
        width:130px;
    .layout-nav
      text-align right;
      .editPass
        display inline-block;
        height:100%;
        padding: 0 10px;
        color:white;
        cursor:pointer;
  .menu-icon{
    transition: all .3s;
  }
  .rotate-icon{
    transform: rotate(-90deg);
  }
  .menu-item span{
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
  }
  .menu-item i{
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
  }
  .collapsed-menu span{
    width: 0px;
    transition: width .2s ease;
  }
  .collapsed-menu i{
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
  }
  .ml30
    color:white;
    margin-left:30px;
    cursor: pointer;
  .cW
    color:white;
  .level
    margin-right:20px;
  .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu)
    background #f8f8f8;
  .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):after
    left:2px;
  .ivu-layout-sider-children {
    overflow auto;
  }
  .modalCentenr
    height:100px;

  .lableName
    display inline-block;
    width:90px;
    text-align right;
    .star
      color:red;
  .ivu-layout-sider {
    overflow scroll;
  }

</style>
