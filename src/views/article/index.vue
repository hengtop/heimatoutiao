<template>
  <div class="article-detail-container">
    <van-nav-bar
      :border="false"
      class="app-nav-bar"
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />
    <div class="content">
      <h1 class="title">{{ article.title }}</h1>
      <van-cell :border="false" center class="author">
        <div slot="title" class="user-nickname">
          <div>{{ article.aut_name }}</div>
          <div class="label">{{ article.pubdate | relativeTime }}</div>
        </div>
        <van-image class="avatar" slot="icon" round :src="article.aut_photo" />
        <van-button
          :icon="article.is_followed ? '' : 'plus'"
          :type="article.is_followed ? 'default' : 'info'"
          :loading="isFollowLoading"
          round
          size="small"
          @click="handleFollow"
          class="button"
          >{{ article.is_followed ? "已关注" : "关注" }}</van-button
        >
      </van-cell>
      <div
        class="main-text markdown-body"
        ref="article-content"
        v-html="article.content"
      ></div>
      <!-- 评论列表 -->
      <commentList
        :articleId="articleId"
        :list="newCommentsList"
        @update-total-count="totalComments = $event"
        @reply-popup-show="handleReplyShow"
      />
      <!-- 底部区域 -->
      <div class="article-bottom">
        <van-button
          @click="show = !show"
          class="comment-btn"
          type="default"
          round
          size="small"
          >写评论</van-button
        >
        <van-icon name="comment-o" :badge="totalComments" color="#777" />
        <van-icon
          :color="article.is_collected ? 'orange' : '#777'"
          :name="article.is_collected ? 'star' : 'star-o'"
          @click="handleCollect"
        />
        <van-icon
          :color="article.attitude === 1 ? '#3296fa ' : '#777'"
          :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
          @click="handleLike"
        />
        <van-icon name="share" color="#777777"></van-icon>
      </div>
      <!-- 底部弹出层 -->
      <van-popup position="bottom" class="pop" v-model="show">
        <sendComment :targetId="articleId" @send-success="handleSendSuccess" />
      </van-popup>
      <!-- 回复评论弹出层 -->
      <van-popup class="reply-pop" round position="bottom" v-model="replayShow"
        ><commentReply
          v-if="replayShow"
          :comment="replyComment"
          :articleId="articleId"
          @close-reply="replayShow = false"
      /></van-popup>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import "@/styles/github-markdown-css.css";
import {
  NavBar,
  Cell,
  Image as VanImage,
  Button,
  ImagePreview,
  Icon,
  Popup,
} from "vant";
import commentList from "./childComponent/commentList";
import sendComment from "./childComponent/sendComment";
import commentReply from "./childComponent/commentReply";
import { getArticlesDetail } from "@/network/api/article";
import {
  addFollow,
  cancelFollow,
  addArticleCollect,
  cancelArticleCollect,
  addArticleLike,
  cancelArticleLike,
} from "@/network/api/user";
import { showToast } from "@/utils/toast";
export default {
  name: "articleDetail",
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true,
    },
  },
  data() {
    return {
      article: {},
      isFollowLoading: false, //关注用户的加载状态
      isCollectLoading: false, //收藏
      show: false, //发送评论弹窗
      replayShow: false, //回复评论弹窗显示
      newCommentsList: [], //新添加评论
      totalComments: 0, //评论总数量
      replyComment: {}, //回复评论对象
    };
  },
  created() {
    this.loadArticle();
  },
  mounted() {},
  methods: {
    async loadArticle() {
      try {
        const {
          data: { data },
        } = await getArticlesDetail(this.articleId);
        this.article = data;
        this.handleImgPreview();
      } catch (error) {
        console.log(error);
      }
    },
    //处理图片预览功能
    handleImgPreview() {
      //获取文章内容dom，得到所有的image标签然后给所有的image注册点击事件
      const articleDOM = this.$refs["article-content"];
      //数据更新改变视图不是立即的
      this.$nextTick(() => {
        const imgs = articleDOM.querySelectorAll("img");
        const imgPath = [];
        imgs.forEach((img, index) => {
          imgPath.push(img.attributes["src"].value);
          img.addEventListener("click", () => {
            ImagePreview({
              images: imgPath,
              startPosition: index,
            });
          });
        });
      });
    },
    //用户关注处理
    async handleFollow() {
      this.isFollowLoading = true;
      if (this.article.is_followed) {
        await cancelFollow(this.article.aut_id);
        console.log("取消关注");
      } else {
        await addFollow(this.article.aut_id);
        console.log("关注用户");
      }
      this.article.is_followed = !this.article.is_followed;
      this.isFollowLoading = false; //关闭
    },
    //文章收藏处理
    async handleCollect() {
      showToast({
        type: "loading",
        message: "操作中",
        duration: 0,
      });
      try {
        if (this.article.is_collected) {
          await cancelArticleCollect(this.articleId);
        } else {
          await addArticleCollect(this.articleId);
        }
        this.article.is_collected = !this.article.is_collected;
        await showToast({
          message: this.article.is_collected ? "收藏成功" : "取消收藏",
          duration: 800,
        });
      } catch (error) {
        showToast({
          message: "收藏失败",
          duration: 800,
        });
      }
    },
    //文章点赞处理
    async handleLike() {
      showToast({
        type: "loading",
        message: "操作中",
        duration: 0,
      });
      if (this.article.attitude === 1) {
        await cancelArticleLike(this.articleId);
        this.article.attitude = -1; //表示无状态
      } else {
        await addArticleLike(this.articleId);
        this.article.attitude = 1; //表示喜欢
      }
      await showToast({
        message: this.article.attitude === 1 ? "感谢支持" : "取消点赞",
        duration: 800,
      });
    },
    //评论发送成功
    handleSendSuccess(comment) {
      //将评论列表放到顶部
      this.newCommentsList.unshift(comment);
      //更新评论总数
      this.totalComments++;
      this.show = false;
    },
    //处理回复评论弹窗
    handleReplyShow(commentItem) {
      //展示回复内容
      this.replayShow = true;
      //将回复评论传到回复评论弹窗中
      this.replyComment = commentItem;
    },
  },
  components: {
    ["van-nav-bar"]: NavBar,
    ["van-cell"]: Cell,
    ["van-image"]: VanImage,
    ["van-button"]: Button,
    ["van-icon"]: Icon,
    ["van-popup"]: Popup,
    commentList,
    sendComment,
    commentReply,
  },
};
</script>

<style lang="less" scoped>
.article-detail-container {
  .content {
    background-color: #fff;
    position: fixed;
    top: 46px;
    left: 0;
    right: 0;
    bottom: 46px;
    overflow-y: auto;
    .title {
      font-size: 22px;
      color: #3a3a3a;
      padding: 14px;
    }
    /deep/ .van-cell {
      line-height: unset;
    }
    .author {
      .user-nickname {
        font-size: 15px;
        padding-left: 10px;
        .label {
          font-size: 12px;
          color: #c1c1c1;
        }
      }
      .avatar {
        width: 35px;
        height: 35px;
      }
      .button {
        /deep/.van-button__content {
          padding: 0 10px;
        }
      }
    }
    .main-text {
      width: 100%;
      box-sizing: border-box;
      padding: 15px 20px;
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
      .van-icon {
        font-size: 20px;
        .van-info {
          font-size: 11px;
          background-color: #e22829;
        }
      }
    }
    .reply-pop {
    }
  }
}
</style>
