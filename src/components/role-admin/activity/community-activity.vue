<!--管理员--》活动管理--》社群活动-->
<template>
  <div class="container">
    <!--发布社群活动==只对管理员可见-->
    <Button type="info" @click="publicActivity" v-if="role === 1">发布社群活动</Button>
    <p class="pageTitle">正在执行的社群活动</p>
    <!--区域经理可见-->
    <p  v-if="role === 5 || role === 6" class="mb10">本次活动礼品预算上限XX元!</p>
    <!--社区任务进度-->
    <div v-for="(item, index) in ImplementActivityList" :key="index" class="mt20">
      <Steps :current="0">
        <Step title="发起" :content="item.createDate"></Step>
        <Step title="报名期" :content="item.enrollDateStart + '~' + item.enrollDateEnd"></Step>
        <Step title="报名审核期" :content="item.auditDate + '~' + item.auditDateEnd"></Step>
        <Step title="培训期" :content="item.trainDate + '~' + item.trainEnd"></Step>
        <Step title="培训期审核" :content="item.trainAuditStart + '~' + item.trainAuditEnd"></Step>
        <Step title="宣传期" :content="item.publicityDateStart + '~' + item.publicityDateEnd"></Step>
        <Step title="执行期" :content="item.executeDateStart + '~' + item.executeDateEnd"></Step>
        <Step title="活动总结" content="活动总结"></Step>
      </Steps>
      <Row>
        <!--发起-->
        <Col span="3">
          <!--管理员-->
          <Button type="info" v-if="role === 1" @click="adminEdit(item.communityActityId, 'manager')">编辑</Button>
          <!--区域经理-->
          <Button type="info" v-if="role === 5" @click="adminEdit(item.communityActityId, 'area')">查看</Button>
          <!--店长-->
          <Button type="info" v-if="role === 6" @click="shoperDetail">查看活动详情</Button>
        </Col>
        <!--报名期-->
        <Col span="3">
          <!--管理员-->
          <Button type="info" v-if="role === 1" @click="seeBaoming(item.communityActityId)">查看</Button>
          <!--区域经理 当communityEnroll该字段为null表示没有进行过报名-->
          <Button type="info" v-if="role === 5" :disabled="item.communityEnroll !== null" @click="enrollProgress(item.communityActityId, item.enrollDateStart, item.enrollDateEnd, 'bm')">报名</Button>
          <Button type="info" v-if="role === 5" :disabled="item.communityEnroll === null" @click="enrollProgress(item.communityActityId, item.enrollDateStart, item.enrollDateEnd, 'cxbm')">撤销报名</Button>
          <Button type="info" v-if="role === 5" :disabled="item.communityEnroll === null" @click="enrollProgress(item.communityActityId, item.enrollDateStart, item.enrollDateEnd, 'xgbm')">修改报名</Button>
          <!--店长-->
         <Button type="info" v-if="role === 6" disabled>区域经理已报名</Button>
        </Col>
        <!--报名审核期和培训期（管理员和区域经理）-->
        <Col span="6" v-if="role === 1 || role === 5">
          <!--管理员-->
          <Button type="info" v-if="role === 1" @click="seeBaoming(item.communityActityId)">审核</Button>
          <!--区域经理：根据审核是否通过展示不同的按钮-->
          <!--<Button type="info" v-if="role === 5">审核通过</Button>-->
          <Button type="info" v-if="role === 5" @click="seeReason('baoMing')">查看审核不通过原因</Button>
        </Col>
        <!--报名审核期（店长）-->
        <Col span="3" v-if="role === 6">
          <!--店长-->
          <Button type="info" v-if="role === 6" disabled>管理员审核通过</Button>
        </Col>
        <!--培训期（店长）-->
        <Col span="3" v-if="role === 6">
          <!--店长-->
          <Button type="info" v-if="role === 6" @click="shoperXiadan">活动礼品下单</Button>
        </Col>
        <!--培训期审核-->
        <Col span="3">
          <!--管理员-->
          <Button type="info" @click="peixunShenhe"  v-if="role === 1">审核</Button>
          <!--区域经理-->
           <!--<Button type="info" v-if="role === 5">审核通过</Button>-->
        <Button type="info" v-if="role === 5" @click="seeReason('peiXun')">查看审核不通过原因</Button>
          <!--店长=培训审核通过后店长才可以下单-->
          <Button type="info" v-if="role === 6" disabled>管理员审核通过</Button>
        </Col>
        <!--宣传期和执行期(管理员和区域经理)-->
        <Col span="6" v-if="role === 1 || role === 5">
          <Button type="info" v-if="role === 1" @click="xiaDan">下单情况</Button>
        </Col>
        <!--宣传期(店长)-->
        <Col span="3" v-if="role === 6">
        <Button type="info" disabled>已宣传</Button>
        </Col>
        <!--和执行期(店长)-->
        <Col span="3" v-if="role === 6">
        <Button type="info" disabled>确认礼品送达</Button>
        </Col>
        <!--活动总结-->
        <Col span="3" v-if="role === 1">
        <Button type="info" @click="uploadZongjie">上传活动总结</Button>
        <Button type="info" class="mt10" @click="seeZongjie">查看活动总结</Button>
        </Col>
      </Row>
    </div>
    <p class="pageTitle">历史社群活动</p>
    <Table :columns="dataCol" :loading="loading" :data="dataList" border height="480" size="small"></Table>
    <!--<Page :total="total" :current="pageNum" show-total @on-change="pageChange" class="mt20 tc"/>-->
    <!--管理员-发布社群活动-弹层-->
    <Modal
      v-model="modal"
      :title="modalTitle"
      class-name="modal"
      width="900px"
      @on-visible-change="checkModal">
      <p slot="header" class="tc">{{modalTitle}}</p>
      <div class="modalCentenr">
        <!--活动介绍-->
        <p class="modalTitle">活动介绍</p>
        <div class="borderBottom pt0">
          <Row>
            <Col span="24">
            <span class="title">活动名称：</span>
            <Input placeholder="请输入活动名称" style="width:auto" :disabled="activityDis" v-model="modalData.activName"/>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <span class="title">活动主题：</span>
            <Input placeholder="请输入活动主题" style="width: auto" :disabled="activityDis" v-model="modalData.theme"/>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">活动描述：</span>
            <Input placeholder="请输入活动描述" style="width:80%" :disabled="activityDis" v-model="modalData.description" type="textarea" :rows="3"/>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">注意事项：</span>
            <Input placeholder="请输入活动注意事项" :disabled="disabled" style="width:80%" v-model="modalData.matters" type="textarea" :rows="3"/>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">其他费用说明：</span>
            <Input placeholder="请输入其他费用说明" style="width:80%" :disabled="activityDis" v-model="modalData.costExplain" type="textarea" :rows="3"/>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">预估非礼品费用：</span>
            <Input type="number" placeholder="请输入预估非礼品费用" style="width: auto" :disabled="disabled" v-model="modalData.cost"/>
            <span>元</span>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">礼品预算上限：</span>
            <Input type="number" placeholder="请输入礼品预算上线" style="width: auto" :disabled="disabled" v-model="modalData.budgetCap"/>
            <span>元</span>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">适合的社区特点：</span>
            <RadioGroup v-model="modalData.trait">
              <Radio label="亲子" :disabled="activityDis">
                <span>亲子</span>
              </Radio>
              <Radio label="健身" :disabled="activityDis">
                <span>健身</span>
              </Radio>
              <Radio label="运动达人" :disabled="activityDis">
                <span>运动达人</span>
              </Radio>
            </RadioGroup>
            </Col>
          </Row>
        </div>
        <!--活动时间-->
        <p class="modalTitle mt20">活动时间</p>
        <div class="borderBottom pt0">
          <Row>
            <Col span="24">
            <span class="title">发起时间：</span>
            <Input placeholder="请输入发起时间" style="width: auto" :disabled="true" v-model="modalData.launchTime"/>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">报名起止时间：</span>
            <DatePicker :editable="false" :disabled="disabled" type="datetimerange" placeholder="请选择报名起止时间" v-model="modalData.enrollTime" @on-change="enrollChange" style="width: 250px"></DatePicker>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title fl">上传海报：</span>
            <Upload
              ref="upload"
              :show-upload-list="false"
              :on-success="uopload1"
              :format="['jpg','jpeg','png']"
              :max-size="1000000000"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :action="upLoadUrl"
              style="display: inline-block;width:58px;cursor: pointer;float: left;"
              v-if="!disabled">
              <div style="width: 58px;height:58px;line-height: 58px;border:1px solid #eee;" class="tc">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
            <img :src= "imgHttp + modalData.img1" alt="图片" class="oneUploadImg" v-if="modalData.img1 !== ''">
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">文案：</span>
            <Input placeholder="请输入文案" :disabled="disabled"  style="width:80%" v-model="modalData.copywrit1" type="textarea" :rows="4"/>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">报名审核起止时间：</span>
            <DatePicker :editable="false" :disabled="disabled" v-model="modalData.enrollShenHeTime" @on-change="enrollShenHeChange" type="datetimerange" placeholder="请选择报名审核起止时间" style="width: 300px"></DatePicker>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">培训起止时间：</span>
            <DatePicker :editable="false" :disabled="disabled" v-model="modalData.trainTime" @on-change="trainChange" type="datetimerange" placeholder="请选择培训起止时间" style="width: 300px"></DatePicker>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title fl">上传海报：</span>
            <Upload
              v-if="!disabled"
              ref="upload"
              :show-upload-list="false"
              :on-success="uopload2"
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
            <img :src="imgHttp + modalData.img2" alt="图片" class="oneUploadImg" v-if="modalData.img2 !== ''">
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">文案：</span>
            <Input placeholder="请输入文案" :disabled="disabled" style="width:80%" v-model="modalData.copywrit2" type="textarea" :rows="4"/>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">培训审核起止时间：</span>
            <DatePicker :editable="false" :disabled="disabled" v-model="modalData.trainShenHeTime" @on-change="trainShenHeChange" type="datetimerange" placeholder="请选择培训审核起止时间" style="width: 300px"></DatePicker>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">宣传起止时间：</span>
            <DatePicker :editable="false" :disabled="disabled" v-model="modalData.xuanChuanTime" @on-change="xuanChuanChange" type="datetimerange" placeholder="请选择宣传起止时间" style="width: 300px"></DatePicker>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title fl">上传海报：</span>
            <Upload
              v-if="!disabled"
              ref="upload"
              :show-upload-list="false"
              :on-success="uopload3"
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
            <img :src="imgHttp + modalData.img3" alt="图片" class="oneUploadImg" v-if="modalData.img3 !== ''">
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">文案：</span>
            <Input placeholder="请输入文案" :disabled="disabled" style="width:80%" v-model="modalData.copywrit3" type="textarea" :rows="4"/>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">执行起止时间：</span>
            <DatePicker :editable="false" :disabled="disabled" v-model="modalData.implementTime" @on-change="implementChange" type="datetimerange" placeholder="请选择执行起止时间" style="width: 300px"></DatePicker>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title fl">上传海报：</span>
            <Upload
              v-if="!disabled"
              ref="upload"
              :show-upload-list="false"
              :on-success="uopload4"
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
            <img :src="imgHttp + modalData.img4" alt="图片" class="oneUploadImg" v-if="modalData.img4 !== ''">
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">文案：</span>
            <Input placeholder="请输入文案" :disabled="disabled" style="width:80%" v-model="modalData.copywrit4" type="textarea" :rows="4"/>
            </Col>
          </Row>
        </div>
        <!--礼品介绍-->
        <p class="modalTitle mt10">礼品介绍</p>
        <div class="borderBottom" v-for="(item, index) in modalData.giftList" :key="index">
          <div style="overflow: hidden">
            <Button type="error" size="small" style="float: right" @click="deletItem(item.id)" v-if="isAdd === true">删除该项</Button>
          </div>
          <Row>
            <Col span="24">
            <span class="title">礼品名称：</span>
            <Input placeholder="请输入礼品名称" style="width: auto" :disabled="disabled" v-model="item.giftName"/>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">礼品描述：</span>
            <Input placeholder="请输入礼品描述" style="width: auto" :disabled="disabled" v-model="item.giftDetail"/>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">礼品价格：</span>
            <Input placeholder="请输入礼品价格" style="width: auto" :disabled="disabled" v-model="item.giftPrice" type="number"/>
            </Col>
          </Row>
          <Row>
            <Col span="9">
            <span class="title">礼品数量可选范围：</span>
            <Input type="number" placeholder="范围" style="width: 80px" :disabled="disabled" v-model="item.giftLeast"/>
            <span>至</span>
            <Input type="number" placeholder="范围" style="width: 80px" :disabled="disabled" v-model="item.giftMost"/>
            </Col>
            <Col span="8">
            <span class="title">每步进一次阶梯值：</span>
            <Input type="number" placeholder="阶梯值" style="width: 80px" :disabled="disabled" v-model="item.step"/>
            </Col>
            <Col span="7">
            <span class="title">合理礼品数量：</span>
            <Input type="number" placeholder="礼品数量" style="width: 80px" :disabled="disabled" v-model="item.reasonable"/>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title fl">礼品图片：</span>
            <div style="width:60px;height:60px;float: left" @click="clickUpload(item)" v-if="!disabled">
              <Upload
                ref="upload"
                :show-upload-list="false"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :before-upload="beforUpload"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :action="upLoadUrl"
                style="display: inline-block;width:58px;cursor: pointer">
                <div style="width: 58px;height:58px;line-height: 58px;border:1px solid #eee;" class="tc">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
            </div>
            <!--每一组可以上传你多张-->
            <div v-for="(items, index) in item.imgList" :key="index" class="oneUploadImg fl">
              <img :src="items.src" alt="图片" style="width:100%;height:100%;border-radius: 5px;" v-if="item.imgList.length > 0">
            </div>
            <!--<div class="oneUploadImg fl">-->
              <!--<img :src="item.imgList.giftTop" alt="图片" style="width:100%;height:100%;border-radius: 5px;" v-if="item.imgList.giftTop !== ''">-->
              <!--<img :src="item.imgList.giftTwo" alt="图片" style="width:100%;height:100%;border-radius: 5px;" v-if="item.imgList.giftTwo !== ''">-->
              <!--<img :src="item.imgList.giftThree" alt="图片" style="width:100%;height:100%;border-radius: 5px;" v-if="item.imgList.giftThree !== ''">-->
              <!--<img :src="item.imgList.giftFour" alt="图片" style="width:100%;height:100%;border-radius: 5px;" v-if="item.imgList.giftFour !== ''">-->
            <!--</div>-->
            </Col>
          </Row>
        </div>
        <div class="borderBottom">
          <!--管理员-编辑、表格查看详情时此按钮不可见,只有新增社群活动可懂-->
          <Button type="info" class="mt10" @click="addGift" v-if="isAdd === true">继续添加礼品</Button>
        </div>
        <div class="borderBottom">
          <Row>
            <Col span="12">
            <span class="title">咨询电话：</span>
            <Input placeholder="请输入咨询电话" style="width: auto" :disabled="disabled" v-model="modalData.tel"/>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">礼品最晚送达时间：</span>
            <DatePicker :editable="false" v-model="modalData.serviceTime" @on-change="serviceChange" :disabled="disabled" type="datetime" placeholder="请选择礼品最晚送达时间" style="width: 200px"></DatePicker>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <span class="title">礼品最晚签收时间：</span>
            <DatePicker :editable="false" v-model="modalData.signTime" @on-change="signChange" :disabled="disabled" type="datetime" placeholder="请选择礼品最晚签收时间" style="width: 200px"></DatePicker>
            </Col>
          </Row>
        </div>
      </div>
      <div slot="footer" class="tc">
        <!--管理员-->
        <div v-if="role === 1 && isAdd !== ''">
          <Button type="info" @click="save">保存</Button>
          <Button type="info" @click="cancel">取消</Button>
        </div>
        <!--区域经理:进度条查看有底部去报名；历史活动查看详情无底部报名-->
        <div v-if="role === 5 && seeDetailType === 1">
          <!--<Button type="info" @click="enroll">去报名</Button>-->
          <Button type="info" @click="modal = false">取消</Button>
        </div>
        <!--店长-->
        <div v-if="role === 6 && seeDetailType === 1">
          <Button type="info" @click="placeOrder">去下单</Button>
          <Button type="info" @click="placeCanlel">取消</Button>
        </div>
      </div>
    </Modal>
    <!--区域经理-报名弹层-->
    <Modal
      v-model="enrollModal"
      class-name="modal"
      width="900px"
      @on-visible-change="enrollModalChange">
      <p slot="header" class="tc">社区活动报名</p>
      <div class="modalCentenr">
        <!--区域名称-->
        <div class="borderBottom">
          <p class="modalTitle">区域名称</p>
          <Row>
            <Col span="12">
            <span class="title">城市：</span>
            <Input placeholder="请输入城市" style="width: auto" :disabled="disabled" v-model="enrollData.city"/>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <span class="title">片区：</span>
            <Input placeholder="请输入片区" style="width: auto" :disabled="disabled" v-model="enrollData.area"/>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <span class="title">大区：</span>
            <Input placeholder="请输入大区" style="width: auto" :disabled="disabled" v-model="enrollData.largeArea"/>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <span class="title">区域：</span>
            <!--先模拟使用input，并且把四个字段值进行固定，后期再改-->
            <Input placeholder="请输入大区" style="width: auto" :disabled="disabled" v-model="enrollData.region"/>
            <!--<Select style="width:auto;" v-model="enrollData.region" @on-change="regionPickerChange" :placement="posit" placeholder="请选择区域">-->
              <!--<Option v-for="item in regionList" :value="item.departmentId" :key="item.departmentId">{{ item.departmentName }}</Option>-->
            <!--</Select>-->
            </Col>
          </Row>
        </div>
        <!--选择小区-->
        <div class="borderBottom">
          <p class="modalTitle">
            选择小区
            <Checkbox
            :indeterminate="indeterminate"
            :value="checkAll"
            @click.prevent.native="handleCheckAll"
            style="margin-left:100px;font-weight: normal">全选</Checkbox>
          </p>
          <Row>
            <Col span="24">
            <CheckboxGroup v-model="enrollData.social" @on-change="checkAllGroupChange">
              <Checkbox :label="item.regionId" v-for="item in socialList" :key="item.regionId">
                <span>{{item.regionName}}</span>
              </Checkbox>
            </CheckboxGroup>
            {{enrollData.social}}
            </Col>
          </Row>
        </div>
      </div>
      <div slot="footer" class="tc">
        <Button type="info" @click="areaEnroll" :disabled="cnaEnroll !== 'bm'">报名</Button>
        <Button type="info" @click="revoke" :disabled="cnaEnroll !== 'cxbm'">撤销报名</Button>
        <Button type="info" @click="editEnroll" :disabled="cnaEnroll !== 'xgbm'">修改报名</Button>
        <Button type="info" @click="enrollModal = false">取消</Button>
      </div>
    </Modal>
    <!--管理员-报名+ 审核弹层-->
    <Modal
      v-model="shAndbmModal"
      class-name="modal"
      width="900px">
      <p slot="header" class="tc">{{shAndbmTitle}}</p>
      <div class="modalCentenr">
        <!--报名审核-->
        <Button type="info">筛选</Button>
        <Button type="info">导出</Button>
        <Table class="mt10" :columns="examineCol" :loading="examineLoading" :data="examineList" border height="420" size="small"></Table>
      </div>
      <div slot="footer" class="tc">
        <!--<Page :total="examineTotal" :current="examinePageNum" show-total @on-change="examinePageChange" class="mt20 tc"/>-->
      </div>
    </Modal>
    <!--管理员-查看报名详情弹层-->
    <Modal
      v-model="signInModal"
      class-name="modal"
      width="900px">
      <p slot="header" class="tc">{{signInTitle}}</p>
      <div class="modalCentenr">
        <div class="borderBottom">
          <p class="modalTitle">区域名称</p>
          <Row>
            <Col span="12">
            <span class="title">大区：</span>
            <Input placeholder="请输入大区" style="width: auto" :disabled="true" v-model="signModalData.bigArea"/>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <span class="title">区域：</span>
            <Input placeholder="请输入区域" style="width: auto" :disabled="true" v-model="signModalData.region"/>
            </Col>
          </Row>
          <Row v-if="signInShowTwo === true">
            <Col span="12">
            <span class="title">门店：</span>
            <Input placeholder="请输入门店" style="width: auto" :disabled="true" v-model="signModalData.mendian"/>
            </Col>
          </Row>
          <Row v-if="signInShowTwo === true">
            <Col span="12">
            <span class="title">店组：</span>
            <Input placeholder="请输入店组" style="width: auto" :disabled="true" v-model="signModalData.dianzu"/>
            </Col>
          </Row>
          <p class="modalTitle" v-if="signInShowTwo !== true">报名小区</p>
          <CheckboxGroup v-model="signModalData.social" v-if="signInShowTwo !== true">
            <Checkbox label="0">
              <span>第一</span>
            </Checkbox>
            <Checkbox label="1">
              <span>第二</span>
            </Checkbox>
            <Checkbox label="2">
              <span>第三</span>
            </Checkbox>
          </CheckboxGroup>
        </div>
        <div class="borderBottom">
          <p class="modalTitle">定制礼品</p>
          <div class="paddLR">
            <Row class="borderBottom" v-for="(item, index) in signModalData.giftList" :key="index">
              <Col span="2">
              <img :src="item.src" alt="" style="display:inline-block;width:60px;height:60px;background: red;">
              </Col>
              <Col span="14">
              <p class="h20">{{item.name}}</p>
              <p class="h20">{{item.describe}}</p>
              <p class="h20">
                <span style="margin-right:100px;">￥{{item.money}}</span>
                <span>
                  <span style="display: inline-block"> {{item.startNum}}&lt;= </span>
                  <Select style="width:80px;margin-top:-6px" v-model="signModalData.giftList.numList" @on-change="haha" placeholder="数量">
                    <Option v-for="item in signModalData.giftList.numList" :value="item.code" :key="item.code">{{ item.name }}</Option>
                  </Select>
                  <span style="display: inline-block"> &lt;={{item.endNum}} </span>
                </span>
              </p>
              </Col>
            </Row>
            <p class="payMoney mt10">
              <span class="cRed f10">(含预估非礼品费用)</span>
              <span class="cRed fb f24">¥{{signModalData.total}}</span>
              <span class="fb f17">总价:</span>
            </p>
          </div>
        </div>
        <div class="borderBottom" v-if="showOtherMoney">
          <p class="modalTitle">其他费用</p>
          <Row>
            <Col span="12">
            <span class="title">其他费用：</span>
            <Input placeholder="请输入门店" style="width: auto" :disabled="true" v-model="signModalData.otherMoney"/>
            </Col>
          </Row>
        </div>
        <div class="borderBottom">
          <p class="modalTitle">快递信息</p>
          <Row>
            <Col span="12">
            <span class="title">快递地址：</span>
            <Input placeholder="请输入快递地址" style="width: auto" :disabled="true" v-model="signModalData.address"/>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <span class="title">接收人：</span>
            <Input placeholder="请输入接收人" style="width: auto" :disabled="true" v-model="signModalData.person"/>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <span class="title">联系电话：</span>
            <Input placeholder="请输入联系电话" style="width: auto" :disabled="true" v-model="signModalData.tel"/>
            </Col>
          </Row>
          <Row v-if="showOtherMoney">
            <Col span="24">
              <span class="title">礼品最晚签收时间：</span>
              <DatePicker type="date" :disabled="true" placeholder="礼品最晚签收时间" style="width: auto" v-model="signModalData.signTime"></DatePicker>
              <TimePicker :editable="true" :disabled="true" v-model="signModalData.signTimeDetail" format="HH点mm分ss秒" placeholder="时分秒" style="width: 168px"></TimePicker>
            </Col>
          </Row>
        </div>
      </div>
      <div slot="footer" class="tc">
        <!--管理员-->
        <div v-if="role === 1 && signInShowTwo !== true">
          <Button type="info" @click="examineYes">审核通过</Button>
          <Button type="info" @click="examineNos">审核不通过</Button>
        </div>
        <!--店长-->
        <div v-if="role === 6">
          <Button type="info" @click="shoperYes">提交</Button>
          <Button type="info" @click="shoperNo">取消</Button>
        </div>
      </div>
    </Modal>
    <!--管理员-审核不通过弹窗-->
    <Modal
      v-model="auditFailedModal"
      title="审核未通过">
      <p slot="header" class="tc">审核未通过</p>
      <div class="modalCentenr">
        <Row>
          <Col span="24">
          <span class="title">审核未通过原因：</span>
          <Input placeholder="请输入审核不通过原因" style="width:70%" :disabled="auditDisabled" v-model="failedReason" type="textarea" :rows="4"/>
          </Col>
        </Row>
      </div>
      <div slot="footer" class="tc">
        <!--管理员角色可见;区域经理角色不可见-->
        <div v-if="role === 1">
          <Button type="info" @click="ensureFail">确定</Button>
          <Button type="info" @click="auditFailedModal= false">取消</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  data () {
    return {
      imgHttp: '',
      upLoadUrl: '',
      manageHistoryActivityUrl: '/api/community/getAllCommunity', // 管理员查询历史活动列表
      manageImplementActivityUrl: '/api/community/getCommunityOfUnSummary', // 管理员正在执行的活动
      ImplementActivityList: [], // 正在执行的社区活动
      role: '', // 角色 1:管理员；2：城市总经理；3：片区总经理；4：大区总监；5：区域经理；6：店长；7：经纪人
      // 列表
      loading: true, // 表格加载
      // total: 0,
      // pageNum: 1, // 第几页
      pageSize: 10,
      dataCol: [], // 表头
      dataList: [],
      managerCol: [
        {
          type: 'index',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '费用总数',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '活动名称',
          key: 'name',
          align: 'center',
          width: 150
        },
        {
          title: '活动主题',
          key: 'theme',
          align: 'center',
          width: 100
        },
        {
          title: '活动描述',
          key: 'activityDetail',
          align: 'center',
          width: 150
        },
        {
          title: '适合人群/适合的社区特点',
          key: 'characteristic',
          align: 'center',
          width: 180
        },
        {
          title: '执行时间',
          key: 'executeDateStart',
          align: 'center',
          width: 150
        },
        {
          title: '礼品最晚送达时间',
          key: 'lastReceiveTime',
          align: 'center',
          width: 150
        },
        {
          title: '确认礼品签收时间',
          key: 'trainDate',
          align: 'center',
          width: 150
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
                  marginTop: '5px'
                },
                on: {
                  click: () => {
                    this.tableDetail(params.row)
                  }
                }
              }, '查看详情'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginTop: '5px',
                  marginBottom: '5px'
                },
                on: {
                  click: () => {
                    this.tableBaoming(params.row)
                  }
                }
              }, '查看报名+培训情况'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginBottom: '5px'
                },
                on: {
                  click: () => {
                    this.$Message.error('下载活动总结')
                  }
                }
              }, '下载活动总结')
            ])
          }
        }
      ], // 管理员表头
      areaManagerCol: [
        {
          type: 'index',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '报名审核情况',
          key: 'name',
          align: 'center',
          width: 200
        },
        {
          title: '报名未通过原因',
          key: 'name',
          align: 'center',
          width: 200
        },
        {
          title: '培训审核情况',
          align: 'center',
          width: 200
        },
        {
          title: '培训审核未通过原因',
          key: 'gender',
          align: 'center',
          width: 200
        },
        {
          title: '费用总计',
          key: 'gender',
          align: 'center',
          width: 200
        },
        {
          title: '活动名称',
          key: 'gender',
          align: 'center',
          width: 200
        },
        {
          title: '活动主题',
          key: 'gender',
          align: 'center',
          width: 200
        },
        {
          title: '活动描述',
          key: 'gender',
          align: 'center',
          width: 200
        },
        {
          title: '适合人群',
          key: 'gender',
          align: 'center'
        },
        {
          title: '报名时间',
          key: 'gender',
          align: 'center',
          width: 200
        },
        {
          title: '审核时间',
          key: 'gender',
          align: 'center',
          width: 200
        },
        {
          title: '培训时间',
          key: 'gender',
          align: 'center',
          width: 200
        },
        {
          title: '宣传时间',
          key: 'gender',
          align: 'center',
          width: 200
        },
        {
          title: '执行时间',
          key: 'gender',
          align: 'center',
          width: 200
        },
        {
          title: '礼品名称',
          key: 'gender',
          align: 'center',
          width: 200
        },
        {
          title: '礼品描述',
          key: 'gender',
          align: 'center',
          width: 200
        },
        {
          title: '咨询电话',
          key: 'gender',
          align: 'center',
          width: 200
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
                  marginTop: '5px'
                },
                on: {
                  click: () => {
                    this.modalStatus(true, '社群活动详情', true)
                    this.activityDis = true
                    this.seeDetailType = 2
                  }
                }
              }, '查看详情')
            ])
          }
        }
      ], // 区域经理表头 、 店长表头
      shoperCol: [],
      // ===========================管理员-发布社群活动
      moreUploadId: '', // 添加礼品项中点击上传图片项的id
      isAdd: '', // true-新增， false-编辑; ''-为空的时候列表中的查看，没有底部保存取消按钮
      modal: false,
      modalTitle: '',
      disabled: false, // 文本框是否禁用
      activityDis: false, // 管理员:发布社群活动/区域经理：查看活动-活动相关禁用
      changeserviceTime: false, // 礼品最晚送达和礼品最晚签收时间是否change
      changeSignTime: false,
      managerEditId: '', // 管理员编辑社群活动的id
      modalData: {
        theme: '', // 活动主题
        description: '', // 活动描述
        activName: '', // 活动名称
        costExplain: '', // 其他费用说明
        cost: '', // 预估非礼品费用
        budgetCap: '', // 礼品预算上限
        trait: '', // 适合的社区特点
        launchTime: '', // 发起时间
        enrollTime: '', // 报名起止时间==绑值
        enrollTimeList: [], // 报名起止时间==数组
        img1: '', // 上传海报第一个
        copywrit1: '', // 文案第一个
        enrollShenHeTime: '', // 报名审核起止时间时间==绑值
        enrollShenHeTimeList: [], // 报名审核起止时间==数组
        trainTime: '', // 培训起止时间==绑值
        trainTimeList: [], // 培训起止时间==数组
        trainShenHeTime: '', // 培训审核起止时间==绑值
        trainShenHeTimeList: [], // 培训审核起止时间==数组
        img2: '', // 上传海报第二个
        copywrit2: '', // 文案第二个
        xuanChuanTime: '', // 宣传起止时间==绑值
        xuanChuanTimeList: [], // 宣传时间==数组
        img3: '', // 上传海报第三个
        copywrit3: '', // 文案第三个
        implementTime: '', // 执行起止时间==绑值
        implementTimeList: [], // 执行起止时间==数组
        img4: '', // 上传海报第四个
        copywrit4: '', // 文案第四个
        tel: '', // 咨询电话
        serviceTime: '', // 礼品最晚送达时间==绑值
        signTime: '', // 礼品最晚签收时间==绑值
        matters: '', // 活动注意事项
        giftList: [
          {
            id: '',
            giftName: '', // 礼品名称
            giftDetail: '', // 礼品描述
            giftPrice: '', // 礼品价格
            giftLeast: '', // 礼品最少数
            giftMost: '', // 礼品最大数
            step: '', // 礼品增量  阶梯值
            reasonable: '', // 礼品合理数
            giftTop: '', // 第一张图片 /uploads/20190826125408486.jpg
            giftTwo: '', // 第一张图片
            giftThree: '', // 第一张图片
            giftFour: '', // 第一张图片
            imgList: []
          }
        ]
      },
      // =============================区域经理-报名
      enrollModal: false,
      seeDetailType: '', // 1-进度条查看；2-历史活动查看详情(区域经理和店长角色共同使用)
      enrollActivityId: '', // 活动id
      cnaEnroll: null, // 能否进行报名字段  bm:可点击报名，cxbm:可点击撤销报名， xgbm:可点击修改报名
      enrollData: { // 报名弹层数据
        city: '北京', // 城市公司
        area: '片区A', // 片区
        largeArea: '大区A', // 大区
        region: '望京', // 区域
        social: []
      },
      posit: 'bottom', // 下拉框定位的位置
      regionList: [], // 报名弹窗-区域列表
      socialList: [], // 报名、撤销报名小区列表
      indeterminate: true,
      checkAll: false,
      // ===================================管理员-报名+ 审核弹窗
      shAndbmModal: false,
      shAndbmTitle: '',
      shAndbmType: '', // 1-报名弹窗；2-审核弹窗
      examineLoading: true,
      /* examineTotal: 0,
      examinePageNum: 1, */
      examineCol: [
        {
          type: 'index',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '店长',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '所属门店',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '所属区域',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '社区名称',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '礼品名称',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '礼品数量',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '礼品价格',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '礼品总价',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '其他预估花费',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '预估总价',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '快递地址',
          key: 'name',
          align: 'center',
          width: 200
        },
        {
          title: '接收人',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '联系电话',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '所属大区',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '所属片区',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '所属城市',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '培训审核不通过原因',
          key: 'name',
          align: 'center',
          width: 200
        },
        {
          title: '培训审核/状态',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '撤销原因',
          key: 'name',
          align: 'center',
          width: 200
        },
        {
          title: '报名审核不通过原因',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '报名审核/状态',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '详情',
          key: 'gender',
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
                    this.adminShenHeDetail(params.row)
                  }
                }
              }, '查看详情')
            ])
          }
        },
        {
          title: '操作',
          key: 'gender',
          align: 'center',
          width: 190,
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
                    this.$Message.error('审核通过')
                  }
                }
              }, '审核通过'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.$Message.error('审核不不不通过')
                  }
                }
              }, '审核不通过')
            ])
          }
        }
      ],
      examineList: [],
      bmAndshCol: [
        {
          type: 'index',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '报名状态',
          key: 'enrollState',
          align: 'center',
          width: 100,
          render: (h, params) => {
            var status = params.row.enrollState
            if (status === 0) {
              return h('div', [
                h('span', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                  }
                }, '未审核')
              ])
            } else if (status === 1) {
              return h('div', [
                h('span', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                  }
                }, '审核通过')
              ])
            } else if (status === 2) {
              return h('div', [
                h('span', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                  }
                }, '审核未通过')
              ])
            } else if (status === 3) {
              return h('div', [
                h('span', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                  }
                }, '取消报名')
              ])
            }
          }
        },
        {
          title: '报名不通过原因',
          key: 'enrollFail',
          align: 'center',
          width: 130
        },
        {
          title: '撤销原因',
          key: 'cancelReason',
          align: 'center',
          width: 100
        },
        {
          title: '培训审核状态',
          key: 'trainState',
          align: 'center',
          width: 120,
          render: (h, params) => {
            var status = params.row.trainState
            if (status === 0) {
              return h('div', [
                h('span', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                  }
                }, '未审核')
              ])
            } else if (status === 1) {
              return h('div', [
                h('span', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                  }
                }, '审核通过')
              ])
            } else if (status === 2) {
              return h('div', [
                h('span', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                  }
                }, '审核未通过')
              ])
            }
          }
        },
        {
          title: '培训审核不通过原因',
          key: 'trainFail',
          align: 'center',
          width: 150
        },
        {
          title: '区域',
          key: 'tradingArea',
          align: 'center',
          width: 100
        },
        {
          title: '报名小区',
          key: 'regions',
          align: 'center',
          width: 100
        },
        {
          title: '操作',
          key: 'communityActityId',
          align: 'center',
          width: 190,
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
                    this.baoMing()
                  }
                }
              }, '审核通过'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.examineNo()
                  }
                }
              }, '审核不通过')
            ])
          }
        }
      ], // 报名期 + 审核期弹窗 表头
      xiadanCol: [
        {
          type: 'index',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '区域',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '门店',
          key: 'name',
          align: 'center',
          width: 130
        },
        {
          title: '店组',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '礼品名称',
          key: 'name',
          align: 'center',
          width: 120
        },
        {
          title: '礼品数量',
          key: 'name',
          align: 'center',
          width: 150
        },
        {
          title: '礼品价格',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '礼品总价',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '其他预估花费',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '预估总价',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '快递地址',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '接收人',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '联系电话',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '操作',
          key: 'gender',
          align: 'center',
          width: 190,
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
                    this.xiadanDetail(params.row)
                  }
                }
              }, '查看详情')
            ])
          }
        }
      ], // 下单表头
      // ==========================================管理员-审核弹窗-查看详情
      showOtherMoney: false, // 是否展示其他费用
      signInModal: false,
      signInTitle: '', // 标题
      signInShowTwo: '', // 是否展示门店和店组 、 报名小区和底部按钮
      auditDisabled: false, // 审核不通过文本框是否禁用
      signModalData: {
        bigArea: '', // 大区
        region: '', // 区域
        mendian: '', // 门店
        dianzu: '', // 店组
        social: [], // 报名小区
        address: '', // 快递地址
        person: '', // 接收人
        tel: '', // 联系电话
        total: '1500', // 总价
        otherMoney: '100', // ===其他费用 ======（店长角色-活动下单可见）
        signTime: '', // =========礼品最晚签收时间（店长角色-活动下单可见）
        signTimeDetail: '', // ==礼品最晚签收时间 ，时分 （店长角色-活动下单可见）
        giftList: [ // 定制礼品
          {
            name: '礼品名称', // 礼品名称
            giftDetail: '礼品描述', // 礼品描述
            money: '10', // 礼品金额
            giftLeast: '10', // 起始数量
            giftMost: '10', // 最大数量
            numList: [ // 中间的下拉
              {
                code: 1,
                name: 5
              }
            ]
          }
        ]
      },
      // 管理员-审核不通过弹窗
      auditFailedModal: false,
      failedReason: '' // 审核不通过原因
    }
  },
  created () {
    this.upLoadUrl = window.serverIp + '/fileupload' // 上传图片地址
    this.imgHttp = window.serverIp
    // 获取-角色
    var roles = localStorage.getItem('role')
    this.role = Number(roles)
    // 根据角色-设置表头、获取历史活动列表
    if (this.role === 1) {
      // 管理员
      this.dataCol = this.managerCol
      // 历史社群活动
      this.getHistoryActivitieTable(this.manageHistoryActivityUrl)
      // 正在执行的活动
      this.getImplementActivit(this.manageImplementActivityUrl)
    } else if (this.role === 5) {
      // 区域经理
      this.dataCol = this.areaManagerCol
      // 历史社群活动
      this.getHistoryActivitieTable(this.manageHistoryActivityUrl)
      // 正在执行的活动
      this.getImplementActivit(this.manageImplementActivityUrl)
    } else if (this.role === 6) {
      // 店长
      this.dataCol = this.areaManagerCol
      // 是否是待办消息过来： true-与查看活动详情方法一样
      var showXdModal = this.$route.query.showXdModal
      if (showXdModal) {
        this.shoperDetail()
      }
    }
  },
  methods: {
    // 弹窗:发布社区活动
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
    // 弹窗==报名 + 审核
    bmAndShStatus (showModal, title, type) {
      /*
       * showModal:是否显示弹窗
       * title：弹窗的title
       * type：1-报名弹窗；2-审核弹窗；3-下单情况； 4-外层table中查看报名 + 培训情况
       * */
      this.shAndbmModal = showModal
      this.shAndbmTitle = title
      this.shAndbmType = type
    },
    // 弹窗:下单-查看详情
    xiadanStatus (showModal, title, showTwo) {
      /*
       * showModal:是否显示弹窗
       * title: 弹窗的title
       * disabled: 是否禁用
       * showTwo: 是否展示门店和店组 、 并且不展示报名小区和底部按钮==两者展示相反，一个展示，一个不展示
       * */
      this.signInModal = showModal
      this.signInTitle = title
      this.signInShowTwo = showTwo
    },
    // 弹窗:当显示隐藏状态变化时
    checkModal (status) {
      // true=显示；false=隐藏
      if (status === false) {
        this.changeserviceTime = false
        this.changeSignTime = false
        this.modalData = {
          theme: '', // 活动主题
          description: '', // 活动描述
          activName: '', // 活动名称
          costExplain: '', // 其他费用说明
          cost: '', // 预估非礼品费用
          budgetCap: '', // 礼品预算上限
          trait: '', // 适合的社区特点
          launchTime: '', // 发起时间
          enrollTime: '', // 报名时间
          enrollTimeList: [], // 报名起止时间==数组
          img1: '', // 上传海报第一个
          copywrit1: '', // 文案第一个
          enrollShenHeTime: '', // 报名审核截止时间
          enrollShenHeTimeList: [], // 报名审核起止时间==数组
          trainTime: '', // 培训时间
          trainTimeList: [], // 培训起止时间==数组
          img2: '', // 上传海报第二个
          copywrit2: '', // 文案第二个
          xuanChuanTime: '', // 宣传时间
          xuanChuanTimeList: [], // 宣传时间==数组
          trainShenHeTime: '', // 培训审核起止时间==绑值
          trainShenHeTimeList: [], // 培训审核起止时间==数组
          img3: '', // 上传海报第三个
          copywrit3: '', // 文案第三个
          implementTime: '', // 执行时间
          implementTimeList: [], // 执行起止时间==数组
          img4: '', // 上传海报第四个
          copywrit4: '', // 文案第四个
          tel: '', // 咨询电话
          serviceTime: '', // 礼品最晚送达时间
          signTime: '', // 礼品最晚签收时间
          matters: '', // 活动注意事项
          // 礼品介绍
          giftList: []
        }
      }
    },
    // 弹窗：报名弹窗关闭
    enrollModalChange (status) {
      if (!status) {
        this.enrollData = {
          city: '北京', // 城市公司
          area: '片区A', // 片区
          largeArea: '大区A', // 大区
          region: '望京', // 区域
          social: []
        }
        this.regionList = [] // 报名弹窗-区域列表
        this.socialList = [] // 报名、撤销报名小区列表
      } else {
        this.disabled = true
      }
    },
    // 时间格式化
    format (fmt, date) {
      var o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        for (var k in o) {
          if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
          }
        }
        return fmt
      }
    },
    // table:获取历史社群活动
    getHistoryActivitieTable (url) {
      this.$axios.get(window.serverIp + url)
        .then(res => {
          if (res.status === 'success') {
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
    // 正在执行的社群活动
    getImplementActivit (url) {
      this.$axios.get(window.serverIp + url)
        .then(res => {
          if (res.status === 'success') {
            console.log(res.data)
            this.ImplementActivityList = res.data
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
      // this.getList(val, 10)
    },
    // 管理员-查看详情 table
    tableDetail (param) {
      var editId = param.communityActityId
      this.modalStatus(true, '查看详情', true)
      this.activityDis = true // 全部禁用
      this.isAdd = '' // 编辑
      this.$axios.get(window.serverIp + '/api/community/getCommunityById?activityId=' + editId)
        .then(res => {
          if (res.status === 'success') {
            this.deletModal = false
            console.log(res)
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // table查看报名 + 培训情况  无分页
    tableBaoming (param) {
      console.log(param)
      var id = param.communityActityId
      this.examineCol = this.bmAndshCol
      this.$axios.get(window.serverIp + '/api/communityenroll/getActivityEnrollOfCommunity?communityId=' + id)
        .then(res => {
          if (res.status === 'success') {
            console.log(res.data)
            this.examineLoading = false
            this.bmAndShStatus(true, '查看报名、培训情况', 4)
            this.examineList = res.data
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
      // this.examineTotal = 20
    },
    // ==========================================管理员
    // 进度条-管理员=编辑
    /*
    * role: manager-管理员角色编辑活动，area-区域经理角色查看活动（区经查看不可以上传图片）
    * */
    adminEdit (id, role) {
      this.$axios.get(window.serverIp + '/api/community/getCommunityById?activityId=' + id)
        .then(res => {
          if (res.status === 'success') {
            console.log(res.data)
            if (role === 'manager') {
              this.modalStatus(true, '编辑社群活动', false)
              this.activityDis = false // 可以填写
              this.isAdd = false // 编辑
            } else if (role === 'area') {
              this.modalStatus(true, '社群活动详情', true)
              this.activityDis = true
              this.seeDetailType = 1
            }
            this.managerEditId = id
            var act = res.data.communityActivity // 活动信息
            var gifts = res.data.gifts // 礼品列表
            var modalData = this.modalData
            modalData.activName = act.communityName // 活动名称
            modalData.theme = act.theme // 活动主题
            modalData.description = act.activityDetail // 活动描述
            modalData.matters = act.important // 活动注意事项
            modalData.costExplain = act.otherCostDetail // 其他费用说明
            modalData.cost = act.nonGiftCost // 预估非礼品费用
            modalData.budgetCap = act.giftCost // 礼品预算上限
            modalData.trait = act.characteristic // 适合的社区特点
            modalData.launchTime = act.createDate // 发起时间
            modalData.enrollTime = []
            modalData.enrollTime[0] = new Date(act.enrollDateStart) // 报名起止时间==绑值
            modalData.enrollTime[1] = new Date(act.enrollDateEnd) // 报名起止时间==绑值
            modalData.enrollTimeList[0] = act.enrollDateStart // 报名起止时间==数组
            modalData.enrollTimeList[1] = act.enrollDateEnd // 报名起止时间==数组
            modalData.img1 = act.enrollPic // 上传海报第一个
            modalData.copywrit1 = act.enrollDetail // 文案第一个
            // 报名审核起止时间
            modalData.enrollShenHeTime = []
            modalData.enrollShenHeTime[0] = new Date(act.auditDate) // 报名审核起止时间==绑值
            modalData.enrollShenHeTime[1] = new Date(act.auditDateEnd) // 报名审核起止时间==绑值
            modalData.enrollShenHeTimeList[0] = act.auditDate // 报名审核起止时间==数组
            modalData.enrollShenHeTimeList[1] = act.auditDateEnd // 报名审核起止时间==数组
            // 培训起止时间
            modalData.trainTime = []
            modalData.trainTime[0] = new Date(act.trainDate) // 培训起止时间==绑值
            modalData.trainTime[1] = new Date(act.trainEnd) // 培训起止时间==绑值
            modalData.trainTimeList[0] = act.trainDate // 培训起止时间==数组
            modalData.trainTimeList[1] = act.trainEnd // 培训起止时间==数组
            modalData.img2 = act.trainPic // 上传海报第二个
            modalData.copywrit2 = act.trainDetail // 文案第二个
            // 培训审核起止时间
            modalData.trainShenHeTime = []
            modalData.trainShenHeTime[0] = new Date(act.trainAuditStart) // 培训审核起止时间==绑值
            modalData.trainShenHeTime[1] = new Date(act.trainAuditEnd) // 培训审核起止时间==绑值
            modalData.trainShenHeTimeList[0] = act.trainAuditStart // 培训审核起止时间==数组
            modalData.trainShenHeTimeList[1] = act.trainAuditEnd // 培训审核起止时间==数组
            // 宣传起止时间
            modalData.xuanChuanTime = []
            modalData.xuanChuanTime[0] = new Date(act.publicityDateStart) // 宣传起止时间==绑值
            modalData.xuanChuanTime[1] = new Date(act.publicityDateEnd) // 宣传起止时间==绑值
            modalData.xuanChuanTimeList[0] = act.publicityDateStart // 宣传起止时间==数组
            modalData.xuanChuanTimeList[1] = act.publicityDateEnd // 宣传起止时间==数组
            modalData.img3 = act.publicityPic // 上传海报第三个
            modalData.copywrit3 = act.publicityDetail // 文案第三个
            // 执行起止时间
            modalData.implementTime = []
            modalData.implementTime[0] = new Date(act.executeDateStart) // 执行起止时间==绑值
            modalData.implementTime[1] = new Date(act.executeDateEnd) // 执行起止时间==绑值
            modalData.implementTimeList[0] = act.executeDateStart // 执行起止时间==数组
            modalData.implementTimeList[1] = act.executeDateEnd // 执行起止时间==数组
            modalData.img4 = act.executePic // 上传海报第四个
            modalData.copywrit4 = act.executeDetail // 文案第四个
            modalData.tel = act.consultTel // 咨询电话
            modalData.serviceTime = act.lastReceiveTime // 礼品最晚送达时间
            modalData.signTime = act.lastSignTime // 礼品最晚签收时间
            console.log(modalData.serviceTime)
            console.log(modalData.signTime)
            // 把后台传过来的礼物列表数据整理一下
            for (var i = 0; i < gifts.length; i++) {
              // 每个礼物添加id
              gifts[i].id = i + 1
              // 给imgList赋值
              if (gifts[i].giftFour !== '') {
                gifts[i].imgList = [
                  {
                    id: 1,
                    src: window.serverIp + gifts[i].giftTop
                  },
                  {
                    id: 2,
                    src: window.serverIp + gifts[i].giftTwo
                  },
                  {
                    id: 3,
                    src: window.serverIp + gifts[i].giftThree
                  },
                  {
                    id: 4,
                    src: window.serverIp + gifts[i].giftFour
                  }
                ]
                continue
              } else if (gifts[i].giftThree !== '') {
                gifts[i].imgList = [
                  {
                    id: 1,
                    src: window.serverIp + gifts[i].giftTop
                  },
                  {
                    id: 2,
                    src: window.serverIp + gifts[i].giftTwo
                  },
                  {
                    id: 3,
                    src: window.serverIp + gifts[i].giftThree
                  }
                ]
                continue
              } else if (gifts[i].giftTwo !== '') {
                gifts[i].imgList = [
                  {
                    id: 1,
                    src: window.serverIp + gifts[i].giftTop
                  },
                  {
                    id: 2,
                    src: window.serverIp + gifts[i].giftTwo
                  }
                ]
                continue
              } else if (gifts[i].giftTop !== '') {
                gifts[i].imgList = [
                  {
                    id: 1,
                    src: window.serverIp + gifts[i].giftTop
                  }
                ]
                continue
              } else {
                gifts[i].imgList = []
              }
            }
            modalData.giftList = gifts // 礼品列表
            console.log(gifts)
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 管理员-进度条-报名期 / 进度条-报名期审核  无分页
    seeBaoming (id) {
      // this.examineTotal = 20
      this.examineCol = this.bmAndshCol
      this.$axios.get(window.serverIp + '/api/communityenroll/getActivityEnrollOfCommunity?communityId=' + id)
        .then(res => {
          if (res.status === 'success') {
            console.log(res.data)
            this.examineLoading = false
            this.bmAndShStatus(true, '报名审核', 1)
            this.examineList = res.data
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 进度条-培训期审核
    peixunShenhe () {
      this.examineLoading = false
      this.bmAndShStatus(true, '培训期审核', 2)
      // 模拟数据
      this.examineTotal = 20
      this.examineCol = this.bmAndshCol
      this.examineList = [
        {
          name: '培训期'
        }
      ]
    },
    // 进度条-下单情况
    xiaDan () {
      this.examineLoading = false
      this.bmAndShStatus(true, '下单情况', 3)
      // 模拟数据
      this.examineTotal = 20
      this.examineCol = this.xiadanCol
      this.examineList = [
        {
          name: '下单情况'
        }
      ]
    },
    // 查看下单详情
    xiadanDetail (param) {
      console.log(param)
      this.xiadanStatus(true, '查看下单详情', true)
      this.showOtherMoney = false // 不展示其他费用
    },
    // 进度条-活动总结
    uploadZongjie () {
      this.$Message.error('上传活动总结')
    },
    seeZongjie () {
      this.$Message.error('查看活动总结')
    },
    // 报名期 + 审核===审核通过
    baoMing () {
      if (this.shAndbmType === 1) {
        // 报名
        this.$Message.error('报名审核通过啦')
      } else if (this.shAndbmType === 2) {
        // 审核
        this.$Message.error('培训审核通过啦')
      } else if (this.shAndbmType === 4) {
        // table 查看报名 + 培训情况
        this.$Message.error('抱歉，您无权限')
      }
    },
    // 报名期 + 审核=== 审核不通过
    examineNo () {
      if (this.shAndbmType === 1) {
        // 报名
        this.$Message.error('报名审核不通过')
        this.auditFailedModal = true
      } else if (this.shAndbmType === 2) {
        // 审核
        this.$Message.error('培训审核不通过')
        this.auditFailedModal = true
      } else if (this.shAndbmType === 4) {
        // table 查看报名 + 培训情况
        this.$Message.error('抱歉，您无权限')
      }
    },
    // 报名时间
    enrollChange (time, date) {
      console.log(time)
      this.modalData.enrollTimeList = time
      console.log('报名开始')
      console.log(this.modalData.enrollTime)
    },
    // 报名审核起止时间
    enrollShenHeChange (time, date) {
      this.modalData.enrollShenHeTimeList = time
      console.log('报名审核起止时间')
      console.log(this.modalData.enrollShenHeTimeList)
    },
    // 培训起止时间
    trainChange (time, date) {
      this.modalData.trainTimeList = time
      console.log('培训起止时间')
      console.log(this.modalData.trainTimeList)
    },
    // 培训审核起止时间
    trainShenHeChange (time, date) {
      this.modalData.trainShenHeTimeList = time
      console.log('培训审核起止时间')
      console.log(this.modalData.trainShenHeTimeList)
    },
    // 宣传起止时间
    xuanChuanChange (time, date) {
      this.modalData.xuanChuanTimeList = time
      console.log('宣传起止时间')
      console.log(this.modalData.xuanChuanTimeList)
    },
    // 执行起止时间
    implementChange (time, date) {
      this.modalData.implementTimeList = time
      console.log(this.modalData.implementTimeList)
    },
    // 礼品最晚送达时间
    serviceChange (time, date) {
      this.modalData.serviceTime = time
      this.changeserviceTime = true
      console.log(this.modalData.serviceTime)
    },
    // 礼品最晚签收时间
    signChange (time, date) {
      this.modalData.signTime = time
      this.changeSignTime = true
      console.log(this.modalData.signTime)
    },
    // 图片上传成功时
    uopload1 (response, file, fileList) {
      console.log(response)
      console.log(file)
      console.log(fileList)
      var data = response.data
      if (response.status === 'success') {
        this.$Message.success('图片上传成功')
        this.modalData.img1 = data.filepath
      } else {
        this.$Message.error(response.message)
      }
    },
    uopload2 (response, file, fileList) {
      console.log(response)
      console.log(file)
      console.log(fileList)
      var data = response.data
      if (response.status === 'success') {
        this.$Message.success('图片上传成功')
        this.modalData.img2 = data.filepath
      } else {
        this.$Message.error(response.message)
      }
    },
    uopload3 (response, file, fileList) {
      console.log(response)
      console.log(file)
      console.log(fileList)
      var data = response.data
      if (response.status === 'success') {
        this.$Message.success('图片上传成功')
        this.modalData.img3 = data.filepath
      } else {
        this.$Message.error(response.message)
      }
    },
    uopload4 (response, file, fileList) {
      console.log(response)
      console.log(file)
      console.log(fileList)
      var data = response.data
      if (response.status === 'success') {
        this.$Message.success('图片上传成功')
        this.modalData.img4 = data.filepath
      } else {
        this.$Message.error(response.message)
      }
    },
    handleSuccess (response, file, fileList) {
      console.log(response.data.filepath)
      var url = response.data.filepath
      if (response.status === 'success') {
        this.$Message.success('图片上传成功')
        console.log('应该上传的项是==' + this.moreUploadId)
        // imgList
        var id = this.moreUploadId
        var data = this.modalData.giftList
        console.log(this.modalData.giftList.imgList)
        for (var i = 0; i < data.length; i++) {
          if (data[i].id === id) {
            var length = data[i].imgList.length
            data[i].imgList.push({
              id: length + 1,
              src: window.serverIp + url
            })
            // length 0,1,2,3
            if (length === 0) {
              data[i].giftTop = url
            } else if (length === 1) {
              data[i].giftTwo = url
            } else if (length === 2) {
              data[i].giftThree = url
            } else if (length === 3) {
              data[i].giftFour = url
            }
            console.log(length)
          }
        }
        console.log(this.modalData.giftList)
      } else {
        this.$Message.error(response.message)
      }
    },
    clickUpload (param) {
      console.log('点击的是===' + param.id)
      // 获取点击项的id, 根据id给上传成功的图片添加到某一项
      this.moreUploadId = param.id
    },
    // 图片上传之前
    beforUpload (file) {
      // 判断当前下的礼品，上传图片的数量是否大于4
      var id = this.moreUploadId
      var data = this.modalData.giftList
      for (var i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          var length = data[i].imgList.length
          if (length === 4) {
            this.$Message.error('最多可以上传4张')
            return false
          }
        }
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
    },
    // 发布社群活动
    publicActivity () {
      this.modalStatus(true, '发布社群活动', false)
      this.activityDis = false // 可以填写
      this.isAdd = true // 新增
      this.modalData.launchTime = this.format('yyyy-MM-dd hh:mm:ss', new Date())
    },
    // 添加礼品
    addGift () {
      // 往modalData中的giftList中追加一项空数据
      var length = this.modalData.giftList.length
      console.log(length)
      this.modalData.giftList.push({
        id: length + 1, // 自定义的id
        giftName: '', // 礼品名称
        giftDetail: '', // 礼品描述
        giftPrice: '', // 礼品价格
        giftLeast: '', // 礼品数量可选范围-开始
        giftMost: '', // 礼品数量可选范围-结束
        step: '', // 阶梯值
        reasonable: '', // 合理礼品数量
        giftTop: '', // 第一张图片 /uploads/20190826125408486.jpg
        giftTwo: '', // 第一张图片
        giftThree: '', // 第一张图片
        giftFour: '', // 第一张图片
        imgList: [] // 礼品图片
      })
    },
    // 删除添加的礼品
    deletItem (id) {
      console.log(id)
      this.modalData.giftList.splice(id - 1, 1)
      console.log(this.modalData.giftList)
    },
    // 保存
    save () {
      // 全部为必填项 区别是新增还是编辑 this.isAdd true-新增 false-编辑
      var datas = this.modalData
      if (datas.activName === '') {
        this.$Message.error('请输入活动名称')
        return false
      } else if (datas.theme === '') {
        this.$Message.error('请输入活动主题')
        return false
      } else if (datas.description === '') {
        this.$Message.error('请输入活动描述')
        return false
      } else if (datas.matters === '') {
        this.$Message.error('请输入活动注意事项')
        return false
      } else if (datas.costExplain === '') {
        this.$Message.error('请输入其他费用说明')
        return false
      } else if (datas.cost === '') {
        this.$Message.error('请输入预估非礼品费用')
        return false
      } else if (datas.budgetCap === '') {
        this.$Message.error('请输入礼品预算上限')
        return false
      } else if (datas.trait === '') {
        this.$Message.error('请选择适合的社区特点')
        return false
      } else if ((datas.enrollTime[0] === '' && datas.enrollTime[1] === '') || datas.enrollTime === '') {
        this.$Message.error('请选择报名起止时间')
        return false
      } else if (datas.img1 === '') {
        this.$Message.error('请上传报名起止时间海报')
        return false
      } else if (datas.copywrit1 === '') {
        this.$Message.error('请输入文案')
        return false
      } else if ((datas.enrollShenHeTime[0] === '' && datas.enrollShenHeTime[1] === '') || datas.enrollShenHeTime === '') {
        this.$Message.error('请选择报名审核起止时间')
        return false
      } else if ((datas.trainTime[0] === '' && datas.trainTime[1] === '') || datas.trainTime === '') {
        this.$Message.error('请选择培训起止时间')
        return false
      } else if (datas.img2 === '') {
        this.$Message.error('请上传培训起止时间海报')
        return false
      } else if (datas.copywrit2 === '') {
        this.$Message.error('请输入文案')
        return false
      } else if ((datas.trainShenHeTime[0] === '' && datas.trainShenHeTime[1] === '') || datas.trainShenHeTime === '') {
        this.$Message.error('请选择培训审核起止时间')
        return false
      } else if ((datas.xuanChuanTime[0] === '' && datas.xuanChuanTime[1] === '') || datas.xuanChuanTime === '') {
        this.$Message.error('请选择宣传起止时间')
        return false
      } else if (datas.img3 === '') {
        this.$Message.error('请上传宣传起止时间海报')
        return false
      } else if (datas.copywrit3 === '') {
        this.$Message.error('请输入文案')
        return false
      } else if ((datas.implementTime[0] === '' && datas.implementTime[1] === '') || datas.implementTime === '') {
        this.$Message.error('请选择执行起止时间')
        return false
      } else if (datas.img4 === '') {
        this.$Message.error('请上传执行起止海报')
        return false
      } else if (datas.copywrit4 === '') {
        this.$Message.error('请输入文案')
        return false
      } else if (datas.tel === '') {
        this.$Message.error('请输入咨询电话')
        return false
      } else if (datas.serviceTime === '') {
        this.$Message.error('请选择礼品最晚送达时间')
        return false
      } else if (datas.signTime === '') {
        this.$Message.error('请选择礼品最晚签收时间')
        return false
      } else {
        if (datas.giftList.length === 0) {
          this.$Message.error('请添加至少一项礼品介绍')
        } else {
          var gifts = datas.giftList
          for (var i = 0; i < gifts.length; i++) {
            if (gifts[i].giftName === '') {
              this.$Message.error('请输入礼品名称')
              return false
            } else if (gifts[i].giftDetail === '') {
              this.$Message.error('请输入礼品描述')
              return false
            } else if (gifts[i].giftPrice === '') {
              this.$Message.error('礼品价格')
              return false
            } else if (gifts[i].giftLeast === '' || gifts[i].giftMost === '') {
              this.$Message.error('礼品数量不可为空')
              return false
            } else if (Number(gifts[i].giftLeast) >= Number(gifts[i].giftMost)) {
              this.$Message.error('礼品数量输入有误')
              return false
            } else if (Number(gifts[i].step) < Number(gifts[i].giftLeast) || Number(gifts[i].step) > Number(gifts[i].giftMost)) {
              this.$Message.error('阶梯值输入有误')
              return false
            } else if (Number(gifts[i].reasonable) < Number(gifts[i].giftLeast) || Number(gifts[i].reasonable) > Number(gifts[i].giftMost)) {
              // 礼品数量
              this.$Message.error('合理礼品数量输入有误')
              return false
            } else if (gifts[i].imgList.length === 0) {
              this.$Message.error('请上传礼品图片')
              return false
            }
          }
          // 新增
          console.log(this.modalData)
          var data = this.modalData
          var activity = {} // 活动
          var giftList = data.giftList // 礼品
          activity.communityName = data.activName // 活动名称
          activity.theme = data.theme // 活动主题
          activity.activityDetail = data.description // 活动描述
          activity.important = data.matters // 注意事项
          activity.otherCostDetail = data.costExplain // 其他费用说明
          activity.nonGiftCost = data.cost // 预估非礼品费用
          activity.giftCost = data.budgetCap // 礼品预算上限
          activity.characteristic = data.trait // 适合的社区特点
          activity.createDate = data.launchTime // 发起时间
          // 报名
          activity.enrollDateStart = data.enrollTimeList[0] // 报名开始时间
          activity.enrollDateEnd = data.enrollTimeList[1] // 报名结束时间
          activity.enrollPic = data.img1 // 报名海报
          activity.enrollDetail = data.copywrit1 // 报名文案
          // 报名审核
          activity.auditDate = data.enrollShenHeTimeList[0] // 报名审核开始时间
          activity.auditDateEnd = data.enrollShenHeTimeList[1] // 报名审核结束时间
          // 培训
          activity.trainDate = data.trainTimeList[0] // 培训开始时间
          activity.trainEnd = data.trainTimeList[1] // 培训结束时间
          activity.trainPic = data.img2 // 培训海报
          activity.trainDetail = data.copywrit2 // 培训文案
          // 培训审核
          activity.trainAuditStart = data.trainShenHeTimeList[0] // 培训审核开始时间
          activity.trainAuditEnd = data.trainShenHeTimeList[1] // 培训审核结束时间
          // 宣传
          activity.publicityDateStart = data.xuanChuanTimeList[0] // 宣传开始时间
          activity.publicityDateEnd = data.xuanChuanTimeList[1] // 宣传结束时间
          activity.publicityPic = data.img3 // 宣传海报
          activity.publicityDetail = data.copywrit3 // 宣传文案
          // 执行
          activity.executeDateStart = data.implementTimeList[0] // 执行开始时间
          activity.executeDateEnd = data.implementTimeList[1] // 执行结束时间
          activity.executePic = data.img4 // 执行海报
          activity.executeDetail = data.copywrit4 // 执行文案
          activity.consultTel = data.tel // 咨询方式
          activity.lastReceiveTime = data.serviceTime // 礼品最晚送达时间==绑值
          activity.lastSignTime = data.signTime // 礼品最晚签收时间==绑值
          console.log(activity)
          console.log(giftList)
          if (this.isAdd) {
            this.$axios.post(window.serverIp + '/api/community', {
              communityActivity: activity,
              gifts: giftList
            })
              .then(res => {
                if (res.status === 'success') {
                  this.$Message.success('新增社群活动成功')
                  this.modalStatus(false, '', false)
                  // 历史社群活动
                  this.getHistoryActivitieTable(this.manageHistoryActivityUrl)
                  // 正在执行的活动
                  this.getImplementActivit(this.manageImplementActivityUrl)
                } else {
                  this.$Message.error(res.message)
                }
              })
              .catch(err => {
                console.log(err)
              })
          } else {
            this.$Message.warning('编辑')
            console.log(activity)
            // 判断最晚送达和最晚签收时间 是否change过没有change过走时间格式化，change过就不用走
            if (this.changeserviceTime === false) {
              var time1 = activity.lastReceiveTime
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
              time1 = time2Y + '-' + time2M + '-' + time2H + ' ' + time2s + ':' + time2f + ':' + time2ms
              console.log(time1)
              activity.lastReceiveTime = time1
            } else {

            }
            if (this.changeSignTime === false) {
              var time2 = activity.lastSignTime
              var time3Y = time2.getFullYear()
              var time3M = time2.getMonth() + 1
              var time3H = time2.getDate()
              var time3s = time2.getHours()
              var time3f = time2.getMinutes()
              var time3ms = time2.getSeconds()
              if (time3M < 10) {
                time3M = '0' + time3M
              }
              if (time3H < 10) {
                time3H = '0' + time3H
              }
              if (time3s < 10) {
                time3s = '0' + time3s
              }
              if (time3f < 10) {
                time3f = '0' + time3f
              }
              if (time3ms < 10) {
                time3ms = '0' + time3ms
              }
              time2 = time3Y + '-' + time3M + '-' + time3H + ' ' + time3s + ':' + time3f + ':' + time3ms
              console.log(time2)
              activity.lastSignTime = time2
            }
            console.log(activity)
            console.log(giftList)
            activity.communityActityId = this.managerEditId
            this.$axios.put(window.serverIp + '/api/community', {
              communityActivity: activity,
              gifts: giftList
            })
              .then(res => {
                if (res.status === 'success') {
                  this.$Message.success('修改社群活动成功')
                  this.modalStatus(false, '', false)
                  // 历史社群活动
                  this.getHistoryActivitieTable(this.manageHistoryActivityUrl)
                  // 正在执行的活动
                  this.getImplementActivit(this.manageImplementActivityUrl)
                } else {
                  this.$Message.error(res.message)
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
        }
      }
    },
    // 取消
    cancel () {
      this.checkModal(false)
      this.modal = false
    },
    // 城市改变
    haha (val) {
      console.log(val)
      this.$Message.error(val)
    },
    // ================================管理员-审核流程
    // 查看详情
    adminShenHeDetail () {
      this.signInModal = true
    },
    // 审核通过
    examineYes () {
      this.$Message.error('审核通过')
      this.signInModal = false
    },
    // 审核不通过
    examineNos () {
      this.$Message.error('审核不不不通过')
    },
    // 确认审核不通过
    ensureFail () {
      if (this.failedReason === '') {
        this.$Message.warning('请填写审核不通过原因')
      } else {
        if (this.shAndbmType === 1) {
          // 报名不通过
          this.$Message.error('确认审核不通过')
          this.auditFailedModal = false
        } else if (this.shAndbmType === 2) {
          // 审核不通过
          this.$Message.error('确认审核不通过')
          this.auditFailedModal = false
        }
      }
    },
    // 弹窗页码
    examinePageChange (val) {
      // 根据shAndbmType判断是 报名弹窗还是审核弹窗； 1-报名；2-审核
      console.log(this.shAndbmType)
      this.examinePageNum = val
      // this.getList(val, 10)
      if (this.shAndbmType === 1) {
        // 报名
      } else if (this.shAndbmType === 2) {
        // 审核
      }
    },
    // ==============================区域经理
    // 进度条-报名、撤销报名  区分是报名还是撤销报名；1、点击时判断当前时间是否在报名期间
    enrollProgress (id, start, end, type) {
      /*
      *id:活动的id
      * start:报名开始时间
      * end:报名结束时间
      * type:bm:报名；cxbm:撤销报名; xgbm:修改报名  bm:可点击报名，cxbm:可点击撤销报名， xgbm:可点击修改报名
      * */
      var nowTime = new Date().getTime()
      var startTime = new Date(start).getTime()
      var endTime = new Date(end).getTime()
      if (nowTime > startTime && nowTime < endTime) {
        this.enrollModal = true
        this.cnaEnroll = type
        this.enrollActivityId = id
        // 获取小区列表
        this.getSocialList()
        // 获取区域列表
        this.getAreaList()
        if (type === 'bm') {
          this.$Message.success('报名')
        } else if (type === 'cxbm') {
          this.$Message.success('撤销报名')
        } else if (type === 'xgbm') {
          this.$Message.success('修改报名')
          // 把数据进行绑值
        }
      } else {
        this.$Message.error('抱歉，当前时间不在报名期间')
      }
    },
    // 获取社区活动报名-区域下拉列表
    getAreaList () {
      this.$axios.get(window.serverIp + '/api/department')
        .then(res => {
          if (res.status === 'success') {
            this.regionList = res.data
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 报名-区域下拉
    regionPickerChange (val) {
      console.log(val)
      this.enrollData.region = val
    },
    // 获取小区列表
    getSocialList () {
      this.$axios.get(window.serverIp + '/api/region/getRegionOfUser')
        .then(res => {
          if (res.status === 'success') {
            this.socialList = res.data
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 弹窗-去报名
    enroll () {
      this.$Message.success('去报名')
      this.modal = false
      this.enrollModal = true
    },
    // 弹窗-区域经理=报名
    areaEnroll () {
      // 将数组中每一项转换成字符串
      var arr = []
      for (var i = 0; i < this.enrollData.social.length; i++) {
        arr.push(String(this.enrollData.social[i]))
      }
      this.$axios.post(window.serverIp + '/api/communityenroll', {
        communityId: this.enrollActivityId,
        selectRegionIds: arr
      })
        .then(res => {
          if (res.status === 'success') {
            // 重新获取正在执行的活动列表
            this.enrollModal = false
            this.getImplementActivit(this.manageImplementActivityUrl)
          } else {
            this.$Message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 弹窗-区域经理=修改报名
    editEnroll () {

    },
    // 弹窗-区域经理撤=销报名
    revoke () {
      this.$Message.success('撤销报名')
      this.enrollModal = false
    },
    // 全选
    handleCheckAll () {
      if (this.indeterminate) {
        this.checkAll = false
      } else {
        this.checkAll = !this.checkAll
      }
      this.indeterminate = false
      if (this.checkAll) {
        // 当全选时，让regionId都放到数组中
        var arr = []
        for (var i = 0; i < this.socialList.length; i++) {
          arr.push(this.socialList[i].regionId)
        }
        this.enrollData.social = arr
      } else {
        this.enrollData.social = []
      }
      console.log(this.enrollData.social)
    },
    // 选择多选框每一项
    checkAllGroupChange (data) {
      // 当选中的数组长度等于小区列表数组长度是，为全选
      if (data.length === this.socialList.length) {
        this.indeterminate = false
        this.checkAll = true
      } else if (data.length > 0) {
        this.indeterminate = true
        this.checkAll = false
      } else {
        this.indeterminate = false
        this.checkAll = false
      }
    },
    // 区域经理-审核结果
    // 审核不通过
    seeReason (type) {
      // type: baoMing=报名不通过；peiXun:审核不通过
      this.auditFailedModal = true
      this.auditDisabled = true
      this.failedReason = '抱歉，您的审核管理员未通过!'
      this.$Message.warning(type)
    },
    // ===========================================店长
    // 查看活动详情
    shoperDetail () {
      this.modalStatus(true, '社群活动详情', true)
      this.activityDis = true
      this.seeDetailType = 1
    },
    // 活动礼品下单
    shoperXiadan () {
      this.xiadanStatus(true, '活动礼品下单', true)
      this.showOtherMoney = true
    },
    // 下单
    shoperYes () {
      this.$Message.warning('下单')
      this.signInModal = false
    },
    // 取消下单
    shoperNo () {
      this.$Message.warning('取消下单')
      this.signInModal = false
    },
    // 礼品下单
    placeOrder () {
      this.$Message.warning('礼品下单')
      this.modalStatus(false, '', false)
      this.xiadanStatus(true, '活动礼品下单', true)
      this.showOtherMoney = true
    },
    // 弹层取消
    placeCanlel () {
      this.modalStatus(false, '', false)
    }
  },
  // 计算属性
  computed: {},
  // 自定义指令
  directives: {}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .title{
    width:110px;
  }
  .modal {
    .ivu-modal {
      top: 30px;
    }
    .ivu-modal-body {
      height: 500px;
      overflow: auto
    }
    .modalCentenr{
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
  .payMoney{
    height:36px;
    line-height:36px;
    span{
      display inline-block;
      height:100%;
      line-height:36px;
      float right;
    }
    span:first-child{
      line-height:44px;
      margin-left:4px;
    }
    span:last-child{
      margin-right:6px;
    }
  }
  .oneUploadImg{
    width:60px;
    height:60px;
    border-radius: 5px;
    margin-left: 10px;
  }
</style>
