<template>
  <view class="container">
    <comp-page mode="page" :form="form" :title="title"></comp-page>
  </view>
</template>

<script>
import util from "../../common/util";
import taskService from "../../service/hra/task";
export default {
  data() {
    return {
      form: taskService.form,
      title: "任务",
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {},
    back() {},
    save() {},
  }
};
</script>
