<template>
  <view class="comp-media">
    <!-- 更多操作 ...弹出多媒体相关的popup  -->
    <uni-popup ref="mediaPopup" type="center">
      <uni-popup-dialog type="info" mode="base" :nobtn="true" :title="title">
        <view class="">
          <view class="media-panel uni-col uni-flex" v-show="activeIndex == 0">
            <view
              class="media-item uni-row"
              :class="item.css"
              v-for="item in tools"
              v-bind:key="item.name"
              @click="toolClick(item.name)"
            >
              <view
                class="item-icon icon iconfont"
                :class="item.icon"
                :style="'background-color:' + item.bgcolor"
              ></view>
              <view class="item-text uni-grow">{{ item.name }}</view>
              <view class="uni-grow"> </view>
              <text class="icon iconfont" v-if="item.next">&#xe601;</text>
            </view>
          </view>
          <view class="medias f-content" v-if="activeIndex > 0">
            <text class="icon iconfont back-btn" @click="backMenus()"
              >&#xe600;</text
            >
            <scroll-view scroll-y="true" style="height: 380px">
              <view class="content-item uni-row" v-if="activeIndex == 1">
                <!-- <view
                  class="file-item file-add picture"
                  @click="addPhoto"
                  v-show="!viewMode"
                >
                  <text class="icon iconfont">&#xe607;</text>
                </view> -->
                <view
                  class="file-item"
                  v-for="photo in photos"
                  v-bind:key="photo.guid"
                >
                  <text
                    class="remove-btn"
                    v-show="!viewMode"
                    @click="removeFile(photo)"
                    >✕</text
                  >
                  <image
                   :src="filePrePath + photo.path"
                    @click="previewImg(photo)"
                    style="width: 200px; height: 150px"
                    mode="aspectFill"
                  ></image>
                </view>
              </view>
              <view class="content-item uni-row" v-if="activeIndex == 2">
                <!-- <view
                  class="file-item file-add video"
                  @click="addVideo"
                  v-show="!viewMode"
                >
                  <text class="icon iconfont">&#xe652;</text>
                </view> -->
                <view
                  class="file-item"
                  v-for="video in videos"
                  v-bind:key="video.guid"
                >
                  <video    :src="filePrePath + video.path" style="width: 200px; height: 150px">
                    <cover-view
                      class="video-remove"
                      @click="removeFile(video)"
                      v-show="!viewMode"
                      >✕
                    </cover-view>
                  </video>
                </view>
              </view>
              <view class="content-item uni-row" v-if="activeIndex == 3">
                <!-- <view
                  class="file-item-audio file-add audio"
                  @click="popupAudio"
                  v-show="!viewMode"
                >
                  <text class="icon iconfont">&#xe6f0;</text>
                </view> -->
                <view
                  class="file-item-audio"
                  v-for="audio in audios"
                  v-bind:key="audio.guid"
                >
                  <text
                    class="remove-btn"
                    v-show="!viewMode"
                    @click="removeFile(audio)"
                    >✕</text
                  >
                  <audio
                      :src="filePrePath + audio.path"
                    :controls="true"
                    :name="formatTime(audio.time)"
                  ></audio>
                </view>
              </view>
            </scroll-view>
          </view>
        </view>
      </uni-popup-dialog>
    </uni-popup>

    <uni-popup ref="audioPopup" type="center">
      <uni-popup-dialog
        type="info"
        mode="base"
        @confirm="addAudio"
        :beforeClose="true"
        @close="cancelAudio"
        title="正在录音"
      >
        <view class="audio-panel">
          <!-- <button @tap="startRecord" v-show="!audioTimer">开始录音</button> -->
          <text class="time-text" v-show="audioTimer">{{ time }}</text>
        </view>
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
import constants from "../../common/constants";
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import uniPopupDialog from "@/components/uni-popup/uni-popup-dialog.vue";
import fileService from "../../service/filesys/file";
import util from "../../common/util";
import fileManage from "../../common/fileManage";
const recorderManager = uni.getRecorderManager();
const innerAudioContext = uni.createInnerAudioContext();
export default {
  name: "comp-media",
  props: {},
  data() {
    return {
      tools: [
        { name: "拍照", icon: "iconcamera", bgcolor: "#3396fc" },
        { name: "视频", icon: "iconcamerafill", bgcolor: "#18cb5a" },
        { name: "录音", icon: "iconvoice", bgcolor: "#fb8a00" },
        {
          name: "预览图片",
          icon: "iconicon_photo_fill",
          bgcolor: "#8d6dff",
          next: true,
          css: "",
        },
        {
          name: "录音回放",
          icon: "iconVoice",
          bgcolor: "#1ca589",
          next: true,
          css: "",
        },
        {
          name: "播放视频",
          icon: "iconvideo",
          bgcolor: "#41cdde",
          next: true,
          css: "",
        },
      ],
      cancelAu: false,
      foreign_id: "",
      field: "",
      audioTimer: null,
      audioTime: 0,
      photos: [],
      videos: [],
      audios: [],
      activeIndex: 0,
      title: "更多操作",
      viewMode: false,
      mode: "",
      tableName: "",
      filePrePath: "file://" + constants.DOC_BASE,
    };
  },
  components: {
    uniPopup,
    uniPopupDialog,
  },
  created() {
    var self = this;
    recorderManager.onStop((res) => {
      console.log("recorder stop" + JSON.stringify(res), self.foreign_id);
      clearInterval(self.audioTimer);
      self.audioTimer = null;
      self.audioTime = 0;
      if (!self.cancelAu) {
        fileManage.saveMediaFile(res.tempFilePath, (newPath) => {
          let audio = {
            path: newPath,
            guid: "VOICE_" + util.uuid(),
            foreign_id: self.foreign_id,
            field: self.field,
            type: 3,
            name: this.tableName,
            time: parseInt(Date.now() / 1000),
          };
          self.audios.push(audio);
          fileService.insert(audio);
          self.cssSet();
        });
      }
      self.cancelAu = false;
    });
  },
  computed: {
    time() {
      var h = Math.floor(this.audioTime / 3600);
      var m = Math.floor(this.audioTime / 60) % 60;
      var s = this.audioTime % 60;
      h = h >= 10 ? h : "0" + h;
      m = m >= 10 ? m : "0" + m;
      s = s >= 10 ? s : "0" + s;
      return `${h} : ${m} : ${s}`;
    },
  },
  methods: {
    loadFiles() {
      return fileService
        .query({ foreign_id: this.foreign_id, field: this.field })
        .then((files) => {
          this.photos = files.filter((file) => file.type == 1);
          this.videos = files.filter((file) => file.type == 2);
          this.audios = files.filter((file) => file.type == 3);
          this.cssSet();
        });
    },
    cssSet() {
      this.tools[3].css = this.photos.length ? "" : "disabled";
      this.tools[4].css = this.audios.length ? "" : "disabled";
      this.tools[5].css = this.videos.length ? "" : "disabled";
    },
    toolClick(name) {
      if (name == "拍照") {
        this.addPhoto(this.foreign_id, this.field);
      } else if (name == "视频") {
        this.addVideo(this.foreign_id, this.field);
      } else if (name == "录音") {
        this.popupAudio();
      } else if (name == "预览图片") {
        if (this.photos.length) {
          this.title = name;
          this.activeIndex = 1;
        }
      } else if (name == "录音回放") {
        if (this.audios.length) {
          this.title = name;
          this.activeIndex = 3;
        }
      } else if (name == "播放视频") {
        if (this.videos.length) {
          this.title = name;
          this.activeIndex = 2;
        }
      }
    },
    addPhoto(foreign_id, field) {
      uni.chooseImage({
        count: 5, //可以选择图片的张数
        sizeType: ["compressed"], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ["camera", "album"],
        success: (res) => {
          res.tempFilePaths.forEach((path) => {
            fileManage.saveMediaFile(path, (newPath) => {
              let photo = {
                path: newPath,
                guid: "PIC_" + util.uuid(),
                foreign_id: foreign_id,
                type: 1,
                name: this.tableName,
                field,
                time: parseInt(Date.now() / 1000),
              };
              console.log(photo);
              this.photos.push(photo);
              fileService.insert(photo);
              this.cssSet();
            });
          });
        },
      });
    },

    addVideo(foreign_id, field) {
      var self = this;
      uni.chooseVideo({
        count: 1,
        sourceType: ["camera", "album"],
        compressed: true,
        success: (res) => {
          fileManage.saveMediaFile(res.tempFilePath, (newPath) => {
            let video = {
              path: newPath,
              guid: "VIDEO_" + util.uuid(),
              foreign_id,
              field,
              type: 2,
              name: this.tableName,
              time: parseInt(Date.now() / 1000),
            };
            this.videos.push(video);
            fileService.insert(video);
            this.cssSet();
          });
        },
      });
    },
    popup(foreign_id, field, tableName) {
      this.tableName = tableName || "";
      this.activeIndex = 0;
      this.foreign_id = foreign_id;
      this.field = field || "";
      this.$refs.mediaPopup.open();
      this.loadFiles();
    },
    popupAudio() {
      this.$refs.audioPopup.open();
      this.startRecord();
    },
    uploadFile() {
      uni.showToast({
        title: "该功能暂未实现!",
        duration: 2000,
        icon: "none",
      });
    },
    startRecord() {
      recorderManager.stop();
      console.log("开始录音");
      // this.cancelAudio = false;
      this.audioTime = 0;
      this.audioTimer = null;
      this.audioTimer = setInterval(() => {
        this.audioTime += 1;
      }, 1000);
      recorderManager.start();
    },
    addAudio(done) {
      console.log("录音结束");
      recorderManager.stop();
      done();
    },
    cancelAudio(done) {
      console.log("录音结束");
      this.cancelAu = true;
      recorderManager.stop();
      done();
    },
    previewImg(photo) {
      let list = [];
      this.photos.forEach((pic) => {
        list.push(pic.path);
      });
      uni.previewImage({
        current: photo.path, //  传 Number H5端出现不兼容
        urls: list,
      });
    },
    formatTime(time) {
      return util.dateFormat("yyyy-MM-dd hh:mm", new Date(time * 1000));
    },
    removeFile(item) {
      fileService.remove(item.guid).then(() => {
        //在文件列表上移除该文件
        this.removeFileFormList(item);
        //获取终端保存的文件清单,并且通过path比对,找到相对应的文件,然后在终端上删除
        fileManage.deleteMediaFile(item.path);
      });
    },
    removeFileFormList(item) {
      if (item.type == 1) {
        this.photos = this.photos.filter((d) => d.guid != item.guid);
      } else if (item.type == 2) {
        this.videos = this.videos.filter((d) => d.guid != item.guid);
      } else if (item.type == 3) {
        this.audios = this.audios.filter((d) => d.guid != item.guid);
      }
    },
    backMenus() {
      this.title = "更多操作";
      this.activeIndex = 0;
      this.loadFiles();
    },
  },
};
</script>
<style lang="scss" scoped>
.media-panel {
  width: 500px;
  padding: 0 30px 20px 30px;
  .media-item {
    line-height: 66px;
    font-size: 16px;
    color: #666;
    border-bottom: 1px solid #f4f4f4;
    &.disabled {
      color: #cecece;
    }
  }
  .icon-font {
    font-size: 20px;
    color: #ccc;
    font-weight: bold;
    padding-right: 10px;
  }
  .item-icon {
    background: lightblue;
    margin-right: 20px;
    line-height: 48px;
    margin-top: 9px;
    font-size: 28px;
    color: #fff;
    height: 48px;
    width: 48px;
    border-radius: 10px;
    text-align: center;
  }
}
.audio-panel {
  padding: 0px 15px;
  .time-text {
    margin-bottom: 15px;
    text-align: center;
    font-size: 20px;
    line-height: 46px;
    display: block;
    color: #007aff;
  }
}

