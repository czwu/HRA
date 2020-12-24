<template>
  <view class="uni-column">
    <view class="uni-row i-header" v-if="header">
      <view class="uni-grow" style="width: 100px">
        <text class="icon iconfont" @click="back">&#xe600;</text>
      </view>
      <view class="title">{{ title }}</view>
      <view class="uni-grow uni-row" style="width: 100px">
        <view class="uni-grow"></view>
        <!-- <text
          @click="autoInput"
          style="margin-right: 50px; color: #007aff"
          v-if="mode != 'update'"
          >自动录入</text
        > -->
        <text class="icon iconfont" @click="save">&#xe656;</text>
      </view>
    </view>
    <!-- <text
      @click="autoInput"
      style="color: #007aff; position: absolute; right: 50px; top: 20px"
      v-if="mode != 'update' && !auto_save && !header"
      >自动录入</text
    > -->
    <form>
      <scroll-view
        :scroll-y="scroll"
        class="scroll-v"
        :style="{ height: scroll ? scrollHeight + 'px' : 'auto' }"
      >
        <view
          class="uni-row form-padding"
          v-if="dicts && dicts.length"
          :class="formcss"
        >
          <view
            class="uni-row row-item uni-grow"
            v-for="item in fields"
            v-bind:key="item.field"
            :class="[
              item.css,
              item.err ? ' error' : '',
              item.group ? 'row-item-group' : '',
            ]"
            @click="focus(item)"
          >
            <template v-if="item.group">
              <view class="uni-row row-group">
                {{ item.group }}
              </view>
            </template>
            <template v-else>
              <view
                class="uni-input-label"
                :class="{
                  'label-warp': item.labelWarp,
                  required: item.required,
                }"
                >{{ item.name }}
              </view>
              <input
                v-if="item.type == 'text' || item.type.startsWith('text-')"
                class="uni-input"
                name="input"
                :type="item.datatype == 'number' ? 'number' : 'text'"
                v-model="formdata[item.field]"
                placeholder-style="color:#bbb"
                @blur="inputBlur"
                :disabled="item.disabled"
                :placeholder="item.placeholder || '请输入'"
              />
              <view class="input-suffix" v-if="item.inputSuffix">
                {{ item.inputSuffix }}
              </view>

              <text
                class="icon iconfont input-icon"
                @click="popupMedia(item.field)"
                v-if="item.type == 'text-media'"
                >&#xe66e;</text
              >

              <picker
                mode="selector"
                :range="dicts[item.dicttype]"
                range-key="name"
                :value="valueIndex(dicts[item.dicttype], formdata[item.field])"
                :disabled="item.disabled"
                @change="
                  selectChange(item, dicts[item.dicttype][$event.detail.value])
                "
                v-if="item.type == 'select'"
              >
                <view class="uni-input" v-if="formdata[item.field]">
                  {{ formdata[item.field] | dictRender(dicts[item.dicttype]) }}
                </view>
                <view class="uni-input" style="color: #bbb" v-else>
                  请选择
                </view>
                <text class="icon iconfont iconright11 picker-icon"></text>
              </picker>

              <picker
                mode="selector"
                :range="item.values"
                :value="item.values.indexOf(formdata[item.field])"
                :disabled="item.disabled"
                @change="selectChange(item, item.values[$event.detail.value])"
                v-if="item.type == 'selector'"
              >
                <view class="uni-input" v-if="formdata[item.field]">
                  {{ formdata[item.field] }}
                </view>
                <view class="uni-input" style="color: #bbb" v-else>
                  请选择
                </view>
                <text class="icon iconfont iconright11 picker-icon"></text>
              </picker>

              <textarea
                class="uni-textarea"
                v-if="item.type == 'textarea'"
                placeholder-style="color:#bbb"
                :value="formdata[item.field]"
                @blur="textareaBlur(item.field, $event)"
              />

              <view
                class="uni-input"
                v-if="item.type == 'datepicker'"
                @click="showDatePicker(item)"
              >
                {{ formdata[item.field] | dateString("yyyy-MM-dd") }}
              </view>
              <text
                class="icon iconfont iconriqi input-icon"
                v-if="item.type == 'datepicker'"
                @click="showDatePicker(item)"
              ></text>
              <view class="switch-warp uni-row" v-if="item.type == 'switch'">
                <text class="switch-text" v-show="item.showText !== false">{{
                  formdata[item.field]
                }}</text>
                <input
                  v-if="item.inputField"
                  class="uni-input flex-grow"
                  name="input"
                  type="text"
                  v-model="formdata[item.inputField]"
                  placeholder-style="color:#bbb"
                  style="padding-left: 30px"
                  @blur="inputBlur"
                  :disabled="item.disabled"
                  :placeholder="item.placeholder || '请输入'"
                />

                <view class="uni-grow"></view>
                <switch
                  :checked="formdata[item.field] == item.values[1]"
                  @change="switchChange(item, $event)"
                />
              </view>
              <view
                class="uni-row uni-grow"
                v-if="item.type == 'multi-select'"
                @click="multiSelect(item)"
              >
                <view
                  class="uni-input multi-select"
                  v-if="formdata[item.field]"
                >
                  <text
                    class="multi-item"
                    :class="{
                      multi: item.multi !== false,
                      user: item.userMode,
                    }"
                    v-for="val in formdata[item.field].split(item.split)"
                    v-bind:key="val"
                    >{{ val }}</text
                  >
                </view>
                <text class="uni-input" v-else style="color: #bbb">{{
                  "请选择"
                }}</text>
                <text class="icon iconfont iconright11 picker-icon"></text>
              </view>
              <view class="text-warp uni-row" v-if="item.type == 'label'">
                <text class="value-text">{{
                  formdata[item.field] || item.placeholder
                }}</text>
              </view>

              <view class="file-warp uni-row" v-if="item.type == 'file'">
                <text class="file-text">{{
                  formdata[item.field] | filePathRender
                }}</text>
                <view class="uni-grow"></view>
                <text
                  class="icon iconfont iconlianjie input-icon"
                  @click="openSelectFilePage(item.field)"
                ></text>
              </view>

              <view
                class="item-select-warp uni-row"
                v-if="item.type == 'item-select'"
              >
                <text
                  class="select-item"
                  v-for="(data, key) in item.values"
                  v-bind:key="key"
                  :class="{
                    bgcolor: !!item.bgcolor,
                    selected: data == formdata[item.field],
                  }"
                  :style="{
                    background: item.bgcolor
                      ? item.bgcolor[item.values.indexOf(data)]
                      : '',
                  }"
                  @click="selectItem(item, data)"
                >
                  {{ data }}
                </text>
                <text
                  class="select-item selected"
                  v-if="
                    formdata[item.field] &&
                    formdata[item.field] != 'null' &&
                    !item.values.includes(formdata[item.field])
                  "
                >
                  {{ formdata[item.field] }}
                </text>
                <view class="uni-grow">
                  <div class="text comment" v-if="item.comments">
                    {{ item.comments[formdata[item.field]] }}
                  </div>
                </view>
              </view>
              <text
                class="icon iconfont input-icon"
                :class="item.inputIcon"
                @click="inputIconClick(item, formdata)"
                v-if="item.inputIcon"
              ></text>
              <view class="error-info">{{ item.err }}</view>
            </template>
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
    <uni-popup ref="popup" type="center">
      <uni-popup-dialog
        type="info"
        mode="input"
        @confirm="saveHeightTool"
        :title="editInfo.title"
        :value="editInfo.value"
        :placeholder="editInfo.placeholder"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
