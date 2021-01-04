<template>
  <view class="comp-tag-warp uni-row uni-grow" @click="click">
    <view class="tag-values uni-row uni-grow">
      <view class="tag-value" v-for="(val, key) in values" v-bind:key="key">
        {{ val }}
      </view>
    </view>
    <text class="icon iconfont iconright11" style="padding-right: 10px"></text>
    <uni-popup ref="tagPopup" type="top" >
      <uni-popup-dialog @click.native="clearDelSign"
        type="info"
        mode="base"
        :title="title"
        style="width: 600px"
        @confirm="complete"
      >
        <view class="tag-items uni-grow uni-row" v-if="tags.length" >
          <view
            class="tag"
            :class="{ selected: tag.selected, remove: tag.showDel }"
            v-for="(tag, key) in tags"
            v-bind:key="key"
            @click="tagSelect(tag)"
            @longpress="longPress(tag)"
          >
            {{ tag.value }}
            <text
              class="icon iconfont iconclose"
              v-show="tag.showDel"
              @click="removeTag(tag)"
            ></text>
          </view>
          <view class="input-warp">
            <input
              type="text"
              v-model="customval"
              placeholder="自定义标签"
              placeholder-style="color:#bbb"
              :maxlength="10"
              @confirm="textConfirm"
            />
          </view>
        </view>
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>
<script>
import util from "../../common/util";
import dictService from "../../service/dict";
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import uniPopupDialog from "@/components/uni-popup/uni-popup-dialog.vue";
export default {
  name: "compTag",
  props: {
    type: {
      type: String,
      default: "default",
    },
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      title: "请选择标签",
      tags: [],
      values: [],
      customval: "",
    };
  },
  components: {
    uniPopup,
    uniPopupDialog,
  },
  mounted() {
    let selected = {};
    this.value.split(",").forEach((val) => {
      if (val) {
        selected[val] = true;
        this.values.push(val);
      }
    });
    dictService.query({ type: this.type }).then((datas) => {
      datas.forEach((element) => {
        element.selected = selected[element.value];
        element.showDel = false;
      });
      this.tags = datas;
      this.values.forEach((val) => {
        if (!this.tags.filter((t) => t.value == val).length) {
          this.tags.push({
            value: val,
            name: val,
            guid: "",
            selected: true,
            showDel: false,
          });
        }
      });
    });
  },

  created() {},
  methods: {
    complete(done) {
      this.textConfirm()
      let values = [];
      this.tags.filter((d) => {
        if (d.selected) {
          values.push(d.value);
        }
      });
      this.values = values;
      this.$emit("change", values);

      done();
    },
    click() {
      this.customval = "";
      this.$refs.tagPopup.open();
    },
    tagSelect(tag) {
      if (!tag.showDel) {
        tag.selected = !tag.selected;
      }
    },
    clearDelSign() {
      this.tags.forEach((tag) => {
        tag.showDel = false;
      });
    },
    longPress(tag) {
      if (!tag.selected) {
        tag.showDel = true;
      }
    },
    removeTag(tag) {
      if (tag.guid) {
        dictService.remove(tag.guid);
      }
      this.tags = this.tags.filter((t) => t.value != tag.value);
    },
    textConfirm() {
      let text = this.customval.trim();
      if (text) {
        let guid =dictService.genGuid();
        this.tags.push({
          guid,
          name: text,
          value: text,
          selected: true,
          showDel:false
        });
        this.customval = "";
        dictService.insert({
          guid,
          name: text,
          value: text,
          parent: "",
          type: this.type
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.comp-tag-warp {
  width: 200px;
  .tag-value {
    background: rgba(223, 231, 250, 0.747);
    color: rgb(129, 162, 231);
    margin: 0 0 0 10px;
    line-height: 26px;
    height: 26px;
    font-size: 13px;
    padding: 0 15px;
    border-radius: 6px;
    margin-top: 12px;
  }
  .tag-items {
    padding: 10px 20px;
    flex-wrap: wrap;
    margin-top: -30px;
    .tag {
      background: #eee;
      color: #666;
      position: relative;
      margin: 0 0 15px 15px;
      line-height: 26px;
      height: 26px;
      padding: 0 15px;
      border-radius: 10px;
      &.selected {
        background: rgb(84, 155, 248);
        color: #fff;
      }
      &.remove {
        padding-right: 30px;
      }
      .icon.iconfont {
        position: absolute;
        top: 0px;
        padding: 0 10px;
        font-weight: normal;
        font-size: 16px;
        color: rgb(230, 95, 42);
      }
    }
  }
  .input-warp {
    margin-left: 20px;

    input {
      font-size: 14px;
      line-height: 30px;
      height: 30px;
      width: 80px;
      color: #666;
      border-bottom: 1px solid #eee;
    }
  }
}
</style>
