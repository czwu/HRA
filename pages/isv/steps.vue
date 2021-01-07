<template>
  <view class="container" @click="pageClick">
    <view class="uni-column">
      <view class="uni-row i-header">
        <text
          class="icon iconfont iconright1"
          style="color: #007aff"
          @click="back()"
        ></text>
        <view class="" style="width: 20px"></view>
        <text class="i-header-text">{{ parentName }}</text>
        <view class="uni-grow"></view>
        <view
          class
          style="transform: rotate(90deg)"
          @click.stop="showPopMenus('1', null, $event)"
        >
          <text class="icon iconfont iconelipsis"></text>
        </view>
      </view>
      <!-- <uni-breadcrumb :datas="breadData"></uni-breadcrumb> -->
      <view class="i-tab-layout" v-if="showTab">
        <view class="i-tab">
          <view class="tab-item active">操作流程</view>
        </view>
      </view>
      <view class="uni-grow content-panel">
        <view v-if="list.length">
          <scroll-view
            scroll-y="true"
            class="sv"
            @scroll="scroll"
            :style="{ height: scrollHeight + 'px' }"
          >
            <view class="list-panel">
              <view class="uni-row">
                <view class="uni-grow"> </view>
                <picker
                  style="line-height: 46px"
                  mode="selector"
                  :range="roles"
                  :value="roles.indexOf(defaultRole)"
                  @change="defaultRoleChange($event.detail.value)"
                >
                  <text class="btn-txt1">默认角色 : {{ defaultRole }}</text>
                </picker>
                <text class="btn-txt" @click="expand(true)">全部展开</text>
                <text class="btn-txt" @click="expand(false)">全部收缩</text>
              </view>
              <view
                class="uni-column list-item"
                v-for="data in list"
                v-bind:key="data.guid"
              >
                <view
                  class="uni-row uni-grow title-row"
                  @click="expand(!data.expand, data)"
                >
                  <text
                    class="icon iconfont color3"
                    :class="data.has_req ? 'iconchecked' : 'iconquestion1'"
                  ></text>
                  <text class="step-num">{{ data.step_num }}</text>
                  <text class="regulation-code"
                    >({{ data.regulation_code }})
                  </text>
                  <view style="width: 30px"></view>
                  <text class="step-name">{{ data.step_name }}</text>
                  <view class="uni-grow"></view>
                  <text
                    style="color: #007aff; margin-right: 20px"
                    @click="goPerformance(data)"
                    >评价</text
                  >
                  <text
                    class="icon iconfont iconshousuo"
                    style="font-size: 12px; margin-right: 15px"
                    :style="data.expand ? 'transform: rotate(90deg)' : ''"
                  ></text>
                  <text
                    @click.stop="showPopMenus('2', data, $event)"
                    class="icon iconfont iconelipsis"
                    style="font-weight: bold; font-size: 24px"
                  ></text>
                </view>
                <view class="body-row uni-row" v-show="data.expand">
                  <view
                    class="action-item uni-grow"
                    @click="selectAction(data, 1)"
                    :class="{ selected: data.expected == 1 }"
                  >
                    <text class="action-text">
                      {{ data.unexpected_action_title }}
                    </text>
                  </view>
                  <view class="" style="width: 10px"></view>
                  <view
                    class="action-item uni-grow"
                    @click="selectAction(data, 0)"
                    :class="{ selected: data.expected === 0 }"
                  >
                    <text class="action-text">
                      {{ data.unexpected_action_title }}
                    </text>
                  </view>
                  <view class="op-item uni-column">
                    <view class="text-item" @click.stop="setBegin(data)">
                      <text
                        class="icon iconfont iconshijian"
                        :class="{ active: data.start_time }"
                      ></text>
                      <text :class="{ color1: data.start_time }">
                        {{ data.start_time || "开始时间" }}
                      </text></view
                    >
                    <view class="text-item" @click.stop="setEnd(data)">
                      <text
                        class="icon iconfont"
                        :class="{
                          active: data.end_time,
                          iconshijian: !data.end_time,
                          iconchecked: data.end_time,
                        }"
                      ></text>
                      <text :class="{ color2: data.end_time }">
                        {{ data.end_time || "完成时间" }}
                      </text>
                    </view>
                    <picker
                      mode="selector"
                      :range="roles"
                      range-key="name"
                      :value="roles.indexOf(data.role)"
                      @change="roleChange(data, $event.detail.value)"
                    >
                      <view class="text-item" :class="{ active: data.role }">
                        <text
                          class="icon iconfont iconyonghuming"
                          :class="{ active: data.role }"
                        ></text
                        >{{ data.role || "角色" }}</view
                      >
                    </picker>
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
        <view class="no-content" @click="toAddData()" v-if="!list.length">
          <view>
            <image
              class="add-img"
              src="/static/images/img_new.png"
              mode="widthFix"
            />
          </view>
          <view>
            <text class="add-text">点击这里添加规程</text>
          </view>
        </view>
      </view>
    </view>
    <view class="popup pop-menu" v-show="popMenuVisible" :style="popStyle">
      <view
        class="pop-menu-item uni-row"
        v-for="menu in popMenus"
        v-bind:key="menu.name"
        @click="menuClick(menu)"
      >
        <view class="iconfont" :class="menu.icon"></view>
        <text style="padding-left: 10px">{{ menu.name }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import util from "../../common/util";
import moduleService from "../../service/isv/situationStep";
import regulationItemService from "../../service/basic/regulationItem";
import situationIssueService from "../../service/isv/situationIssue";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      popMenuVisible: false,
      scrollHeight: 100,
      scrollTop: 0,
      allMenus: [
        { name: "添加规程", type: "1", icon: "iconadd" },
        { name: "编辑", type: "2", icon: "iconccedit" },
        { name: "删除", type: "2", icon: "iconsystem-manage-remove red" },
      ],
      popStyle: {
        top: 0,
        right: "50px",
      },
      roles: ["ROA", "ROB", "ROC", "值长", "副值长", "安工"],
      popMenus: [],
      data4PopMenu: {}, //对应当前弹出菜单的数据对象
      editInfo: {
        title: "",
        value: "",
        placeholder: "",
      },
      list: [],
      parentId: "",
      parentName: "",
      showTab: false,
      breadData: [],
      defaultRole: uni.getStorageSync("defaultRole") || "副值长",
    };
  },
  onLoad(options) {
    this.parentId = options.guid;
    this.parentName = options.name;
    this.showTab = options.showTab;
    if (this.showTab) {
    } else {
    }
  },

  onShow() {
    if (this.parentId) {
      this.loadList();
    }
  },
  mounted() {
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
      this.loadList();
    }, 100);
  },
  methods: {
    scroll(e) {
      this.scrollTop = parseInt(e.detail.scrollTop);
      this.popMenuVisible = false;
    },
    loadList() {
      return moduleService.queryByForeignId(this.parentId).then((datas) => {
        datas.forEach((item) => (item.expand = true));
        this.list = datas;
      });
    },
    remove(obj) {
      uni.showModal({
        title: "提示",
        content: "是否确认删除该任务?",
        success: (res) => {
          if (res.confirm) {
            moduleService.remove(obj.guid).then(() => {
              this.loadList();
              uni.showToast({
                title: "删除成功!",
                duration: 2000,
              });
            });
          }
        },
      });
    },

    viewData(data) {
      uni.setStorageSync("editData", data);
      uni.navigateTo({
        url: "/pages/isv/addStep",
      });
    },
    showPopMenus(type, data, event) {
      this.popMenus = this.allMenus.filter((menu) => menu.type == type);
      let top = event.currentTarget.offsetTop;
      this.popStyle.top = top - (type == 1 ? 0 : this.scrollTop) + 10 + "px";
      this.popMenuVisible = true;
      this.data4PopMenu = data;
    },
    pageClick() {
      setTimeout(() => {
        this.popMenuVisible = false;
      }, 10);
    },

    menuClick(menu) {
      if (menu.type == "1") {
        if (menu.name == "添加规程") {
          this.toAddData();
        } else if (menu.name == "导入") {
          uni.showToast({
            title: "该功能暂未实现!",
            duration: 2000,
            icon: "none",
          });
        }
      } else if (menu.type == "2") {
        if (menu.name == "删除") {
          this.remove(this.data4PopMenu);
        } else if (menu.name == "编辑") {
          uni.setStorageSync("editData", this.data4PopMenu);
          uni.navigateTo({ url: "/pages/isv/addStep" });
        }
      }
    },
    toAddData() {
      let step_guids = [];
      this.list.forEach((step) => {
        step_guids.push(step.step_guid);
      });
      uni.setStorageSync("currStepGuids", step_guids);
      uni.navigateTo({
        url: "/pages/isv/selectRegulation?guid=" + this.parentId,
      });
    },
    onSelectRegulation(datas) {
      let datalist = [];
      let stepmap = {};
      this.list.forEach((step) => {
        stepmap[step.step_guid] = step;
      });
      //按照序号排序
      datas.sort(function (a, b) {
        return a.step_num - b.step_num;
      });
      datas.forEach((step) => {
        if (stepmap[step.guid]) {
          datalist.push(stepmap[step.guid]);
        } else {
          datalist.push({
            guid: regulationItemService.genGuid(),
            foreign_id: this.parentId,
            step_guid: step.guid,
            step_num: step.step_num,
            step_name: step.step_name,
            regulation_code: step.regulation_code,
            action_title: step.action_title,
            unexpected_action_title: step.unexpected_action_title,
            start_time: "",
            end_time: "",
            duration: "",
            estimated_time: "",
            role: this.defaultRole,
            tutelage: "",
            remark: "",
          });
        }
      });
      moduleService
        .removeBy({
          regulation_code: datas[0].regulation_code,
          foreign_id: this.parentId,
        })
        .then(() => {
          moduleService.insertList(datalist, "multi").then(() => {
            this.loadList();
          });
        });
    },
    back() {
      uni.navigateBack();
    },

    setBegin(item) {
      item.start_time = util.dateFormat("hh:mm:ss", new Date());
      if (item.end_time && item.start_time > item.end_time) {
        item.end_time = "";
      }
      moduleService.update({
        guid: item.guid,
        start_time: item.start_time,
        end_time: item.end_time,
      });
    },
    setEnd(item) {
      item.end_time = util.dateFormat("hh:mm:ss", new Date());
      var duration = "";
      if (item.start_time && item.end_time) {
        duration = this.computeDif(item.start_time, item.end_time);
      }
      moduleService.update({
        guid: item.guid,
        end_time: item.end_time,
        duration
      });
    },
    computeDif(start_time, end_time) {
      let arr = start_time.split(":"),
        arr2 = end_time.split(":");
      let time1 = arr[0] * 3600 + arr[1] * 60 + arr[2] * 1;
      let time2 = arr2[0] * 3600 + arr2[1] * 60 + arr2[2] * 1;
      let dif = time2 - time1;
      let s = dif % 60,
        min = Math.floor(dif / 60) % 60,
        hour = Math.floor(dif / 3600);
      s = s < 10 ? "0" + s : s;
      min = min < 10 ? "0" + min : min;
      hour = hour < 10 ? "0" + hour : hour;
      return `${hour}:${min}:${s}`;
    },
    // selectAction(data, field) {
    //   data[field] = data[field] ? 0 : 1;
    //   moduleService.update({
    //     guid: data.guid,
    //     [field]: data[field],
    //   });
    // },
    selectAction(data, val) {
      if ((data.expected && val) || (data.expected === 0 && !val)) {
        data.expected = "";
        return;
      }
      data.expected = val ? 1 : 0;
      moduleService.update({
        guid: data.guid,
        expected: data.expected,
      });
    },
    roleChange(data, index) {
      data.role = this.roles[index];
      moduleService.update({
        guid: data.guid,
        role: data.role,
      });
    },
    defaultRoleChange(index) {
      this.defaultRole = this.roles[index];
      uni.setStorageSync("defaultRole", this.defaultRole);
    },
    goPerformance(data) {
      uni.navigateTo({
        url:
          "/pages/effect/performance?type=2&guid=" +
          data.guid +
          "&name=" +
          data.step_name,
      });
    },
    expand(bool, data) {
      if (data) {
        data.expand = bool;
      } else {
        this.list.forEach((item) => (item.expand = bool));
      }
    },
  },
};
</script>

