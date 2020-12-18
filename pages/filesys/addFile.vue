<template>
  <view class="container" :class="screenOrientation" @click="pageClick">
    <view class="uni-column" style="padding-top: 60px">
      <view class="uni-row i-header">
        <text
          class="icon iconfont iconright1"
          style="color: #007aff"
          @click="back"
        />
        <view class="uni-grow" style="padding-left: 20px">{{ title }}</view>
        <text
          class="icon iconfont iconsure"
          style="color: #007aff"
          v-show="!viewMode"
          @click="save"
        />
        <text
          class="icon iconfont iconelipsis"
          v-show="viewMode"
          @click.stop="showPopMenus($event)"
        />
      </view>
      <form>
        <view class="uni-row form-padding">
          <view class="uni-row row-item uni-grow">
            <view class="uni-input-label">文件名称</view>
            <input
              class="uni-input"
              name="input"
              type="text"
              v-model="file.name"
              placeholder="请输入"
            />
          </view>
          <view class="uni-row row-item uni-grow">
            <view class="uni-input-label">文件编码</view>
            <input
              class="uni-input"
              name="input"
              type="text"
              v-model="file.code"
              confirm-type="next"
            />
          </view>
          <view class="uni-row row-item uni-grow">
            <view class="uni-input-label">类别</view>
            <comp-tag type="文件类别" @change="onTypeChange" :value="file.type">
            </comp-tag>
          </view>
          <view class="uni-row row-item uni-grow" style="width: 100%">
            <view class="uni-input-label">相关文件</view>
            <view class="uni-grow">
              <view
                class="link-file"
                v-for="(item, key) in linkFiles"
                v-bind:key="key"
              >
                <text class="file-text" @click="openFile(item)">
                  {{ item | fileSplit }}</text
                >
                <text
                  class="remove-btn"
                  v-show="!viewMode"
                  @click="removeLinkFile(item)"
                  >✕</text
                >
              </view>
            </view>
            <text
              class="icon iconfont iconlianjie"
              style="padding-right: 10px"
              v-show="!viewMode"
              @click="selectFile"
            ></text>
          </view>
          <view class="uni-row row-item uni-grow">
            <view class="uni-input-label">备注</view>
            <input
              class="uni-input"
              name="input"
              v-model="file.remark"
              placeholder="请输入"
            />
          </view>
        </view>
      </form>

      <view class="uni-column f-layout">
        <view class="uni-row f-header">
          <view
            class="head-item"
            :class="{ active: activeIndex == 1 }"
            @click="setActive(1)"
            >图片</view
          >
          <view
            class="head-item"
            :class="{ active: activeIndex == 2 }"
            @click="setActive(2)"
            >视频</view
          >
          <view
            class="head-item"
            :class="{ active: activeIndex == 3 }"
            @click="setActive(3)"
            >音频</view
          >
        </view>

        <view class="uni-row f-content">
          <view class="content-item uni-row" v-show="activeIndex == 1">
            <view
              class="file-item file-add picture"
              @click="addPhoto"
              v-show="!viewMode"
            >
              <text class="icon iconfont">&#xe607;</text>
            </view>
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
                :src="photo.path"
                @click="previewImg(photo)"
                style="width: 200px; height: 150px"
                mode="aspectFill"
              ></image>
            </view>
          </view>
          <view class="content-item uni-row" v-show="activeIndex == 2">
            <view
              class="file-item file-add video"
              @click="addVideo"
              v-show="!viewMode"
            >
              <text class="icon iconfont">&#xe652;</text>
            </view>
            <view
              class="file-item uni-col"
              v-for="video in videos"
              v-bind:key="video.guid"
            >
              <video
                :src="video.path"
                style="width: 200px; height: 150px"
                class="video"
              >
                <cover-view
                  class="video-remove"
                  @click="removeFile(video)"
                  v-show="!viewMode"
                  >✕
                </cover-view>
              </video>
            </view>
          </view>
          <view class="content-item uni-row" v-show="activeIndex == 3">
            <view
              class="file-item-audio file-add audio"
              @click="popupAudio"
              v-show="!viewMode"
            >
              <text class="icon iconfont">&#xe6f0;</text>
            </view>
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
                :src="audio.path"
                :author="author"
                :controls="true"
                :name="formatTime(audio.time)"
              ></audio>
            </view>
          </view>
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
    <uni-popup ref="popup" type="center">
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
    <tki-file-manager ref="filemanager" @result="resultPath"></tki-file-manager>
  </view>
</template>

