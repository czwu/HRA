<template>
  <view class="container">
    <comp-page ref="compPage" :service="service" :title="title"></comp-page>
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
  methods: {
    onSelectMultiField(field, datas) {
      if (field == "principal") {
        this.$refs.compPage.formdata[field] = datas[0].name;
      } else if (field == "participants") {
        let values = [];
        datas.forEach((data) => {
          values.push(data.name);
        });
        this.$refs.compPage.formdata[field] = values.join(",");
      }
    },
  },
};
</script>
