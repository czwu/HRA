<template>
  <view class="breadcrumb uni-row">
    <view v-for="(crumb, i) in datas || crumbs" v-bind:key="i">
      <text class="i-curmb" @click="clickCrumb(crumb)">{{ crumb.name }}</text>
      <text class="i-curmb-split" v-show="i < (datas || crumbs).length - 1"
        >&gt;</text
      >
    </view>
    <view class="uni-grow"></view>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "breadcrumb",
  props: { datas: Array },
  data() {
    return {};
  },

  methods: {
    clickCrumb(crumb) {
      if (crumb.url) {
        uni.switchTab({
          url: crumb.url,
        });
      } else if (crumb.back) {
        uni.navigateBack({
          delta: crumb.back,
        });
      } else {
        this.$emit("itemClick", crumb);
      }
    },
  },
  computed: {
    ...mapState({
      crumbs: "crumbs",
    }),
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.breadcrumb {
  padding: 0px 20px;
  font-size: 14px;
  height: 42px;
  line-height: 42px;
  color: #666;
  .i-curmb-split {
    padding: 0 10px;
  }
}
</style>
