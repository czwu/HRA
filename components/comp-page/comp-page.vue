<template>
  <view class="uni-column">
    <view class="uni-row i-header">
      <text class="icon iconfont" @click="back">&#xe600;</text>
      <view class="uni-grow title">{{ title }}</view>
      <text
        @click="autoInput"
        style="margin-right: 50px; color: #007aff"
        v-if="mode != 'update'"
        >自动录入</text
      >
      <text class="icon iconfont" @click="save">&#xe656;</text>
    </view>

    <form>
      <scroll-view
        scroll-y="true"
        class="sv"
        :style="{ height: scrollHeight + 'px' }"
      >
        <view class="uni-row form-padding" v-if="dicts && dicts.length">
          <view
            class="uni-row row-item uni-grow"
            v-for="item in fields"
            v-bind:key="item.field"
            :class="item.css + (item.err ? ' error' : '')"
            @click="focus(item)"
          >
            <view class="uni-input-label">{{ item.name }}</view>
            <input
              v-if="item.type == 'text' || item.type.startsWith('text-')"
              class="uni-input"
              name="input"
              v-model="formdata[item.field]"
              placeholder-style="color:#bbb"
              placeholder="请输入"
            />
            <view
              class="media-bar"
              v-if="item.type == 'text-media'"
              @click="popupMedia(item.field)"
            >
              <text class="icon iconfont">&#xe66e;</text>
            </view>
            <xfl-select
              v-if="item.type == 'select'"
              :list="dicts[item.dicttype]"
              :class="item.err ? 'error' : ''"
              :clearable="false"
              :initValue="formdata[item.field]"
              :showItemNum="5"
              :isCanInput="false"
              selectHideType="hideAll"
              @change="
                (sel) => {
                  formdata[item.field] = sel.newVal;
                }
              "
            >
            </xfl-select>
            <textarea
              class="uni-textarea"
              v-if="item.type == 'textarea'"
              placeholder-style="color:#bbb"
              :value="formdata[item.field]"
              @blur="textareaBlur(item.field, $event)"
            />
            <input
              v-if="item.type == 'datepicker'"
              class="uni-input"
              name="input"
              v-model="formdata[item.field]"
              placeholder-style="color:#bbb"
              placeholder="请选择"
              @click="showDatePicker(item)"
            />
            <view class="switch-warp uni-row" v-if="item.type == 'switch'">
              <text class="switch-text">{{ formdata[item.field] }}</text>
              <view class="uni-grow"></view>
              <switch checked @change="switchChange(item, $event)" />
            </view>

            <view class="error-info">{{ item.err }}</view>
          </view>
        </view>
      </scroll-view>
    </form>
    <date-time-picker
      ref="datepicker"
      :indicatorStyle="indicatorStyle"
      :type="datetype"
      @change="onSelectDate"
    ></date-time-picker>
    <comp-media ref="media"></comp-media>
  </view>
</template>

