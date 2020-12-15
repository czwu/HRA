<template>
  <view class="container">
    <view class="uni-column">
      <view class="uni-row i-header">
        <text
          class="icon iconfont iconright1"
          style="color: #007aff"
          @click="back(2)"
        ></text>
        <text class="i-header-text">情境表</text>
        <view class="uni-grow"></view>
      </view>

      <view class="i-tab">
        <view class="tab-item" @click="back(1)">情境版本</view>
        <view class="tab-item active">评分</view>
      </view>
      <view class="uni-grow">
        <scroll-view
          scroll-y="true"
          class="sv"
          :style="{ height: scrollHeight + 'px' }"
        >
          <view class="issue-label">
            问题1 : 该情景下你是否可以获得足够信息以帮你完成本次任务？
          </view>
          <view class="issue-answer">
            <textarea
              class="uni-textarea"
              placeholder-style="color:#bbb"
              placeholder="请输入你的答案"
              :value="formdata.answer1"
              @blur="textareaBlur('answer1', $event)"
            />
          </view>
          <view class="issue-label">
            问题2 : 该情境下你的工作负荷是否高？是否还有剩余的精力执行其他任务？
          </view>
          <view class="issue-answer">
            <textarea
              class="uni-textarea"
              placeholder-style="color:#bbb"
              :value="formdata.answer2"
              placeholder="请输入你的答案"
              @blur="textareaBlur('answer2', $event)"
            />
          </view>
          <view class="i-tab">
            <view
              class="tab-item"
              :class="{ active: currTabIndex == 1 }"
              @click="tabClick(1)"
              >工作负荷NASA TLX等级（分数1-10）从低到高</view
            >
            <view
              class="tab-item"
              style="margin-left: 15px"
              :class="{ active: currTabIndex == 2 }"
              @click="tabClick(2)"
              >3D SART等级（分数1-10）从低到高</view
            >
            <text class="desc">*打分选项为二选一，分数越高说明严重 </text>
          </view>
          <view class="issue-layout uni-grow">
            <view
              class="issue-item"
              v-for="(issue, key) in issues"
              v-bind:key="issue.field"
            >
              <text class="issue-index">{{ key + 1 }}</text>
              <text class="issue-name">{{ issue.name }}</text>
              <view class="uni-grow"></view>
              <text style="padding: 0 10px">评分: </text>
              <view
                class="color-box"
                v-for="score in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                v-bind:key="score"
                @click="setScore(key + 1, score)"
                :class="
                  formdata['score_' + (key + 1)] == score ? 'selected' : ''
                "
                :style="{
                  color:
                    formdata['score_' + (key + 1)] == score
                      ? score < 3
                        ? '#666'
                        : '#fff'
                      : '#666',
                  background:
                    formdata['score_' + (key + 1)] == score
                      ? 'rgba(161, 3, 3,' + score * 0.1 + ')'
                      : '#fff',
                }"
              >
                {{ score }}</view
              >
            </view>
            <view class="issue-item item-total">
              总分 <view class="uni-grow"></view>
              <view class="score_total">{{ formdata.score_total }}</view>
            </view>
            <view class="input-item uni-flex uni-row uni-row">
              <view class="uni-input-label">测试人员其他意见</view>
              <input
                class="uni-input"
                name="input"
                type="text"
                v-model="formdata.tester_opinion"
                placeholder-style="color:#bbb"
                @blur="inputBlur"
                placeholder="请输入"
              />

              <view class="media-bar" @click="popupMedia()">
                <text class="icon iconfont">&#xe66e;</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
    <comp-media ref="media"></comp-media>
  </view>
</template>

