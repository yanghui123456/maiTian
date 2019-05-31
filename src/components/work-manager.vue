<template>
  <!--名片管理-->
  <div class="work">
    <Button type="primary">新增产品</Button>
    <Tabs style="width:100%" @on-click="tabClick" >
      <TabPane label="银行理财" icon="logo-usd" name="bank">
        <Table border :columns="bankCol" :data="bankList"></Table>
        <Page :total="total" :current="pageNum" show-total @on-change="pageChange"  class="mt20 tc"/>
      </TabPane>
      <TabPane label="个人贷款" icon="logo-usd" name="personal">
        <Table border :columns="personalCol" :data="personalList"></Table>
        <Page :total="total" :current="pageNum" show-total @on-change="pageChange"  class="mt20 tc"/>
      </TabPane>
      <TabPane label="银行存款" icon="logo-usd" name="regular">
        <Table border :columns="regularCol" :data="regularList"></Table>
        <Page :total="total" :current="pageNum" show-total @on-change="pageChange"  class="mt20 tc"/>
      </TabPane>
      <TabPane label="拼财富" icon="logo-usd" name="fortune">
        <Table border :columns="fortuneCol" :data="fortuneList"></Table>
        <Page :total="total" :current="pageNum" show-total @on-change="pageChange"  class="mt20 tc"/>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
export default {
  data () {
    return {
      pageNum: 1, // 第几页
      total: 0,
      pageSize: 10,
      params: {
        pageNum: 1,
        pageSize: 10,
        searchBean: {
          productName: ''
        }
      }, // 获取四中类型列表默认传参
      tabName: 'bank',
      // 银行理财
      bankCol: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '产品名称',
          key: 'productName'
        },
        {
          title: '最新净值',
          key: 'latestNetWorth'
        },
        {
          title: '产品标签',
          key: 'tag'
        },
        {
          title: '产品说明',
          key: 'description'
        },
        {
          title: '创建时间',
          key: 'gmtCreate'
        },
        {
          title: '操作',
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
                    console.log(params)
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      bankList: [],
      // 个人贷款
      personalCol: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '产品名称',
          key: 'productName'
        },
        {
          title: '最高贷款额度(万元)',
          key: 'maxLoanAmount'
        },
        {
          title: '贷款最高比例(%)',
          key: 'maximumLoanRatio'
        },
        {
          title: '还款方式',
          key: 'repayment'
        },
        {
          title: '创建时间',
          key: 'gmtCreate'
        },
        {
          title: '操作',
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
                    console.log(params)
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      personalList: [],
      // 银行存款
      regularCol: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '产品名称',
          key: 'productName'
        },
        {
          title: '起存金额(元)',
          key: 'minDepositAmount'
        },
        {
          title: '产品期限',
          key: 'duration'
        },
        {
          title: '产品标签',
          key: 'tag'
        },
        {
          title: '创建时间',
          key: 'gmtCreate'
        },
        {
          title: '操作',
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
                    console.log(params)
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      regularList: [],
      // 拼财富
      fortuneCol: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '产品名称',
          key: 'productName'
        },
        {
          title: '产品标签',
          key: 'tag'
        },
        {
          title: '预计年化收益(%)',
          key: 'annualizedIncome'
        },
        {
          title: '产品说明',
          key: 'description'
        },
        {
          title: '创建时间',
          key: 'gmtCreate'
        },
        {
          title: '操作',
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
                    console.log(params)
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      fortuneList: []
    }
  },
  created () {
    this.tabClick('bank')
  },
  methods: {
    // tab 切换
    tabClick (name) {
      this.tabName = name
      this.pageNum = 1
      if (name === 'bank') {
        // 银行理财
        this.getList('/sys/product/financing/list', this.params, 'bank')
      } else if (name === 'personal') {
        // 个人贷款
        this.getList('/sys/product/loan/list', this.params, 'personal')
      } else if (name === 'regular') {
        // 银行存款
        this.getList('/sys/product/deposit/list', this.params, 'regular')
      } else if (name === 'fortune') {
        // 拼财富
        this.getList('/sys/product/wealth/list', this.params, 'fortune')
      }
    },
    // 获取列表
    getList (url, params, type) {
      this.$axios.post(window.serverIp + url, params)
        .then((res) => {
          if (res.code === 0) {
            var data = res.body
            console.log(data)
            this.total = data.total
            // 根据类型给不同列表赋值
            if (type === 'bank') {
              this.bankList = data.list
            } else if (type === 'personal') {
              this.personalList = data.list
            } else if(type === 'regular') {
              this.regularList = data.list
            } else if (type === 'fortune') {
              this.fortuneList = data.list
            }
          } else {
            this.$Message.warning(res.msg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 页码改变
    pageChange (val) {
      console.log('第' + val + '页')
      this.pageNum = val
      var params = {
        pageNum: val,
        pageSize: this.pageSize,
        searchBean: {
          productName: ''
        }
      }
      // 根据tabName去获取对应类型列表
      if (this.tabName === 'bank') {
        this.getList('/sys/product/financing/list', params, 'bank')
      } else if (this.tabName === 'personal') {
        this.getList('/sys/product/loan/list', params, 'personal')
      } else if (this.tabName === 'regular') {
        this.getList('/sys/product/deposit/list', params, 'regular')
      } else if (this.tabName === 'fortune') {
        this.getList('/sys/product/wealth/list', params, 'fortune')
      }
    }
  },
  // 计算属性
  computed: {},
  // 自定义指令
  directives: {}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .work
    width: 100%;
    height: 100%;
    padding: 20px;
    background white;
    border-radius 20px;
    box-sizing border-box;
    overflow auto;
</style>
