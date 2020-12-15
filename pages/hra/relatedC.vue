<template>
  <view class="container" @click="pageClick">
    <view class="uni-column">
      <view class="uni-row i-header">
        <text class="icon iconfont iconright1" @click="back"></text>
        <text class="i-header-text"> 相关性 信息采集</text>
        <view class="uni-grow"></view>
        <text class="icon iconfont" @click="save">&#xe656;</text>
      </view>
    </view>
    <scroll-view
      scroll-y="true"
      :style="{ height: scrollHeight + 'px' }"
      class="sv"
    >
      <view class="data-info uni-row" style="border-top: 7px solid #f5f5f5">
        <view class="uni-row uni-grow">
          <text class="icon iconfont item-icon icontask"> </text>
          <view
            class="item-content uni-grow uni-column"
            style="padding: 10px 0 10px 20px"
          >
            <view class="item-content-base">
              <text>{{ data1.human_error_code }}</text>

              <text
                class="color-text color-text-num"
                style="margin-left: 20px"
                >{{ data1.system }}</text
              >
              <view class="uni-grow"></view>
            </view>
            <view class="desc">
              <text class="color-text-desc">{{ data1.accident }}</text>
            </view>
          </view>
        </view>
        <view
          class=""
          style="width: 10px; border-left: 6px solid #f2f2f2"
        ></view>
        <view class="uni-row uni-grow">
          <text class="icon iconfont item-icon icontask"> </text>
          <view
            class="item-content uni-grow uni-column"
            style="padding: 10px 0 10px 20px"
          >
            <view class="item-content-base">
              <text>{{ data2.human_error_code }}</text>

              <text
                class="color-text color-text-num"
                style="margin-left: 20px"
                >{{ data2.system }}</text
              >
              <view class="uni-grow"></view>
            </view>
            <view class="desc">
              <text class="color-text-desc">{{ data2.accident }}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="split"></view>
      <view class="tab-layout uni-column">
        <view class="i-tabs uni-grow uni-row">
          <view
            class="tab-item"
            v-for="tab in tabs"
            v-bind:key="tab.index"
            @click="tabClick(tab)"
          >
            <text
              class="tab-item-title"
              :class="{ hover: tabIndex == tab.index }"
              >{{ tab.name }}</text
            >
          </view>
        </view>
      </view>
      <view class="tab-content" style="padding: 20px 20px 20px 20px">  
        <comp-related
          ref="compRelated"
          :service="service"
          v-if="service"
          :value="value"
          @change="onFlowChange"
          :fix_right="fixRight"
        ></comp-related>
      </view>
      <comp-page
        ref="compPage"
        v-if="data2.guid"
        :service="service"
        title=""
        :param="loadParam"
        :autoload="true"
        :header="false"
        :scroll="false"
        :auto_save="true"
        formcss="line-form"
      ></comp-page>
    </scroll-view>
  </view>
</template>

