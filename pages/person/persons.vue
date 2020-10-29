<template>
  <view class="container" @click="pageClick" :class="screenOrientation">
    <uni-tab-bar></uni-tab-bar>
    <view class="uni-flex uni-column uni-grow">
      <view class="uni-row i-header">
        <text class="icon iconfont" style="color:#007aff;" @click="back">&#xe600;</text>
        <text class="i-header-text">{{job.name}}</text>
        <view class="uni-grow"></view>
        <view class style="transform:rotate(90deg);" @click.stop="showPopMenus('1',null,$event)">
          <text class="icon iconfont">&#xe66e;</text>
        </view>
      </view>
      <uni-breadcrumb></uni-breadcrumb>
      <view class="uni-grow uni-flex">
        <view class="i-list">
          <scroll-view
            scroll-y="true"
            class="sv"
            :style="{height:scrollHeight+'px'}"
            @scroll="scroll"
          >
            <view class="i-list-item uni-row" v-for="person in persons" v-bind:key="person.guid">
              <view class="item-icon"></view>
              <view class="uni-column uni-grow" style="padding:10px 0 10px 20px">
                <view class="list-item-content">
                  <text @click="viewPerson(person)">{{person.name}}</text>
                  <text style="padding:0 5px" @click="viewPerson(person)">({{person.code}})</text>
                  <text class="color-text color-text-job" @click="viewPerson(person)">{{person.job}}</text>
                  <text
                    class="color-text color-text-age"
                    @click="viewPerson(person)"
                  >{{person.age}}岁</text>
                  <text
                    class="color-text color-text-year"
                    @click="viewPerson(person)"
                  >工作{{person.workSeniority}}年</text>
                  <text
                    class="color-text color-text-jobyear"
                    @click="viewPerson(person)"
                  >该岗位工作{{person.jobSeniority}}年</text>
                  <view class="uni-grow" @click="viewPerson(person)"></view>
                  <view style="padding:0 15px" @click="viewPerson(person)">
                    <text class="icon iconfont">&#xe601;</text>
                  </view>
                  <view @click.stop="showPopMenus('2', person, $event)">
                    <text class="icon iconfont">&#xe66e;</text>
                  </view>
                </view>
                <view class="desc">
                  <text class="color-text-desc">{{person.duty}}</text>
                </view>
              </view>
            </view>
          </scroll-view>
          <view class="no-content" @click="toAddPerson()" v-if="!persons.length">
            <view>
              <image class="add-img" src="/static/images/img_new.png" mode="widthFix" />
            </view>
            <view>
              <text class="add-text">点击这里添加人员</text>
            </view>
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
        <text style="padding-left:10px">{{menu.name}}</text>
      </view>
    </view>
  </view>
</template>

<script>
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import uniPopupMessage from "@/components/uni-popup/uni-popup-message.vue";
import uniPopupDialog from "@/components/uni-popup/uni-popup-dialog.vue";
import personService from "../../service/person/person";
import util from "../../common/util";
import { mapState, mapActions } from "vuex";
export default {
  onReady() {
    let _this = this;
    uni.getSystemInfo({
      success(res) {
        let wHeight = res.windowHeight;
        let titleH = uni.createSelectorQuery().select(".sv");
        titleH
          .boundingClientRect((data) => {
            _this.scrollHeight = wHeight - data.top - 90;
          })
          .exec();
      },
    });
  },
  data() {
    return {
      popMenuVisible: false,
      scrollHeight: 100,
      scrollTop: 0,
      allMenus: [
        { name: "添加人员", type: "1", icon: "iconadd" },
        { name: "导入", type: "1", icon: "iconimport2" },
        { name: "编辑", type: "2", icon: "iconccedit" },
        { name: "拷贝", type: "2", icon: "iconcopy" },
        { name: "删除", type: "2", icon: "iconsystem-manage-remove red" },
      ],
      popStyle: {
        top: 0,
        right: "50px",
      },
      job: {},
      popMenus: [],
      data4PopMenu: {}, //对应当前弹出菜单的数据对象
    };
  },
  components: {
    uniPopup,
    uniPopupMessage,
    uniPopupDialog,
  },
  onShow() {
    this.init();
  },
  computed: {
    ...mapState({ screenOrientation: "screenOrientation", persons: "persons" }),
  },
  methods: {
    ...mapActions({
      loadPersons: "loadPersons",
    }),
    scroll(e) {
      this.scrollTop = parseInt(e.detail.scrollTop);
      this.popMenuVisible = false;
    },
    init() {
      uni.getStorage({
        key: "currJob",
        success: (val) => {
          if (val.data) {
            this.job = val.data;
            this.loadPersons(this.job.guid);
            this.initBreadcrumb();
          }
        },
      });
    },
    initBreadcrumb() {
      let crumbs = [
        {
          name: uni.getStorageSync("activeTab").name,
          url: "/pages/person/groups",
        },
        {
          name: uni.getStorageSync("currDept").name,
          url: "/pages/person/jobs",
        },
        { name: this.job.name },
      ];
      this.$store.commit("setCrumbs", crumbs);
    },
    switchTab(tab) {
      this.activeTab = tab;
    },
    back() {
      uni.switchTab({ url: "/pages/person/jobs" });
    },
    remove(obj) {
      uni.showModal({
        title: "提示",
        content: "是否确认删除该人员信息?",
        success: (res) => {
          if (res.confirm) {
            personService.remove(this.data4PopMenu.guid).then(() => {
              this.loadPersons(this.job.guid);
              uni.showToast({
                title: "删除成功!",
                duration: 2000,
              });
            });
          }
        },
      });
    },
    copy() {
      personService.copy(this.data4PopMenu).then(() => {
        this.loadPersons(this.job.guid);
        uni.showToast({
          title: "拷贝成功!",
          duration: 2000,
          icon: "none",
        });
      });
    },
    viewPerson(data) {
      uni.setStorageSync("editData", data);
      uni.navigateTo({
        url: "/pages/person/viewPerson",
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
    toAddPerson() {
      uni.setStorageSync("editData", "");
      uni.navigateTo({ url: "/pages/person/addPerson" });
    },
    menuClick(menu) {
      if (menu.type == "1") {
        if (menu.name == "添加人员") {
          this.toAddPerson();
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
          uni.navigateTo({ url: "/pages/person/addPerson" });
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
    font-size: 18px;
    color: #333;
    padding: 0 15px;
  }
  .icon.iconfont {
    font-size: 20px;
    font-weight: bold;
  }
}
.i-list {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.i-list-item {
  box-sizing: border-box;
  height: 72px;
  line-height: 25px;
  padding-right: 20px;
  border-bottom: 1px solid #f8f8f8;
  .item-icon {
    width: 40px;
    margin: auto 0;
    height: 40px;
    background: url("/static/icons/1.5x/personnel_crew_n.png") no-repeat 50% 50%;
    background-size: 100% 100%;
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

.icon.job-icon {
  font-size: 30px;
  margin: auto;
}
.color-text-job {
  background: rgb(243, 212, 109);
}
.color-text-age {
  background: rgba(232, 244, 255, 1);
}
.color-text-year {
  background: rgba(143, 221, 15, 0.3);
}
.color-text-jobyear {
  background: rgba(196, 174, 192, 0.411);
}
.color-text-desc {
  color: #999;
}
.icon.job-icon {
  font-size: 30px;
  margin: auto;
}
</style>
