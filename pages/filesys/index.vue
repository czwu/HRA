<template>
  <view class="container" @click="pageClick" :class="screenOrientation">
    <uni-tab-bar :class="screenOrientation" index="0"></uni-tab-bar>
    <view class="uni-column">
      <view class="uni-row i-header">
        <text
          class="icon iconfont"
          style="color: #007aff"
          @click="backCatalog"
          v-show="!!currCatalog"
          >&#xe600;</text
        >
        <view style="width: 250px" v-show="!currCatalog"></view>
        <view class="uni-grow" v-show="!currCatalog"></view>
        <text class="i-header-text">{{
          currCatalog ? currCatalog.name : "文件体系"
        }}</text>
        <view class="uni-grow"></view>
        <view class="search-panel" v-show="!currCatalog">
          <input
            class="search-input"
            confirm-type="search"
            placeholder="搜索"
            v-model.trim="searchVal"
            @submit="searchFile()"
          />
          <text class="icon iconfont icon-search1" @click="searchFile"></text>
          <text
            class="icon iconfont iconclose"
            @click="searchVal = ''"
            v-show="searchVal.trim().length"
          ></text>
        </view>
        <view
          class
          style="transform: rotate(90deg)"
          @click.stop="showPopMenus('1', null, $event)"
        >
          <text class="icon iconfont">&#xe66e;</text>
        </view>
      </view>
      <uni-breadcrumb
        v-show="!!currCatalog"
        @itemClick="breadClick"
        :datas="breadItems"
      ></uni-breadcrumb>
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
              v-for="catalog in catalogs"
              v-bind:key="catalog.guid"
            >
              <view class="uni-column uni-grow">
                <view class="list-item-content">
                  <text
                    class="icon iconfont"
                    :style="
                      catalog.leaf
                        ? 'color:#78a5c5;font-size:26px'
                        : 'color:#bfa456;font-size:22px'
                    "
                    >{{ catalog.leaf ? "&#xe762;" : "&#xe712;" }}</text
                  >
                  <text style="padding-left: 15px" @click="openCatalog(catalog)"
                    >{{ catalog.name }}
                  </text>
                  <text v-if="catalog.leaf && catalog.code" style="padding:0 5px" > ({{ catalog.type }}) </text>
                  <text class="color-text" v-if="catalog.leaf">{{catalog.type }}</text>
                  <view class="uni-grow" @click="openCatalog(catalog)"></view>
                  <view @click="openCatalog(catalog)" v-show="!catalog.leaf">
                    <text class="icon iconfont">&#xe601;</text>
                  </view>
                  <view
                    style="margin-left: 15px"
                    @click.stop="
                      showPopMenus(catalog.leaf ? '3' : '2', catalog, $event)
                    "
                  >
                    <text class="icon iconfont">&#xe66e;</text>
                  </view>
                </view>
              </view>
            </view>
            <view
              class="no-content"
              @click="addCatalog()"
              v-if="!catalogs || !catalogs.length"
            >
              <view>
                <image
                  class="add-img"
                  src="/static/images/img_new.png"
                  mode="widthFix"
                />
              </view>
              <view> <text class="add-text">点击这里添加文件夹</text> </view>
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
        @confirm="saveCatalog"
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
import catalogService from "../../service/filesys/catalog";
import util from "../../common/util";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      popMenuVisible: false,
      allMenus: [
        {
          name: "新建文件夹",
          type: "1",
          icon: "iconadd_file1",
        },
        {
          name: "添加文件",
          type: "1",
          icon: "iconadd_file",
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
          name: "迁移",
          type: "2",
          icon: "iconfile1",
        },
        {
          name: "删除",
          type: "2",
          icon: "iconsystem-manage-remove red",
        },
        // {
        //   name: "拍照",
        //   type: "3",
        //   icon: "iconicon_addpicture",
        // },
        // {
        //   name: "录音",
        //   type: "3",
        //   icon: "iconvoicefill",
        // },
        {
          name: "编辑",
          type: "3",
          icon: "iconccedit",
        },
        {
          name: "拷贝",
          type: "3",
          icon: "iconcopy",
        },
        {
          name: "迁移",
          type: "3",
          icon: "iconfile1",
        },
        {
          name: "删除",
          type: "3",
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
      breadItems: [{ name: "全部", guid: "" }],
      searchVal: "",
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
    this.loadCatalogs();
  },
  onShow() {},
  computed: {
    ...mapState({
      screenOrientation: "screenOrientation",
      catalogs: "catalogs",
      currCatalog: "currCatalog",
      catalogIndexMap: "catalogIndexMap",
    }),
  },
  methods: {
    ...mapActions({
      loadCatalogs: "loadCatalogs",
    }),
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
    remove(type) {
      let msg = "删除后该数据层内容无法恢复";
      let guid = this.data4PopMenu.guid;
      var removeIds = [];
      util.nodeEach(this.data4PopMenu, (node) => {
        removeIds.push(node.guid);
      });
      uni.showModal({
        title: "删除确认",
        content: msg,
        success: (res) => {
          if (res.confirm) {
            catalogService.remove(removeIds).then(() => {
              this.loadCatalogs();
              uni.showToast({
                title: "删除成功!",
                duration: 2000,
              });
            });
          }
        },
      });
    },
    searchFile() {
      if (!this.searchVal) {
        uni.showToast({
          title: "请输入搜索关键字!",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      uni.navigateTo({
        url: "/pages/filesys/filter?filterStr=" + this.searchVal,
      });
    },
    addCatalog() {
      this.data4PopMenu = {};
      this.editInfo.title = "新建文件夹";
      this.editInfo.value = "";
      this.editInfo.placeholder = "请输入文件夹名称";
      this.$refs.popup.open();
    },
    editCatalog(data) {
      this.editInfo.title = "名称修改";
      this.editInfo.value = data.name;
      this.editInfo.placeholder = "请输入文件夹名称";
      this.$refs.popup.open();
    },
    saveCatalog(done, val) {
      let name = val.trim();
      if (name.length < 20) {
        //通过id判断是修改还是新增操作
        if (this.data4PopMenu.guid) {
          //修改名称
          let catalog = {
            guid: this.data4PopMenu.guid,
            name: name,
          };
          catalogService.update(catalog).then((e) => {
            done();
            this.loadCatalogs();
            uni.showToast({
              title: "保存成功!",
              duration: 2000,
            });
          });
        } else {
          //新增文件夹
          console.log(catalogService.genGuid());
          let catalog = {
            guid: catalogService.genGuid(),
            parentGuid: this.currCatalog ? this.currCatalog.guid : "",
            name: name,
          };
          catalogService.insert(catalog).then((e) => {
            done();
            this.loadCatalogs();
            uni.showToast({
              title: "保存成功!",
              duration: 2000,
            });
          });
        }
      } else {
        uni.showToast({
          title: "名称过长,请重新输入",
        });
      }
    },
    menuClick(menu) {
      if (menu.name == "新建文件夹") {
        this.addCatalog();
      } else if (menu.name == "添加文件") {
        uni.setStorageSync("editData", "");
        uni.navigateTo({
          url: "/pages/filesys/addFile",
        });
      } else if (menu.name == "导入") {
        uni.showToast({
          title: "该功能暂未实现!",
          duration: 2000,
          icon: "none",
        });
      } else if (menu.name == "编辑") {
        //编辑文件夹
        if (menu.type == 2) {
          this.editCatalog(this.data4PopMenu);
        } else {
          //编辑文件
          this.data4PopMenu._viewMode = false;
          uni.setStorageSync("editData", this.data4PopMenu);
          uni.navigateTo({
            url: "/pages/filesys/addFile",
          });
        }
      } else if (menu.name == "拷贝") {
        this.copies();
      } else if (menu.name == "迁移") {
        uni.setStorageSync("moveCatalog", this.data4PopMenu);
        uni.navigateTo({ url: "/pages/filesys/selectFolder" });
      } else if (menu.name == "删除") {
        this.remove();
      } else if (menu.name == "拍照") {
      } else if (menu.name == "录音") {
      }
    },
    openCatalog(catalog) {
      if (catalog.leaf == 1) {
        catalog._viewMode = true;
        uni.setStorageSync("editData", catalog);
        uni.navigateTo({
          url: "/pages/filesys/addFile",
        });
      } else {
        this.breadItems.push({ name: catalog.name, guid: catalog.guid });
        this.$store.commit("setCurrCatalog", catalog);
        this.$store.commit("setCatalogs", catalog.children);
      }
    },
    backCatalog() {
      this.breadItems.pop();
      if (this.currCatalog && this.currCatalog.parentGuid) {
        let catalog = this.catalogIndexMap[this.currCatalog.parentGuid];
        this.$store.commit("setCurrCatalog", catalog);
        this.$store.commit("setCatalogs", catalog.children);
      } else {
        this.$store.commit("setCurrCatalog", null);
        this.$store.commit("setCatalogs", this.catalogIndexMap.roots);
      }
    },
    breadClick() {},
    copies() {
      catalogService.copies(this.data4PopMenu).then((e) => {
        this.loadCatalogs();
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
  font-weight: bold;
  color: #b2b2b2;

  &:hover {
    color: #007aff;
  }
}

text.custom {
  margin: 0 20px;
  font-weight: 300;
  color: rgb(131, 193, 243);
}

.iconadd_file {
  font-size: 17px;
}
.color-text {
  margin: auto 15px;
  font-weight: 300;
  line-height: 15px;
  height: 15px;
  vertical-align: baseline;
  color: #359dff;
  background: rgba(232, 244, 255, 1);
  font-size: 11px;
  padding: 2px 12px;
  border-radius: 10px;
}
</style>
