<template>
  <view class="uni-column">
    <view class="uni-row form-padding">
      <view
        class="uni-row row-item uni-grow"
        v-for="item in fields"
        v-bind:key="item.field"
        :class="[item.css, item.group ? 'row-item-group' : '']"
      >
        <template v-if="item.group">
          <view class="uni-row row-group uni-grow">
            <text class=""> {{ item.group }}</text>
            <view class="group-line uni-grow"> </view>
          </view>
        </template>
        <template v-if="item.addField">
          <view class="add-field">
            <text
              @click="addField(item)"
              class="icon iconfont iconicon_roundadd_fill"
              style="color: #007aff; font-size: 26px; font-weight: normal"
            ></text>
          </view>
        </template>
        <template v-if="item.field">
          <view
            class="uni-input-label"
            :class="{ 'label-warp': item.labelWarp }"
            >{{ item.name }}</view
          >
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

          <text
            class="icon iconfont input-icon"
            @click="popupMedia(item.field)"
            v-if="item.type == 'text-media'"
            >&#xe66e;</text
          >

          <view class="text-warp uni-row" v-if="item.type == 'label'">
            <text class="value-text">{{ formdata[item.field] }}</text>
            <text class="placeholder-text" v-show="!formdata[item.field]">{{
              item.placeholder
            }}</text>
          </view>

          <view class="input-suffix" v-if="item.inputSuffix">
            {{ item.inputSuffix }}
          </view>
          <text
            class="icon iconfont input-icon"
            :class="item.inputIcon"
            @click="inputIconClick(item, formdata)"
            v-if="item.inputIcon"
          ></text>
          <picker
            mode="selector"
            :range="users"
            v-if="users.length"
            :value="users.indexOf(formdata[item.field])"
            @change="selectUser(item, $event.detail.value)"
          >
            <view class="user-sel-btn" v-if="item.dynamic">
              <text
                class="icon iconfont iconicon_signal_fill"
                v-show="!item.userName"
              ></text>
              <text v-show="item.userName">
                {{ item.userName }}
              </text>
            </view>
          </picker>
          <view
            class="user-del-btn"
            v-if="item.allowDel"
            @click="removeField(item)"
          >
            <text class="icon iconfont iconicon_trashcan"></text>
          </view>
        </template>
      </view>
    </view>

    <comp-media ref="media"></comp-media>
  </view>
</template>

