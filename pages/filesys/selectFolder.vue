<template>
  <view class="container" :class="screenOrientation">
    <view class="uni-column">
      <view class="uni-row i-header">
        <text
          class="icon iconfont"
          style="color: #007aff"
          @click="backCatalog"
          v-show="src.length"
          >&#xe600;</text
        >
        <view class="uni-grow"></view>
        <text class="i-header-text">移至</text>
        <view class="uni-grow"></view>
        <text class="i-header-text-cancel" @click="cancel">取消</text>
      </view>
      <view class="select-tip">请选择目标文件夹</view>
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
              v-for="catalog in folders"
              v-bind:key="catalog.guid"
              @click="openCatalog(catalog)"
            >
              <view class="uni-column uni-grow">
                <view class="list-item-content">
                  <text
                    class="icon iconfont"
                    style="color: #bfa456; font-size: 22px"
                    >&#xe712;</text
                  >
                  <text style="padding-left: 15px">{{ catalog.name }}</text>
                </view>
              </view>
            </view>
            <view class="i-list-item uni-row" v-show="folders.length == 0">
              <view class="uni-column uni-grow">
                <view class="list-item-content">
                  <text
                    class="icon iconfont"
                    style="color: #bfa456; font-size: 22px"
                  >
                  </text>
                  <text style="padding-left: 15px; color: #999"> 空 </text>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
      <view class="select-btns uni-grow showdow-only-top" @click="move">
        <text> 移 动 </text>
      </view>
    </view>
  </view>
</template>

<script>
import util from "../../common/util";
import { mapState, mapActions } from "vuex";
import catalogService from "../../service/filesys/catalog";
export default {
  data() {
    return {
      winHeight: 0,
      scrollHeight: 0,
      breadItems: [{ name: "全部", guid: "" }],
      folders: [],
      src: [],
      moveCatalog: null,
    };
  },

  onReady() {
    console.log("foler onReady");
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
    uni.getStorage({
      key: "moveCatalog",
      success: (val) => {
        if (val.data) {
          this.moveCatalog = val.data;
          this.folders = this.catalogIndexMap.roots.filter((item) => {
            return !item.leaf && item.guid != this.moveCatalog.guid;
          });
        }
      },
    });
  },
  onShow() {
    console.log("foler show");
  },
  computed: {
    ...mapState({
      screenOrientation: "screenOrientation",
      catalogs: "catalogs",
      catalogIndexMap: "catalogIndexMap",
    }),
  },
  methods: {
    ...mapActions({
      loadCatalogs: "loadCatalogs",
    }),
    scroll(e) {
      this.scrollTop = parseInt(e.detail.scrollTop);
    },
    cancel() {
      uni.switchTab({
        url: "/pages/filesys/index",
      });
    },
    move() {
      let parent = this.src.pop();
      let textPart = this.moveCatalog.leaf ? "文件" : "文件夹";
      let textPart2 = parent ? "该" : "根";
      let msg = `确认要将 ${textPart} "${this.moveCatalog.name}" 移动到${textPart2}目录下吗`;
      uni.showModal({
        title: "操作确认",
        content: msg,
        success: (res) => {
          if (res.confirm) {
            catalogService
              .move(this.moveCatalog.guid, parent ? parent.guid : "")
              .then(() => {
                this.loadCatalogs();
                uni.showToast({
                  title: "移动成功!",
                  duration: 2000,
                });
                this.cancel();
              });
          }
        },
      });
    },
    openCatalog(catalog) {
      this.src.push(catalog);
      this.folders = catalog.children.filter((item) => {
        return !item.leaf && item.guid != this.moveCatalog.guid;
      });
    },
    backCatalog() {
      this.src.pop();
      var catalogs = this.src.length
        ? this.src[this.src.length - 1].children
        : this.catalogIndexMap.roots;

      this.folders = catalogs.filter((item) => {
        return !item.leaf && item.guid != this.moveCatalog.guid;
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
  .i-header-text-cancel {
    color: #007aff;
    font-size: 16px;
  }
  .icon.iconfont {
    color: #007aff;
    font-size: 20px;
    font-weight: bold;
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
.select-tip {
  line-height: 50px;
  padding: 0 15px;
  font-size: 16px;
  color: #999;
}

.select-btns {
  line-height: 60px;
  height: 50px;
  text-align: center;
  font-size: 22px;
  color: #007aff;
}
.showdow-only-top {
  box-shadow: 0px -7px 7px -7px #bbb;
}
</style>
