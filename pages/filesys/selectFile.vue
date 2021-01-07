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
        <text class="i-header-text">选择文件</text>
        <view class="uni-grow"></view>
        <text class="i-header-text-cancel" @click="cancel">取消</text>
      </view>
      <view class="select-tip">{{ fullPath || "请选择目标文件" }}</view>
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
                    :style="
                      catalog.leaf
                        ? 'color:#78a5c5;font-size:26px'
                        : 'color:#bfa456;font-size:22px'
                    "
                    >{{ catalog.leaf ? "&#xe762;" : "&#xe712;" }}</text
                  >
                  <text style="padding-left: 15px">{{ catalog.name }}</text>
                  <text class="color-text" v-if="catalog.leaf">{{
                    catalog.type
                  }}</text>
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
      fullPath: "",
      field: "",
      fnName:'onSelectFile'
    };
  },

  onReady() {
    let _this = this;
    this.loadCatalogs().then(() => {
      uni.getSystemInfo({
        success: (res) => {
          this.winHeight = res.windowHeight;
          uni
            .createSelectorQuery()
            .select(".sv")
            .boundingClientRect((data) => {
              _this.scrollHeight = res.windowHeight - data.top - 15;
            })
            .exec();
        },
      });
      this.folders = this.catalogIndexMap.roots;
    });
  },
  onLoad(options) {
    this.field = options.field;
    this.fnName = options.fnName ||'onSelectFile'
    // console.error("selectFile.vue -> options.field:", this.field);
  },
  onShow() {},
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
      uni.navigateBack({
        delta: 1,
      });
    },
    openCatalog(catalog) {
      if (catalog.leaf) {
        let filepath = this.fullPath + catalog.name;
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一个页面
        if (prevPage.$vm[this.fnName]) {
          prevPage.$vm[this.fnName]({
            path: filepath,
            field: this.field,
            guid:catalog.guid
          });
        }
        uni.navigateBack();
      } else {
        this.src.push(catalog);
        this.folders = catalog.children;
        let names = [];
        this.src.forEach((item) => {
          names.push(item.name);
        });
        this.fullPath = names.join(" / ") + " / ";
      }
    },

    backCatalog() {
      this.src.pop();
      var catalogs = this.src.length
        ? this.src[this.src.length - 1].children
        : this.catalogIndexMap.roots;
      this.folders = catalogs;
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