import util from "../../common/util";
import constants from "../../common/constants";
import dictService from "../../service/dict";
import personService from "../../service/person/person";
import DateTimePicker from "../../components/bory-dateTimePicker/bory-dateTimePicker.vue";
import { mapState, mapActions } from "vuex";
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import uniPopupDialog from "@/components/uni-popup/uni-popup-dialog.vue";
export default {
  props: {
    service: {
      type: Object,
      default: () => {},
    },
    header: {
      type: Boolean,
      default: true, //是否显示header
    },
    scroll: {
      type: Boolean,
      default: true, //是否开启滚动
    },
    autoload: {
      type: Boolean,
      default: false, //是否自己加载数据
    },
    param: {
      type: Object, //配合autoload使用, 加载数据的请求参数
      default: () => {},
    },
    title: {
      type: String,
      default: "我是标题",
    },
    formcss: {
      type: String,
      default: "",
    },
    auto_save: {
      type: Boolean,
      default: false, //是否自己加载数据
    },
    form_mode: {
      type: String,
      default: "",
    },
  },
  components: {
    DateTimePicker,
    uniPopup,
    uniPopupDialog,
  },
  data() {
    var fields = this.service.getFormItems({ form_mode: this.form_mode });
    let formdata = {};
    let paramGuid = this.param ? this.param.guid : "";
    let guid = paramGuid || this.service.genGuid();
    fields.forEach((field) => {
      if (field.field) {
        field.err = "";
        let defaultVal = field.defaultValue;
        if (
          !defaultVal &&
          field.dicttype &&
          this.dicts &&
          this.dicts[field.dicttype]
        ) {
          defaultVal = this.dicts[field.dicttype][0].value;
        }
        formdata[field.field] = defaultVal || "";
      }
    });
    return {
      datetype: "datetime", //日期选择控件选择类型
      showDatePickerField: "", //当前弹出日期控件的字段名称  日期选择组件是共用一个的,需要记录当前使用的field,然后赋值
      fields: fields,
      winHeight: 0,
      scrollHeight: 0,
      mode: "create", //默认为新增数据
      formdata,
      guid,
      editInfo: {
        value: "",
        title: "其他辅助装置",
        placeholder: "请输入名称",
      },
    };
  },
  computed: {
    ...mapState({
      dicts: "dicts",
    }),
    indicatorStyle() {
      return {
        background: "",
        height: "40px",
      };
    },
    valueIndex() {
      return function (dicts, value) {
        for (var i = 0; i < dicts.length; i++) {
          if (dicts[i].value == value) {
            return i;
          }
        }
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
    if (this.scroll) {
      uni.getSystemInfo({
        success: (res) => {
          this.winHeight = res.windowHeight;
          uni
            .createSelectorQuery()
            .select(".scroll-v")
            .boundingClientRect((data) => {
              _this.scrollHeight = res.windowHeight - data.top - 30;
            })
            .exec();
        },
      });
    }
  },

  watch: {
    param(param) {
      var fieldParam = Object.assign({ form_mode: this.form_mode }, param);
      var fields = this.service.getFormItems(fieldParam);
      this.formdata = {};
      let paramGuid = this.param ? this.param.guid : "";
      this.guid = paramGuid || this.service.genGuid();
      fields.forEach((field) => {
        if (field.field) {
          field.err = "";
          let defaultVal = field.defaultValue;
          if (
            !defaultVal &&
            field.dicttype &&
            this.dicts &&
            this.dicts[field.dicttype]
          ) {
            defaultVal = this.dicts[field.dicttype][0].value;
          }
          this.$set(this.formdata, field.field, defaultVal || "");
        }
      });
      this.fields = fields;
      if (this.autoload) {
        this.init();
      }
    },
  },
  filters: {
    dictRender(value, dicts) {
      if (!dicts || (!value && value != 0)) {
        return value;
      }
      var data = dicts.filter((dict) => dict.value == value)[0];
      return data ? data.name : value;
    },
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
      this.autoSave();
    },
    switchChange(field, e) {
      this.formdata[field.field] = field.values[e.detail.value ? 1 : 0];
      this.autoSave();
    },
    selectChange(field, data) {
      this.formdata[field.field] = typeof data == "object" ? data.value : data;
      this.autoSave();
    },
    inputBlur() {
      this.autoSave();
    },
    popupMedia(field) {
      this.$refs.media.popup(this.formdata.guid || this.guid, field);
    },
    inputIconClick(field, formdata) {
      if (field.field == "height_tool") {
        if (
          formdata.height_tool &&
          !field.values.includes(formdata.height_tool)
        ) {
          this.editInfo.value = formdata.height_tool;
        } else {
          this.editInfo.value = "";
        }
        this.$refs.popup.open();
      }
      this.$parent.iconClick(field, formdata);
    },
    saveHeightTool(done, val) {
      let name = val.trim();
      this.formdata.height_tool = val;
      done();
      this.autoSave();
    },
    init() {
      if (this.autoload) {
        this.service.query(this.param).then((data) => {
          if (data.length) {
            this.formdata = data[0];
            this.mode = "update";
          } else {
            this.mode = "create";
          }
        });
      } else {
        uni.getStorage({
          key: "editData",
          success: (val) => {
            if (val.data) {
              this.formdata = val.data;
              this.mode = "update";
            }
          },
        });
      }
    },
    showDatePicker(item) {
      if (item.disabled) return;
      this.datetype = item.datetype;
      this.$refs.datepicker.show();
      this.showDatePickerField = item.field;
    },
    onSelectDate(val) {
      if (this.showDatePickerField) {
        this.formdata[this.showDatePickerField] = val;
        this.autoSave();
      } else {
        console.error("日期控件异常,showDatePickerField 为空");
      }
    },
    setFilePath(field, path, guid) {
      if (this.fields.filter((f) => f.field == field).length) {
        this.formdata[field] = guid;
        this.autoSave();
      }
    },
    openSelectFilePage(field) {
      uni.navigateTo({ url: "/pages/filesys/selectFile?field=" + field });
    },
    selectItem(item, data) {
      let field = item.field;
      if (this.formdata[field] == data) {
        this.formdata[field] = "";
      } else {
        this.formdata[field] = data;
      }
      if (item.onChange) {
        item.onChange(this.formdata[field], this.formdata);
      }
      this.autoSave();
    },
    back() {
      uni.navigateBack();
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

    autoSave() {
      if (this.auto_save) {
        this.$parent.beforeSave(this.formdata, this.fields);
        if (this.mode == "create") {
          this.formdata.guid = this.guid;
          this.service.insert(this.formdata).then(() => {
            this.mode = "update";
          });
        } else {
          this.service.update(this.formdata).then(() => {});
        }
      }
    },
    save(callback) {
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
          if (typeof callback == "function") {
            callback();
          } else {
            uni.showToast({
              title: "保存成功!",
              duration: 2000,
            });
            this.back();
          }
        });
      } else {
        this.service.update(this.formdata).then(() => {
          if (typeof callback == "function") {
            callback();
          } else {
            uni.showToast({
              title: "保存成功!",
              duration: 2000,
            });
            this.back();
          }
        });
      }
    },
    uploadFile() {
      uni.showToast({ title: "该功能暂未实现!", duration: 2000, icon: "none" });
    },
    multiSelect(item) {
      let conf = Object.assign({}, item);
      conf.value = this.formdata[item.field];
      if (!item.userMode) {
        conf.values = this.dicts[item.dictType];
        uni.setStorageSync("multiItem", conf);
        uni.navigateTo({
          url: "/pages/hra/multiSelect",
        });
      } else {
        personService.queryJobUsers().then((users) => {
          conf.values = users;
          uni.setStorageSync("multiItem", conf);
          uni.navigateTo({
            url: "/pages/hra/multiSelect",
          });
        });
      }
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
}
.line-form {
  .row-item {
    border: 0px;
    border-bottom: 1px solid #f2f2f2;
  }
  .uni-input-label {
    background: #fff;
  }
}

.uni-input-label {
  position: relative;
  &.required::before {
    content: "*";
    position: absolute;
    top: 0px;
    right: 10px;
    color:red;
  }
}
.row-item {
  border: 1px solid #f8f8f8;
  margin: 8px 10px 8px 10px;
  padding: 0px;
  line-height: 50px;
  height: 50px;
  position: relative;
}
.uni-row.row-group {
  background: rgba(176, 178, 184, 0.2);
  border-bottom: 0px;
  padding-left: 8px;
  flex-grow: 1;
  width: 90vw;
  display: block;
  font-weight: bold;
  color: #666;
}

.step-form {
  .uni-row.row-group {
    background: #fff;
    border-bottom: 0px;
    padding-left: 8px;
    flex-grow: 1;
    width: 90vw;
    display: block;
    font-weight: normal;
    color: #999;
  }
  .row-item.row-item-group {
    height: 20px;
    border: 0px;
    line-height: 30px;
  }
}
.form-padding {
  padding: 10px 10px 10px 10px;
  flex-direction: row;
  flex-wrap: wrap;
  &.line-form {
    padding: 10px 10px 10px 10px;
  }
}
.uni-input {
  padding: 0 15px;
  font-size: 14px;
  height: 50px;
  color: #333;
  line-height: 50px;
  width: 200px;
}
.uni-input-label {
  font-size: 14px;
  padding: 0 10px;
  width: 100px;
  color: #333;
  background: #f8f8f8;
  &.label-warp {
    line-height: 20px;
  }
}
.row-textarea {
  height: 100px;
  .uni-input-label {
    line-height: 100px;
  }
}
.uni-textarea {
  width: 200px;
  box-sizing: border-box;
  flex-grow: 1;
  padding: 10px 15px;
  height: 100px;
  font-size: 14px;
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

.input-suffix {
  position: absolute;
  top: 0;
  right: 0;
  display: block;
  width: 50px;
  height: 50px;
  text-align: center;
  color: #999;
}
.switch-warp,
.time-warp {
  padding: 0 10px 0 15px;
  width: 200px;
  flex-grow: 1;
  .switch-text {
    color: #666;
  }
}
.value-text {
  color: #666;
}
.placeholder-text {
  color: #bbb;
}
.text-warp {
  padding: 0 15px;
  box-sizing: content-box;
  width: 200px;
  flex-grow: 1;
  background: #f8f8f8;
}
.file-warp {
  padding: 0 0 0 15px;
  width: 200px;
  flex-grow: 1;
  .file-text {
    color: #666;
  }
  .file-btn {
    padding: 0 15px;
    background-color: #fbfbfb;
    &:active {
      color: #fff;
      background-color: rgba(159, 154, 226, 0.4);
    }
  }
}
.item-select-warp {
  padding: 5px 0 5px 10px;
  width: 200px;
  position: relative;
  flex-grow: 1;
  line-height: 40px;
  .select-item {
    background: #eee;
    color: #666;
    position: relative;
    text-align: center;
    min-width: 80px;
    padding: 0 10px;
    margin-right: 10px;

    &.bgcolor {
      color: #fff !important;
    }
    &.selected {
      background: rgba(166, 190, 235, 0.6);
      color: #007aff;
    }
    &.selected.bgcolor::before {
      font-family: "iconfont" !important;
      font-size: 16px;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: #fff;
      content: "\e656";
      position: absolute;
      top: 0px;
      right: 5px;
    }
  }
}
.input-icon {
  position: absolute;
  top: 0;
  right: 2px;
  display: block;
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 26px !important;
  color: #999;
}
.picker-icon.icon.icon.iconfont {
  position: absolute;
  right: 10px;
  top: 0px;
  color: #c8c8c8 !important;
  font-size: 12px;
}
.text.comment {
  padding: 0 20px;
  color: #999;
  font-size: 13px;
  line-height: 20px;
}
.multi-select {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .multi-item.multi {
    line-height: 20px;
    margin-top: 4px;
    margin-right: 5px;
    line-height: 15px;
    height: 15px;
    font-weight: 300;
    color: #359dff;
    background: rgba(232, 244, 255, 1);
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 6px;
    &.user {
      line-height: 20px;
      margin-top: 15px;
      height: 20px;
    }
  }
}
</style>
