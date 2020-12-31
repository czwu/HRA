<template>
  <view class="container">
    <view class="uni-column">
      <view class="uni-row i-header">
        <text class="icon iconfont" @click="back">&#xe600;</text>
        <view class="uni-grow"></view>
        <text class="i-header-text">{{ title }}</text>
        <view class="uni-grow"></view>
      </view>
      <uni-breadcrumb :datas="breadData"></uni-breadcrumb>
      <view class="i-tab-layout">
        <view class="i-tab">
          <view
            class="tab-item"
            :class="{ active: currType == type }"
            v-for="type in types"
            v-bind:key="type"
            @click="typeClick(type)"
            >{{ type }}</view
          >
        </view>
      </view>
      <view class="tab-layout uni-column">
        <view class="i-tabs uni-grow uni-row">
          <view
            class="tab-item"
            v-for="tab in tabs"
            v-bind:key="tab"
            @click="tabClick(tab)"
          >
            <text class="tab-item-title" :class="{ hover: currTab == tab }">{{
              tab
            }}</text>
          </view>
        </view>
      </view>
      <view class="uni-grow content-panel">
        <view class="i-list req-warp" style="padding: 0 0 0 15px">
          <scroll-view
            v-if="scrollHeight"
            scroll-y="true"
            class="sv"
            :style="{ height: scrollHeight + 'px' }"
          >
            <view class="" style="padding-right: 10px">
              <view
                class="cbdt-item uni-col uni-grow"
                v-for="(item, key) in currList"
                v-bind:key="key"
              >
                <view class="item-req uni-row">
                  <text class="item-text"> 问题 </text>
                  <text class="item-req-text"> {{ item.name }} </text>
                </view>
                <view class="item-input uni-row">
                  <text class="item-text"> 回答 </text>
                  <view class="uni-grow">
                    {{ item.guid ? item.value : "" }}
                  </view>
                  <view class="switch-item" @click.stop="() => {}">
                    <switch
                      style="transform: scale(0.7)"
                      :checked="item.value == '是'"
                      @change="switchChange(item, $event)"
                    />
                  </view>
                </view>
                <view class="item-input uni-col">
                  <view class="uni-row uni-grow" style="position: relative">
                    <text class="item-text"> 备注 </text>
                    <input
                      class="uni-input"
                      placeholder="请输入信息"
                      v-model="item.remark"
                      placeholder-style="color:#bbb"
                      @blur="textChange(item, 'remark')"
                    />
                    <text
                      class="icon iconfont input-icon iconelipsis"
                      @click="popupMedia(item)"
                    ></text>
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>
    <comp-media ref="media"></comp-media>
  </view>
</template>
<script>
import util from "../../common/util";
import investgationService from "../../service/investigation/investgation";
export default {
  data() {
    return {
      title: "",
      currType: "",
      types: investgationService.getTypes(),
      tabs: [],
      currTab: "",
      list: [], //所有调查问题
      currList: [], //当前分类调查问项目
      scrollHeight: 0,
      parentId: null,
      breadData: null,
    };
  },
  onLoad(options) {
    this.title = options.code;
    this.breadData = [{ name: "问题普查", back: 1 }, { name: options.code }];
    this.currType = this.types[0];
    this.parentId = options.guid;
    this.loadInvestgation(options.guid);
    this.typeClick(this.currType);
    setTimeout(() => {
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
    }, 100);
  },
  methods: {
    loadInvestgation(guid) {
      let allList = investgationService.getRequestions();
      let reqMap = {};
      allList.forEach((item) => {
        reqMap[item.code] = item;
      });
      this.list = allList;
      investgationService.query({ foreign_id: guid }).then((datas) => {
        datas.forEach((data) => {
          Object.assign(reqMap[data.code], data);
          this.loadCurrList();
        });
      });
    },
    loadCurrList() {
      this.currList = this.list.filter((item) => {
        return item.type1 == this.currType && item.type2 == this.currTab;
      });
    },
    typeClick(type) {
      this.currType = type;
      this.tabs = investgationService.getChildTypes(this.currType);
      this.currTab = this.tabs[0];
      this.tabClick(this.currTab);
    },
    tabClick(tab) {
      this.currTab = tab;
      this.loadCurrList();
    },
    back() {
      uni.navigateBack();
    },
    textChange(item, field) {
      this.save(item);
    },
    popupMedia(item) {
      this.$refs.media.popup(item.guid, "remark");
    },
    switchChange(item, e) {
      item.value = e.detail.value ? "是" : "否";
      this.save(item);
    },
    save(item) {
      if (item.guid) {
        investgationService.update(item);
      } else {
        item.guid = investgationService.genGuid();
        item.foreign_id = this.parentId;
        investgationService.insert(item);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.i-tab-layout {
  padding: 0 10px;
  .i-tab {
    display: flex;
    font-size: 13px;
    flex-direction: row;
    color: #666;
    border-bottom: 1px solid #f2f2f2;
    .tab-item {
      background: #f8f8f8;
      padding: 4px 15px;
      box-sizing: content-box;
      margin-right: 3px;
      &.active {
        color: #007aff;
        border-bottom: 1px solid #007aff;
        background: #e5e9f8;
      }
    }
  }
}
.tab-layout {
  padding: 0px 20px;
  .tab-item {
    text-align: center;
    .tab-item-title {
      padding: 0 15px;
      line-height: 40px;
    }
  }
  .tab-item-title {
    color: #666;
    font-size: 13px;
    font-weight: bold;
    &.hover {
      color: #007aff;
    }
  }
}

.req-warp {
  font-size: 13px;
  padding: 0 20px;
  .cbdt-item {
    margin-bottom: 30px;
  }
  .item-name {
    line-height: 40px;
    height: 40px;
    font-size: 14px;
    border-bottom: 1px solid #f2f2f2;
    color: #333;
    padding: 0 5px;
  }

  .item-text {
    min-width: 80px;
    flex-shrink: 0;
  }
  .item-req {
    background: #f0f0f0;
    padding: 10px;
    margin-top: 20px;
  }
  .item-req-text {
    color: #888;
  }
  .item-input {
    padding: 10px;
    margin-top: 10px;
    border-bottom: 1px solid #f2f2f2;
    .uni-input {
      padding: 0;
      font-size: 13px;
    }
  }
  .icon.iconfont.iconvoicefill {
    color: #ccc;
    font-weight: normal;
    &:active {
      color: #359dff;
    }
  }

  .cbdt-tab-item {
    padding-right: 30px;
    line-height: 40px;
    font-size: 14px;
    &.active {
      color: #359dff;
    }
  }
  .input-icon {
    position: absolute;
    top: 0;
    right: 2px;
    display: block;
    width: 50px;
    height: 50px;
    text-align: center;
    font-size: 24px !important;
    color: #999;
  }
}
</style>
