<!--管理员=数据报表-->
<template>
  <div class="container">
    <!--搜索条件-->
    <div class="searchCondition">
      <Row>
        <Col span="10">
          <span class="titleText">多项级联：</span>
          <Cascader :data="moreJilian" v-model="moreVal" trigger="click" style="width:80%;display: inline-block;" change-on-select @on-change="cascaderChange"></Cascader>
        </Col>
        <Col span="10">
          <span class="titleText">经纪人：</span>
          <Select v-model="agent" @on-change="agentChange" :placement="posit" placeholder="请选择经纪人">
            <Option v-for="item in agentList" :value="item.userId" :key="item.userId">{{ item.realName }}</Option>
          </Select>
        </Col>
      </Row>
    </div>
    <div class="searchCondition">
      <Row class="mt10">
        <Col span="6">
        <Button type="info" @click="today(1)">今天</Button>
        <Button type="info" @click="today(2)">近7天</Button>
        <Button type="info" @click="today(3)">近1个月</Button>
        </Col>
        <Col span="6">
        <DatePicker v-model="timePicker" @on-change="timeChange" type="daterange" placement="bottom-start" placeholder="请选择起始日期" style="width: 200px"></DatePicker>
        </Col>
        <Col span="6">
        <Button type="info" @click="searchCondition">查询</Button>
        </Col>
      </Row>
    </div>
    <!--管理员-社群活动-->
    <div>
      <p class="pageTitle mt20"></p>
      <div class="cardItems tc">
        <div class="purple">
          <p>{{addFieldCustoms}}</p>
          <p>新增客户字段</p>
        </div>
        <div class="blue">
          <p>{{addFields}}</p>
          <p>添加交互</p>
        </div>
        <div class="purple">
          <p>{{addTels}}</p>
          <p>新增的手机号</p>
        </div>
        <div class="blue">
          <p>{{addWechats}}</p>
          <p>新增的微信号</p>
        </div>
      </div>
      <div class="cardItems tc mt10">
        <div class="purple">
          <p>{{clickTimes}}</p>
          <p>点击时间</p>
        </div>
        <div class="blue">
          <p>{{forwardTimes}}</p>
          <p>前进时间</p>
        </div>
        <div class="purple">
          <p>{{giftFeedbackrate}}</p>
          <p>礼物反馈率</p>
        </div>
        <div class="blue">
          <p>{{linkClickTimes}}</p>
          <p>链接点击时间</p>
        </div>
      </div>
      <div class="cardItems tc mt10">
        <div class="purple">
          <p>{{lostContactRate}}</p>
          <p>损失联系率</p>
        </div>
        <div class="blue">
          <p>{{modifyFieldCustoms}}</p>
          <p>修改客户数量</p>
        </div>
        <div class="purple">
          <p>{{oldCustomRate}}</p>
          <p>旧客户率</p>
        </div>
        <div class="blue">
          <p>{{telCalls}}</p>
          <p>新呼出的手机号</p>
        </div>
      </div>
      <div class="cardItems tc mt10">
        <div class="purple">
          <p>{{wechatCalls}}</p>
          <p>新呼出的微信号</p>
        </div>
      </div>
    </div>
    <!--区域经理-社群活动-->
    <!--<div v-if="role === 5 || role === 6">-->
      <!--<p class="pageTitle mt20">社群活动</p>-->
      <!--<div class="cardItems tc">-->
        <!--<div class="purple">-->
          <!--<p>5321</p>-->
          <!--<p>活动期间新增的字段数量</p>-->
        <!--</div>-->
        <!--<div class="blue">-->
          <!--<p>1000</p>-->
          <!--<p>修改的字段数量</p>-->
        <!--</div>-->
        <!--<div class="purple">-->
          <!--<p>{{addTels}}</p>-->
          <!--<p>新增的手机号</p>-->
        <!--</div>-->
        <!--<div class="blue">-->
          <!--<p>{{addWechats}}</p>-->
          <!--<p>新增的微信号</p>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="cardItems tc mt10">-->
        <!--<div class="blue">-->
          <!--<p>{{telCalls}}</p>-->
          <!--<p>新呼出的手机号</p>-->
        <!--</div>-->
        <!--<div class="purple">-->
          <!--<p>1000</p>-->
          <!--<p>手机时长</p>-->
        <!--</div>-->
        <!--<div class="blue">-->
          <!--<p>{{wechatCalls}}</p>-->
          <!--<p>新呼出的微信号</p>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
    <!--区域经理-社区便民服务活动-->
    <!--<div v-if="role === 5 || role === 6">-->
      <!--<p class="pageTitle mt20">社区便民服务活动</p>-->
      <!--<div class="cardItems tc">-->
        <!--<div class="purple">-->
          <!--<p>5321</p>-->
          <!--<p>维护结果反馈指标</p>-->
        <!--</div>-->
        <!--<div class="blue">-->
          <!--<p>1000</p>-->
          <!--<p>老客户新增字段信息量</p>-->
        <!--</div>-->
        <!--<div class="purple">-->
          <!--<p>1000</p>-->
          <!--<p>老客户电话呼出量</p>-->
        <!--</div>-->
        <!--<div class="blue">-->
          <!--<p>1000</p>-->
          <!--<p>老客户微信呼出量</p>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
    <!--<div class="cardItems tc mt10">-->
      <!--<div class="blue">-->
        <!--<p>1000</p>-->
        <!--<p>电话呼出时长</p>-->
      <!--</div>-->
      <!--<div class="purple">-->
        <!--<p>1000</p>-->
        <!--<p>互动记录</p>-->
      <!--</div>-->
    <!--</div>-->
    <!--单项数据指标-->
    <!--<p class="pageTitle mt20">成交客户感恩礼活动</p>-->
    <!--<div class="cardItems tc">-->
      <!--<div class="purple">-->
        <!--<p>5321</p>-->
        <!--<p>礼品回馈率</p>-->
      <!--</div>-->
      <!--<div class="blue">-->
        <!--<p>1000</p>-->
        <!--<p>老客户维护率</p>-->
      <!--</div>-->
      <!--<div class="purple">-->
        <!--<p>1000</p>-->
        <!--<p>失联率</p>-->
      <!--</div>-->
    <!--</div>-->
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
      moreVal: [], // id数组
      moreJilian: [], // 多项级联
      modal: false,
      modalTitle: '哈哈',
      chartData: {},
      // TODO 根据不同角色是否要展示不同的搜索条件以及数据展示
      role: '', // // 1:管理员；2：城市总经理；3：片区总经理；4：大区总监；5：区域经理；6：店长；7：经纪人；
      posit: 'bottom', // 下拉框定位的位置
      agent: '', // 经纪人
      agentList: [],
      timeType: '', // 1：今天；2:7天；3：一个月
      timePickerChange: false, // 时间组件是否change,选择时间插件代表已经change,否则就是点击的今天，7天，1个月
      timePicker: [], // 起始时间数组
      addFieldCustoms: 0,
      addFields: 0,
      addInteractions: 0,
      addTels: 0,
      addWechats: 0,
      clickTimes: 0,
      forwardTimes: 0,
      giftFeedbackrate: 0,
      linkClickTimes: 0,
      lostContactRate: 0,
      modifyFieldCustoms: 0,
      oldCustomRate: 0,
      telCalls: 0,
      wechatCalls: 0
    }
  },
  created () {
    // 获取-角色
    var roles = localStorage.getItem('role')
    this.role = Number(roles)
    // 获取级联
    this.getJiLian()
    this.getAgentList()
  },
  methods: {
    // 获取级联下拉
    getJiLian () {
      this.$axios.get(window.serverIp + '/api/department/getDepartmentTree?pid=d770504cd7f911e79bcb005056b710e9')
        .then(res => {
          if (res.status === 'success') {
            this.moreJilian = res.data
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 级联变化
    cascaderChange (val, data) {
      this.moreVal = val
      console.log(val)
    },
    // 获取经纪人列表
    getAgentList () {
      this.$axios.get(window.serverIp + '/api/user/getUsersByGroup?departmentId=' + localStorage.getItem('departmentId'))
        .then(res => {
          if (res.status === 'success') {
            this.agentList = res.data.records
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 经纪人改变
    agentChange (val) {
      console.log(val)
      this.agent = val
    },
    // 时间change
    timeChange (time, date) {
      this.timePicker = time
      console.log(time)
      this.timePickerChange = true
    },
    // 今天
    today (type) {
      if (type === 1) {
        // 把时间的起止时间赋值为今天
        // 获取今天的日期
        var date = new Date()
        var year = date.getFullYear()
        var mouth = Number(date.getMonth()) + 1
        var day = date.getDate()
        if (mouth < 10) {
          mouth = '0' + mouth
        }
        if (day < 10) {
          day = '0' + day
        }
        var startTime = year + '-' + mouth + '-' + day
        this.timePicker = [startTime, startTime]
        console.log(this.timePicker)
      } else if (type === 2) {
        // 近7天，今天为最后最后一天
        // Date.parse(new Date()) 当前时间戳
        // new Date(1578540824000) 将时间戳转换成 Thu Jan 09 2020 11:33:44 GMT+0800 (中国标准时间)
        // 获取今天年月日作为结束时间
        var nowTime = Date.parse(new Date()) // 当前时间戳
        var date2 = new Date()
        var year2 = date2.getFullYear()
        var mouth2 = Number(date2.getMonth()) + 1
        var day2 = date2.getDate()
        if (mouth2 < 10) {
          mouth2 = '0' + mouth2
        }
        if (day2 < 10) {
          day2 = '0' + day2
        }
        var endTime = year2 + '-' + mouth2 + '-' + day2
        // 获取7天前作为开始时间
        var timeQi = nowTime - (6 * 24 * 60 * 60 * 1000)
        var time2Qi = new Date(timeQi)
        // 转换成年月日
        var year1 = time2Qi.getFullYear()
        var mouth1 = Number(time2Qi.getMonth()) + 1
        var day1 = time2Qi.getDate()
        if (mouth1 < 10) {
          mouth1 = '0' + mouth1
        }
        if (day1 < 10) {
          day1 = '0' + day1
        }
        var startTimes = year1 + '-' + mouth1 + '-' + day1
        console.log(startTimes)
        console.log(endTime)
        this.timePicker = [startTimes, endTime]
      } else if (type === 3) {
        var nowTime3 = Date.parse(new Date()) // 当前时间戳
        var date3 = new Date()
        var year3 = date3.getFullYear()
        var mouth3 = Number(date3.getMonth()) + 1
        var day3 = date3.getDate()
        if (mouth3 < 10) {
          mouth3 = '0' + mouth3
        }
        if (day3 < 10) {
          day3 = '0' + day3
        }
        var endTime3 = year3 + '-' + mouth3 + '-' + day3
        // 获取7天前作为开始时间
        var timeQi3 = nowTime3 - (29 * 24 * 60 * 60 * 1000)
        var time2Qi3 = new Date(timeQi3)
        // 转换成年月日
        var year4 = time2Qi3.getFullYear()
        var mouth4 = Number(time2Qi3.getMonth()) + 1
        var day4 = time2Qi3.getDate()
        if (mouth4 < 10) {
          mouth4 = '0' + mouth4
        }
        if (day4 < 10) {
          day4 = '0' + day4
        }
        var startTimes3 = year4 + '-' + mouth4 + '-' + day4
        this.timePicker = [startTimes3, endTime3]
      }
    },
    // 查询
    searchCondition () {
      console.log('查询结果')
      console.log(this.moreVal)
      console.log(this.agent)
      console.log(this.timePicker)
      var departmentId = ''
      var startTime = ''
      var endTime = ''
      // 级联
      if (this.moreVal.length > 0) {
        departmentId = this.moreVal[this.moreVal.length - 1]
      }
      // 时间
      if (this.timePicker[0] !== '' && this.timePicker[1] !== 0) {
        // 判断时间插件是否change
        if (this.timePickerChange) {
          startTime = this.timePicker[0]
          endTime = this.timePicker[1]
        } else {
          var year = this.timePicker[0].getFullYear()
          var mouth = this.timePicker[0].getMonth() + 1
          var day = this.timePicker[0].getDate()
          var year1 = this.timePicker[1].getFullYear()
          var mouth1 = this.timePicker[1].getMonth() + 1
          var day1 = this.timePicker[1].getDate()
          if (mouth < 10) {
            mouth = '0' + mouth
          }
          if (day < 10) {
            day = '0' + day
          }
          if (mouth1 < 10) {
            mouth1 = '0' + mouth1
          }
          if (day1 < 10) {
            day1 = '0' + day1
          }
          startTime = year + '-' + mouth + '-' + day
          endTime = year1 + '-' + mouth1 + '-' + day1
        }
      }
      this.searchData(departmentId, this.agent, startTime, endTime)
    },
    // 查询
    searchData (departmentId, userId, startDate, endDate) {
      this.$axios.get(window.serverIp + '/api/ActivityStatistic/getActivityStatistic?departmentId=' + departmentId + '&userId=' + userId + '&startDate=' + startDate + '&endDate=' + endDate)
        .then(res => {
          if (res.status === 'success') {
            var data = res.data
            // 进行赋值
            /* addFieldCustoms: 新增客户字段
            addFields: 新增字段
            addInteractions: 添加交互
            addTels: 新增的手机号
            addWechats: 新增的微信号
            clickTimes: 点击时间
            forwardTimes: 前进时间
            giftFeedbackrate: 礼物反馈率
            linkClickTimes: 链接点击时间
            lostContactRate: 损失联系率
            modifyFieldCustoms: 修改客户数量
            oldCustomRate: 旧客户率
            telCalls: 新呼出的手机号
            wechatCalls: 新呼出的微信号 */
            this.addFieldCustoms = data.addFieldCustoms === null ? 0 : data.addFieldCustoms
            this.addFields = data.addFields === null ? 0 : data.addFields
            this.addInteractions = data.addInteractions === null ? 0 : data.addInteractions
            this.addTels = data.addTels === null ? 0 : data.addTels
            this.addWechats = data.addWechats === null ? 0 : data.addWechats
            this.clickTimes = data.clickTimes === null ? 0 : data.clickTimes
            this.forwardTimes = data.forwardTimes === null ? 0 : data.forwardTimes
            this.giftFeedbackrate = data.giftFeedbackrate === null ? 0 : data.giftFeedbackrate
            this.linkClickTimes = data.linkClickTimes === null ? 0 : data.linkClickTimes
            this.lostContactRate = data.lostContactRate === null ? 0 : data.lostContactRate
            this.modifyFieldCustoms = data.modifyFieldCustoms === null ? 0 : data.modifyFieldCustoms
            this.oldCustomRate = data.oldCustomRate === null ? 0 : data.oldCustomRate
            this.telCalls = data.telCalls === null ? 0 : data.telCalls
            this.wechatCalls = data.wechatCalls === null ? 0 : data.wechatCalls
            this.timePickerChange = false
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
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
