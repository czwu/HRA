<template>
  <view class="container" :class="screenOrientation" @click="pageClick()">
    <uni-tab-bar :class="screenOrientation" index="6"></uni-tab-bar>
    <view class="uni-column">
      <view class="uni-row i-header">
        <view class="uni-grow"></view>
        <text class="i-header-text">访谈信息配置</text>
        <view class="uni-grow"></view>
        <!-- <view
          class
          style="transform: rotate(90deg)"
          @click.stop="showPopMenus('1', null, $event)"
        >
          <text class="icon iconfont">&#xe66e;</text>
        </view> -->
      </view>
    </view>
    <view class="tab-layout uni-column">
      <view class="i-tabs uni-grow uni-row">
        <view
          class="tab-item"
          v-for="tab in tabs"
          v-bind:key="tab.index"
          @click="tabClick(tab)"
        >
          <text
            class="tab-item-title"
            :class="{ hover: tabIndex == tab.index }"
            >{{ tab.name }}</text
          >
        </view>
        <view class="uni-grow"></view>

        <text
          class="add-btn icon iconfont iconicon_roundadd_fill"
          @click="addPage()"
        ></text>
      </view>
    </view>
    <view class="i-list">
      <scroll-view
        scroll-y="true"
        class="sv"
        :style="{ height: scrollHeight + 'px' }"
        @scroll="scroll"
      >
        <view
          class="i-list-item uni-row"
          v-for="data in list"
          v-bind:key="data.guid"
        >
          <view class="uni-row uni-grow">
              <text class="icon iconfont iconicon_signal_fill"></text>
              <text style="padding-left: 15px; font-weight: normal"
                >{{ data.value }}
              </text>
              <text class="desc-text">{{ data.descrip }} </text>
              <view class="uni-grow"></view>
              <view
                style="margin-left: 25px"
                @click.stop="showPopMenus('2', data, $event)"
              >
                <text class="icon iconfont">&#xe66e;</text>
              </view>
          </view>
        </view>
        <view class="no-content" @click="addPage()" v-if="!list.length">
          <view>
            <image
              class="add-img"
              src="/static/images/img_new.png"
              mode="widthFix"
            />
          </view>
          <view>
            <text class="add-text">点击这里添加{{ tabs[tabIndex].name }}</text>
          </view>
        </view>
      </scroll-view>
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
    <uni-popup ref="editPopup" type="center">
      <uni-popup-dialog
        type="info"
        mode="base"
        :title="title"
        style="width: 600px"
        @confirm="save"
      >
        <comp-page
          v-if="popup"
          ref="compPage"
          :service="service"
          title=""
          :param="loadParam"
          :autoload="true"
          :form_mode="type"
          :header="false"
          :scroll="false"
        ></comp-page>
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
import util from "../../common/util";
import moduleService from "../../service/config/Interview_config";
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import uniPopupDialog from "@/components/uni-popup/uni-popup-dialog.vue";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      popMenuVisible: false,
      data4PopMenu: null,
      popMenus: [
        {
          name: "编辑",
          type: "2",
          icon: "iconccedit",
        },
        {
          name: "删除",
          type: "2",
          icon: "iconsystem-manage-remove red",
        },
      ],
      winHeight: 0,
      scrollHeight: 0,
      popStyle: {
        top: 0,
        right: "50px",
      },
      tabIndex: 0,
      service: moduleService,
      list: [],
      loadParam: {},
      title: "",
      type: "访谈人员",
      popup: false,
      tabs: [
        { name: "访谈人员", index: 0 },
        { name: "访谈对象", index: 1 },
        { name: "访谈地点", index: 2 },
      ],
    };
  },
  components: { uniPopup, uniPopupDialog },
  mounted() {
    let _this = this;
    uni.getSystemInfo({
      success: (res) => {
        this.winHeight = res.windowHeight;
        uni
          .createSelectorQuery()
          .select(".sv")
          .boundingClientRect((data) => {
            _this.scrollHeight = res.windowHeight - data.top - 85;
          })
          .exec();
      },
    });
    this.loadData();
  },
  computed: {
    ...mapState({
      screenOrientation: "screenOrientation",
    }),
  },
  methods: {
    pageClick() {
      setTimeout(() => {
        this.popMenuVisible = false;
      }, 10);
    },
    tabClick(tab) {
      this.tabIndex = tab.index;
      this.type = tab.name;
      this.loadData();
    },
    addPage() {
      this.$refs.editPopup.open();
      this.loadParam = { guid: "" };
      this.popup = true;
      this.title = "添加" + this.type;
    },
    scroll(e) {
      this.scrollTop = parseInt(e.detail.scrollTop);
      this.popMenuVisible = false;
    },
    loadData() {
      moduleService.query({ type: this.type }).then((datas) => {
        this.list = datas;
      });
    },
    save(done) {
      this.$refs.compPage.formdata.type = this.type;
      this.$refs.compPage.save(() => {
        this.loadData();
        done();
      });
    },
    showPopMenus(type, data, event) {
      let top = event.currentTarget.offsetTop;
      this.popStyle.top = top + 120 + "px";
      this.popMenuVisible = true;
      this.data4PopMenu = data;
    },
    menuClick(menu) {
      if (menu.name == "编辑") {
        this.loadParam = { guid: this.data4PopMenu.guid };
        this.title = "编辑" + this.type;
        this.$refs.editPopup.open();
        this.popup = true;
      } else if (menu.name == "删除") {
        this.remove(this.data4PopMenu);
      }
    },
    remove(obj) {
      uni.showModal({
        title: "提示",
        content: "是否确认删除该数据?",
        success: (res) => {
          if (res.confirm) {
            moduleService.remove(obj.guid).then(() => {
              this.loadData();
              uni.showToast({
                title: "删除成功!",
                duration: 2000,
              });
            });
          }
        },
      });
    },
  },
};
</script>

<style  lang="scss" scope>

.split {
  height: 8px;
  background: #f2f2f2;
}
.tab-layout {
  padding: 15px 20px 15px 20px;
  .tab-item {
    text-align: center;
    padding: 0 28px 0 0;
  }
  .tab-item-title {
    color: #666;
    padding-bottom: 5px;
    font-size: 16px;
    &.hover {
      color: #359dff;
      border-bottom: 2px solid #359dff;
    }
  }
}
.item-icon {
  font-size: 22px !important;
}
.desc-text {
  font-size: 14px;
  color: #999;
  font-weight: normal;
  margin-left: 50px;
}
.icon.iconfont.add-btn {
  font-weight: normal;
  line-height: 40px;
  padding: 0 10px;
  font-size: 24px;
  color: #359dff;
}
.i-list-item {
  line-height: 60px;
  height: 60px;
  display: flex;
  flex-direction: row;
}
</style>
