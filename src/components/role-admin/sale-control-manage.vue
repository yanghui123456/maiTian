<!--管理员==>销控表管理-->
<template>
  <div class="container">
    <div class="mb20">
      <Button type="info">批量导入</Button>
      <Button type="info">下载批量导入模板</Button>
      <Button type="info">导入房屋状态变化信息</Button>
    </div>
    <Table :columns="dataCol" :loading="loading" :data="dataList" border height="480" size="small"></Table>
    <Page :total="total" :current="pageNum" show-total @on-change="pageChange" class="mt20 tc"/>
  </div>
</template>
<script>
export default {
  data () {
    return {
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
          title: '关联业主',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '关联经纪人',
          key: 'name',
          align: 'center',
          width: 200
        },
        {
          title: '房屋状态',
          align: 'center',
          children: [
            {
              title: '房屋销售状态',
              key: 'age',
              align: 'center',
              width: 200
            },
            {
              title: '房屋租赁状态',
              key: 'street',
              align: 'center',
              width: 200
            },
            {
              title: '房屋现状',
              key: 'building',
              align: 'center',
              width: 200
            }
          ]
        },
        {
          title: '房屋信息',
          align: 'center',
          children: [
            {
              title: '门牌号',
              key: 'caddress',
              align: 'center',
              width: 200
            },
            {
              title: '所在楼层',
              key: 'cname',
              align: 'center',
              width: 200
            },
            {
              title: '总楼层',
              key: 'cname',
              align: 'center',
              width: 200
            }
          ]
        }
      ],
      dataList: [
        {
          key: 1,
          name: 'John Brown',
          age: 2,
          street: 'Lake Park',
          building: 'C',
          door: 2035,
          caddress: 'Lake Street 42',
          cname: 'SoftLake Co',
          gender: 'M'
        }
      ]
    }
  },
  created () {
    this.loading = false
  },
  methods: {
    // 页码改变
    pageChange (val) {
      this.pageNum = val
      // this.getList(val, 10)
    }
  },
  // 计算属性
  computed: {},
  // 自定义指令
  directives: {}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
</style>
