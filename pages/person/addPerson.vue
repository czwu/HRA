<template>
  <view class="container">
    <comp-page :service="service" :title="title" ref="compPage"></comp-page>
  </view>
</template>
<script>
import util from "../../common/util";
import personService from "../../service/person/person";
export default {
  data() {
    return {
      service: personService,
      title: "新增人员",
      parentId: "",
    };
  },
  onLoad(option) {
    this.parentId = option.jobId;
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
      if (!data.dept_guid) {
        data.job_guid = this.parentId;
      }
      return true;
    }
  }
};
</script>
