<template>
  <view class="container">
    <view class="uni-column">
      <view class="uni-row i-header">
        <text class="icon iconfont" @click="back">&#xe600;</text>
        <view class="uni-grow title">{{ title }}</view>
        <text class="icon iconfont" @click="save">&#xe656;</text>
      </view>
    </view>
    <scroll-view
      scroll-y="true"
      class="sv"
      :style="{ height: scrollHeight + 'px' }"
    >
      <view class="uni-row form-padding" v-if="mode == 'create'">
        <view class="uni-row row-item uni-grow">
          <view class="uni-input-label">分组</view>
          <input
            class="uni-input"
            name="input"
            type="text"
            v-model="group_name"
            placeholder-style="color:#bbb"
            placeholder="请输入"
          />
        </view>
      </view>
      <comp-page
        ref="compPage"
        v-if="mode == 'update'"
        :service="service"
        title=""
        :autoload="true"
        :header="false"
        :scroll="false"
        form_mode="group"
        formcss="step-form"
      ></comp-page>
      <view style="padding: 10px 20px 10px 20px">
        <view class="event-list uni-row">
          人误事件
          <view class="uni-grow"></view>
          <view class="add-event" @click="toAddEvent" v-if="mode == 'create'">
            添加人误事件
          </view>
        </view>
        <view
          class="i-list-item uni-row"
          v-for="data in datas"
          v-bind:key="data.guid"
        >
          <text class="icon iconfont item-icon">&#xe66f;</text>
          <view class="uni-column uni-grow" style="padding: 10px 0 10px 20px">
            <view class="list-item-content" @click="viewData(data)">
              <text>{{ data.code }}</text>
              <text class="color-text color-text-num">{{
                data.device_type
              }}</text>
              <view class="uni-grow"></view>
            </view>
            <view class="desc">
              <text class="color-text-desc">{{ data.device_funciton }}</text>
            </view>
          </view>
          <view
            class="link-btn"
            style=""
            v-if="data.stage_index > 1 && mode=='update'"
            @click.stop="toCorrelation(data)"
            >{{ data.correlation || "选择相关性" }}</view
          >
          <view style="padding: 0 5px">
            <text
              class="icon iconfont"
              style="line-height: 70px; font-size: 20px"
              >&#xe601;</text
            >
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import util from "../../common/util";
import constants from "../../common/constants";
import typeACService from "../../service/hra/typeAC";
export default {
  props: {},
  components: {},
  data() {
    var service = typeACService;
    return {
      title: "创建A类相关性",
      winHeight: 0,
      scrollHeight: 0,
      mode: "create", //默认为新增数据
      service,
      param: {},
      task_id: null,
      stage: null,
      group_name: "",
      type: "A类相关性",
      datas: [],
      guid: "-",
      group_id: "",
    };
  },
  computed: {},
  onShow(){
    if(this.group_id){
      this.loadData()
    }
  },
  onLoad(options) {
    this.task_id = options.task_id;
    uni.getStorage({
      key: "editData",
      success: (val) => {
        if (val.data) {
          this.guid = val.data.guid;
          this.group_id = val.data.group_id;
          this.mode = "update";
          this.title = val.data.group_name;
          this.loadData();
        }
      },
    });
    var groupName = {};
    typeACService
      .query({ task_id: this.task_id, stage_index: 1 })
      .then((datas) => {
        datas.forEach((data) => {
          groupName[data.group_name] = true;
        });
        let num = datas.length + 1;
        while (groupName["group-" + num]) {
          num++;
        }
        //自动根据当前数量,生成group_name,并需要保证该name没有被占用
        this.group_name = "group-" + num;
      });
  },
  mounted() {
    let _this = this;
    uni.getSystemInfo({
      success(res) {
        let wHeight = res.windowHeight;
        let titleH = uni.createSelectorQuery().select(".sv");
        titleH
          .boundingClientRect((data) => {
            _this.scrollHeight = wHeight - data.top - 30;
          })
          .exec();
      },
    });
  },
  methods: {
    back() {
      uni.navigateBack();
    },
    loadData() {
      typeACService.query({ group_id: this.group_id }).then((datas) => {
        this.datas = datas;
      });
    },
    save() {
      //验证group名称是否重复
      this.validName().then(() => {
        if (this.mode == "create") {
          let datas = [];
          let group_id = typeACService.genGuid();
          this.datas.forEach((d) => {
            datas.push({
              guid: typeACService.genGuid(),
              task_id: this.task_id,
              event_id: d.guid,
              group_id: group_id,
              group_name: this.group_name,
              device_funciton: d.device_funciton,
              device_type: d.device_type,
              code: d.code,
              value: d.human_error_probability, //A类人误概率 ? TODO
              correction_value: "",
              stage: this.datas.length,
              stage_index: d.stage_index,
            });
          });
          typeACService.insertList(datas, "multi").then(() => {
            uni.showToast({
              title: "保存成功!",
              duration: 2000,
            });
            this.back();
          });
        } else {
          let group_name = this.$refs.compPage.formdata.group_name;
          typeACService.updateName(this.group_id, group_name).then(() => {
            uni.showToast({
              title: "保存成功!",
              duration: 2000,
            });
            this.back();
          });
        }
      });
    },
    validName() {
      let name =
        this.mode == "update"
          ? this.$refs.compPage.formdata.group_name
          : this.group_name;
      return new Promise((resolve, reject) => {
        if (this.type == "A类相关性") {
          typeACService
            .query({ group_name: name, stage_index: 1 })
            .then((datas) => {
              if (datas.length && datas[0].guid != this.guid) {
                uni.showToast({
                  title: "该分组名称已被使用,请修改分组名称!",
                  duration: 2000,
                  icon: "none",
                });
                reject();
              } else {
                resolve(datas);
              }
            });
        } else {
          resolve();
        }
      });
    },
    uploadFile() {
      uni.showToast({ title: "该功能暂未实现!", duration: 2000, icon: "none" });
    },
    toAddEvent() {
      let ids = [];
      this.datas.forEach((d) => ids.push(d.event_id || d.guid));
      uni.setStorageSync("currEvents", ids);
      uni.navigateTo({
        url: "/pages/hra/selectEvent?type=A",
      });
    },
    viewData(data) {
      if (this.mode == "update") {
        uni.navigateTo({
          url:
            "/pages/hra/viewTypeAC?type=AC&guid=" +
            data.guid +
            "&name=" +
            data.code,
        });
      }
    },
    onSelectEvents(events) {
      this.datas = events;
    },
    toCorrelation(data) {
      data.stage_index;
      let preData = this.datas.filter(
        (d) => d.stage_index == data.stage_index - 1
      )[0];
      uni.setStorageSync("related_datas", [preData, data]);
      uni.navigateTo({
        url: "/pages/hra/related",
      });
    },
    
  },
};
</script>

