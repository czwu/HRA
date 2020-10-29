<template>
  <view class="container" :class="screenOrientation">
    <uni-tab-bar :class="screenOrientation" index="0"></uni-tab-bar>
    <view class="uni-flex uni-column uni-grow">
      <view style="padding: 10px; text-align: left">
        <textarea
          auto-height
          :value="sql"
          @blur="bindTextAreaBlur"
          class="textarea flex-grow"
          placeholder="请输入需要执行的Sql语句"
        />
        <button type="primary" style="width: 100px; margin: 10px 0" @click="execute()">
          执行
        </button>
      </view>
      <view class="content-warp uni-flex uni-column">
        <view class="content uni-flex uni-column uni-grow">
          <text >结果集: 共{{rowTotal}}行数据</text>
          <text class="result">
            {{ sqlResult }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import util from "../../common/util";
import constants from "../../common/constants.js";
import taskService from "../../service/hra/task";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      sql: "Select * from TCatalog",
      sqlResult:"",
      rowTotal:0,
      sqlVal:""
    };
  },

  components: {},
  computed: {
    ...mapState({
      screenOrientation: "screenOrientation",
    }),
  },
  methods: {
    bindTextAreaBlur(e){
      this.sql = e.detail.value
    },
    execute() {
      console.log("queryOne ->  Sql:", this.sql);
      var that = this;
      var fn = this.sql.toLowerCase().trim().startsWith('select') ? 'selectSql' : 'executeSql'
      plus.sqlite[fn]({
        name: constants.db_name,
        sql: this.sql,
        success(datas) {
          that.rowTotal = Array.isArray(datas) ? datas.length : 1 ;
          that.sqlResult = JSON.stringify(datas, null, "\t")
        },
        fail(e) {
		  that.sqlResult = JSON.stringify(e.message, null, "\t")
          console.error(" Failed!", e);
        }
      });
    },
  },
};
</script>

<style  lang="scss" scope>
.textarea {
  background: #eee;
  width: 100%;
  min-height: 50px;
  padding: 10px;
}
.content {
  background: #eee;
  width: 100%;
  height: 100%;
  padding: 10px;
}
.content-warp {
  padding: 10px;
  flex-shrink: 0;
  min-height: 300px;
}
.uni-grow {
  flex-grow: 1;
}
.result{
  word-break:break-all
}
</style>
