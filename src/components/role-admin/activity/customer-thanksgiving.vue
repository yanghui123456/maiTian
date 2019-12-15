<!--管理员--》活动管理--》客户感恩礼-->
<template>
  <div class="container">
    <div class="mb20" v-if="role === 1">
      <Button type="info" @click="addActivity">添加活动</Button>
      <Button type="info" @click="downLoad" disabled>下载成交客户名单模板</Button>
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
              <Option v-for="item in audienceList" :value="item.valueCode" :key="item.baseId">{{ item.valueCode }}</Option>
            </Select>
            </Col>
          </Row>
          <!--管理员角色可见；店长不可见-->
          <Row v-if="role === 1">
            <Col span="24">
            <span class="title">选择可参加的店组：</span>
            <Checkbox
              :indeterminate="indeterminate"
              :value="checkAll"
              @click.prevent.native="handleCheckAll" :disabled="avtivityStatus === 'see'">全选</Checkbox>
            <CheckboxGroup v-model="modalData.shop" @on-change="checkAllGroupChange" >
              <Checkbox :label="item.departmentId" v-for="item in shopList" :key="item.regionId" style="margin-right:20px;" :disabled="avtivityStatus === 'see'">
                <span>{{item.departmentName}}</span>
              </Checkbox>
            </CheckboxGroup>
            <!--{{modalData.shop}}-->
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
            <div>
              <Upload
                ref="upload"
                :show-upload-list="false"
                :on-success="excelUpSuccess"
                :format="['xls', 'xlsx']"
                :max-size="1000000000"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :action="upLoadUrl"
                style="float: left;margin-right:30px"
                v-if="this.avtivityStatus === 'add'">
                <i-button icon="ios-cloud-upload-outline" style="color:#2db7f5">选择Excel文件</i-button>
              </Upload>
              <!--客户信息已上传-->
              <Button style="float: left" type="info" v-if="modalData.userUploadExcelUrl !== ''">客户信息已上传</Button>
            </div>
            </Col>
          </Row>
        </div>
        <!--礼品信息-->
        <p class="modalTitle mt10">礼品信息</p>
        <div class="borderBottom" v-for="(item, index) in modalData.giftList" :key="index">
          <div style="overflow: hidden" >
            <!--管理员角色可见（新增可见，查看不可见）；店长不可见-->
            <Button v-if="role === 1 && avtivityStatus === 'add'" type="error" size="small" style="float: right" @click="deletItem(item.id)">删除该项</Button>
          </div>
          <Row>
            <Col span="5" style="margin-top:30px">
            <div @click="clickUpload(item)">
              <Upload
                ref="upload"
                :show-upload-list="false"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :action="upLoadUrl"
                style="display: inline-block;width:58px;"
                v-if="avtivityStatus === 'add'">
                <div style="width: 58px;height:58px;line-height: 58px;border:1px solid #eee;" class="tc">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
            </div>
            <img :src="item.img" alt="图片" style="display:inline-block;width:58px;height:58px;border-radius: 5px;position: absolute;top:0;left:80px" v-if="item.img !== ''">
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
              <Input placeholder="请输入礼品价格" style="width: auto" :disabled="disabled" v-model="item.price" type="number"/>
              </Col>
            </Row>
            </Col>
          </Row>
        </div>
        <!--管理员角色可见(新增可见，查看详情不可见)；店长不可见-->
        <div class="borderBottom" v-if="role === 1 && this.avtivityStatus === 'add'">
          <Button type="info" class="mt10" @click="addGift">继续添加礼品</Button>
        </div>
        <!--时间-->
        <div class="borderBottom">
          <Row>
            <Col span="24">
            <span class="title">礼品最晚送达时间：</span>
            <DatePicker :editable="false" v-model="modalData.serviceTime" @on-change="serviceChange" :disabled="disabled" type="datetime" placeholder="请选择礼品最晚送达时间" style="width:auto"></DatePicker>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">礼品最晚签收时间：</span>
            <DatePicker v-model="modalData.signTime" @on-change="signChange" :disabled="disabled" type="datetime" placeholder="请选择礼品最晚签收时间" style="width:auto"></DatePicker>
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
              <DatePicker v-model="modalData.shoperTime" @on-change="shoperChange" :disabled="disabled" type="datetime" placeholder="请选择推送至店长时间" style="width:auto"></DatePicker>
              </Col>
            </Row>
            <Row>
              <Col span="24">
              <span class="title">推送至经纪人时间：</span>
              <DatePicker v-model="modalData.agentTime" @on-change="agentChange" :disabled="disabled" type="datetime" placeholder="请选择推送至经纪人时间" style="width:auto"></DatePicker>
              </Col>
            </Row>
            <Row>
              <Col span="24">
              <span class="title">活动结束时间：</span>
              <DatePicker v-model="modalData.endTime" @on-change="endChange" :disabled="disabled" type="datetime" placeholder="请选择活动结束时间" style="width:auto"></DatePicker>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <div slot="footer" class="tc">
        <!--管理员角色可见（管理员-添加时可见，查看时不可见）；店长不可见-->
        <div v-if="role === 1 && this.avtivityStatus === 'add'">
          <Button type="info" @click="publish">发布</Button>
          <Button type="info" @click="cancel">取消</Button>
        </div>
      </div>
    </Modal>
    <!--查看感恩礼送达详情：周总说先不分页-->
    <Modal
      v-model="detailModal"
      title="成交客户感恩礼礼品送达详情"
      class-name="modal"
      width="900px">
      <p slot="header" class="tc">成交客户感恩礼礼品送达详情</p>
      <div class="modalCentenr">
        <Button type="info" @click="exportFile" class="mb10" disabled>导出</Button>
        <Button type="info" @click="screen" class="mb10" v-if="role === 2">筛选</Button>
        <Table :columns="detailCol" :loading="detailLoading" :data="detailTable" border height="420" size="small"></Table>
      </div>
      <div slot="footer" class="tc">
        <!--<Page :total="detailTotal" :current="detailPageNum" show-total @on-change="detailPageChange" class="mt20 tc"/>-->
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  data () {
    return {
      imgHttp: '',
      upLoadUrl: '',
      role: '', // 原型中区域经理是没有感恩礼这个模块的   1=管理员；2=店长；
      // ============== 管理员角色===========
      avtivityStatus: '', // 管理员角色，区分是新增 add，还是查看 see
      // 所有活动列表
      loading: true, // 表格加载
      total: 0,
      pageNum: 1, // 第几页
      pageSize: 10,
      dataCol: [],
      managerCol: [
        {
          title: '序号',
          width: 70,
          align: 'center',
          render: (h, params) => {
            return h('span', params.index + (this.pageNum - 1) * this.pageSize + 1)
          }
        },
        /* {
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
        }, */
        {
          title: '活动主题',
          key: 'theme',
          align: 'center',
          width: 150
        },
        {
          title: '活动受众',
          key: 'targetGroup',
          align: 'center',
          width: 100
        },
        {
          title: '活动目的',
          key: 'target',
          align: 'center',
          width: 200
        },
        {
          title: '活动描述',
          key: 'activityDetail',
          align: 'center',
          width: 300
        },
        {
          title: '礼品送达时间',
          key: 'lastReceiveTime',
          align: 'center',
          width: 150
        },
        {
          title: '咨询方式',
          key: 'consultaction',
          align: 'center',
          width: 150
        },
        {
          title: '查看活动详情',
          key: 'gratefulActivityId',
          align: 'center',
          width: 135,
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
                    this.activeDetail(params.row.gratefulActivityId)
                  }
                }
              }, '查看详情')
            ])
          }
        },
        {
          title: '查看礼品送达情况',
          key: 'gratefulActivityId',
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
                    this.seeSendDetail(params.row.gratefulActivityId)
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
          title: '序号',
          width: 70,
          align: 'center',
          render: (h, params) => {
            return h('span', params.index + (this.pageNum - 1) * this.pageSize + 1)
          }
        },
        /* {
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
        }, */
        {
          title: '活动主题',
          key: 'theme',
          align: 'center',
          width: 150
        },
        {
          title: '活动受众',
          key: 'targetGroup',
          align: 'center',
          width: 100
        },
        {
          title: '活动目的',
          key: 'target',
          align: 'center',
          width: 100
        },
        {
          title: '活动描述',
          key: 'activityDetail',
          align: 'center',
          width: 100
        },
        {
          title: '礼品送达时间',
          key: 'lastReceiveTime',
          align: 'center',
          width: 150
        },
        {
          title: '咨询方式',
          key: 'consultaction',
          align: 'center',
          width: 150
        },
        {
          title: '查看活动详情',
          key: 'gratefulActivityId',
          align: 'center',
          width: 135,
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
                    this.activeDetail(params.row.gratefulActivityId)
                  }
                }
              }, '查看详情')
            ])
          }
        },
        {
          title: '查看礼品送达情况',
          key: 'gratefulActivityId',
          align: 'center',
          width: 135,
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
                    this.seeSendDetail(params.row.gratefulActivityId)
                  }
                }
              }, '查看')
            ])
          }
        },
        {
          title: '客户信息Excel',
          key: 'gender',
          align: 'center',
          width: 120,
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
      audienceList: [], // 活动受众
      shopList: [], // 可添加的店组
      moreUploadId: '', // 添加礼品项中点击上传图片项的id
      excelListInfo: [], // 用户添加感恩礼-上传excel成功后返回的excel列表内容
      modalData: {
        userUploadExcelUrl: '', // 用户已上传excel的地址
        audience: '', // 受众
        shop: [], // 店组
        theme: '', // 活动主题
        objective: '', // 活动目的
        description: '', // 活动描述
        serviceTime: '', // 礼品最晚送达时间
        signTime: '', // 礼品最晚签收时间
        tel: '', // 咨询电话
        shoperTime: '', // 推送至店长时间
        agentTime: '', // 推送至经纪人时间
        endTime: '', // 活动结束时间
        // 礼品介绍
        giftList: []
      },
      indeterminate: true, // 全选
      checkAll: false,
      // ================感恩礼送达详情-弹窗
      detailModal: false,
      detailLoading: true,
      detailCol: [],
      manageDetailCol: [
        {
          title: '序号',
          width: 70,
          align: 'center',
          render: (h, params) => {
            return h('span', params.index + (this.pageNum - 1) * this.pageSize + 1)
          }
        },
        /* {
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
        }, */
        {
          title: '经纪人姓名',
          align: 'juser',
          width: 100,
          render: (h, params) => {
            var name = params.row.juser === null ? '暂无' : params.row.juser
            return h('span', name)
          }
        },
        {
          title: '经纪人身份证号',
          key: 'jidcard',
          align: 'center',
          width: 150,
          render: (h, params) => {
            var name = params.row.jidcard === null ? '暂无' : params.row.jidcard
            return h('span', name)
          }
        },
        {
          title: '客户姓名',
          key: 'customName',
          align: 'center',
          width: 100
        },
        {
          title: '客户电话',
          key: 'wechat',
          align: 'center',
          width: 120
        },
        {
          title: '客户身份证号',
          key: 'idCard',
          align: 'center',
          width: 150
        },
        {
          title: '客户生日',
          key: 'birthDate',
          align: 'center',
          width: 100
        },
        {
          title: '成交日期',
          key: 'dealDate',
          align: 'center',
          width: 100
        },
        {
          title: '礼品送达情况',
          key: 'status',
          align: 'center',
          width: 120,
          fixed: 'right',
          render: (h, params) => {
            var status = params.row.status === null ? '暂无' : params.row.status
            return h('span', status)
          }
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
    this.imgHttp = window.serverIp
    this.upLoadUrl = window.serverIp + '/fileupload' // 管理员-上传感恩礼活动-客户信息Excel
    // 获取-角色
    var roles = localStorage.getItem('role')
    this.role = Number(roles)
    if (this.role === 1) {
      // 管理员
      this.dataCol = this.managerCol
      this.getManageTable(this.pageNum, this.pageSize)
    } else if (this.role === 6) {
      // 店长
      console.log(1)
      this.dataCol = this.shoperCol
      this.getManageTable(this.pageNum, this.pageSize)
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
        this.avtivityStatus = ''
        this.audienceList = [] // 活动受众
        this.shopList = [] // 可添加的店组
        this.moreUploadId = '' // 添加礼品项中点击上传图片项的id
        this.excelListInfo = [] // 用户添加感恩礼-上传excel成功后返回的excel列表内容
        this.modalData = {
          userUploadExcelUrl: '', // 用户已上传excel的地址
          audience: '', // 受众
          shop: [], // 店组
          theme: '', // 活动主题
          objective: '', // 活动目的
          description: '', // 活动描述
          serviceTime: '', // 礼品最晚送达时间
          signTime: '', // 礼品最晚签收时间
          tel: '', // 咨询电话
          shoperTime: '', // 推送至店长时间
          agentTime: '', // 推送至经纪人时间
          endTime: '', // 活动结束时间
          // 礼品介绍
          giftList: []
        }
      }
    },
    // 管理员--感恩礼列表
    getManageTable (pageNum, pageSize) {
      this.$axios.get(window.serverIp + '/api/gratefulactivity/getAll?pageNum=' + pageNum + '&pageSize=' + pageSize)
        .then(res => {
          if (res.status === 'success') {
            this.dataList = res.data.records
            this.loading = false
            this.total = res.data.total
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
      this.getManageTable(val, this.pageSize)
    },
    // 下载成交模板
    downLoad () {
      this.$Message.warning('下载成交客户名单模板')
    },
    // =========================添加感恩礼活动
    // 获取受众列表
    getShouzhongList () {
      this.$axios.get(window.serverIp + '/api/baseinfo/getAllAudience')
        .then(res => {
          if (res.status === 'success') {
            this.audienceList = res.data
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取可参加的电组
    getDianzu () {
      this.$axios.get(window.serverIp + '/api/department/getAllGroup?pageNum=1&pageSize=20')
        .then(res => {
          if (res.status === 'success') {
            this.shopList = res.data.records
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 管理员=添加活动
    addActivity () {
      this.avtivityStatus = 'add'
      this.modalStatus(true, '添加客户感恩礼活动', false)
      // 活动活动受众、可参加的店组
      this.getShouzhongList()
      this.getDianzu()
    },
    // 上传礼品图片是的标识，上传哪一个给哪一个礼品图片赋值
    clickUpload (param) {
      console.log('点击的是===' + param.id)
      // 获取点击项的id, 根据id给上传成功的图片添加到某一项
      this.moreUploadId = param.id
    },
    // 发布活动
    publish () {
      var data = this.modalData
      if (data.audience === '') {
        this.$Message.error('请选择活动受众')
      } else if (data.shop.length === 0) {
        this.$Message.error('请选择店组')
      } else if (data.theme === '') {
        this.$Message.error('请输入活动主题')
      } else if (data.objective === '') {
        this.$Message.error('请输入活动目的')
      } else if (data.description === '') {
        this.$Message.error('请输入活动描述')
      } else if (data.userUploadExcelUrl === '') {
        this.$Message.error('请上传客户信息Excel文件')
      } else if (data.serviceTime === '') {
        this.$Message.error('请选择礼品最晚送达时间')
      } else if (data.signTime === '') {
        this.$Message.error('请选择礼品最晚签收时间')
      } else if (data.tel === '') {
        this.$Message.error('请输入咨询方式')
      } else if (data.shoperTime === '') {
        this.$Message.error('请选择推送至店长时间')
      } else if (data.agentTime === '') {
        this.$Message.error('请选择推送至经纪人时间')
      } else if (data.endTime === '') {
        this.$Message.error('请选择活动结束时间')
      } else {
        // 判断礼品
        if (data.giftList.length === 0) {
          this.$Message.error('请添加至少一项礼品介绍')
        } else {
          var giftlist = data.giftList
          for (var i = 0; i < giftlist.length; i++) {
            if (giftlist[i].name === '') {
              this.$Message.error('请输入礼品名称')
              return false
            } else if (giftlist[i].describe === '') {
              this.$Message.error('请输入礼品描述')
              return false
            } else if (giftlist[i].price === '') {
              this.$Message.error('请输入礼品价格')
              return false
            } else if (giftlist[i].img === '') {
              this.$Message.error('请上传礼品图片')
              return false
            }
          }
          console.log(this.modalData.giftList)
          var giftLists = []
          for (var j = 0; j < giftlist.length; j++) {
            giftLists.push({
              giftName: giftlist[j].name,
              giftDetail: giftlist[j].describe,
              giftPrice: giftlist[j].price,
              giftPic: giftlist[j].img
            })
          }
          console.log(giftLists)
          // 店组数据更改成后台要的方式
          var shopArr = []
          for (var a = 0; a < data.shop.length; a++) {
            shopArr.push({
              departmentId: data.shop[a]
            })
          }
          // 新增感恩礼
          var params = {
            targetGroup: data.audience, // 活动受众
            theme: data.theme, // 活动主题
            target: data.objective, // 活动目标
            activityDetail: data.description, // 活动描述
            lastReceiveTime: data.serviceTime, // 最晚送达时间
            lastSignTime: data.signTime, // 最晚签收时间
            consultaction: data.tel, // 咨询方式
            shopownerTime: data.shoperTime, // 店主推送时间
            agentTime: data.agentTime, // 经纪人推送时间
            activityOver: data.endTime, // 活动结束时间
            gratefulGifts: giftLists, // 礼品列表
            shopGroups: shopArr, // 店组
            gratefulCustoms: this.excelListInfo // 用户上传的客户excel列表内容
          }
          this.addThanksGiving(params)
        }
      }
    },
    // 新增感恩礼活动
    addThanksGiving (params) {
      this.$axios.post(window.serverIp + '/api/gratefulactivity', params)
        .then(res => {
          if (res.status === 'success') {
            this.$Message.success('新增感恩礼成功')
            this.modalStatus(false, '', false)
            this.getManageTable(this.pageNum, this.pageSize)
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 取消活动
    cancel () {
      this.modalStatus(false, '', false)
    },
    // 活动受众改变
    audienceSelectChange (val) {
      console.log(val)
      this.modalData.audience = val
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
    // 管理员=感恩礼-上传客户信息excel成功
    excelUpSuccess (response, file, fileList) {
      console.log(response)
      console.log(file)
      console.log(fileList)
      if (response.status === 'success') {
        this.$Message.success('客户信息excel上传成功')
        this.modalData.userUploadExcelUrl = response.data.filepath
        // 获取客户上传的excel列表中的数据
        this.$axios.post(window.serverIp + '/api/gratefulactivity/importActivityCustom', {
          gratefulActivityId: '', // 活动id，新增感恩礼上传成功传空
          filepath: response.data.filepath,
          filename: response.data.filename
        })
          .then(res => {
            if (res.status === 'success') {
              this.$Message.success('成功获取列表中的信息')
              console.log(res.data)
              this.excelListInfo = res.data
            } else {
              this.$Message.error(res.message)
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.$Message.error(response.message)
      }
    },
    // 图片上传成功时
    handleSuccess (response, file, fileList) {
      var url = response.data.filepath
      if (response.status === 'success') {
        this.$Message.success('图片上传成功')
        console.log('应该上传的项是==' + this.moreUploadId)
        var id = this.moreUploadId
        var data = this.modalData.giftList
        for (var i = 0; i < data.length; i++) {
          if (data[i].id === id) {
            data[i].img = this.imgHttp + url
          }
        }
        console.log(this.modalData.giftList)
      } else {
        this.$Message.error(response.message)
      }
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
        // 当全选时，让regionId都放到数组中
        var arr = []
        for (var i = 0; i < this.shopList.length; i++) {
          arr.push(this.shopList[i].departmentId)
        }
        this.modalData.shop = arr
      } else {
        this.modalData.shop = []
      }
      console.log(this.modalData.shop)
    },
    // 选择多选框
    checkAllGroupChange (data) {
      if (data.length === this.shopList.length) {
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
    // 管理员=查看活动详情
    activeDetail (id) {
      console.log(id)
      this.getShouzhongList() // 获取受众列表
      this.getDianzu() // 获取店组
      this.avtivityStatus = 'see'
      this.modalStatus(true, '查看客户感恩礼活动', true)
      // 绑值
      this.$axios.get(window.serverIp + '/api/gratefulactivity/getGratefulById?activityId=' + id)
        .then(res => {
          if (res.status === 'success') {
            console.log(res.data)
            var data = res.data
            var modalData = this.modalData
            var httpGiftList = data.gratefulGifts // 后台返回的礼品列表
            var httpShopList = data.shopGroups // 后台返回的店组列表
            var giftArr = [] // 自己改装后的礼品列表
            var shopList = [] // 自己封装后的用户已选择的店组列表
            for (var i = 0; i < httpGiftList.length; i++) {
              giftArr.push({
                id: giftArr.length + 1, // 自定义的id
                name: httpGiftList[i].giftName, // 礼品名称
                describe: httpGiftList[i].giftDetail, // 礼品描述
                price: httpGiftList[i].giftPrice, // 礼品价格
                img: httpGiftList[i].giftPic // 图片
              })
            }
            for (var j = 0; j < httpShopList.length; j++) {
              shopList.push(httpShopList[j].shopgroupId)
            }
            modalData.audience = data.targetGroup // 活动受众
            modalData.theme = data.theme // 活动主题
            modalData.objective = data.target // 活动目的
            modalData.description = data.activityDetail // 活动描述
            modalData.serviceTime = data.lastReceiveTime // 最晚送达时间
            modalData.signTime = data.lastSignTime // 最晚签收时间
            modalData.tel = data.consultaction // 咨询电话
            modalData.shoperTime = data.shopownerTime // 店主推送时间
            modalData.agentTime = data.agentTime // 经纪人推送时间
            modalData.endTime = data.activityOver // 活动结束时间
            modalData.userUploadExcelUrl = 's' // 用户上传的客户excel的地址:复制为不为空的字符串，这样用户已上传信息按钮才会显示
            modalData.giftList = giftArr // 礼品列表
            modalData.shop = shopList // 店组列表
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // ======================管理员、店长=成交感恩查看礼送达详情
    seeSendDetail (id) {
      this.detailModal = true
      // 店长和管理员，表头坐下区分，店长没有店长姓名，店长身份证号表头
      this.detailCol = this.manageDetailCol
      this.$axios.get(window.serverIp + '/api/gratefulactivity/getServed?activityId=' + id)
        .then(res => {
          if (res.status === 'success') {
            this.detailTable = res.data
            this.detailLoading = false
            // this.detailTotal = false
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
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
