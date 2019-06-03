<template>
  <div class="index">
    <Row style="height:40%">
      <Col span="16" class="h100">
      <Card style="width:100%" class="h100">
        <p slot="title">
          <Icon type="ios-film-outline"></Icon>
          客户经理状态
        </p>
        <a href="#" slot="extra" @click.prevent="goCustomer">
          <Icon type="ios-loop-strong"></Icon>
          查看更多 》
        </a>
        <div>
          <Row>
            <Col span="6" class="bp cardItem">
              <div class="title">今日营销活跃人数</div>
              <div>{{todayActiveManagerNum}}/{{managerNum}}</div>
            </Col>
            <Col span="6" offset="1" class="bp cardItem">
            <div class="title">已加入营销人数</div>
            <div>{{managerNum}}/{{staffNumLimit}}</div>
            </Col>
          </Row>
        </div>
      </Card>
      </Col>
      <Col span="7" offset="1" class="h100">
      <Card style="width:100%" class="h100">
        <p slot="title">
          <Icon type="ios-film-outline"></Icon>
          账号状态
        </p>
        <a href="#" slot="extra" @click.prevent="showModal">
          <Icon type="ios-loop-strong"></Icon>
          查看更多 》
        </a>
          <div class="account"><span class="fb">账号：</span> {{purchaser}}</div>
          <div class="account mt10"><span class="fb">剩余使用天数：</span>{{remainingPeriod}}/{{duration}}天</div>
      </Card>
      </Col>
    </Row>
    <Row style="height:60%" class="mt10">
      <Col span="16" class="h100">
      <Card style="width:100%" class="h100">
        <p slot="title">
          <Icon type="ios-film-outline"></Icon>
          业务预约状态
        </p>
        <a href="#" slot="extra" @click.prevent="goOrder">
          <Icon type="ios-loop-strong"></Icon>
          查看更多 》
        </a>
        <Tabs style="width:100%" @on-click="tabClick">
          <TabPane label="7天" icon="md-clock" name="7">
            <ve-line :data="chartData" style="width:100%;"></ve-line>
          </TabPane>
          <TabPane label="30天" icon="md-clock" name="30">
            <ve-line :data="chartData"  style="width:100%"></ve-line>
          </TabPane>
        </Tabs>

      </Card>
      </Col>
      <Col span="7" offset="1" class="h100">
      <Card style="width:100%" class="h100">
        <p slot="title">
          <Icon type="ios-film-outline"></Icon>
          最新动态
        </p>
        <a href="#" slot="extra" @click.prevent="goDynamic">
          <Icon type="ios-loop-strong"></Icon>
          查看更多 》
        </a>
        <div v-for="item in list" :key="item.id">
          <Row>
            <Col span="14" class="overHide">{{item.title}}</Col>
            <Col span="10" class="overHide">{{item.gmtCreate}}</Col>
          </Row>
        </div>
      </Card>
      </Col>
    </Row>
    <!--账号弹窗-->
    <Modal v-model="modal" width="50%">
      <p slot="header" style="text-align:center">
        <span>账号状态和海豚服务</span>
      </p>
      <div >
        <p class="f13 fb mt10">账号状态：</p>
        <p class="items mt10">账号：{{purchaser}}</p>
        <p class="items mt10">剩余使用天数：{{remainingPeriod}}/{{duration}}天</p>
        <p class="f12 fb mt10" style="margin-bottom:10px">海豚服务：</p>
        <Row>
          <Col span="6" class="a-card">
          <div class="a-title">智能名片服务</div>
          <div class="mt10">20000/年</div>
          <div class="mt10">300个账号</div>
          <div class="mt10">已开通(2019.5.30到期)</div>
          </Col>
          <Col span="6" offset="1" class="a-card">
          <div class="a-title">补充账号套餐</div>
          <div class="mt10">20000/年</div>
          <div class="mt10">300个账号</div>
          <div class="mt10 open">开通</div>
          </Col>
          <Col span="6" offset="1" class="bp a-card">
          <div class="a-title">定制套餐</div>
          <div class="mt10">10000/年</div>
          <div class="mt10">定制服务</div>
          <div class="mt10 open">开通</div>
          </Col>
        </Row>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
