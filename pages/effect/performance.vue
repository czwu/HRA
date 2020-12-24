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
        <text
          class="icon iconfont iconsure"
          style="color: #007aff"
          @click="save"
        />
      </view>
      <view class="i-tab-layout">
        <view class="i-tab" v-if="type == 1">
          <view class="tab-item" @click="back(1)"> 情境因子 </view>
          <view class="tab-item active">评价</view>
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
          <view>
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
          </view>
          <view class="lapse uni-column" v-if="lapseData.length">
            <view class="lapse-head uni-row" @click="expand = !expand">
              <text class="">失误模式</text>
              <view class="uni-grow"></view>
              <text
                class="icon iconfont iconshousuo"
                style="font-size: 12px; margin-right: 15px"
                :style="expand ? 'transform: rotate(90deg)' : ''"
              ></text>
            </view>
            <view
              v-show="expand"
              class="lapse-type uni-column"
              v-for="typeData in lapseData"
              v-bind:key="typeData.type_code"
            >
              <view
                class="lapse-type-head uni-row"
                @click="typeData.expand = !typeData.expand"
              >
                <text class=""> {{ typeData.type }}</text>
                <view class="uni-grow"></view>
                <text
                  class="icon iconfont iconshousuo"
                  style="font-size: 12px; margin-right: 15px"
                  :style="typeData.expand ? 'transform: rotate(90deg)' : ''"
                ></text>
              </view>
              <view
                class="lapse-type-content uni-column"
                v-show="typeData.expand"
              >
                <view
                  class="lapse-option-list uni-column"
                  v-for="option in typeData.options"
                  v-bind:key="option.code"
                >
                  <view class="lapse-option-warp uni-column">
                    <view
                      class="lapse-option-item uni-row"
                      :class="{ selected: option.selected }"
                    >
                      <text
                        class="radio icon iconfont"
                        @click="lapseSelect(option)"
                        :class="
                          option.group
                            ? option.selected
                              ? 'iconxuanze1'
                              : 'iconxuanze'
                            : option.selected
                            ? 'iconxuanzeyixuan'
                            : 'icondaixuanze'
                        "
                      ></text>
                      <text class="" @click="lapseSelect(option)">{{
                        option.name
                      }}</text>
                      <view
                        class="lapse-input uni-row uni-grow"
                        v-if="option.selected && !option.options"
                      >
                        <input
                          class="uni-input flex-grow"
                          name="input"
                          type="text"
                          v-model="option.remark"
                          placeholder-style="color:#bbb"
                          style="padding-left: 30px"
                          placeholder="可输入备注信息"
                        />
                        <text
                          class="icon iconfont iconelipsis"
                          @click="popupMedia2Lapse(option)"
                        ></text>
                      </view>
                    </view>
                    <view
                      class="lapse-option-level2"
                      v-if="option.options && option.selected"
                    >
                      <view
                        class="lapse-option-list uni-column"
                        v-for="option in option.options"
                        v-bind:key="option.code"
                      >
                        <view class="lapse-option-warp uni-column">
                          <view
                            class="lapse-option-item uni-row"
                            :class="{ selected: option.selected }"
                          >
                            <text
                              class="radio icon iconfont"
                              @click="lapseSelect(option)"
                              :class="
                                option.group
                                  ? option.selected
                                    ? 'iconxuanze1'
                                    : 'iconxuanze'
                                  : option.selected
                                  ? 'iconxuanzeyixuan'
                                  : 'icondaixuanze'
                              "
                            ></text>
                            <text @click="lapseSelect(option)">{{
                              option.name
                            }}</text>
                            <view
                              class="lapse-input uni-row uni-grow"
                              v-if="option.selected && !option.options"
                            >
                              <input
                                class="uni-input flex-grow"
                                name="input"
                                type="text"
                                v-model="option.remark"
                                placeholder-style="color:#bbb"
                                style="padding-left: 30px"
                                placeholder="可输入备注信息"
                              />
                              <text
                                class="icon iconfont iconelipsis"
                                @click="popupMedia2Lapse(option)"
                              ></text>
                            </view>
                          </view>
                          <view
                            class="lapse-option-level3"
                            v-if="option.options && option.selected"
                          >
                            <view
                              class="lapse-option-list uni-column"
                              v-for="option in option.options"
                              v-bind:key="option.code"
                            >
                              <view class="lapse-option-warp uni-column">
                                <view
                                  class="lapse-option-item uni-row"
                                  :class="{ selected: option.selected }"
                                >
                                  <text
                                    @click="lapseSelect(option)"
                                    class="radio icon iconfont"
                                    :class="
                                      option.group
                                        ? option.selected
                                          ? 'iconxuanze1'
                                          : 'iconxuanze'
                                        : option.selected
                                        ? 'iconxuanzeyixuan'
                                        : 'icondaixuanze'
                                    "
                                  ></text>
                                  <text @click="lapseSelect(option)">{{
                                    option.name
                                  }}</text>
                                  <view
                                    class="lapse-input uni-row uni-grow"
                                    v-if="option.selected && !option.options"
                                  >
                                    <input
                                      class="uni-input flex-grow"
                                      name="input"
                                      type="text"
                                      v-model="option.remark"
                                      placeholder-style="color:#bbb"
                                      style="padding-left: 30px"
                                      placeholder="可输入备注信息"
                                    />
                                    <text
                                      class="icon iconfont iconelipsis"
                                      @click="popupMedia2Lapse(option)"
                                    ></text>
                                  </view>
                                </view>
                                <view
                                  class="lapse-option-level3"
                                  v-if="option.options"
                                >
                                </view>
                              </view>
                            </view>
                          </view>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view
            class="lapse-head uni-row"
            @click="expand2 = !expand2"
            style="margin: 10px 0"
          >
            <text class="">人误问题与评分</text>
            <view class="uni-grow"></view>
            <text
              class="icon iconfont iconshousuo"
              style="font-size: 12px; margin-right: 15px"
              :style="expand2 ? 'transform: rotate(90deg)' : ''"
            ></text>
          </view>
          <view class="uni-column" v-if="expand2">
            <view class="option-item uni-flex uni-row">
              <view class="uni-row uni-grow">
                <text class="">问题1:</text>
                <input
                  class="uni-input flex-grow"
                  name="input"
                  type="text"
                  v-model="formdata.req1"
                  placeholder-style="color:#bbb"
                  style="padding-left: 10px"
                  @blur="dataChange('req1')"
                  placeholder="请输入问题!"
              /></view>

              <view class="uni-row" @click="openScore('score1')">
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
              <view class="uni-row uni-grow">
                <text class="">问题2:</text>
                <input
                  class="uni-input flex-grow"
                  name="input"
                  type="text"
                  v-model="formdata.req2"
                  placeholder-style="color:#bbb"
                  style="padding-left: 10px"
                  @blur="dataChange('req2')"
                  placeholder="请输入问题!"
              /></view>

              <view class="uni-row" @click="openScore('score2')">
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
        </view>
      </scroll-view>
    </view>
    <comp-media ref="media"></comp-media>
    <uni-popup ref="numPopup">
      <uni-popup-dialog type="info" mode="base" title="评分" :nobtn="true">
        <view
          class="tag-items uni-grow uni-row"
          style="padding: 0 20px 40px 20px"
        >
          <text
            class="num-item"
            v-for="num in nums"
            v-bind:key="num"
            @click="setScore(num)"
            >{{ num }}</text
          >
        </view>
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
import moduleService from "../../service/effect/performance";
import lapseService from "../../service/effect/lapse";
import util from "../../common/util";
import { mapState, mapActions } from "vuex";
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import uniPopupDialog from "@/components/uni-popup/uni-popup-dialog.vue";
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
      expand: true,
      expand2: true,
      guid: moduleService.genGuid(),
      parentName: "",
      nums: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
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
      level_options: [
        { name: "非常满意", value: 1 },
        { name: "满意", value: 2 },
        { name: "有偏差", value: 3 },
        { name: "不满意", value: 4 },
      ],
      inpo_options: [
        { name: "Team work", value: 1 },
        { name: "control", value: 2 },
        { name: "monitoring", value: 3 },
        { name: "conservtion", value: 4 },
        { name: "knowledge", value: 5 },
      ],
      mode_options: [
        { name: "选项1", value: 1 },
        { name: "选项2", value: 2 },
        { name: "选项3", value: 3 },
      ],
      lapseData: [],
      lapseList: [],
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
  components: {
    uniPopup,
    uniPopupDialog,
  },
  onLoad(options) {
    this.type = options.type;
    this.parentId = options.guid;
    this.parentName = options.name;
    this.loadData();
    let lapseData = lapseService.getLapseOptions();
    this.lapseList = lapseService.getOptionList(lapseData);
    this.lapseData = lapseData;
    lapseService.query({ foreign_id: this.parentId }).then((list) => {
      //数据合并  将数据库的数据,与当前的模型合并
      let codeMap = {};
      list.forEach((item) => {
        codeMap[item.code] = item;
      });
      this.lapseList.forEach((item) => {
        if (codeMap[item.code]) {
          //如果数据库存在记录,则将数据合并,并选中
          Object.assign(item, codeMap[item.code]);
          item.selected = true;
        }
      });
    });
  },
  onShow() {},
  computed: {},
  methods: {
    checkItem(type, option) {
      this.formdata[type] = option.value;
      this.autoSave();
    },
    back(delta) {
      if (this.type == 2) {
        uni.navigateBack();
      } else {
        uni.navigateBack({
          animationType: delta == 1 ? "none" : "slide-out-right",
          delta,
        });
      }
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
    popupMedia2Lapse(option) {
      this.$refs.media.popup(option.guid, "remark");
    },
    dataChange(field, value) {
      if (value) {
        this.formdata[field] = value;
      }
      this.autoSave();
    },
    autoSave() {},
    save() {
      var fn = this.mode == "create" ? "insert" : "update";
      this.formdata.type = this.type;
      if (this.mode == "create") {
        this.formdata.guid = this.guid;
        this.formdata.foreign_id = this.parentId;
      }
      moduleService[fn](this.formdata).then(() => {
        this.mode = "update";
        this.back(2);
      });

      //删除原有数据
      this.lapseList.forEach((item) => (item.foreign_id = this.parentId));
      lapseService.removeBy({ foreign_id: this.parentId }).then(() => {
        let selectedList = this.lapseList.filter((item) => item.selected);
        if (selectedList.length) {
          lapseService.insertList(selectedList, "multi");
        }
      });
    },

    openSelectFilePage(field) {
      uni.navigateTo({ url: "/pages/filesys/selectFile?field=" + field });
    },
    onSelectFile({ field, path, guid }) {
      this.formdata[field] = guid;
    },
    openScore(field) {
      this.openScoreField = field;
      this.$refs.numPopup.open();
    },

    setScore(num) {
      this.formdata[this.openScoreField] = num;
      this.$refs.numPopup.close();
      this.autoSave();
    },
    lapseSelect(option) {
      if (option.selected) {
        option.selected = false;
      } else {
        if (option.group) {
          //如有有同组的数据,则同组为单选,清楚其他选择项
          this.lapseList.forEach((item) => {
            if (item.group == option.group) {
              item.selected = false;
            }
          });
        }
        option.selected = true;
      }
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
.num-item {
  margin-right: 10px;
  width: 40px;
  text-align: center;
  display: block;
  padding: 5px 0;
  font-weight: bold;
  background: #cedbf5;
  color: #007aff;
}
.lapse-head {
  line-height: 40px;
  text-align: left;
  padding: 0 15px;
  background: rgb(212, 228, 243);
}
.lapse-type {
  margin-bottom: 10px;
}
.lapse-type-head {
  line-height: 40px;
  text-align: left;
  padding: 0 15px;
  font-weight: bold;
  font-size: 13px;
  color: #888;
  background: #f2f2f2;
}
.lapse-option-warp {
  padding-left: 20px;
}
.lapse-option-item {
  line-height: 40px;
  font-size: 13px;
}
.radio.icon {
  margin-right: 15px;
}
.lapse-option-item.selected {
  > .radio.icon {
    color: #007aff;
  }
}
.lapse-input {
  padding-right: 20px;
  .uni-input {
    color: #007aff;
    font-size: 13px;
  }
}
.uni-input {
  color: #007aff;
}
</style>
