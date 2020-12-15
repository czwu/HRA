<template>
  <view class="container" @click="pageClick">
    <view class="uni-column">
      <view class="uni-row i-header">
        <text class="icon iconfont" style="color: #007aff" @click="back"
          >&#xe600;</text
        >
        <view class="uni-grow"></view>
        <text class="i-header-text">{{ title }}</text>
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
        <view class="i-list" v-if="datas.length">
          <scroll-view
            scroll-y="true"
            class="sv"
            :style="{ height: scrollHeight + 'px' }"
          >
            <view
              class="i-list-item uni-row"
              v-for="data in datas"
              v-bind:key="data.guid"
            >
              <text class="icon iconfont item-icon">&#xe66f;</text>
              <view
                class="uni-column uni-grow"
                style="padding: 10px 0 10px 20px"
              >
                <view class="list-item-content" @click="viewData(data)">
                  <text>{{
                    data.system ? data.human_error_code : data.code
                  }}</text>
                  <text style="padding: 0 5px" v-if="!data.system"
                    >({{ data.human_error_code }})</text
                  >
                  <text
                    class="color-text color-text-num"
                    v-if="data.device_type"
                    >{{ data.device_type || data.system }}</text
                  >
                  <text
                    class="color-text color-text-num"
                    style="margin-left: 15px"
                    v-if="data.system"
                    >{{ data.system }}</text
                  >
                  <text
                    class="color-text color-text-2"
                    v-show="data.accident"
                    >{{ data.accident }}</text
                  >
                  <view class="uni-grow"></view>
                  <view style="padding: 0 15px">
                    <text class="icon iconfont">&#xe601;</text>
                  </view>
                  <view @click.stop="showPopMenus('2', data, $event)">
                    <text class="icon iconfont">&#xe66e;</text>
                  </view>
                </view>
                <view class="desc">
                  <text class="color-text-desc">{{
                    data.device_funciton || data.human_error_desc
                  }}</text>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
        <view class="no-content" @click="toAddData()" v-if="!datas.length">
          <view>
            <image
              class="add-img"
              src="/static/images/img_new.png"
              mode="widthFix"
            />
          </view>
          <view>
            <text class="add-text">{{ addText }}</text>
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
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import uniPopupMessage from "@/components/uni-popup/uni-popup-message.vue";
import uniPopupDialog from "@/components/uni-popup/uni-popup-dialog.vue";
import util from "../../common/util";
import typeAService from "../../service/hra/typeA";
import typeCService from "../../service/hra/typeC";
export default {
  data() {
    return {
      popMenuVisible: false,
      scrollHeight: 0,
      scrollTop: 0,
      title: "分析任务",
      service: null,
      allMenus: [
        { name: "新建任务", type: "1", icon: "iconadd" },
        { name: "导入", type: "1", icon: "iconimport2" },
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
      datas: [],
      addText: "点击这里添加数据",
    };
  },
  components: {
    uniPopup,
    uniPopupMessage,
    uniPopupDialog,
  },
  computed: {},
  mounted() {
    this.initScroll();
  },
  onShow() {
    uni.getStorage({
      key: "currTask",
      success: (val) => {
        if (val.data) {
          this.mainTask = val.data;
          this.service =
            this.mainTask.htype == "A类" ? typeAService : typeCService;
          this.loadTaskChildren();
        }
      },
    });
  },
  methods: {
    initScroll() {
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
    },
    scroll(e) {
      this.scrollTop = parseInt(e.detail.scrollTop);
      this.popMenuVisible = false;
    },
    loadTaskChildren() {
      return this.service
        .query({ task_id: this.mainTask.guid })
        .then((datas) => {
          this.datas = datas;
        });
    },
    remove(obj) {
      uni.showModal({
        title: "提示",
        content: "是否确认删除该任务?",
        success: (res) => {
          if (res.confirm) {
            this.service.remove(obj.guid).then(() => {
              this.loadTaskChildren();
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
      let guid = this.service.genGuid();
      this.service.copy(data, "code", guid).then((newData) => {
        this.loadTaskChildren();
      });
    },
    viewData(data) {
      uni.setStorageSync("currData", data);
      uni.navigateTo({ url: data.system ? "/pages/hra/typeCInfo":"/pages/hra/typeAInfo" });
    },
    back() {
       uni.navigateBack();
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
      let url = "";
      if (this.mainTask.htype == "A类") {
        url = "/pages/hra/addTypeA?task_id=" + this.mainTask.guid;
      } else {
        url = "/pages/hra/addTypeC?task_id=" + this.mainTask.guid;
      }
      uni.navigateTo({
        url,
      });
    },
    menuClick(menu) {
      if (menu.type == "1") {
        if (menu.name == "新建任务") {
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
          let url=""
          if (this.mainTask.htype == "A类") {
            url = "/pages/hra/addTypeA?task_id=" + this.mainTask.guid;
          } else {
            url = "/pages/hra/addTypeC?task_id=" + this.mainTask.guid;
          }
          uni.navigateTo({
            url
          });
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
  color: #999;
  line-height: 20px;
  height: 20px;
}
.icon.job-icon {
  font-size: 30px;
  margin: auto;
}
</style>
