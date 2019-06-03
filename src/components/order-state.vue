<template>
  <!--业务管理-->
  <div class="order">
    <Tabs style="width:100%">
      <TabPane label="预约产品列表" icon="ios-list-box">
        <Table border :columns="applyCol" :data="applyList"></Table>
        <Page :total="total" :current="current" :show-sizer="true" show-total @on-change="pageChange"  class="mt20 tc"/>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
export default {
  data () {
    return {
      total: 0, // 共多少条数据
      current: 1, // 当前是第几页
      pageSize: 10, // 每页多少条
      applyCol: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '预约订单号',
          key: 'orderNo'
        },
        {
          title: '产品名称',
          key: 'productName'
        },
        {
          title: '预约时间',
          key: 'appointmentDate'
        },
        {
          title: '客户经理姓名',
          key: 'managerName'
        },
        {
          title: '操作',
          key: 'status',
          width: 150,
          align: 'center',
          render: (h, params) => {
            const status = params.row.status
            if (status === 1) {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.complete({
                        id: params.row.id,
                        version: params.row.version
                      })
                    }
                  }
                }, '去完成')
              ])
            } else {
              return h('div', [
                h('Button', {
                  props: {
                    disabled: 'disabled',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                    }
                  }
                }, '已完成')
              ])
            }
          }
        }
      ],
      applyList: []
    }
  },
  created () {
    this.getList({
      pageNum: 1,
      pageSize: 10,
      searchBean: {
        orderNo: ''
      }
    })
  },
  methods: {
    // 页码改变
    pageChange (val) {
      console.log('第' + val + '页')
      this.current = val
      this.getList({
        pageNum: val,
        pageSize: 10,
        searchBean: {
          orderNo: ''
        }
      })
    },
    // 去完成
    complete (params) {
      this.$axios.post(window.serverIp + '/sys/business/finish', params)
        .then((res) => {
          if (res.code === 0) {
            this.getList({
              pageNum: this.current,
              pageSize: 10,
              searchBean: {
                orderNo: ''
              }
            })
          } else {
            this.$Message.warning(res.msg)
          }
        })
        .catch((err) => {
          this.$Message.warning(err)
        })
    },
    // 获取预约业务列表
    getList (params) {
      this.$axios.post(window.serverIp + '/sys/business/list', params)
        .then((res) => {
          if (res.code === 0) {
            var data = res.body
            console.log(data)
            this.total = data.total
            this.applyList = data.list
          } else {
            this.$Message.warning(res.msg)
          }
        })
        .catch((err) => {
          this.$Message.warning(err)
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
  .order
    width: 100%;
    height: 100%;
    padding: 20px;
    background white;
    border-radius 20px;
    box-sizing border-box;
    overflow auto;
</style>
