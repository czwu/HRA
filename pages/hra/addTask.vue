<template>
  <view class="container">
    <comp-page
      :service="service"
      :title="title"
      tabsrc="/pages/hra/index"
    ></comp-page>
  </view>
</template>
<script>
import util from "../../common/util";
import taskService from "../../service/hra/task";
export default {
  data() {
    return {
      service: taskService,
      title: "新建任务",
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
};
</script>
