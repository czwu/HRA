<template>
  <view class="container" @click="pageClick">
    <view class="uni-column">
      <view class="uni-row i-header">
        <view style="width: 20px"></view>
        <text class="icon iconfont" style="color: #007aff" @click="back"
          >&#xe600;</text
        >
        <text class="i-header-text uni-grow">{{ title }}</text>
        <!-- <view class="uni-grow"></view> -->
        <text
          class="icon iconfont iconsure"
          style="color: #007aff"
          @click="save"
        />
        <view style="width: 20px"></view>
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

      </scroll-view>
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
      issues: [],
      allMenus: [
        { name: "编辑", type: "2", icon: "iconccedit" },
        { name: "拷贝", type: "2", icon: "iconcopy" },
        { name: "删除", type: "2", icon: "iconsystem-manage-remove red" },
      ],
      popMenus: [],
    };
  },
  onLoad(options) {
    this.parentId = options.guid;
    uni.getStorage({
      key: "editData",
      success: (val) => {
        if (val.data) {
          this.loadParam = { guid: val.data.guid };
          this.mode = "update";
          Object.assign(this.formdata, val.data);
          this.title = `${this.formdata.name}`;
        } 
        this.inited = true;
      },
    });
  },
  onShow() {
  },
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
    scroll(e) {
      this.scrollTop = parseInt(e.detail.scrollTop);
      this.popMenuVisible = false;
    },
    loadIssues() {
      issueService.query({ foreign_id: this.loadParam.guid }).then((datas) => {
        this.issues = datas;
      });
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
    addIssue() {
      uni.setStorageSync("editData", "");
      uni.navigateTo({
        url: "/pages/isv/addIssue?guid=" + this.loadParam.guid,
      });
    },
    deleteIssue(issue) {
      uni.showModal({
        title: "提示",
        content: "是否确认删除该问题吗?",
        success: (res) => {
          if (res.confirm) {
            issueService.remove(issue.guid).then(() => {
              this.loadIssues();
              uni.showToast({
                title: "删除成功!",
                duration: 2000,
              });
            });
          }
        },
      });
    },
    editIssue(issue) {
      uni.setStorageSync("editData", issue);
      uni.navigateTo({
        url:
          "/pages/isv/addIssue?guid=" +
          this.loadParam.guid +
          "&code=" +
          issue.code,
      });
    },
    showPopMenus(type, data, event) {
      this.popMenus = this.allMenus.filter((menu) => menu.type == type);
      let top = event.currentTarget.offsetTop;
      this.popStyle.top = top - this.scrollTop - 60 + "px";
      this.popMenuVisible = true;
      this.data4PopMenu = data;
    },
    pageClick() {
      setTimeout(() => {
        this.popMenuVisible = false;
      }, 10);
    },

    menuClick(menu) {
      if (menu.type == "2") {
        if (menu.name == "删除") {
          this.deleteIssue(this.data4PopMenu);
        } else if (menu.name == "编辑") {
          this.addIssue(this.data4PopMenu);
        } else if (menu.name == "拷贝") {
          let guid = issueService.genGuid();
          issueService.copy(this.data4PopMenu, "code", guid).then(() => {
            this.loadIssues();
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped >
.i-header {
  height: 56px;
  line-height: 56px;
  border-bottom: 1px solid #f0f0f0;

  > .i-header-text {
    flex-grow: 1;
    font-size: 16px;
    padding: 0 20px;
    width: 100%;
    text-align: center;
  }
  .icon.iconfont {
    color: #007aff;
    font-size: 20px;
    font-weight: bold;
  }
}
.issue-layout {
  padding: 0px 20px;
  .title {
    font-size: 14px;
    border-bottom: 1px solid #f2f2f2;
    color: #999;
    line-height: 36px;
    padding-right: 15px;
    .icon.iconfont {
      color: #007aff;
      font-size: 26px;
    }
  }
  .no-issue {
    font-size: 16px;
    padding: 10px 0px;
    .add-warp {
      width: 120px;
      padding: 5px 15px;
      border-radius: 15px;
      background: rgba(100, 148, 237, 0.2);
      text-align: center;
      color: #007aff;
      .icon.iconfont {
        color: #007aff;
      }
    }
  }
}
.i-list-item {
  box-sizing: border-box;
  height: 72px;
  line-height: 25px;
  padding-right: 15px;
  border-bottom: 1px solid #f8f8f8;
  .icon.iconfont.item-icon {
    font-size: 40px;
    line-height: 70px;
    color: rgb(100, 196, 175);
    display: block;
    text-align: center;
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
  &:active {
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
.color-text-1 {
  background: rgba(232, 244, 255, 1);
}
.color-text-2 {
  background: rgba(62, 221, 173, 0.2);
  color: rgb(14, 192, 139);
}
.color-text-3 {
  background: rgba(221, 165, 62, 0.2);
  color: rgb(197, 130, 6);
}
.desc {
  color: #888;
  font-size: 13px;
  line-height: 30px;
}
.text-plain {
  text-align: left;
  color: #359dff;
  width: 360px;
  font-weight: normal;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}
</style>
