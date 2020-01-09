<!--消息-->
<template>
  <div class="container">
    <!--<div class="mb20">-->
      <!--<Button type="info" @click="allNews">全部消息</Button>-->
      <!--<Button type="info" @click="noRead">未读消息</Button>-->
      <!--<Button type="info" @click="setAllRead">全部标记为已读</Button>-->
    <!--</div>-->
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
      newsList: []
    }
  },
  created () {
    this.allNews()
  },
  methods: {
    // 获取全部消息
    allNews () {
      this.$axios.get(window.serverIp + '/maitian/notice/getNoticeByUser')
        .then(res => {
          if (res.status === 'success') {
            this.newsList = res.data
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 未读消息
    noRead () {
      this.$Message.warning('未读消息')
    },
    // 全部标记已读
    setAllRead () {
      this.$Message.warning('全部标记为已读')
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
