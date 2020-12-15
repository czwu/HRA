<template>
  <view class="container" :class="screenOrientation">
    <view class="uni-column">
      <view class="uni-row i-header">
        <view style="width:20px"></view>
        <text class="icon iconfont" style="color:#007aff; " @click="back">&#xe600;</text>
        <view class="uni-grow" style="text-align:center;font-size:18px;color:#666">查看人员</view>
        <text class="icon iconfont" style="color:#007aff; " @click="edit">&#xe63d;</text>
        <view style="width:20px"></view>
      </view>
      <form>
        <view class="uni-row form-padding">
          <view class="uni-row row-item uni-grow">
            <view class="uni-input-label">姓名</view>
            <view class="uni-input">{{person.name}}</view>
          </view>
          <view class="uni-row row-item uni-grow">
            <view class="uni-input-label">员工编码</view>
            <view class="uni-input">{{person.code}}</view>
          </view>
          <view class="uni-row row-item uni-grow">
            <view class="uni-input-label">职称/职务</view>
            <view class="uni-input">{{person.job}}</view>
          </view>
          <view class="uni-row row-item uni-grow">
            <view class="uni-input-label">年龄</view>
            <view class="uni-input">{{person.age}}</view>
          </view>
          <view class="uni-row row-item uni-grow">
            <view class="uni-input-label">工作年限</view>
            <view class="uni-input">{{person.work_seniority}}</view>
          </view>
          <view class="uni-row row-item uni-grow">
            <view class="uni-input-label">岗位工作年限</view>
            <view class="uni-input">{{person.job_seniority}}</view>
          </view>
          <view class="uni-row row-item uni-grow">
            <view class="uni-input-label">职责</view>
            <view class="uni-input">{{person.duty}}</view>
          </view>
        </view>
      </form>
    </view>
  </view>
</template>

<script>
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import uniPopupMessage from "@/components/uni-popup/uni-popup-message.vue";
import uniPopupDialog from "@/components/uni-popup/uni-popup-dialog.vue";
import util from "../../common/util";
import { mapState } from "vuex";
export default {
  data() {
    return {
      popMenuVisible: false,
      popStyle: {
        top: 0,
        right: "50px",
      },
      editInfo: {
        title: "",
        value: "",
        placeholder: "",
      },
      person: {
        name: "",
        code: "",
        type: "",
        num: "",
        desc: "",
        jobtime: "",
      },
    };
  },
  components: {
    uniPopup,
    uniPopupMessage,
    uniPopupDialog,
  },
  onShow() {
    uni.getStorage({
      key: "editData",
      success: (val) => {
        if (val.data) {
          this.person = val.data;
        } else {
          this.person = {
            name: "",
            code: "",
            type: "",
            num: "",
            age: 20,
            yearsOfWorking: 0,
            yearsOfJob: 0,
          };
        }
      },
    });
  },
  created() {},
  computed: {
    ...mapState({ screenOrientation: "screenOrientation" }),
  },
  methods: {
    back() {
      uni.navigateBack();
    },
    edit() {
      uni.navigateTo({ url: "/pages/person/addPerson" });
    },
  },
};
</script>

<style lang="scss" scoped >
.i-header {
  height: 56px;
  line-height: 56px;
  border-bottom: 1px solid #f0f0f0;
  > .i-header-text {
    font-size: 16px;
    padding: 0 10px;
  }
  .icon.iconfont {
    font-size: 20px;
    font-weight: bold;
  }
}
.i-list-item {
  padding: 10px 0 10px 10px;
  border-bottom: 1px solid #f8f8f8;
}
.list-item-content {
  font-size: 16px;
  color: #666;
  font-weight: bold;
  height: 25px;
  display: flex;
  flex-direction: row;
  line-height: 25px;
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
</style>