<script>
import util from "../../common/util";
import constants from "../../common/constants";
import dictService from "../../service/dict";
import DateTimePicker from "../../components/bory-dateTimePicker/bory-dateTimePicker.vue";
import { mapState, mapActions } from "vuex";
export default {
  props: {
    service: {
      type: Object,
      default: () => {},
    },
    showHeader: {
      type: Boolean,
      default: true, //是否显示header
    },
    title: {
      type: String,
      default: "我是标题",
    },
  },
  components: {
    DateTimePicker,
  },
  data() {
    var fields = this.service.getFormItems();
    let formdata = {};
    let guid = this.service.genGuid();
    fields.forEach((field) => {
      field.err = "";
      formdata[field.field] = field.defaultValue || "";
    });
    return {
      datetype: "datetime", //日期选择控件选择类型
      showDatePickerField: "", //当前弹出日期控件的字段名称  日期选择组件是共用一个的,需要记录当前使用的field,然后赋值
      fields: fields,
      winHeight: 0,
      scrollHeight: 500,
      mode: "create", //默认为新增数据
      formdata,
      guid,
    };
  },
  computed: {
    ...mapState({
      dicts: "dicts",
    }),
    indicatorStyle() {
      return {
        background: "rgba(97,189,255,.2)",
        height: "40px",
      };
    },
  },
  created() {
    if (!this.dicts || this.dicts.length == 0) {
      this.loadDicts();
    }
    this.init();
  },
  mounted() {
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

  methods: {
    ...mapActions({
      loadDicts: "loadDicts",
    }),

    focus(field) {
      field.err = false;
    },
    textareaBlur(field, e) {
      this.formdata[field] = e.detail.value;
    },
    switchChange(field, e) {
      this.formdata[field.field] = field.values[e.detail.value ? 1 : 0];
    },
    popupMedia(field) {
      this.$refs.media.popup(this.formdata.guid || this.guid, field);
    },
    init() {
      uni.getStorage({
        key: "editData",
        success: (val) => {
          if (val.data) {
            this.formdata = val.data;
            this.mode = "update";
          }
        },
      });
    },
    showDatePicker(item) {
      this.datetype = item.datetype;
      this.$refs.datepicker.show();
      this.showDatePickerField = item.field;
    },
    onSelectDate(val) {
      if (this.showDatePickerField) {
        this.formdata[this.showDatePickerField] = val;
      } else {
        console.error("日期控件异常,showDatePickerField 为空");
      }
    },
    back() {
      if (this.tabsrc) {
        uni.switchTab({ url: this.tabsrc });
      } else {
        uni.navigateBack();
      }
    },
    validate() {
      let isValid = true;
      let data = {};

      this.fields.forEach((field) => {
        data[field.field] = this.formdata[field.field];
        if (field.required && !this.formdata[field.field]) {
          field.err = "必填项";
          isValid = false;
        }
      });
      //触发 事件, 如果返回false,则不继续往下保存
      if (isValid) {
        isValid = this.$parent.beforeSave
          ? this.$parent.beforeSave(this.formdata, this.fields) !== false
          : true;
      }
      console.log("input:", data);
      return isValid;
    },
    autoInput() {
      if (this.service.autoInput) {
        this.service.autoInput(this.formdata);
      } else {
        uni.showToast({
          title: "该服务未实现该功能,需要在service中实现autoInput方法!",
          duration: 2000,
        });
      }
    },
    save() {
      if (!this.validate()) {
        uni.showToast({
          title: constants.MSG.FORM_REQUIRED,
          duration: 2000,
          icon: "none",
        });
        return;
      }
      if (this.mode == "create") {
        this.formdata.guid = this.guid;
        this.service.insert(this.formdata).then(() => {
          uni.showToast({
            title: "保存成功!",
            duration: 2000,
          });
          this.back();
        });
      } else {
        this.service.update(this.formdata).then(() => {
          uni.showToast({
            title: "保存成功!",
            duration: 2000,
          });
          this.back();
        });
      }
    },
    uploadFile() {
      uni.showToast({ title: "该功能暂未实现!", duration: 2000, icon: "none" });
    },
  },
};
</script>

<style lang="scss" scoped >
.i-header {
  padding: 0 20px;
  height: 56px;
  line-height: 56px;
  border-bottom: 1px solid #f0f0f0;
  > .i-header-text {
    font-size: 16px;
    padding: 0 10px;
  }
  .icon.iconfont {
    color: #007aff;
    font-size: 20px;
    font-weight: bold;
  }
  .title {
    text-align: center;
    font-size: 18px;
    color: #666;
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
.row-item {
  border: 1px solid #f8f8f8;
  margin: 8px 10px 8px 0;
  padding: 0px;
  line-height: 50px;
  height: 50px;
  position: relative;
}
.form-padding {
  padding: 10px 10px 10px 20px;
  flex-direction: row;
  flex-wrap: wrap;
}
.uni-input {
  padding: 0 15px;
  font-size: 15px;
  height: 50px;
  color: #333;
  line-height: 50px;
  width: 200px;
}
.uni-input-label {
  font-size: 15px;
  padding: 0 10px;
  width: 100px;
  color: #333;
  background: #f8f8f8;
}
.row-textarea {
  height: 100px;
  .uni-input-label {
    line-height: 100px;
  }
}
.uni-textarea {
  width: 200px;
  flex-grow: 1;
  padding: 10px 15px;
  height: 100px;
  font-size: 15px;
  color: #444;
}
.slider {
  line-height: 50px;
  box-sizing: border-box;
  margin: 0 15px !important;
  padding: 0 10px;
  width: 200px;
  position: relative;
}
.long-col {
  width: 100%;
}
.error-info {
  display: none;
}
.error .error-info {
  background-color: rgba(224, 111, 111, 0.4);
  position: absolute;
  display: block;
  padding: 0 10px;
  line-height: 23px;
  right: 100px;
  top: 15px;
  color: red;
}
.media-bar {
  display: block;
  width: 60px;
  text-align: center;
  background-color: #fbfbfb;
  .icon.iconfont {
    color: #888;
    font-weight: bold;
    font-size: 20px;
  }
}
.media-bar:active {
  background-color: rgba(159, 154, 226, 0.4);
  .icon.iconfont {
    color: #fff;
  }
}
.switch-warp {
  padding: 0 10px 0 15px;
  width: 200px;
  flex-grow: 1;
  .switch-text {
    color: #666;
  }
}
</style>
