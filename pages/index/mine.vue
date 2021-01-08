<template>
  <view class="container" :class="screenOrientation">
    <uni-tab-bar :class="screenOrientation" index="7"></uni-tab-bar>
    <view class="layout uni-grow" >
      <view class="uni-flex uni-column uni-grow">
        <view class="header"> 我的 </view>
        <view class="item" @click="toSelectProject">
          <text
            class="icon iconfont iconProjectselection"
            style="font-size: 20px"
          ></text>
          <text> 切换项目 </text>
        </view>
        <view class="item" @click="backupDB">
          <text class="icon iconfont iconshujushangchuan"></text>
          <text> 数据打包</text>
          <text style="padding-left: 20px; font-size: 13px; color: #888">
            执行该操作后,请将{{ projectPath }}复制到PC端,并解压</text
          >
        </view>
        <view class="item" @click="dataDownload">
          <text class="icon iconfont">&#xe687;</text>
          <text> 重新初始化项目</text>
          <text style="padding-left: 20px; font-size: 13px; color: #888">
            该操作将重新读取proj.json文件,并初始化数据</text
          >
        </view>
        <!-- <view class="item" @click="setting"
          ><text class="icon iconfont iconshezhi"></text> <text> 设置</text>
        </view> -->
        <view class="item" @click="goSql()"
          ><text class="icon iconfont icontiaoshi"></text>
          <text> 查看数据库表</text>
        </view>
        <!-- <view class="item" @click="about"
          ><text class="icon iconfont iconguanyu"></text> <text> 关于</text>
        </view> -->
        <view class="item btn" @click="logout"> <text> 退出登录</text> </view>
      </view>
    </view>
  </view>
</template>

<script>
import util from "../../common/util";
import constants from "../../common/constants.js";
import datasync from "../../common/datasync.js";
import fileManage from "../../common/fileManage";
import projectService from "../../service/project";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      projectPath: constants.DOC_BASE + util.getProjectCode() + ".zip",
    };
  },

  components: {},
  computed: {
    ...mapState({
      screenOrientation: "screenOrientation",
    }),
  },
  methods: {
    toSelectProject() {
      uni.navigateTo({
        url: "/pages/index/index",
      });
    },
    backupDB() {
      projectService.closeDataBase(() => {
        fileManage.backupDB();
        setTimeout(()=>{
          projectService.openDataBase()
        },1000)
      });
    },

    dataDownload() {
      datasync.initProject(util.getProjectId());
    },

    setting() {},

    about() {},

    logout() {
      uni.navigateTo({
        url: "/pages/index/login",
      });
    },
    goSql() {
      uni.navigateTo({
        url: "/pages/index/sql",
      });
    },
  },
};
</script>

<style  lang="scss" scope>
.container{
    background: #f8f8f8;
}
.layout {
  background: #f2f2f2;
}
.header {
  background: #fff;
  height: 60px;
  line-height: 60px;
  font-size: 18px;
  color: #666;
  margin-bottom: 1px;
  text-align: center;
}
.item {
  background: #fff;
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  padding: 0 20px;
  color: #666;
  margin-bottom: 10px;
  .icon {
    font-size: 24px;
    margin-right: 10px;
    font-weight: normal;
  }
  &.btn {
    text-align: center;
    margin-bottom: 1px;
    color: red;
  }
}
</style>
