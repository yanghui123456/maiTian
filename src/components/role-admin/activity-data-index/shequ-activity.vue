<!--活动数据指标-社区活动-->
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
        <span class="titleText">社区活动：</span>
        <Select v-model="sqActivity" @on-change="activityChange" :placement="posit" placeholder="请选择社区活动" style="width:80%;display: inline-block;">
          <Option v-for="item in activityList" :value="item.communityActityId" :key="item.communityActityId">{{ item.communityName }}</Option>
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
          width: 80
        },
        {
          title: '大区',
          key: 'region',
          align: 'center',
          width: 80
        },
        {
          title: '区域',
          key: 'domain',
          align: 'center',
          width: 80
        },
        {
          title: '店组',
          key: 'shopGroup',
          align: 'center',
          width: 100
        },
        {
          title: '经纪人',
          key: 'agent',
          align: 'center',
          width: 75
        },
        {
          title: '新增手机号',
          key: 'addTels',
          align: 'center',
          width: 100
        },
        {
          title: '新增微信号',
          key: 'addWechats',
          align: 'center',
          width: 100
        },
        {
          title: '新增字段数',
          key: 'addFields',
          align: 'center',
          width: 100
        },
        {
          title: '修改字段数',
          key: 'modifyFields',
          align: 'center',
          width: 100
        }, {
          title: '有新增字段的顾客数',
          key: 'addFieldCustoms',
          align: 'center',
          width: 100
        },
        {
          title: '有修改字段的顾客数',
          key: 'modifyFieldCustoms',
          align: 'center',
          width: 100
        },
        {
          title: '新呼出的微信号数量',
          key: 'wechatCalls',
          align: 'center',
          width: 100
        },
        {
          title: '新呼出的手机号数量',
          key: 'telCalls',
          align: 'center',
          width: 100
        },
        {
          title: '新增互动记录数量',
          key: 'addInteractions',
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
      console.log(val)
      console.log(data)
      this.jilianLevel = data[data.length - 1].level
      this.jilianId = data[data.length - 1].value
      console.log(this.jilianLevel)
      console.log(this.jilianId)
    },
    // 获取社区活动列表
    getActivityList () {
      this.$axios.get(window.serverIp + '/api/community/getLast10Community')
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
        this.$Message.error('请选择社区活动')
      } else {
        this.loading = true
        this.getList(this.jilianId, this.jilianLevel, this.sqActivity)
      }
    },
    // 获取列表departmentId: 最后选择的节点的id;departmentPrefix:片区/大区/区域 文字的
    getList (departmentId, level, activityId) {
      this.$axios.get(window.serverIp + '/api/ActivityStatistic/getCommunityStatistic?departmentId=' + departmentId + '&level=' + level + '&activityId=' + activityId)
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
