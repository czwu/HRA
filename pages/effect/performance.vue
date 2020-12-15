<template>
  <view class="container">
    <view class="uni-column">
      <view class="uni-row i-header">
        <text
          class="icon iconfont iconright1"
          style="color: #007aff"
          @click="back(2)"
        ></text>
        <text class="i-header-text">{{ parentName }}</text>
        <view class="uni-grow"></view>
      </view>
      <view class="i-tab-layout">
        <view class="i-tab">
          <view class="tab-item" @click="back(1)">{{
            type == 1 ? "SF评分" : "操作流程"
          }}</view>
          <view class="tab-item active">绩效评分</view>
        </view>
      </view>
      <scroll-view
        scroll-y="true"
        class="sv"
        :style="{ height: scrollHeight + 'px' }"
      >
        <view class="uni-grow" style="padding: 0 20px">
          <view class="option-item uni-flex uni-row">
            <view class="option-label">等级</view>
            <view
              class="option-val"
              v-for="option in level_options"
              v-bind:key="option.vlaue"
              @click="checkItem('level', option)"
              :class="{ checked: option.value == formdata.level }"
              >{{ option.name }}</view
            >
          </view>
          <view class="uni-row">
            <view class="option-item uni-flex uni-row uni-grow">
              <view class="option-label">INPO</view>
              <view
                class="option-val"
                v-for="option in inpo_options"
                v-bind:key="option.vlaue"
                @click="checkItem('inpo', option)"
                :class="{ checked: option.value == formdata.inpo }"
                >{{ option.name }}</view
              >
            </view>
            <view class="" style="width: 20px"></view>
            <view class="option-item uni-flex uni-row uni-grow">
              <view class="option-label">失误模式</view>
              <view
                class="option-val"
                v-for="option in mode_options"
                v-bind:key="option.vlaue"
                @click="checkItem('err_mode', option)"
                :class="{ checked: option.value == formdata.err_mode }"
                >{{ option.name }}</view
              >
            </view>
          </view>
          <view class="option-item uni-flex uni-row">
            <view>1、我是失误原因文字描述内容等</view>
            <view class="uni-grow"></view>
            <picker
              mode="selector"
              :range="[0, 1, 2, 3, 4, 5]"
              :value="formdata.score1"
              @change="dataChange('score1', $event.detail.value)"
            >
              <view class="uni-row">
                <text class="score-label">评分:</text>
                <view
                  class="score-btn"
                  :class="{ score: formdata.score1 || formdata.score1 === 0 }"
                >
                  <text
                    class="icon iconfont iconpingfen"
                    v-if="!formdata.score1 && formdata.score1 !== 0"
                  ></text>
                  <text style="padding: 0 6px" v-else>
                    {{ formdata.score1 }}
                  </text>
                </view>
              </view>
            </picker>
          </view>
          <view class="option-item uni-flex uni-row">
            <text class="input-label">回答</text>
            <input
              class="uni-input flex-grow"
              name="input"
              type="text"
              v-model="formdata.answer1"
              placeholder-style="color:#bbb"
              style="padding-left: 30px"
              @blur="dataChange('answer1')"
              placeholder="请输入"
            />
            <text
              class="icon iconfont iconelipsis"
              @click="popupMedia('answer1')"
            ></text>
          </view>
          <view class="option-item uni-flex uni-row">
            <text class="input-label">人误恢复情况</text>
            <input
              class="uni-input flex-grow"
              name="input"
              type="text"
              v-model="formdata.restore1"
              placeholder-style="color:#bbb"
              style="padding-left: 30px"
              @blur="dataChange('restore1')"
              placeholder="请输入"
            />
            <text
              class="icon iconfont iconelipsis"
              @click="popupMedia('restore1')"
            ></text>
          </view>
          <view class="option-item uni-flex uni-row">
            <text class="input-label"> 人误对核电站的影响</text>
            <input
              class="uni-input flex-grow"
              name="input"
              type="text"
              v-model="formdata.effect1"
              placeholder-style="color:#bbb"
              style="padding-left: 30px"
              @blur="dataChange('effect1')"
              placeholder="请输入"
            />
            <text
              class="icon iconfont iconelipsis"
              @click="popupMedia('effect1')"
            ></text>
          </view>
          <view class="option-item uni-flex uni-row">
            <text class="input-label"> 改进措施和建议</text>
            <input
              class="uni-input flex-grow"
              name="input"
              type="text"
              v-model="formdata.measure1"
              placeholder-style="color:#bbb"
              style="padding-left: 30px"
              @blur="dataChange('measure1')"
              placeholder="请输入"
            />
            <text
              class="icon iconfont iconelipsis"
              @click="popupMedia('measure1')"
            ></text>
          </view>
          <view class="option-item uni-flex uni-row">
            <text class="input-label"> 相关文件</text>
            <text class="file-text">{{
              formdata.document1 | filePathRender
            }}</text>
            <text
              v-show="!formdata.document1"
              style="color: #bbb; padding-left: 30px"
              >请选择</text
            >
            <view class="uni-grow"></view>
            <text
              class="icon iconfont iconlianjie input-icon"
              @click="openSelectFilePage('document1')"
            ></text>
          </view>
          <view class="option-item uni-flex uni-row">
            <text class="input-label"> 备注</text>
            <input
              class="uni-input flex-grow"
              name="input"
              type="text"
              v-model="formdata.remark1"
              placeholder-style="color:#bbb"
              style="padding-left: 30px"
              @blur="dataChange('remark1')"
              placeholder="请输入"
            />
            <text
              class="icon iconfont iconelipsis"
              @click="popupMedia('remark1')"
            ></text>
          </view>

          <view class="option-item uni-flex uni-row">
            <view>2、我是失误原因文字描述内容等</view>
            <view class="uni-grow"></view>
            <picker
              mode="selector"
              :range="[0, 1, 2, 3, 4, 5]"
              :value="formdata.score1"
              @change="dataChange('score2', $event.detail.value)"
            >
              <view class="uni-row">
                <text class="score-label">评分:</text>
                <view
                  class="score-btn"
                  :class="{ score: formdata.score2 || formdata.score2 === 0 }"
                >
                  <text
                    class="icon iconfont iconpingfen"
                    v-if="!formdata.score2 && formdata.score2 !== 0"
                  ></text>
                  <text style="padding: 0 6px" v-else>
                    {{ formdata.score2 }}
                  </text>
                </view>
              </view>
            </picker>
          </view>
          <view class="option-item uni-flex uni-row">
            <text class="input-label">回答</text>
            <input
              class="uni-input flex-grow"
              name="input"
              type="text"
              v-model="formdata.answer2"
              placeholder-style="color:#bbb"
              style="padding-left: 30px"
              @blur="dataChange('answer2')"
              placeholder="请输入"
            />
            <text
              class="icon iconfont iconelipsis"
              @click="popupMedia('answer2')"
            ></text>
          </view>
          <view class="option-item uni-flex uni-row">
            <text class="input-label">人误恢复情况</text>
            <input
              class="uni-input flex-grow"
              name="input"
              type="text"
              v-model="formdata.restore2"
              placeholder-style="color:#bbb"
              style="padding-left: 30px"
              @blur="dataChange('restore2')"
              placeholder="请输入"
            />
            <text
              class="icon iconfont iconelipsis"
              @click="popupMedia('restore2')"
            ></text>
          </view>
          <view class="option-item uni-flex uni-row">
            <text class="input-label"> 人误对核电站的影响</text>
            <input
              class="uni-input flex-grow"
              name="input"
              type="text"
              v-model="formdata.effect2"
              placeholder-style="color:#bbb"
              style="padding-left: 30px"
              @blur="dataChange('effect2')"
              placeholder="请输入"
            />
            <text
              class="icon iconfont iconelipsis"
              @click="popupMedia('effect2')"
            ></text>
          </view>
          <view class="option-item uni-flex uni-row">
            <text class="input-label"> 改进措施和建议</text>
            <input
              class="uni-input flex-grow"
              name="input"
              type="text"
              v-model="formdata.measure2"
              placeholder-style="color:#bbb"
              style="padding-left: 30px"
              @blur="dataChange('measure2')"
              placeholder="请输入"
            />
            <text
              class="icon iconfont iconelipsis"
              @click="popupMedia('measure2')"
            ></text>
          </view>
          <view class="option-item uni-flex uni-row">
            <text class="input-label"> 相关文件</text>
            <text class="file-text">{{
              formdata.document2 | filePathRender
            }}</text>
            <text
              v-show="!formdata.document2"
              style="color: #bbb; padding-left: 30px"
              >请选择</text
            >
            <view class="uni-grow"></view>
            <text
              class="icon iconfont iconlianjie input-icon"
              @click="openSelectFilePage('document2')"
            ></text>
          </view>
          <view class="option-item uni-flex uni-row">
            <text class="input-label"> 备注</text>
            <input
              class="uni-input flex-grow"
              name="input"
              type="text"
              v-model="formdata.remark2"
              placeholder-style="color:#bbb"
              style="padding-left: 30px"
              @blur="dataChange('remark2')"
              placeholder="请输入"
            />
            <text
              class="icon iconfont iconelipsis"
              @click="popupMedia('remark2')"
            ></text>
          </view>
        </view>
      </scroll-view>
    </view>
    <comp-media ref="media"></comp-media>
  </view>
