<template>
  <view class="container" @click="pageClick" :class="screenOrientation">
    <uni-tab-bar :class="screenOrientation" index="1"></uni-tab-bar>
    <view class="i-tab">
      <view class="i-tab-header uni-row">
        <view
          class="i-tab-item"
          v-for="group in personGroups"
          :key="group.guid"
          :class="{ active: activeTab.guid == group.guid }"
          @click="switchTab(group)"
          >{{ group.name }}</view
        >

        <view class="uni-grow"></view>
        <view
          style="transform: rotate(90deg)"
          @click.stop="showPopMenus('1', null, $event)"
        >
          <text class="icon iconfont">&#xe66e;</text>
        </view>
      </view>
      <view class="i-tab-content uni-grow">
        <view class="i-list">
          <scroll-view
            scroll-y="true"
            class="sv"
            :style="{ height: scrollHeight + 'px' }"
            @scroll="scroll"
          >
            <view
              class="i-list-item uni-row"
              v-for="data in activeTab.depts"
              v-bind:key="data.guid"
            >
              <view class="list-item-content uni-row uni-grow">
                <view class="item-icon"></view>
                <text style="margin-left: 20px" @click="goDept(data)">{{
                  data.name
                }}</text>
                <view class="uni-grow" @click="goDept(data)"></view>
                <view @click="goDept(data)">
                  <text class="icon iconfont">&#xe601;</text>
                </view>
                <view
                  style="margin-left: 15px"
                  @click.stop="showPopMenus('2', data, $event)"
                >
                  <text class="icon iconfont">&#xe66e;</text>
                </view>
              </view>
            </view>
            <view
              class="no-content"
              @click="addDept()"
              v-if="activeTab.depts && !activeTab.depts.length"
            >
              <view>
                <image
                  class="add-img"
                  src="/static/images/img_new.png"
                  mode="widthFix"
                />
              </view>
              <view>
                <text class="add-text">点击这里添加部门</text>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>
    <view class="popup pop-menu" v-show="popMenuVisible" :style="popStyle">
      <view
        class="pop-menu-item uni-row"
        :class="{ 'border-bottom': menu.border }"
        v-for="menu in popMenus"
        v-bind:key="menu.name"
        @click="menuClick(menu)"
      >
        <view class="menu iconfont" :class="menu.icon"></view>
        <text style="padding-left: 10px">{{ menu.name }}</text>
      </view>
    </view>
    <uni-popup ref="popup" type="center">
      <uni-popup-dialog
        type="info"
        mode="input"
        @confirm="saveDept"
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
import groupService from "../../service/person/group";
import deptService from "../../service/person/dept";
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
      scrollHeight: 100,
      scrollTop: 0,
      projectid: util.getProjectId(),
      popMenuVisible: false,
      allMenus: [
        {
          name: "类别管理",
          type: "1",
          icon: "iconnavigation-patternmanage",
          border: true,
        },
        { name: "新建部门", type: "1", icon: "iconadd" },
        { name: "导入", type: "1", icon: "iconimport2" },
        { name: "编辑", type: "2", icon: "iconccedit" },
        // { name: "拷贝", type: "2", icon: "iconcopy" },
        { name: "删除", type: "2", icon: "iconsystem-manage-remove red" },
      ],
      popStyle: {
        top: 0,
        right: "60px",
      },
      popMenus: [],
      activeTab: {},
      data4PopMenu: {}, //对应当前弹出菜单的数据对象
      editInfo: {
        title: "",
        value: "",
        placeholder: "",
      },
    };
  },
  components: {
    uniPopup,
    uniPopupMessage,
    uniPopupDialog,
  },
  created() {
    this.loadData();
  },
  onShow() {
    if (util.getProjectId() != this.projectid) {
      this.projectid = util.getProjectId();
      this.loadData();
    }
  },
  computed: {
    ...mapState({
      screenOrientation: "screenOrientation",
      personGroups: "personGroups",
    }),
  },
  methods: {
    ...mapActions({
      loadPersonGroups: "loadPersonGroups",
    }),
    scroll(e) {
      this.scrollTop = parseInt(e.detail.scrollTop);
      this.popMenuVisible = false;
    },
    loadData() {
      this.loadPersonGroups().then((groups) => {
        this.activeTab = groups[0];
        uni.setStorage({
          key: "activeTab",
          data: { uuid: this.activeTab.uuid, name: this.activeTab.name },
        });
      });
    },
    switchTab(tab) {
      this.activeTab = tab;
      uni.setStorage({
        key: "activeTab",
        data: { uuid: tab.uuid, name: tab.name },
      });
    },
    addDept() {
      this.data4PopMenu = { jobs: [] };
      this.editInfo.title = "新建部门";
      this.editInfo.value = "";
      this.editInfo.placeholder = "请输入部门名称";
      this.$refs.popup.open();
    },
    editDept(obj) {
      this.data4PopMenu = obj;
      this.editInfo.title = "部门名称修改";
      this.editInfo.value = obj.name;
      this.editInfo.placeholder = "请输入部门名称";
      this.$refs.popup.open();
    },
    removeDept(obj) {
      let msg = "是否确认删除该部门信息?";
      uni.showModal({
        title: "提示",
        content: msg,
        success: (res) => {
          if (res.confirm) {
            deptService.remove(obj.guid).then(
              () => {
                this.loadPersonGroups().then((groups) => {
                  this.resetActiveTab(groups);
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
    goDept(data) {
      uni.setStorageSync("currDept", data);
      uni.navigateTo({
        url: "/pages/person/jobs",
      });
    },
    resetActiveTab(groups) {
      groups.forEach((group) => {
        if (group.guid == this.activeTab.guid) {
          this.activeTab.depts.push({ name: "text", code: "text" });
          this.activeTab = group;
        }
      });
    },
    showPopMenus(type, data, event) {
      if (this.popMenuVisible && this.data4PopMenu === data) {
        //重复点击,则关闭该弹出菜单
        this.popMenuVisible = false;
        this.data4PopMenu = {};
      } else {
        this.popMenus = this.allMenus.filter((menu) => menu.type == type);
        let top = event.currentTarget.offsetTop;
        this.popStyle.top = top - this.scrollTop + 10 + "px";
        this.popMenuVisible = true;
        this.data4PopMenu = data;
      }
    },
    pageClick() {
      setTimeout(() => {
        this.popMenuVisible = false;
      }, 10);
    },

    saveDept(done, val) {
      let name = val.trim();
      if (!name) {
        uni.showToast({ title: "名称不能为空!", duration: 2000, icon: "none" });
        return;
      }
      if (name.length < 20) {
        //通过id判断是修改还是新增操作
        if (this.data4PopMenu.guid) {
          //修改名称
          let dept = {
            guid: this.data4PopMenu.guid,
            name: name,
          };
          deptService.update(dept).then(() => {
            this.loadPersonGroups().then((groups) => {
              this.resetActiveTab(groups);
            });
            done();
            uni.showToast({
              title: "保存成功!",
              duration: 2000,
            });
          });
        } else {
          //新增分类
          let dept = {
            guid: util.genDeptId(),
            group_guid: this.activeTab.guid,
            name: name,
          };
          deptService.insert(dept).then(() => {
            this.loadPersonGroups().then((groups) => {
              this.resetActiveTab(groups);
            });
            done();
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
      if (menu.type == "1") {
        if (menu.name == "新建部门") {
          this.addDept();
        } else if (menu.name == "导入") {
          uni.showToast({
            title: "该功能暂未实现!",
            duration: 2000,
            icon: "none",
          });
        } else if (menu.name == "类别管理") {
          uni.navigateTo({
            url: "/pages/person/types",
          });
        }
      } else if (menu.type == "2") {
        if (menu.name == "删除") {
          this.removeDept(this.data4PopMenu);
        } else if (menu.name == "编辑") {
          this.editDept(this.data4PopMenu);
        } else if (menu.name == "拷贝") {
          uni.showToast({
            title: "该功能暂未开放!",
            duration: 2000,
            icon: "none",
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped >
.i-tab-header {
  overflow: hidden;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 10px 0 20px;
  > view {
    height: 56px;
    line-height: 56px;
    box-sizing: border-box;
  }
}

.i-tab-item {
  font-size: 16px;
  color: #444;
  box-sizing: border-box;
  height: 54px;
  line-height: 54px;
  text-align: left;
  margin-right: 20px;
  position: relative;
  &.active {
    color: #007aff;
  }
  &.active::after {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 3px;
    border-radius: 5px;
    background: #007aff;
    bottom: 0px;
    z-index: 1000;
    text-align: center;
  }
}

.list-item-content {
  font-size: 16px;
  color: #666;
  font-weight: bold;
  border-bottom: 1px solid #f8f8f8;
  height: 72px;
  line-height: 72px;

  .item-icon {
    width: 40px;
    margin: auto 0;
    height: 40px;
    background: url("/static/icons/1.5x/personnel_post_n.png") no-repeat 50% 50%;
    background-size: 100% 100%;
  }
}
.icon.iconfont {
  vertical-align: right;
  font-size: 20px;
  color: #b2b2b2;
  font-weight: bold;
  &:hover {
    color: #007aff;
  }
  &.red {
    color: red !important;
  }
}
</style>
