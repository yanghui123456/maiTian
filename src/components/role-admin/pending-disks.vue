<!--销控表-待分配房屋-->
<template>
  <div class="container">
    <div class="mb20" style="display: none;">
      <Row>
        <Col span="8">
        <span class="titleText">经纪人：</span>
        <Select v-model="agentName"  style="width: auto" @on-change="agentChange" :placement="posit" placeholder="请输入小区" filterable>
          <Option v-for="item in agentList" :value="item" :key="item">{{ item }}</Option>
        </Select>
        </Col>
        <Col span="6">
        <!--<Button type="info" @click="search">查询</Button>-->
        </Col>
      </Row>
    </div>
    <Table :columns="dataCol" :loading="loading" :data="dataList" border height="480" size="small"></Table>
    <Page :total="total" :current="pageNum" show-total @on-change="pageChange" class="mt20 tc"/>
  </div>
</template>
<script>
export default {
  data () {
    return {
      userId: '', // 选择的经纪人id
      agentName: '',
      agentList: [], // 经纪人列表
      posit: 'bottom', // 下拉框定位的位置
      loading: true, // 表格加载
      total: 0,
      pageNum: 1, // 第几页
      pageSize: 10,
      dataCol: [
        {
          type: 'index',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '小区名',
          key: 'regionName',
          align: 'center',
          width: 100
        },
        {
          title: '楼号',
          key: 'buildingNumber',
          align: 'center',
          width: 200
        },
        {
          title: '单元号',
          key: 'unitNumber',
          align: 'center'
        },
        {
          title: '楼层',
          key: 'floorNumber',
          align: 'center'
        },
        {
          title: '房间号',
          key: 'houseNumber',
          align: 'center'
        },
        {
          title: '销售状态',
          key: 'businessState',
          align: 'center'
        },
        {
          title: '租赁状态',
          key: 'useState',
          align: 'center'
        },
        {
          title: '房屋现状',
          key: 'leaseState',
          align: 'center'
        },
        {
          title: '业主ID',
          key: 'customId',
          align: 'center'
        },
        {
          title: '业主姓名',
          key: 'customName',
          align: 'center'
        },
        {
          title: '经纪人姓名',
          key: 'agentName',
          align: 'center'
        },
        {
          title: '经纪人ID',
          key: 'agentId',
          align: 'center'
        }
      ],
      dataList: []
    }
  },
  created () {
    this.getList('', this.pageNum, this.pageSize)
    // this.getAgentList()
  },
  methods: {
    // 经纪人下拉change
    agentChange (val) {
      this.agentName = val
    },
    // 获取经纪人下拉列表
    getAgentList () {
      this.$axios.get(window.serverIp + '')
        .then(res => {
          if (res.status === 'success') {
            console.log(res)
            this.agentList = res.data
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 查询
    search () {
      this.getList(this.userId, this.pageNum, this.pageSize)
    },
    // 获取待补盘列表
    getList (userId, pageNum, pageSize) {
      this.$axios.get(window.serverIp + '/api/house/getDaiHouse?user_id==' + userId + '&pageNum=' + pageNum + '&pageSize=' + pageSize)
        .then(res => {
          if (res.status === 'success') {
            console.log(res.data)
            this.loading = false
            this.total = res.data.total
            this.dataList = res.data.records
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 页码改变
    pageChange (val) {
      this.pageNum = val
      this.getList(this.userId, val, this.pageSize)
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
