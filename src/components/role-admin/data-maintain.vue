<!--基础数据维护-->
<template>
  <div class="container">
    <Table :columns="dataCol" :loading="loading" :data="dataList" border height="480" size="small"></Table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loading: true, // 表格加载
      dataCol: [
        {
          type: 'index',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '数据类型',
          key: 'name',
          align: 'center'
        },
        {
          title: '数据有效性',
          key: 'name',
          align: 'center'
        }
      ],
      dataList: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      const data = []
      for (let i = 0; i < 10; i++) {
        data.push({
          name: '模拟数据'
        })
      }
      this.dataList = data
      this.loading = false
    }
  },
  // 计算属性
  computed: {},
  // 自定义指令
  directives: {}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
</style>
