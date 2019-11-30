<!--经纪人==>顾客列表-->
<template>
  <div class="container">
    <div class="mb20">
      <Button type="info">下载批量导入模板</Button>
      <Button type="info">批量导入潜在客户信息</Button>
      <Button type="info" @click="add">单个添加</Button>
      <Button type="info">导出潜在客户信息</Button>
    </div>
    <Table :columns="dataCol" :loading="loading" :data="dataList" border height="480" size="small"></Table>
    <Page :total="total" :current="pageNum" show-total @on-change="pageChange" class="mt20 tc"/>
    <!--弹层-->
    <Modal
      v-model="modal"
      :title="modalTitle"
      class-name="modal"
      width="900px"
      @on-ok="ok"
      @on-visible-change="checkModal">
      <p slot="header" class="tc">{{modalTitle}}</p>
      <div>
        <!--关联房产-->
        <div class="borderBottom">
          <Row>
            <Col span="12">
            <span class="title">关联房产：</span>
            <Input placeholder="请输入关联房产" style="width: auto" :disabled="disabled" v-model="modalData.house"/>
            </Col>
          </Row>
          <Row class="mt10">
            <Col span="12">
            <span class="title">关联经纪人：</span>
            <Input placeholder="请输入关联经纪人" style="width: auto" :disabled="disabled" v-model="modalData.house"/>
            </Col>
          </Row>
        </div>
        <!--基本信息-->
        <div class="borderBottom">
          <Row>
            <p class="modalTitle">基本信息</p>
            <Col span="8">
            <span class="title">姓名：</span>
            <Input placeholder="请输入姓名" style="width: auto" :disabled="disabled" v-model="modalData.name"/>
            </Col>
            <Col span="8">
            <span class="title">联系方式1：</span>
            <Input placeholder="请输入联系方式" style="width: auto" :disabled="disabled" v-model="modalData.tel1"/>
            </Col>
            <Col span="8">
            <span class="title">联系方式2：</span>
            <Input placeholder="请输入联系方式" style="width: auto" :disabled="disabled" v-model="modalData.tel2"/>
            </Col>
          </Row>
          <Row class="mt10">
            <Col span="8">
            <span class="title">年龄范围：</span>
            <Input placeholder="请输入年龄范围" style="width: auto" :disabled="disabled" v-model="modalData.age"/>
            </Col>
            <Col span="8">
            <span class="title">身份证号：</span>
            <Input placeholder="请输入身份证号" style="width: auto" :disabled="disabled" v-model="modalData.cardNum"/>
            </Col>
            <Col span="8">
            <span class="title">社区角色：</span>
            <Input placeholder="请输入社区角色" style="width: auto" :disabled="disabled" v-model="modalData.role"/>
            </Col>
          </Row>
          <Row class="mt10">
            <Col span="8">
            <span class="title">籍贯：</span>
            <Input placeholder="请输入籍贯" style="width: auto" :disabled="disabled" v-model="modalData.address"/>
            </Col>
            <Col span="8">
            <span class="title">职业情况：</span>
            <Input placeholder="请输入职业情况" style="width: auto" :disabled="disabled" v-model="modalData.profession"/>
            </Col>
          </Row>
        </div>
        <!--家庭信息-->
        <div class="borderBottom">
          <Row>
            <p class="modalTitle">家庭信息</p>
            <Col span="8">
            <span class="title">家庭结构：</span>
            <Input placeholder="请输入家庭结构" style="width: auto" :disabled="disabled" v-model="modalData.familyStructure"/>
            </Col>
            <Col span="8">
            <span class="title">婚姻情况：</span>
            <Input placeholder="请输入婚姻情况" style="width: auto" :disabled="disabled" v-model="modalData.maritalStatus"/>
            </Col>
          </Row>
        </div>
        <!--车辆信息-->
        <div class="borderBottom">
          <Row>
            <p class="modalTitle">车辆信息</p>
            <Col span="8">
            <span class="title">有无车辆：</span>
            <Input placeholder="请输入有无车辆" style="width: auto" :disabled="disabled" v-model="modalData.hasCar"/>
            </Col>
            <Col span="8">
            <span class="title">车牌号码：</span>
            <Input placeholder="请输入车牌号码" style="width: auto" :disabled="disabled" v-model="modalData.carNum"/>
            </Col>
            <Col span="8">
            <span class="title">车辆价位：</span>
            <Input placeholder="请输入车辆价位" style="width: auto" :disabled="disabled" v-model="modalData.carPrice"/>
            </Col>
          </Row>
        </div>
        <!--重要日期-->
        <div class="borderBottom">
          <Row>
            <p class="modalTitle">重要日期</p>
            <Col span="8">
            <span class="title">生日：</span>
            <Input placeholder="请输入生日" style="width: auto" :disabled="disabled" v-model="modalData.birthDay"/>
            </Col>
            <Col span="8">
            <span class="title">结婚纪念日：</span>
            <Input placeholder="请输入结婚纪念日" style="width: auto" :disabled="disabled" v-model="modalData.marryDay"/>
            </Col>
            <Col span="8">
            <span class="title">购房纪念日：</span>
            <Input placeholder="请输入购房纪念日" style="width: auto" :disabled="disabled" v-model="modalData.buyHouseDay"/>
            </Col>
          </Row>
          <Row class="mt10">
            <Col span="8">
            <span class="title">家庭成员生日：</span>
            <Input placeholder="请输入家庭成员生日" style="width: auto" :disabled="disabled" v-model="modalData.familyMembersDay"/>
            </Col>
          </Row>
        </div>
        <!--兴趣爱好-->
        <div class="borderBottom">
          <Row>
            <p class="modalTitle">兴趣爱好</p>
            <Col span="8">
            <span class="title">宗教信仰：</span>
            <Input placeholder="请输入宗教信仰" style="width: auto" :disabled="disabled" v-model="modalData.religion"/>
            </Col>
            <Col span="8">
            <span class="title">个人爱好：</span>
            <Input placeholder="请输入个人爱好" style="width: auto" :disabled="disabled" v-model="modalData.hobby"/>
            </Col>
          </Row>
        </div>
        <!--个人标签-->
        <div class="borderBottom">
          <Row>
            <p class="modalTitle">个人标签</p>
            <Col span="24">
            <Tag checkable color="success" :checked="false" @on-change="tagChange">亲子</Tag>
            <Tag checkable color="success" :checked="false">健身</Tag>
            <Tag checkable color="success" :checked="false">活动达人</Tag>
            </Col>
          </Row>
        </div>
      </div>
      <div slot="footer" class="tc">
        <Button type="info" @click="ok">保存</Button>
        <Button type="info">取消</Button>
        <Button type="info">删除</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  data () {
    return {
      modal: false,
      modalTitle: '',
      disabled: false, // 文本框是否禁用
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
          title: '关联房产',
          key: 'name',
          align: 'center',
          width: 200
        },
        {
          title: '基础信息',
          align: 'center',
          children: [
            {
              title: '姓名',
              key: 'age',
              align: 'center',
              width: 200
            },
            {
              title: '联系方式',
              key: 'street',
              align: 'center',
              width: 200
            },
            {
              title: '年龄范围',
              key: 'building',
              align: 'center',
              width: 200
            }
          ]
        },
        {
          title: '家庭信息',
          align: 'center',
          children: [
            {
              title: '家庭结构',
              key: 'caddress',
              align: 'center',
              width: 200
            },
            {
              title: '婚姻情况',
              key: 'cname',
              align: 'center',
              width: 200
            }
          ]
        },
        {
          title: '个人标签',
          key: 'gender',
          align: 'center',
          width: 200,
          children: [
            {
              title: '亲子、健身',
              key: 'caddress',
              align: 'center',
              width: 200
            }
          ]
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
      modalData: {
        house: '', // 关联房产
        agent: '', // 关联经纪人
        name: '', // 姓名
        tel1: '', // 联系方式1
        tel2: '', // 联系方式2
        age: '', // 年龄范围
        cardNum: '', // 身份证号
        role: '', // 受委屈角色
        address: '', // 籍贯
        profession: '', // 职业
        familyStructure: '', // 家庭结构
        maritalStatus: '', // 婚姻情况
        hasCar: '', // 有无车辆
        carNum: '', // 车牌号
        carPrice: '', // 车牌价位
        birthDay: '', // 生日
        marryDay: '', // 结婚纪念日
        buyHouseDay: '', // 购房纪念日
        familyMembersDay: '', // 家庭成员生日
        religion: '', // 宗教
        hobby: '', // 爱好
        tags: ''
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
    // 页码改变
    pageChange (val) {
      this.pageNum = val
      // this.getList(val, 10)
    },
    // 弹窗-确定
    ok () {
      setTimeout(() => {
        this.modal = false
      }, 2000)
    },
    // 当弹窗显示隐藏状态变化时2
    checkModal (a) {
      console.log(a)
      // true=显示；false=隐藏
    },
    // 标签选中
    tagChange (checked, name) {
      console.log(checked)
      console.log(name)
    },
    // 添加
    add () {
      this.modalStatus(true, '添加顾客', false)
    },
    // 查看详情
    seeDetail (params) {
      console.log(params)
      this.modalStatus(true, '查看顾客详情', true)
    },
    // 编辑
    edit (params) {
      console.log(params)
      this.modalStatus(true, '编辑顾客详情', false)
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
</style>
