<template>
  <view class="container" @click="pageClick">
    <view class="uni-column">
      <view class="uni-row i-header">
        <text class="icon iconfont" style="color: #007aff" @click="back"
          >&#xe600;</text
        >
        <text class="i-header-text">情境表</text>
        <view class="uni-grow"></view>
        <view
          class
          style="transform: rotate(90deg)"
          @click.stop="showPopMenus('1', null, $event)"
        >
          <text class="icon iconfont">&#xe66e;</text>
        </view>
      </view>

      <view class="i-tab">
        <view class="tab-item active">情境版本</view>
        <view class="tab-item" @click="goScore()">评分</view>
      </view>
      <view class="uni-grow">
        <view class="i-list">
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
            >
              <view class="uni-column uni-grow">
                <view class="list-item-content" @click="viewData(data)">
                  <text class="icon iconfont item-icon">&#xe66f;</text>
                  <text style="padding-left: 15px">{{ data.name }} </text>

                  <view class="uni-grow"></view>
                  <text class="created-time"
                    >{{ formatDate(data.created_at) }}
                  </text>
                  <view>
                    <text class="icon iconfont">&#xe601;</text>
                  </view>
                  <view
                    style="margin-left: 25px"
                    @click.stop="showPopMenus('2', data, $event)"
                  >
                    <text class="icon iconfont">&#xe66e;</text>
                  </view>
                </view>
              </view>
            </view>
            <view class="no-content" @click="addData()" v-if="!list.length">
              <view>
                <image
                  class="add-img"
                  src="/static/images/img_new.png"
                  mode="widthFix"
                />
              </view>
              <view> <text class="add-text">点击这里添加情境版本</text> </view>
            </view>
          </scroll-view>
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
    <uni-popup ref="popup" type="center">
      <uni-popup-dialog
        type="info"
        mode="input"
        @confirm="save"
        :title="editInfo.title"
        :value="editInfo.value"
        :placeholder="editInfo.placeholder"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import uniPopupMessage from "@/components/uni-popup/uni-popup-message.vue";
