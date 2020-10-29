<template>
  <view class="container" :class="screenOrientation">
    <view class="uni-column">
      <view class="uni-row i-header">
        <view style="width:20px"></view>
        <text class="icon iconfont" style="color:#007aff;" @click="back">&#xe600;</text>
        <view class="uni-grow" style="text-align:center;font-size:18px;color:#666">添加人员</view>
        <text class="icon iconfont" style="color:#007aff; " @click="save">&#xe656;</text>
        <view style="width:20px"></view>
      </view>
      <form>
        <view class="uni-row form-padding">
          <view class="uni-row row-item uni-grow">
            <view class="uni-input-label">姓名</view>
            <input class="uni-input" name="input" v-model="person.name" placeholder="请输入" />
          </view>
          <view class="uni-row row-item uni-grow">
            <view class="uni-input-label">员工编码</view>
            <input class="uni-input" name="input" v-model="person.code" placeholder="请输入" />
          </view>

          <view class="uni-row row-item uni-grow">
            <view class="uni-input-label">职称/职务</view>
            <input class="uni-input" name="input" v-model="person.job" placeholder="请输入" />
          </view>
          <view class="uni-row row-item uni-grow">
            <view class="uni-input-label">年龄</view>
            <slider
              v-model="person.age"
              @change="agechange"
              min="0"
              max="100"
              show-value
              class="uni-grow slider"
            />
          </view>

          <view class="uni-row row-item uni-grow">
            <view class="uni-input-label">工作年限</view>
            <slider
              v-model="person.workSeniority"
              :min="workSeniorityMin"
              :max="workSeniorityMax"
              show-value
              @change="workSeniorityChange"
              class="uni-grow slider"
            />
          </view>
          <view class="uni-row row-item uni-grow">
            <view class="uni-input-label">岗位工作年限</view>
            <slider
              v-model="person.jobSeniority"
              :min="jobSeniorityMin"
              :max="jobSeniorityMax"
              show-value
              @change="jobSeniorityChange"
              class="uni-grow slider"
            />
          </view>
          <view class="uni-row row-item uni-grow">
            <view class="uni-input-label">职责</view>
            <input class="uni-input" name="input" v-model="person.duty" placeholder="请输入" />
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
import personService from "../../service/person/person";
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
        job: "",
        age: 0,
        workSeniority: 0,
        jobSeniority: 0,
        desc: "",
      },
      jobSeniorityMin: 0,
      jobSeniorityMax: 10,
      workSeniorityMin: 0,
      workSeniorityMax: 90,
    };
  },
  components: {
    uniPopup,
    uniPopupMessage,
    uniPopupDialog,
  },
  computed: {
    ...mapState({ screenOrientation: "screenOrientation" }),
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      uni.getStorage({
        key: "currJob",
        success: (val) => {
          if (val.data) {
            this.job = val.data;
          }
        },
      });
      uni.getStorage({
        key: "editData",
        success: (val) => {
          if (val.data) {
            this.person = val.data;
            this.agechange({ detail: { value: this.person.age } });
            this.workSeniorityChange({
              detail: { value: this.person.workSeniority },
            });
          } else {
            this.person = {
              name: "",
              code: "",
              type: "",
              num: "",
              age: 20,
              workSeniority: 0,
              jobSeniority: 0,
              duty: "",
            };
          }
        },
      });
    },
    back() {
      uni.switchTab({ url: "/pages/person/persons" });
    },
    save() {
      let person = {
        name: this.person.name,
        code: this.person.code,
        job: this.person.job,
        age: this.person.age,
        workSeniority: this.person.workSeniority,
        jobSeniority: this.person.jobSeniority,
        duty: this.person.duty,
        guid: this.person.guid,
      };
      console.log(person);
      if (person.guid) {
        personService.update(person).then(() => {
          uni.showToast({
            title: "保存成功!",
            duration: 2000,
          });
          uni.switchTab({ url: "/pages/person/persons" });
        });
      } else {
        person.guid = util.genPersonId();
        person.jobGuid = this.job.guid;
        personService.insert(person).then(() => {
          uni.showToast({
            title: "保存成功!",
            duration: 2000,
          });
          uni.switchTab({ url: "/pages/person/persons" });
        });
      }
    },
    agechange(e) {
      this.person.age = e.detail.value;
      this.person.jobSeniority = Math.min(
        this.person.jobSeniority,
        this.person.workSeniority,
        this.person.age
      );
      this.jobSeniorityMax = Math.min(this.jobSeniorityMax, this.person.age);

      this.person.workSeniority = Math.min(
        this.person.workSeniority,
        this.person.age
      );
      this.workSeniorityMax = this.person.age;
      this.workSeniorityMin = Math.min(this.workSeniorityMin, this.person.age);
    },
    jobSeniorityChange(e) {
      this.person.jobSeniority = e.detail.value;
    },
    workSeniorityChange(e) {
      this.person.workSeniority = e.detail.value;
      this.person.jobSeniority = Math.min(
        this.person.jobSeniority,
        this.person.workSeniority
      );
      this.jobSeniorityMax = e.detail.value;
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
