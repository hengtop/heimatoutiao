<template>
  <div id="app">
    <!-- 子路由出口 -->
    <keep-alive :include="cachePages">
      <router-view />
    </keep-alive>

    <!-- 底部导航栏 -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: "App",
  computed: {
    ...mapState(['cachePages'])
  }
};
</script>


<style lang="less">
</style>