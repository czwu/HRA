<template>
  <view class="container" @click="pageClick" :class="screenOrientation">
    <view class="uni-column">
      <view class="uni-row i-header">
        <text class="icon iconfont" @click="back">&#xe600;</text>
        <text class="i-header-text">类别管理</text>
        <view class="uni-grow"></view>
        <text class="icon iconfont" style="font-weight: 300" @click="addGroup"
          >&#xe670;</text
        >
      </view>
      <view class="uni-grow">
        <view class="i-list">
          <view
            class="i-list-item uni-row"
            v-for="type in personGroups"
            v-bind:key="type.guid"
          >
            <view class="uni-column uni-grow">
              <view class="list-item-content">
                <view class="item-icon"></view>
                <text style="padding-left: 15px">{{ type.name }}</text>
                <text v-show="type.custom" class="custom">(自定义)</text>
                <view class="uni-grow"></view>
                <view
                  @click.stop="showPopMenus('2', type, $event)"
                  v-show="type.custom"
                >
                  <text class="icon iconfont" style="font-weight: bold"
                    >&#xe66e;</text
                  >
                </view>
              </view>
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
        mode="input"
        @confirm="saveGroup"
        :title="editInfo.title"
        :value="editInfo.value"
        :placeholder="editInfo.placeholder"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import uniPopupMessage from "@/components/uni-popup/uni-popup-message.vue";
import uniPopupDialog from "@/components/uni-popup/uni-popup-dialog.vue";
import groupService from "../../service/person/group";
import util from "../../common/util";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      popMenuVisible: false,
      allMenus: [
        { name: "编辑", type: "2", icon: "iconccedit" },
        { name: "删除", type: "2", icon: "iconicon_trashcan" },
      ],
      popStyle: {
        top: 0,
        right: "50px",
      },
      popMenus: [],
      data4PopMenu: {}, //对应当前弹出菜单的数据对象
      editInfo: {
        title: "",
        value: "",
        placeholder: "",
      },
    };
  },
  components: {
    uniPopup,
    uniPopupMessage,
    uniPopupDialog,
  },
  created() {
    if (!this.personGroups.length) {
      this.loadPersonGroups();
    }
  },
  onShow() {},
  computed: {
    ...mapState({
      screenOrientation: "screenOrientation",
      personGroups: "personGroups",
    }),
  },
  methods: {
    ...mapActions({
      loadPersonGroups: "loadPersonGroups",
    }),
    back() {
      uni.navigateBack();
    },

    showPopMenus(type, data, event) {
      this.popMenus = this.allMenus.filter((menu) => menu.type == type);
      let top = event.currentTarget.offsetTop;
      this.popStyle.top = top + 10 + "px";
      this.popMenuVisible = true;
      this.data4PopMenu = data;
    },
    pageClick() {
      setTimeout(() => {
        this.popMenuVisible = false;
      }, 10);
    },
    removeGroup() {
      let msg = "是否确认删除该分类信息?";
      let guid = this.data4PopMenu.guid;
      uni.showModal({
        title: "提示",
        content: msg,
        success: (res) => {
          if (res.confirm) {
            groupService.remove(guid).then(() => {
              this.loadPersonGroups();
              uni.showToast({
                title: "删除成功!",
                duration: 2000,
              });
            });
          }
        },
      });
    },
    addGroup() {
      this.data4PopMenu = {};
      this.editInfo.title = "创建自定义分类";
      this.editInfo.value = "";
      this.editInfo.placeholder = "请输入分类名称";
      this.$refs.popup.open();
    },
    editGroup(data) {
      this.editInfo.title = "修改分类名称";
      this.editInfo.value = data.name;
      this.editInfo.placeholder = "请输入分类名称";
      this.$refs.popup.open();
    },
    saveGroup(done, val) {
      let name = val.trim();
      if (name.length < 20) {
        //通过id判断是修改还是新增操作
        if (this.data4PopMenu.guid) {
          //修改名称
          let group = {
            guid: this.data4PopMenu.guid,
            name: name,
          };
          groupService.update(group).then((e) => {
            done();
            this.loadPersonGroups();
            uni.showToast({
              title: "保存成功!",
              duration: 2000,
            });
          });
        } else {
          //新增分类
          let group = {
            guid: util.genGroupId(),
            custom: 1,
            name: name,
          };
          groupService.insert(group).then((e) => {
            done();
            this.loadPersonGroups();
            uni.showToast({
              title: "保存成功!",
              duration: 2000,
            });
          });
        }
      } else {
        uni.showToast({
          title: "名称过长,请重新输入",
        });
      }
    },
    menuClick(menu) {
      if (menu.name == "删除") {
        this.removeGroup();
      } else if (menu.name == "编辑") {
        this.editGroup(this.data4PopMenu);
      }
    },
  },
};
</script>

<style lang="scss" scoped >
.i-header {
  height: 56px;
  line-height: 56px;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 15px;
  > .i-header-text {
    font-size: 18px;
    padding: 0 20px;
  }
  .icon.iconfont {
    color: #007aff;
    font-size: 20px;
    font-weight: bold;
  }
}
.i-list {
  padding-left: 20px;
}
.i-list-item {
  height: 72px;
  line-height: 72px;
  border-bottom: 1px solid #f8f8f8;
  padding-right: 20px;
}
.list-item-content {
  font-size: 16px;
  color: #666;
  font-weight: bold;
  display: flex;
  flex-direction: row;
}
.icon.iconfont {
  vertical-align: middle;
  font-size: 20px;
  font-weight: bold;
  color: #b2b2b2;
  &:hover {
    color: #007aff;
  }
}
text.custom {
  margin: 0 20px;
  font-weight: 300;
  color: rgb(131, 193, 243);
}
.item-icon {
  width: 40px;
  margin: auto 0;
  height: 40px;
  background: url("/static/icons/1.5x/personnel_post_n.png") no-repeat 50% 50%;
  background-size: 100% 100%;
}
</style>
