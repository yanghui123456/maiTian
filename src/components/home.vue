<template>
  <div class="layout">
    <Layout>
      <!--头部-->
      <Header>
        <Menu mode="horizontal" theme="primary" active-name="1">
          <div class="layout-logo">
            <!--<img src="../../assets/logo.png" alt="logo图标" class="logo">-->
            <span class="title"> <span class="fb">全员营销.</span> 管理系统后台</span>
          </div>
          <div class="layout-nav">
            <Icon type="md-power" size="24" class="ml30" @click="signOut"/></Icon>
          </div>
        </Menu>
      </Header>
      <Layout>
        <!--左侧菜单-->
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu :active-name="activeMenu" theme="light" width="auto" @on-select="menuSelect">
            <MenuItem name="index" to="index">
              <Icon type="md-home"></Icon>
              <span>首页</span>
            </MenuItem>
            <MenuItem name="customer" to="customer">
              <Icon type="md-person"></Icon>
              <span>名片管理</span>
            </MenuItem>
            <MenuItem name="organization" to="organization">
              <Icon type="md-attach"></Icon>
              <span>组织架构管理</span>
            </MenuItem>
            <MenuItem name="work" to="work">
              <Icon type="md-book"></Icon>
              <span>产品管理</span>
            </MenuItem>
            <MenuItem name="order" to="order">
              <Icon type="md-brush"></Icon>
              <span>预约产品状态</span>
            </MenuItem>
            <MenuItem name="dynamic" to="dynamic">
              <Icon type="ios-chatboxes"></Icon>
              <span>动态管理</span>
            </MenuItem>
          </Menu>
        </Sider>
        <!--内容-->
        <Layout>
          <Content :style="{width:'100%', height:'100%', padding: '20px', minHeight: '280px', boxSizing:'border-box', background: '#f7f8fc', overflow: 'auto'}">
            <router-view @checkMenu="getMenu"></router-view>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import store from '@/store'
export default {
  store,
  data () {
    return {
      activeMenu: ''
    }
  },
  created: function () {
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
      localStorage.setItem('activeMenu', this.activeMenu)
    },
    // 子组件传递过来的值
    getMenu (res) {
      this.menuSelect(res)
    },
    // 腿粗哈
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
    }
  }
}
</script>
<style lang="stylus" scoped>
  .layout
    height:100%;
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    .ivu-layout-header
      background #2D8CF0;
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
        width:40px;
        height:40px;
        margin:10px 10px 0 0;
      .title
        display inline-block;
        height:100%;
        line-height 60px;
        color:white;
        position absolute;
    .layout-nav
      text-align right;
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
</style>
