<template>
  <view class="container" @click="pageClick">
    <view class="uni-column">
      <view class="uni-row i-header">
        <text
          class="icon iconfont iconright1"
          style="color: #007aff"
          @click="back()"
        ></text>
        <view class="uni-grow"></view>
        <text class="i-header-text">{{ parentName }}</text>
        <view class="uni-grow"></view>
        <view
          class
          style="transform: rotate(90deg)"
          @click.stop="showPopMenus('1', null, $event)"
        >
          <text class="icon iconfont">&#xe66e;</text>
        </view>
      </view>
      <view class="i-tab uni-row">
        <view
          class="tab-item"
          @click="tabClick(0)"
          :class="{ active: tabIndex == 0 }"
          >综合数据采集</view
        >
        <view
          class="tab-item"
          @click="tabClick(1)"
          :class="{ active: tabIndex == 1 }"
          >基于规程任务数据采集</view
        >
      </view>
      <view class="uni-grow content-panel">
        <view class="i-list" v-if="list.length">
          <scroll-view
            scroll-y="true"
            class="sv"
            @scroll="scroll"
            :style="{ height: scrollHeight + 'px' }"
          >
            <view
              class="i-list-item uni-row"
              v-for="data in list"
              v-bind:key="data.guid"
              @click="viewData(data)"
            >
              <text class="icon iconfont item-icon">&#xe66f;</text>
              <view class="uni-column uni-grow" style="padding: 0 20px">
                <view class="list-item-content">
                  <text>{{ data.name }}</text>
                  <view style="width: 20px"></view>
                  <text class="color-text color-text-1">{{
                    data.start_time | dateString
                  }}</text>
                  <text class="color-text color-text-2">{{
                    data.end_time | dateString
                  }}</text>
                  <text class="color-text color-text-3">{{
                    data.team_name
                  }}</text>
                  <view class="uni-grow"></view>
                </view>
                <!-- <view class="desc uni-row uni-flex" style="line-height: 30px">
                  <text class="color-text-desc">{{ data.desc }}</text>
                </view> -->
              </view>
              <view>
                <text
                  @click.stop="showPopMenus('2', data, $event)"
                  style="font-size: 26px; line-height: 72px"
                  class="icon iconfont iconelipsis"
                ></text>
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
            <text class="add-text">点击这里新增场景/事件</text>
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
import moduleService from "../../service/effect/scene";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      popMenuVisible: false,
      scrollHeight: 500,
      scrollTop: 0,
      allMenus: [
        { name: "新增场景", type: "1", icon: "iconadd" },
        { name: "导入", type: "1", icon: "iconimport2" },
        { name: "编辑", type: "2", icon: "iconccedit" },
        { name: "删除", type: "2", icon: "iconsystem-manage-remove red" },
      ],
      popStyle: {
        top: 0,
        right: "50px",
      },
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
      tabIndex: 0,
    };
  },
  onLoad(options) {
    this.parentId = options.guid;
    this.parentName = options.name;
    this.loadList();
  },
  onShow() {
    if (this.parentId) {
      this.loadList();
    }
  },
  mounted() {
    let _this = this;
    uni.getSystemInfo({
      success(res) {
        let wHeight = res.windowHeight;
        let titleH = uni.createSelectorQuery().select(".content-panel");
        titleH
          .boundingClientRect((data) => {
            _this.scrollHeight = wHeight - data.top - 90;
          })
          .exec();
      },
    });
    this.loadList();
  },
  methods: {
    tabClick(index) {
      this.tabIndex = index;
    },
    scroll(e) {
      this.scrollTop = parseInt(e.detail.scrollTop);
      this.popMenuVisible = false;
    },
    loadList() {
      return moduleService
        .query({ foreign_id: this.parentId })
        .then((datas) => {
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
    copy(data) {
      let guid = moduleService.genGuid();
      moduleService.copy(data, "name", guid).then((newData) => {
        this.loadList();
      });
    },
    viewData(data) {
      uni.setStorageSync("currData", data);
      uni.navigateTo({
        url: !this.tabIndex
          ? "/pages/effect/toe?guid=" + data.guid
          : `/pages/isv/steps?guid=${data.guid}&name=${data.name}&showTab=true`,
      });
    },
    showPopMenus(type, data, event) {
      this.popMenus = this.allMenus.filter((menu) => menu.type == type);
      let top = event.currentTarget.offsetTop;
      this.popStyle.top = top - this.scrollTop + 10 + "px";
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
        if (menu.name == "新增场景") {
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
          uni.navigateTo({ url: "/pages/effect/addScene" });
        }
      }
    },
    toAddData() {
      uni.setStorageSync("editData", "");
      uni.navigateTo({ url: "/pages/effect/addScene?guid=" + this.parentId });
    },
    back() {
      uni.navigateBack();
    },
  },
};
</script>

<style lang="scss" scoped >
.i-list-item {
  height: 72px;
  line-height: 72px;
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
    font-weight: normal;
  }
}

.color-text-1 {
  background: rgba(232, 244, 255, 1);
}
.color-text-2 {
  background: rgba(236, 221, 87, 0.5);
  color: rgb(228, 141, 60);
}
.color-text-3 {
  background: rgba(204, 87, 72, 0.3);
  color: rgb(204, 87, 72);
}
.color-text-desc {
  color: #999;
}
.i-tab {
  .tab-item {
    margin: 0 0 0 20px;
    padding: 10px 0 2px 0;
    color: #666;
    &.active {
      border-bottom: 3px solid #98bef7;
      color: #359dff;
    }
  }
}
// .i-tab {
//   display: flex;
//   font-size: 13px;
//   flex-direction: row;
//   color: #666;
//   padding: 10px 20px 1px 10px;
//   border-bottom: 1px solid #f2f2f2;
//   .tab-item {
//     background: #f8f8f8;
//     padding: 2px 10px;
//     box-sizing: content-box;
//     margin-right: 2px;
//     &.active {
//       color: #007aff;
//       border-bottom: 1px solid #007aff;
//       background: #e5e9f8;
//     }
//   }
// }
</style>
