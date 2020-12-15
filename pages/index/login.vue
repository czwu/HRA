<template>
  <view class="container">
    <view class="uni-col uni-grow">
      <view class="head">
        <image
          mode="widthFix"
          src="../../static/images/logo.png"
          style="width: 280px"
        ></image>
      </view>
      <view class=" uni-grow"> </view>
      <view class="content">
          <image
          mode="widthFix"
          class='image-boy'
          src="../../static/images/boy.png"
             style="width: 350px"
        ></image>
             <image
          mode="widthFix"
              class='image-girl'
          src="../../static/images/girl.png"
          style="width: 310px"
        ></image>
        <view class="login-form">
          <text class="form-title">人因数据采集和分析处理应用软件</text>
          <view class="form-row">
            <view class="input-warp">
              <view class="icon iconfont iconyonghuming"></view>
              <input
                class="uni-input"
                type="text"
                v-model="user.userId"
                focus
                placeholder="请输入用户名"
              />
            </view>
          </view>
          <view class="form-row">
            <view class="input-warp">
              <view class="icon iconfont iconmima"></view>
              <input
                type="text"
                v-model="user.password"
                password
                class="uni-input"
                placeholder="请输入密码"
              />
            </view>
          </view>
          <view class="form-row">

          </view>
          <view class="form-row">
            <button type="primary" @click="doLogin" class="uni-grow login-btn">
              登录
            </button>
          </view>
        </view>
      </view>
      <image
        mode="widthFix"
        src="../../static/images/table.png"
        style="width: 100%"
      ></image>
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
  created() {

  },
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
              uni.navigateTo({
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

<style scoped  lang="scss">
.head {
  padding: 30px 0 10px 30px;
}
.content {
  display: flex;
  justify-content: center;
  position: relative;
}
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
  margin: 0;
  background-image: linear-gradient(to right, #E1F3FE, #CDEBFF);
}

.login-form {
  background: #fff;
  width: 400px;
  min-height: 300px;
  border-radius: 20px;
  margin-bottom: 10px;
  text-align: center;
}
.form-title {
  color: #444;
  line-height: 80px;
  font-size: 22px;
  text-align: center;
}
.form-row {
  padding: 0 70px;
  margin-bottom: 18px;
}
.input-warp {
  position: relative;
  .uni-input {
    background: #f5f5f5;
    border-radius: 15px;
    height: 32px;
    line-height: 32px;
    padding-left: 50px;
    text-align: left;
  }
  .icon.iconfont {
    position: absolute;
    left: 15px;
    top: 13px;
    color: #ccc;
    font-size: 20px;
  }
}
.input-warp:hover {
  .icon.iconfont {
    top: 13px;
    color: #007AFF
  }
}
.btn-warp {
  background: #f5f5f5;
  padding: 10px 0;
  border-radius: 15px;
  height: 28px;
  line-height: 28px;
  display: flex;
  flex-direction: row;
  font-size: 16px;
  color: #ddd;
  .btn-text {
    color: #666;
  }
}
.image-boy{
  position: absolute;
  left:0;
  bottom:0px;
}
.image-girl{
  position: absolute;
  right:0;
  bottom:0;
}
.login-btn{
  border-radius: 15px;
}
</style>
