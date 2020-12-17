<template>
  <view class="container" @click="pageClick">
    <view class="uni-column">
      <view class="uni-row i-header">
        <text class="icon iconfont iconright1" @click="back"></text>
        <text class="i-header-text">{{ title }}</text>
      </view>
      <view class="data-info uni-row">
        <text class="icon iconfont item-icon icontask"> </text>
        <view
          class="item-content uni-grow uni-column"
          style="padding: 10px 0 10px 20px"
        >
          <view class="item-content-base">
            <text>{{ mainData.code }}</text>
            <text class="color-text color-text-num">{{
              mainData.device_type
            }}</text>
            <view class="uni-grow"></view>
            <text class="item-field"
              >正常状态:{{ mainData.normal_status }}</text
            >
            <text class="item-field"
              >需求状态:{{ mainData.demand_status }}</text
            >
            <view class="uni-grow"></view>
          </view>
          <view class="desc">
            <text class="color-text-desc">{{ mainData.device_funciton }}</text>
          </view>
        </view>
        <view @click.stop="">
          <!-- <text class="icon iconfont">&#xe66e;</text> -->
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
    <scroll-view
      scroll-y="true"
      class="sv"
      :style="{ height: scrollHeight + 'px' }"
    >
      <view class="tab-content">
        <comp-table
          v-if="tableService && tableParam"
          :service="tableService"
          :param="tableParam"
          :addTitle="addTitle"
        >
        </comp-table>
        <comp-page
          ref="compPage"
          v-if="mainData.guid"
          :service="service"
          title=""
          :param="loadParam"
          :autoload="true"
          :header="false"
          :scroll="false"
          :auto_save="true"
          formcss="line-form"
        ></comp-page>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import util from "../../common/util";
import constants from "../../common/constants";
import infoService from "../../service/hra/typeAInfo";
import inspectionService from "../../service/hra/inspection";
import accessibilityService from "../../service/hra/accessibility";
import warningService from "../../service/hra/warning";
import plainService from "../../service/hra/plain";
import directiveService from "../../service/hra/directive";
export default {
  data() {
    return {
      scrollHeight: 500,
      scrollTop: 0,
      title: "",
      mainData: {},

      tabIndex: 0,
      addTitle: "",
      infoType: constants.INFO_TYPE.DEVICE,
      tabs: [
        {
          name: "设备本体",
          index: 0,
          service: infoService,
          type: constants.INFO_TYPE.DEVICE,
        },
        {
          name: "操作对象",
          index: 1,
          service: infoService,
          type: constants.INFO_TYPE.OBJECT,
        },
        {
          name: "报警",
          index: 2,
          service: infoService,
          tableService: warningService,
          type: constants.INFO_TYPE.WARNING,
        },
        {
          name: "指示",
          index: 3,
          service: infoService,
          tableService: directiveService,
          type: constants.INFO_TYPE.DIRECTIVE,
        },
        {
          name: "工作计划",
          index: 4,
          service: infoService,
          tableService: plainService,
          type: constants.INFO_TYPE.PLAIN,
        },
        {
          name: "试验验证",
          index: 5,
          service: infoService,
          type: constants.INFO_TYPE.VERIFY,
        },
        {
          name: "日常巡检",
          index: 6,
          service: inspectionService,
          type: constants.INFO_TYPE.INSPECTION,
        },
        {
          name: "日常培训",
          index: 7,
          service: infoService,
          type: constants.INFO_TYPE.TRAINING,
        },
        {
          name: "可达性",
          index: 8,
          service: accessibilityService,
          type: constants.INFO_TYPE.ACCESSIBILITY,
        },
      ],
      //子页面配置项
      service: infoService,
      tableService: null,
      //子页面加载数据 的参数
      loadParam: {},
      tableParam: null,
    };
  },
  onLoad() {
    uni.setStorageSync("editData", "");
    uni.getStorage({
      key: "currData",
      success: (val) => {
        if (val.data) {
          this.mainData = val.data;
          this.loadParam = {
            foreign_id: this.mainData.guid,
            info_type: this.infoType,
          };
          this.tableParam = { foreign_id: this.mainData.guid };
          this.title = `${this.mainData.code} (${this.mainData.device_type})`;
        }
      },
    });
  },
  components: {},
  mounted() {
    let _this = this;
    uni.getSystemInfo({
      success(res) {
        let wHeight = res.windowHeight;
        let titleH = uni.createSelectorQuery().select(".sv");
        titleH
          .boundingClientRect((data) => {
            _this.scrollHeight = wHeight - data.top - 30;
          })
          .exec();
      },
    });
  },
  onShow(data) {
    console.log("typeAinfo onshow", data);
  },
  methods: {
    pageClick() {},
    tabClick(tab) {
      //如果与当前一致,则直接退出该方法
      if (this.tabIndex == tab.index) return;
      this.tabIndex = tab.index;
      this.infoType = tab.type;
      //非可达性的信息 公用表,数据通过info_type区分
      if (this.tabIndex != 8 && this.tabIndex != 6) {
        this.loadParam = {
          foreign_id: this.mainData.guid,
          info_type: tab.type,
        };
      } else {
        //可达性的信息页 日常巡检信息页 使用 单独表
        this.loadParam = {
          foreign_id: this.mainData.guid,
        };
      }

      this.service = tab.service;
      this.tableService = tab.tableService;
      if (this.tableService) {
        this.tableParam = { foreign_id: this.mainData.guid };
        this.addTitle = "新增" + tab.name;
      } else {
        this.tableParam = null;
      }
    },
    beforeSave(data, fields) {
      if (this.tabIndex != 8 && this.tabIndex != 6) {
        data.foreign_id = this.mainData.guid;
        data.info_type = this.infoType; // 标记
      } else {
        data.foreign_id = this.mainData.guid;
      }
      return true;
    },
    onSelectFile({ field, path, guid }) {
      this.$refs.compPage.setFilePath(field, path, guid);
    },
    back() {
      uni.navigateBack();
    },
    iconClick(field, formdata) {},
    onSelectMultiField(field, datas) {
      this.$refs.compPage.formdata[field] = datas[0].name;
    }
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
  padding: 5px 20px;
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
  > .icon.iconfont.item-icon {
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
  padding: 15px 20px;
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
</style>
