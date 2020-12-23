<template>
  <view class="container">
    <comp-page ref="compPage" :service="service" :title="title"></comp-page>
  </view>
</template>
<script>
import util from "../../common/util";
import service from "../../service/isv/situation";
export default {
  data() {
    return {
      service: service,
      title: "新建情境信息",
    };
  },
  onLoad() {
    uni.getStorage({
      key: "editData",
      success: (val) => {
        if (val.data) {
          this.title = val.data.name;
        }
      },
    });
  },
  methods: {

  },
};
</script>
