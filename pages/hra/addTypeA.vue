<template>
  <view class="container">
    <comp-page :service="service" :title="title"></comp-page>
  </view>
</template>
<script>
import util from "../../common/util";
import typeAService from "../../service/hra/typeA";
export default {
  data() {
    return {
      service: typeAService,
      title: "新建文件",
      taskId: "",
    };
  },
  onLoad(option) {
    this.taskId = option.task_id;
    console.error('task', this.taskId)
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
