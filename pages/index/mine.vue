<template>
  <view class="container" :class="screenOrientation">
    <uni-tab-bar :class="screenOrientation" index="7"></uni-tab-bar>
    <view class="layout">
      <view class="uni-flex uni-column uni-grow">
        <view class="header"> 我的 </view>
        <view class="item" @click="toSelectProject">
          <text
            class="icon iconfont iconProjectselection"
            style="font-size: 20px"
          ></text>
          <text> 切换项目 </text>
        </view>
        <view class="item" @click="dataUpload">
          <text class="icon iconfont iconshujushangchuan"></text>
          <text> 数据上传</text>
        </view>
        <view class="item" @click="dataDownload">
          <text class="icon iconfont">&#xe687;</text> <text> 数据下载</text>
        </view>
        <view class="item" @click="setting"
          ><text class="icon iconfont iconshezhi"></text> <text> 设置</text>
        </view>
        <view class="item" @click="goSql()"
          ><text class="icon iconfont icontiaoshi"></text>
          <text> 本地数据库 (开发模式可用)</text>
        </view>
        <view class="item" @click="about"
          ><text class="icon iconfont iconguanyu"></text> <text> 关于</text>
        </view>
        <view class="item btn" @click="logout"> <text> 退出登录</text> </view>
      </view>
    </view>
  </view>
</template>

<script>
import util from "../../common/util";
import constants from "../../common/constants.js";
import datasync from "../../common/datasync.js";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {};
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
    dataUpload() {
      let acceptType='',callback=()=>{}
      function ip(obj) {
        plus.android.importClass(obj);
        return obj;
      }
      if (plus.os.name == "Android" && typeof callback == "function") {
        var CODE_REQUEST = 1000;
        var context = plus.android.runtimeMainActivity();
        ip(context);
        var Intent = plus.android.importClass("android.content.Intent");
        var intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        if (acceptType) {
          intent.setType(acceptType);
        } else {
          intent.setType("*/*");
        }
        context.onActivityResult = function (
          requestCode,
          resultCode,
          intentData
        ) {
          if (requestCode == CODE_REQUEST) {
            if (intentData) {
              var uriValue = intentData.getData();
              plus.android.importClass(uriValue);
              var scheme = uriValue.getScheme();
              if (scheme == "content") {
                //还需要进行数据库查询，一般图片数据
                var cursor = ip(context.getContentResolver()).query(
                  uriValue,
                  ["_data"],
                  null,
                  null,
                  null
                );
                if (cursor) {
                  ip(cursor).moveToFirst();
                  var columnIndex = cursor.getColumnIndex("_data");
                  picturePath = cursor.getString(columnIndex);
                  cursor.close();
                  callback(picturePath); //返回文件路径
                }
              } else if (scheme == "file") {
                callback(uriValue.getPath()); //返回文件路径
              }
            } else {
              callback(null);
            }
          }
        };
        context.startActivityForResult(intent, CODE_REQUEST);
      }
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
    color: #333;
  }
}
</style>
