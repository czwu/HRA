<template>
  <view class="container">
    <comp-page :service="service" :title="title" ref="compPage"></comp-page>
  </view>
</template>
<script>
import util from "../../common/util";
import Service from "../../service/isv/situationIssue";
export default {
  data() {
    return {
      service: Service,
      title: "添加情境问题",
      foreign_id: "",
    };
  },
  onLoad(option) {
    this.foreign_id = option.guid;
    if (option.code) {
      this.title = "编辑情境问题";
    }
  },
  methods: {
    beforeSave(data, fields) {
      data.foreign_id = this.foreign_id;
      return true;
    },
    onSelectFile({ field, path, guid }) {
      this.$refs.compPage.setFilePath(field, path, guid);
    }, 
  },
};
</script>
