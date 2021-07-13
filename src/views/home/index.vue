<template>
  <div class="home-container">
    <van-nav-bar class="app-nav-bar">
      <van-button
        class="search-btn"
        slot="title"
        icon-prefix="toutiao"
        icon="sousuo"
        color="#5babfb"
        round
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- 文章频道列表 -->
    <!-- 该标签页组件有个功能，只有第一次查看才会渲染其中的内容 -->
    <van-tabs class="channel-tabs" v-model="channelActive">
      <van-tab v-for="item in channelsList" :title="item.name" :key="item.id">
        <articleList :channelItem="item" />
      </van-tab>
      <!-- 设置一个占位盒子，避免按钮挡住最后一个tab -->
      <div slot="nav-right" class="placeholder-box"></div>
      <div @click="popupShow" slot="nav-right" class="popup-btn">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>

    <!-- 文章频道列表,渲染到body节点下全局都可用 -->
    <van-popup
      v-model="channelEditShow"
      closeable
      round
      close-icon-position="top-left"
      get-container="body"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- 弹出层内容组件 -->
      <channelEdit
        :userChannelsList="channelsList"
        :channelActive="channelActive"
        @switchChannel="switchChannel"
        @updateAction="updateAction"
      />
    </van-popup>
  </div>
</template>

<script type="text/ecmascript-6">
import { NavBar, Button, Tab, Tabs, Popup } from "vant";
import articleList from "./childComponent/articleList";
import channelEdit from "./childComponent/channelEdit";
import { getUserChannels } from "@/network/api/user";
import { mapState } from "vuex";
import { getItem } from "@/utils/storage";
export default {
  name: "home",
  data() {
    return {
      channelActive: 0, //控制被激活的标签
      channelEditShow: false, //弹出层展示
      channelsList: [],
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  created() {
    this.loadChannels();
  },
  mounted() {},
  methods: {
    async loadChannels() {
      if (this.user) {
        //登录了，请求获取频道数据
        try {
          const {
            data: {
              data: { channels },
            },
          } = await getUserChannels();
          this.channelsList = channels;
        } catch (error) {
          console.log(error);
        }
      } else {
        //没有登录，判断本地缓存
        const localChannels = getItem("user-channels");
        if (localChannels) {
          this.channelsList = localChannels;
        } else {
          //没有就通过接口获取默认的频道数据
          try {
            const {
              data: {
                data: { channels },
              },
            } = await getUserChannels();
            this.channelsList = channels;
          } catch (error) {
            console.log(error);
          }
        }
      }
    },
    //打开弹窗
    popupShow() {
      this.channelEditShow = true;
    },
    //子组件传递切换频道索引
    switchChannel(index) {
      this.channelEditShow = false;
      this.channelActive = index;
    },
    //删除时更新选中的索引
    updateAction(index) {
      this.channelActive = index;
    },
  },
  components: {
    ["van-nav-bar"]: NavBar,
    ["van-button"]: Button,
    ["van-tab"]: Tab,
    ["van-tabs"]: Tabs,
    ["van-popup"]: Popup,
    articleList,
    channelEdit,
  },
};
</script>

<style lang="less" scoped>
.home-container {
  /deep/ .van-nav-bar__title {
    max-width: none;
  }
  .search-btn {
    width: 280px;
    height: 32px;
    border: none;
    .van-button__text {
      font-size: 14px;
    }
    .van-button__icon {
      font-size: 16px;
    }
  }
  .channel-tabs {
    /deep/ .van-tab {
      /*  border-right: 1px solid #edeff3; */
      border-bottom: 1px solid #edeff3;
    }
    /deep/ .van-tabs__line {
      width: 15px !important;
      height: 3px;
      background-color: #3296fa;
      margin-bottom: 4px;
    }
  }
  .placeholder-box {
    /* 不参与平分 */
    flex-shrink: 0;
    width: 33px;
    height: 43px;
  }
  .popup-btn {
    position: fixed;
    right: 0;
    width: 33px;
    height: 43px;
    line-height: 39px;
    text-align: center;
    background-color: white;
    opacity: 0.9;
    &::before {
      content: "";
      width: 1px;
      height: 29px;
      background: url("../../assets/img/line.png") no-repeat;
      background-size: contain;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      margin: auto 0;
    }
  }
}
</style>
