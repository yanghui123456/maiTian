<!--活动数据指标-成交感恩礼-->
<template>
  <div class="container">
    <div class="mb20">
      <Row>
        <Col span="24">
        <span class="titleText">区域选择：</span>
        <Cascader :data="moreJilian" v-model="moreVal" trigger="click" style="width:60%;display: inline-block;" change-on-select @on-change="cascaderChange"></Cascader>
        </Col>
      </Row>
      <Row class="mt10">
        <Col span="10">
        <span class="titleText">感恩礼活动：</span>
        <Select v-model="sqActivity" @on-change="activityChange" :placement="posit" placeholder="请选择感恩礼" style="width:80%;display: inline-block;">
          <Option v-for="item in activityList" :value="item.gratefulActivityId" :key="item.gratefulActivityId">{{ item.theme }}</Option>
        </Select>
        </Col>
        <Col span="6">
        <Button type="info" @click="search">查询</Button>
        <Button type="info" v-show="false">导出筛选结果</Button>
        </Col>
      </Row>
    </div>
    <Table :columns="dataCol" :loading="loading" :data="dataList" border height="480" size="small"></Table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      posit: 'bottom', // 下拉框定位的位置
      moreVal: [], // id数组
      moreJilian: [], // 多项级联
      jilianLevel: '',
      jilianId: '',
      sqActivity: '',
      activityList: [],
      loading: false, // 表格加载
      dataCol: [
        {
          type: 'index',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '片区',
          key: 'area',
          align: 'center',
          width: 100
        },
        {
          title: '大区',
          key: 'region',
          align: 'center',
          width: 150
        },
        {
          title: '区域',
          key: 'domain',
          align: 'center',
          width: 150
        },
        {
          title: '店组',
          key: 'shopGroup',
          align: 'center',
          width: 150
        },
        {
          title: '经纪人',
          key: 'agent',
          align: 'center',
          width: 150
        },
        {
          title: '礼品回馈率',
          key: 'giftFeedbackRate',
          align: 'center',
          width: 150
        },
        {
          title: '老客户维护率',
          key: 'oldCustomRate',
          align: 'center',
          width: 150
        },
        {
          title: '失联率',
          key: 'lostContactRate',
          align: 'center',
          width: 100
        }
      ],
      dataList: []
    }
  },
  created () {
    this.getJiLian()
    this.getActivityList()
  },
  methods: {
    // 获取级联下拉
    getJiLian () {
      this.$axios.get(window.serverIp + '/api/department/getDepartmentTree?pid=A6275675D8254075913102978DF9E00A')
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
      this.jilianLevel = data[data.length - 1].level
      this.jilianId = data[data.length - 1].value
      console.log(data)
      console.log(this.jilianLevel)
      console.log(this.jilianId)
    },
    // 获取感恩礼活动列表
    getActivityList () {
      this.$axios.get(window.serverIp + '/api/gratefulactivity/getLast10Grateful')
        .then(res => {
          if (res.status === 'success') {
            console.log(res.data)
            this.activityList = res.data
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 社群活动改变
    activityChange (val) {
      console.log(val)
      this.sqActivity = val
    },
    // 查询
    search () {
      if (this.moreVal.length === 0) {
        this.$Message.error('请选择级联')
      } else if (this.sqActivity === '') {
        this.$Message.error('请选择感恩礼活动')
      } else {
        this.loading = true
        this.getList(this.jilianId, this.jilianLevel, this.sqActivity)
      }
    },
    // 获取列表
    getList (departmentId, level, activityId) {
      this.$axios.get(window.serverIp + '/api/ActivityStatistic/getGratefulStatistic?departmentId=' + departmentId + '&level=' + level + '&activityId=' + activityId)
        .then(res => {
          if (res.status === 'success') {
            console.log(res.data)
            this.loading = false
            this.dataList = res.data
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  // 计算属性
  computed: {},
  // 自定义指令
  directives: {}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .titleText{
    width:60px;
  }
  .ivu-select {
    width:66%;
  }
</style>
