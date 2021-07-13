<template>
  <div class="comment-item-container">
    <van-cell class="comment-item-wrapper">
      <div slot="title">
        <div class="title">
          <div class="name">{{ comment.aut_name }}</div>
          <div slot="default" class="like-wrapper">
            <van-icon class="icon" :name="isLike?'good-job':'good-job-o'" />
            <span class="like-num" @click="commentLike">{{comment.like_count}}</span>
          </div>
        </div>
        <div class="content">{{ comment.content }}</div>
        <div class="time-wrapper">
          <span class="time">{{ comment.pubdate | dateTime }}</span>
          <van-button round size="mini" class="respond-btn" @click="$emit('reply-popup-show', comment)">回复 {{comment.reply_count}}</van-button>
        </div>
      </div>
      <van-image
        slot="icon"
        round
        fit="cover"
        :src="comment.aut_photo"
        class="avatar"
      />
    </van-cell>
  </div>
</template>
<script type="text/ecmascript-6">
import { Cell, Image as VanImage, Button, Icon } from "vant";
export default {
  name: "commentItem",
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isLike:false
    };
  },
  created() {},
  mounted() {},
  methods: {
    commentLike() {
      this.isLike = !this.isLike;
    }
  },
  components: {
    ["van-cell"]: Cell,
    ["van-image"]: VanImage,
    ["van-button"]: Button,
    ["van-icon"]: Icon,
  },
};
</script>

<style lang="less" scoped>
.comment-item-container {
  margin-bottom: 10px;
  .comment-item-wrapper {
    padding: 10px 12.5px;
    .title {
      display: flex;
      justify-content: space-between;
      .name {
        font-size: 14px;
        color: #406599;
        padding-bottom: 16px;
      }
      .like-wrapper {
        flex: unset !important;
        .icon {
          vertical-align: text-top;
          padding-right: 3px;
        }
      }
    }
    .content {
      font-size: 16px;
      color: #222;
      padding-bottom: 14px;
    }
    .avatar {
      width: 36px;
      height: 36px;
      margin-right: 15px;
    }
    .time-wrapper {
      font-size: 12px;
      color: #222;
      display: flex;
      align-items: center;
      .time {
        padding-right: 12px;
      }
      .respond-btn {
        background-color: #f4f5f6;
        border: unset;
        /deep/ .van-button__content {
          padding: 0px 10px;
        }
      }
    }
  }
}
</style>