<script>
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import uniPopupDialog from "@/components/uni-popup/uni-popup-dialog.vue";
import util from "../../common/util";
import fileManage from "../../common/fileManage";
import CatalogService from "../../service/filesys/catalog";
import fileService from "../../service/filesys/file";
import { mapState, mapActions } from "vuex";
const recorderManager = uni.getRecorderManager();
const innerAudioContext = uni.createInnerAudioContext();
innerAudioContext.autoplay = true;
export default {
  data() {
    let newGuid = CatalogService.genGuid();
    return {
      inited: false,
      service: CatalogService,
      loadParam: { guid: newGuid },
      backFilterPage: false,
      popMenuVisible: false,
      author: util.getUserName(),
      popStyle: {
        position: "fixed",
        zIndex: 11,
        top: "10px",
        right: "50px",
      },
      title: "添加文件",
      viewMode: false,
      activeIndex: 1,
      scrollHeight: 0,
      file: {},
      photos: [],
      videos: [],
      audios: [],
      newGUId: newGuid,
      cancelAu: false,
      audioTimer: null, //定时器
      audioTime: 0, //录音计时
      popMenus: [],
      linkFiles: [],
    };
  },
  components: {
    uniPopup,
    uniPopupDialog,
  },
  onReady() {
    let _this = this;
  },
  onLoad(option) {
    let self = this;
    this.backFilterPage = option.backFilterPage;
    recorderManager.onStop(function (res) {
      clearInterval(self.audioTimer);
      self.audioTimer = null;
      self.audioTime = 0;
      if (!self.cancelAu) {
        uni.saveFile({
          tempFilePath: res.tempFilePath,
          success: (res) => {
            var savedFilePath = res.savedFilePath;
            let audio = {
              path: savedFilePath,
              guid: "VOICE_" + util.uuid(),
              foreign_id: self.file.guid || self.newGUId,
              type: 3,
              time: parseInt(Date.now() / 1000),
            };
            self.audios.push(audio);
            fileService.insert(audio);
          },
        });
      }
      self.cancelAu = false;
    });
    this.init();
  },
  onShow() {},
  computed: {
    ...mapState({
      screenOrientation: "screenOrientation",
      fileLevel: "fileLevel",
      currCatalog: "currCatalog",
    }),
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
    ...mapActions({
      loadCatalogs: "loadCatalogs",
    }),
    selectFile() {
      this.$refs.filemanager._openFile();
    },
    removeLinkFile(path) {
      this.linkFiles = this.linkFiles.filter((f) => f != path);
    },
    openFile(path) {
      uni.openDocument({
        filePath: "file:///" + path,
        success: function (res) {},
      });
    },
    onTypeChange(values) {
      this.file.type = values.join(",");
    },
    resultPath(path) {
      console.error(path);
      if (!path.startsWith("/storage/emulated/0/HRA_DOC/")) {
        uni.showToast({
          title: "只允许选择 [ 文件管理 / 内部存储/ HRA_DOC /] 目录下的文件!",
          duration: 4000,
          icon: "none",
        });
      } else {
        if (this.linkFiles.filter((f) => f == path).length) {
          uni.showToast({
            title: "该文件已经建立关联,请选择其他文件!",
            duration: 4000,
            icon: "none",
          });
        } else {
          this.linkFiles.push(path);
        }
      }
    },
    menuClick(menu) {
      if (menu.name == "编辑") {
        this.viewMode = false;
        this.title = this.file.name;
      } else if (menu.name == "拍照") {
        this.addPhoto();
      } else if (menu.name == "视频") {
        this.addVideo();
      } else if (menu.name == "录音") {
        this.popupAudio();
      }
    },
    init() {
      uni.getStorage({
        key: "editData",
        success: (val) => {
          if (val.data) {
            this.file = val.data;
            this.viewMode = val.data._viewMode;
            this.title = this.file.name;
            this.loadParam = { guid: this.file.guid };
            this.linkFiles = this.file.file_path
              ? this.file.file_path.split(",")
              : [];
            fileService.query({ foreign_id: this.file.guid }).then((files) => {
              this.photos = files.filter((file) => file.type == 1);
              this.videos = files.filter((file) => file.type == 2);
              this.audios = files.filter((file) => file.type == 3);
            });
          } else {
            this.file = {};
          }
          this.inited = true;
        },
      });
    },
    back() {
      uni.navigateBack();
    },
    setActive(index) {
      this.activeIndex = index;
    },
    showPopMenus(event) {
      this.popMenus = [
        {
          name: "编辑",
          icon: "iconccedit",
        },
        {
          name: "拍照",
          icon: "iconicon_addpicture",
        },
        {
          name: "视频",
          icon: "iconcamerafill",
        },
        {
          name: "录音",
          icon: "iconvoicefill",
        },
      ];
      this.popMenuVisible = true;
    },
    pageClick() {
      setTimeout(() => {
        this.popMenuVisible = false;
      }, 10);
    },
    save() {
      let file = {
        name: this.file.name,
        code: this.file.code,
        type: this.file.type,
        remark: this.file.remark,
        file_path: this.linkFiles.join(","),
        guid: this.file.guid,
      };
      if (!file.name) {
        uni.showToast({
          title: "文件名称不能为空!",
          duration: 2000,
          icon: "none",
        });
        return;
      }
      if (!file.code) {
        uni.showToast({
          title: "文件编码不能为空!",
          duration: 2000,
          icon: "none",
        });
        return;
      }
      if (file.guid) {
        CatalogService.update(file).then(() => {
          this.loadCatalogs();
          uni.showToast({
            title: "保存成功!",
            duration: 2000,
          });
          this.back();
        });
      } else {
        file.guid = this.newGUId;
        console.error(file.guid);
        file.parent_id = this.currCatalog ? this.currCatalog.guid : "";
        file.leaf = 1;
        CatalogService.insert(file).then(() => {
          this.loadCatalogs();
          uni.showToast({
            title: "保存成功!",
            duration: 2000,
          });
          this.back();
        });
      }
    },
    addPhoto() {
      uni.chooseImage({
        count: 5, //可以选择图片的张数
        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ["camera", "album"],
        success: (res) => {
          res.tempFilePaths.forEach((path) => {
            console.error(path);
            uni.saveFile({
              tempFilePath: path,
              success: (res) => {
                var savedFilePath = res.savedFilePath;
                let photo = {
                  path: savedFilePath,
                  guid: "PIC_" + util.uuid(),
                  foreign_id: this.file.guid || this.newGUId,
                  type: 1,
                  time: parseInt(Date.now() / 1000),
                };
                this.photos.push(photo);
                fileService.insert(photo);
              },
            });
          });
        },
      });
    },
    addVideo() {
      var self = this;
      uni.chooseVideo({
        count: 1,
        sourceType: ["camera", "album"],
        success: (res) => {
          uni.saveFile({
            tempFilePath: res.tempFilePath,
            success: (res) => {
              var savedFilePath = res.savedFilePath;
              let video = {
                path: savedFilePath,
                guid: "VIDEO_" + util.uuid(),
                foreign_id: this.file.guid || this.newGUId,
                type: 2,
                time: parseInt(Date.now() / 1000),
              };
              this.videos.push(video);
              fileService.insert(video);
            },
          });
        },
      });
    },
    popupAudio() {
      this.$refs.popup.open();
      this.startRecord();
    },

    startRecord() {
      recorderManager.stop();
      console.log("开始录音");
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
    removeFile(item) {
      fileService.remove(item.guid).then(() => {
        //在文件列表上移除该文件
        this.removeFileFormList(item);
        //获取终端保存的文件清单,并且通过path比对,找到相对应的文件,然后在终端上删除
        uni.getSavedFileList({
          success: function (res) {
            if (res.fileList.length > 0) {
              let delFiles = res.fileList.filter(
                (f) => f.filePath == item.path
              );
              if (delFiles.length) {
                uni.removeSavedFile({
                  filePath: delFiles[0].filePath,
                  complete: function (res) {
                    console.log("成功在终端移除文件");
                  },
                });
              }
            }
          },
        });
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
  },
};
</script>

<style lang="scss" scoped>
.i-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}

.row-item {
  border: 1px solid #f8f8f8;
  margin: 5px 10px 5px 0;
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

.f-layout {
  padding: 0px 20px;
}

.f-header {
  padding: 10px 15px;
  border: 1px solid #f8f8f8;

  .head-item {
    margin-right: 30px;
    padding-bottom: 5px;
    font-size: 16px;

    &.active {
      color: #007aff;
      border-bottom: 2px solid #007aff;
    }
  }
}
.sv {
  background: #f0f0f0;
}
.f-content {
  height: 100%;
  padding: 15px;
  background: #f5f5f5;
  .file-item {
    box-sizing: border-box;
    position: relative;
    width: 200px;
    height: 150px;
    text-align: center;
    line-height: 140px;
    border: 1px solid #007aff;
    margin-right: 20px;
    margin-bottom: 20px;
    overflow: hidden;
    .iconfont {
      font-size: 50px;
      font-weight: normal !important;
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
        font-weight: normal !important;
        color: #007aff;
      }
    }
    > .remove-btn {
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
.link-file {
  padding-left: 10px;
  padding-right: 10px;
  display: inline-block;
  height: 26px;
  margin: 10px 0 10px 10px;
  line-height: 26px;
  font-size: 12px;
  border-radius: 6px;

  background: rgba(223, 231, 250, 0.747);
  .file-text {
    color: #5499e4;
    text-decoration: underline;
  }
  .remove-btn {
    padding: 0 0 0 10px;
    color: rgb(247, 176, 176);
  }
}
</style>
