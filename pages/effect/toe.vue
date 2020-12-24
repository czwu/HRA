<template>
  <view class="container">
    <view class="uni-row i-header">
      <text
        class="icon iconfont iconright1"
        style="color: #007aff"
        @click="back()"
      ></text>
      <view style="width: 15px"></view>
      <text class="i-header-text">{{ title }}</text>
      <view class="uni-grow"></view>
    </view>
    <view class="i-tab-layout">
      <view class="i-tab uni-row">
        <view class="tab-item active">情境因子</view>
        <view class="tab-item" @click="goScore()">评价</view>
      </view>
    </view>

    <view class="tab-layout uni-column">
      <view class="i-tabs uni-grow uni-row">
        <view
          class="tab-item"
          v-for="(tab, key) in tabs"
          v-bind:key="key"
          @click="tabClick(tab, key)"
        >
          <text class="tab-item-title" :class="{ hover: tabIndex == key }">{{
            tab.type
          }}</text>
        </view>
      </view>
    </view>
    <view class="uni-column">
      <scroll-view
        scroll-y="true"
        class="sv"
        :style="{ height: scrollHeight + 'px' }"
      >
        <view class="question-layout" v-if="inited">
          <view
            class="question-item"
            v-for="question in questionGroup.questions"
            :class="{ 'desc-item': question.input }"
            v-bind:key="question.question"
          >
            <view class="question-title uni-row">
              {{ question.question }}
              <view class="uni-grow"></view>
              <text
                class="icon iconfont input-icon iconelipsis"
                @click="popupMedia(question)"
              ></text>
              <view style="width: 10px"></view>
            </view>
            <view class="options-layout" v-if="question.options">
              <view
                class="option-item uni-row uni-flex"
                v-for="option in question.options"
                v-bind:key="option.index"
                @click="selectOption(question, option)"
                :class="option.css"
              >
                <view
                  class="option-icon"
                  :class="{ selected: option.selected }"
                >
                  <text
                    class="icon iconfont"
                    :class="{ iconsure: option.selected }"
                  ></text>
                </view>
                <text class="">
                  {{ option.name }}
                </text>
                <view class="uni-grow" style="width: 15px"></view>
                <view
                  class="text-warp uni-row"
                  v-if="question.text1 && option.index == question.text_index"
                >
                  <text class="text1"> {{ question.text1 }}: </text>
                  <input
                    class="uni-input"
                    placeholder="请输入"
                    v-model="question.value1"
                    placeholder-style="color:#bbb"
                    @blur="textChange(question)"
                  />
                  <text class="text2"> {{ question.text2 }}: </text>
                  <input
                    class="uni-input"
                    placeholder="请输入"
                    v-model="question.value2"
                    placeholder-style="color:#bbb"
                    @blur="textChange(question)"
                  />
                </view>
              </view>
            </view>
            <view class="desc-text uni-grow flex-row" v-if="question.input">
              <textarea
                class="uni-textarea"
                placeholder-style="color:#bbb"
                placeholder="请输入"
                :value="question.descrip"
                @blur="textareaBlur(question, 'descrip', $event)"
              />
            </view>
          </view>
        </view>
      </scroll-view>
      <comp-media ref="media"></comp-media>
    </view>
  </view>
</template>

<script>
import util from "../../common/util";
import moduleService from "../../service/effect/toe";
import { mapState } from "vuex";

