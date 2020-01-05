<!--内容库管理==>实时发布-->
<template>
  <div class="container">
    <div class="mb20">
      <Button type="info" @click="add">添加互动</Button>
      <Button type="info" @click="exports">导出</Button>
    </div>
    <Table :columns="dataCol" :loading="loading" :data="dataList" border height="480" size="small"></Table>
    <Page :total="total" :current="pageNum" show-total @on-change="pageChange" class="mt20 tc"/>
    <!--弹层-->
    <Modal
      v-model="modal"
      :title="modalTitle"
      class-name="modal"
      width="900px"
      @on-visible-change="checkModal">
      <p slot="header" class="tc">{{modalTitle}}</p>
      <div class="modalCentenr">
        <Row>
          <Col span="12">
          <span class="title">互动标题：</span>
          <Input placeholder="请输入互动内容" style="width: auto" :disabled="disabled" v-model="modalData.theme"/>
          </Col>
        </Row>
        <Row>
          <Col span="24">
          <span class="title">发布时间：</span>
          <DatePicker :editable="false" format="yyyy-MM-dd HH:mm"  v-model="modalData.publicTime" @on-change="publicChange" type="datetime" placeholder="请选择发布时间" style="width: 200px"></DatePicker>
          </Col>
        </Row>
        <Row>
          <Col span="24">
          <span class="title">提醒时间：</span>
          <DatePicker :editable="false" format="yyyy-MM-dd HH:mm"  v-model="modalData.remindTime" @on-change="warnChange" type="datetime" placeholder="请选择提醒时间" style="width: 200px"></DatePicker>
          </Col>
        </Row>
        <Row>
          <Col span="24">
          <span class="title">提醒消息内容：</span>
          <Input placeholder="请输入提醒内容模板" style="width:80%" :disabled="disabled" v-model="modalData.remindContent" type="textarea" :rows="4"/>
          </Col>
        </Row>
        <Row>
          <Col span="24">
          <span class="title">提醒时间：</span>
          <span>最佳提醒时间为上午10:30-11:30</span>
          </Col>
        </Row>
        <Row>
          <Col span="24">
          <span class="title">温馨提示：</span>
          <span>提醒时间请注意避开: 8:30--9:30、13:30--15:00、17:30--19:00、21:00--22:00这4个高峰期</span>
          </Col>
        </Row>
        <!--上传图片-->
        <Row>
          <Col span="24">
          <span class="title">图片：</span>
          <Upload
            ref="upload"
            :show-upload-list="false"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png']"
            :max-size="100000000000"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :action="upLoadUrl"
            style="display: inline-block;width:58px;cursor: pointer">
            <div style="width: 58px;height:58px;line-height: 58px;border:1px solid #eee;" class="tc">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <img :src="modalData.uploadImg" alt="图片" style="width:60px;height:60px;border-radius: 5px;" v-if="modalData.uploadImg !== ''">
          </Col>
        </Row>
        <Row>
          <Col span="24">
          <span class="title">互动文案：</span>
          <Input placeholder="请输入互动文案" style="width:80%" :disabled="disabled" v-model="modalData.copyRighter" type="textarea" :rows="4"/>
          </Col>
        </Row>
        <Row>
          <Col span="24">
          <span class="title">转发语：</span>
          <Input placeholder="请输入转发语" style="width:80%" :disabled="disabled" v-model="modalData.forwarding" type="textarea" :rows="4"/>
          </Col>
        </Row>
      </div>
      <div slot="footer" class="tc">
        <Button type="info" @click="save">保存</Button>
        <Button type="info" @click="cancel">取消</Button>
      </div>
    </Modal>
    <!--删除提示-->
    <Modal
      v-model="deletModal"
      title="删除"
      @on-ok="ensureDelete"
      class="tc">
      <p>是否确认删除该项？</p>
    </Modal>
  </div>