<script>
import util from "../../common/util";
import RelatedFlow from "../../common/relatedFlow";
import constants from "../../common/constants";
import sparHService from "../../service/hra/sparH";
import therpService from "../../service/hra/therp";
import nureg1921Service from "../../service/hra/nureg1921";
import typeCCService from "../../service/hra/typeCC";
export default {
  data() {
    return {
      title: "",
      data1: {},
      data2: {},
      sparHData: {},
      therpData: {},
      nureg1921Data: {},
      value: 0,
      tabIndex: 0,
      addTitle: "",
      service: null,
      loadParam: {},
      fixRight: "40px",
      tabs: [
        {
          name: "SPAR-H事件树",
          index: 0,
          service: sparHService,
          data: "sparHData",
          newGuid: sparHService.genGuid(),
          fixRight: "40px",
        },
        {
          name: "THERP决策树",
          index: 1,
          service: therpService,
          data: "therpData",
          newGuid: therpService.genGuid(),
          fixRight: "40px",
        },
        {
          name: "NUREG-1921事件树",
          index: 2,
          data: "nureg1921Data",
          service: nureg1921Service,
          newGuid: nureg1921Service.genGuid(),
          fixRight: "0px",
        },
      ],
      //子页面配置项
      //子页面加载数据 的参数
      scrollHeight: 500,
      scrollTop: 0,
    };
  },
  onLoad() {
    this.service = sparHService;
    uni.getStorage({
      key: "related_datas",
      success: (val) => {
        if (val.data) {
          this.data1 = val.data[0];
          this.data2 = val.data[1];
          this.loadParam = { guid: this.newSparHId };
          sparHService.query({ foreign_id: this.data2.guid }).then((data) => {
            if (data.length) {
              this.sparHData = data[0];
              if (this.sparHData.related_value) {
                this.value = this.sparHData.related_value * 1;
              }
              this.loadParam = { guid: this.sparHData.guid };
            }
          });
          therpService.query({ foreign_id: this.data2.guid }).then((data) => {
            if (data.length) {
              this.therpData = data[0];
              if (this.data2.correlation_type.startsWith("therp")) {
                this.tabClick(this.tabs[1]);
              }
            }
          });
          nureg1921Service
            .query({ foreign_id: this.data2.guid })
            .then((data) => {
              if (data.length) {
                this.nureg1921Data = data[0];
                if (this.data2.correlation_type == "nureg-1921") {
                  this.tabClick(this.tabs[2]);
                }
              }
            });
        }
      },
    });
  },
  mounted() {
    util.getScrollHeight(".sv").then((h) => {
      this.scrollHeight = h - 30;
    });
  },
  components: {},
  computed: {},
  methods: {
    pageClick() {},
    tabClick(tab) {
      this.service = tab.service;
      let data = this[tab.data];
      this.tabIndex = tab.index;
      this.value = data.related_value * 1;
      let newId = tab.newGuid;
      this.loadParam = { guid: data.guid || newId };
      this.fixRight = tab.fixRight;
    },
    back() {
      uni.navigateBack();
    },
    onFlowChange(flowData) {
      let data = this[this.tabs[this.tabIndex].data];
      let fn = data.guid ? "update" : "insert";
      if (fn == "insert") {
        data.guid = this.tabs[this.tabIndex].newGuid;
        data.foreign_id = this.data2.guid;
      }
      delete data.remark;
      Object.assign(data, flowData);
      this.service[fn](data);
    },
    beforeSave(formdata) {
      let data = this[this.tabs[this.tabIndex].data];
      data.pressure_type = formdata.pressure_type;
    },
    save() {
      let data = this[this.tabs[this.tabIndex].data];
      if (!data.related_value) {
        uni.showToast({
          icon: "none",
          title: "请先选择相关性!",
          duration: 2000,
        });
        return;
      }
      let updateData = {
        guid: this.data2.guid,
        correlation: data.related_text,
        correlation_type: "", //事件树类型
      };
      if (this.tabIndex == 1) {
        if (!data.pressure_type) {
          uni.showToast({
            icon: "none",
            title: "请先选择THERP事件树压力类型!",
            duration: 2000,
          });
          return;
        } else if (data.pressure_type == "低压力事件树") {
          updateData.correlation_type = "therp-1"; //低压力事件树
        } else if (data.pressure_type == "中压力事件树") {
          updateData.correlation_type = "therp-2"; //中压力事件树
        } else if (data.pressure_type == "高压力事件树") {
          updateData.correlation_type = "therp-3"; //高压力事件树
        }
      } else if (this.tabIndex == 2) {
        updateData.correlation_type = "nureg-1921";
      } else {
        updateData.correlation_type = "spar-h";
      }
      typeCCService.update(updateData).then(() => {
        this.back();
        uni.showToast({
          title: "保存成功!",
          duration: 2000,
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped >
.i-header {
  background: #fff;
  padding: 0 15px 0 20px;
  height: 56px;
  line-height: 56px;
  border-bottom: 1px solid #f2f2f2;
  text-align: left;
  > .i-header-text {
    color: #333;
    font-size: 18px;
    padding: 0 15px;
  }
  .iconright1 {
    color: #007aff;
    font-size: 20px;
    font-weight: bold;
  }
}
.data-info {
  background: #fff;
  padding: 0px 20px;
  .icon.iconfont {
    font-size: 26px;
    line-height: 46px;
    display: block;
    width: 46px;
    height: 46px;
    color: #aaa;
    margin-top: 18px;
    text-align: center;
  }
  .icon.iconfont.item-icon {
    color: rgb(100, 196, 175);
    display: block;
    background: #e8f6f3;
    border-radius: 24px;
  }
}
.item-content {
  box-sizing: border-box;
  height: 82px;
  line-height: 30px;
  padding-right: 20px;
}

.item-content-base {
  font-size: 16px;
  color: #666;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  .icon.iconfont {
    font-size: 20px;
  }
}
.color-text {
  margin: auto 10px;
  font-weight: 300;
  line-height: 15px;
  height: 15px;
  vertical-align: baseline;
  color: #359dff;
  font-size: 11px;
  padding: 2px 12px;
  border-radius: 10px;
}
.color-text-num {
  background: rgba(232, 244, 255, 1);
}
.item-field {
  font-size: 13px;
  font-weight: normal;
  padding: 0 10px;
  color: #999;
}
.color-text-desc {
  color: #999;
  font-size: 13px;
}
.i-tabs {
  background: #fff;
}
.split {
  height: 8px;
  background: #f2f2f2;
}
.tab-layout {
  padding: 10px 20px 0 20px;
  .tab-item {
    text-align: center;
    padding: 0 28px 0 0;
  }
  .tab-item-title {
    color: #666;
    padding-bottom: 5px;
    &.hover {
      color: #359dff;
      border-bottom: 2px solid #359dff;
    }
  }
}
.tab-content {
  width: 100%;
  box-sizing: border-box;
}
</style>