import uniPopupDialog from "@/components/uni-popup/uni-popup-dialog.vue";
import moduleService from "../../service/isv/situationVersion";
import util from "../../common/util";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      popMenuVisible: false,
      allMenus: [
        {
          name: "新建版本",
          type: "1",
          icon: "iconadd",
        },
        {
          name: "导入",
          type: "1",
          icon: "iconimport2",
        },
        {
          name: "编辑",
          type: "2",
          icon: "iconccedit",
        },
        {
          name: "拷贝",
          type: "2",
          icon: "iconcopy",
        },
        {
          name: "删除",
          type: "2",
          icon: "iconsystem-manage-remove red",
        },
      ],
      winHeight: 0,
      scrollHeight: 0,
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
      searchVal: "",
      list: [],
      parentId: "",
      parentName: "",
    };
  },
  components: {
    uniPopup,
    uniPopupMessage,
    uniPopupDialog,
  },
  onReady() {
    let _this = this;
    uni.getSystemInfo({
      success: (res) => {
        this.winHeight = res.windowHeight;
        uni
          .createSelectorQuery()
          .select(".sv")
          .boundingClientRect((data) => {
            _this.scrollHeight = res.windowHeight - data.top - 85;
          })
          .exec();
      },
    });
  },
  onLoad(options) {
    this.parentId = options.guid || "GUID001";
    this.parentName = options.name;
    this.loadList();
  },
  onShow() {},
  computed: {},
  methods: {
    showPopMenus(type, data, event) {
      this.popMenus = this.allMenus.filter((menu) => menu.type == type);
      let top = event.currentTarget.offsetTop;
      this.popStyle.top = top + 10 + "px";
      this.popMenuVisible = true;
      this.data4PopMenu = data;
      let popHeight = this.popMenus.length * 40 + 20;
      if (top + popHeight > this.winHeight - 60) {
        this.popStyle.top = this.winHeight - 90 - popHeight + "px";
      }
    },
    pageClick() {
      setTimeout(() => {
        this.popMenuVisible = false;
      }, 10);
    },
    scroll(e) {
      this.scrollTop = parseInt(e.detail.scrollTop);
      this.popMenuVisible = false;
    },
    loadList() {
      return moduleService
        .query({
          foreign_id: this.parentId,
        })
        .then((datas) => {
          this.list = datas;
        });
    },
    goScore() {
      uni.navigateTo({
        url: "/pages/isv/score?guid=" + this.parentId,
        animationType: "none",
      });
    },
    addData() {
      this.data4PopMenu = {};
      this.editInfo.title = "新建情境版本";
      this.editInfo.value = "";
      this.editInfo.placeholder = "请输入版本名称";
      this.$refs.popup.open();
    },
    editData(data) {
      this.editInfo.title = "版本名称修改";
      this.editInfo.value = data.name;
      this.editInfo.placeholder = "请输入版本名称";
      this.$refs.popup.open();
    },
    viewData(data) {
      uni.navigateTo({
        url: `/pages/isv/steps?guid=${data.guid}&name=${data.name}`,
      });
    },
    formatDate(time) {
      return util.dateFormat("yyyy-MM-dd", new Date(time * 1000));
    },
    save(done, val) {
      let name = val.trim();
      let repeat = this.list.filter(
        (d) => d.name == name && this.data4PopMenu.guid != d.guid
      );
      if (repeat.length) {
        uni.showToast({
          icon: "none",
          title: "该名称已被使用",
        });
        return;
      }
      if (name.length < 20) {
        //通过id判断是修改还是新增操作
        if (this.data4PopMenu.guid) {
          //修改名称
          let data = {
            guid: this.data4PopMenu.guid,
            name: name,
          };
          moduleService.update(data).then((e) => {
            done();
            this.loadList();
            uni.showToast({
              title: "保存成功!",
              duration: 2000,
            });
          });
        } else {
          let data = {
            guid: moduleService.genGuid(),
            foreign_id: this.parentId,
            name: name,
          };
          moduleService.insert(data).then((e) => {
            done();
            this.loadList();
            uni.showToast({
              title: "保存成功!",
              duration: 2000,
            });
          });
        }
      } else {
        uni.showToast({
          icon: "none",
          title: "名称过长,请重新输入",
        });
      }
    },
    menuClick(menu) {
      if (menu.name == "新建版本") {
        this.addData();
      } else if (menu.name == "导入") {
        uni.showToast({
          title: "该功能暂未实现!",
          duration: 2000,
          icon: "none",
        });
      } else if (menu.name == "编辑") {
        this.editData(this.data4PopMenu);
      } else if (menu.name == "拷贝") {
        this.copies();
      } else if (menu.name == "删除") {
        this.remove(this.data4PopMenu);
      }
    },
    back() {
      uni.navigateBack();
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
    copies() {
      moduleService.copy(this.data4PopMenu).then((e) => {
        this.loadList();
        uni.showToast({
          title: "拷贝成功!",
          duration: 2000,
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.i-header {
  height: 56px;
  line-height: 56px;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 15px;

  > .i-header-text {
    color: #444;
    font-size: 18px;
    padding: 0 20px;
  }

  .icon.iconfont {
    color: #007aff;
    font-size: 20px;
    font-weight: bold;
  }
  .search-panel {
    height: 56px;
    line-height: 56px;
    margin-right: 20px;
    .icon.iconfont.iconclose {
      position: absolute;
      right: 6px;
      top: 2px;
      color: #bbb;
      font-weight: 100;
    }
    .icon.iconfont.icon-search1 {
      position: absolute;
      left: 6px;
      top: 3px;
      color: #bbb;
    }
    position: relative;
  }
  .search-input {
    font-size: 16px;
    border: 1px solid #eee;
    height: 30px;
    background: #eee;
    margin-top: 13px;
    padding: 0 30px 0 30px;
    width: 200px;
    border-radius: 20px;
  }
}

.i-list {
  padding-left: 20px;
}

.i-list-item {
  height: 72px;
  line-height: 72px;
  border-bottom: 1px solid #f8f8f8;
  padding-right: 20px;
}

.list-item-content {
  font-size: 16px;
  color: #666;
  font-weight: bold;
  display: flex;
  flex-direction: row;
}

.icon.iconfont {
  vertical-align: middle;
  font-size: 20px;
  color: #b2b2b2;

  &:hover {
    color: #007aff;
  }
}
.i-tab {
  padding: 10px 15px;
  display: flex;
  font-size: 13px;
  flex-direction: row;
  .tab-item {
    padding: 2px 0px;
    margin-right: 15px;
    box-sizing: content-box;
    &.active {
      color: #007aff;
      border-bottom: 2px solid #007aff;
    }
  }
}
.icon.iconfont.item-icon {
  font-size: 26px;
  line-height: 46px;
  color: rgb(100, 196, 175);
  display: block;
  font-weight: normal;
  width: 46px;
  height: 46px;
  margin-top: 13px;
  background: #e8f6f3;
  text-align: center;
  border-radius: 24px;
}
.created-time {
  font-size: 14px;
  margin-right: 100px;
  color: #aaa;
  font-weight: normal;
}
</style>
