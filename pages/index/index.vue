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
          <image
            class="project-img"
            :src="project.img"
            mode="widthFix"
            @click="select(project)"
          />
          <view class="project-text" @click="select(project)">{{
            project.name
          }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import projectService from "../../service/project";
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
    };
  },
  onLoad(){
    this.loadDicts()
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
      util.setProjectId(project.code);
      uni.switchTab({
        url: "/pages/filesys/index",
      });
    },
    reload() {
      projectService.queryAll().then((datas) => {
        datas.forEach((project, i) => {
          project.img = "/static/images/project_" + (i + 1) + ".png";
        });
        this.projects = datas;
      });
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
  margin: 20px 0px 0px 20px;
  background: #f5f5f5;
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
</style>
