<template>
  <view class="container">
    <view class="uni-column">
      <view class="uni-row i-header">
        <text class="icon iconfont" @click="back">&#xe600;</text>
        <view class="uni-grow" style="width: 100px"></view>
        <text class="i-header-text">{{ title }}</text>
        <view class="uni-grow uni-row" style="width: 100px">
          <view class="uni-grow"></view>
          <text
            class="icon iconfont"
            @click="postSelect"
            style="padding: 0 10px"
            >&#xe656;</text
          >
        </view>
      </view>
      <view class="uni-grow content-panel">
        <view class="i-list" v-if="datas.length">
          <scroll-view
            scroll-y="true"
            class="sv"
            :style="{ height: scrollHeight + 'px' }"
          >
            <view
              class="i-list-item uni-row"
              :class="{ selected: data.selected }"
              v-for="data in datas"
              v-bind:key="data.guid"
              @click="selectData(data)"
            >
              <view class="select-num" :class="{ selected: data.selected }">
                <text
                  class="icon iconfont iconsure"
                  v-if="data.selected"
                ></text>
              </view>
              <view class="uni-column uni-grow">
                <view class="list-item-content" style="padding: 0 20px">
                  <text style="font-weight: normal">{{
                    data.value || data.name
                  }}</text>
                  <text
                    v-if="data.job_name"
                    class="color-text color-text-job"
                    >{{ data.job_name }}</text
                  >
                  <!-- <text v-if="data.job" class="color-text color-text-time">{{
                    data.job
                  }}</text> -->
                  <view class="uni-grow"></view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import util from "../../common/util";
import constants from "../../common/constants";
export default {
  data() {
    return {
      scrollHeight: 500,
      scrollTop: 0,
      datas: [], //规程列表
      selMap: {},
      title: "",
      field: null,
      multi: true,
      userMode: false,
    };
  },
  onLoad(options) {
    uni.getStorage({
      key: "multiItem",
      success: (val) => {
        let selMap = {};
        if (val.data) {
          this.title = val.data.dictType;
          this.field = val.data.field;
          this.userMode = val.data.userMode;
          if (val.data.multi === false) {
            this.multi = false;
          }
          let value = val.data.value,
            vals = [];
          if (value) {
            vals = value.split(val.data.split);
          }
          vals.forEach((item) => {
            selMap[item] = true;
          });
          val.data.values.forEach((item) => {
            if (this.userMode) {
              item.selected = selMap[item.name] || false;
            } else {
              item.selected = selMap[item.value] || false;
            }
          });
          this.datas = val.data.values;
          this.selMap = selMap;
        }
      },
    });
  },
  computed: {},
  mounted() {
    let _this = this;
    uni.getSystemInfo({
      success(res) {
        let wHeight = res.windowHeight;
        let titleH = uni.createSelectorQuery().select(".content-panel");
        titleH
          .boundingClientRect((data) => {
            _this.scrollHeight = wHeight - data.top - 30;
          })
          .exec();
      },
    });
  },
  methods: {
    scroll(e) {},
    loadData() {},

    back() {
      uni.navigateBack();
    },
    selectData(data) {
      if (this.multi) {
        data.selected = !data.selected;
      } else {
        this.datas.filter((d) => {
          d.selected =  d==data
        });
      }
    },
    postSelect() {
      let selectDatas = this.datas.filter((d) => d.selected);
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      if (prevPage.$vm.onSelectMultiField) {
        prevPage.$vm.onSelectMultiField(this.field, selectDatas);
      }
      uni.navigateBack();
    },
  },
};
</script>
<style lang="scss" scoped >
.i-list {
  padding: 0;
}
.i-list-item {
  box-sizing: border-box;
  padding: 0 20px;
  height: 72px;
  line-height: 72px;
  padding-right: 20px;
  border-bottom: 1px solid #f8f8f8;
  .icon.iconfont.item-icon {
    font-size: 26px;
    line-height: 46px;
    color: rgb(100, 196, 175);
    display: block;
    width: 46px;
    height: 46px;
    margin-top: 13px;
    background: #e8f6f3;
    text-align: center;
    border-radius: 24px;
  }
  &.selected {
    background: rgb(217, 226, 243);
  }
}

.select-num {
  display: block;
  height: 30px;
  width: 30px;
  margin: 20px 0px;
  border-radius: 15px;
  border: 2px solid #ccc;
  box-sizing: border-box;
  background: #fff;
  text-align: center;
  position: relative;
  &.selected {
    border: 2px solid #359dff;
    background: #359dff;
    color: #fff;
    font-size: 16px;
  }
  .icon.iconfont {
    position: absolute;
    top: 4px;
    left: 8px;
    font-size: 11px;
    line-height: 20px;
    padding: 0;
    color: #fff;
    margin: 0;
  }
}
.color-text-job {
  background: rgb(243, 234, 151);
  color: #333;
}
</style>
