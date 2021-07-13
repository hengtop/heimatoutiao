<template>
  <div class="comment-reply-container">
    <van-nav-bar
      class="reply-count"
      title="评论数量"
      @click-left="$emit('close-reply')"
    >
      <div slot="left">
        <van-icon name="cross" />
      </div>
    </van-nav-bar>
    <div class="reply-wrapper">
      <commentItem :comment="comment" />

      <!-- 评论的回复评论 -->
      <!-- 这里的articleId是评论id -->
      <commentList
        :articleId="comment.com_id"
        :list="newReplyComment"
        type="c"
      />
      <!-- 底部区域 -->
      <div class="article-bottom">
        <van-button
          @click="show = true"
          class="comment-btn"
          type="default"
          round
          size="small"
          >写评论</van-button
        >
      </div>
    </div>

    <!-- 发送评论弹出层 -->
    <van-popup position="bottom" class="pop" v-model="show">
      <sendComment
        :targetId="comment.com_id"
        :articleId="articleId"
        @send-success="handleSendSuccess"
      />
    </van-popup>
  </div>
</template>

<script type="text/ecmascript-6">
import { Button, Popup, NavBar, Icon } from "vant";
import commentItem from "./commentItem";
import commentList from "./commentList";
import sendComment from "./sendComment";
export default {
  name: "commentReply",
  props: {
    comment: {
      type: Object,
      reuqired: true,
    },
    articleId: {
      type: [String, Number, Object],
      required: true,
    },
  },
  data() {
    return {
      show: false, //发布回复输入框弹出
      newReplyComment: [], //新发送的评论
    };
  },
  created() {},
  mounted() {},
  methods: {
    //发布回复
    handleSendSuccess(replyComment) {
      //更新数据
      this.comment.reply_count++;
      this.newReplyComment.unshift(replyComment);
      //关闭弹窗
      this.show = false;
    },
  },
  components: {
    ["van-button"]: Button,
    ["van-popup"]: Popup,
    ["van-nav-bar"]: NavBar,
    ["van-icon"]: Icon,
    commentItem,
    commentList,
    sendComment,
  },
};
</script>

<style lang="less" scoped>
.comment-reply-container {
  padding: 0 10px 10px;
  height: 40vh;
  position: relative;
  .reply-count {
    text-align: center;
    font-size: 24px;
  }
  .reply-wrapper {
  }
  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 46px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 141px;
      height: 23px;
      border: 1px solid #eeeeee;
      font-size: 15px;
      line-height: 23px;
      color: #a7a7a7;
    }
  }
}
</style>
