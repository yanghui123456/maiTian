<!--销控表-楼盘角度-->
<template>
  <div class="container">
    <div class="mb20">
      <Row>
        <Col span="5">
        <span class="titleText">小区：</span>
        <!--<Select v-model="cellName"  style="width: auto" @on-change="cellNameChange" :placement="posit" placeholder="请输入小区" filterable>-->
          <!--<Option v-for="item in cellNameList" :value="item" :key="item">{{ item }}</Option>-->
        <!--</Select>-->
        <Input placeholder="请输入活动名称" style="width:auto" v-model="nameSs" @on-blur="xiaoquBlur"/>
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
      nameSs: '',
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
          title: '区域店组',
          key: 'label',
          align: 'center',
          width: 500
        },
        {
          title: '意向',
          key: 'yixiang',
          align: 'center',
          width: 100
        },
        {
          title: '待补盘',
          key: 'daibupan',
          align: 'center',
          width: 200
        },
        {
          title: '待售',
          key: 'daishou',
          align: 'center',
          width: 200
        },
        {
          title: '待租',
          key: 'daizhu',
          align: 'center',
          width: 200
        },
        {
          title: '互相熟悉',
          key: 'xianghushouxi',
          align: 'center',
          width: 200
        },
        {
          title: '铁客',
          key: 'tieke',
          align: 'center',
          width: 200
        },
        {
          title: '互相认识',
          key: 'xianghurenshi',
          align: 'center',
          width: 200
        },
        {
          title: '单方认识',
          key: 'danfangrenshi',
          align: 'center',
          width: 200
        },
        {
          title: '联系不上',
          key: 'lianxibushang',
          align: 'center',
          width: 200
        }
      ],
      dataList: []
    }
  },
  created () {
    this.getList(this.nameSs, this.pageNum, this.pageSize)
    // this.getCellList('')
  },
  methods: {
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
    // 小区下拉change
    cellNameChange (val) {
      this.cellName = val
      console.log(1)
      // 根据小区获取楼栋号
      this.getCellNumberList(this.cellName)
    },
    // 小区失去焦点时，获取楼号列表
    xiaoquBlur () {
      // 根据小区获取楼栋号
      this.getCellNumberList(this.nameSs)
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
    // 小区楼号change
    cellNumberChange (val) {
      this.cellNumber = val
    },
    // 查询
    search () {
      this.getList(this.nameSs, this.pageNum, this.pageSize)
    },
    // 获取列表departmentId: 最后选择的节点的id;departmentPrefix:片区/大区/区域 文字的
    getList (name, pageNum, pageSize) {
      this.$axios.get(window.serverIp + '/api/house/getHouseTongjiByRegion?region_name=' + name + '&pageNum=' + pageNum + '&pageSize=' + pageSize)
        .then(res => {
          if (res.status === 'success') {
            console.log(res.data)
            this.loading = false
            this.total = res.data.length
            this.dataList = res.data
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
      this.getList(this.nameSs, val, this.pageSize)
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