.f-content {
  width: 650px;
  height: 400px;
  padding: 15px;
  .file-item {
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    width: 200px;
    height: 150px;

    text-align: center;
    line-height: 140px;
    border: 1px solid #007aff;
    margin-right: 15px;
    margin-bottom: 15px;
    .iconfont {
      font-size: 50px;
      color: #007aff;
    }
    .remove-btn {
      line-height: 18px;
      padding: 2px 5px 5px;
      display: block;
      font-size: 18px;
      color: rgb(231, 80, 10);
      background: rgba(190, 223, 224, 0.8);
      position: absolute;
      top: 0;
      right: 0;
      display: block;
      z-index: 1000;
    }
    .video-remove {
      display: block;
      height: 26px;
      padding: 0 5px;
      width: 26px;
      font-size: 18px;
      color: rgb(231, 80, 10);
      background: rgba(190, 223, 224, 0.8);
      position: absolute;
      top: -2px;
      right: -5px;
    }
  }
  .file-add {
    border: 1px dashed #007aff;
  }
  .file-item-audio {
    position: relative;
    margin: 0 15px 15px 0;
    &.file-add {
      height: 65px;
      width: 70px;
      box-sizing: border-box;
      text-align: center;
      line-height: 60px;
      border: 1px dashed rgb(56, 148, 224);
      .iconfont {
        font-size: 50px;
        color: #007aff;
      }
    }
    .remove-btn {
      line-height: 18px;
      padding: 2px 5px 5px;
      display: block;
      font-size: 18px;
      color: rgb(231, 80, 10);
      background: rgba(113, 115, 116, 0.4);
      position: absolute;
      top: 0;
      right: 0;
      display: block;
      z-index: 2000;
    }
  }
}
.content-item {
  flex-wrap: wrap;
}
.audio-panel {
  padding: 0px 15px;
  .time-text {
    margin-bottom: 15px;
    text-align: center;
    font-size: 20px;
    line-height: 46px;
    display: block;
    color: #007aff;
  }
}
.back-btn {
  position: absolute;
  font-size: 18px;
  color: #007aff;
  font-weight: bold;
  padding: 15px;
  top: 0px;
  left: 0px;
}
</style>
