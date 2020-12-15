<script>
import util from "./common/util";
import { mapState, mapActions } from "vuex";

export default {
  created() {
    let user = uni.getStorageSync("login_user");
    //判断当前用户是否已经登录,如果未登录则跳转到登录页面
    if (user) {
      this.$store.commit("login", user);
      util.setUserName(user.userName);
    } else {
      uni.redirectTo({
        url: "/pages/index/login",
      });
    }
    return;
  },
  onLaunch: function () {
    plus.screen.lockOrientation("default");
    // uni.onWindowResize(res => { 
    //   uni.getSystemInfo({
    //     success: res => {
    //       if (res.windowWidth > res.windowHeight) {
    //         this.$store.commit("setScreenOrientation", "landscape"); //landscape
    //       } else {
    //         this.$store.commit("setScreenOrientation", "portrait");
    //       }
    //     }
    //   });
    // });
  },
  computed: {
    ...mapState({
      loginUser: "loginUser",
    }),
  }


};
</script>

<style  lang="scss">
@import "./static/iconfont/iconfont.css";
@import "./common/uni.css";
@import "./common/app.scss";

/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
  font-family: uniicons;
  src: url("/static/uni.ttf");
}

/* #endif */
</style>
