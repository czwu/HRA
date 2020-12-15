<template>
  <view class="container" :class="screenOrientation">
    <view class="uni-column">
      <view class="uni-flex uni-row i-header">
        <view class="search-panel uni-grow uni-row">
          <input
            class="search-input uni-grow"
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
        <view style="padding: 0 20px; color: #007aff">
          <text @click="cancel">取消</text></view
        >
      </view>
      <view class="select-tip">文件体系 > 搜索</view>
      <view class="uni-grow">
        <view class="i-list">
          <scroll-view
            scroll-y="true"
            class="sv"
            :style="{ height: scrollHeight + 'px' }"
          >
            <view
              class="i-list-item uni-row"
              v-for="catalog in files"
              v-bind:key="catalog.guid"
              @click="openCatalog(catalog)"
            >
              <text class="item-icon icon iconfont">&#xe762;</text>
              <view
                class="uni-flex uni-column uni-grow"
                style="padding: 10px 0 10px 20px"
              >
                <view class="list-item-content row-top">
                  <text>{{ catalog.name }}</text>
                  <text style="padding: 0 5px">({{ catalog.code }})</text>
                  <text class="color-text">{{ catalog.type }}</text>
                </view>
                <view class="file-path row-bottom">
                  <text class="path-text">{{ catalog.path }}</text>
                </view>
              </view>
            </view>
            <view class="i-list-item uni-row" v-show="files.length == 0">
              <view class="uni-column uni-grow">
                <view class="list-item-content">
                  <text class="icon iconfont" style="font-size: 22px"></text>
                  <text style="padding-left: 15px; color: #999">
                    未查找到数据
                  </text>
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
      files: [],
      searchVal: "",
    };
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
  onLoad(option) {
    this.searchVal = option.filterStr;
    this.searchFile();
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
      uni.navigateBack();
    },
    searchFile() {
      if (!this.searchVal) {
        uni.showToast({
          icon:'none',
          title: "请输入搜索关键字!",
          duration: 2000,
        });
        return;
      }
      var that = this;
      that.files = [];
      function eachChildren(nodes, path) {
        nodes.forEach((node) => {
          node.path = path ? path + " \\ " + node.name : node.name;
          if (node.leaf) {
            if (node.name.indexOf(that.searchVal) != -1) {
              that.files.push(node);
            }
          } else if (node.children) {
            eachChildren(node.children, node.path);
          }
        });
      }
      eachChildren(this.catalogIndexMap.roots || []);
    },
    openCatalog(catalog) {
        catalog._viewMode = true;
        uni.setStorageSync("editData", catalog);
        uni.navigateTo({
          url: "/pages/filesys/addFile?backFilterPage="+this.searchVal,
        });
    },
    backCatalog() {
      this.src.pop();
      var catalogs = this.src.length
        ? this.src[this.src.length - 1].children
        : this.catalogIndexMap.roots;

      this.files = catalogs.filter((item) => {
        return !item.leaf && item.guid != this.moveCatalog.guid;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.row-top {
  line-height: 30px;
}
.row-bottom {
  line-height: 20px;
  color: #999;
}
.item-icon.iconfont {
  vertical-align: middle;
  font-size: 30px;
  font-weight: bold;
  color: #78a5c5;
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
  height: 50px;
  padding: 0 15px;
  font-size: 16px;
  color: #666;
}

.select-btns {
  line-height: 60px;
  height: 50px;
  text-align: center;
  font-size: 22px;
  color: #007aff;
}

</style>
