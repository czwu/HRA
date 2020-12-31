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
            <text>{{ mainData.human_error_code }}</text>
            <text class="color-text color-text-num">{{ mainData.system }}</text>
            <text class="color-text color-text-num">{{
              mainData.accident
            }}</text>
            <view class="uni-grow"></view>
          </view>
          <view class="desc">
            <text class="color-text-desc">{{ mainData.human_error_desc }}</text>
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
        <view style="padding: 0 20px">
          <view class="child-tab" v-if="tabIndex == 1">
            <view
              class="item"
              v-for="(tab, key) in tabs[1].child"
              v-bind:key="tab.index"
              @click="tabClick(tab, true)"
            >
              <text class="split-line" v-show="key != 0">|</text>
              <text
                class="item-title"
                :class="{ hover: childTabIndex == tab.index }"
                >{{ tab.name }}</text
              >
            </view>
          </view>
          <view class="psf-warp child-tab" v-if="tabIndex == 6">
            <view class="item" @click="psfTabClick(1)">
              <text class="item-title" :class="{ hover: psfTabIndex == 1 }"
                >诊断</text
              >
            </view>
            <view class="item" @click="psfTabClick(2)">
              <text class="split-line">|</text>
              <text class="item-title" :class="{ hover: psfTabIndex == 2 }"
                >执行</text
              >
            </view>
          </view>
        </view>
        <view class="team-warp" v-if="infoType == 'team'">
          <view class="uni-input-label">主控班组:</view>
          <picker
            mode="selector"
            :range="teamList"
            range-key="name"
            :value="team_index"
            @change="teamChange($event.detail.value)"
          >
            <view class="uni-input" v-if="team_name">
              {{ team_name }}
            </view>
            <view class="uni-input" v-else> 请选择 </view>
          </picker>
        </view>
        <view class="cbdt-warp uni-col uni-grow" v-if="tabIndex == 9">
          <view class="cbdt-tab uni-row">
            <view
              class="cbdt-tab-item"
              v-for="type in cbdtTypes"
              v-bind:key="type"
              :class="{ active: currCBDT == type }"
              @click="cbdtTabClick(type)"
            >
              {{ type }}
            </view>
          </view>
          <view
            class="cbdt-item uni-col uni-grow"
            v-for="(item, key) in currCbdtItems"
            v-bind:key="key"
          >
            <view class="item-name uni-row">
              <text class="item-text">
                {{ item.item_name }}
              </text>
              <view class="uni-grow"></view>
              <view class="switch-item" @click.stop="() => {}">
                <switch
                  style="transform: scale(0.7)"
                  :checked="item.item_value"
                  @change="switchChange(item, $event)"
                />
              </view>
            </view>
            <view class="item-req uni-row">
              <text class="item-text"> 问题 </text>
              <text class="item-req-text"> {{ item.req }} </text>
            </view>
            <view class="item-input uni-row">
              <text class="item-text"> 回答 </text>
              <input
                class="uni-input"
                placeholder="请输入信息"
                v-model="item.item_answer"
                placeholder-style="color:#bbb"
                @blur="textChange(item, 'item_answer')"
              />
            </view>
            <view class="item-input uni-col">
              <view class="uni-row uni-grow" style="position: relative">
                <text class="item-text"> 相关文件 </text>
                <text class="file-text">{{
                  item.item_doc | filePathRender
                }}</text>
                <text
                  class="icon iconfont iconlianjie input-icon"
                  @click="openSelectFilePage(item)"
                ></text>
              </view>
            </view>
            <view class="item-input uni-col">
              <view class="uni-row uni-grow" style="position: relative">
                <text class="item-text"> 备注 </text>
                <input
                  class="uni-input"
                  placeholder="请输入信息"
                  v-model="item.item_remark"
                  placeholder-style="color:#bbb"
                  @blur="textChange(item, 'item_doc')"
                />
                <text
                  class="icon iconfont input-icon iconelipsis"
                  @click="popupMedia(item)"
                ></text>
              </view>
            </view>
          </view>
        </view>
        <comp-table
          ref="compTable"
          v-if="tableService && tableParam"
          :service="tableService"
          :param="tableParam"
          :addTitle="addTitle"
          :addtype="tableAddType"
          :btns="tableBtn"
        >
        </comp-table>
        <steps ref="steps" v-if="tabIndex == 2" :param="loadParam"></steps>
        <comp-page
          ref="compPage"
          v-if="mainData.guid && service"
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
      <timing
        v-if="tabIndex == 1 && childTabIndex == 2"
        :param="loadParam"
      ></timing>
    </scroll-view>
    <comp-media ref="media" v-if="tabIndex == 9"></comp-media>
  </view>
