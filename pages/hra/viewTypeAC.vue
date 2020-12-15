<template>
  <view class="container">
    <view class="uni-column">
      <view class="uni-row i-header">
        <text class="icon iconfont" @click="back">&#xe600;</text>
        <view class="uni-grow title" style="padding-left: 10px">{{
          title
        }}</view>
        <view class="uni-grow"> </view>
        <text class="icon iconfont" @click="save">&#xe656;</text>
      </view>
    </view>
    <scroll-view
      scroll-y="true"
      class="sv"
      :style="{ height: scrollHeight + 'px' }"
    >
      <comp-page
        ref="compPage"
        v-if="inited"
        :service="service"
        title=""
        :autoload="true"
        :header="false"
        :param="param"
        :scroll="false"
        form_mode=""
        formcss="step-form"
      ></comp-page>
    </scroll-view>
  </view>
</template>

<script>
import util from "../../common/util";
import constants from "../../common/constants";
import typeACService from "../../service/hra/typeAC";
import typeCCService from "../../service/hra/typeCC";
export default {
  props: {},
  components: {},
  data() {
    var service = typeACService;
    return {
      title: "创建A类相关性",
      inited: false,
      winHeight: 0,
      scrollHeight: 0,
      service: "",
      param: {},
      guid: "",
    };
  },
  computed: {},
  onLoad(options) {
    let guid = (this.guid = options.guid);
    this.title = options.name;
    this.service = options.type == "AC" ? typeACService : typeCCService;
    this.param = {
      guid: guid,
    };
    this.inited = true;
  },
  mounted() {
    let _this = this;
    uni.getSystemInfo({
      success(res) {
        let wHeight = res.windowHeight;
        let titleH = uni.createSelectorQuery().select(".sv");
        titleH
          .boundingClientRect((data) => {
            _this.scrollHeight = wHeight - data.top - 30;
          })
          .exec();
      },
    });
  },
  methods: {
    back() {
      uni.navigateBack();
    },
    onSelectFile({ field, path, guid }) {
      this.$refs.compPage.setFilePath(field, path, guid);
    },
    save() {
      let data = { guid: this.guid };
      let formdata = this.$refs.compPage.formdata;
      data.remark = formdata.remark;
      data.document = formdata.document || '';
      this.service.update(data).then(() => {
        uni.showToast({
          title: "保存成功!",
          duration: 2000,
        });
        this.back();
      });
    },
  },
};
</script>

<style lang="scss" scoped >
</style>
