<template>
  <view class="tab-bar" v-show="type != 'base' ">
    <view class="tab-bar-warp uni-grow">
      <view
        class="tab-bar-item"
        style="flex-grow:1;"
        v-for="(item,key) in list"
        v-bind:key="key"
        @click="tabClick(item)"
      >
        <view class="tab-bar-icon" :class=" key == index ? item.icon+ ' active' : item.icon " :style='item.style'></view>
        <text class="tab-bar-text">{{item.text}}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "tabbar",
  props: {
    type: {
      type: String,
      default: "",
    },
    index: {
      type: String,
      default: "1",
    },
  },
  data() {
    return {
      char: "",
      list: [
        {
          text: "文件体系",
          pagePath: "/pages/filesys/index",
          icon: "hra_nav_file",
        },
        {
          text: "人员配置",
          pagePath: "/pages/person/groups",
          icon: "hra_nav_personnel",
        },
        {
          text: "HRA数据",
          pagePath: "/pages/hra/index",
          icon: "hra_nav_hra",
        },
        {
          text: "ISV",
          pagePath: "/pages/isv/index",
          icon: "hra_nav_situation",
        },
        {
          text: "人员效能",
          pagePath: "/pages/effect/index",
          icon: "hra_nav_performance",
        },{
          text: "问题普查",
          pagePath: "/pages/investigation/index",
          icon:'iconmulupucha icon iconfont'
        },{
          text: "访谈人员配置",
          pagePath: "/pages/index/config",
          icon: "icon iconfont iconrenwufangtan",
          style:"font-size:34px"
        },{
          text: "我的",
          pagePath: "/pages/index/mine",
          icon: "hra_nav_user",
        }
      ],
    };
  },
  watch: {
    title(newVal) {
      if (uni.report && newVal !== "") {
        uni.report("title", newVal);
      }
    },
  },
  methods: {
    goCenter() {
      uni.switchTab({
        url: "/pages/index/index",
      });
    },
    tabClick(item) {
      this.list.forEach((item) => {
        item.active = false;
      });
      item.active = true;
      uni.switchTab({
        url: item.pagePath,
      });
    },
  },

  created() {
    let user = uni.getStorageSync("login_user");
    if (user && user.name) {
      this.char = user.name.charAt(0).toUpperCase();
    }
    uni.hideTabBar({
      success() {},
      fail() {},
    });
  },
};
</script>
<style lang="scss" scoped>
.tab-bar-warp {
  display: flex;
  justify-content:space-between ;
  height: 100%;
}
.center {
  background: #fff;
  width: 36px;
  height: 36px;
  margin-top: 4px;
  display: block;
  color: #fff;
  text-align: center;
  background: url("/static/icons/1.5x/hra_nav_user_n.png") no-repeat 50% 50%;
  background-size: 100% 100%;
  &.active {
    background: url("/static/icons/1.5x/hra_nav_user_s.png") no-repeat 50% 50%;
    background-size: 100% 100%;
  }
}
.portrait .tab-bar-item {
  display: flex;
  flex-direction: column;
}
.landscape .tab-bar-item {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}
.tab-bar-icon {
  font-size:30px;
  line-height: 36px;
  color:#6c81ac;
  width: 36px;
  height: 36px;
  border-radius: 5px;
  margin: 0 auto;
  &.active{
  color:#063CA6;
  }
}
.tab-bar-text {
  color: #000;
  text-align: center;
  font-size: 12px;
  line-height: 15px;
}

.hra_nav_file {
  background: url("/static/icons/1.5x/hra_nav_file_n.png") no-repeat 50% 50%;
  background-size: 100% 100%;
  &.active {
    background: url("/static/icons/1.5x/hra_nav_file_s.png") no-repeat 50% 50%;
    background-size: 100% 100%;
  }
}
.hra_nav_personnel {
  background: url("/static/icons/1.5x/hra_nav_personnel_n.png") no-repeat 50%
    50%;
  background-size: 100% 100%;
  &.active {
    background: url("/static/icons/1.5x/hra_nav_personnel_s.png") no-repeat 50%
      50%;
    background-size: 100% 100%;
  }
}
.hra_nav_hra {
  background: url("/static/icons/1.5x/hra_nav_hra_n.png") no-repeat 50% 50%;
  background-size: 100% 100%;
  &.active {
    background: url("/static/icons/1.5x/hra_nav_hra_s.png") no-repeat 50% 50%;
    background-size: 100% 100%;
  }
}
.hra_nav_situation {
  background: url("/static/icons/1.5x/hra_nav_situation_n.png") no-repeat 50%
    50%;
  background-size: 100% 100%;
  &.active {
    background: url("/static/icons/1.5x/hra_nav_situation_s.png") no-repeat 50%
      50%;
    background-size: 100% 100%;
  }
}
.hra_nav_performance {
  background: url("/static/icons/1.5x/hra_nav_performance_n.png") no-repeat 50%
    50%;
  background-size: 100% 100%;
  &.active {
    background: url("/static/icons/1.5x/hra_nav_performance_s.png") no-repeat
      50% 50%;
    background-size: 100% 100%;
  }
}
.hra_nav_defauit {
  background:  url("/static/icons/1.5x/hra_nav_defauit.png")
    no-repeat 50% 50%;
  background-size: 100% 100%;
  &.active {
    background: url("/static/icons/1.5x/hra_nav_defauit.png") no-repeat 50% 50%;
    background-size: 100% 100%;
  }
}
.hra_nav_user {
  background: url("/static/icons/1.5x/hra_nav_user_n.png")
    no-repeat 50% 50%;
  background-size: 100% 100%;
  &.active {
    background: url("/static/icons/1.5x/hra_nav_user_s.png") no-repeat 50% 50%;
    background-size: 100% 100%;
  }
}
</style>