</template>
<script>
export default {
  data () {
    return {
      upLoadUrl: '',
      // ===表格
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
          title: '互动标题',
          key: 'theme',
          align: 'center',
          width: 100
        },
        {
          title: '图片',
          key: 'titlePic',
          align: 'center',
          width: 100,
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: window.serverIp + params.row.titlePic, style: 'width: 50px;height:50px;margin-top:6px;border-radius: 2px;'
              }
            })
          }
        },
        {
          title: '提醒频率',
          key: 'reminderPinlv',
          align: 'center',
          width: 100
        },
        {
          title: '发布时间',
          key: 'publicTime',
          align: 'center',
          width: 150
        },
        {
          title: '提醒时间',
          key: 'remindTime',
          align: 'center',
          width: 150
        },
        {
          title: '提醒消息内容',
          key: 'remindContent',
          align: 'center',
          width: 250
        },
        {
          title: '互动文案',
          key: 'copyRighter',
          align: 'center',
          width: 250
        },
        {
          title: '转发语',
          key: 'forwarding',
          align: 'center',
          width: 150
        },
        {
          title: '操作',
          key: 'actualtimeActivityId',
          align: 'center',
          width: 150,
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
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.delete(params.row)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      dataList: [],
      // ===弹窗
      isChange1: false, // 发布时间在编辑的时候是否change,change为true时不进行日期转换
      isChange2: false, // 提醒时间
      status: '', // 1:新增； 2-编辑
      modal: false,
      modalTitle: '',
      disabled: false, // 文本框是否禁用
      modalData: {
        theme: '', // 互动内容
        publicTime: '', // 发布时间
        remindTime: '', // 提醒时间
        remindContent: '', // 提醒内容模板
        copyRighter: '', // 互动文案
        forwarding: '', // 转发语
        titlePic: '', // 上传的图片 只上传一张
        uploadImg: '' // 传给后台的
      },
      timing: {
        chanel_id: '0',
        mobile: '0',
        type: 12,
        content: '',
        islook: 0,
        ispush: 0,
        sendtime: ''
      },
      editId: '', // 编辑的id
      // ===删除弹层
      deletModal: false,
      deletId: '' // 删除id
    }
  },
  created () {
    this.upLoadUrl = window.serverIp + '/fileupload'
    this.getTable(1, 10)
  },
  methods: {
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
      // true=显示；false=隐藏
      if (status === false) {
        this.isChange1 = false
        this.isChange2 = false
        this.modalData = {
          theme: '', // 互动内容
          publicTime: '', // 发布时间
          remindTime: '', // 提醒时间
          remindContent: '', // 提醒内容模板
          copyRighter: '', // 互动文案
          forwarding: '', // 转发语
          titlePic: '', // 上传的图片 只上传一张
          uploadImg: '' // 传给后台的
        }
      }
    },
    // 获取表格
    getTable (pageNum, pageSize) {
      this.$axios.get(window.serverIp + '/api/actualactivity/getActualPageActivity?pageNum=' + pageNum + '&pageSize=' + pageSize)
        .then(res => {
          if (res.status === 'success') {
            var data = res.data
            var list = res.data.records
            this.total = data.total
            for (var i = 0; i < list.length; i++) {
              list[i]['reminderPinlv'] = 1
            }
            this.dataList = list
            this.loading = false
            console.log(this.dataList)
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
      this.getTable(val, 10)
    },
    // 添加
    add () {
      this.modalStatus(true, '发起内容互动', false)
      this.status = 1
    },
    // 导出
    exports () {
      this.$Message.error('导出先不做')
    },
    // 删除
    delete (param) {
      this.deletId = param.actualtimeActivityId
      this.deletModal = true
    },
    // 确认删除
    ensureDelete () {
      this.$axios.delete(window.serverIp + '/api/actualactivity?activityId=' + this.deletId)
        .then(res => {
          if (res.status === 'success') {
            this.$Message.success('删除成功')
            this.deletModal = false
            this.getTable(this.pageNum, 10)
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 编辑
    edit (param) {
      this.status = 2
      console.log(param)
      this.editId = param.actualtimeActivityId
      // 绑定图片，两个时间的时分秒
      this.modalData = {
        theme: param.theme, // 互动内容
        publicTime: param.publicTime, // 发布时间
        remindTime: param.remindTime, // 提醒时间
        remindContent: param.remindContent, // 提醒内容模板
        copyRighter: param.copyRighter, // 互动文案
        forwarding: param.forwarding, // 转发语
        titlePic: param.titlePic, // 上传的图片 只上传一张
        uploadImg: window.serverIp + param.titlePic// 传给后台的
      }
      this.modalStatus(true, '编辑互动内容', false)
    },
    // 弹窗-保存
    save () {
      // 区分编辑和新增
      var data = this.modalData
      if (data.theme === '') {
        this.$Message.warning('请输入互动标题')
      } else if (data.publicTime === '') {
        this.$Message.warning('请选择发布时间')
      } else if (data.remindTime === '') {
        this.$Message.warning('请选择提醒时间')
      } else if (data.remindContent === '') {
        this.$Message.warning('请输入提醒消息内容')
      } else if (data.titlePic === '') {
        this.$Message.warning('请选择图片')
      } else if (data.copyRighter === '') {
        this.$Message.warning('请输入互动文案')
      } else if (data.forwarding === '') {
        this.$Message.warning('请输入转发语')
      } else {
        this.addHudong()
      }
    },
    addHudong () {
      console.log(this.modalData)
      // 1：新增；2-编辑
      if (this.status === 1) {
        var param = this.modalData
        this.$axios.post(window.serverIp + '/api/actualactivity', param)
          .then(res => {
            if (res.status === 'success') {
              this.timing.content = this.modalData.remindContent
              this.timing.sendtime = this.modalData.remindTime + ':00'
              this.$axios.post('http://mtssct.leiruitec.com/task/timing-push', this.timing)
                .then(res => {
                  if (res.status === 'success') {
                    this.$Message.success('添加互动成功')
                    this.modal = false
                    this.getTable(this.pageNum, 10)
                  } else {
                    this.$Message.error(res.message)
                  }
                })
                .catch(err => {
                  console.log(err)
                })
            } else {
              this.$Message.error(res.message)
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else if (this.status === 2) {
        var noneObj = {}
        var obj = {
          actualtimeActivityId: this.editId
        }
        Object.assign(noneObj, obj, this.modalData)
        console.log(noneObj)
        // 判断日期是否change
        if (this.isChange1 === false) {
          var publics = noneObj.publicTime
          var time1Y = publics.getFullYear()
          var time1M = publics.getMonth() + 1
          var time1H = publics.getDate()
          var time1S = publics.getHours()
          var time1F = publics.getMinutes()
          console.log(time1S)
          console.log(time1F)
          if (time1M < 10) {
            time1M = '0' + time1M
          }
          if (time1H < 10) {
            time1H = '0' + time1H
          }
          if (time1S < 10) {
            time1S = '0' + time1S
          }
          if (time1F < 10) {
            time1F = '0' + time1F
          }
          noneObj.publicTime = time1Y + '-' + time1M + '-' + time1H + ' ' + time1S + ':' + time1F
        } else {
          noneObj.publicTime = noneObj.publicTime
        }
        if (this.isChange2 === false) {
          var remind = noneObj.remindTime
          var time2Y = remind.getFullYear()
          var time2M = remind.getMonth() + 1
          var time2H = remind.getDate()
          var time2S = remind.getHours()
          var time2F = remind.getMinutes()
          if (time2M < 10) {
            time2M = '0' + time2M
          }
          if (time2H < 10) {
            time2H = '0' + time2H
          }
          if (time2S < 10) {
            time2S = '0' + time2S
          }
          if (time2F < 10) {
            time2F = '0' + time2F
          }
          noneObj.remindTime = time2Y + '-' + time2M + '-' + time2H + ' ' + time2S + ':' + time2F
        } else {
          noneObj.remindTime = noneObj.remindTime
        }
        this.$axios.put(window.serverIp + '/api/actualactivity', noneObj)
          .then(res => {
            if (res.status === 'success') {
              this.timing.content = this.modalData.remindContent
              this.timing.sendtime = noneObj.remindTime + ':00'
              this.$axios.post('http://mtssct.leiruitec.com/task/timing-push', this.timing)
                .then(res => {
                  if (res.status === 'success') {
                    this.$Message.success('添加互动成功')
                    this.modal = false
                    this.getTable(this.pageNum, 10)
                  } else {
                    this.$Message.error(res.message)
                  }
                })
                .catch(err => {
                  console.log(err)
                })
            } else {
              this.$Message.error(res.message)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    // 弹窗-取消
    cancel () {
      this.checkModal(false)
      this.modal = false
    },
    // 发布时间
    publicChange (time, date) {
      console.log(time)
      this.isChange1 = true
      this.modalData.publicTime = time
    },
    // 提醒时间
    warnChange (time, date) {
      console.log(time)
      this.isChange2 = true
      this.modalData.remindTime = time
    },
    // 图片上传成功时
    handleSuccess (response, file, fileList) {
      console.log(response)
      console.log(file)
      console.log(fileList)
      var data = response.data
      if (response.status === 'success') {
        this.$Message.success('图片上传成功')
        this.modalData.uploadImg = window.serverIp + data.filepath
        this.modalData.titlePic = data.filepath
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
  .modalCentenr .ivu-row {
    margin-top:10px;
  }
  .modalCentenr .ivu-row:nth-child(1) {
    margin-top:0;
  }
  .ivu-steps .ivu-steps-title{
    font-size: 12px;
  }
  .ivu-steps .ivu-steps-content{
    font-size:10px;
  }
  textarea.ivu-input {
    font-size:12px;
  }
</style>
