<!--销控表-组织角度-->
<template>
  <div class="container">
    <div class="mb20">
      <Row>
        <Col span="18">
          <span class="titleText">区域选择：</span>
          <Cascader :data="moreJilian" v-model="moreVal" trigger="click" style="width:80%;display: inline-block;" change-on-select @on-change="cascaderChange"></Cascader>
        </Col>
        <Col span="6">
          <Button type="info" @click="search">查询</Button>
          <Button type="info" v-show="false">导出筛选结果</Button>
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
      moreVal: [], // id数组
      moreTextVal: '', // 包含文字的数组
      moreJilian: [], // 多项级联
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
          title: '片区',
          key: 'hugeArea',
          align: 'center',
          width: 90
        },
        {
          title: '大区',
          key: 'largeArea',
          align: 'center',
          width: 100
        },
        {
          title: '区域',
          key: 'area',
          align: 'center',
          width: 100
        },
        {
          title: '店组',
          key: 'shopGroup',
          align: 'center',
          width: 100
        },
        {
          title: '经纪人',
          key: 'realName',
          align: 'center',
          width: 100
        },
        {
          title: '意向',
          key: 'yixiang',
          align: 'center',
          width: 70
        },
        {
          title: '待补盘',
          key: 'daibupan',
          align: 'center',
          width: 100
        },
        {
          title: '待售',
          key: 'daishou',
          align: 'center',
          width: 70
        },
        {
          title: '待租',
          key: 'daizhu',
          align: 'center',
          width: 80
        },
        {
          title: '互相熟悉',
          key: 'xianghushouxi',
          align: 'center',
          width: 100
        },
        {
          title: '铁客',
          key: 'tieke',
          align: 'center',
          width: 80
        },
        {
          title: '互相认识',
          key: 'xianghurenshi',
          align: 'center',
          width: 100
        },
        {
          title: '单方认识',
          key: 'danfangrenshi',
          align: 'center',
          width: 100
        },
        {
          title: '联系不上',
          key: 'lianxibushang',
          align: 'center',
          width: 100
        }
      ],
      dataList: []
    }
  },
  created () {
    this.getJiLian()
    this.getList('', '', this.pageNum, this.pageSize)
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
      this.getList(this.moreVal[this.moreVal.length - 1], this.moreTextVal, this.pageNum, this.pageSize)
    },
    // 获取列表departmentId: 最后选择的节点的id;departmentPrefix:片区/大区/区域 文字的
    getList (departmentId, departmentPrefix, pageNum, pageSize) {
      this.$axios.get(window.serverIp + '/api/house/getHouseTongjiByDepartment?departmentId=' + departmentId + '&departmentPrefix=' + departmentPrefix + '&pageNum=' + pageNum + '&pageSize=' + pageSize)
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
