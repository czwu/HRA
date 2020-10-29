<template>
  <view class="container" :class="screenOrientation">
    <view class="uni-column">
      <view class="uni-row i-header">
        <view style="width:20px"></view>
        <text class="icon iconfont" style="color:#007aff; " @click="back">&#xe600;</text>
        <view class="uni-grow" style="text-align:center;font-size:18px;color:#666">新增岗位</view>
        <text class="icon iconfont" style="color:#007aff;" @click="save">&#xe656;</text>
        <view style="width:20px"></view>
      </view>
      <form>
        <view class="uni-row form-padding">
          <view class="uni-row row-item uni-grow">
            <view class="uni-input-label">岗位名称</view>
            <input class="uni-input" name="input" v-model="job.name" placeholder="请输入" />
          </view>
          <view class="uni-row row-item uni-grow">
            <view class="uni-input-label">岗位编码</view>
            <input class="uni-input" name="input" v-model="job.code" placeholder="请输入" />
          </view>
          <view class="uni-row row-item uni-grow">
            <view class="uni-input-label">类别</view>
            <input class="uni-input" name="input" v-model="job.type" placeholder="请输入" />
          </view>
          <view class="uni-row row-item uni-grow">
            <view class="uni-input-label">人数</view>
            <slider
              v-model="job.num"
              min="1"
              max="90"
              show-value
              @change="numChange"
              class="uni-grow slider"
            />
          </view>
          <view class="uni-row row-item uni-grow">
            <view class="uni-input-label">倒班时间</view>
            <input class="uni-input" name="input" v-model="job.worktime" placeholder="请输入" />
          </view>
          <view class="uni-row row-item uni-grow" style="width:100%">
            <view class="uni-input-label">相关文件</view>
            <view class="uni-grow"></view>
            <text
              class="icon iconfont"
              style="color:#007aff; font-size:26px;padding-right:10px"
              @click="uploadFile"
            >&#xe616;</text>
          </view>
          <view class="uni-row row-item uni-grow">
            <view class="uni-input-label">岗位描述</view>
            <input class="uni-input" name="input" v-model="job.duty" placeholder="请输入" />
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
import jobService from "../../service/person/job";
import { mapState } from "vuex";
export default {
  data() {
    return {
      popMenuVisible: false,
      popStyle: {
        top: 0,
        right: "50px",
      },
      dept: {},
      job: {
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

  onShow() {},
  created() {
    this.init();
  },
  computed: {
    ...mapState({ screenOrientation: "screenOrientation" }),
  },
  methods: {
    init() {
      uni.getStorage({
        key: "currDept",
        success: (val) => {
          if (val.data) {
            this.dept = val.data;
          }
        },
      });
      uni.getStorage({
        key: "editData",
        success: (val) => {
          if (val.data) {
            this.job = val.data;
          } else {
            this.job = {
              name: "",
              code: "",
              type: "",
              num: 0,
              duty: "",
              worktime: "",
            };
          }
        },
      });
    },
    back() {
      uni.switchTab({ url: "/pages/person/jobs" });
    },
    save() {
      let job = {
        name: this.job.name,
        code: this.job.code,
        type: this.job.type,
        num: this.job.num,
        duty: this.job.duty,
        worktime: this.job.worktime,
        guid: this.job.guid,
      };
      if (job.guid) {
        jobService.update(job).then(() => {
          uni.showToast({
            title: "保存成功!",
            duration: 2000,
          });
          uni.switchTab({ url: "/pages/person/jobs" });
        });
      } else {
        job.guid = util.genJobId();
        job.deptGuid = this.dept.guid;
        jobService.insert(job).then(() => {
          uni.showToast({
            title: "保存成功!",
            duration: 2000,
          });
          uni.switchTab({ url: "/pages/person/jobs" });
        });
      }
    },

    numChange(e) {
      this.job.num = e.detail.value;
    },
    uploadFile() {
      uni.showToast({ title: "该功能暂未实现!", duration: 2000, icon: "none" });
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
    color: #007aff;
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
.slider {
  line-height: 50px;
  box-sizing: border-box;
  margin: 0 15px !important;
  padding: 0 10px;
  width: 200px;
  position: relative;
}
</style>
