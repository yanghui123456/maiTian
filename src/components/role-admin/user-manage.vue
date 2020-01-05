<!--管理员==>用户管理-->
<template>
  <div class="container">
    <div class="mb20">
      <Button type="info" @click="add" style="display: none;">添加用户</Button>
    </div>
    <Table :columns="dataCol" :loading="loading" :data="dataList" border height="480" size="small"></Table>
    <Page :total="total" :current="pageNum" show-total @on-change="pageChange" class="mt20 tc"/>
    <!--弹层-->
    <Modal
      v-model="modal"
      :title="modalTitle"
      width="700px"
      @on-visible-change="checkModal">
      <Spin fix v-if="spinShow"></Spin>
      <p slot="header" class="tc">{{modalTitle}}</p>
      <div>
        <Row>
          <Col span="12">
          <span class="title">成员身份：</span>
          <Select v-model="modalData.role"  :disabled="disabled" style="width: auto" @on-change="roleChange" :placement="posit" placeholder="请选择成员身份">
            <Option v-for="item in roleList" :value="item.roleId" :key="item.roleId">{{ item.roleName }}</Option>
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
          <DatePicker type="date" placeholder="请选择入职日期"  :disabled="disabled" style="width: auto" v-model="modalData.date" @on-change="dateChange"></DatePicker>
          </Col>
          <Col span="12">
          <span class="title">启用/禁用：</span>
          <RadioGroup v-model="modalData.radio">
            <Radio label="C"  :disabled="disabled">
              <span>在职,启用</span>
            </Radio>
            <Radio label="D"  :disabled="disabled">
              <span>离职,禁用</span>
            </Radio>
          </RadioGroup>
          </Col>
        </Row>
        <Row class="mt10">
          <Col span="24">
          <span class="title">多项级联：</span>
          <Cascader :disabled="disabled" :data="moreJilian" v-model="modalData.moreVal" trigger="hover" style="width:80%;display: inline-block;" change-on-select></Cascader>
          </Col>
        </Row>
      </div>
      <div slot="footer" class="tc">
        <Button type="info" @click="save" disabled="disabled">保存</Button>
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
          title: '序号',
          width: 70,
          align: 'center',
          render: (h, params) => {
            return h('span', params.index + (this.pageNum - 1) * this.pageSize + 1)
          }
        },
        {
          title: '成员姓名',
          key: 'realName',
          align: 'center',
          width: 200
        },
        {
          title: '身份证号',
          key: 'idCard',
          align: 'center',
          width: 200
        },
        {
          title: '用户手机号',
          key: 'telephone',
          align: 'center',
          width: 150
        },
        {
          title: '入职日期',
          key: 'entryDate',
          align: 'center',
          width: 140
        },
        // 1:管理员；2：城市总经理；3：片区总经理；4：大区总监；5：区域经理；6：店长；7：经纪人
        {
          title: '成员身份',
          key: 'roleId',
          align: 'center',
          width: 120,
          render: (h, params) => {
            var val = params.row.roleId
            var role = val === 1 ? '管理员' : val === 2 ? '城市总经理' : val === 3 ? '片区总经理' : val === 4 ? '大区总监' : val === 5 ? '区域经理' : val === 6 ? '店长' : val === 7 ? '经纪人' : '其他角色'
            return h('span', role)
          }
        },
        {
          title: '启用状态',
          key: 'crud',
          align: 'center',
          width: 200,
          render: (h, params) => {
            var crud = params.row.crud === 'C' ? '在职，已启用' : '离职已停用'
            var color = params.row.crud === 'C' ? 'black' : 'red'
            return h('span', {
              style: {
                color: color
              }
            }, crud)
          }
        },
        {
          title: '操作',
          key: 'userId',
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
              }, '查看')
            ])
          }
        }
      ],
      dataList: [],
      editUserId: '', // 编辑用户的id
      // 弹层
      timeChange: false, // 入职日期是否改变
      spinShow: true,
      modal: false,
      modalTitle: '',
      posit: 'bottom', // 下拉框定位的位置
      roleList: [], // 成员身份
      disabled: false, // 文本框是否禁用
      modalData: {
        role: '', // 成员身份
        name: '', // 姓名
        tel: '', // 手机号
        cardNum: '', // 身份证号
        date: '', // 日期
        radio: '', // 启用、禁用
        moreVal: []
      },
      moreJilian: [] // 多项级联
    }
  },
  created () {
    this.getUserList(1, this.pageSize)
  },
  methods: {
    // 获取用户列表
    getUserList (pageNum, pgeSize) {
      this.$axios.get(window.serverIp + '/api/user/getUsersMoreList?pageNum=' + pageNum + '&pageSize=' + pgeSize)
        .then(res => {
          if (res.status === 'success') {
            this.dataList = res.data.records
            this.total = res.data.total
            this.loading = false
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 用户列表change
    pageChange (val) {
      this.loading = true
      this.pageNum = val
      this.getUserList(val, this.pageSize)
    },
    // 成员身份改变
    roleChange (val) {
      this.modalData.role = val
    },
    // 选择日期
    dateChange (time, date) {
      this.modalData.date = time
      this.timeChange = true
    },
    // 初始化数据
    clearData () {
      this.spinShow = true
      this.modalData = {
        role: '', // 成员身份
        name: '', // 姓名
        tel: '', // 手机号
        cardNum: '', // 身份证号
        date: '', // 日期
        radio: '', // 启用、禁用
        moreVal: []
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
    // 保存(修改接口)
    save () {
      var data = this.modalData
      if (data.role === '') {
        this.$Message.error('请选择成员身份')
        return false
      } else if (data.name === '') {
        this.$Message.error('请选择成员姓名')
        return false
      } else if (data.tel === '') {
        this.$Message.error('请输入成员手机号')
        return false
      } else if (data.cardNum === '') {
        this.$Message.error('请输入成员身份证号')
        return false
      } else if (data.date === '') {
        this.$Message.error('请选择入职日期')
        return false
      } else if (data.radio === '') {
        this.$Message.error('请选择启用禁用')
        return false
      } else if (data.moreVal.length === 0) {
        this.$Message.error('请选择多项级联')
        return false
      } else {
        var time1 = data.date
        if (!this.timeChange) {
          var time2Y = time1.getFullYear()
          var time2M = time1.getMonth() + 1
          var time2H = time1.getDate()
          var time2s = time1.getHours()
          var time2f = time1.getMinutes()
          var time2ms = time1.getSeconds()
          if (time2M < 10) {
            time2M = '0' + time2M
          }
          if (time2H < 10) {
            time2H = '0' + time2H
          }
          if (time2s < 10) {
            time2s = '0' + time2s
          }
          if (time2f < 10) {
            time2f = '0' + time2f
          }
          if (time2ms < 10) {
            time2ms = '0' + time2ms
          }
          time1 = (time2Y + '-' + time2M + '-' + time2H + ' ' + time2s + ':' + time2f + ':' + time2ms).split(' ')[0]
        } else {
          time1 = this.date
        }
        var params = {
          userId: this.editUserId,
          roleId: data.role,
          realname: data.name,
          telephone: data.tel,
          idCard: data.cardNum,
          entryDate: time1,
          crud: data.radio,
          departmentId: data.moreVal[data.moreVal.length - 1],
          areaclass: data.moreVal.join(',')
        }
        this.$axios.put(window.serverIp + '/api/user', params)
          .then(res => {
            if (res.status === 'success') {
              this.$Message.success('修改用户成功')
              this.modalStatus(false, '', false)
              this.getUserList(this.pageNum, this.pageSize)
            } else {
              this.$Message.error(res.message)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    // 取消
    cancle () {
      this.modal = false
    },
    // 当弹窗显示隐藏状态变化时2
    checkModal (status) {
      // true=显示；false=隐藏
      if (status === false) {
        this.clearData()
      }
    },
    // 添加
    add () {
      this.modalStatus(true, '添加用户', false)
      // 获取成员身份
      this.getRoleAndJilian('role', '/maitian/role', 'add', '')
      // 获取多项级联
      this.getRoleAndJilian('jiLian', '/api/department/getDepartmentTree?pid=d770504cd7f911e79bcb005056b710e9', 'add', '')
    },
    // 获取级联和角色列表
    getRoleAndJilian (type, url, status, params) {
      /*
      type: role:角色， jiLian:级联列表
      urL:请求地址
      status: add:新增， edit:编辑
      params: 参数：只有编辑的时候才有
      * */
      this.$axios.get(window.serverIp + url)
        .then(res => {
          if (res.status === 'success') {
            if (type === 'role') {
              this.roleList = res.data
              if (params !== '') {
                this.modalData.role = params.role.roleId
              }
            } else if (type === 'jiLian') {
              this.moreJilian = res.data
              if (params !== '') {
                var jlArr = []
                // 判断用户的级联是否选择，未选择是null，
                if (params.user.areaclass === null) {
                  jlArr = []
                } else {
                  var httpArr = params.user.areaclass.split(',')
                  // 将级联每一项转换成数字类型
                  for (var i = 0; i < httpArr.length; i++) {
                    jlArr.push(Number(httpArr[i]))
                  }
                }
                this.modalData.name = params.user.realName
                this.modalData.tel = params.user.telephone
                this.modalData.cardNum = params.user.idCard
                this.modalData.date = params.user.entryDate
                this.modalData.radio = params.user.crud
                this.modalData.moreVal = jlArr
                this.spinShow = false
              }
            }
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 编辑
    edit (params) {
      this.editUserId = params.userId
      this.$axios.get(window.serverIp + '/api/user/getUsersMore?user_id=' + params.userId)
        .then(res => {
          if (res.status === 'success') {
            this.modalStatus(true, '用户详情', true)
            this.getRoleAndJilian('role', '/maitian/role', 'edit', res.data)
            this.getRoleAndJilian('jiLian', '/api/department/getDepartmentTree?pid=d770504cd7f911e79bcb005056b710e9', 'edit', res.data)
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
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
