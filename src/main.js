import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
//自动设置rem基准值（html标签字体大小）模块
import 'amfe-flexible'
// 加载全局样式（最好放到最后，方便去覆盖第三方样式）
import './styles/index.less'
//引入时间处理函数
import '@/utils/day'
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
