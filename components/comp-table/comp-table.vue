<template>
  <view class="comp-table-warp uni-grow" @click="pageClick">
    <text class="add-btn" @click="openCreate" v-if="btns">{{ addTitle }}</text>
    <view class="comp-table uni-grow uni-col">
      <view class="table-head uni-row">
        <view
          class="table-th"
          v-for="col in columns"
          v-bind:key="col.field"
          :class="col.css"
          :style="{ width: col.width || '100px' }"
        >
          <text class="col-text">{{ col.name }}</text>
        </view>
        <view class="table-th oper-col" v-if="btns">
          <text class="col-text">操作</text>
        </view>
      </view>
      <view class="table-body uni-col uni-grow">
        <view
          class="table-row uni-row uni-grow"
          v-for="(data, key) in datas"
          v-bind:key="key"
        >
          <view
            class="table-td"
            v-for="col in columns"
            v-bind:key="col.field + data.guid"
            :class="col.css"
            :style="{
              width: col.width || '100px',
              background: col.bgcolor ? col.bgcolor[col.values.indexOf(data[col.field])] : '',
              color:col.bgcolor ? '#444' : ''
            }"
          >
            <text class="col-text">{{ data[col.field] }}</text>
          </view>
          <view class="table-td oper-col center" v-if="btns">
            <text class="icon iconfont" @click.stop="showPopMenus(data, $event)"
              >&#xe66e;</text
            >
          </view>
        </view>
      </view>
    </view>

    <uni-popup ref="editPopup" type="center">
      <uni-popup-dialog
        type="info"
        mode="base"
        :title="title"
        style="width: 600px"
        @confirm="saveForm"
      >
        <comp-page
          v-if="popup"
          ref="compPage"
          :service="service"
          title=""
          :param="loadParam"
          :autoload="true"
          :header="false"
          :scroll="false"
        ></comp-page>
      </uni-popup-dialog>
    </uni-popup>
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
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import uniPopupDialog from "@/components/uni-popup/uni-popup-dialog.vue";
export default {
  name: "compTable",
  props: {
    service: {
      type: Object,
      default: () => {},
    },
    btns: {
      type: Boolean,
      default: true, //是否显示添加按钮
    },
    autoload: {
      type: Boolean,
      default: true, //是否自己加载数据
    },
    param: {
      type: Object, //配合autoload使用, 加载数据的请求参数
      default: () => {},
    },
    _datas: {
      type: Array,
    },
    addTitle: {
      type: String, //配合autoload使用, 加载数据的请求参数
      default: "新增",
    },
    addtype: {
      type: String, //C类规程与主控班组信息,需要通过选择的方式添加数据,需要个性化 TEAM GUIC
    },
  },
  components: { uniPopup, uniPopupDialog },

  watch: {
    service(service) {
      var columns = this.service.getTableItems
        ? this.service.getTableItems()
        : this.service.getFormItems();
      var foreign_id = this.param.foreign_id;
      this.loadData();
      this.columns = columns;
    },
  },
  data() {
    var columns = this.service.getTableItems
      ? this.service.getTableItems(this.addtype)
      : this.service.getFormItems();
    var foreign_id = this.param.foreign_id;
    this.loadData();
    return {
      datas: [],
      columns: columns,
      title: "创建",
      popup: false,
      loadParam: {
        guid: "",
      },
      popMenuVisible: false,
      popMenus: [
        { name: "编辑", type: "2", icon: "iconccedit" },
        { name: "拷贝", type: "2", icon: "iconcopy" },
        { name: "删除", type: "2", icon: "iconsystem-manage-remove red" },
      ],
      data4PopMenu: null,
      popStyle: {
        top: 0,
        right: "80px",
        zIndex: 3000,
      },
      timer: "",
      scrollTop: 0,
    };
  },
  created() {},
  methods: {
    pageClick() {
      setTimeout(() => {
        this.popMenuVisible = false;
      }, 10);
    },
    loadData() {
      if (this._datas) {
        this.datas = this._datas;
        return;
      }
      //检测service是否实现了getTableData方法,如果有,则使用getTableData加载数据, 否则使用service自带的query方法
      let fn = this.service.getTableData ? "getTableData" : "query";
      this.service[fn](this.param).then((data) => {
        this.datas = data || [];
      });
    },
    openCreate() {
      if (this.addtype == "team") {
      } else {
        this.$refs.editPopup.open();
        this.loadParam = { guid: "" };
        this.popup = true;
      }
    },
    saveForm(done) {
      this.$refs.compPage.formdata.foreign_id = this.param.foreign_id;
      this.$refs.compPage.save(() => {
        this.loadData();
        done();
      });
    },
    showPopMenus(data, event) {
      let top = event.currentTarget.offsetTop;
      this.popStyle.top = top - this.scrollTop + 10 + "px";
      this.popMenuVisible = true;
      this.data4PopMenu = data;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.popMenuVisible = false;
      }, 2000);
    },
    menuClick(menu) {
      let data = this.data4PopMenu;
      if (!data) return;
      if (menu.name == "编辑") {
        this.title = "编辑";
        this.$refs.editPopup.open();
        this.loadParam = { guid: data.guid };
        this.popup = true;
      } else if (menu.name == "删除") {
        uni.showModal({
          title: "提示",
          content: "确认删除该数据?",
          success: (res) => {
            if (res.confirm) {
              this.service.remove(data.guid).then(() => {
                this.loadData();
                uni.showToast({
                  title: "删除成功!",
                  duration: 2000,
                });
              });
            }
          },
        });
      } else if (menu.name == "拷贝") {
        let guid = this.service.genGuid();
        this.service.copy(data, "code", guid).then((newData) => {
          this.loadData();
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.comp-table-warp {
  text-align: left;
  padding: 0px 15px;
  .add-btn {
    margin: 0;
    height: 30px;
    background: rgba(149, 181, 250, 0.438);
    line-height: 30px;
    padding: 5px 15px;
    text-align: center;
    border-radius: 4px;
    font-size: 14px;
    color: #007aff;
  }
}

.comp-table {
  margin-top: 10px;
  border: 1px solid #f5f5f5;
}
.table-head {
  line-height: 50px;
  height: 50px;
  background: rgba(176, 178, 184, 0.2);
  text-align: left;
}
.table-row {
  line-height: 40px;
  text-align: left;
  border-top: 1px solid #f5f5f5;
}
.table-td,
.table-th {
  flex-grow: 1;
  width: 100px;
  overflow: hidden;
  font-size: 13px;
  padding: 0 10px;
  color: #666;
  &.center {
    text-align: center;
  }
}

.table-th {
  color: #333;
  font-size: 14px;
}
.oper-col {
  text-align: center;
  flex-grow: 0 !important;
  width: 50px;

  text-align: center;
  .icon {
    color: #b2b2b2;
    font-size: 20px !important;
    font-weight: bold;
    &:hover {
      color: #007aff;
    }
  }
}
.col-text {
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}
</style>
