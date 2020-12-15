<template>
  <view class="container" :class="screenOrientation">
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
        <text class="back" @click="back">返回</text>
      </view>
    </view>
    <view class="table-layout uni-row uni-grow" v-show="tabIndex == 0">
      <view
        class="table-item"
        v-for="table in tables"
        v-bind:key="table.name"
        @click="selectTable(table)"
        :class="{ active: table.name == tableName }"
      >
        <text class="table-name">
          {{ table.name }}
        </text>
      </view>
    </view>

    <scroll-view class="scroll-view_H" scroll-x="true">
      <view class="" v-show="tabIndex == 0" :style="{ width: tableWidth }">
        <comp-table
          ref="compTable"
          v-if="tableService"
          :service="tableService"
          :param="{}"
          :_datas="datas"
          :btns="false"
        ></comp-table>
      </view>
    </scroll-view>

    <view class="uni-flex uni-column uni-grow" v-show="tabIndex == 1">
      <view style="padding: 10px; text-align: left">
        <textarea
          auto-height
          :value="sql"
          @blur="bindTextAreaBlur"
          class="textarea flex-grow"
          placeholder="请输入需要执行的Sql语句"
        />
        <button
          type="primary"
          style="width: 100px; margin: 10px 0"
          @click="execute()"
        >
          执行
        </button>
      </view>
      <view class="content-warp uni-flex uni-column">
        <view class="content uni-flex uni-column uni-grow">
          <text>结果集: 共{{ rowTotal }}行数据</text>
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
      sqlResult: "",
      rowTotal: 0,
      tableService: null,
      sqlVal: "",
      tabs: [
        { name: "数据表", index: 0 },
        { name: "自定义查询", index: 1 },
      ],
      tabIndex: 0,
      tables: [],
      datas: [],
      tableName: "",
      tableWidth: "1000px",
    };
  },

  components: {},
  computed: {
    ...mapState({
      screenOrientation: "screenOrientation",
    }),
  },
  onLoad() {
    this.getTables();
  },
  methods: {
    bindTextAreaBlur(e) {
      this.sql = e.detail.value;
    },
    execute() {
      console.log("queryOne ->  Sql:", this.sql);
      var that = this;
      var fn = this.sql.toLowerCase().trim().startsWith("select")
        ? "selectSql"
        : "executeSql";
      plus.sqlite[fn]({
        name: constants.db_name,
        sql: this.sql,
        success(datas) {
          that.rowTotal = Array.isArray(datas) ? datas.length : 1;
          that.sqlResult = JSON.stringify(datas, null, "\t");
        },
        fail(e) {
          that.sqlResult = JSON.stringify(e.message, null, "\t");
          console.error(" Failed!", e);
        },
      });
    },

    getTables() {
      var sql = "SELECt name FROM sqlite_master WHERE type='table'";
      this.selectSql(sql, (datas) => {
        this.tables = datas;
      });
      //
    },
    tabClick(tab) {
      this.tabIndex = tab.index;
    },
    selectTable({ name }) {
      var sql = "select * from " + name;
      this.tableName = name;

      this.selectSql(sql, (datas) => {
        this.datas = datas;
        var fields = [];
        if (this.datas.length) {
          for (let name in this.datas[0]) {
            fields.push({ name, field: name });
          }
        } else {
          fields.push({ name: "数据为空", field: "name", width: "150px" });
        }
        this.tableWidth = fields.length * 150 + "px";
        this.tableService = {
          getTableItems() {
            return fields;
          },
          query() {},
        };
      });
    },
    selectSql(sql, success, fail) {
      plus.sqlite.selectSql({
        name: constants.db_name,
        sql: sql,
        success(e) {
          success(e);
        },
        fail(e) {
          fail(e);
        },
      });
    },
    back() {
      uni.navigateBack();
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
  box-sizing: border-box;
}
.content {
  background: #eee;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 10px;
}
.content-warp {
  box-sizing: border-box;
  padding: 10px;
  flex-shrink: 0;
  min-height: 300px;
}
.uni-grow {
  flex-grow: 1;
}
.result {
  word-break: break-all;
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
.table-layout {
  padding: 15px;
  height: auto;
  flex-direction: row;
  flex-wrap: wrap;
  .table-item {
    margin: 0 10px 10px 0;
    color: rgb(107, 106, 116);
    font-weight: bold;
    padding: 5px 20px;
    border-radius: 6px;
    background: rgba(181, 184, 204, 0.5);
    &.active {
      background: #359dff;
      color: #fff;
    }
  }
}
text.back {
  color: #359dff;
  margin-left: 300px;
  font-size: 16px;
}
</style>
