<!--节日节气-->
<template>
  <div class="container">
    <Table :columns="dataCol" :loading="loading" :data="dataList" border height="500" size="small"></Table>
    <!--<Page :total="total" :current="pageNum" show-total @on-change="pageChange" class="mt20 tc"/>-->
    <!--修改节日节气-->
    <Modal
      v-model="modal"
      :title="modalTitle"
      class-name="modal"
      width="900px"
      @on-visible-change="checkModal">
      <p slot="header" class="tc">{{modalTitle}}</p>
      <div class="modalCentenr">
        <div class="borderBottom pt0">
          <Row>
            <Col span="24">
            <span class="title">节日节气：</span>
            <Input placeholder="请输入节日节气" style="width:auto" :disabled="disabled" v-model="modalData.festivalName"/>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <span class="title">提醒时间：</span>
            <Input placeholder="请输入提醒时间" style="width: auto" :disabled="disabled" v-model="modalData.tipsTime"/>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">提醒消息内容模板：</span>
            <Input placeholder="请输入提醒消息内容模板" style="width:80%" v-model="modalData.remindMessage" type="textarea" :rows="3"/>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <span class="title">版式名称：</span>
            <Input placeholder="请输入版式名称" style="width: auto" v-model="modalData.edition"/>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <span class="title">文案主题：</span>
            <Input placeholder="请输入文案主题" style="width: auto" v-model="modalData.theme"/>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title fl">上传海报：</span>
            <Upload
              ref="upload"
              :show-upload-list="false"
              :on-success="uoploadImg"
              :format="['jpg','jpeg','png']"
              :max-size="1000000000"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :action="upLoadUrl"
              style="display: inline-block;width:58px;cursor: pointer;float: left;">
              <div style="width: 58px;height:58px;line-height: 58px;border:1px solid #eee;" class="tc">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
            <img :src="uploadImgUrl + modalData.festivalPic" alt="图片" class="oneUploadImg" v-if="showImg">
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">转发语：</span>
            <Input placeholder="请输入转发语" style="width:80%" v-model="modalData.festivalDetail" type="textarea" :rows="3"/>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">备注：</span>
            <Input placeholder="请输入备注" style="width:80%" v-model="modalData.comments" type="textarea" :rows="3"/>
            </Col>
          </Row>
        </div>
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
      uploadImgUrl: window.serverIp,
      upLoadUrl: '',
      loading: true, // 表格加载
      /* total: 0,
      pageNum: 1, // 第几页
      pageSize: 10, */
      dataCol: [
        {
          type: 'index',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '节日节气',
          key: 'festivalName',
          align: 'center',
          width: 200
        },
        {
          title: '版式名称',
          key: 'edition',
          align: 'center',
          width: 200
        },
        {
          title: '文案主题',
          key: 'theme',
          align: 'center',
          width: 100
        },
        {
          title: '提醒消息内容',
          key: 'remindMessage',
          align: 'center',
          width: 200
        },
        {
          title: '海报',
          key: 'festivalPic',
          align: 'center',
          width: 110,
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: window.serverIp + params.row.festivalPic, style: 'width: 50px;height:50px;margin-top:6px;border-radius: 2px;'
              }
            })
          }
        },
        {
          title: '转发语',
          key: 'festivalDetail',
          align: 'center',
          width: 110
        },
        {
          title: '备注',
          key: 'comments',
          align: 'center',
          width: 200
        },
        {
          title: '操作',
          key: 'festivalId',
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
                  type: 'error',
                  size: 'small'
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
      // 弹层
      showImg: false,
      editId: '', // 编辑id
      modal: false,
      modalTitle: '',
      disabled: false, // 文本框是否禁用
      modalData: {
        festivalName: '', // 节日节气
        tipsTime: '', // 提醒时间
        remindMessage: '', // 提醒消息模板内容
        edition: '', // 版式名称
        theme: '', // 文案主题
        festivalPic: '', // 上传海报 + 域名
        festivalDetail: '', // 转发语
        comments: '' // 备注
      },
      // 删除弹窗
      deletModal: false,
      deletId: ''
    }
  },
  created () {
    this.upLoadUrl = window.serverIp + '/fileupload' // 上传图片地址
    this.getTable()
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
    checkModal (status) {
      // true=显示；false=隐藏
      if (status === false) {
        this.editId = ''
        this.showImg = false
        this.modalData = {
          festivalName: '', // 节日节气
          tipsTime: '', // 提醒时间
          remindMessage: '', // 提醒消息模板内容
          edition: '', // 版式名称
          theme: '', // 文案主题
          festivalPic: '', // 上传海报
          festivalDetail: '', // 转发语
          comments: '' // 备注
        }
      }
    },
    // 获取列表
    getTable () {
      this.$axios.get(window.serverIp + '/api/festival/getFestivalAll')
        .then(res => {
          if (res.status === 'success') {
            var data = res.data
            this.total = data.length
            this.dataList = data
            this.loading = false
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
    },
    // 编辑
    edit (param) {
      this.editId = param.festivalId
      this.$axios.get(window.serverIp + '/api/festival?festivalId=' + param.festivalId)
        .then(res => {
          if (res.status === 'success') {
            var data = res.data
            /* 节气名称 festivalName
            提醒时间
            消息内容模板 remindMessage
            版式名称 edition
            文案主题 theme
            节日海报 festivalPic
            转发语 festivalDetail
            备注 comments */
            this.showImg = true
            this.modalStatus(true, '编辑', true)
            this.modalData = data
            this.modalData.tipsTime = '当天10:30'
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 删除
    delete (param) {
      this.deletId = param.festivalId
      this.deletModal = true
    },
    // 图片上传成功时
    uoploadImg (response, file, fileList) {
      var data = response.data
      if (response.status === 'success') {
        this.$Message.success('图片上传成功')
        this.modalData.festivalPic = data.filepath
        this.showImg = true
      } else {
        this.$Message.error(response.message)
      }
    },
    // 文件格式验证失败
    handleFormatError (file, fileList) {
      this.$Message.error('文件格式校验失败')
    },
    // 文件超出指定大小
    handleMaxSize (file, fileList) {
      this.$Message.error('文件超出指定大小')
    },
    // 编辑保存
    save () {
      var data = this.modalData
      if (data.remindMessage === null) {
        this.$Message.warning('请输入提醒消息模板内容')
        return false
      } else if (data.edition === null) {
        this.$Message.warning('请输入版式名称')
        return false
      } else if (data.theme === null) {
        this.$Message.warning('请输入文案主题')
        return false
      } else if (this.showImg === false) {
        this.$Message.warning('请上传图片')
        return false
      } else if (data.festivalDetail === null) {
        this.$Message.warning('请输入转发语')
        return false
      } else if (data.comments === null) {
        this.$Message.warning('请输入备注')
        return false
      } else {
        data.festivalId = this.editId
        delete data.calendarType
        delete data.festivalDate
        delete data.tipsTime
        this.$axios.put(window.serverIp + '/api/festival', data)
          .then(res => {
            if (res.status === 'success') {
              this.$Message.success('修改互动成功')
              this.modalStatus(false, '编辑', true)
              this.getTable()
            } else {
              this.$Message.error(res.message)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    cancel () {
      this.modalStatus(false, '编辑', true)
    },
    // 确认删除
    ensureDelete () {
      this.$axios.delete(window.serverIp + '/api/festival?festivalId=' + this.deletId)
        .then(res => {
          if (res.status === 'success') {
            this.$Message.success('删除成功')
            this.deletModal = false
            this.getTable()
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
  .modal {
    .ivu-modal {
      top: 30px;
    }
    .ivu-modal-body {
      height: 500px;
      overflow: auto
    }
    .modalCentenr{
      .borderBottom .title{
        width:110px;
      }
      .borderBottom .ivu-row{
        margin-top:10px;
      }
      .borderBottom .ivu-row div:nth-child(1){
        margin-top:0;
      }
    }
    textarea.ivu-input{
      font-size:12px;
    }
  }
  .oneUploadImg{
    width:60px;
    height:60px;
    border-radius: 5px;
    margin-left: 10px;
  }
</style>
