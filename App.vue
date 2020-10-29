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
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
  computed: {
    ...mapState({
      loginUser: "loginUser",
    })
  },
};
</script>

<style  lang="scss">
@import "./static/iconfont/iconfont.css";
@import "./common/uni.css";

/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
  font-family: uniicons;
  src: url("/static/uni.ttf");
}

/* #endif */
uni-page-body,
#app,
page {
  height: 100%;
  box-sizing: border-box;
}

.uni-row {
  display: flex;
  flex-direction: row;
}
.uni-grow {
  min-width: 1px;
  min-height: 1px;
  flex-grow: 1;
}
.uni-col {
  display: flex;
  flex-direction: column;
}

.flex-no-shrink {
  flex-shrink: 0;
}
.flex-no-grow {
  flex-grow: 0;
}
.flex-wrap{
  flex-wrap: wrap;
}
.container {
  position: relative;
  height: 100%;
  font-size: 14px;
  line-height: 24px;
  &.landscape {
    margin-left: 80px;
    .tab-bar {
      position: fixed;
      left: 0;
      top: 0;
      height: 100%;
      padding: 20px 0px;
      width: 80px;
      text-align: center;
      .tab-bar-warp {
        display: flex;
        flex-direction: column;
      }
    }
  }
  &.portrait {
    margin-left: 0;
    .tab-bar {
      position: fixed;
      left: 0;
      bottom: 0;
      height: 60px;
      width: 100%;
      padding: 5px 20px 0 20px;
      vertical-align: 50%;
      border-top: 1px solid #f0f0f0;
      .tab-bar-warp {
        display: flex;
        flex-direction: row;
      }
    }
  }
  .tab-bar {
    box-sizing: border-box;
    position: fixed;
    background: #f5f5f5;
    text-align: center;
    z-index: 1000;
  }
}
.popup {
  position: absolute;
  &.pop-menu {
    padding: 10px;
    background: #fff;
    box-shadow: 1px 1px 2px 2px rgba(178, 180, 184, 0.3);
    border-radius: 6px;
    top: 20px;
    right: 0;
    width: 140px;
    .pop-menu-item {
      font-size: 16px;
      padding: 0 10px;
      height: 40px;
      line-height: 40px;
      .iconfont {
        color: #007aff;
        padding-right: 5px;
      }
      &.border-bottom {
        border-bottom: 1px solid #f0f0f0;
      }
      color: #333;
    }
  }
}
.menu.iconfont {
  font-size: 16px;
  &.red {
    color: red !important;
  }
  &.weight {
    font-weight: bold;
  }
}
.no-content {
  margin-top: 50px;
  text-align: center;
  .add-text {
    font-size: 26px;
    color: #666;
    padding: 6px 20px;
    margin-top: -30px;
    background: #ececf9;
    border-radius: 6px;
  }
}
.build-text {
  width: 100%;
  height: 100%;
  text-align: center;
  background: url("/static/images/building.jpg") no-repeat 50% 50%;
  background-position: 50% 50%;
  background-size: 50% auto;
}
.iconfont.red {
  color: red !important;
}
</style>
