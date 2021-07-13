import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem, removeItem } from '@/utils/storage'
Vue.use(Vuex);//挂载

const USER_KEY = 'user';

const store = new Vuex.Store({
  state: {
    user: getItem(USER_KEY),//当前登录用户的状态（token等数据）
    cachePages: ['layout']//解决缓存带来的数据不能及时更新
  },
  mutations: { 
    setUser(state, data) {
      state.user = data;
      //将数据放到本地存储中，仅仅为了持久化数据
      if(state.user === null) {
        removeItem(USER_KEY);
        return;
      }
      setItem(USER_KEY, state.user);
    },
     // 添加缓存页面
     addCachePage (state, pageName) {
      if (!state.cachePages.includes(pageName)) {
        state.cachePages.push(pageName)
      }
    },

    // 移除缓存页面
    removeCachePage (state, pageName) {
      const index = state.cachePages.indexOf(pageName)
      if (index !== -1) {
        state.cachePages.splice(index, 1)
      }
    }
  },
  actions: {

  }
});
export default store