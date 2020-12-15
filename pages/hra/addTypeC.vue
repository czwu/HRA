<template>
  <view class="container">
    <comp-page :service="service" :title="title"></comp-page>
  </view>
</template>
<script>
import util from "../../common/util";
import typeCService from "../../service/hra/typeC";
export default {
  data() {
    return {
      service: typeCService,
      title: "新建事件信息",
      taskId: "",
    };
  },
  onLoad(option) {
    this.taskId = option.task_id;
    uni.getStorage({
      key: "editData",
      success: (val) => {
        if (val.data) {
          this.title = val.data.code;
        }
      },
    });
  },
  methods: {
    beforeSave(data, fields) {
      data.task_id = this.taskId;
      return true;
    },
  },
};
</script>
