<!--销控表-楼盘角度-->
<template>
  <div class="container">
    <div class="mb20">
      <Row>
        <Col span="5">
        <span class="titleText">小区：</span>
        <Select v-model="cellName"  style="width: auto" @on-change="cellNameChange" :placement="posit" placeholder="请输入小区" filterable>
          <Option v-for="item in cellNameList" :value="item" :key="item">{{ item }}</Option>
        </Select>
        </Col>
        <Col span="5">
        <span class="titleText">楼号：</span>
        <Select v-model="cellNumber"  style="width: auto" @on-change="cellNumberChange" :placement="posit" placeholder="请输入楼号" filterable>
          <Option v-for="item in cellNumberList" :value="item" :key="item">{{ item }}</Option>
        </Select>
        </Col>
        <Col span="6">
          <Button type="info" @click="search">查询</Button>
          <Button type="info">导出筛选结果</Button>
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
      posit: 'bottom', // 下拉框定位的位置
      cellName: '', // 小区名字
      cellNumber: '', // 小区楼号
      cellNameList: [], // 小区列表
      cellNumberList: [], // 小区楼号列表
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
    this.getList(this.cellName, this.pageNum, this.pageSize)
    this.getCellList('')
  },
  methods: {
    // 小区下拉change
    cellNameChange (val) {
      this.cellName = val
      console.log(1)
      // 根据小区获取楼栋号
      this.getCellNumberList(this.cellName)
    },
    // 小区楼号change
    cellNumberChange (val) {
      this.cellNumber = val
    },
    // 获取小区下拉列表
    getCellList (name) {
      this.$axios.get(window.serverIp + '/api/house/getRegionByDim?region_name=' + name)
        .then(res => {
          if (res.status === 'success') {
            console.log(res)
            this.cellNameList = res.data
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取楼号下拉
    getCellNumberList (name) {
      this.$axios.get(window.serverIp + '/api/house/getBuildingNumberByDim?region_name=' + name)
        .then(res => {
          if (res.status === 'success') {
            console.log(res)
            this.cellNumberList = res.data
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
      var str = ''
      // 把data的值封装成:片区/大区/区域
      for (var i = 0; i < data.length; i++) {
        if (data.length - 1 > i) {
          str = str + data[i].label + '/'
        } else {
          str = str + data[i].label
        }
      }
      this.moreTextVal = str
    },
    // 查询
    search () {
      this.getList(this.cellName, this.pageNum, this.pageSize)
    },
    // 获取列表departmentId: 最后选择的节点的id;departmentPrefix:片区/大区/区域 文字的
    getList (name, pageNum, pageSize) {
      this.$axios.get(window.serverIp + '/api/house/getHouseTongjiByRegion?region_name==' + name + '&pageNum=' + pageNum + '&pageSize=' + pageSize)
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
      this.getList(this.moreVal[this.moreVal.length - 1], this.moreTextVal, val, this.pageSize)
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
