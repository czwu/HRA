<template>
  <view class="uni-column">
    <view class="uni-row i-header">
      <text class="icon iconfont" @click="back">&#xe600;</text>
      <view class="uni-grow title">{{ preTitle + title }}</view>
      <text class="icon iconfont" @click="save">&#xe656;</text>
    </view>

    <form>
      <scroll-view
        scroll-y="true"
        class="sv"
        :style="{ height: scrollHeight + 'px' }"
      >
        <view class="uni-row form-padding">
          <view
            class="uni-row row-item uni-grow"
            v-for="(item, key) in form.items"
            v-bind:key="key"
            :class="item.css || ''"
          >
            <view class="uni-input-label">{{ item.name }}</view>
            <input
              class="uni-input"
              name="input"
              v-model="formdata[item.field]"
              placeholder="请输入"
            />
          </view>
        </view>
      </scroll-view>
    </form>
  </view>
</template>

<script>
import util from "../../common/util";
import taskService from "../../service/hra/task";
export default {
  props: {
    mode: {
      type: String,
      default: "page", //模式 page:页面模式  dialog:弹窗模式
    },
    form: {
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
  data() {
    return {
      winHeight: 0,
      scrollHeight: 500,
      preTitle: "新建",
      parent: {},
      formdata: {},
    };
  },
  created() {
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
    init() {
      uni.getStorage({
        key: "parent",
        success: (val) => {
          if (val.data) {
            this.parent = val.data;
          }
        },
      });
      uni.getStorage({
        key: "editData",
        success: (val) => {
          if (val.data) {
            this.formdata = val.data;
            this.preTitle = "查看";
          } else {
            this.initDefaultData();
          }
        },
      });
    },
    initDefaultData() {
      console.error(this.form);
      this.form.items.forEach((col) => {
        this.formdata[col.field] = col.defaultValue || "";
      });
    },
    back() {
      //   uni.switchTab({ url: "/pages/person/jobs" });
      uni.navigateBack();
    },
    save() {},
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
</style>
