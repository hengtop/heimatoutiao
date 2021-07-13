<template>
  <div class="send-comment-container">
    <van-field
      v-model="message"
      rows="3"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入评论"
      show-word-limit
    >
      <div class="right-title" slot="extra">
        <van-button @click="handleComment" type="info" size="small">发送</van-button>
      </div>
    </van-field>
  </div>
</template>

<script type="text/ecmascript-6">
import { Field, Button } from "vant";
import { sendComment } from "@/network/api/article";
import { showToast } from "@/utils/toast";
export default {
  name: "sendComment",
  props: {
    targetId: {
      //文章id，或者评论id，当回复的是文章时就传文章id，回复评论就是评论id
      type: [String, Number, Object],
      required: true,
    },
    articleId: {
      //文章id，当回复的是文章就是null
      type: [Number, String, Object],
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      message: "", //评论字数
      art_id: null, //文章id
    };
  },
  created() {},
  mounted() {},
  methods: {
    //发评论

    async handleComment() {
      if(!this.message) {
        await showToast({
          message:'发送内容不能为空哦'
        });
        return;
      }
      showToast({
        type: "loading",
        message: "发布中",
        duration: 0,
      });
      try {
        const {
          data: {
            data: { new_obj: newComment },
          },
        } = await sendComment({
          target: this.targetId.toString(),
          content: this.message,
          art_id: this.articleId === null ? null : this.articleId.toString(),
        });
        //关闭输入框
        this.$emit("send-success", newComment);
        this.message = ""; //清空输入框
        await showToast({
          message: "发布成功",
          duration: 1000,
        });
      } catch (error) {
        await showToast({
          message: "发布失败",
          duration: 1000,
        });
        console.log(error);
      }
    },
  },
  components: {
    ["van-field"]: Field,
    ["van-button"]: Button,
  },
};
</script>

<style lang="less" scoped>
/deep/ .van-field__value {
  border-radius: 5px;
  border: 1px solid #f2f3f4;
  padding: 5px;
}
.right-title {
  margin-left: 10px;
  display: flex;
  align-items: center;
  color: #3296fa;
}
</style>
