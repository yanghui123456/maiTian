<!--管理员--》活动管理--》客户感恩礼-->
<template>
  <div class="container">
    <div class="mb20" v-if="role === 1">
      <Button type="info" @click="addActivity">添加活动</Button>
      <Button type="info" @click="downLoad">下载成交客户名单模板</Button>
    </div>
    <Table :columns="dataCol" :loading="loading" :data="dataList" border height="480" size="small"></Table>
    <Page :total="total" :current="pageNum" show-total @on-change="pageChange" class="mt20 tc"/>
    <!--添加感恩礼活动-弹层-->
    <Modal
      v-model="modal"
      :title="modalTitle"
      class-name="modal"
      width="900px"
      @on-visible-change="checkModal">
      <p slot="header" class="tc">{{modalTitle}}</p>
      <div class="modalCentenr">
        <!--受众、参加店组-->
        <div class="borderBottom">
          <Row>
            <Col span="12">
            <span class="title">活动受众：</span>
            <Select :disabled="disabled" v-model="modalData.audience" @on-change="audienceSelectChange" :placement="posit" placeholder="请选择活动受众">
              <Option v-for="item in audienceList" :value="item.code" :key="item.code">{{ item.name }}</Option>
            </Select>
            </Col>
          </Row>
          <!--管理员角色可见；店长不可见-->
          <Row v-if="role === 1">
            <Col span="12">
            <span class="title">选择可参加的店组：</span>
            <Checkbox
              :indeterminate="indeterminate"
              :value="checkAll"
              @click.prevent.native="handleCheckAll">全选</Checkbox>
            <CheckboxGroup v-model="modalData.shop" @on-change="checkAllGroupChange">
              <Checkbox label="1">
                <span>第一</span>
              </Checkbox>
              <Checkbox label="2">
                <span>第二</span>
              </Checkbox>
              <Checkbox label="3">
                <span>第三</span>
              </Checkbox>
            </CheckboxGroup>
            {{modalData.shop}}
            </Col>
          </Row>
        </div>
        <!--活动介绍-->
        <div class="borderBottom">
          <p class="modalTitle">活动介绍</p>
          <Row>
            <Col span="24">
            <span class="title">活动主题：</span>
            <Input placeholder="请输入活动主题" style="width: auto" :disabled="disabled" v-model="modalData.theme"/>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">活动目的：</span>
            <Input placeholder="请输入活动目的" style="width: auto" :disabled="disabled" v-model="modalData.objective"/>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">活动描述：</span>
            <Input placeholder="请输入活动描述" :disabled="disabled"  style="width:80%" v-model="modalData.description" type="textarea" :rows="4"/>
            </Col>
          </Row>
        </div>
        <!--客户信息 管理员角色可见；店长不可见-->
        <div class="borderBottom" v-if="role === 1">
          <p class="modalTitle">客户信息<span class="smallTitle">(参与本活动的老客户信息)</span></p>
          <Row>
            <Col span="12">
            <span class="title">批量导入：</span>
            <Button type="info" @click="choiceFile">选择Excel文件</Button>
            </Col>
          </Row>
        </div>
        <!--礼品信息-->
        <p class="modalTitle mt10">礼品信息</p>
        <div class="borderBottom" v-for="(item, index) in modalData.giftList" :key="index">
          <div style="overflow: hidden">
            <!--管理员角色可见；店长不可见-->
            <Button v-if="role === 1" type="error" size="small" style="float: right" @click="deletItem(item.id)">删除该项</Button>
          </div>
          <Row>
            <Col span="5" style="margin-top:30px">
            <Upload
              ref="upload"
              :show-upload-list="false"
              :on-success="handleSuccess"
              :format="['jpg','jpeg','png']"
              :max-size="2048"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              action="https://mp.cd.htaibao.com/merchant/picture"
              style="display: inline-block;width:58px;">
              <div style="width: 58px;height:58px;line-height: 58px;border:1px solid #eee;" class="tc">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
            <img :src="item.src" alt="图片" style="display:inline-block;width:58px;height:58px;border-radius: 5px;background: red;position: absolute;top:0;left:80px">
            </Col>
            <Col span="16">
            <Row>
              <Col span="24">
              <Input placeholder="请输入礼品名称" style="width: auto" :disabled="disabled" v-model="item.name"/>
              </Col>
              <Col span="24" class="mt10 mb10">
              <Input placeholder="请输入礼品描述" style="width: auto" :disabled="disabled" v-model="item.describe"/>
              </Col>
              <Col span="24">
              <Input placeholder="请输入礼品价格" style="width: auto" :disabled="disabled" v-model="item.price"/>
              </Col>
            </Row>
            </Col>
          </Row>
        </div>
        <!--管理员角色可见；店长不可见-->
        <div class="borderBottom" v-if="role === 1">
          <Button type="info" class="mt10" @click="addGift">继续添加礼品</Button>
        </div>
        <!--时间-->
        <div class="borderBottom">
          <Row>
            <Col span="24">
            <span class="title">礼品最晚送达时间：</span>
            <DatePicker type="date" :disabled="disabled" placeholder="礼品最晚送达时间" style="width: auto" v-model="modalData.serviceTime" @on-change="serviceChange"></DatePicker>
            <TimePicker :editable="true" :disabled="disabled" v-model="modalData.serviceTimeDetail" format="HH点mm分ss秒" placeholder="时分秒" style="width: 168px"></TimePicker>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">礼品最晚签收时间：</span>
            <DatePicker type="date" :disabled="disabled" placeholder="请选择礼品最晚签收时间" style="width: auto" v-model="modalData.signTime" @on-change="signChange"></DatePicker>
            <TimePicker :editable="true" :disabled="disabled" v-model="modalData.signTimeDetail" format="HH点mm分ss秒" placeholder="时分秒" style="width: 168px"></TimePicker>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <span class="title">咨询方式：</span>
            <Input placeholder="可填写电话、也可填文字" style="width: auto" :disabled="disabled" v-model="modalData.tel"/>
            </Col>
          </Row>
          <!--管理员角色可见；店长不可见-->
          <div v-if="role === 1">
            <Row>
              <Col span="24">
              <span class="title">推送至店长时间：</span>
              <DatePicker type="date" :disabled="disabled" placeholder="请选择推送至店长时间" style="width: auto" v-model="modalData.shoperTime" @on-change="shoperChange"></DatePicker>
              <TimePicker :editable="true" :disabled="disabled" v-model="modalData.shoperTimeDetail" format="HH点mm分ss秒" placeholder="时分秒" style="width: 168px"></TimePicker>
              </Col>
            </Row>
            <Row>
              <Col span="24">
              <span class="title">推送至经纪人时间：</span>
              <DatePicker type="date" :disabled="disabled" placeholder="请选择推送至经纪人时间" style="width: auto" v-model="modalData.agentTime" @on-change="agentChange"></DatePicker>
              <TimePicker :editable="true" :disabled="disabled" v-model="modalData.agentTimeDetail" format="HH点mm分ss秒" placeholder="时分秒" style="width: 168px"></TimePicker>
              </Col>
            </Row>
            <Row>
              <Col span="24">
              <span class="title">活动结束时间：</span>
              <DatePicker type="date" :disabled="disabled" placeholder="请选择活动结束时间" style="width: auto" v-model="modalData.endTime" @on-change="endChange"></DatePicker>
              <TimePicker :editable="true" :disabled="disabled" v-model="modalData.endTimeDetail" format="HH点mm分ss秒" placeholder="时分秒" style="width: 168px"></TimePicker>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <div slot="footer" class="tc">
        <!--管理员角色可见；店长不可见-->
        <div v-if="role === 1">
          <Button type="info" @click="save">保存</Button>
          <Button type="info" @click="publish">发布</Button>
          <Button type="info" @click="cancel">取消</Button>
        </div>
      </div>
    </Modal>
    <!--查看感恩礼送达详情-->
    <Modal
      v-model="detailModal"
      title="成交客户感恩礼礼品送达详情"
      class-name="modal"
      width="900px">
      <p slot="header" class="tc">成交客户感恩礼礼品送达详情</p>
      <div class="modalCentenr">
        <Button type="info" @click="exportFile" class="mb10">导出</Button>
        <Button type="info" @click="screen" class="mb10" v-if="role === 2">筛选</Button>
        <Table :columns="detailCol" :loading="detailLoading" :data="detailTable" border height="420" size="small"></Table>
      </div>
      <div slot="footer" class="tc">
        <Page :total="detailTotal" :current="detailPageNum" show-total @on-change="detailPageChange" class="mt20 tc"/>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  data () {
    return {
      role: 2, // 原型中区域经理是没有感恩礼这个模块的   1=管理员；2=店长；
      // ============== 管理员角色===========
      // 所有活动列表
      loading: true, // 表格加载
      total: 0,
      pageNum: 1, // 第几页
      pageSize: 10,
      dataCol: [],
      managerCol: [
        {
          type: 'index',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '发生时间',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '本月成交客总量',
          key: 'name',
          align: 'center',
          width: 150
        },
        {
          title: '本月礼品支持数量',
          align: 'center',
          width: 150
        },
        {
          title: '活动主题',
          key: 'gender',
          align: 'center',
          width: 150
        },
        {
          title: '活动受众',
          key: 'gender',
          align: 'center',
          width: 100
        },
        {
          title: '活动目的',
          key: 'gender',
          align: 'center',
          width: 100
        },
        {
          title: '活动描述',
          key: 'gender',
          align: 'center',
          width: 100
        },
        {
          title: '礼品名称',
          key: 'gender',
          align: 'center',
          width: 100
        },
        {
          title: '礼品描述',
          key: 'gender',
          align: 'center',
          width: 100
        },
        {
          title: '礼品价格',
          key: 'gender',
          align: 'center'
        },
        {
          title: '礼品图片',
          key: 'gender',
          align: 'center',
          width: 100
        },
        {
          title: '咨询方式',
          key: 'gender',
          align: 'center',
          width: 100
        },
        {
          title: '查看礼品送达情况',
          key: 'gender',
          align: 'center',
          width: 135,
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
                    this.sendDetail(params.row)
                  }
                }
              }, '查看')
            ])
          }
        }
      ], // 管理员表头
      dataList: [],
      // =================店长角色==============
      shoperCol: [
        {
          type: 'index',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '本月成交客户总量',
          key: 'name',
          align: 'center',
          width: 150
        },
        {
          title: '本月礼品支持数量',
          key: 'name',
          align: 'center',
          width: 150
        },
        {
          title: '活动主题',
          key: 'gender',
          align: 'center',
          width: 150
        },
        {
          title: '活动受众',
          key: 'gender',
          align: 'center',
          width: 150
        },
        {
          title: '活动目的',
          key: 'gender',
          align: 'center',
          width: 150
        },
        {
          title: '活动描述',
          key: 'gender',
          align: 'center',
          width: 150
        },
        {
          title: '礼品名称',
          key: 'gender',
          align: 'center',
          width: 150
        },
        {
          title: '礼品描述',
          key: 'gender',
          align: 'center',
          width: 150
        },
        {
          title: '礼品价格',
          key: 'gender',
          align: 'center',
          width: 150
        },
        {
          title: '礼品图片',
          key: 'gender',
          align: 'center',
          width: 150
        },
        {
          title: '礼品送达时间',
          key: 'gender',
          align: 'center',
          width: 150
        },
        {
          title: '咨询电话',
          key: 'gender',
          align: 'center',
          width: 150
        },
        {
          title: '客户信息Excel',
          key: 'gender',
          align: 'center',
          width: 120,
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
                    this.downLoadExcel(params.row)
                  }
                }
              }, '下载')
            ])
          }
        },
        {
          title: '查看活动详情',
          key: 'gender',
          align: 'center',
          width: 110,
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
                    this.interactDetail(params.row)
                  }
                }
              }, '查看')
            ])
          }
        },
        {
          title: '查看礼品送达情况',
          key: 'gender',
          align: 'center',
          width: 135,
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
                    this.serviceDetail(params.row)
                  }
                }
              }, '查看')
            ])
          }
        },
        {
          title: '礼品送达门店情况',
          key: 'gender',
          align: 'center',
          width: 135,
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
                    this.shopDetail(params.row)
                  }
                }
              }, '确认礼品送达')
            ])
          }
        }
      ], // 店长表头
      // ==================添加感恩礼活动--弹窗
      modal: false,
      modalTitle: '',
      disabled: false, // 文本框是否禁用
      posit: 'bottom', // 下拉框定位的位置
      audienceList: [
        {
          name: '受众1',
          code: 1111
        },
        {
          name: '受众2',
          code: 2222
        }
      ],
      modalData: {
        audience: '', // 受众
        shop: [], // 店组
        theme: '', // 活动主题
        objective: '', // 活动目的
        description: '', // 活动描述
        serviceTime: '', // 礼品最晚送达时间
        serviceTimeDetail: '', // 礼品最晚送达时间，时分
        signTime: '', // 礼品最晚签收时间
        signTimeDetail: '', // 礼品最晚签收时间，时分
        tel: '', // 咨询电话
        shoperTime: '', // 推送至店长时间
        shoperTimeDetail: '', // 推送至店长时间, 时分
        agentTime: '', // 推送至经纪人时间
        agentTimeDetail: '', // 推送至经纪人时间, 时分
        endTime: '', // 活动结束时间
        endTimeDetail: '', // 活动结束时间, 时分
        // 礼品介绍
        giftList: [
          {
            id: 1,
            name: '', // 礼品名称
            describe: '', // 礼品描述
            img: '', // 图片
            price: '' // 价格
          }
        ]
      },
      indeterminate: true, // 全选
      checkAll: false,
      // ================感恩礼送达详情-弹窗
      detailModal: false,
      detailLoading: true,
      detailCol: [],
      manageDetailCol: [
        {
          type: 'index',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '店长姓名',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '店长身份证号',
          key: 'name',
          align: 'center',
          width: 150
        },
        {
          title: '经纪人姓名',
          align: 'center',
          width: 100
        },
        {
          title: '经纪人身份证号',
          key: 'gender',
          align: 'center',
          width: 150
        },
        {
          title: '客户姓名',
          key: 'gender',
          align: 'center',
          width: 100
        },
        {
          title: '客户电话',
          key: 'gender',
          align: 'center',
          width: 120
        },
        {
          title: '客户身份证号',
          key: 'gender',
          align: 'center',
          width: 150
        },
        {
          title: '客户生日',
          key: 'gender',
          align: 'center',
          width: 100
        },
        {
          title: '成交日期',
          key: 'gender',
          align: 'center',
          width: 100
        },
        {
          title: '礼品送达情况',
          key: 'gender',
          align: 'center',
          width: 120,
          fixed: 'right'
        }
      ], // 管理员送达详情表头
      shoperDetailCol: [
        {
          type: 'index',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '经纪人姓名',
          align: 'center',
          width: 100
        },
        {
          title: '经纪人身份证号',
          key: 'gender',
          align: 'center',
          width: 150
        },
        {
          title: '客户姓名',
          key: 'gender',
          align: 'center',
          width: 100
        },
        {
          title: '客户电话',
          key: 'gender',
          align: 'center',
          width: 120
        },
        {
          title: '客户身份证号',
          key: 'gender',
          align: 'center',
          width: 150
        },
        {
          title: '客户生日',
          key: 'gender',
          align: 'center',
          width: 100
        },
        {
          title: '成交日期',
          key: 'gender',
          align: 'center',
          width: 100
        },
        {
          title: '礼品送达情况',
          key: 'gender',
          align: 'center',
          width: 120,
          fixed: 'right'
        }
      ], // 店长送达详情表头
      detailTable: [],
      detailTotal: 0,
      detailPageNum: 1
    }
  },
  created () {
    if (this.role === 1) {
      // 管理员
      this.dataCol = this.managerCol
      this.getManageTable()
    } else if (this.role === 2) {
      // 店长
      this.dataCol = this.shoperCol
      this.getShoperTable()
      // 判断是不是待办事项页面过来的，showDetailModal=true查看活动详情，showArriveModal=true活动礼品送达详情
      var showDetailModal = this.$route.query.showDetailModal
      var showArriveModal = this.$route.query.showArriveModal
      if (showDetailModal) {
        this.interactDetail()
      } else if (showArriveModal) {
        this.serviceDetail()
      }
    }
  },
  methods: {
    // 弹窗状态、标题、是否禁用文本框
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
    // 当弹窗显示隐藏状态变化时
    checkModal (status) {
      console.log(status)
      // true=显示；false=隐藏
      if (status === false) {
      }
    },
    // 管理员--表格
    getManageTable () {
      const data = []
      for (let i = 0; i < 2; i++) {
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
      // this.getTable(val, 10)
    },
    // 下载成交模板
    downLoad () {
      this.$Message.warning('下载成交客户名单模板')
    },
    // =========================添加感恩礼活动
    // 添加活动
    addActivity () {
      this.modalStatus(true, '添加客户感恩礼活动', false)
    },
    // 保存活动
    save () {
      this.$Message.warning('保存')
      console.log(this.modalData)
    },
    // 发布活动
    publish () {
      this.$Message.warning('发布')
    },
    // 取消活动
    cancel () {
      this.$Message.warning('取消')
    },
    // 城市改变
    audienceSelectChange (val) {
      console.log(val)
      this.audience = val
    },
    // 礼品最晚送达时间
    serviceChange (time, date) {
      console.log(time)
      this.modalData.serviceTime = time
    },
    // 礼品最晚签收时间
    signChange (time, date) {
      console.log(time)
      this.modalData.signTime = time
    },
    // 推送至店长时间
    shoperChange (time, date) {
      console.log(time)
      this.modalData.shoperTime = time
    },
    // 推送至经纪人时间
    agentChange (time, date) {
      console.log(time)
      this.modalData.agentTime = time
    },
    // 活动结束时间
    endChange (time, date) {
      console.log(time)
      this.modalData.endTime = time
    },
    // 选择文件
    choiceFile () {
      this.$Message.warning('选择文件')
    },
    // 添加某一组礼品
    addGift () {
      // 往modalData中的giftList中追加一项空数据
      var length = this.modalData.giftList.length
      console.log(length)
      this.modalData.giftList.push({
        id: length + 1, // 自定义的id
        name: '', // 礼品名称
        describe: '', // 礼品描述
        price: '', // 礼品价格
        img: '' // 图片
      })
    },
    // 删除某一组礼品
    deletItem (id) {
      console.log(id)
      this.modalData.giftList.splice(id - 1, 1)
      console.log(this.modalData.giftList)
    },
    // 图片上传成功时
    handleSuccess (response, file, fileList) {
      console.log(response)
      console.log(file)
      console.log(fileList)
    },
    // 文件格式验证失败
    handleFormatError (file, fileList) {
      console.log(file)
      console.log(fileList)
      this.$Message.error('文件格式校验失败')
    },
    // 文件超出指定大小
    handleMaxSize (file, fileList) {
      console.log(file)
      console.log(fileList)
      this.$Message.error('文件超出指定大小')
    },
    // 全选
    handleCheckAll () {
      if (this.indeterminate) {
        this.checkAll = false
      } else {
        this.checkAll = !this.checkAll
      }
      this.indeterminate = false
      if (this.checkAll) {
        this.modalData.shop = ['1', '2', '3']
      } else {
        this.modalData.shop = []
      }
    },
    // 选择多选框
    checkAllGroupChange (data) {
      if (data.length === 3) {
        this.indeterminate = false
        this.checkAll = true
      } else if (data.length > 0) {
        this.indeterminate = true
        this.checkAll = false
      } else {
        this.indeterminate = false
        this.checkAll = false
      }
    },
    // ======================成交感恩礼送达详情
    sendDetail () {
      this.detailModal = true
      this.detailCol = this.manageDetailCol
      const data = []
      for (let i = 0; i < 2; i++) {
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
      this.detailTable = data
      this.detailLoading = false
      // this.detailTotal = false
    },
    // 页码改变
    detailPageChange (val) {
      this.detailPageNum = val
      // this.getTable(val, 10)
    },
    // 导出
    exportFile () {
      this.$Message.warning('导出')
    },
    // ================店长角色========================
    // 获取列表
    getShoperTable () {
      const data = []
      for (let i = 0; i < 2; i++) {
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
    // 下载客户信息
    downLoadExcel (param) {
      console.log(param)
      this.$Message.warning('下载')
    },
    // 查看活动详情
    interactDetail (param) {
      console.log(param)
      // 当角色是店长时：详情中有些项是不展示的（对管理员角色是展示的）
      this.modalStatus(true, '查看活动详情', true)
    },
    // 查看礼品送达情况
    serviceDetail (param) {
      console.log(param)
      this.detailModal = true
      this.detailLoading = false
      this.detailCol = this.shoperDetailCol
      // this.detailTotal = 总共条数
      // this.detailTable = 列表数据
    },
    // 礼品送达门店情况
    shopDetail (param) {
      console.log(param)
      this.$Message.warning('通过后台接口更改状态即可更改状态')
    },
    // 筛选
    screen () {
      this.$Message.warning('筛选')
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
      height: 500px;
      overflow: auto
    }
    .ivu-select{
      width:50%;
    }
    .modalCentenr{
      .borderBottom .ivu-row{
        margin-top:10px;
      }
      .borderBottom .ivu-row div:nth-child(1){
        margin-top:0;
      }
    }
  }
  .smallTitle {
    font-weight: normal;
    color: #bbb;
    font-size:10px;
    margin-left:4px;
  }
  .title{
    width:110px;
  }
</style>
