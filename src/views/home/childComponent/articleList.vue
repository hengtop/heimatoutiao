<template>
  <div class="article-list-container" ref="article-list">
    <van-pull-refresh
      v-model="isPullDownLoading"
      pulling-text="你拉住了未来"
      success-text="刷新成功~"
      success-duration="1000"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <articleItem
          v-for="(item, index) in list"
          :key="index"
          :articleItem="item"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script type="text/ecmascript-6">
import { List, Cell, PullRefresh } from "vant";
import articleItem from "@/components/articleItem";
import { getArticles } from "@/network/api/article";
import { showToast } from "@/utils/toast";
import { debounce } from "lodash";
export default {
  name: "articleList",
  props: {
    channelItem: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      list: [],
      loading: false, //是否在加载中
      finished: false, //是否完成整个数据列表的加载
      isTop: 1,
      timestamp: null, //获取下一页的时间戳
      isPullDownLoading: false, //下拉刷新
      articleScrollTop: 0, //滚动条高度
    };
  },
  created() {},
  mounted() {
    const articleList = this.$refs["article-list"];
    articleList.onscroll = debounce(() => {
      this.articleScrollTop = articleList.scrollTop;
    }, 50);
  },
  methods: {
    async onLoad() {
      console.log("第一次加载页面");
      //请求文章列表
      try {
        const {
          data: { data: articleLists },
        } = await getArticles({
          channel_id: this.channelItem.id, //频道id
          timestamp: this.timestamp || new Date().valueOf(), //时间戳，请求对应的推荐数据
          with_top: this.isTop,
        });
        console.log(articleLists);
        //数据放在数组中
        this.list.push(...articleLists.results);
        this.loading = false;
        //判断是否还有数据
        if (articleLists.results.length) {
          //有数据继续更新下一页的数据
          this.timestamp = articleLists.pre_timestamp; //保存下一页的时间戳，来请求下一页的数据
        } else {
          //没有数据就改变状态
          this.finished = true;
        }
      } catch (error) {
        console.log(error);
      }
    },
    //下拉刷新
    async onRefresh() {
      console.log("刷新");
      //处理请求，将数据往顶部追加
      try {
        const {
          data: { data: articleLists },
        } = await getArticles({
          channel_id: this.channelItem.id, //频道id
          timestamp: new Date().valueOf(), //时间戳，请求最新的推荐数据
          with_top: this.isTop,
        });
        this.list.unshift(...articleLists.results);
        this.isPullDownLoading = false;
        showToast({
          message: `更新了${articleLists.results.length}条新闻`,
          duration: 1000,
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
  activated() {
    this.$refs["article-list"].scrollTop = this.articleScrollTop;
  },
  components: {
    ["van-list"]: List,
    ["van-cell"]: Cell,
    ["van-pull-refresh"]: PullRefresh,
    articleItem,
  },
};
</script>

<style lang="less" scoped>
/* 固定定位中间滚动列表 */
.article-list-container {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 50px;
  top: 90px;
  overflow-y: auto;
}
</style>