export default {
  data () {
    return {
      list: [],
      managerNum: '',
      todayActiveManagerNum: '',
      duration: '',
      purchaser: '',
      staffNumLimit: '',
      remainingPeriod: '',
      modal: false,
      chartData: {
        columns: ['日期', '访问用户量'],
        rows: [
          {'日期': '1/1', '访问用户量': 100},
          {'日期': '1/2', '访问用户量': 200},
          {'日期': '1/3', '访问用户量': 300},
          {'日期': '1/4', '访问用户量': 400},
          {'日期': '1/5', '访问用户量': 500},
          {'日期': '1/6', '访问用户量': 600}
        ]
      }
    }
  },
  created () {
    this.getData()
    this.getChartData('1') // 1:7天 2:30天
  },
  methods: {
    tabClick (name) {
      if (name === '7') {
        this.getChartData('1')
      } else if (name === '30') {
        this.getChartData('2')
      }
    },
    getData () {
      this.$axios.get(window.serverIp + '/sys/home/info')
        .then((res) => {
          if (res.code === 0) {
            var data = res.body
            console.log(data)
            this.managerNum = data.managerNum
            this.todayActiveManagerNum = data.todayActiveManagerNum
            this.staffNumLimit = data.staffNumLimit
            this.purchaser = data.purchaser
            this.duration = data.duration
            this.remainingPeriod = data.remainingPeriod
            this.list = data.noticeList
          } else {
            this.$Message.warning(res.msg)
          }
        })
        .catch((err) => {
          this.$Message.warning(err)
        })
    },
    // 图表数据
    getChartData (day) {
      this.$axios.get(window.serverIp + '/sys/home/business?type=' + day)
        .then((res) => {
          if (res.code === 0) {
            var data = res.body
            console.log(data)
            this.chartData.rows = data
          } else {
            this.$Message.warning(res.msg)
          }
        })
        .catch((err) => {
          this.$Message.warning(err)
        })
    },
    goCustomer () {
      // 更改菜单的值
      this.$emit("checkMenu", 'customer')
      this.$router.push('customer')
    },
    goOrder () {
      this.$emit("checkMenu", 'order')
      this.$router.push('order')
    },
    showModal () {
      this.modal = true
    },
    goDynamic () {
      this.$emit("checkMenu", 'dynamic')
      this.$router.push('dynamic')
    }
  },
  // 计算属性
  computed: {},
  // 自定义指令
  directives: {}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .index
    width: 100%;
    height: 100%;
    padding: 20px;
    background white;
    border-radius 20px;
    box-sizing border-box;
    overflow auto;
    // 名片
    .cardItem
      background url("../assets/back1.png");
      background-size 100% 100%;
      background-repeat no-repeat;
      border-radius 10px;
      height:100px;
      text-align center;
      font-size:13px;
      color:white;
      .title
        font-size:14px;
        font-weight 700;
        margin: 25px 0 10px 0;
    // 账号
    .account
      font-size 14px;
  .h100{
    height:100%;
    overflow: auto;
  }
 .f13{
   font-size:13px;
 }
  .bp
    background pink;
  .fb
    font-weight 700;
  .mt10
    margin-top: 10px;
  .items
    width:100%;
    padding:0 20px;
    box-sizing border-box;
  .a-card
    background url("../assets/back1.png");
    background-size 100% 100%;
    background-repeat no-repeat;
    border-radius 10px;
    text-align center;
    font-size:13px;
    color:white;
    padding-bottom:10px;
    .a-title
      font-size:14px;
      font-weight 700;
      margin: 25px 0 10px 0;
  .open
    cursor pointer;
  .overHide
    height:30px;
    line-height:30px;
    overflow: hidden;/*超出部分隐藏*/
    text-overflow:ellipsis;/* 超出部分显示省略号 */
    white-space: nowrap;/*规定段落中的文本不进行换行 */
    cursor:pointer;
</style>
