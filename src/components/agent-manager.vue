<!--经纪人==>顾客列表-->
<template>
  <div class="container">
    <Table :columns="dataCol" :loading="loading" :data="dataList" border height="480" size="small"></Table>
    <Page :total="total" :current="pageNum" show-total @on-change="pageChange" class="mt20 tc"/>
    <!--弹层-->
    <Modal
      v-model="modal"
      :title="modalTitle"
      class-name="modal"
      width="600px"
      @on-visible-change="checkModal">
      <p slot="header" class="tc">{{modalTitle}}</p>
      <div>
        <Row>
          <Col span="12">
          <span class="title">姓名：</span>
          <Input placeholder="请输入姓名" style="width: auto" :disabled="disabled" v-model="modalData.name"/>
          </Col>
        </Row>
        <Row class="mt10">
          <Col span="12">
          <span class="title">性别：</span>
          <RadioGroup v-model="modalData.sex">
            <Radio label="0">
              <span>男</span>
            </Radio>
            <Radio label="1">
              <span>女</span>
            </Radio>
          </RadioGroup>
          </Col>
        </Row>
        <Row class="mt10">
          <Col span="12">
          <span class="title">手机号：</span>
          <Input placeholder="请输入手机号" style="width: auto" :disabled="disabled" v-model="modalData.tel"/>
          </Col>
        </Row>
        <Row class="mt10">
          <Col span="12">
          <span class="title">微信号：</span>
          <Input placeholder="请输入微信号" style="width: auto" :disabled="disabled" v-model="modalData.wxNum"/>
          </Col>
        </Row>
        <Row class="mt10">
          <Col span="12">
          <span class="title">身份证号：</span>
          <Input placeholder="请输入身份证号" style="width: auto" :disabled="disabled" v-model="modalData.idCard"/>
          </Col>
        </Row>
        <Row class="mt10">
          <Col span="12">
          <span class="title">入职日期：</span>
          <DatePicker type="date" placeholder="请选择入职日期" :disabled="disabled" style="width: auto" v-model="modalData.entry" @on-change="dateChange"></DatePicker>
          </Col>
        </Row>
        <Row class="mt10">
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
        <Button type="info" @click="cancel">取消</Button>
      </div>
    </Modal>
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
          title: '经纪人姓名',
          key: 'name',
          align: 'center',
          width: 200
        },
        {
          title: '性别',
          key: 'name',
          align: 'center'
        },
        {
          title: '用户名/手机号',
          key: 'name',
          align: 'center'
        },
        {
          title: '身份证号',
          key: 'gender',
          align: 'center',
          width: 200
        },
        {
          title: '入职日期',
          key: 'gender',
          align: 'center',
          width: 100
        },
        {
          title: '启用状态',
          key: 'gender',
          align: 'center',
          width: 100
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
                    this.seeDetail(params.row)
                  }
                }
              }, '查看'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.edit(params.row)
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      dataList: [],
      modal: false,
      modalTitle: '',
      disabled: false, // 文本框是否禁用
      modalData: {
        name: '', // 姓名
        sex: '', // 性别
        tel: '', // 手机号
        wxNum: '', // 微信号
        idCard: '', // 身份证号
        entry: '', // 入职日期
        radio: '' // 切换 入职/离职状态
      }
    }
  },
  created () {
    this.getTable()
  },
  methods: {
    // 获取表格数据
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
    // 页码改变
    pageChange (val) {
      this.pageNum = val
      // this.getList(val, 10)
    },
    // 保存
    save () {
      this.$Message.warning('保存')
    },
    // 取消
    cancel () {
      this.$Message.warning('取消')
    },
    // 选择入职日期
    dateChange (time, date) {
      this.modalData.date = time
    },
    // 查看详情
    seeDetail (params) {
      console.log(params)
      this.modalStatus(true, '查看经纪人详情', true)
    },
    // 编辑
    edit (params) {
      console.log(params)
      this.modalStatus(true, '编辑经纪人信息', false)
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
    // 当弹窗显示隐藏状态变化时清空弹窗的值
    checkModal (status) {
      // true=显示；false=隐藏
      if (status === false) {
        this.modalData = {
          name: '', // 姓名
          sex: '', // 性别
          tel: '', // 手机号
          wxNum: '', // 微信号
          idCard: '', // 身份证号
          entry: '', // 入职日期
          radio: '' // 切换 入职/离职状态
        }
      }
    }
  },
  // 计算属性
  computed: {},
  // 自定义指令
  directives: {}
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .modal {
    .ivu-modal {
      // top: 30px;
    }
    .ivu-modal-body {
      height: 340px;
      overflow: auto
    }
  }
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
