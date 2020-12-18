<template>
  <view class="container" @click="pageClick">
    <view class="uni-column">
      <view class="uni-row i-header">
        <view style="width: 10px"></view>
        <text class="icon iconfont" style="color: #007aff" @click="back"
          >&#xe600;</text
        >
        <text class="i-header-text uni-grow">{{ title }}</text>
        <text
          class="icon iconfont iconsure"
          style="color: #007aff"
          @click="save"
        />
        <view style="width: 10px"></view>
      </view>
      <scroll-view
        scroll-y="true"
        class="sv"
        @scroll="scroll"
        :style="{ height: scrollHeight + 'px' }"
      >
        <comp-page
          ref="compPage"
          v-if="inited"
          :service="service"
          title=""
          :param="loadParam"
          :autoload="true"
          :header="false"
          :scroll="false"
          formcss="step-form"
        ></comp-page>
        <view class="i-tab-layout">
          <view class="i-tab uni-row">
            <view
              class="tab-item"
              v-for="tab in tabs"
              :class="{ active: tab == activeTab }"
              v-bind:key="tab.type"
              @click="tabClick(tab)"
            >
              <text class="">{{ tab.name }}</text>
            </view>
            <view class="uni-grow"></view>
            <text
              class="icon iconfont iconicon_roundadd_fill"
              style="
                color: #007aff;
                font-weight: normal;
                font-size: 24px;
                padding: 0 20px;
              "
              @click="addItem"
            />
          </view>
          <view class="item-list" v-if="itemList.length">
            <view
              class="i-list-item uni-row"
              v-for="data in itemList"
              v-bind:key="data.guid"
            >
              <text class="icon iconfont item-icon">&#xe66f;</text>
              <view class="uni-column uni-grow" style="padding: 0 0 0 20px">
                <view class="list-item-content">
                  <text>{{ data.code }}</text>
                  <view class="uni-grow"></view>
                  <text
                    @click.stop="showPopMenus('2', data, $event)"
                    style="font-size: 26px; line-height: 72px"
                    class="icon iconfont iconelipsis"
                  ></text>
                </view>
              </view>
            </view>
          </view>
          <view class="no-content" @click="addItem()" v-else>
            <view>
              <image
                class="add-img"
                src="/static/images/img_new.png"
                mode="widthFix"
              />
            </view>
            <view>
              <text class="add-text">点击这里添加数据</text>
            </view>
          </view>
        </view>
      </scroll-view>
      <uni-popup ref="popup" type="center">
        <uni-popup-dialog
          type="info"
          mode="input"
          @confirm="saveItem"
          :title="editInfo.title"
          :value="editInfo.value"
          :placeholder="editInfo.placeholder"
        ></uni-popup-dialog>
      </uni-popup>
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
  </view>
</template>