</template>

<script>
import moduleService from "../../service/effect/performance";
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
      type: 1,
      guid: moduleService.genGuid(),
      parentName: "",
      formdata: {
        foreign_id: "",
        level: "",
        inpo: "",
        err_mode: "",
        score1: "",
        answer1: "",
        restore1: "",
        effect1: "",
        measure1: "",
        document1: "",
        remark1: "",
        score2: "",
        answer2: "",
        restore2: "",
        effect2: "",
        measure2: "",
        document2: "",
        remark2: "",
      },
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
      ],
      level_options: [
        { name: "非常满意", value: 1 },
        { name: "满意", value: 2 },
        { name: "有偏差", value: 3 },
        { name: "不满意", value: 4 },
      ],
      inpo_options: [
        { name: "选项1", value: 1 },
        { name: "选项2", value: 2 },
        { name: "选项3", value: 3 },
      ],
      mode_options: [
        { name: "选项1", value: 1 },
        { name: "选项2", value: 2 },
        { name: "选项3", value: 3 },
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
    this.type = options.type;
    this.parentId = options.guid;
    this.parentName = options.name;
    this.loadData();
  },
  onShow() {},
  computed: {},
  methods: {
    checkItem(type, option) {
      this.formdata[type] = option.value;
      this.autoSave();
    },
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
          type: this.type,
        })
        .then((data) => {
          if (data.length) {
            Object.assign(this.formdata, data[0]);
            this.guid = data[0].guid;
            this.mode = "update";
          }
        });
    },
    popupMedia(field) {
      this.$refs.media.popup(this.guid, field);
    },
    dataChange(field, value) {
      if (value) {
        this.formdata[field] = value;
      }
      this.autoSave();
    },
    autoSave() {
      var fn = this.mode == "create" ? "insert" : "update";
      this.formdata.type = this.type;
      if (this.mode == "create") {
        this.formdata.guid = this.guid;
        this.formdata.foreign_id = this.parentId;
      }
      moduleService[fn](this.formdata).then(() => {
        this.mode = "update";
      });
    },
    openSelectFilePage(field) {
      uni.navigateTo({ url: "/pages/filesys/selectFile?field=" + field });
    },
    onSelectFile({ field, path, guid }) {
      this.formdata[field] = guid;
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
.option-item {
  margin-bottom: 10px;
  line-height: 36px;
  box-sizing: border-box;
  padding: 5px 10px;
  border: 1px solid #f2f2f2;
  .option-label {
    width: 80px;
  }
  .input-label {
    width: 130px;
  }
  > .icon {
    padding-right: 10px;
  }
  .option-val {
    background: #f2f2f2;
    line-height: 36px;
    height: 36px;
    width: 120px;
    text-align: center;
    margin-left: 10px;
    &.checked {
      background: #dceaf8;
      color: #007aff;
    }
  }
  .score-label {
    padding: 0 20px;
  }
  .score-btn {
    padding: 0 10px;
    background: #f2f2f2;
    &.score {
      background: #007aff;
    }
    .icon.iconfont {
      color: rgb(228, 198, 28);
    }
    text {
      color: #fff;
    }
  }
}
</style>
