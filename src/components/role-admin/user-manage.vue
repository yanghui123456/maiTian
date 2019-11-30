<!--管理员==>用户管理-->
<template>
  <div class="container">
    <div class="mb20">
      <Button type="info" @click="add">添加用户</Button>
    </div>
    <Table :columns="dataCol" :loading="loading" :data="dataList" border height="480" size="small"></Table>
    <Page :total="total" :current="pageNum" show-total @on-change="pageChange" class="mt20 tc"/>
    <!--弹层-->
    <Modal
      v-model="modal"
      :title="modalTitle"
      width="700px"
      @on-visible-change="checkModal">
      <p slot="header" class="tc">{{modalTitle}}</p>
      <div>
        <Row>
          <Col span="12">
          <span class="title">成员身份：</span>
          <Select v-model="modalData.role" style="width: auto" @on-change="roleChange" :placement="posit" placeholder="请选择成员身份">
            <Option v-for="item in roleList" :value="item.code" :key="item.code">{{ item.name }}</Option>
          </Select>
          </Col>
          <Col span="12">
          <span class="title">成员姓名：</span>
          <Input placeholder="请输入成员姓名" style="width: auto" :disabled="disabled" v-model="modalData.name"/>
          </Col>
        </Row>
        <Row class="mt10">
          <Col span="12">
          <span class="title">手机号：</span>
          <Input placeholder="请输入手机号" style="width: auto" :disabled="disabled" v-model="modalData.tel"/>
          </Col>
          <Col span="12">
          <span class="title">身份证号：</span>
          <Input placeholder="请输入身份证号" style="width: auto" :disabled="disabled" v-model="modalData.cardNum"/>
          </Col>
        </Row>
        <Row class="mt10">
          <Col span="12">
          <span class="title">入职日期：</span>
          <DatePicker type="date" placeholder="请选择入职日期" style="width: auto" v-model="modalData.date" @on-change="dateChange"></DatePicker>
          </Col>
          <Col span="12">
          <span class="title">城市公司：</span>
          <Select v-model="modalData.city" style="width: auto" @on-change="cityChange" :placement="posit" placeholder="请选择城市公司">
            <Option v-for="item in cityList" :value="item.code" :key="item.code">{{ item.name }}</Option>
          </Select>
          </Col>
        </Row>
        <Row class="mt10">
          <Col span="12">
          <span class="title">关联片区：</span>
          <Select v-model="modalData.area" style="width: auto" @on-change="areaChange" :placement="posit" placeholder="请选择关联片区">
            <Option v-for="item in areaList" :value="item.code" :key="item.code">{{ item.name }}</Option>
          </Select>
          </Col>
          <Col span="12">
          <span class="title">关联大区：</span>
          <Select v-model="modalData.largeArea" style="width: auto" @on-change="largeAreaChange" :placement="posit" placeholder="请选择关联大区">
            <Option v-for="item in largeAreaList" :value="item.code" :key="item.code">{{ item.name }}</Option>
          </Select>
          </Col>
        </Row>
        <Row class="mt10">
          <Col span="12">
          <span class="title">关联区域：</span>
          <Select v-model="modalData.region" style="width: auto" @on-change="regionChange" :placement="posit" placeholder="请选择关联区域">
            <Option v-for="item in regionList" :value="item.code" :key="item.code">{{ item.name }}</Option>
          </Select>
          </Col>
          <Col span="12">
          <span class="title">关联门店：</span>
          <Select v-model="modalData.store" style="width: auto" @on-change="storeChange" :placement="posit" placeholder="请选择关联门店">
            <Option v-for="item in storeList" :value="item.code" :key="item.code">{{ item.name }}</Option>
          </Select>
          </Col>
        </Row>
        <Row class="mt10">
          <Col span="12">
          <span class="title">关联店长：</span>
          <Select v-model="modalData.shoper" style="width: auto" @on-change="shoperChange" :placement="posit" placeholder="请选择关联店长">
            <Option v-for="item in shoperList" :value="item.code" :key="item.code">{{ item.name }}</Option>
          </Select>
          </Col>
          <Col span="12">
            <span class="title">启用/禁用：</span>
            <RadioGroup v-model="modalData.radio">
              <Radio label="0">
                <span>在职,启用</span>
              </Radio>
              <Radio label="1">
                <span>离职,禁用</span>
              </Radio>
            </RadioGroup>
          </Col>
        </Row>
      </div>
      <div slot="footer" class="tc">
        <Button type="info" @click="save">保存</Button>
        <Button type="info" @click="cancle">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 列表
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
          title: '成员姓名',
          key: 'name',
          align: 'center'
        },
        {
          title: '身份证号',
          key: 'name',
          align: 'center'
        },
        {
          title: '用户名/手机号',
          align: 'center'
        },
        {
          title: '入职日期',
          key: 'gender',
          align: 'center'
        },
        {
          title: '个人标签',
          key: 'gender',
          align: 'center'
        },
        {
          title: '成员身份',
          key: 'gender',
          align: 'center'
        },
        {
          title: '所属店长',
          key: 'gender',
          align: 'center'
        },
        {
          title: '所属门店',
          key: 'gender',
          align: 'center'
        },
        {
          title: '所属区域',
          key: 'gender',
          align: 'center'
        },
        {
          title: '所属大区',
          key: 'gender',
          align: 'center'
        },
        {
          title: '所属片区',
          key: 'gender',
          align: 'center'
        },
        {
          title: '所说城市公司',
          key: 'gender',
          align: 'center'
        },
        {
          title: '启用状态',
          key: 'gender',
          align: 'center'
        },
        {
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
                    this.edit(params.row)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.$Message.error('禁用')
                  }
                }
              }, '禁用')
            ])
          }
        }
      ],
      dataList: [],
      // 弹层
      modal: false,
      modalTitle: '',
      posit: 'bottom', // 下拉框定位的位置
      roleList: [
        {
          name: '北京',
          code: 1111
        }
      ], // 成员身份
      cityList: [
        {
          name: '北京',
          code: 2222
        }
      ], // 城市公司
      areaList: [
        {
          name: '石家庄',
          code: 3333
        }
      ], // 片区
      largeAreaList: [
        {
          name: '桥西区',
          code: 4444
        }
      ], // 大区
      regionList: [
        {
          name: '南高基',
          code: 5555
        }
      ], // 区域
      storeList: [
        {
          name: '南高基东口',
          code: 6666
        }
      ], // 门店
      shoperList: [
        {
          name: '南高基东口',
          code: 7777
        }
      ], // 店长
      disabled: false, // 文本框是否禁用
      modalData: {
        role: '', // 成员身份
        name: '', // 姓名
        tel: '', // 手机号
        cardNum: '', // 身份证号
        city: '', // 城市公司
        area: '', // 片区
        largeArea: '', // 大区
        region: '', // 区域
        store: '', // 门店
        shoper: '', // 店长
        date: '', // 日期
        radio: '' // 启用、禁用
      }
    }
  },
  created () {
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
  methods: {
    // 成员身份改变
    roleChange (val) {
      console.log(val)
      this.modalData.role = val
    },
    // 城市改变
    cityChange (val) {
      console.log(val)
      this.modalData.city = val
    },
    // 片区改变
    areaChange (val) {
      console.log(val)
      this.modalData.area = val
    },
    // 大区改变
    largeAreaChange (val) {
      console.log(val)
      this.modalData.largeArea = val
    },
    // 区域改变
    regionChange (val) {
      console.log(val)
      this.modalData.region = val
    },
    // 门店改变
    storeChange (val) {
      console.log(val)
      this.modalData.store = val
    },
    // 店长改变
    shoperChange (val) {
      console.log(val)
      this.modalData.shoper = val
    },
    // 选择日期
    dateChange (time, date) {
      this.modalData.date = time
    },
    // 初始化数据
    clearData () {
      this.modalData = {
        role: '', // 成员身份
        name: '', // 姓名
        tel: '', // 手机号
        cardNum: '', // 身份证号
        city: '', // 城市公司
        area: '', // 片区
        largeArea: '', // 大区
        region: '', // 区域
        store: '', // 门店
        shoper: '', // 店长
        date: '', // 日期
        radio: '' // 启用、禁用
      }
    },
    modalStatus (showModal, title, disabled) {
      /*
       * showModal:是否显示弹窗
       * title：弹窗的title
       * disabled:弹窗中的文本框是否禁用
       * */
      this.modal = showModal
      this.modalTitle = title
      this.disabled = disabled
    },
    // 保存
    save () {
      console.log(this.modalData)
    },
    // 取消
    cancle () {
      this.clearData()
      this.modal = false
    },
    // 页码改变
    pageChange (val) {
      this.pageNum = val
      // this.getList(val, 10)
    },
    // 当弹窗显示隐藏状态变化时2
    checkModal (status) {
      console.log(status)
      // true=显示；false=隐藏
      if (status === false) {
        this.clearData()
      }
    },
    // 添加
    add () {
      this.modalStatus(true, '添加用户', false)
    },
    // 编辑
    edit (params) {
      console.log(params)
      this.modalStatus(true, '编辑用户', false)
    }
  },
  // 计算属性
  computed: {},
  // 自定义指令
  directives: {}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .modalTitle {
    font-size: 13px;
    font-weight 700;
    margin-bottom: 10px;
    color: black;
  }
  .ivu-tag:not(.ivu-tag-border):not(.ivu-tag-dot):not(.ivu-tag-checked) {
    background: #eee;
  }
</style>
