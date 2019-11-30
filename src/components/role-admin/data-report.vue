<!--管理员=数据报表-->
<template>
  <div class="container">
    <!--搜索条件-->
    <div class="searchCondition">
      <Row v-if="role === 1">
        <Col :lg="{ span: 3}" :xl="{ span: 3}">
        <Select v-model="city" @on-change="cityPickerChange" :placement="posit" placeholder="请选择城市">
          <Option v-for="item in cityList" :value="item.code" :key="item.code">{{ item.name }}</Option>
        </Select>
        </Col>
        <Col :lg="{ span: 3}" :xl="{ span: 3}">
        <Select v-model="area" @on-change="cityPickerChange" :placement="posit" placeholder="请选择片区">
          <Option v-for="item in areaList" :value="item.code" :key="item.code">{{ item.name }}</Option>
        </Select>
        </Col>
        <Col :lg="{ span: 3}" :xl="{ span: 3}">
        <Select v-model="largeArea" @on-change="cityPickerChange" :placement="posit" placeholder="请选择大区">
          <Option v-for="item in largeAreaList" :value="item.code" :key="item.code">{{ item.name }}</Option>
        </Select>
        </Col>
        <Col :lg="{ span: 3}" :xl="{ span: 3}">
        <Select v-model="region" @on-change="cityPickerChange" :placement="posit" placeholder="请选择区域">
          <Option v-for="item in regionList" :value="item.code" :key="item.code">{{ item.name }}</Option>
        </Select>
        </Col>
        <Col :lg="{ span: 3}" :xl="{ span: 3}">
        <Select v-model="store" @on-change="cityPickerChange" :placement="posit" placeholder="请选择门店">
          <Option v-for="item in storeList" :value="item.code" :key="item.code">{{ item.name }}</Option>
        </Select>
        </Col>
        <Col :lg="{ span: 3}" :xl="{ span: 3}">
        <Select v-model="group" @on-change="cityPickerChange" :placement="posit" placeholder="请选择店组">
          <Option v-for="item in groupList" :value="item.code" :key="item.code">{{ item.name }}</Option>
        </Select>
        </Col>
        <Col :lg="{ span: 3}" :xl="{ span: 3}">
        <Select v-model="agent" @on-change="cityPickerChange" :placement="posit" placeholder="请选择经纪人">
          <Option v-for="item in agentList" :value="item.code" :key="item.code">{{ item.name }}</Option>
        </Select>
        </Col>
      </Row>
      <Row class="mt10">
        <Col span="6">
        <Button type="info">今天</Button>
        <Button type="info">近7天</Button>
        <Button type="info">近1个月</Button>
        </Col>
        <Col span="6">
        <DatePicker type="daterange" placement="bottom-start" placeholder="请选择起始日期" style="width: 200px"></DatePicker>
        </Col>
        <Col span="6">
        <Button type="info">执行筛选</Button>
        </Col>
      </Row>
    </div>
    <!--信息触发-->
    <p class="pageTitle mt20">信息触发</p>
    <div class="cardItems tc">
      <div class="blue" @click="clickNum">
        <p>5321</p>
        <p>经纪人点击次数</p>
      </div>
      <div class="purple">
        <p>1000</p>
        <p>经纪人转发次数</p>
      </div>
      <div class="blue">
        <p>1000</p>
        <p>转发链接被打开人次</p>
      </div>
    </div>
    <!--管理员-社群活动-->
    <div v-if="role === 1">
      <p class="pageTitle mt20">社群活动</p>
      <div class="cardItems tc">
        <div class="purple">
          <p>5321</p>
          <p>新增手机号数量</p>
        </div>
        <div class="blue">
          <p>1000</p>
          <p>新增微信号数量</p>
        </div>
        <div class="purple">
          <p>1000</p>
          <p>新增字段数量</p>
        </div>
        <div class="blue">
          <p>1000</p>
          <p>有新增字段的顾客数量</p>
        </div>
      </div>
      <div class="cardItems tc mt10">
        <div class="purple">
          <p>5321</p>
          <p>有修改字段的客户数量</p>
        </div>
        <div class="blue">
          <p>1000</p>
          <p>新呼出的微信号数量</p>
        </div>
        <div class="purple">
          <p>1000</p>
          <p>新呼出的手机号数量</p>
        </div>
        <div class="blue">
          <p>1000</p>
          <p>新增互动记录</p>
        </div>
      </div>
    </div>
    <!--区域经理-社群活动-->
    <div v-if="role === 2 || role === 3">
      <p class="pageTitle mt20">社群活动</p>
      <div class="cardItems tc">
        <div class="purple">
          <p>5321</p>
          <p>活动期间新增的字段数量</p>
        </div>
        <div class="blue">
          <p>1000</p>
          <p>修改的字段数量</p>
        </div>
        <div class="purple">
          <p>1000</p>
          <p>新增的手机号</p>
        </div>
        <div class="blue">
          <p>1000</p>
          <p>新增的微信号</p>
        </div>
      </div>
      <div class="cardItems tc mt10">
        <div class="blue">
          <p>5321</p>
          <p>新呼出的手机号</p>
        </div>
        <div class="purple">
          <p>1000</p>
          <p>手机时长</p>
        </div>
        <div class="blue">
          <p>1000</p>
          <p>新呼出的微信号</p>
        </div>
      </div>
    </div>
    <!--区域经理-社区便民服务活动-->
    <div v-if="role === 2 || role === 3">
      <p class="pageTitle mt20">社区便民服务活动</p>
      <div class="cardItems tc">
        <div class="purple">
          <p>5321</p>
          <p>维护结果反馈指标</p>
        </div>
        <div class="blue">
          <p>1000</p>
          <p>老客户新增字段信息量</p>
        </div>
        <div class="purple">
          <p>1000</p>
          <p>老客户电话呼出量</p>
        </div>
        <div class="blue">
          <p>1000</p>
          <p>老客户微信呼出量</p>
        </div>
      </div>
    </div>
    <div class="cardItems tc mt10">
      <div class="blue">
        <p>1000</p>
        <p>电话呼出时长</p>
      </div>
      <div class="purple">
        <p>1000</p>
        <p>互动记录</p>
      </div>
    </div>
    <!--单项数据指标-->
    <p class="pageTitle mt20">成交客户感恩礼活动</p>
    <div class="cardItems tc">
      <div class="purple">
        <p>5321</p>
        <p>礼品回馈率</p>
      </div>
      <div class="blue">
        <p>1000</p>
        <p>老客户维护率</p>
      </div>
      <div class="purple">
        <p>1000</p>
        <p>失联率</p>
      </div>
    </div>
    <Modal
      v-model="modal"
      class-name="modal"
      width="900px"
      @on-visible-change="checkInModal">
      <p slot="header" class="tc">{{modalTitle}}</p>
      <div class="charts">
        <p></p>
        <ve-histogram :data="chartData" width="850px" height="450px"></ve-histogram>
      </div>
      <div slot="footer" class="tc">
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  data () {
    return {
      modal: false,
      modalTitle: '哈哈',
      chartData: {},
      // TODO 根据不同角色是否要展示不同的搜索条件以及数据展示
      role: 1, // 角色 1=管理员；2=区域经理； 3=店长；
      posit: 'bottom', // 下拉框定位的位置
      city: '', // 城市
      cityList: [
        {
          name: '北京',
          code: 1111
        }
      ],
      area: '', // 片区
      areaList: [
        {
          name: '石家庄',
          code: 2222
        }
      ],
      largeArea: '', // 大区
      largeAreaList: [
        {
          name: '桥西区',
          code: 3333
        }
      ],
      region: '', // 区域
      regionList: [
        {
          name: '南高基',
          code: 4444
        }
      ],
      store: '', // 门店
      storeList: [
        {
          name: '南高基东口',
          code: 5555
        }
      ],
      group: '', // 店组
      groupList: [
        {
          name: '第一组',
          code: 6666
        }
      ],
      agent: '', // 经纪人
      agentList: [
        {
          name: '杨慧',
          code: 7777
        }
      ]
    }
  },
  created () {
  },
  methods: {
    // 城市改变
    cityPickerChange (val) {
      console.log(val)
      this.city = val
    },
    // 弹窗关闭时
    checkInModal (status) {
      if (status === false) {
        this.tabInItem = 'all'
      }
    },
    modalStatus (showModal, title) {
      /*
       * showModal:是否显示弹窗
       * title：弹窗的title
       * */
      this.modal = showModal
      this.modalTitle = title
    },
    // 经纪人点击次数
    clickNum () {
      this.modalStatus(true, '经纪人点击次数')
      this.chartData = {
        columns: ['日期', '经纪人访问量'],
        rows: [
          {'日期': '经纪人1', '经纪人访问量': 1393},
          {'日期': '经纪人1', '经纪人访问量': 1393},
          {'日期': '经纪人1', '经纪人访问量': 600},
          {'日期': '经纪人1', '经纪人访问量': 139},
          {'日期': '经纪人1', '经纪人访问量': 400},
          {'日期': '经纪人7', '经纪人访问量': 400},
          {'日期': '经纪人8', '经纪人访问量': 500},
          {'日期': '经纪人9', '经纪人访问量': 200},
          {'日期': '经纪人10', '经纪人访问量': 100}
        ]
      }
    }
  },
  // 计算属性
  computed: {},
  // 自定义指令
  directives: {}
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .modal {
    .ivu-modal {
      top: 30px;
    }
    .ivu-modal-body {
      height: 540px;
      overflow: auto
    }
  }
  .title {
    width: 50px;
    text-align: right;
  }

  .wAuto {
    width: auto;
  }

  .searchCondition .ivu-row .ivu-col .ivu-select {
    width: 80%;
  }

  /*卡片*/
  .cardItems {
    overflow hidden;
    .blue {
      background: rgb(22, 155, 213);
    }
    .purple {
      background: rgb(134, 96, 191);
    }
    div {
      width:162px;
      float left;
      padding: 15px 20px;
      border-radius 10px;
      color white;
      margin-right: 20px;
      :nth-child(1) {
        font-weight 700;
        font-size 24px;
      }
    }
    :last-child {
      margin-right: 0;
    }
  }
</style>
