<!--消息-->
<template>
  <div class="container">
    <div class="mb20">
      <i-button type="primary" @click="allNews" :loading="loadAll">全部消息</i-button>
      <i-button type="primary" @click="noRead('click')" :loading="loadNoRead">未读消息</i-button>
      <i-button type="primary" @click="setAllRead" :loading="loadHasRead">全部标记为已读</i-button>
    </div>
    <div class="pr">
      <Card class="w350" style="margin-top:10px;" v-for="item in newsList" :key="item.id" v-if="newsList.length > 0">
        <p slot="title">
          <Icon type="md-notifications" />
          {{item.title}}
        </p>
        <!--<a href="#" slot="extra" @click.prevent="detail">-->
          <!--<Icon type="ios-loop-strong"></Icon>-->
          <!--查看详情-->
        <!--</a>-->
        <p class="time"> {{item.sendtime}}</p>
        <p>{{item.content}}</p>
        <Button type="info" class="hasRead" @click="setRead(item.id)" v-if="item.islook === 0">标记为已读</Button>
        <Button type="info" class="hasRead" disabled v-if="item.islook === 1">已读</Button>
      </Card>
      <p v-if="newsList.length === 0" class="tc">暂无数据</p>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loadAll: false,
      loadNoRead: false,
      loadHasRead: false,
      clickType: 'all', // all全部，noRead未读,
      noReadStr: '', // 未读列表中id的字符串
      newsList: []
    }
  },
  created () {
    this.allNews()
    // 获取未读消息，全部标记为已读列表可以用到
    this.noRead('defalut')
  },
  methods: {
    // 获取全部消息
    allNews () {
      this.loadAll = true
      this.newsList = []
      this.clickType = 'all'
      this.$axios.get(window.serverIp + '/maitian/notice/getNoticeByUser')
        .then(res => {
          if (res.status === 'success') {
            this.newsList = res.data
            this.loadAll = false
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 未读消息
    noRead (type) {
      // 值为click的时候代表的是点击按钮，defalut的时候代表的是默认获取列表，当点击全部标记为已读的时候使用
      if (type === 'click') {
        this.loadNoRead = true
        this.newsList = []
        this.clickType = 'noRead'
      }
      this.$axios.get(window.serverIp + '/maitian/notice/getNoticeByUser?islook=0')
        .then(res => {
          if (res.status === 'success') {
            if (type === 'click') {
              this.newsList = res.data
              this.loadNoRead = false
            } else if (type === 'defalut') {
              var arr = []
              for (var i = 0; i < res.data.length; i++) {
                arr.push(res.data[i].id)
              }
              this.noReadStr = arr.join(',')
            }
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 全部标记已读
    setAllRead () {
      this.loadHasRead = true
      this.$axios.put(window.serverIp + '/maitian/notice/setNoticeLook?notice_id=' + this.noReadStr)
        .then(res => {
          if (res.status === 'success') {
            this.loadHasRead = false
            this.$Message.success('全部标记为已读')
            if (this.clickType === 'all') {
              this.allNews()
            } else if (this.clickType === 'noRead') {
              this.noRead('click')
            }
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 标记已读
    setRead (id) {
      this.$axios.put(window.serverIp + '/maitian/notice/setNoticeLook?notice_id=' + id)
        .then(res => {
          if (res.status === 'success') {
            this.$Message.success('标记成功')
            this.allNews()
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 查看详情
    detail () {
      // =======================店长端
      // ====销控表-分配房屋
      // 通知父组件-更改父组件home中选中的菜单
      /* this.$emit('checkMenu', 'marketcontrol')
      this.$router.push({path: 'marketcontrol', query: {showFpfwModal: true}}) */
      // ====社群活动详情
      // this.$emit('checkMenu', 'communityactivity')
      // this.$router.push({path: 'communityactivity', query: {showXdModal: true}})
      // ===数据指标
      // this.$emit('checkMenu', 'datalist')
      // this.$router.push({path: 'datalist'})
      // ===活动礼品签收页面--社群活动礼品确认送达（店长角色-确认送达按钮）
      // this.$emit('checkMenu', 'communityactivity')
      // this.$router.push({path: 'communityactivity'})
      // ===查看活动详情页面 ---与上边第二条一直
      // this.$emit('checkMenu', 'communityactivity')
      // this.$router.push({path: 'communityactivity', query: {showXdModal: true}})
      // ===成交客户感恩礼--活动详情
      // this.$emit('checkMenu', 'customergiving')
      // this.$router.push({path: 'customergiving', query: {showDetailModal: true}})
      // ===成交客户感恩礼--礼品送达情况
      this.$emit('checkMenu', 'customergiving')
      this.$router.push({path: 'customergiving', query: {showArriveModal: true}})
    }
  },
  // 计算属性
  computed: {},
  // 自定义指令
  directives: {}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .w350{
    width:350px;
    .time{
      font-size:12px;
      color:#57a3f3;
    }
  }
  .hasRead{
    position: absolute;
    top:50%;
    left:400px;
    margin-top:-15px;
  }
</style>
