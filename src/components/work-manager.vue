<template>
  <!--名片管理-->
  <div class="work">
    <Button type="primary" @click="addProduct">新增产品</Button>
    <Tabs style="width:100%" @on-click="tabClick" >
      <TabPane label="银行理财" icon="logo-usd" name="bank">
        <Table border :columns="bankCol" :data="bankList"></Table>
        <Page :total="total" :current="pageNum" show-total @on-change="pageChange"  class="mt20 tc"/>
      </TabPane>
      <TabPane label="个人贷款" icon="logo-usd" name="personal">
        <Table border :columns="personalCol" :data="personalList"></Table>
        <Page :total="total" :current="pageNum" show-total @on-change="pageChange"  class="mt20 tc"/>
      </TabPane>
      <TabPane label="银行存款" icon="logo-usd" name="regular">
        <Table border :columns="regularCol" :data="regularList"></Table>
        <Page :total="total" :current="pageNum" show-total @on-change="pageChange"  class="mt20 tc"/>
      </TabPane>
      <TabPane label="拼财富" icon="logo-usd" name="fortune">
        <Table border :columns="fortuneCol" :data="fortuneList"></Table>
        <Page :total="total" :current="pageNum" show-total @on-change="pageChange"  class="mt20 tc"/>
      </TabPane>
    </Tabs>
    <!--弹窗-->
    <Modal v-model="modal">
      <p slot="header" style="text-align:center">
        <span>新增产品类型</span>
      </p>
      <div>
        <div>
          产品类型：
          <Select v-model="formItem.select" style="width:auto" @on-change="selectChange">
            <Option value="bank">银行理财</Option>
            <Option value="personal">个人贷款</Option>
            <Option value="regular">银行存款</Option>
            <Option value="fortune">拼财富</Option>
          </Select>
        </div>
        <div class="mt10">
          产品名称：
          <Input v-model="formItem.name" placeholder="请输入产品名称" style="width:auto"></Input>
        </div>
        <div class="mt10">
          产品标签：
          <Input v-model="formItem.tag" placeholder="以#分割(例:标签一#标签二)" style="width:auto"></Input>
        </div>
        <div class="mt10">
          产品说明：
          <Input v-model="formItem.explain" placeholder="请输入产品说明" style="width:auto" type="textarea"></Input>
        </div>
        <div class="mt10">
          是否热销：
          <RadioGroup v-model="formItem.isHot">
            <Radio label="是"></Radio>
            <Radio label="否"></Radio>
          </RadioGroup>
        </div>
        <div class="mt10">
          是否启用产品：
          <RadioGroup v-model="formItem.isEnable">
            <Radio label="是"></Radio>
            <Radio label="否"></Radio>
          </RadioGroup>
        </div>
        <div class="mt10">
          产品期限：
          <Input v-model="formItem.year" placeholder="请输入产品期限" style="width:auto"></Input>
          <Select v-model="formItem.timeUnit" style="width:auto" @on-change="unitChange">
            <Option value="1">年</Option>
            <Option value="2">月</Option>
            <Option value="3">周</Option>
            <Option value="4">天</Option>
          </Select>
        </div>
        <div class="mt10">
          产品截止日期:
          <DatePicker @on-change="timePickerChange" :value="formItem.timerStarAndEnd" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="请选择产品起止日期" style="width: auto"></DatePicker>
        </div>
        <div class="mt10" v-if="selectType === 'bank' || selectType === 'regular'">
          起存金额(元)：
          <Input v-model="formItem.minDepositAmount" placeholder="请输入起存金额" style="width:auto"></Input>
        </div>
        <!--银行理财-->
        <div v-if="selectType === 'bank'">
          <div class="mt10">
            最新净值：
            <Input v-model="formItem.val" placeholder="请输入最新净值" style="width:auto"></Input>
          </div>
        </div>
        <!--个人贷款-->
        <div v-if="selectType === 'personal'">
          <div class="mt10">
            是否为比例贷：
            <RadioGroup v-model="formItem.isRatioLoan">
              <Radio label="是"></Radio>
              <Radio label="否"></Radio>
            </RadioGroup>
          </div>
          <div class="mt10">
            贷款最高比例(%)：
            <Input v-model="formItem.scale" placeholder="请输入贷款最高比例" style="width:auto"></Input>
          </div>
          <div class="mt10">
            最高可贷额度(万元)：
            <Input v-model="formItem.money" placeholder="请输入最高可贷额度" style="width:auto"></Input>
          </div>
          <div class="mt10">
            还款方式：
            <Input v-model="formItem.payBackType" placeholder="请输入还款方式)" style="width:auto"></Input>
          </div>
          <div class="mt10">
            贷款时长：
            <Input v-model="formItem.duration" placeholder="请输入贷款时长" style="width:auto"></Input>
            <Select v-model="formItem.durationUnit" style="width:auto" @on-change="durationUnitChange">
              <Option value="1">年</Option>
              <Option value="2">月</Option>
              <Option value="3">周</Option>
              <Option value="4">天</Option>
            </Select>
          </div>
        </div>
        <!--银行存款-->
        <div v-if="selectType === 'regular'">
          <div class="mt10">
            定期存款利率(%)：
            <Input v-model="formItem.timeDepositRate" placeholder="定期存款利率(%)" style="width:auto"></Input>
          </div>
        </div>
        <!--拼财富-->
        <div v-if="selectType === 'fortune'">
          <div class="mt10">
            预计年化收益(%)：
            <Input v-model="formItem.annualizedIncome" placeholder="请输入预计年化收益(%)" style="width:auto"></Input>
          </div>
          <div class="mt10">
            成团金额(万元)：
            <Input v-model="formItem.minGroupAmount" placeholder="请输入成团金额(万元)" style="width:auto"></Input>
          </div>
          <div class="mt10">
            起投金额(元)：
            <Input v-model="formItem.minInvestmentAmount" placeholder="请输入起投金额(元)" style="width:auto"></Input>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="add" v-if="eiditType === 'add'">新增</Button>
        <Button type="primary" size="large" long @click="save" v-if="eiditType === 'save'">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  data () {
    return {
      eiditType: '', // add = 新增, save == 编辑
      modal: false,
      selectType: '',
      pageNum: 1, // 第几页
      total: 0,
      pageSize: 10,
      params: {
        pageNum: 1,
        pageSize: 10,
        searchBean: {
          productName: ''
        }
      }, // 获取四中类型列表默认传参
      tabName: 'bank',
      // 银行理财
      bankCol: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '产品名称',
          key: 'productName'
        },
        {
          title: '最新净值',
          key: 'latestNetWorth'
        },
        {
          title: '产品标签',
          key: 'tag'
        },
        {
          title: '产品说明',
          key: 'description'
        },
        {
          title: '创建时间',
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
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.edit('bank', params.row.id, params.row.version)
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      bankList: [],
      // 个人贷款
      personalCol: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '产品名称',
          key: 'productName'
        },
        {
          title: '最高贷款额度(万元)',
          key: 'maxLoanAmount'
        },
        {
          title: '贷款最高比例(%)',
          key: 'maximumLoanRatio'
        },
        {
          title: '还款方式',
          key: 'repayment'
        },
        {
          title: '创建时间',
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
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.edit('personal', params.row.id, params.row.version)
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      personalList: [],
      // 银行存款
      regularCol: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '产品名称',
          key: 'productName'
        },
        {
          title: '起存金额(元)',
          key: 'minDepositAmount'
        },
        {
          title: '产品期限',
          key: 'duration'
        },
        {
          title: '产品标签',
          key: 'tag'
        },
        {
          title: '创建时间',
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
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.edit('regular', params.row.id, params.row.version)
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      regularList: [],
      // 拼财富
      fortuneCol: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '产品名称',
          key: 'productName'
        },
        {
          title: '产品标签',
          key: 'tag'
        },
        {
          title: '预计年化收益(%)',
          key: 'annualizedIncome'
        },
        {
          title: '产品说明',
          key: 'description'
        },
        {
          title: '创建时间',
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
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.edit('fortune', params.row.id, params.row.version)
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      fortuneList: [],
      formItem: {
        timerStarAndEnd: ['', ''], // 开始--截止日期
        select: '', // 产品类型
        name: '', // 产品名称
        val: '', // 最新净值
        year: '', // 产品期限
        timeUnit: '', // 时间单位
        tag: '', // 产品标签
        isHot: '', // 是否热销
        isEnable: '', // 是否启用产品
        isRatioLoan: '', // 是否为比例贷
        explain: '', // 产品说明
        timeDepositRate: '', // 定期存款利率
        scale: '', // 贷款最高比例
        money: '', // 最高可贷额度
        payBackType: '', // 还款方式
        duration: '', // 贷款时长
        durationUnit: '', // 贷款时长单位
        minDepositAmount: '',
        annualizedIncome: '', // 预计年化收益
        minGroupAmount: '', // 成团金额(万元)
        minInvestmentAmount: '' // 起投金额(元)
      }
    }
  },
  created () {
    this.tabClick('bank')
  },
  methods: {
    // tab 切换
    tabClick (name) {
      this.tabName = name
      this.pageNum = 1
      if (name === 'bank') {
        // 银行理财
        this.getList('/sys/product/financing/list', this.params, 'bank')
      } else if (name === 'personal') {
        // 个人贷款
        this.getList('/sys/product/loan/list', this.params, 'personal')
      } else if (name === 'regular') {
        // 银行存款
        this.getList('/sys/product/deposit/list', this.params, 'regular')
      } else if (name === 'fortune') {
        // 拼财富
        this.getList('/sys/product/wealth/list', this.params, 'fortune')
      }
    },
    selectChange (type) {
      this.selectType = type
    },
    // 时间单位
    unitChange (type) {
      this.formItem.timeUnit = type
    },
    // 贷款时长单位
    durationUnitChange (type) {
      this.formItem.durationUnit = type
    },
    // 起止日期选择
    timePickerChange (a, b) {
      console.log(a)
      this.formItem.timerStarAndEnd = a
    },
    // 编辑
    edit (type, id, version) {
      this.modal = true
      this.eiditType = 'save'
      this.editVersion = version
      this.editId = id
      if (type === 'bank') {
        this.httpEdit('/sys/product/financing/info?financingProductId=' + id, 'bank')
      } else if (type === 'personal') {
        this.httpEdit('/sys/product/loan/info?loanProductId=' + id, 'personal')
      } else if (type === 'regular') {
        this.httpEdit('/sys/product/deposit/info?depositProductId=' + id, 'regular')
      } else if (type === 'fortune') {
        this.httpEdit('/sys/product/wealth/info?wealthProductId=' + id, 'fortune')
      }
    },
    // 获取编辑详情
    httpEdit (url, type) {
      this.$axios.get(window.serverIp + url)
        .then((res) => {
          if (res.code === 0) {
            var data = res.body
            var datas = this.formItem
            console.log(data)
            datas.name = data.productName
            datas.tag = data.tag
            datas.explain = data.description
            datas.isHot = data.isHot === true ? '是' : '否'
            datas.isEnable = data.isEnable === true ? '是' : '否'
            datas.year = data.duration
            datas.timeUnit = data.timeUnit === 1 ? '1' : data.timeUnit === 2 ? '2' : data.timeUnit === 3 ? '3' : '4'
            datas.timerStarAndEnd = [data.startTime, data.endTime]
            // 根据类型给不同列表赋值
            if (type === 'bank') {
              this.selectType = 'bank' // 产品类型
              datas.select = 'bank'
              datas.val = data.latestNetWorth
              datas.minDepositAmount = data.minDepositAmount
            } else if (type === 'personal') {
              this.selectType = 'personal' // 产品类型
              datas.select = 'personal'
              datas.isRatioLoan = data.isRatioLoan === true ? '是' : '否'
              datas.money = data.maxLoanAmount
              datas.scale = data.maximumLoanRatio
              datas.payBackType = data.repayment
              datas.duration = data.duration
              datas.durationUnit = data.timeUnit === 1 ? '1' : data.timeUnit === 2 ? '2' : data.timeUnit === 3 ? '3' : '4'
            } else if (type === 'regular') {
              this.selectType = 'regular' // 产品类型
              datas.select = 'regular'
              datas.timeDepositRate = data.timeDepositRate
              datas.minDepositAmount = data.minDepositAmount
            } else if (type === 'fortune') {
              this.selectType = 'fortune' // 产品类型
              datas.select = 'fortune'
              datas.annualizedIncome = data.annualizedIncome
              datas.minGroupAmount = data.minGroupAmount
              datas.minInvestmentAmount = data.minInvestmentAmount
            }
          } else {
            this.$Message.warning(res.msg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 修改详情
    save () {
      console.log('保存')
      if (this.selectType === 'bank') {
        this.checkBank('edit')
      } else if (this.selectType === 'personal') {
        this.checkPerson('edit')
      } else if (this.selectType === 'regular') {
        this.checkRegular('edit')
      } else if (this.selectType === 'fortune') {
        this.checkFortune('edit')
      }
    },
    // 新增产品
    addProduct () {
      this.selectType = ''
      this.eiditType = 'add'
      this.modal = true
      this.formItem = {
        timerStarAndEnd: ['', ''],
        select: '', // 产品类型
        name: '', // 产品名称
        val: '', // 最新净值
        year: '', // 产品期限
        timeUnit: '', // 时间单位
        tag: '', // 产品标签
        isHot: '', // 是否热销
        isEnable: '', // 是否启用产品
        isRatioLoan: '', // 是否为比例贷
        explain: '', // 产品说明
        timeDepositRate: '', // 定期存款利率
        scale: '', // 贷款最高比例
        money: '', // 最高可贷额度
        payBackType: '', // 还款方式
        duration: '', // 贷款时长
        durationUnit: '', // 贷款时长单位
        minDepositAmount: '',
        annualizedIncome: '', // 预计年化收益
        minGroupAmount: '', // 成团金额(万元)
        minInvestmentAmount: '' // 起投金额(元)
      }
    },
    // 确认新增
    add () {
      if (this.selectType === '') {
        this.$Message.warning('请选择产品类型')
      } else {
        if (this.selectType === 'bank') {
          this.checkBank('add')
        } else if (this.selectType === 'personal') {
          this.checkPerson('add')
        } else if (this.selectType === 'regular') {
          this.checkRegular('add')
        } else if (this.selectType === 'fortune') {
          this.checkFortune('add')
        }
      }
    },
    // 校验银行理财
    checkBank (type) {
      // type: add 新增, edit 编辑
      var data = this.formItem
      if (data.name === '') {
        this.$Message.warning('请填写产品名称')
      } else if (data.tag === '') {
        this.$Message.warning('请填写产品标签')
      } else if (data.explain === '') {
        this.$Message.warning('请填写产品说明')
      } else if (data.val === '') {
        this.$Message.warning('请填写最新净值')
      } else if (data.isHot === '') {
        this.$Message.warning('请选择是否热销')
      } else if (data.isEnable === '') {
        this.$Message.warning('请选择是否启用产品')
      } else if (data.year === '') {
        this.$Message.warning('请填写产品期限')
      } else if (data.timeUnit === '') {
        this.$Message.warning('请选择产品期限单位')
      } else if (data.minDepositAmount === '') {
        this.$Message.warning('请填写起存金额')
      } else if (data.timerStarAndEnd[0] === '' && data.timerStarAndEnd[1] === '') {
        this.$Message.warning('请选择起止日期')
      } else {
        if (type === 'add') {
          var params = {
            productName: data.name,
            latestNetWorth: Number(data.val),
            minDepositAmount: Number(data.minDepositAmount),
            duration: Number(data.year),
            timeUnit: Number(data.timeUnit),
            tag: data.tag,
            description: data.explain,
            startTime: data.timerStarAndEnd[0],
            endTime: data.timerStarAndEnd[1],
            isHot: data.isHot === '是' ? true : false,
            isEnable: data.isEnable === '是' ? true : false
          }
          this.addHttp('/sys/product/financing/add', params, 'bank')
        } else {
          var params1 = {
            id: this.editId,
            version: this.editVersion,
            productName: data.name,
            latestNetWorth: Number(data.val),
            minDepositAmount: Number(data.minDepositAmount),
            duration: Number(data.year),
            timeUnit: Number(data.timeUnit),
            tag: data.tag,
            description: data.explain,
            startTime: data.timerStarAndEnd[0],
            endTime: data.timerStarAndEnd[1],
            isHot: data.isHot === '是' ? true : false,
            isEnable: data.isEnable === '是' ? true : false
          }
          this.editHttp('/sys/product/financing/edit', params1, 'bank')
        }
      }
    },
    // 校验个人贷款
    checkPerson (type) {
      var data = this.formItem
      if (data.name === '') {
        this.$Message.warning('请填写产品名称')
      } else if (data.tag === '') {
        this.$Message.warning('请填写产品标签')
      } else if (data.explain === '') {
        this.$Message.warning('请填写产品说明')
      } else if (data.isHot === '') {
        this.$Message.warning('请选择是否热销')
      } else if (data.isEnable === '') {
        this.$Message.warning('请选择是否启用产品')
      } else if (data.year === '') {
        this.$Message.warning('请填写产品期限')
      } else if (data.timeUnit === '') {
        this.$Message.warning('请选择产品期限单位')
      } else if (data.timerStarAndEnd[0] === '' && data.timerStarAndEnd[1] === '') {
        this.$Message.warning('请选择起止日期')
      } else if (data.isRatioLoan === '') {
        this.$Message.warning('请选择是否为比例贷')
      } else if (data.money === '') {
        this.$Message.warning('请输入最高可贷款额度')
      } else if (data.payBackType === '') {
        this.$Message.warning('请输入还款方式')
      } else if (data.duration === '') {
        this.$Message.warning('请输入贷款时长')
      } else if (data.durationUnit === '') {
        this.$Message.warning('请选择贷款时长单位')
      } else {
        if (type === 'add') {
          var params2 = {
            productName: data.name,
            isRatioLoan: data.isRatioLoan === '是' ? true : false,
            maxLoanAmount: Number(data.money),
            maximumLoanRatio: data.scale,
            repayment: data.payBackType,
            duration: Number(data.year),
            timeUnit: Number(data.timeUnit),
            tag: data.tag,
            description: data.explain,
            startTime: data.timerStarAndEnd[0],
            endTime: data.timerStarAndEnd[1],
            isHot: data.isHot === '是' ? true : false,
            isEnable: data.isEnable === '是' ? true : false
          }
          this.addHttp('/sys/product/loan/add', params2, 'personal')
        } else {
          var params3 = {
            id: this.editId,
            version: this.editVersion,
            productName: data.name,
            isRatioLoan: data.isRatioLoan === '是' ? true : false,
            maxLoanAmount: Number(data.money),
            maximumLoanRatio: data.scale,
            repayment: data.payBackType,
            duration: Number(data.year),
            timeUnit: Number(data.timeUnit),
            tag: data.tag,
            description: data.explain,
            startTime: data.timerStarAndEnd[0],
            endTime: data.timerStarAndEnd[1],
            isHot: data.isHot === '是' ? true : false,
            isEnable: data.isEnable === '是' ? true : false
          }
          this.editHttp('/sys/product/loan/edit', params3, 'personal')
        }
      }
    },
    // 校验银行存款
    checkRegular (type) {
      var data = this.formItem
      if (data.name === '') {
        this.$Message.warning('请填写产品名称')
      } else if (data.tag === '') {
        this.$Message.warning('请填写产品标签')
      } else if (data.explain === '') {
        this.$Message.warning('请填写产品说明')
      } else if (data.isHot === '') {
        this.$Message.warning('请选择是否热销')
      } else if (data.isEnable === '') {
        this.$Message.warning('请选择是否启用产品')
      } else if (data.year === '') {
        this.$Message.warning('请填写产品期限')
      } else if (data.timeUnit === '') {
        this.$Message.warning('请选择产品期限单位')
      } else if (data.timerStarAndEnd[0] === '' && data.timerStarAndEnd[1] === '') {
        this.$Message.warning('请选择起止日期')
      } else if (data.minDepositAmount === '') {
        this.$Message.warning('请输入起存金额')
      }else if (data.timeDepositRate === '') {
        this.$Message.warning('请输入定期存款利率')
      } else {
        if (type === 'add') {
          var params4 = {
            productName: data.name,
            timeDepositRate: Number(data.timeDepositRate),
            minDepositAmount: Number(data.minDepositAmount),
            duration: Number(data.year),
            timeUnit: Number(data.timeUnit),
            tag: data.tag,
            description: data.explain,
            startTime: data.timerStarAndEnd[0],
            endTime: data.timerStarAndEnd[1],
            isHot: data.isHot === '是' ? true : false,
            isEnable: data.isEnable === '是' ? true : false
          }
          this.addHttp('/sys/product/deposit/add', params4, 'regular')
        } else {
          var params5 = {
            id: this.editId,
            version: this.editVersion,
            productName: data.name,
            timeDepositRate: Number(data.timeDepositRate),
            minDepositAmount: Number(data.minDepositAmount),
            duration: Number(data.year),
            timeUnit: Number(data.timeUnit),
            tag: data.tag,
            description: data.explain,
            startTime: data.timerStarAndEnd[0],
            endTime: data.timerStarAndEnd[1],
            isHot: data.isHot === '是' ? true : false,
            isEnable: data.isEnable === '是' ? true : false
          }
          this.editHttp('/sys/product/deposit/edit', params5, 'regular')
        }
      }
    },
    // 拼财富校验
    checkFortune (type) {
      var data = this.formItem
      if (data.name === '') {
        this.$Message.warning('请填写产品名称')
      } else if (data.tag === '') {
        this.$Message.warning('请填写产品标签')
      } else if (data.explain === '') {
        this.$Message.warning('请填写产品说明')
      } else if (data.isHot === '') {
        this.$Message.warning('请选择是否热销')
      } else if (data.isEnable === '') {
        this.$Message.warning('请选择是否启用产品')
      } else if (data.year === '') {
        this.$Message.warning('请填写产品期限')
      } else if (data.timeUnit === '') {
        this.$Message.warning('请选择产品期限单位')
      } else if (data.timerStarAndEnd[0] === '' && data.timerStarAndEnd[1] === '') {
        this.$Message.warning('请选择起止日期')
      } else if (data.annualizedIncome === '') {
        this.$Message.warning('请输入预计年化收益')
      } else if (data.minGroupAmount === '') {
        this.$Message.warning('请输入成团金额')
      } else if (data.minInvestmentAmount === '') {
        this.$Message.warning('请输入起投金额')
      } else {
        if (type === 'add') {
          var params6 = {
            productName: data.name,
            annualizedIncome: Number(data.annualizedIncome),
            minInvestmentAmount: Number(data.minInvestmentAmount),
            minGroupAmount: Number(data.minGroupAmount),
            duration: Number(data.year),
            timeUnit: Number(data.timeUnit),
            tag: data.tag,
            description: data.explain,
            startTime: data.timerStarAndEnd[0],
            endTime: data.timerStarAndEnd[1],
            isHot: data.isHot === '是' ? true : false,
            isEnable: data.isEnable === '是' ? true : false
          }
          this.addHttp('/sys/product/wealth/add', params6, 'fortune')
        } else {
          var params7 = {
            id: this.editId,
            version: this.editVersion,
            productName: data.name,
            annualizedIncome: Number(data.annualizedIncome),
            minInvestmentAmount: Number(data.minInvestmentAmount),
            minGroupAmount: Number(data.minGroupAmount),
            duration: Number(data.year),
            timeUnit: Number(data.timeUnit),
            tag: data.tag,
            description: data.explain,
            startTime: data.timerStarAndEnd[0],
            endTime: data.timerStarAndEnd[1],
            isHot: data.isHot === '是' ? true : false,
            isEnable: data.isEnable === '是' ? true : false
          }
          this.editHttp('/sys/product/wealth/edit', params7, 'fortune')
        }
      }
    },
    // 编辑产品接口
    editHttp (url, params, type) {
      this.$axios.post(window.serverIp + url, params, type)
        .then((res) => {
          if (res.code === 0) {
            this.modal = false
            // 根据类型给不同列表赋值
            if (type === 'bank') {
              this.getList('/sys/product/financing/list', this.params, 'bank')
            } else if (type === 'personal') {
              this.getList('/sys/product/loan/list', this.params, 'personal')
            } else if (type === 'regular') {
              this.getList('/sys/product/deposit/list', this.params, 'regular')
            } else if (type === 'fortune') {
              this.getList('/sys/product/wealth/list', this.params, 'fortune')
            }
          } else {
            this.$Message.warning(res.msg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 新增产品接口
    addHttp (url, params, type) {
      this.$axios.post(window.serverIp + url, params, type)
        .then((res) => {
          if (res.code === 0) {
            this.modal = false
            // 根据类型给不同列表赋值
            if (type === 'bank') {
              this.getList('/sys/product/financing/list', this.params, 'bank')
            } else if (type === 'personal') {
              this.getList('/sys/product/loan/list', this.params, 'personal')
            } else if (type === 'regular') {
              this.getList('/sys/product/deposit/list', this.params, 'regular')
            } else if (type === 'fortune') {
              this.getList('/sys/product/wealth/list', this.params, 'fortune')
            }
          } else {
            this.$Message.warning(res.msg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 获取列表
    getList (url, params, type) {
      this.$axios.post(window.serverIp + url, params)
        .then((res) => {
          if (res.code === 0) {
            var data = res.body
            console.log(data)
            this.total = data.total
            // 根据类型给不同列表赋值
            if (type === 'bank') {
              this.bankList = data.list
            } else if (type === 'personal') {
              this.personalList = data.list
            } else if (type === 'regular') {
              this.regularList = data.list
            } else if (type === 'fortune') {
              this.fortuneList = data.list
            }
          } else {
            this.$Message.warning(res.msg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 页码改变
    pageChange (val) {
      console.log('第' + val + '页')
      this.pageNum = val
      var params = {
        pageNum: val,
        pageSize: this.pageSize,
        searchBean: {
          productName: ''
        }
      }
      // 根据tabName去获取对应类型列表
      if (this.tabName === 'bank') {
        this.getList('/sys/product/financing/list', params, 'bank')
      } else if (this.tabName === 'personal') {
        this.getList('/sys/product/loan/list', params, 'personal')
      } else if (this.tabName === 'regular') {
        this.getList('/sys/product/deposit/list', params, 'regular')
      } else if (this.tabName === 'fortune') {
        this.getList('/sys/product/wealth/list', params, 'fortune')
      }
    }
  },
  // 计算属性
  computed: {},
  // 自定义指令
  directives: {}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .work
    width: 100%;
    height: 100%;
    padding: 20px;
    background white;
    border-radius 20px;
    box-sizing border-box;
    overflow auto;
  .mt10
    margin-top:10px;
</style>
