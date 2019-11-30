<template>
  <div class="container">
    <!--销控表-列表-->
    <div>
      <Tabs @on-click="tabSwitch" v-model="tabItem">
        <TabPane label="整体" name="all">
          <Table class="mt20" :columns="moreCol" :loading="moreLoading" :data="moreList" border height="480" size="small"></Table>
        </TabPane>
        <TabPane label="小区" name="village">
          <Button type="info" @click="exportAll">导出全部责任盘</Button>
          <Table class="mt20" :columns="moreCol" :loading="moreLoading" :data="moreList" border height="480" size="small"></Table>
        </TabPane>
        <TabPane label="店面" name="store">
          <Table class="mt20" :columns="moreCol" :loading="moreLoading" :data="moreList" border height="480" size="small"></Table>
        </TabPane>
      </Tabs>
      <Page :total="moreTotal" :current="morePageNum" show-total @on-change="morePageChange" class="mt20 tc"/>
    </div>
    <!--分配房屋-弹层-->
    <Modal
      v-model="modal"
      :title="modalTitle"
      class-name="modal"
      width="900px"
      @on-visible-change="checkModal">
      <p slot="header" class="tc">{{modalTitle}}</p>
      <div>
        <Row  v-if="type === 1">
          <Col span="6">
          <Button type="info" @click="houseFenpei">房屋分配</Button>
          <Button type="info">筛选</Button>
          </Col>
        </Row>
        <Row v-if="type === 2">
          <Col span="6">
            <Select v-model="buPan" @on-change="bupanPickerChange" :placement="posit" placeholder="请选择">
              <Option v-for="item in buPanList" :value="item.code" :key="item.code">{{ item.name }}</Option>
            </Select>
          </Col>
        </Row>
        <Table class="mt20" :columns="modalCol" :loading="modalloading" :data="modalList" @on-selection-change="selectTableChange" border height="410" size="small"></Table>
      </div>
      <div slot="footer" class="tc">
        <Page :total="modaltotal" :current="modalpageNum" show-total @on-change="modalPageChange" class="mt20 tc"/>
      </div>
    </Modal>
    <!--销控表-楼栋-->
    <Modal
      v-model="saleListModal"
      class-name="modal"
      width="900px"
      @on-visible-change="checkInModal">
      <p slot="header" class="tc">销控表-楼栋</p>
      <div>
        <Tabs @on-click="tabInSwitch" v-model="tabInItem">
          <TabPane label="整体" name="all">
            <Table class="mt20" :columns="moreInCol" :loading="moreInLoading" :data="moreInList" border height="400" size="small"></Table>
          </TabPane>
          <TabPane label="小区楼号" name="lou">
            <Button type="info" @click="exportInAll">导出全部责任盘</Button>
            <Table class="mt20" :columns="moreInCol" :loading="moreInLoading" :data="moreInList" border height="400" size="small"></Table>
          </TabPane>
          <TabPane label="经纪人" name="agent">
            <Table class="mt20" :columns="moreInCol" :loading="moreInLoading" :data="moreInList" border height="400" size="small"></Table>
          </TabPane>
        </Tabs>
      </div>
      <div slot="footer" class="tc">
        <Page :total="moreInTotal" :current="moreInPageNum" show-total @on-change="moreInPageChange" class="mt20 tc"/>
      </div>
    </Modal>
    <!--销控表-列表-->
    <Modal
      v-model="listModal"
      class-name="modal"
      width="900px">
      <p slot="header" class="tc">销控表-列表</p>
      <div>
        <div>
          <Button type="info">下载销控表模板</Button>
          <Button type="info">上传销控表Excel</Button>
          <Button type="info" @click="distribution">分配房屋</Button>
          <Button type="info" @click="daiBuPan">查看待补盘房屋</Button>
          <Button type="info">筛选</Button>
        </div>
        <Table class="mt20" :columns="dataCol" :loading="loading" :data="dataList" border height="490" size="small"></Table>
      </div>
      <div slot="footer" class="tc">
        <Page :total="total" :current="pageNum" show-total @on-change="pageChange" class="mt20 tc"/>
      </div>
    </Modal>
    <!--房屋分配-确认弹窗-->
    <Modal
      v-model="deletModal"
      title="房屋分配"
      @on-ok="ensureDelete"
      class="tc">
      <p>是否确认进行分配？</p>
    </Modal>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // =======销控表-小区
      tabItem: 'all',
      moreCol: [
        {
          type: 'index',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '整体',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '待售',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '意向',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '待租',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '待补盘',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '联系不上',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '单方认识',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '互相认识',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '互相熟悉',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '铁客',
          key: 'name',
          align: 'center',
          width: 100
        }
      ],
      moreLoading: true,
      moreList: [],
      moreTotal: 0,
      morePageNum: 1,
      // =======销控表-楼栋-弹窗
      saleListModal: false,
      moreInLoading: true,
      tabInItem: 'all',
      moreInTotal: 0,
      moreInPageNum: 1,
      moreInCol: [], // 与外层tab一样
      moreInList: [],
      // ========销控表-列表
      listModal: false,
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
          title: '关联居住人',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '关联经纪人',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '房屋状态',
          align: 'center',
          children: [
            {
              title: '房屋销售状态',
              key: 'age',
              align: 'center',
              width: 100
            },
            {
              title: '房屋租赁状态',
              key: 'street',
              align: 'center',
              width: 100
            },
            {
              title: '房屋现状',
              key: 'building',
              align: 'center',
              width: 100
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
              width: 100
            },
            {
              title: '所在楼层',
              key: 'cname',
              align: 'center',
              width: 100
            },
            {
              title: '总楼层',
              key: 'cname',
              align: 'center',
              width: 100
            },
            {
              title: '面积',
              key: 'cname',
              align: 'center',
              width: 100
            },
            {
              title: '居室',
              key: 'cname',
              align: 'center',
              width: 100
            },
            {
              title: '朝向',
              key: 'cname',
              align: 'center',
              width: 100
            }
          ]
        },
        {
          title: '楼栋信息',
          key: 'gender',
          align: 'center',
          children: [
            {
              title: '开发商',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '物业管理',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '产权性质',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '建筑结构',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '建成年代',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '建筑类型',
              key: 'caddress',
              align: 'center',
              width: 100
            }
          ]
        },
        {
          title: '小区信息',
          key: 'gender',
          align: 'center',
          children: [
            {
              title: '小区名称',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '绿化率',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '容积率',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '车位配比',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '人车分流',
              key: 'caddress',
              align: 'center',
              width: 100
            }
          ]
        },
        {
          title: '商圈信息',
          key: 'gender',
          align: 'center',
          children: [
            {
              title: '商圈名称',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '交通配套',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '历史人文',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '教育资源',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '市场解读',
              key: 'caddress',
              align: 'center',
              width: 100
            }
          ]
        }
      ], // 销控表
      dataList: [],
      // ========房屋分配-弹窗
      type: '', // 1-分配房屋， 2-待补盘
      posit: 'bottom', // 下拉框定位的位置
      modal: false,
      modaltotal: 0,
      modalpageNum: 1,
      modalloading: true,
      buPan: '', // 选择查看补盘条件
      buPanList: [
        {
          code: 1,
          name: '全部待补盘'
        },
        {
          code: 2,
          name: '经纪人1'
        },
        {
          code: 3,
          name: '经纪人2'
        }
      ],
      modalTitle: '',
      modalCol: [],
      modalList: [],
      selectPerson: [], // 已选择分配房屋的数组
      bupanCol: [
        {
          title: '房屋ID',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '关联业主',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '业主电话',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '关联经纪人',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '经纪人电话',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '房屋状态',
          align: 'center',
          children: [
            {
              title: '房屋销售状态',
              key: 'age',
              align: 'center',
              width: 100
            },
            {
              title: '房屋租赁状态',
              key: 'street',
              align: 'center',
              width: 100
            },
            {
              title: '房屋现状',
              key: 'building',
              align: 'center',
              width: 100
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
              width: 100
            },
            {
              title: '所在楼层',
              key: 'cname',
              align: 'center',
              width: 100
            },
            {
              title: '总楼层',
              key: 'cname',
              align: 'center',
              width: 100
            },
            {
              title: '面积',
              key: 'cname',
              align: 'center',
              width: 100
            },
            {
              title: '居室',
              key: 'cname',
              align: 'center',
              width: 100
            },
            {
              title: '朝向',
              key: 'cname',
              align: 'center',
              width: 100
            }
          ]
        },
        {
          title: '楼栋信息',
          key: 'gender',
          align: 'center',
          children: [
            {
              title: '开发商',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '物业管理',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '产权性质',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '建筑结构',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '建成年代',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '建筑类型',
              key: 'caddress',
              align: 'center',
              width: 100
            }
          ]
        },
        {
          title: '小区信息',
          key: 'gender',
          align: 'center',
          children: [
            {
              title: '小区名称',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '绿化率',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '容积率',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '车位配比',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '人车分流',
              key: 'caddress',
              align: 'center',
              width: 100
            }
          ]
        },
        {
          title: '商圈信息',
          key: 'gender',
          align: 'center',
          children: [
            {
              title: '商圈名称',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '交通配套',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '历史人文',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '教育资源',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '市场解读',
              key: 'caddress',
              align: 'center',
              width: 100
            }
          ]
        }
      ], // 待补盘表头
      fenpeiCol: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '房屋ID',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '关联业主',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '原归属人',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '房屋状态',
          align: 'center',
          children: [
            {
              title: '房屋销售状态',
              key: 'age',
              align: 'center',
              width: 100
            },
            {
              title: '房屋租赁状态',
              key: 'street',
              align: 'center',
              width: 100
            },
            {
              title: '房屋现状',
              key: 'building',
              align: 'center',
              width: 100
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
              width: 100
            },
            {
              title: '所在楼层',
              key: 'cname',
              align: 'center',
              width: 100
            },
            {
              title: '总楼层',
              key: 'cname',
              align: 'center',
              width: 100
            },
            {
              title: '面积',
              key: 'cname',
              align: 'center',
              width: 100
            },
            {
              title: '居室',
              key: 'cname',
              align: 'center',
              width: 100
            },
            {
              title: '朝向',
              key: 'cname',
              align: 'center',
              width: 100
            }
          ]
        },
        {
          title: '楼栋信息',
          key: 'gender',
          align: 'center',
          children: [
            {
              title: '开发商',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '物业管理',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '产权性质',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '建筑结构',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '建成年代',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '建筑类型',
              key: 'caddress',
              align: 'center',
              width: 100
            }
          ]
        },
        {
          title: '小区信息',
          key: 'gender',
          align: 'center',
          children: [
            {
              title: '小区名称',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '绿化率',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '容积率',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '车位配比',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '人车分流',
              key: 'caddress',
              align: 'center',
              width: 100
            }
          ]
        },
        {
          title: '商圈信息',
          key: 'gender',
          align: 'center',
          children: [
            {
              title: '商圈名称',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '交通配套',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '历史人文',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '教育资源',
              key: 'caddress',
              align: 'center',
              width: 100
            },
            {
              title: '市场解读',
              key: 'caddress',
              align: 'center',
              width: 100
            }
          ]
        }
      ], // 分配房屋表头
      // 删除提示
      deletModal: false
    }
  },
  created () {
    this.getTabTable()
    // 判断是不是待办事项跳转过来的，是的话，弹出分配房屋弹窗
    // ===店长角色
    console.log(this.$route.query.showFpfwModal)
    var showFpfwModal = this.$route.query.showFpfwModal
    if (showFpfwModal) {
      // 分配房屋按钮方法
      this.distribution()
    }
  },
  methods: {
    // =======================tab 销控表-小区
    // tab页码改变
    morePageChange (val) {
      this.morePageNum = val
      var tabItem = this.tabItem
      if (tabItem === 'all') {
        this.$Message.warning('整体')
      } else if (tabItem === 'village') {
        this.$Message.warning('小区')
      } else if (tabItem === 'store') {
        this.$Message.warning('店面')
      }
    },
    // tab表格
    getTabTable () {
      this.moreLoading = false
      this.moreList = [
        {
          name: 'haha'
        }
      ]
      this.moreTotal = 20
    },
    // tab切换
    tabSwitch (item) {
      console.log(item)
      this.tabItem = item
      this.morePageNum = 1
      if (item === 'all') {
        this.$Message.warning('整体')
        this.moreCol.pop() // 删除数组中最后一项
        this.moreCol[1] = {
          title: '整体',
          key: 'name',
          align: 'center',
          width: 100
        }
      } else if (item === 'village') {
        this.$Message.warning('小区')
        // 往数组中追加一项
        this.moreCol.push({
          title: '操作',
          key: 'gender',
          align: 'center',
          width: 200,
          fixed: 'right',
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
                    this.tabDetail(params.row)
                  }
                }
              }, '查看详情')
            ])
          }
        })
        this.moreCol[1] = {
          title: '小区',
          key: 'name',
          align: 'center',
          width: 100
        }
      } else if (item === 'store') {
        this.$Message.warning('店面')
        this.moreCol.pop()
        this.moreCol[1] = {
          title: '店长',
          key: 'name',
          align: 'center',
          width: 100
        }
      }
    },
    // 小区-导出全部责任盘
    exportAll () {
      this.$Message.warning('导出全部责任盘')
    },
    // 查看详情
    tabDetail (param) {
      console.log(param)
      this.saleListModal = true
      this.moreInLoading = false
      // 数据模拟
      this.moreInTotal = 20
      this.moreInCol = [
        {
          type: 'index',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '整体',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '待售',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '意向',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '待租',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '待补盘',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '联系不上',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '单方认识',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '互相认识',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '互相熟悉',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '铁客',
          key: 'name',
          align: 'center',
          width: 100
        }
      ]
      this.moreInList = [
        {
          name: 'haha'
        }
      ]
    },
    // =====================销控表-楼栋
    // tab页码改变
    moreInPageChange (val) {
      this.moreInPageNum = val
      var tabInItem = this.tabInItem
      if (tabInItem === 'all') {
        this.$Message.warning('整体')
      } else if (tabInItem === 'lou') {
        this.$Message.warning('楼号')
      } else if (tabInItem === 'agent') {
        this.$Message.warning('经纪人')
      }
      // 获取不同的列表
    },
    // tab切换
    tabInSwitch (item) {
      console.log(item)
      this.tabInItem = item
      this.moreInPageNum = 1
      if (item === 'all') {
        this.$Message.warning('整体')
        this.moreInCol.pop()
        this.moreInCol[1] = {
          title: '整体',
          key: 'name',
          align: 'center',
          width: 100
        }
      } else if (item === 'lou') {
        this.$Message.warning('楼号')
        // 往数组中追加一项
        this.moreInCol.push({
          title: '操作',
          key: 'gender',
          align: 'center',
          width: 200,
          fixed: 'right',
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
                    this.detail(params.row)
                  }
                }
              }, '查看详情')
            ])
          }
        })
        this.moreInCol[1] = {
          title: '楼号',
          key: 'name',
          align: 'center',
          width: 100
        }
      } else if (item === 'agent') {
        this.$Message.warning('经纪人')
        this.moreInCol.pop()
        this.moreInCol[1] = {
          title: '经纪人',
          key: 'name',
          align: 'center',
          width: 100
        }
      }
    },
    // 导出责任盘
    exportInAll () {
      this.$Message.warning('导出全部责任盘')
    },
    // =====================销控表-列表
    // 页码改变
    pageChange (val) {
      this.pageNum = val
      // this.getList(val, 10)
    },
    // table表格
    getTable () {
      const data = []
      for (let i = 0; i < 10; i++) {
        data.push({
          key: i,
          name: 'John Brown',
          age: i + 1,
          street: 'Lake Park',
          building: 'C',
          door: 2035,
          caddress: 'Lake Street 42',
          cname: 'SoftLake Co',
          gender: 'M'
        })
      }
      this.dataList = data
      this.loading = false
    },
    checkInModal (status) {
      if (status === false) {
        this.tabInItem = 'all'
      }
    },
    // 查看详情
    detail (param) {
      console.log(param)
      this.listModal = true
      // 模拟数据
      this.total = 30
      this.getTable()
    },
    // ====================弹窗
    modalStatus (showModal, title) {
      /*
       * showModal:是否显示弹窗
       * title：弹窗的title
       * */
      this.modal = showModal
      this.modalTitle = title
    },
    // 当弹窗显示隐藏状态变化时
    checkModal (status) {
      console.log(status)
      // true=显示；false=隐藏
      if (status === false) {
        // 清空上次房屋分配的数据
        this.selectPerson = []
      }
    },
    // 页码改变
    modalPageChange (val) {
      this.modalpageNum = val
      // 获取列表
    },
    // 补盘下拉改变
    bupanPickerChange (val) {
      console.log(val)
      this.buPan = val
    },
    // 待补盘
    daiBuPan () {
      this.modalStatus(true, '查看经纪人待补盘房屋')
      this.type = 2
      this.modalCol = this.bupanCol
      this.modalList = [
        {
          id: 1,
          caddress: '哈哈'
        },
        {
          id: 2,
          caddress: '哈哈'
        }
      ]
      this.modalloading = false
      // this.modaltotal =
    },
    // 分配房屋
    distribution () {
      this.modalStatus(true, '分配房屋')
      this.type = 1
      this.modalCol = this.fenpeiCol
      this.modalList = [
        {
          id: 1,
          caddress: '哈哈'
        },
        {
          id: 2,
          caddress: '哈哈'
        }
      ]
      this.modalloading = false
      // this.modaltotal =
    },
    // 选择表格某一项
    selectTableChange (selection) {
      console.log(selection)
      this.selectPerson = selection
    },
    // 房屋分配
    houseFenpei () {
      if (this.selectPerson.length === 0) {
        this.$Message.warning('请选择分配的人')
      } else {
        this.deletModal = true
      }
    },
    // 确认分配
    ensureDelete () {
      console.log(this.selectPerson)
      // 确认完以后清空 this.selectPerson
      this.deletModal = false
      this.selectPerson = []
      this.distribution()
    }
  },
  // 计算属性
  computed: {},
  // 自定义指令
  directives: {}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .modal {
    .ivu-modal {
      top: 30px;
    }
    .ivu-modal-body {
      height: 540px;
      overflow: auto
    }
  }
</style>
