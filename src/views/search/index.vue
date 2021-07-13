<template>
  <div class="search-container">
    <!-- 搜索框 -->
    <div class="search-wrapper">
      <!-- from作用可在手机输入法中显示搜索按钮 -->
      <form action="/">
        <van-search
          autofocus
          v-model="value"
          show-action
          shape="round"
          placeholder="请输入搜索关键词"
          @search="onSearch"
          @cancel="$router.back()"
          @input="showSearchTips"
          @focus="isSearch = false"
        />
      </form>
    </div>
    <!-- 联想框 -->
    <div v-if="!isSearch" class="suggestion-wrapper">
      <!-- 提示栏 -->
      <search-tips
        :searchText="value"
        @search="onSearch"
        v-if="isShowsearchTips"
      />
      <!-- 历史记录 -->
      <searchHistory :searchHistorysList="searchHistorysList" @searchHistory="onSearch" @deleteAll="deleteAllHistory" v-else />
    </div>
    <div v-else>
      <searchResult :searchText="value" />
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Search } from "vant";
import searchHistory from "./childComponent/searchHistory";
import searchTips from "./childComponent/searchTips";
import searchResult from "./childComponent/searchResult";
import { setItem, getItem } from "@/utils/storage";
import { getHistorysList } from "@/network/api/search";
import { uniq } from "lodash";
import { mapState } from "vuex";
export default {
  name: "search",
  data() {
    return {
      value: "",
      isSearch: false, //是否回车搜索
      isShowsearchTips: false, //显示历史记录/联想框
      searchHistorysList: [], //历史记录
    };
  },
  created() {
    this.getHistory();
  },
  mounted() {},
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    onSearch(searchText) {
      this.value = searchText;
      this.isSearch = true;
      //记录搜索历史数据
      const index = this.searchHistorysList.findIndex((item) => {
        return item.searchText === searchText;
      });
      if (index !== -1) {
        //有就删除掉
        this.searchHistorysList.splice(index, 1);
      }
      //添加到最前面去
      this.searchHistorysList.unshift(searchText);
      //数据持久化处理
      //登录存到线上，当然这里后端搜索时就已经存储好了
      //未登录就存到本地
      setItem("search-historys", this.searchHistorysList);
    },
    //输入事件
    showSearchTips() {
      if (this.value !== "") {
        this.isShowsearchTips = true;
      } else {
        this.isShowsearchTips = false;
      }
    },
    //获取历史
    async getHistory() {
      try {
        //线上历史记录太少，所以我们和本地历史合并下
        const localHistorys = getItem("search-historys") || [];
        /* if (this.user) {//登陆了就获取线上历史记录和本地合并，线上的接口只有全部删除的
          const {
            data: {
              data: { keywords },
            },
          } = await getHistorysList();
          this.searchHistorysList = uniq([...localHistorys, ...keywords]);
        } else */ {
          this.searchHistorysList = localHistorys;
        }
      } catch (error) {
        console.log(error);
      }
    },
    //删除所有历史记录
    deleteAllHistory() {
      this.searchHistorysList = [];
      setItem("search-historys", this.searchHistorysList);
    }
  },
  components: {
    ["van-search"]: Search,
    searchHistory,
    searchTips,
    searchResult,
  },
};
</script>

<style lang="less" scoped>
</style>
