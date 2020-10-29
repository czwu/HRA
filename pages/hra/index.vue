<template>
  <view class="container" @click="pageClick" :class="screenOrientation">
    <uni-tab-bar :class="screenOrientation" index="2"></uni-tab-bar>
    <view class="uni-column">
      <view class="uni-row i-header">
         <view class="uni-grow"></view>
        <text class="i-header-text">分析任务</text>
        <view class="uni-grow"></view>
        <view
          class
          style="transform: rotate(90deg)"
          @click.stop="showPopMenus('1', null, $event)"
        >
          <text class="icon iconfont">&#xe66e;</text>
        </view>
      </view>
      <view class="uni-grow">
        <view class="i-list" v-if="tasks.lenth">
          <scroll-view
            scroll-y="true"
            class="sv"
            :style="{ height: scrollHeight + 'px' }"
            @scroll="scroll"
          >
            <view
              class="i-list-item uni-row"
              v-for="task in tasks"
              v-bind:key="task.guid"
            >
              <view class="item-icon"></view>
              <view
                class="uni-column uni-grow"
                style="padding: 10px 0 10px 20px"
              >
                <view class="list-item-content">
                  <text @click="viewTask(task)">{{ task.name }}</text>
                  <text style="padding: 0 5px" @click="viewTask(task)"
                    >({{ task.code }})</text
                  >
                  <text
                    class="color-text color-text-num"
                    @click="viewTask(task)"
                    >{{ task.stage }}</text
                  >
                  <text
                    class="color-text color-text-time"
                    @click="viewTask(task)"
                    >{{ task.level }}</text
                  >
                  <text
                    class="color-text color-text-time"
                    @click="viewTask(task)"
                    >{{ task.working_condition_type }}</text
                  >
                  <text
                    class="color-text color-text-time"
                    @click="viewTask(task)"
                    >{{ task.htype }}</text
                  >
                  <text
                    class="color-text color-text-time"
                    @click="viewTask(task)"
                    >{{ task.analysis_scope }}</text
                  >
                  <view class="uni-grow" @click="viewTask(task)"></view>
                  <view style="padding: 0 15px" @click="viewTask(task)">
                    <text class="icon iconfont">&#xe601;</text>
                  </view>
                  <view @click.stop="showPopMenus('2', job, $event)">
                    <text class="icon iconfont">&#xe66e;</text>
                  </view>
                </view>
                <view class="desc">
                  <text class="color-text-desc">{{ job.duty }}</text>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
        <view class="no-content" @click="toAddTask()" v-if="!tasks.length">
          <view>
            <image
              class="add-img"
              src="/static/images/img_new.png"
              mode="widthFix"
            />
          </view>
          <view>
            <text class="add-text">点击这里添加任务</text>
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
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import uniPopupMessage from "@/components/uni-popup/uni-popup-message.vue";
import uniPopupDialog from "@/components/uni-popup/uni-popup-dialog.vue";
import util from "../../common/util";
import taskService from "../../service/hra/task";
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
    this.init();
  },
  data() {
    return {
      popMenuVisible: false,
      scrollHeight: 100,
      scrollTop: 0,
      allMenus: [
        { name: "新建任务", type: "1", icon: "iconadd" },
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
    };
  },
  components: {
    uniPopup,
    uniPopupMessage,
    uniPopupDialog,
  },

  computed: {
    ...mapState({
      screenOrientation: "screenOrientation",
      tasks: "tasks",
    }),
  },
  methods: {
    ...mapActions({
      loadTasks: "loadTasks",
    }),
    scroll(e) {
      this.scrollTop = parseInt(e.detail.scrollTop);
      this.popMenuVisible = false;
    },
    init() {
      this.loadTasks();
    },
    remove(obj) {
      uni.showModal({
        title: "提示",
        content: "是否确认删除该任务?",
        success: (res) => {
          if (res.confirm) {
            taskService.remove(obj.guid).then(() => {
              this.loadTasks();
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
      let guid = taskService.genGuid();
      taskService.copy(data, "name", guid).then((newData) => {
        this.loadTasks();
        //todo
      });
    },
    viewTask(data) {
      uni.setStorageSync("currTask", data);
      uni.navigateTo({
        url: "/pages/hra/viewTask",
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
    toAddTask() {
      uni.setStorageSync("editData", "");
      uni.navigateTo({ url: "/pages/hra/addTask" });
    },
    menuClick(menu) {
      if (menu.type == "1") {
        if (menu.name == "新建任务") {
          this.toAddTask();
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
          uni.navigateTo({ url: "/pages/hra/addTask" });
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
    color: #333;
    font-size: 18px;
    padding: 0 15px;
  }
  .icon.iconfont {
    font-size: 20px;
    font-weight: bold;
  }
}
.i-list {
  padding-left: 20px;
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
    background: url("/static/icons/1.5x/icon_job.png") no-repeat 50% 50%;
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
.color-text-num {
  background: rgba(232, 244, 255, 1);
}
.color-text-time {
  background: rgba(143, 221, 15, 0.3);
}
.color-text-desc {
  color: #999;
  line-height: 20px;
  height: 20px;
}
.icon.job-icon {
  font-size: 30px;
  margin: auto;
}
</style>
