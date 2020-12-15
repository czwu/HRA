<template>
  <view class="container">
    <view class="uni-column">
      <view class="uni-row i-header">
        <text class="icon iconfont" @click="back">&#xe600;</text>
        <view class="uni-grow" style="width: 100px"></view>
        <text class="i-header-text">选择规程</text>
        <view class="uni-grow uni-row" style="width: 100px">
          <view class="uni-grow"></view>
          <text
            class="icon iconfont"
            v-show="allowPost"
            @click="postSelect"
            style="padding: 0 10px"
            >&#xe656;</text
          >
        </view>
      </view>
      <view class="uni-grow content-panel">
        <view class="i-list" v-if="types.length">
          <scroll-view
            scroll-y="true"
            class="sv"
            :style="{ height: scrollHeight + 'px' }"
          >
            <template v-if="mode == 'selectType'">
              <view
                class="i-list-item uni-row"
                v-for="typeObj in types"
                v-bind:key="typeObj.guid"
                @click="viewType(typeObj)"
              >
                <text class="icon iconfont item-icon">&#xe66f;</text>
                <view class="uni-column uni-grow">
                  <view class="list-item-content" style="padding: 0 20px">
                    <text>{{ typeObj.name }}</text>
                  </view>
                </view>
                <view style="line-height: 72px">
                  <text class="icon iconfont" style="font-size: 20px"
                    >&#xe601;</text
                  >
                </view>
              </view>
            </template>
            <template v-else-if="mode == 'selectRegulation'">
              <view
                class="i-list-item uni-row"
                v-for="data in datas"
                v-bind:key="data.guid"
                @click="viewRegulation(data)"
              >
                <text class="icon iconfont item-icon">&#xe66f;</text>
                <view class="uni-column uni-grow">
                  <view class="list-item-content" style="padding: 0 20px">
                    <text>{{ data.name }}</text>
                    <text style="padding: 0 8px" class="code-text"
                      >({{ data.code }})</text
                    >
                    <text
                      class="color-text color-text-num"
                      v-if="data.malfunction_type"
                      >{{ data.malfunction_type }}</text
                    >
                    <view class="uni-grow"></view>
                    <view style="line-height: 72px">
                      <text class="icon iconfont" style="font-size: 20px"
                        >&#xe601;</text
                      >
                    </view>
                  </view>
                </view>
              </view>
            </template>
            <template v-else>
              <view
                class="i-list-item uni-row"
                :class="{ selected: data.selected }"
                v-for="data in steps"
                v-bind:key="data.guid"
                @click="selectStep(data)"
              >
                <view class="select-num" :class="{ selected: data.selected }">
                  <text
                    class="icon iconfont iconsure"
                    v-if="data.selected"
                  ></text>
                </view>
                <view class="uni-column uni-grow">
                  <view class="list-item-content" style="padding: 0 20px">
                    <text style="font-weight: normal">{{ data.step_num }}</text>
                    <text style="font-weight: normal; padding: 0 8px">{{
                      data.step_name
                    }}</text>

                    <text
                      class="color-text color-text-num"
                      v-if="data.action_type"
                      >{{ data.action_type }}</text
                    >
                    <view class="uni-grow"></view>
                  </view>
                </view>
              </view>
            </template>
          </scroll-view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import util from "../../common/util";
import constants from "../../common/constants";
import service from "../../service/basic/regulation";
import itemService from "../../service/basic/regulationItem";
export default {
  data() {
    return {
      scrollHeight: 500,
      scrollTop: 0,
      types: [], //规程类型数据
      datas: [], //规程列表
      type: "A",
      mode: "selectType",
      allowPost: false,
      selMap: {},
      steps: [],
    };
  },
  onLoad(options) {
    this.type = options.type;
    uni.getStorage({
      key: "currStepGuids",
      success: (val) => {
        let selMap = {};
        if (val.data) {
          val.data.forEach((id) => {
            selMap[id] = true;
          });
          this.selMap = selMap;
        }
      },
    });
    this.loadData();
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
    loadData() {
      let types = [],
        typesMap = {};
      service.queryAll().then((datas) => {
        datas.forEach((data) => {
          data.selected = false;
          if (!typesMap[data.type]) {
            let typeItem = {
              name: data.type,
              list: [data],
            };
            types.push(typeItem);
            typesMap[data.type] = typeItem;
          } else {
            typesMap[data.type].list.push(data);
          }
        });
        this.types = types;
      });
    },
    viewType(type) {
      this.datas = type.list;
      this.mode = "selectRegulation";
    },
    viewRegulation(regulaiton) {
      itemService.query({ regulation_code: regulaiton.code }).then((datas) => {
        datas.forEach((d) => {
          d.selected = this.selMap[d.guid] || false;
        });
        this.steps = datas;
      });
      this.mode = "selectStep";
    },
    back() {
      if (this.mode == "selectRegulation") {
        this.mode = "selectType";
        this.allowPost = false;
      } else if (this.mode == "selectStep") {
        this.mode = "selectRegulation";
        this.allowPost = false;
      } else {
        uni.navigateBack();
      }
    },
    selectStep(data) {
      data.selected = !data.selected;
      this.allowPost = this.steps.filter((i) => i.selected).length > 0;
    },
    postSelect() {
      let selectDatas = this.steps.filter((d) => d.selected);
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      if (prevPage.$vm.onSelectRegulation) {
        prevPage.$vm.onSelectRegulation(selectDatas);
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

.color-text {
  margin: auto 5px;
  font-weight: 300;
  line-height: 15px;
  height: 15px;
  vertical-align: baseline;
  background: rgba(232, 244, 255, 1);
  color: #359dff;
  font-size: 11px;
  padding: 2px 12px;
  border-radius: 10px;
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
.code-text {
  color: rgb(182, 170, 238);
}
</style>