<style lang="scss" scoped >
.i-header {
  .icon.iconfont {
    font-weight: bold;
    font-size: 20px !important;
  }
}
.icon.iconfont {
  vertical-align: middle;
  font-size: 16px;
  color: #b2b2b2;
  &:active {
    color: #007aff;
  }
}
.list-panel {
  padding: 0 15px;
  .list-item {
    margin-bottom: 10px;
  }
}
.title-row {
  font-size: 13px;
  background: #f2f2f2;
  line-height: 40px;
  padding: 0 10px;
  .regulation-code,
  .step-num {
    font-weight: bold;
    padding-left: 10px;
    color: #666;
  }
  .step-name {
    color: #007aff;
  }
}
.body-row {
  .action-item {
    padding: 10px;
    color: #999;
    line-height: 18px;
    font-size: 13px;
    border: 1px solid #f2f2f2;
    &.selected {
      color: #007aff;
      background: #e8f4ff;
    }
  }
  .op-item {
    width: 140px;
    padding: 10px 0;
    line-height: 30px;
    .text-item {
      margin-top: 10px;
      color: #666;
      .icon.iconfont {
        padding: 10px;
        font-weight: normal;
        &.active {
          color: #007aff;
        }
      }
      &.active {
        color: #007aff;
      }
    }
    .iconchecked {
      color: rgb(231, 143, 12) !important;
    }
  }
}
.color1 {
  color: #007aff;
}
.color2 {
  color: rgb(231, 143, 12);
}
.icon.iconfont.color3 {
  color: rgb(219, 200, 26);
  font-weight: normal;
  &.iconchecked {
    color: rgb(5, 116, 55);
  }
}
.i-tab-layout {
  padding: 10px 20px;
  .i-tab {
    display: flex;
    font-size: 13px;
    flex-direction: row;
    color: #666;
    border-bottom: 1px solid #f2f2f2;
    .tab-item {
      background: #f8f8f8;
      padding: 2px 10px;
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
.btn-txt {
  padding: 0 10px;
  margin: 10px 0px 10px 10px;
  height: 30px;
  line-height: 30px;
  background: #007aff;
  color: #fff;
}
.btn-txt1 {
  text-align: left;
  display: inline-block;
  margin: 10px 0px 10px 10px;
  height: 30px;
  line-height: 30px;
  width: 120px;
  color: #007aff;
}
.icon.iconfont.iconpingfen {
  color: rgb(243, 211, 30) !important;
}
</style>
