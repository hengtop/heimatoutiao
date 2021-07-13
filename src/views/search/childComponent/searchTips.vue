<template>
  <div class="search-tips-container">
    <van-cell-group>
      <van-cell @click="handleSearch(item)" v-for="(item, index) in tipsList" :key="index" icon="search">
        <div slot="title" v-html="hightLight(item)"></div>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script type="text/ecmascript-6">
import { Cell, CellGroup } from "vant";
import { getSearchSuggestion } from "@/network/api/search";
import { debounce } from "lodash";
export default {
  name: "searchTips",
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      tipsList: [], //提示字符串数组
    };
  },
  created() {},
  mounted() {},
  methods: {
    //获取搜索建议
    async getSearchTips() {
      try {
        const {
          data: {
            data: { options },
          },
        } = await getSearchSuggestion(this.searchText);
        this.tipsList = options;
      } catch (error) {
        console.log(error);
      }
    },
    //高亮关键词
    hightLight(item) {
      return item.replace(
        new RegExp(this.searchText, "gi"),
        `<span style="color: red">${this.searchText}</span>`
      );
    },
    //点击联想进入搜索
    handleSearch(searchText) {
      this.$emit('search', searchText);
    }
  },
  watch: {
    searchText: {
      //完整写法,仿抖处理
      handler: debounce(function () {
        this.getSearchTips();
      }, 300),
      immediate: true, //确保在侦听开始之前就调用，避免刚渲染组件导致第一次输入不会触发监听
    },
  },
  components: {
    ["van-cell-group"]: CellGroup,
    ["van-cell"]: Cell,
  },
};
</script>

<style lang="less" scoped>
</style>
