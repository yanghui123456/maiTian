<!--内容库管理==>系统触发-->
<template>
  <div class="container">
    <Table :columns="dataCol" :loading="loading" :data="dataList" border height="480" size="small"></Table>
    <!--<Page :total="total" :current="pageNum" show-total @on-change="pageChange" class="mt20 tc"/>-->
    <!--弹层-->
    <Modal
      v-model="modal"
      :title="modalTitle"
      class-name="modal"
      width="900px"
      @on-visible-change="checkModal">
      <p slot="header" class="tc">{{modalTitle}}</p>
      <div class="modalCentenr">
        <div class="mt20">
          <Row>
            <Col span="12">
            <span class="title">互动类型：</span>
            <Input placeholder="请输入互动内容" style="width: auto" :disabled="disabled" v-model="modalData.interactivityType"/>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">提醒时间：</span>
            <Input placeholder="请输入提醒时间" style="width: auto" :disabled="disabled" v-model="modalData.currentTime"/>
            <Input placeholder="请输入提醒时间" style="width: auto" :disabled="disabled" v-model="modalData.threeAgoTime"/>
            <Input placeholder="请输入提醒时间" style="width: auto" :disabled="disabled" v-model="modalData.sevenAgoTime"/>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">提醒文案：</span>
            <Input placeholder="请输入提醒文案" :disabled="disabled" style="width: 80%;" v-model="modalData.wenan1"/>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title"></span>
            <Input placeholder="请输入提醒文案" :disabled="disabled" style="width: 80%;" v-model="modalData.wenan2"/>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title"></span>
            <Input placeholder="请输入提醒文案" :disabled="disabled" style="width: 80%;" v-model="modalData.wenan3"/>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <span class="title">版式名称：</span>
            <Input placeholder="请输入互动内容" style="width: auto" v-model="modalData.format"/>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <span class="title">文案主题：</span>
            <Input placeholder="请输入互动内容" style="width: auto" v-model="modalData.theme"/>
            </Col>
          </Row>
          <!--上传图片-->
          <Row>
            <Col span="24">
            <span class="title fl">图片：</span>
            <Upload
              ref="upload"
              :show-upload-list="false"
              :on-success="handleSuccess"
              :format="['jpg','jpeg','png']"
              :max-size="2048"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :action="upLoadUrl"
              style="display: inline-block;width:58px;cursor: pointer;float: left;">
              <div style="width: 58px;height:58px;line-height: 58px;border:1px solid #eee;" class="tc">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
            <img :src="uploadImgUrl + modalData.poster" alt="图片" class="oneUploadImg">
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">转发语：</span>
            <Input placeholder="请输入转发语" style="width:80%" v-model="modalData.forwarding" type="textarea" :rows="4"/>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">备注：</span>
            <Input placeholder="请输入备注" style="width:80%" v-model="modalData.comments" type="textarea" :rows="2"/>
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
      upLoadUrl: '', // 图片上传地址
      modal: false,
      modalTitle: '',
      disabled: false, // 文本框是否禁用
      loading: true, // 表格加载
      /* total: 0,
      pageNum: 1, // 第几页
      pageSize: 10, */
      dataCol: [
        {
          type: 'index',
          align: 'center',
          fixed: 'left'
        },
        {
          title: '互动类型',
          key: 'interactivityType',
          align: 'center'
        },
        {
          title: '版式名称',
          key: 'format',
          align: 'center'
        },
        {
          title: '文案主题',
          key: 'theme',
          align: 'center'
        },
        {
          title: '海报',
          key: 'poster',
          align: 'center',
          width: 100,
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: window.serverIp + params.row.poster, style: 'width: 50px;height:50px;margin-top:6px;border-radius: 2px;'
              }
            })
          }
        },
        {
          title: '转发语',
          key: 'forwarding',
          align: 'center',
          width: 400
        },
        {
          title: '备注',
          key: 'comments',
          align: 'center'
        },
        {
          title: '状态',
          key: 'isUsed',
          align: 'center',
          width: 150,
          render: (h, params) => {
            var status = params.row.isUsed
            if (status === 1) {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.checkStatus(params.row)
                    }
                  }
                }, '已启用/去禁用')
              ])
            } else if (status === 0) {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.checkStatus(params.row)
                    }
                  }
                }, '已禁用/去启用')
              ])
            }
          }
        },
        {
          title: '操作',
          key: 'copywritingId',
          align: 'center',
          width: 100,
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
              }, '编辑')
            ])
          }
        }
      ],
      dataList: [],
      modalData: {
        interactivityType: '', // 互动内容
        currentTime: '', // 提醒时间
        threeAgoTime: '', // 提醒时间
        sevenAgoTime: '', // 提醒时间
        wenan1: '', // 文案1
        wenan2: '', // 文案2
        wenan3: '', // 文案3
        format: '', // 版式名称  是
        theme: '', // 文案主题 是
        poster: '', // 海报 是
        forwarding: '', // 转发语 是
        comments: '' // 备注 是
      },
      editId: '', // 编辑系统触发的id
      systemNoticeId: '', // 互动类别id
      // 删除
      deletModal: false
    }
  },
  created () {
    this.upLoadUrl = window.serverIp + '/fileupload'
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
    // 当弹窗显示隐藏状态变化时
    checkModal (status) {
      console.log(status)
      // true=显示；false=隐藏
      if (status === false) {
        this.editId = ''
        this.systemNoticeId = ''
        this.modalData = {
          interactivityType: '', // 互动类型
          currentTime: '', // 提醒时间
          threeAgoTime: '', // 提醒时间
          sevenAgoTime: '', // 提醒时间
          wenan1: '', // 文案1
          wenan2: '', // 文案2
          wenan3: '', // 文案3
          format: '', // 版式名称  是
          theme: '', // 文案主题 是
          poster: '', // 海报 是
          forwarding: '', // 转发语 是
          comments: '' // 备注 是
        }
      }
    },
    // 获取列表
    getTable () {
      this.$axios.get(window.serverIp + '/api/copywriting/getAllCopywritings')
        .then(res => {
          if (res.status === 'success') {
            console.log(res.data)
            this.dataList = res.data
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
      console.log(param.copywritingId)
      this.editId = param.copywritingId
      this.systemNoticeId = param.systemNoticeId
      this.$axios.get(window.serverIp + '/api/copywriting/getCopywritingById?copywritingId=' + param.copywritingId)
        .then(res => {
          if (res.status === 'success') {
            this.modalStatus(true, '编辑', true)
            console.log(res.data)
            this.modalData = res.data
            this.modalData.currentTime = res.data.currentTime
            this.modalData.threeAgoTime = res.data.threeAgoTime
            this.modalData.sevenAgoTime = res.data.sevenAgoTime
            this.modalData.wenan1 = res.data.remindCurrent
            this.modalData.wenan2 = res.data.remindThreeAgo
            this.modalData.wenan3 = res.data.remindSevenAgo
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 保存
    save () {
      console.log(this.modalData)
      var data = this.modalData
      if (data.format === '' || data.format === null) {
        this.$Message.warning('请填写版式名称')
        return false
      } else if (data.theme === '' || data.theme === null) {
        this.$Message.warning('请填写文案主题')
        return false
      } else if (data.forwarding === '' || data.forwarding === null) {
        this.$Message.warning('请填写转发语')
        return false
      } else if (data.comments === '' || data.comments === null) {
        this.$Message.warning('请填写备注')
        return false
      } else {
        data.copywritingId = this.editId
        data.systemNoticeId = this.systemNoticeId
        delete data.interactivityType
        delete data.currentTime
        delete data.threeAgoTime
        delete data.sevenAgoTime
        this.$axios.put(window.serverIp + '/api/copywriting', data)
          .then(res => {
            if (res.status === 'success') {
              this.$Message.success('修改成功')
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
    // 启用、禁用
    checkStatus (param) {
      var data = {
        'copywritingId': param.copywritingId,
        'isUsed': param.isUsed === 1 ? 0 : 1
      }
      this.$axios.put(window.serverIp + '/api/copywriting', data)
        .then(res => {
          if (res.status === 'success') {
            if (data.isUsed === 0) {
              this.$Message.success('禁用成功')
            } else if (data.isUsed === 1) {
              this.$Message.success('启用成功')
            }
            this.getTable()
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 取消
    cancel () {
      this.checkModal(false)
      this.modal = false
    },
    // 图片上传成功时
    handleSuccess (response, file, fileList) {
      var data = response.data
      if (response.status === 'success') {
        this.$Message.success('图片上传成功')
        this.modalData.poster = data.filepath
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
    // 删除
    delete () {
      this.deletModal = true
    },
    // 确认删除
    ensureDelete () {
      this.$Message.error('确认删除')
      this.deletModal = false
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
  .oneUploadImg{
    width:60px;
    height:60px;
    border-radius: 5px;
    margin-left: 10px;
  }
  textarea.ivu-input{
    font-size 12px;
  }
</style>
