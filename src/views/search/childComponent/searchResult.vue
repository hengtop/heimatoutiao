<template>
  <div class="search-result-container">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="item in list" :key="item.art_id" :title="item.title" />
    </van-list>
  </div>
</template>

<script type="text/ecmascript-6">
import { List, Cell } from "vant";
import { getSearchResult } from "@/network/api/search";
export default {
  name: "searchResult",
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 20,
    };
  },
  created() {},
  mounted() {},
  methods: {
    async onLoad() {
      //请求获取数据
      try {
        const {
          data: {
            data: { results },
          },
        } = await getSearchResult({
          page: this.page, //页码
          per_paget: this.per_page, //每页大小
          q: this.searchText, //搜索字符
        });
        console.log(results);
        //将数据放到数据列表中
        this.list.push(...results);
        //关闭本此的loading状态
        this.loading = false;
        //判断是否还有数据，有就更新下一页，如果没有数据了就将finish设置为true
        if (results.length) {
          this.page++;
        } else {
          this.finished = true;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  components: {
    ["van-list"]: List,
    ["van-cell"]: Cell,
  },
};
</script> 

<style lang="less" scoped>
.search-result-container {
  /deep/ .van-list {
    position: fixed;
    top: 54px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
  }
}
</style>
