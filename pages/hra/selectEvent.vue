<template>
  <view class="container">
    <view class="uni-column">
      <view class="uni-row i-header">
        <text class="icon iconfont" @click="back">&#xe600;</text>
        <view class="uni-grow"></view>
        <text class="i-header-text">{{
          this.mode == "selectTask"
            ? "请先选择任务"
            : "请选择两条或两条以上的人误数据"
        }}</text>
        <view class="uni-grow"></view>
        <text
          class="icon iconfont"
          v-show="allowPost"
          @click="postSelect"
          style="padding: 0 10px"
          >&#xe656;</text
        >
      </view>
      <view class="uni-grow content-panel">
        <view class="i-list" v-if="tasks.length">
          <scroll-view
            scroll-y="true"
            class="sv"
            :style="{ height: scrollHeight + 'px' }"
          >
            <template v-if="mode == 'selectTask'">
              <view
                class="i-list-item uni-row"
                v-for="task in tasks"
                v-bind:key="task.guid"
                @click="viewTask(task)"
              >
                <text class="icon iconfont item-icon">&#xe66f;</text>
                <view
                  class="uni-column uni-grow"
                  style="padding: 10px 0 10px 20px"
                >
                  <view class="list-item-content">
                    <text>{{ task.name }}</text>
                    <text style="padding: 0 5px">({{ task.code }})</text>
                    <text class="color-text color-text-num">{{
                      task.stage
                    }}</text>
                    <text class="color-text color-text-num">{{
                      task.level
                    }}</text>
                    <text class="color-text color-text-num">{{
                      task.working_condition_type
                    }}</text>
                    <text class="color-text color-text-htype">{{
                      task.htype
                    }}</text>
                    <text class="color-text color-text-scope">{{
                      task.analysis_scope
                    }}</text>
                    <view class="uni-grow"></view>
                  </view>
                  <view class="desc">
                    <text class="color-text-desc">{{ task.desc }}</text>
                  </view>
                </view>
                <view style="line-height: 72px">
                  <text class="icon iconfont" style="font-size: 20px"
                    >&#xe601;</text
                  >
                </view>
              </view>
            </template>
            <template v-else>
              <view
                class="i-list-item uni-row"
                v-for="data in datas"
                v-bind:key="data.guid"
                @click="selectEvent(data)"
              >
                <text class="select-num" :class="{ selected: data.selected }">{{
                  data.stage_index
                }}</text>
                <view
                  class="uni-column uni-grow"
                  style="padding: 10px 0 10px 20px"
                >
                  <view class="list-item-content">
                    <text>{{
                      data.system ? data.human_error_code : data.code
                    }}</text>
                    <text style="padding: 0 5px"
                      >({{
                        data.system ? data.system : data.human_error_code
                      }})</text
                    >
                    <text class="color-text color-text-num">{{
                      data.device_type || data.accident
                    }}</text>
                    <view class="uni-grow"></view>
                  </view>
                  <view class="desc">
                    <text class="color-text-desc">{{
                      data.accident_desc
                    }}</text>
                  </view>
                </view>
              </view>
            </template>
          </scroll-view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import util from "../../common/util";
import constants from "../../common/constants";
import taskService from "../../service/hra/task";
import typeAService from "../../service/hra/typeA";
import typeCService from "../../service/hra/typeC";
export default {
  data() {
    return {
      scrollHeight: 500,
      scrollTop: 0,
      tasks: [], //父级任务数据
      datas: [], //选择的人误事件数据
      type: "A",
      mode: "selectTask",
      allowPost: false,
      selMap: {},
    };
  },
  onLoad(options) {
    this.type = options.type;
    uni.getStorage({
      key: "currEvents",
      success: (val) => {
        console.error(val.data);
        val.data &&
          val.data.forEach((id, i) => {
            this.selMap[id] = i + 1;
          });
      },
    });
    this.loadTasks(
      this.type == "A" ? constants.TAST_TYPE.A : constants.TAST_TYPE.C
    );
  },
  computed: {},
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
  },
  methods: {
    scroll(e) {},
    loadTasks(htype) {
      return taskService.query({ htype }).then((datas) => {
        this.tasks = datas;
      });
    },
    viewTask(task) {
      let service = this.type == "A" ? typeAService : typeCService;
      service.query({ task_id: task.guid }).then((datas) => {
        this.datas = datas;
        this.datas.forEach((d) => {
          if (this.selMap[d.guid]) {
            d.selected = true;
            d.stage_index = this.selMap[d.guid];
          } else {
            d.selected = false;
          }
        });
        this.mode = "selectEvent";
      });
    },
    back() {
      if (this.mode == "selectEvent") {
        this.mode = "selectTask";
        this.allowPost = false;
      } else {
        uni.navigateBack();
      }
    },
    selectEvent(data) {
      //选择或取消选择事件,并且维护好选择的顺序
      data.selected = !data.selected;
      let len = this.datas.filter((d) => d.selected).length;
      if (data.selected) {
        data.stage_index = len;
      } else {
        this.datas.filter((d, i) => {
          if (d.selected && d.stage_index > data.stage_index) {
            d.stage_index--;
            this.$set(this.datas, i, d);
          }
        });
        data.stage_index = "";
      }
      this.$set(this.datas, this.datas.indexOf(data), data);
      if (len > 1) {
        this.allowPost = true;
      } else {
        this.allowPost = false;
      }
    },
    postSelect() {
      let selectDatas = this.datas.filter((d) => d.selected);
      selectDatas.sort((a, b) => {
        if (a.stage_index > b.stage_index) {
          return 1;
        } else if (a.stage_index == b.stage_index) {
          return 0;
        } else {
          return -1;
        }
      });
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      if (prevPage.$vm.onSelectEvents) {
        prevPage.$vm.onSelectEvents(selectDatas);
      }
      uni.navigateBack();
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
    color: #666;
    font-size: 18px;
    padding: 0 15px;
  }
  .icon.iconfont {
    font-size: 20px;
    font-weight: bold;
    color: #007aff;
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

.color-text-htype {
  background: rgba(236, 221, 87, 0.5);
  color: rgb(228, 141, 60);
}
.color-text-scope {
  background: rgba(204, 87, 72, 0.3);
  color: rgb(204, 87, 72);
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
.select-num {
  display: inline-block;
  height: 30px;
  width: 30px;
  margin: 20px 0px;
  border-radius: 20px;
  border: 2px solid #ccc;
  box-sizing: border-box;
  background: #fff;
  text-align: center;

  &.selected {
    border: 2px solid #359dff;
    background: #359dff;
    color: #fff;
    font-size: 16px;
  }
}
</style>
