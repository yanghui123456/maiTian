<!--销控表-待分配房屋-->
<template>
  <div class="container">
    <div class="mb20">
      <Button type="info" @click="distribution">分配</Button>
    </div>
    <Table :columns="dataCol" :loading="loading" :data="dataList" border height="480" size="small" @on-select-all="selectAll" @on-selection-change="selectChange"></Table>
    <Page :total="total" :current="pageNum" show-total @on-change="pageChange" class="mt20 tc"/>
    <!--分配给经纪人弹层-->
    <Modal
      v-model="modal"
      width="700px"
      @on-visible-change="checkModal">
      <p slot="header" class="tc">请选择分配的经纪人</p>
      <div>
        <Table :columns="agentCol" :loading="agentLoading" :data="agentList" border height="480" size="small"  @on-select-all="agentSelectAll" @on-selection-change="agentSelectChange"></Table>
      </div>
      <div slot="footer" class="tc">
        <Button type="info" @click="ensure">确定</Button>
        <Button type="info" @click="cancle">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  data () {
    return {
      modal: false,
      agentLoading: true,
      agentCol: [
        {
          type: 'selection',
          align: 'center',
          width: 100
        },
        {
          title: '经纪人名字',
          key: 'realName',
          align: 'center',
          width: 500
        }
      ],
      agentList: [],
      selectAgentId: '', // 选择分配给的经纪人的id,一次只能分配给一个经纪人
      selectAgentList: [], // 选中的经纪人列表
      loading: true, // 表格加载
      total: 0,
      pageNum: 1, // 第几页
      pageSize: 10,
      dataCol: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '所在小区',
          key: 'regionName',
          align: 'center',
          width: 100
        },
        {
          title: '所在楼号',
          key: 'unitNumber',
          align: 'center',
          width: 200
        },
        {
          title: '所在单元',
          key: 'unitNumber',
          align: 'center'
        },
        {
          title: '所在楼层',
          key: 'floorNumber',
          align: 'center'
        },
        {
          title: '房间号',
          key: 'houseNumber',
          align: 'center'
        },
        {
          title: '待售',
          key: 'businessState',
          align: 'center'
        },
        {
          title: '租赁状况',
          key: 'leaseState',
          align: 'center'
        },
        {
          title: '面积',
          key: 'houseArea',
          align: 'center'
        },
        {
          title: '朝向',
          key: 'direction',
          align: 'center'
        },
        {
          title: '居室',
          key: 'hall',
          align: 'center'
        }
      ],
      dataList: [],
      fenPeiList: [], // 分配数组
      javaFenpeiData: []
    }
  },
  created () {
    this.getList(this.pageNum, this.pageSize)
  },
  methods: {
    // 获取待分配房屋列表
    getList (pageNum, pageSize) {
      this.$axios.get(window.serverIp + '/api/house/getHouseByDepartment?pageNum=' + pageNum + '&pageSize=' + pageSize)
        .then(res => {
          if (res.status === 'success') {
            console.log(res.data)
            this.loading = false
            this.total = res.data.total
            this.dataList = res.data.records
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
      this.getList(val, this.pageSize)
    },
    // 获取经纪人列表
    getAgentList () {
      this.$axios.get(window.serverIp + '/api/user/getUsersByGroup?departmentId=' + localStorage.getItem('departmentId'))
        .then(res => {
          if (res.status === 'success') {
            console.log(res.data)
            this.agentLoading = false
            this.agentList = res.data.records
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    selectChange (selection) {
      console.log('change')
      console.log(selection)
      this.fenPeiList = selection
    },
    selectAll (selection) {
      console.log('全选')
      console.log(selection)
      this.fenPeiList = selection
    },
    // 弹出切换显示/隐藏状态
    checkModal (status) {
      if (!status) {
        this.agentLoading = false
        this.agentList = []
        this.selectAgentList = []
        this.selectAgentId = ''
      }
    },
    // 分配
    distribution () {
      if (this.fenPeiList.length === 0) {
        this.$Message.error('请选择数据后再进行分配')
      } else {
        this.agentLoading = false
        this.modal = true
        // 获取经纪人列表
        this.getAgentList()
        // 把选择的房屋数据整理一下
        for (var i = 0; i < this.fenPeiList.length; i++) {
          this.javaFenpeiData.push(this.fenPeiList[i].houseId)
        }
      }
    },
    agentSelectChange (selection) {
      console.log('经纪人change')
      console.log(selection)
      this.selectAgentList = selection
    },
    agentSelectAll (selection) {
      console.log('经纪人全选')
      console.log(selection)
      this.selectAgentList = selection
    },
    ensure () {
      if (this.selectAgentList.length === 0) {
        this.$Message.error('请选择分配的经纪人')
      } else if (this.selectAgentList.length > 1) {
        this.$Message.error('抱歉，一次只能选择一个经纪人进行分配')
      } else {
        // 进行分配
        this.selectAgentId = this.selectAgentList[0].userId
        console.log('经纪人id' + this.selectAgentId)
        console.log('选择的房屋数组' + this.javaFenpeiData)
        this.$axios.post(window.serverIp + '/api/house/setHouseUser', {
          houses: this.javaFenpeiData,
          user_id: this.selectAgentId
        })
          .then(res => {
            if (res.status === 'success') {
              this.$Message.success('分配成功')
              this.modal = false
              this.loading = false
              this.getList(this.pageNum, this.pageSize)
            } else {
              this.$Message.error(res.message)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    cancle () {
      this.modal = false
    }
  },
  // 计算属性
  computed: {},
  // 自定义指令
  directives: {}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .titleText{
    width:60px;
  }
  .ivu-select {
    width:66%;
  }
</style>