<script>
import moduleService from "../../service/isv/situationScore";
import util from "../../common/util";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      winHeight: 0,
      scrollHeight: 0,
      searchVal: "",
      list: [],
      parentId: "",
      mode: "create",
      auto_save: true,
      guid: moduleService.genGuid(),
      formdata: {
        foreign_id: "",
        answer1: "",
        answer2: "",
        score_type: 1,
        score_total: 0,
        tester_opinion: "",
        score_1: 0,
        score_2: 0,
        score_3: 0,
        score_4: 0,
        score_5: 0,
        score_6: 0,
      },
      currTabIndex: 1,
      issues: [],
      issueList: [
        {
          name:
            " 认知需求：情境需要多少认识活动（如：思考、决策、计算、记忆、观察、搜索等）？",
          field: "score_tlx1",
          type: 1,
        },
        {
          name: "体力需求：请境需要多少体力活动（如旋转、控制）？",
          field: "score_tlx2",
          type: 1,
        },
        {
          name:
            " 时间需求：在事件发生时，感受到多大的时间压力？（节奏是慢且从容的，还是快且忙乱的）",
          field: "score_tlx3",
          type: 1,
        },
        {
          name: "花费精力：完成工程需要花费的精力（身体和精神上的）",
          field: "score_tlx4",
          type: 1,
        },
        {
          name: "效能：你认为有多成功地完成情境目标？（是否满意自己操作）",
          field: "score_tlx5",
          type: 1,
        },
        {
          name:
            "挫折级别：在情境中感到不安、气馁、恼怒、紧张、还是满足、满意、放松（分数越高，挫折级别越高）",
          field: "score_tlx6",
          type: 1,
        },
        {
          name:
            "情境所需要的注意力是否高，如场景的不稳定性，场景忽然变化的可能性和复杂性。",
          field: "score_tlx1",
          type: 2,
        },
        {
          name: "操纵员注意力的供给：操纵员在事件出现时是否有足够的精力去应对",
          field: "score_tlx2",
          type: 2,
        },
        {
          name:
            "情 人机接口提供的信息数量和质量是否可以满足情境理解和电厂状态评估的需求。",
          field: "score_tlx3",
          type: 2,
        },
      ],
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
            _this.scrollHeight = res.windowHeight - data.top - 30;
          })
          .exec();
      },
    });
  },
  onLoad(options) {
    this.issues = this.issueList.filter((d) => d.type == 1);
    this.parentId = options.guid || "GUID001";
    this.loadData();
  },
  onShow() {},
  computed: {},
  methods: {
    tabClick(i) {
      for (let i = 1; i <= 6; i++) {
        this.$set(this.formdata, "score_" + i, 0);
      }
      this.issues = this.issueList.filter((d) => d.type == i);
      this.currTabIndex = i;
      this.score_total = 0;
    },
    save() {},
    back(delta) {
      uni.navigateBack({
        animationType: delta == 1 ? "none" : "slide-out-right",
        delta,
      });
    },
    loadData() {
      moduleService
        .query({
          foreign_id: this.parentId,
        })
        .then((data) => {
          if (data.length) {
            Object.assign(this.formdata, data[0]);
            this.guid = data[0].guid;
            this.mode = "update";
            this.currTabIndex = this.formdata.score_type;
            this.issues = this.issueList.filter(
              (d) => d.type == this.currTabIndex
            );
          }
        });
    },
    textareaBlur(field, e) {
      this.formdata[field] = e.detail.value;
      this.autoSave();
    },
    inputBlur() {
      this.autoSave();
    },
    setScore(index, score) {
      this.$set(this.formdata, "score_" + index, score);
      let total = 0;
      for (let i = 1; i <= 6; i++) {
        total += this.formdata["score_" + i];
      }
      this.formdata.score_total = total;
      this.autoSave();
    },
    popupMedia() {
      this.$refs.media.popup(this.guid, "tester_opinion");
    },
    autoSave() {
      if (this.auto_save) {
        this.save();
      }
    },
    save() {
      this.formdata.score_type = this.currTabIndex;
      this.formdata.foreign_id = this.parentId;
      var fn = this.mode == "create" ? "insert" : "update";
      if (this.mode == "create") {
        this.formdata.guid = this.guid;
      }
      moduleService[fn](this.formdata).then(() => {
         this.mode = 'update'
        // uni.showToast({
        //   title: "保存成功!",
        //   duration: 2000,
        // });
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
    color: #444;
    font-size: 18px;
    padding: 0 20px;
  }
  .icon.iconfont {
    color: #007aff;
    font-size: 20px;
    font-weight: bold;
  }
}
.icon.iconfont {
  vertical-align: middle;
  font-size: 20px;
  color: #b2b2b2;

  &:hover {
    color: #007aff;
  }
}
.i-tab {
  padding: 10px 20px;
  display: flex;
  font-size: 13px;
  flex-direction: row;
  color: #666;
  .tab-item {
    padding: 2px 0px;
    margin-right: 15px;
    box-sizing: content-box;
    &.active {
      color: #007aff;
      border-bottom: 2px solid #007aff;
    }
  }
}
.issue-label {
  font-size: 13px;
  color: #444;
  padding: 2px 20px;
}

.issue-answer {
  padding: 5px 20px;
}
.uni-textarea {
  width: 98%;
  border: 1px solid #f2f2f2;
  font-size: 13px;
  padding: 5px 10px;
  height: 30px;
}
.desc {
  color: #aaa;
  font-size: 11px;
  line-height: 30px;
}
.issue-layout {
  padding: 0 15px 0 20px;
}
.issue-item {
  display: flex;
  flex-direction: row;
  // border: 1px solid #f2f2f2;
  flex-grow: 1;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  margin-bottom: 10px;
  color: #666;
}
.issue-index {
  padding: 0 10px;
}
.color-box {
  width: 30px;
  box-sizing: border-box;
  text-align: center;
  margin-left: 3px;
  border-radius: 2px;
  line-height: 26px;
  border: 1px solid #f2f2f2;
  &.selected {
    font-weight: bold;
  }
}
.item-total {
  padding-left: 10px;
  font-weight: bold;
  border-bottom: 1px solid #f2f2f2;
}
.score_total {
  background: rgba(216, 56, 56, 0.9);
  text-align: center;
  width: 60px;
  color: #fff;
}
.input-item {
  margin: 15px 0;
  padding: 2px 10px;
  border: 1px solid #f2f2f2;
  line-height: 40px;
  height: 40px;
  .uni-input-label {
    font-size: 13px;
    color: #333;
    width: 140px;
  }
  .uni-input {
    box-sizing: border-box;
    font-size: 13px;
    color: #333;
    width: 200px;
    padding: 0px;
    height: 40px !important;
  }
}
.media-bar {
  padding: 0 10px;
  .icon.iconfont {
    color: #888;
    font-weight: bold;
    font-size: 20px;
  }
}
</style>
