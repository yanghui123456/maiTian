<template>
  <!--客户经理管理-->
  <div class="customer">
    <Tabs style="width:100%" @on-click="tabClick" >
      <TabPane label="新增申请" icon="md-person-add" name="apply">
        <Table border :columns="applyCol" :data="applyList"></Table>
        <Page :total="addTotal" :current="addCurrent" :show-sizer="true" show-total @on-change="addPageChange"  class="mt20 tc"/>
      </TabPane>
      <TabPane label="所有名片" icon="ios-list-box" name="all">
        <Row>
          <Col span="4">
            <Tree :data="treeData" @on-select-change="allTreeChange"></Tree>
          </Col>
          <Col span="20">
          <Table border :columns="customerCol" :data="customerList"></Table>
          <Page :total="total" :current="current" :show-sizer="true" show-total @on-change="pageChange"  class="mt20 tc"/>
          </Col>
        </Row>

      </TabPane>
    </Tabs>
    <!--新增申请-详细信息弹窗-->
    <Modal v-model="modal" width="80%" >
      <p slot="header" style="text-align:center">
        <span>用户详情</span>
      </p>
      <Row>
        <Col span="12" v-if="tabName === 'apply'" style="overflow:auto;">
          <Tree :data="treeData" @on-select-change="treeSelect"></Tree>
        </Col>
        <Col span="12">
          <div class="mb20">
            姓名：
            <Input v-model="name" placeholder="Enter name" style="width: auto" :disabled="disable"/>
          </div>
          <div class="mb20">
            电话：
            <Input v-model="tel" placeholder="Enter name" style="width: auto" :disabled="disable"/>
          </div>
          <div class="mb20">
            职衔：
            <Input v-model="position" placeholder="Enter name" style="width: auto" :disabled="disable"/>
          </div>
          <div class="mb20">
            <span>个性标语：</span>
            <Input v-model="areaVal" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..." style="width:400px"  :maxlength= 40 :disabled="disable"></Input>
          </div>
          <p>微信二维码: <Button type="info">点击查看</Button></p>
        </Col>
      </Row>
      <div slot="footer" class="tc">
        <Button type="info" @click="adopt" v-if="tabName === 'apply'">通过</Button>
        <Button type="error" @click="refuseApply" v-if="tabName === 'apply'">拒绝</Button>
        <Button type="info" @click="save" v-if="tabName === 'all'">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tabName: '',
      disable: true, // 审批弹窗-input框是否可以编辑,审批-不可编辑,只做查看
      // 弹窗绑值
      name: '',
      tel: '',
      position: '',
      areaVal: '',
      id: '',
      version: '',
      avatar: '',
      wxQrCode: '',
      organizationIdss: '',
      isDefault: '',
      organizationId: null, // 审核通过时选择的组织机构ID
      organizationIdAll: null, // 所有名片选择的组织机构ID
      modal: false,
      addTotal: 0, // 申请-共多少条数据
      addCurrent: 1, // 申请-当前是第几页
      applyList: [], // 申请-列表
      applyCol: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '微信头像',
          key: 'avatar',
          align: 'center',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.avatar, style: 'width: 50px;height:50px;margin-top:6px;border-radius: 2px;'
              }
            })
          }
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '时间',
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
                on: {
                  click: () => {
                    this.applyDetail(params.row.id, 'apply')
                  }
                }
              }, '审批')
            ])
          }
        }
      ], // 申请-列
      pageSize: 10, // 每页多少条
      total: 0, // 所有-共多少条数据
      current: 1, // 所有-当前是第几页
      customerList: [], // 所有名片列表
      customerCol: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '微信头像',
          key: 'avatar',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.avatar, style: 'width: 50px;height:50px;margin-top:6px;border-radius: 2px;'
              }
            })
          }
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '时间',
          key: 'gmtCreate'
        },
        {
          title: '电话',
          key: 'phoneNumber'
        },
        {
          title: '职衔',
          key: 'jobTitle'
        },
        {
          title: '个人说明',
          key: 'description'
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
                    this.avatar = params.row.avatar
                    this.wxQrCode = params.row.wxQrCode
                    this.organizationIdss = params.row.organizationId
                    this.isDefault = params.row.isDefault
                    console.log(params)
                    this.applyDetail(params.row.id, 'all')
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      treeData: [] // 树状图
    }
  },
  created () {
    // 获取客户经理申请列表
    this.getApplicatList(this.addCurrent, this.pageSize)
  },
  methods: {
    // tab切换
    tabClick (name) {
      this.tabName = name
      if (name === 'apply') {
        this.getApplicatList(1, this.pageSize)
      } else if (name === 'all') {
        this.getOrganizaTree()
        this.getOrganizaList(this.current, this.pageSize, null)
      }
    },
    // 获取组织结构树状图
    getOrganizaTree () {
      this.$axios.get(window.serverIp + '/sys/organization/tree/list', '')
        .then((res) => {
          if (res.code === 0) {
            var data = res.body
            console.log(data)
            this.treeData = data
          } else {
            this.$Message.warning(res.msg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 获取客户经理列表-所有
    getOrganizaList (current, pageSize, id) {
      var params = {
        pageNum: current,
        pageSize: pageSize,
        searchBean: {
          organizationId: id
        }
      }
      this.$axios.post(window.serverIp + '/sys/manager/list', params)
        .then((res) => {
          if (res.code === 0) {
            var data = res.body
            console.log(data)
            this.total = data.total
            this.customerList = data.list
          } else {
            this.$Message.warning(res.msg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 获取客户经理列表
    getApplicatList (pageNum, pageSize) {
      var params = {
        pageNum: pageNum,
        pageSize: pageSize
      }
      this.$axios.post(window.serverIp + '/sys/manager/application/list', params)
        .then((res) => {
          if (res.code === 0) {
            var data = res.body
            console.log(data)
            this.addTotal = data.total
            this.applyList = data.list
          } else {
            this.$Message.warning(res.msg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 申请--获取客户经理详情
    getApplicatDetail (id) {
      this.$axios.get(window.serverIp + '/sys/manager/application?managerApplicationId=' + id)
        .then((res) => {
          if (res.code === 0) {
            var data = res.body
            this.name = data.name
            this.tel = data.phoneNumber
            this.position = data.jobTitle
            this.areaVal = data.description
            this.id = data.id
            this.version = data.version
            console.log(this.version)
          } else {
            this.$Message.warning(res.msg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 所有--客户经理详情
    getAllDetail (id) {
      this.$axios.get(window.serverIp + '/sys/manager/info?managerId=' + id)
        .then((res) => {
          if (res.code === 0) {
            var data = res.body
            this.name = data.name
            this.tel = data.phoneNumber
            this.position = data.jobTitle
            this.areaVal = data.description
            this.id = data.id
            this.version = data.version
          } else {
            this.$Message.warning(res.msg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 拒绝客户经理申请
    refuseApply () {
      var params = {
        id: this.id,
        version: this.version
      }
      console.log(params)
      this.$axios.post(window.serverIp + '/sys/manager/application/refuse', params)
        .then((res) => {
          if (res.code === 0) {
            this.modal = false
            this.organizationId = null
            this.getApplicatList(this.addCurrent, this.pageSize)
          } else {
            this.$Message.warning(res.msg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 通过客户经理申请
    adoptApply () {
      var params = {
        id: this.id,
        organizationId: this.organizationId,
        version: this.version
      }
      console.log(params)
      this.$axios.post(window.serverIp + '/sys/manager/application/pass', params)
        .then((res) => {
          if (res.code === 0) {
            this.modal = false
            this.organizationId = null
            this.getApplicatList(this.addCurrent, this.pageSize)
          } else {
            this.$Message.warning(res.msg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 保存客户经理编辑
    save () {
      var params = {
        id: this.id,
        avatar: this.avatar,
        name: this.name,
        jobTitle: this.position,
        wxQrCode: this.wxQrCode,
        phoneNumber: this.tel,
        organizationId: this.organizationIdss,
        description: this.areaVal,
        isDefault: this.isDefault,
        version: this.version
      }
      this.$axios.post(window.serverIp + '/sys/manager/edit', params)
        .then((res) => {
          if (res.code === 0) {
            this.modal = false
            // 重新获取列表,
            this.getOrganizaTree()
            this.getOrganizaList(this.current, this.pageSize, this.organizationIdAll)
          } else {
            this.$Message.warning(res.msg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 审批
    applyDetail (id, type) {
      // type:all=所有名片,apply:申请列表
      if (type === 'all') {
        this.modal = true
        this.disable = false
        this.getAllDetail(id)
      } else if (type === 'apply') {
        this.modal = true
        this.disable = true
        this.getOrganizaTree()
        this.getApplicatDetail(id)
      }
    },
    // 所有页码改变
    pageChange (val) {
      console.log('第' + val + '页')
      this.current = val
      this.getOrganizaList(val, this.pageSize, this.organizationIdAll)
    },
    // 申请页码改变
    addPageChange (val) {
      console.log('第' + val + '页')
      this.addCurrent = val
      this.getApplicatList(val, this.pageSize)
    },
    // 通过
    adopt () {
      // 判断是否选择组织结构,选择后才可以通过,后台会返回一个id
      if (this.organizationId == null) { // 未选择树节点
        this.$Message.warning('请先选择组织结构')
      } else {
        this.adoptApply()
      }
    },
    // 选中树节点时触发
    treeSelect (params) {
      this.organizationId = params[0].id
    },
    // 所有列表,选中的树节点
    allTreeChange (params) {
      this.organizationIdAll = params[0].id
      this.getOrganizaList(this.current, this.pageSize, params[0].id)
    }
  },
  // 计算属性
  computed: {},
  // 自定义指令
  directives: {}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .customer
    width: 100%;
    height: 100%;
    padding: 20px;
    background white;
    border-radius 20px;
    box-sizing border-box;
    overflow auto;
  .ivu-input[disabled], fieldset[disabled] .ivu-input{
    color:black;
  }
</style>
