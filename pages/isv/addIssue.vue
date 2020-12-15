<template>
  <view class="container">
    <comp-page :service="service" :title="title"></comp-page>
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
    if(option.code){
      this.title='编辑情境问题'
    }
 
  },
  methods: {
    beforeSave(data, fields) {
      data.foreign_id = this.foreign_id;
      return true;
    },
  },
};
</script>
