<template>
  <div class="comment-list-container">
    <div class="comment-title">全部评论</div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <commentItem
        v-for="(item, index) in list"
        :key="index"
        :comment="item"
        @reply-popup-show="$emit('reply-popup-show', $event)"
      />
    </van-list>
  </div>
</template>

<script type="text/ecmascript-6">
import { List } from "vant";
import commentItem from "./commentItem";
import { getCommentsList } from "@/network/api/article";
export default {
  name: "commentList",
  props: {
    articleId: {
      type: [Object, Number, String],
      required: true,
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
     type:{
      type:String,
      default:"a"
    }
  },
  data() {
    return {
      loading: false,
      finished: false,
      offset: null, //获取下一页的页码
      limit: 10, //每页大小
    };
  },
  created() {},
  mounted() {},
  methods: {
    async onLoad() {
      //请求获取
      try {
        const {
          data: { data },
        } = await getCommentsList({
          type: this.type,
          source: this.articleId.toString(),
          offset: this.offset,
          limit: this.limit,
        });
        this.$emit("update-total-count", data.total_count);
        this.list.push(...data.results);
        //完成后将loading改为false
        this.loading = false;
        //判断是否还有数据，有就继续，没有就将finfished改为true
        if (data.results.length) {
          this.offset = data.last_id;
        } else {
          this.finished = true;
        }
      } catch (error) {}
    },
  },
  components: {
    ["van-list"]: List,
    commentItem,
  },
};
</script>

<style lang="less" scoped>
.comment-list-container {
  .comment-title {
    padding: 10px;
    font-size: 16px;
    color: #222;
    border-bottom: 1px solid #f2f2f2;
  }
  .pop {
  }
}
</style>