export default {
  data() {
    return {
      inited: false,
      popMenuVisible: false,
      scrollHeight: 500,
      scrollTop: 0,
      title: "",
      parentId: "",
      parentName: "",
      tabs: [],
      tabIndex: 0,
      questionGroup: [],
    };
  },
  onLoad(options) {
    this.parentId = options.guid;
    let questionGroup = moduleService.getQuestions();
    let questionMap = {};
    moduleService.query({ foreign_id: options.guid }).then((datas) => {
      datas.forEach((data) => {
        questionMap[data.question_index] = data;
      });
      questionGroup.forEach((group, i) => {
        group.questions.forEach((question, j) => {
          // question.question_index = `${i}-${j}`;
          if (questionMap[question.question_index]) {
            Object.assign(question, questionMap[question.question_index]);
          }
          question.option_index = question.option_index || "";
          if (question.option_index) {
            question.options[question.option_index - 1].selected = true;
          }
        });
      });
      this.inited = true;
    });
    this.tabs = questionGroup;
    this.questionGroup = questionGroup[0];
    uni.getStorage({
      key: "currData",
      success: (val) => {
        if (val.data) {
          this.title = val.data.name;
          this.parentName = this.title;
        }
      },
    });
  },
  onShow() {},
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
    tabClick(tab, key) {
      this.tabIndex = key;
      this.questionGroup = tab;
    },
    back() {
      uni.navigateBack();
    },
    save() {},
    selectOption(question, option) {
      question.option_index = option.index;
      question.options.forEach((option) => {
        option.selected = false;
      });
      option.selected = true;
      this.save(question);
    },
    textChange(question) {
      this.save(question);
    },
    textareaBlur(question, field, e) {
      question[field] = e.detail.value;
      this.save(question);
    },
    goScore() {
      uni.navigateTo({
        url:
          "/pages/effect/performance?guid=" +
          this.parentId +
          "&name=" +
          this.parentName +
          "&type=1",
        animationType: "none",
      });
    },
    save(question) {
      let fn = question.guid ? "update" : "insert";
      let option = question.options.filter((option) => option.selected)[0];
      if (!option && !question.input) {
        console.error(question.question + ":选项异常...未找到已选项目");
        return;
      }
      question.guid =
        question.guid || question.newid || moduleService.genGuid();
      moduleService[fn]({
        guid: question.guid,
        foreign_id: moduleService.foreign_id || this.parentId,
        type: question.type,
        question: question.question,
        question_index: question.question_index,
        option_name: question.input ? "" : option.name,
        option_index: question.input ? "" : option.index,
        value1: question.value1 || "",
        value2: question.value2 || "",
        descrip: question.descrip || "",
      }).then(() => {});
    },
    popupMedia(item) {
      if (!item.guid) {
        item.newid = moduleService.genGuid();
      }
      this.$refs.media.popup(item.guid || item.newid, "question");
    },
  },
};
</script>

<style lang="scss" scoped >
.i-tabs {
  background: #fff;
}
.split {
  height: 8px;
  background: #f2f2f2;
}
.tab-layout {
  padding: 0px 20px;
  .tab-item {
    text-align: center;
    padding: 0 28px 0 0;
  }
  .tab-item-title {
    color: #666;
    padding-bottom: 4px;
    font-size: 14px;
    &.hover {
      color: #359dff;
      border-bottom: 2px solid rgba(7, 126, 238, 0.3);
    }
  }
}
.question-layout {
  padding: 0 15px 15px 22px;
  .question-title {
    color: #777;
    border-bottom: 1px solid #f2f2f2;
    line-height: 50px;
  }

  .option-item {
    color: #333;
    font-size: 13px;
    border-bottom: 1px solid #f2f2f2;
    line-height: 46px;
    box-sizing: border-box;
  }
  .option-icon {
    box-sizing: border-box;
    width: 26px;
    height: 26px;
    border-radius: 20px;
    margin: 10px;
    background: #fff;
    border: 2px solid #e3e3e3;
    line-height: 20px;
    text-align: center;
    &.selected {
      background: #359dff;
      border: 2px solid #359dff;
    }
    .iconsure {
      color: #ddd;
      font-size: 12px !important;
    }
  }
}
.text-warp {
  line-height: 46px;
  .uni-input {
    padding: 0 10px;
    line-height: 46px;
    margin: 0px;
    height: 46px;
    font-size: 13px;
  }
}
.warp-row {
  flex-wrap: wrap;
  .text-warp {
    margin-top: -20px;
    margin-left: 45px;
    .uni-input {
      width: 150px !important;
    }
  }
}
.uni-textarea {
  flex-grow:1;
  width: 100%;
  box-sizing: border-box;
  flex-grow: 1;
  padding: 15px 15px;
  height: 100px;
  font-size: 14px;
  color: #444;
}
.desc-item.question-item {
  position: relative;;
  margin-top: 30px;
  border: 1px solid #f5f5f5;
  flex-direction: row;
  display: flex;
  .question-title {
    border-bottom: 0px;
  }
  padding: 0 10px;
  .uni-input {
    flex-grow: 1;
    padding: 0 10px;
    line-height: 46px;
    margin: 0px;
    height: 46px;
    font-size: 14px;
    color: #666;
  }
  .input-icon.iconelipsis{
    position: absolute;
    top:0px;
    right:10px;
    z-index: 100;
  }
}
.i-tab-layout {
  padding: 10px 20px;
  .i-tab {
    display: flex;
    font-size: 13px;
    flex-direction: row;
    color: #666;
    border-bottom: 1px solid #f2f2f2;
    .tab-item {
      background: #f8f8f8;
      padding: 2px 10px;
      box-sizing: content-box;
      margin-right: 3px;
      &.active {
        color: #007aff;
        border-bottom: 1px solid #007aff;
        background: #e5e9f8;
      }
    }
  }
}
</style>
