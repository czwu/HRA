<template>
  <view @click="pageClick">
    <view class="uni-column">
      <view class="uni-grow content-panel">
        <view>
          <view class="list-panel">
            <view class="uni-row">
              <text class="btn-txt primary" @click="toAddData()"
                >添加规程路径</text
              >
              <text
                class="btn-txt"
                @click="expand(true)"
                v-show="list.length > 1"
                >全部展开</text
              >
              <text
                class="btn-txt"
                @click="expand(false)"
                v-show="list.length > 1"
                >全部收缩</text
              >
            </view>
            <view class="" v-if="list.length">
              <view
                class="uni-column list-item"
                v-for="data in list"
                v-bind:key="data.guid"
              >
                <view
                  class="uni-row uni-grow title-row"
                  @click="expand(!data.expand, data)"
                >
                  <text class="step-num">{{ data.step_num }}</text>
                  <text class="regulation-code"
                    >({{ data.regulation_code }})
                  </text>
                  <view style="width: 30px"></view>
                  <text class="step-name">{{ data.step_name }}</text>
                  <text class="color-text">{{ data.action_type }}</text>
                  <view class="uni-grow"></view>
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
                </view>
              </view>
            </view>
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
import moduleService from "../../service/hra/typeCRegulation";
import regulationItemService from "../../service/basic/regulationItem";

export default {
  props: {
    param: {
      type: Object, //配合autoload使用, 加载数据的请求参数
      default: () => {},
    },
  },
  data() {
    return {
      popMenuVisible: false,
      scrollHeight: 100,
      scrollTop: 0,
      allMenus: [
        { name: "删除", type: "2", icon: "iconsystem-manage-remove red" },
      ],
      popStyle: {
        top: 0,
        right: "50px",
      },
      roles: ["ROA", "ROB", "ROC", "值长"],
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
    };
  },
  mounted() {
    this.loadList();
  },
  methods: {
    scroll(e) {
      this.scrollTop = parseInt(e.detail.scrollTop);
      this.popMenuVisible = false;
    },
    loadList() {
      return moduleService
        .query({ foreign_id: this.param.foreign_id })
        .then((datas) => {
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
      if (menu.type == "2") {
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
          step.foreign_id = this.param.foreign_id;
          step.step_guid = step.guid;
          step.guid = moduleService.genGuid();
          datalist.push(step);
        }
      });
      moduleService
        .removeBy({
          regulation_code: datas[0].regulation_code,
          foreign_id: this.param.foreign_id,
        })
        .then(() => {
          moduleService.insertList(datalist, "multi").then(() => {
            this.loadList();
          });
        });
    },

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
      background:#e8f4ff;
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
  background: #eee;
  line-height: 30px;
  text-align: center;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
  &.primary {
    background: rgba(149, 181, 250, 0.438);
    color: #007aff;
  }
}
</style>