<style lang="scss" scoped >
.i-header {
  padding: 0 20px;
  height: 56px;
  line-height: 56px;
  border-bottom: 1px solid #f0f0f0;
  > .i-header-text {
    font-size: 16px;
    padding: 0 10px;
  }
  .icon.iconfont {
    color: #007aff;
    font-size: 20px;
    font-weight: bold;
  }
  .title {
    text-align: center;
    font-size: 18px;
    color: #666;
  }
}

.icon.iconfont {
  vertical-align: middle;
  font-size: 16px;
  color: #b2b2b2;
}
.row-item {
  border: 1px solid #f8f8f8;
  margin: 8px 10px 8px 10px;
  padding: 0px;
  line-height: 50px;
  height: 50px;
  position: relative;
}

.form-padding {
  padding: 0px 10px 10px 10px;
  flex-direction: column;
  flex-grow: 1;
  flex-wrap: wrap;
}

.uni-input {
  padding: 0 15px;
  font-size: 14px;
  height: 50px;
  color: #333;
  line-height: 50px;
  width: 200px;
}
.uni-input-label {
  font-size: 14px;
  padding: 0 10px;
  width: 100px;
  color: #333;
  background: #f8f8f8;
  &.label-warp {
    line-height: 20px;
  }
}
.i-list {
  padding-left: 20px;
}

.i-list-item {
  box-sizing: border-box;
  height: 72px;
  line-height: 25px;
  padding-right: 20px;
  border-bottom: 1px solid #f8f8f8;
  .icon.iconfont.item-icon {
    font-size: 26px;
    line-height: 46px;
    color: rgb(100, 196, 175);
    display: block;
    width: 46px;
    height: 46px;
    margin-top: 13px;
    background: #e8f6f3;
    text-align: center;
    border-radius: 24px;
  }
}

.list-item-content {
  font-size: 16px;
  color: #666;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  .icon.iconfont {
    font-size: 20px;
  }
}

.event-list {
  font-size: 16px;
  line-height: 40px;
  color: #666;
  border-bottom: 1px solid #f5f5f5;
  .add-event {
    display: inline-block;
    background: rgba(201, 220, 248, 0.829);
    color: #007aff;
    margin-bottom: 5px;
    padding: 0 20px;
    border-radius: 12px;
  }
}
.link-btn {
  margin-right: 50px;
  line-height: 70px;
  font-size: 14px;
  color: #007aff;
}
</style>
