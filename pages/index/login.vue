<template>
  <view class="container">
    <view class="uni-row uni-grow">
      <view class="uni-grow"></view>
      <view class="uni-col uni-grow">
        <view class="uni-grow"></view>
        <view class="uni-col uni-grow">
          <view class="login-box uni-col uni-grow">
            <view>
              <input type="text" v-model="user.userId" focus class="border" placeholder="请输入用户名" />
            </view>
            <view>
              <input
                type="text"
                v-model="user.password"
                password
                class="border"
                placeholder="请输入密码"
              />
            </view>
            <view class="uni-row">
              <button type="primary" @click="doLogin" class="uni-grow">登录</button>
              <span style="width:5px"></span>
              <button type="default" class="uni-grow" @click="clear">清空</button>
            </view>
          </view>
        </view>
        <view class="uni-grow"></view>
      </view>
      <view class="uni-grow"></view>
    </view>
  </view>
</template>

<script>
import { mapState, mapActions } from "vuex";
import util from "../../common/util.js";
export default {
  data() {
    return {
      user: {
        userId: "tuwei",
        password: "123456",
      },
    };
  },
  created() {},
  methods: {
    doLogin() {
      let user = {
        userId: this.user.userId.trim(),
        password: btoa(this.user.password.trim()),
      };
      if (user.userId && user.password) {
        this.login(user).then((e) => {
          uni.setStorage({
            key: "login_user",
            data: e[0],
            success() {
              uni.switchTab({
                url: "/pages/index/index",
              });
              util.setUserName(user.userId);
            },
          });
        });
      } else {
        uni.showModal({
          title: "提示",
          content: "请先输入用户名与密码",
        });
      }
    },
    clear() {
      this.user.userId = "";
      this.user.password = "";
    },
    ...mapActions({
      login: "login",
    }),
  },
};
</script>

<style scoped>
.container {
  display: flex;
  height: 100%;
  padding: 20px;
  font-size: 16px;
  line-height: 40px;
  background-color: #f1e0e0;
}

input.border {
  margin-bottom: 20px;
  height: 40px;
  padding-left: 40px;
  line-height: 40px;
  border: 1px solid #e0b6b6;
  box-sizing: border-box;
}
</style>
