<template>
  <view class="container">
    <comp-page
      :service="service"
      :title="title"
    ></comp-page>
  </view>
</template>
<script>
import util from "../../common/util";
import moduleService from "../../service/effect/plant";
export default {
  data() {
    return {
      service: moduleService,
      title: "新建基础信息"
    };
  },
  onLoad(options) {
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
    beforeSave(data) {
 
    },
  },
};
</script>
