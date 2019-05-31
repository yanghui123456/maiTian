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
              <div>36/65</div>
            </Col>
            <Col span="6" offset="1" class="bp cardItem">
            <div class="title">今日营销活跃人数</div>
            <div>36/65</div>
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
          <div class="account"><span class="fb">账号：</span> 123456789</div>
          <div class="account mt10"><span class="fb">剩余使用天数：</span>20/365天</div>
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
        <Tabs style="width:100%">
          <TabPane label="7天" icon="md-clock">
            <ve-line :data="chartData" style="width:100%;"></ve-line>
          </TabPane>
          <TabPane label="30天" icon="md-clock">
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
        <a href="#" slot="extra" @click.prevent="showModal">
          <Icon type="ios-loop-strong"></Icon>
          查看更多 》
        </a>
        <div>123</div>
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
        <p class="items mt10">账号：12354</p>
        <p class="items mt10">剩余使用天数：12/365</p>
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
  },
  methods: {
    goCustomer () {
      console.log(1)
      this.$router.push('customer')
    },
    goOrder () {
      this.$router.push('order')
    },
    showModal () {
      this.modal = true
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
</style>
