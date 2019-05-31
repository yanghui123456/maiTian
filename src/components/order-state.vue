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
      total: 100, // 共多少条数据
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
          key: 'number'
        },
        {
          title: '产品类型',
          key: 'type'
        },
        {
          title: '产品名称',
          key: 'name'
        },
        {
          title: '预约时间',
          key: 'time'
        },
        {
          title: '客户经理',
          key: 'jingli'
        },
        {
          title: '状态',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
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
                    this.show(params.index)
                  }
                }
              }, '已完成')
            ])
          }
        }
      ],
      applyList: [
        {
          number: 'AS123',
          type: '银行理财',
          name: '理财好产品',
          time: '2019.5.29',
          jingli: '杨经理'
        },
        {
          number: 'AS56',
          type: '银行理财',
          name: '理财好产品',
          time: '2019.5.29',
          jingli: '刘经理'
        }
      ]
    }
  },
  created () {
  },
  methods: {
    show (index) {
      this.$Modal.info({
        title: 'User Info',
        content: `Name：${this.applyList[index].name}<br>Age：${this.applyList[index].age}<br>Address：${this.applyList[index].address}`
      })
    },
    // 页码改变
    pageChange (val) {
      console.log('第' + val + '页')
      // this.current = val
      // this.getDatas('recharge', val, this.pageSize)
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
