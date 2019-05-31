<template>
  <!--业务管理-->
  <div class="organiz">
    <Tree :data="treeData" :render="renderContent"></Tree>
    <!--弹窗-->
    <!--<Modal-->

      <!--title="请填写组织结构名称"-->
      <!--v-model="modal"-->
      <!--class-name="vertical-center-modal">-->
      <!--<Input v-model="organizName" placeholder="请输入组织结构名称" style="width: 350px" />-->
      <!--<div slot="footer" class="tc">-->
        <!--<Button type="info" @click="adopt" v-if="tabName === 'apply'">通过</Button>-->
        <!--<Button type="error" @click="refuseApply" v-if="tabName === 'apply'">拒绝</Button>-->
        <!--<Button type="info" @click="save" v-if="tabName === 'all'">保存</Button>-->
      <!--</div>-->
    <!--</Modal>-->
    <Modal v-model="modal">
      <p slot="header" style="text-align:center">
        <span>请填写组织结构名称</span>
      </p>
      <Input v-model="organizName" placeholder="请输入组织结构名称" style="width: 350px" />
      <div slot="footer" class="tc">
        <Button type="primary" @click="adopt">确认</Button>
        <Button type="error" @click="cancel" >取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  data () {
    return {
      modal: false,
      pid: null,
      organizName: '',
      treeData: [
        {
          id: '',
          pid: '',
          title: '',
          expand: true,
          render: (h, { root, node, data }) => {
            return h('span', {
              style: {
                display: 'inline-block',
                width: '100%'
              }
            }, [
              h('span', [
                h('Icon', {
                  props: {
                    type: 'ios-folder-outline'
                  },
                  style: {
                    marginRight: '8px'
                  }
                }),
                h('span', data.title)
              ]),
              h('span', {
                style: {
                  display: 'inline-block',
                  float: 'right',
                  marginRight: '32px'
                }
              }, [
                h('Button', {
                  props: Object.assign({}, this.buttonProps, {
                    icon: 'ios-add',
                    type: 'primary'
                  }),
                  style: {
                    width: '64px'
                  },
                  on: {
                    click: () => { this.append(data) }
                  }
                })
              ])
            ])
          },
          children: [
            {
              title: 'child 1-1',
              expand: true,
              children: [
                {
                  title: 'leaf 1-1-1',
                  expand: true
                },
                {
                  title: 'leaf 1-1-2',
                  expand: true
                }
              ]
            },
            {
              title: 'child 1-2',
              expand: true,
              children: [
                {
                  title: 'leaf 1-2-1',
                  expand: true
                },
                {
                  title: 'leaf 1-2-1',
                  expand: true
                }
              ]
            }
          ]
        }
      ],
      buttonProps: {
        type: 'default',
        size: 'small'
      }
    }
  },
  created () {
    this.getTree()
  },
  methods: {
    // 获取组织结构树状图
    getTree () {
      this.$axios.get(window.serverIp + '/sys/organization/tree/list', '')
        .then((res) => {
          if (res.code === 0) {
            var data = res.body
            console.log(data)
            this.treeData[0].children = data[0].children
            this.treeData[0].id = data[0].id
            this.treeData[0].pid = data[0].pid
            this.treeData[0].title = data[0].title
          } else {
            this.$Message.warning(res.msg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    renderContent (h, { root, node, data }) {
      return h('span', {
        style: {
          display: 'inline-block',
          width: '100%'
        }
      }, [
        h('span', [
          h('Icon', {
            props: {
              type: 'ios-paper-outline'
            },
            style: {
              marginRight: '8px'
            }
          }),
          h('span', data.title)
        ]),
        h('span', {
          style: {
            display: 'inline-block',
            float: 'right',
            marginRight: '32px'
          }
        }, [
          h('Button', {
            props: Object.assign({}, this.buttonProps, {
              icon: 'ios-add'
            }),
            style: {
              marginRight: '8px'
            },
            on: {
              click: () => { this.append(root, node, data) }
            }
          }),
          h('Button', {
            props: Object.assign({}, this.buttonProps, {
              icon: 'ios-remove'
            }),
            on: {
              click: () => { this.remove(root, node, data) }
            }
          })
        ])
      ])
    },
    checkModal () {
      this.modal = !this.modal
    },
    // 新增组织机构
    append (root, node, data) {
      console.log(root)
      console.log(node)
      console.log(data)
      // 判断如果是衡水银行做特殊处理,
      if (node === undefined && data === undefined) {
        this.pid = root.id
      } else {
        this.pid = data.id
      }
      this.checkModal()
    },
    // 确认新增
    adopt () {
      if (this.organizName === '') {
        this.$Message.warning('请填写组织结构名称')
      } else {
        var params = {
          pid: this.pid,
          organizationName: this.organizName
        }
        this.$axios.post(window.serverIp + '/sys/organization/add', params)
          .then((res) => {
            if (res.code === 0) {
              this.$Message.success('新增成功')
              this.getTree()
              this.checkModal()
              this.pid = null
              this.organizName = ''
            } else {
              this.$Message.warning(res.msg)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    // 取消
    cancel () {
      this.checkModal()
    },
    // 删除组织机构
    remove (root, node, data) {
      /* root <Array>：树的根节点
      node <Object>：当前节点
      data <Object>：当前节点的数据 */
      const id = data.id
      const version = data.version
      var params = {
        id: id,
        version: version
      }
      this.$axios.post(window.serverIp + '/sys/organization/delete', params)
        .then((res) => {
          if (res.code === 0) {
            this.$Message.success('删除成功')
            this.getTree()
          } else {
            this.$Message.warning(res.msg)
          }
        })
        .catch((err) => {
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
  .organiz
    width: 100%;
    height: 100%;
    padding: 20px;
    background white;
    border-radius 20px;
    box-sizing border-box;
    overflow auto;
</style>