<script>
import util from "../../common/util";
import interviewService from "../../service/config/Interview_config";
import timingService from "../../service/hra/timing";
export default {
  props: {
    param: {
      type: Object, //配合autoload使用, 加载数据的请求参数
      default: () => {},
    },
  },
  components: {},
  data() {
    var fields = timingService.getFormItems();
    let formdata = {};
    let paramGuid = this.param ? this.param.guid : "";
    let guid = paramGuid || timingService.genGuid();
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
      users: [],
      tdList: [{ value: "", name: "" }],
      taList: [{ value: "", name: "" }],
      tlList: [{ value: "", name: "" }],
    };
  },
  created() {
    this.init();
  },

  methods: {
    selectChange(field, data) {
      this.formdata[field.field] = typeof data == "object" ? data.value : data;
      this.autoSave();
    },
    autoTimeClick(field) {
      this.formdata[field.field] = Date.now() / 1000;
    },
    inputBlur() {
      this.autoSave();
    },
    popupMedia(field) {
      this.$refs.media.popup(this.formdata.guid || this.guid, field);
    },
    inputIconClick(field, formdata) {},
    init() {
      timingService.query(this.param).then((data) => {
        if (data.length) {
          this.formdata = data[0];
          this.mode = "update";
        } else {
          this.mode = "create";
        }
        let field1 = this.fields.filter((f) => f.addField == "td_value")[0];
        this.dynamicField(field1, this.formdata.td_value);
        let field2 = this.fields.filter((f) => f.addField == "ta_value")[0];
        this.dynamicField(field2, this.formdata.ta_value);
        let field3 = this.fields.filter((f) => f.addField == "tl_value")[0];
        this.dynamicField(field3, this.formdata.tl_value);
      });
      interviewService.query({ type: "访谈对象" }).then((datas) => {
        let users = [];
        datas.forEach((item) => {
          users.push(item.value);
        });
        this.users = users;
      });
    },

    dynamicField(addField, value) {
      //获取动态列插入的位置
      let fieldIndex = this.fields.indexOf(addField);
      if (value) {
        let valueArr = value.split(",");
        valueArr.forEach((val) => {
          if (val) {
            let min = val.split("|")[0] || "";
            let userName = val.split("|")[1] || "";
            this.fields.splice(fieldIndex + addField.num, 0, {
              field: addField.fieldName + "_" + addField.num,
              name: addField.fieldTitle,
              datatype: "number",
              type: "text",
              inputSuffix: "min",
              dynamic: true,
              userName: userName,
              allowDel: addField.num,
              toField: addField.addField,
            });
            this.$set(
              this.formdata,
              addField.fieldName + "_" + addField.num,
              min
            );
            addField.num++;
          }
        });
      } else {
        this.fields.splice(fieldIndex, 0, {
          field: addField.fieldName + "_" + addField.num,
          name: addField.fieldTitle,
          datatype: "number",
          type: "text",
          inputSuffix: "min",
          dynamic: true,
          userName: "",
          allowDel: addField.num,
          toField: addField.addField,
        });
        this.$set(this.formdata, addField.fieldName + "_" + addField.num, "");
        addField.num++;
      }
    },
    addField(item) {
      this.dynamicField(item, "");
    },
    removeField(item) {
      this.fields = this.fields.filter((f) => f != item);
      this.autoSave();
    },
    selectUser(item, value) {
      item.userName = this.users[value];
      this.autoSave();
    },
    computeAverage(field, aveFeild) {
      let fields = this.fields.filter(
        (f) => f.toField == field && this.formdata[f.field]
      );
      let value = [],
        total = 0;
      fields.forEach((f) => {
        let min = this.formdata[f.field] * 1;
        let userName = f.userName;
        value.push(`${min}|${userName}`);
        total += min || 0;
      });
      this.formdata[field] = value.join(",");
      let aveValue = total / (fields.length || 1);
      this.formdata[aveFeild] =
        aveValue % 1 ? aveValue.toFixed(1) : aveValue || "";
    },

    autoSave() {
      //计算td 平均值
      this.computeAverage("td_value", "td");
      //计算ta 平均值
      this.computeAverage("ta_value", "ta");
      //计算tl 平均值
      this.computeAverage("tl_value", "tl");

      if (this.mode == "create") {
        this.formdata.guid = this.guid;
        this.formdata.foreign_id = this.param.foreign_id;
        timingService.insert(this.formdata).then(() => {
          this.mode = "update";
        });
      } else {
        timingService.update(this.formdata).then(() => {});
      }
    },
  },
};
</script>

<style lang="scss" scoped >
.icon.iconfont {
  vertical-align: middle;
  font-size: 16px;
  color: #b2b2b2;
}
.row-item {
  border: 1px solid #f8f8f8;
  margin: 8px 10px 8px 10px;
  padding: 0px;
  line-height: 50px;
  height: 50px;
  width: 40%;
  position: relative;
  &.row-item-group {
    border: 0px;
    width: 100%;
  }
  &.no-border {
    border: 0px !important;
  }
  &.long-col {
    width: 100% !important;
  }
}
.uni-row.row-group {
  border-bottom: 0px;
  padding-left: 5px;
  flex-grow: 1;
  width: 90vw;
  font-weight: bold;
  color: #666;
  text {
    padding-right: 15px;
  }
  .group-line {
    height: 1px;
    width: 100px;
    margin-top: 26px;
    background: #f0f0f0;
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
  width: 140px;
  color: #333;
  background: #f8f8f8;
  &.label-warp {
    line-height: 20px;
  }
}

.slider {
  line-height: 50px;
  box-sizing: border-box;
  margin: 0 15px !important;
  padding: 0 10px;
  width: 200px;
  position: relative;
}

.input-suffix {
  display: block;
  width: 50px;
  height: 50px;
  text-align: center;
  color: #999;
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
.add-field {
  width: 300px;
  flex-grow: 1;
}
.user-sel-btn {
  min-width: 30px;
  padding: 0 10px;
  height: 50px;
  text-align: center;
  border-left: 1px solid #f5f5f5;
  background: #fff;
  color: #5370f1;
  .icon.iconfont {
    vertical-align: middle;
    font-size: 25px;
    color: #5370f1;
    font-weight: normal;
  }
}
.user-del-btn {
  width: 50px;
  box-sizing: border-box;
  text-align: center;
  border-left: 1px solid #f5f5f5;
  .icon.iconfont {
    vertical-align: middle;
    font-size: 25px;
    color: #f18053;
    font-weight: normal;
  }
}
.tip {
  padding: 0 20px;
  color: #999;
}
</style>
