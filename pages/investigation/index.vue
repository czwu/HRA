<template>
  <view class="container" @click="pageClick" :class="screenOrientation">
    <uni-tab-bar :class="screenOrientation" index="3"></uni-tab-bar>
    <view class="uni-column">
      <view class="uni-row i-header">
        <view class="uni-grow"></view>
        <text class="i-header-text">问题普查</text>
        <view class="uni-grow"></view>
        <view
          class
          style="transform: rotate(90deg)"
          @click.stop="showPopMenus('1', null, $event)"
        >
          <text class="icon iconfont">&#xe66e;</text>
        </view>
      </view>
      <view class="uni-grow content-panel">
        <view class="i-list" v-if="list.length">
          <scroll-view
            scroll-y="true"
            class="sv"
            :style="{ height: scrollHeight + 'px' }"
            @scroll="scroll"
          >
            <view
              class="i-list-item uni-row"
              v-for="data in list"
              v-bind:key="data.guid"
              @click="viewData(data)"
            >
              <text class="icon iconfont item-icon">&#xe66f;</text>
              <view
                class="uni-column uni-grow"
                style="padding: 10px 0 10px 20px"
              >
                <view class="list-item-content">
                  <text>{{ data.code }}</text>
                  <view style="width: 20px"></view>
                  <view class="uni-grow"></view>
                </view>
                <view class="desc">
                  <text class="color-text-desc">{{ data.descrip }}</text>
                </view>
              </view>
              <view style="padding: 0 15px">
                <text class="icon iconfont row-icon" style="">&#xe601;</text>
              </view>
              <view
                @click.stop="showPopMenus('2', data, $event)"
                style="padding-left: 10px"
              >
                <text
                  class="icon iconfont row-icon"
                  style="font-weight: bold; font-size: 22px"
                  >&#xe66e;</text
                >
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
            <text class="add-text">点击这里新增设备信息</text>
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
import moduleService from "../../service/investigation/device";

import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      popMenuVisible: false,
      scrollHeight: 500,
      scrollTop: 0,
      allMenus: [
        { name: "新增设备", type: "1", icon: "iconadd" },
        { name: "编辑", type: "2", icon: "iconccedit" },
        { name: "拷贝", type: "2", icon: "iconcopy" },
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
    };
  },
  onShow() {
    this.loadList();
  },
  computed: {
    ...mapState({
      screenOrientation: "screenOrientation",
    }),
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
    scroll(e) {
      this.scrollTop = parseInt(e.detail.scrollTop);
      this.popMenuVisible = false;
    },
    loadList() {
      return moduleService.queryAll().then((datas) => {
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
      moduleService.copy(data, "code", guid).then((newData) => {
        this.loadList();
      });
    },
    viewData(data) {
      uni.navigateTo({
        url: `/pages/investigation/investigation?guid=${data.guid}&code=${data.code}`,
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
    toAddData() {
      uni.setStorageSync("editData", "");
      uni.navigateTo({ url: "/pages/investigation/addDevice" });
    },

    menuClick(menu) {
      if (menu.type == "1") {
        this.toAddData();
      } else if (menu.type == "2") {
        if (menu.name == "删除") {
          this.remove(this.data4PopMenu);
        } else if (menu.name == "编辑") {
          uni.setStorageSync("editData", this.data4PopMenu);
          uni.navigateTo({ url: "/pages/investigation/addDevice" });
        } else if (menu.name == "拷贝") {
          this.copy(this.data4PopMenu);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped >
.i-header {
  padding: 0 15px 0 20px;
  height: 56px;
  line-height: 56px;
  border-bottom: 1px solid #f0f0f0;
  > .i-header-text {
    color: #333;
    font-size: 18px;
    padding: 0 15px;
  }
  .icon.iconfont {
    font-size: 20px;
    font-weight: bold;
  }
}
.i-list {
  padding-left: 20px;
}

.i-list-item {
  box-sizing: border-box;
  height: 72px;
  line-height: 25px;
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
}

.list-item-content {
  font-size: 16px;
  color: #666;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  .icon.iconfont {
    font-size: 20px;
  }
}
.icon.iconfont {
  vertical-align: middle;
  font-size: 16px;
  color: #b2b2b2;
  &:hover {
    color: #007aff;
  }
}
.color-text {
  margin: auto 5px;
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

.color-text-htype {
  background: rgba(236, 221, 87, 0.5);
  color: rgb(228, 141, 60);
}
.color-text-scope {
  background: rgba(204, 87, 72, 0.3);
  color: rgb(204, 87, 72);
}
.color-text-desc {
  font-size: 13px;
  color: #999;
  height: 20px;
}
.icon.job-icon {
  font-size: 30px;
  margin: auto;
}
.icon.row-icon {
  line-height: 72px;
  font-size: 18px;
  font-weight: bold;
  color: #ccc;
}
</style>
