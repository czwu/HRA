<template>
  <view class="comp-related-warp uni-grow" id="related_layout">
    <view class="related-flow">
      <view class="related-fields" v-if="relatedFields.length">
        <view
          class="r-field"
          v-for="field in relatedFields"
          v-bind:key="field.field"
          >{{ field.name }}</view
        >
      </view>
      <view
        class="layout-warp"
        v-if="relatedFlow"
        :style="{ height: relatedFlow.layout_height + 'px' }"
      >
        <!-- <view
          class="related-lines"
          :style="{ height: relatedFlow.layout_height + 'px' }"
        >
          <view class="vertical-lines">
            <view
              class="split-line"
              v-for="(line, key) in relatedFlow.vertical_lines"
              v-bind:key="key"
              :class="{
                last: key == relatedFlow.vertical_lines.length - 1,
              }"
            >
            </view>
          </view>
          <view
            class="horizontal-lines"
            :style="{ height: relatedFlow.layout_height + 'px' }"
          >
            <view
              class="split-line"
              v-for="(line, key) in relatedFlow.horizontal_lines"
              v-bind:key="key"
            >
            </view>
          </view>
        </view> -->
        <view
          class="related-values"
          :style="{ height: relatedFlow.layout_height + 30 + 'px',right:fix_right}"
        >
          <view
            class="related-value"
            v-for="(data, key) in related_values"
            v-bind:key="key"
            @click="relatedClick(data)"
            :class="{ selected: data.selected }"
          >
            {{ data.value }}
          </view>
        </view>

        <view
          class="related-option"
          v-for="(data, key) in related_options"
          v-bind:key="key + '_key'"
          @click="relatedClick(data)"
          :style="data.style"
          :class="{ last: data.isLast, selected: data.selected }"
        >
          {{ data.value }}
        </view>
        <view
          class="related-src"
          v-for="(data, key) in related_lines"
          v-bind:key="key + 'path2'"
          :style="data.style"
          :class="data.css"
        >
        </view>
        <view
          class="related-path"
          v-for="(data, key) in related_paths"
          v-bind:key="key + 'path'"
          :style="data.style"
          :class="data.css"
        >
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import util from "../../common/util";
import RelatedFlow from "../../common/relatedFlow";
export default {
  name: "compRelated",
  props: {
    service: {
      type: Object,
      default: () => {},
    },
    value: {
      type: Number,
    },
    fix_right: {
      type: String,
      default:'20px'
    }
  },
  data() {
    return {
      layoutWidth: 0,
      relatedFields: [],
      relatedFlow: null,
      related_values: [],
      related_options: [],
      related_paths: [],
      related_lines: [],
    };
  },
  mounted() {
    util.getElSize("#related_layout").then((data) => {
      this.layoutWidth = data.width;
      this.initFlow();
    });
  },
  watch: {
    service(service) {
      this.service = service;
      this.initFlow();
    },
  },

  created() {},
  methods: {
    relatedClick(data) {
      if (!data.selected) {
        this.relatedFlow.selected(data);
        this.related_paths = this.relatedFlow.related_paths;
        this.$emit("change", this.relatedFlow.data);
      }
    },
    initFlow() {
      this.relatedFields = this.service.getRelatedFields();
      let relatedFlow = new RelatedFlow(
        this.service.getRelatedTree(),
        this.service.getRelatedFields(),
        this.layoutWidth
      );
      this.related_values = relatedFlow.related_values;
      this.related_options = relatedFlow.related_options;
      this.relatedFlow = relatedFlow;
      this.related_paths = [];
      this.related_lines = relatedFlow.related_lines;
      if (this.value) {
        this.relatedFlow.selected(this.related_values[this.value - 1]);
        this.related_paths = this.relatedFlow.related_paths;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.comp-related-warp {
  position: relative;

  .layout-warp {
    width: 100%;
    position: relative;
    margin-top: 15px;
  }
  .related-fields {
    display: flex;
    flex-direction: row;
    height: 30px;
    line-height: 30px;
    padding-bottom: 10px;
    justify-content: space-around;
    .r-field {
      font-size: 12px;
      color: #444;
      // background: #eee;
      width: 110px;
      text-align: center;
    }
  }
  .related-lines {
    display: flex;
    flex-direction: row;
    .vertical-lines {
      // border: 1px solid red;
      flex-grow: 1;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      .split-line {
        width: 1px;
        background: #f8f8f8;
        border: 0;
        &.last {
          background: #fff;
        }
      }
    }
    .horizontal-lines {
      position: absolute;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .split-line {
        height: 1px;
        background: #f8f8f8;
        border: 0;
      }
    }
  }

  .related-values {
    position: absolute;
    top: -15px;
    right: 10px;
    width: 110px;
    z-index: 300;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    background: #fff;
    display: flex;
    .related-value {
      width:70px;
      text-align: left;
      padding-left: 30px;
      background: #fff;
      color: #999;
      font-size: 12px;
      line-height: 30px;
      border-radius: 15px;
      height: 30px;
      &.selected {
        background: #359dff;
        color: #fff;
      }
    }
  }

  .related-option {
    position: absolute;
    background: #eee;
    font-size: 12px;
    padding: 0px 15px;
    height: 24px;
    line-height: 24px;
    color: #666;
    transform: translate(-50%, -50%);
    z-index: 200;
    &.selected {
      background: rgb(223, 233, 250);
      color: #359dff;
      // &::before{
      //   content:'';
      //   width:7px;
      //   height:7px;
      //   background: #359dff;
      //   border-radius: 4px;
      //   position: absolute;
      //   top:9px;
      //   left:-6px;
      // }
    }
  }
  .related-src {
    z-index: 10;
    position: absolute;
    border: 0px;
    background: #eee;
    &.horizontal {
      height: 2px;
    }
    &.vertical {
      width: 2px;
    }
  }
  .related-path {
    z-index: 100;
    position: absolute;
    border: 0px;
    background: #359dff;
    &.horizontal {
      height: 2px;
    }
    &.vertical {
      width: 2px;
    }
  }
}
</style>
