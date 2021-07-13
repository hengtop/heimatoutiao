<template>
  <div class="layout-container">
    <keep-alive>
      <router-view />
    </keep-alive>
    <van-tabbar route>
      <van-tabbar-item replace to="/" icon-prefix="toutiao" icon="shouye"
        >首页</van-tabbar-item
      >
      <van-tabbar-item replace to="/qa" icon-prefix="toutiao" icon="wenda"
        >问答</van-tabbar-item
      >
      <van-tabbar-item replace to="/video" icon-prefix="toutiao" icon="shipin"
        >视频</van-tabbar-item
      >
      <van-tabbar-item replace to="/profile" icon-prefix="toutiao" icon="wode"
        >我的</van-tabbar-item
      >
    </van-tabbar>
  </div>
</template>

<script type="text/ecmascript-6">
import { Tabbar, TabbarItem } from "vant";

export default {
  name: "layout",
  data() {
    return {};
  },
  created() {},
  mounted() {
    this.$store.commit("addCachePage", "layout");
  },
  methods: {},
  components: {
    ["van-tabbar"]: Tabbar,
    ["van-tabbar-item"]: TabbarItem,
  },
};
</script>

<style lang="less" scoped>
</style>