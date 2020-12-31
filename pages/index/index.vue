<template>
  <view class="container" :class="screenOrientation">
    <uni-tab-bar type="base" :class="screenOrientation"></uni-tab-bar>
    <view class="uni-grow" style="overflow: auto">
      <view class="page-section swiper">
        <view class="page-section-spacing">
          <swiper
            class="swiper"
            :indicator-dots="indicatorDots"
            :autoplay="autoplay"
            :interval="interval"
            :duration="duration"
          >
            <swiper-item v-for="(img, index) in imgs" v-bind:key="index">
              <view class="swiper-item">
                <image style="width: 100%" :src="img" mode="aspectFill" />
              </view>
            </swiper-item>
          </swiper>
        </view>
      </view>
      <view class="uni-row project-list">
        <view
          class="project uni-column"
          v-for="(project, index) in projects"
          :key="index"
        >
          <view class="image-warp">
            <image
              class="project-img"
              :src="project.img"
              mode="widthFix"
              @click="select(project)"
            />
            <!-- <view @click.stop="showPopMenus('1', project, $event)">
              <text class="icon iconfont iconelipsis"></text>
            </view> -->
          </view>
          <view class="project-text" @click="select(project)">{{
            project.name
          }}</view>
        </view>
      </view>
    </view>
    <view class="popup pop-menu" v-show="popMenuVisible" :style="popStyle">
      <view
        class="pop-menu-item uni-row"
        v-for="menu in popMenus"
        v-bind:key="menu.name"
        @click="menuClick(menu)"
      >
        <view class="iconfont" :class="menu.icon"></view>
        <text style="padding-left: 10px">{{ menu.name }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import projectService from "../../service/project";
import datasync from "../../common/datasync";
import util from "../../common/util";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      imgs: [
        "/static/images/banner_01.jpg",
        "/static/images/banner_02.jpg",
        "/static/images/banner_03.jpg",
      ],
      indicatorDots: true,
      autoplay: true,
      interval: 4000,
      duration: 1000,
      projects: [],
      scrollTop: 0,
      popStyle: {
        top: 0,
        right: "50px",
      },
      popMenuVisible: false,
      popMenus: [
        { name: "在线上传", type: "1", icon: "iconshujushangchuan" },
        { name: "在线下载", type: "1", icon: "iconicon-xiazai" },
        { name: "删除项目", type: "1", icon: "iconsystem-manage-remove red" },
      ],
      data4PopMenu: {}, //对应当前弹出菜单的数据对象
    };
  },
  onLoad() {
    this.loadDicts();
  },
  created() {
    this.reload();
  },
  computed: {
    ...mapState({ screenOrientation: "screenOrientation" }),
  },

  methods: {
    ...mapActions({
      loadDicts: "loadDicts",
    }),
    select(project) {
      if (!project.init) {
        util.setProjectId(project.guid);
        datasync.initProject(project.guid).then(() => {
          projectService.update({ guid: project.guid, init: 1 });
          uni.switchTab({
            url: "/pages/filesys/index",
          });
        });
      } else {
        util.setProjectId(project.guid);
        uni.switchTab({
          url: "/pages/filesys/index",
        });
      }
    },
    reload() {
      projectService.queryAll().then((datas) => {
        datas.forEach((project, i) => {
          project.img = "/static/images/project_" + (i + 1) + ".png";
        });
        this.projects = datas;
      });
    },
    showPopMenus(type, data, event) {
      // let top = event.currentTarget.offsetTop;
      // console.error(event.currentTarget)
      // this.popStyle.top = top - this.scrollTop + 10 + "px";
      // this.popMenuVisible = true;
      // this.data4PopMenu = data;
    },
    menuClick(menu) {
      if (menu.type == "1") {
        if (menu.name == "新建项目") {
          this.addData();
        } else if (menu.name == "在线上传") {
          uni.showToast({
            title: "该功能暂未实现!",
            duration: 2000,
            icon: "none",
          });
        }
      } else if (menu.name == "在线下载") {
        uni.showToast({
          title: "该功能暂未实现!",
          duration: 2000,
          icon: "none",
        });
      } else if (menu.type == "2") {
        if (menu.name == "删除") {
          this.remove(this.data4PopMenu);
        } else if (menu.name == "编辑") {
          uni.setStorageSync("editData", this.data4PopMenu);
          uni.navigateTo({ url: "/pages/effect/addBasic" });
        } else if (menu.name == "拷贝") {
          this.copy(this.data4PopMenu);
        }
      }
    },
  },
};
</script>

<style scoped>
.swiper {
  min-height: 60px;
}
.project-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  /* justify-content: center; */
}
.project {
  position: relative;
  margin: 20px 0px 0px 20px;
  background: #f5f5f5;
}
.image-warp {
  position: relative;
}
.project-img {
  width: 180px;
  background: #eee;
}
.project-text {
  text-align: center;
  font-size: 14px;
  height: 30px;
  line-height: 30px;
}
.swiper-item {
  text-align: center;
  vertical-align: middle;
}
.project .iconfont {
  color: #17eed1;
  font-size: 26px;
  font-weight: bold;
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 5px 10px;
  z-index: 1000;
}
</style>
