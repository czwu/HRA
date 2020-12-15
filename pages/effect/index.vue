<template>
  <view class="container" @click="pageClick" :class="screenOrientation">
    <uni-tab-bar :class="screenOrientation" index="4"></uni-tab-bar>
    <view class="uni-column">
      <view class="uni-row i-header">
        <view class="uni-grow"></view>
        <text class="i-header-text">人员效能</text>
        <view class="uni-grow"> </view>
        <view
          class
          style="transform: rotate(90deg)"
          @click.stop="showPopMenus('1', null, $event)"
          ><text
            class="icon iconfont iconelipsis"
            style="font-weight: bold; font-size: 20px"
          ></text>
        </view>
      </view>
      <view class="uni-grow content-panel">
        <view class="i-list" v-if="list.length">
          <scroll-view
            scroll-y="true"
            class="sv"
            :style="{ height: scrollHeight + 'px' }"
          >
            <view
              class="i-list-item uni-row"
              v-for="data in list"
              v-bind:key="data.guid"
              @click="viewData(data)"
            >
              <text class="icon iconfont item-icon icontask"></text>
              <view
                class="uni-column uni-grow"
                style="padding: 10px 0 10px 20px"
              >
                <view class="list-item-content">
                  <text>{{ data.name }}</text>
                  <view style="width: 20px"></view>
                  <text class="color-text color-text-1">{{ data.unit }}</text>
                  <text class="color-text color-text-2">{{
                    data.unit_states
                  }}</text>
                  <text class="color-text color-text-2">{{
                    data.workplace
                  }}</text>
                  <text class="color-text color-text-2">{{ data.job }}</text>
                  <view class="uni-grow"></view>
                  <view style="padding: 0 15px">
                    <text class="icon iconfont" style="">&#xe601;</text>
                  </view>
                  <view @click.stop="showPopMenus('2', data, $event)">
                    <text class="icon iconfont">&#xe66e;</text>
                  </view>
                </view>
                <view class="desc">
                  <text class="color-text-desc">{{ data.config }}</text>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
        <view class="no-content" @click="addData()" v-if="!list.length">
          <view>
            <image
              class="add-img"
              src="/static/images/img_new.png"
              mode="widthFix"
            />
          </view>
          <view>
            <text class="add-text">点击这里添加基础信息</text>
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
import moduleService from "../../service/effect/plant";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      popMenuVisible: false,
      scrollHeight: 500,
      scrollTop: 0,
      allMenus: [
        { name: "新建信息", type: "1", icon: "iconadd" },
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
      list: []
    };
  },
  onShow() {
    this.loadList();
    // plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function (fs) {
    //   // fs.root是根目录操作对象DirectoryEntry
    //   // 创建读取目录信息对象
    //   var directoryReader = fs.root.createReader();
    //   directoryReader.readEntries(
    //     function (entries) {
    //       var i;
    //       for (i = 0; i < entries.length; i++) {
    //         console.error(entries[i].name);
    //       }
    //     },
    //     function (e) {
    //       alert("Read entries failed: " + e.message);
    //     }
    //   );
    // });
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
    tabClick(index) {
      if (index != this.activeTab) {
        this.activeTab = index;
        this.loadList();
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
      return moduleService.queryAll().then((datas) => {
        this.list = datas;
      });
    },
    remove(obj) {
      uni.showModal({
        title: "提示",
        content: "是否确认删除该信息?",
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
      uni.navigateTo({
        url: `/pages/effect/scenes?guid=${data.guid}&name=${data.name}`,
      });
    },
    addData() {
      uni.setStorageSync("editData", "");
      uni.navigateTo({
        url: `/pages/effect/addBasic`,
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
        if (menu.name == "新建信息") {
          this.addData();
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
          uni.navigateTo({ url: "/pages/effect/addBasic" });
        } else if (menu.name == "拷贝") {
          this.copy(this.data4PopMenu);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped >
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
    font-weight: normal;
    margin-top: 13px;
    background: #e8f6f3;
    text-align: center;
    border-radius: 24px;
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
.color-text-1 {
  background: rgba(232, 244, 255, 1);
}

</style>