</template>

<script>
import util from "../../common/util";
import constants from "../../common/constants";
import behaviorTypeService from "../../service/hra/behaviorType";
import accessibilityCService from "../../service/hra/accessibilityC";
import warningService from "../../service/hra/warning";
import directiveService from "../../service/hra/directive";
import onSiteEquipmentService from "../../service/hra/onSiteEquipment";
import analysisService from "../../service/hra/analysis";
import psfService from "../../service/hra/psf";
import faultEventService from "../../service/hra/faultEvent";
import timingService from "../../service/hra/timing";
import typeCInfoService from "../../service/hra/typeCInfo";
import teamViewService from "../../service/hra/teamView"; 
import deptService from "../../service/person/dept";
import CBDTService from "../../service/hra/CBDT";
import timing from "./timing";
import steps from "./steps";
export default {
  data() {
    return {
      scrollHeight: 500,
      scrollTop: 0,
      title: "",
      mainData: {},
      tabIndex: 0,
      addTitle: "",
      infoType: "",
      childTabIndex: 0,
      tableBtn: true,
      cbdtTypes: ["pca", "pcb", "pcc", "pcd", "pce", "pcf", "pcg", "pch"],
      currCBDT: "pca",
      tabs: [
        {
          name: "行为分析",
          index: 0,
          service: behaviorTypeService
        },
        {
          name: "情景信息",
          index: 1,
          service: analysisService,
          child: [
            { name: "人因分析需求", service: analysisService, index: 0 },
            {
              name: "事件树、故障树文件",
              service: faultEventService,
              index: 1,
            },
            { name: "时序", service: null, index: 2 },
          ],
        },
        {
          name: "规程路径",
          index: 2,
          type: "procedure",
          service: typeCInfoService,
        },
        {
          name: "报警清单",
          index: 3,
          tableService: warningService,
          type: constants.INFO_TYPE.WARNING,
          service: typeCInfoService,
        },
        {
          name: "指示清单",
          index: 4,
          tableService: directiveService,
          type: constants.INFO_TYPE.DIRECTIVE,
          service: typeCInfoService,
        },
        {
          name: "主控班组信息",
          index: 5,
          type: "team",
          tableAddType: "team",
          service: typeCInfoService,
          tableService: teamViewService,
        },
        {
          name: "PSF",
          index: 6,
          service: psfService,
        },
        {
          name: "可达性",
          index: 7,
          service: accessibilityCService,
        },
        {
          name: "就地设备可操作性",
          index: 8,
          service: onSiteEquipmentService,
        },
        {
          name: "CBDT信息",
          index: 9,
        },
      ],
      //子页面配置项
      service: behaviorTypeService,
      tableService: null,
      //子页面加载数据 的参数
      loadParam: {},
      tableParam: null,
      tableAddType: "",
      team_id: "",
      team_index: "",
      team_name: "",
      teamList: [],
      psfTabIndex: 1,
      cbdtItems: [],
      currCbdtItems: [],
    };
  },
  components: {
    timing,
    steps,
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
          };
          this.tableParam = { foreign_id: this.mainData.guid };
          this.title = `${this.mainData.human_error_code} `;
          //查询主控班组 ID
          typeCInfoService
            .query({ foreign_id: this.mainData.guid, info_type: "team" })
            .then((data) => {
              if (data.length) {
                this.team_id = data[0].team_id;
                this.computeTeamIndex();
              }
            });

          CBDTService.initCBDT(this.mainData.guid, (datas) => {
            this.cbdtItems = datas;
            this.cbdtTabClick(this.currCBDT);
          });
        }
      },
    });

    deptService.queryTeams().then((datas) => {
      this.teamList = datas;
      this.computeTeamIndex();
    });
  },

  onShow(data) {
    console.log("typeAinfo onshow", data);
  },
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
  methods: {
    pageClick() {},
    computeTeamIndex() {
      if (this.teamList.length && this.team_id) {
        for (let i = 0; i < this.teamList.length; i++) {
          if (this.teamList[i].guid == this.team_id) {
            this.team_index = i;
            this.team_name = this.teamList[i].name;
          }
        }
      }
    },
    tabClick(tab, isChild) {
      //如果与当前一致,则直接退出该方法
      if (isChild) {
        if (this.childTabIndex == tab.index) return;
        this.childTabIndex = tab.index;
      } else {
        if (this.tabIndex == tab.index) return;
        this.tabIndex = tab.index;
      }
      if (tab.child) {
        this.childTabIndex = 0;
      }
      this.infoType = tab.type;
      //规程 报警 指示 主控班组信息,数据通过info_type区分
      if (tab.type) {
        this.loadParam = {
          foreign_id: this.mainData.guid,
          info_type: tab.type,
        };
      } else {
        this.loadParam = {
          foreign_id: this.mainData.guid,
        };
      }
      this.service = tab.service;
      this.tableService = tab.tableService;
      if (this.tableService) {
        this.tableParam = { foreign_id: this.mainData.guid };
        this.addTitle = "新增";
      } else {
        this.tableParam = null;
      }
      this.tableAddType = tab.tableAddType || "";
      if (tab.name == "主控班组信息") {
        this.tableBtn = false;
        this.tableParam = { deptId: this.team_id };
      } else {
        this.tableBtn = true;
      }

      if (tab.name == "PSF") {
        this.psfTabIndex = 1;
        this.loadParam.type = 1;
      }
    },
    psfTabClick(type) {
      this.psfTabIndex = type;
      this.loadParam = {
        foreign_id: this.mainData.guid,
        type: type,
      };
    },
    cbdtTabClick(type) {
      this.currCBDT = type;
      this.currCbdtItems = this.cbdtItems.filter(
        (item) => item.group_name == type
      );
    },
    beforeSave(data, fields) {
      if (this.tabs[this.tabIndex].type) {
        data.foreign_id = this.mainData.guid;
        data.info_type = this.infoType; // 标记
        if (this.infoType == "team") {
          data.team_id = this.team_id;
        }
      } else {
        data.foreign_id = this.mainData.guid;
      }
      if (this.tabs[this.tabIndex].name == "PSF") {
        data.type = this.psfTabIndex;
      }
      return true;
    },
    onSelectFile({ field, path, guid }) {
      this.$refs.compPage.setFilePath(field, path, guid);
    },

    back() {
      uni.navigateBack();
    },
    teamChange(index) {
      this.team_id = this.teamList[index].guid;
      this.team_index = index;
      this.team_name = this.teamList[index].name;
      this.tableParam = { deptId: this.team_id };
      this.$refs.compPage.autoSave();
      teamViewService.getTableData({ deptId: this.team_id }).then((datas) => {
        this.$refs.compTable.datas = datas;
      });
    },
    switchChange(item, e) {
      item.item_value = e.detail.value ? 1 : 0;
      CBDTService.update({ item_value: item.item_value, guid: item.guid });
    },
    textChange(item, field) {
      CBDTService.update({ [field]: item[field], guid: item.guid });
    },
    popupMedia(item) {
      this.$refs.media.popup(item.guid, "item_remark",CBDTService.tableName);
    },
    openSelectFilePage(item) {
      uni.navigateTo({
        url:
          "/pages/filesys/selectFile?fnName=onCBDTSelectFile&field=" +
          item.item_index,
      });
    },
    onSelectRegulation(datas) {
      this.$refs.steps.onSelectRegulation(datas);
    },
    onCBDTSelectFile({ field, path, guid }) {
      let item = this.currCbdtItems.filter(
        (item) => item.item_index == field
      )[0];
      item.item_doc = guid;
      CBDTService.update({ item_doc: guid, guid: item.guid });
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
.child-tab {
  line-height: 40px;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #eee;
  .item {
    text-align: left;
  }
  .item-title {
    color: #666;
    font-weight: bold;
    font-size: 13px;
    &.hover {
      color: #359dff;
    }
  }
  .split-line {
    color: #e8e8e8;
    padding: 0 20px;
    line-height: 40px;
  }
}
.team-warp {
  padding: 0 0 0 20px;
  display: flex;
  flex-direction: row;
  line-height: 40px;
  .uni-input-label {
    color: #666;
    margin-right: 15px;
  }
  color: #359dff;
}

.cbdt-warp {
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
    margin-top: 20px;
    border: 1px solid #f2f2f2;
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
