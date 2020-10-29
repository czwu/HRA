<template>
  <view class="container" :class="screenOrientation">
    <uni-tab-bar :class="screenOrientation" index="5"></uni-tab-bar>
    <view class="build-text"></view>
  </view>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  created() {},
  computed: {
    ...mapState({ screenOrientation: "screenOrientation" }),
  },

  methods: {},
};
</script>

<style scoped>
 .container{
   background: #D9D9D9;
 }
</style>