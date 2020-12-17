<template>
  <view class="container">
    <comp-page :service="service" :title="title" ref="compPage"></comp-page>
  </view>
</template>
<script>
import util from "../../common/util";
import typeAService from "../../service/hra/typeA";
export default {
  data() {
    return {
      service: typeAService,
      title: "新建设备信息",
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
    onSelectMultiField(field, datas) {
      let values = [];
      datas.forEach((data) => {
        values.push(data.value);
      });
      this.$refs.compPage.formdata[field] = values.join("|");
    },
  },
};
</script>
