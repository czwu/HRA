<template>
  <view class="container">
    <comp-page :service="service" :title="title" ref="compPage"></comp-page>
  </view>
</template>
<script>
import util from "../../common/util";
import moduleService from "../../service/person/job";
import personService from "../../service/person/person";
export default {
  data() {
    return {
      service: moduleService,
      title: "新增岗位",
      parentId: "",
    };
  },
  onLoad(option) {
    this.parentId = option.deptId;
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
        data.dept_guid = this.parentId;
      }
      return true;
    },
    onSelectFile({ field, path, guid }) {
      this.$refs.compPage.setFilePath(field, path, guid);
    }, 
    iconClick(field, formdata) {
      if (field.field == "num") {
        personService.query({ job_guid: formdata.guid }).then((data) => {
          formdata.num = data.length;
        });
      }
    },
  },
};
</script>
