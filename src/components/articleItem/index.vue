<template>
  <div class="article-item-container">
    <van-cell
      :to="{
        name: 'article',
        params: { articleId: articleItem.art_id }
      }"
    >
      <div class="article-title van-multi-ellipsis--l2" slot="title">
        {{ articleItem.title }}
      </div>
      <div slot="label">
        <div class="bottom-cover" v-if="articleItem.cover.type === 3">
          <van-image
            v-for="(item, index) in articleItem.cover.images"
            :key="index"
            class="bottom-cover-item"
            fit="cover"
            :src="item"
          />
        </div>
        <div class="label-wrap">
          <div>
            <span>{{ articleItem.aut_name }}</span>
            <span>{{ articleItem.comm_count }}评论</span>
            <span>{{ articleItem.pubdate | relativeTime }}</span>
          </div>
          <div
            class="cancel-show toutiao toutiao-guanbi"
            @click="cancelShow"
          ></div>
        </div>
      </div>
      <!-- 默认插槽的名字default,这里要省略不然会占位置 -->
      <div class="right-cover" v-if="articleItem.cover.type === 1">
        <van-image
          class="right-cover-item"
          fit="cover"
          :src="articleItem.cover.images[0]"
        />
      </div>
    </van-cell>
  </div>
</template>

<script type="text/ecmascript-6">
import { Cell, Image as VanImage } from "vant";

export default {
  name: "articleItem",
  props: {
    articleItem: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  created() {
  },
  mounted() {},
  methods: {
    cancelShow() {
      console.log("关闭");
    },
  },
  components: {
    ["van-cell"]: Cell,
    ["van-image"]: VanImage,
  },
};
</script>

<style lang="less" scoped>
.article-item-container {
  position: relative;
  border-bottom: 1px solid #edeff4;
  .article-title {
    margin: 0 0 15px;
    font-size: 16px;
    color: #3a3a3a;
  }
  /deep/ .van-cell__value {
    flex: unset;
    width: 116px;
    height: 74px;
    margin-left: 12px;
  }
  .bottom-cover {
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    .bottom-cover-item {
      width: 111.66px;
      height: 74px;
    }
    :nth-child(2) {
      padding: 0 4px 0px;
    }
  }
  .label-wrap {
    font-size: 11.5px;
    color: #b4b4b4;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    span {
      margin-right: 12px;
    }
    .cancel-show {
      margin-right: 20px;
    }
    .toutiao {
      font-size: 9px;
    }
  }
  .right-cover {
    display: inline-block;
    .right-cover-item {
      width: 116px;
      height: 74px;
    }
  }
}
</style>
