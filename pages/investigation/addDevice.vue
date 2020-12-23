<template>
  <view class="container">
    <comp-page ref="compPage" :service="service" :title="title"></comp-page>
  </view>
</template>
<script>
import util from "../../common/util";
import service from "../../service/investigation/device";
export default {
  data() {
    return {
      service: service,
      title: "新增设备",
    };
  },
  onLoad() {
    uni.getStorage({
      key: "editData",
      success: (val) => {
        if (val.data) {
          this.title = val.data.code;
        }
      },
    });
  },
  methods: {},
};
</script>