<script>
import util from "../../common/util";
import moduleService from "../../service/effect/scene";
import sceneItemService from "../../service/effect/sceneItem";
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import uniPopupDialog from "@/components/uni-popup/uni-popup-dialog.vue";
import { mapState } from "vuex";
export default {
  data() {
    return {
      inited: false,
      popMenuVisible: false,
      scrollHeight: 500,
      scrollTop: 0,
      popStyle: {
        top: 0,
        right: "70px",
      },
      title: "新增场景/事件",
      parentId: "",
      formdata: {},
      service: moduleService,
      loadParam: { guid: moduleService.genGuid() },
      mode: "create",
      activeTab: null,
      tabs: [
        { name: "失效系统或部件", type: 1 },
        { name: "失效/屏蔽", type: 2 },
        { name: "报警或指示", type: 3 },
      ],
      itemList: [],
      sbList: [],
      popMenus: [
        { name: "编辑", type: "2", icon: "iconccedit" },
        { name: "删除", type: "2", icon: "iconsystem-manage-remove red" },
      ],
      editInfo: {
        title: "新增",
        value: "",
        placeholder: "请输入设备编号",
      },
      data4PopMenu: null,
      popStyle: {
        top: 0,
        right: "80px",
        zIndex: 3000,
      },
    };
  },
  components: {
    uniPopup,
    uniPopupDialog,
  },
  onLoad(options) {
    this.parentId = options.guid;
    this.activeTab = this.tabs[0];
    uni.getStorage({
      key: "editData",
      success: (val) => {
        if (val.data) {
          this.loadParam = { guid: val.data.guid };
          this.guid = val.data.gui;
          this.mode = "update";
          Object.assign(this.formdata, val.data);
          this.title = `${this.formdata.name}`;
        }
        this.loadItems();
        this.inited = true;
        console.error("id", this.loadParam.guid);
      },
    });
  },
  onShow() {},
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
    init() {},
    tabClick(tab) {
      this.activeTab = tab;
      this.itemList = this.sbList.filter((item) => {
        return item.type == this.activeTab.type;
      });
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
    back() {
      uni.navigateBack();
    },
    save() {
      this.$refs.compPage.save();
    },

    beforeSave(data, fields) {
      if (!data.foreign_id) {
        data.foreign_id = this.parentId;
      }
      return true;
    },
    loadItems() {
      sceneItemService
        .query({ foreign_id: this.loadParam.guid })
        .then((list) => {
          this.sbList = list;
          this.itemList = list.filter((item) => {
            return item.type == this.activeTab.type;
          });
        });
    },
    showPopMenus(type, data, event) {
      if (this.popMenuVisible && this.data4PopMenu === data) {
        //重复点击,则关闭该弹出菜单
        this.popMenuVisible = false;
        this.data4PopMenu = {};
      } else {
        let top = event.currentTarget.offsetTop;
        this.popStyle.top = top - this.scrollTop + 10 + "px";
        this.popMenuVisible = true;
        this.data4PopMenu = data;
      }
    },
    addItem() {
      this.data4PopMenu = {};
      this.editInfo.title = "新增";
      this.editInfo.value = "";
      this.editInfo.placeholder = "请输入设备编号";
      this.$refs.popup.open();
    },
    editItem(obj) {
      this.data4PopMenu = obj;
      this.editInfo.title = "修改";
      this.editInfo.value = obj.code;
      this.editInfo.placeholder = "请输入设备编号";
      this.$refs.popup.open();
    },
    removeItem(obj) {
      let msg = "是否确认删除该数据?";
      uni.showModal({
        title: "提示",
        content: msg,
        success: (res) => {
          if (res.confirm) {
            sceneItemService.remove(obj.guid).then(
              () => {
                this.loadItems().then(() => {
                  uni.showToast({
                    title: "删除成功!",
                    duration: 2000,
                  });
                });
              },
              (e) => {
                console.error(e);
              }
            );
          }
        },
      });
    },
    saveItem(done, val) {
      let code = val.trim();
      if (!code) {
        uni.showToast({ title: "编号不能为空!", duration: 2000, icon: "none" });
        return;
      }
      if (code.length < 30) {
        //通过id判断是修改还是新增操作
        if (this.data4PopMenu.guid) {
          //修改名称
          let item = {
            guid: this.data4PopMenu.guid,
            code: code,
          };
          sceneItemService.update(item).then(() => {
            this.data4PopMenu.code = code;
            done();
            uni.showToast({
              title: "保存成功!",
              duration: 2000,
            });
          });
        } else {
          //新增分类
          let item = {
            guid: sceneItemService.genGuid(),
            foreign_id: this.loadParam.guid,
            code: code,
            type: this.activeTab.type,
          };
          sceneItemService.insert(item).then(() => {
            this.loadItems();
            done();
            uni.showToast({
              title: "保存成功!",
              duration: 2000,
            });
          });
        }
      } else {
        uni.showToast({
          title: "编号过长,请重新输入",
        });
      }
    },
    menuClick(menu) {
      if (menu.name == "删除") {
        this.removeItem(this.data4PopMenu);
      } else if (menu.name == "编辑") {
        this.editItem(this.data4PopMenu);
      }
    },
  },
};
</script>

<style lang="scss" scoped >
.i-header {
  > .i-header-text {
    padding-left: 20px;
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
</style>
