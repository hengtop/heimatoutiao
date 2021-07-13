import Vue from 'vue'
import VueRouter from 'vue-router'
import { showDialog } from '@/utils/dialog'
import store from '@/store/index';
const Login = () => import('@/views/login/');
const Layout = () => import('@/views/layout/');
const Home = () => import('@/views/home/');
const QA = () => import('@/views/qa/');
const Video = () => import('@/views/videoPage/');
const Profile = () => import('@/views/profile/');
const search = () => import('@/views/search/');
const article = () => import('@/views/article/');
const userEdit = () => import('@/views/userEdit/');
const userChat = () => import('@/views/userChat/');
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      isToken: false
    }
  },
  {
    path: '/search',
    name: 'search',
    component: search
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: article,
    props: true
  },
  {
    path: '/user/edit',
    name: 'userEdit',
    component: userEdit,
    meta: {
      isToken: true
    }
  },
  {
    path: '/user/chat',
    name: 'userChat',
    component: userChat,
    meta: {
      isToken: true
    }
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',//默认子路由
        name: 'home',
        component: Home
      },
      {
        path: '/qa',
        name: 'qa',
        component: QA
      },
      {
        path: '/video',
        name: 'videoPage',
        component: Video
      },
      {
        path: 'profile',
        name: 'profile',
        component: Profile,
        meta: {
          isToken: false
        }
      }
    ]
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//路由守卫
router.beforeEach(async (to, from, next) => {
  //检查登陆情况
  if (to.meta.isToken && !store.state.user) {
    try {
      await showDialog("登录提示", "该内容需登录才能访问");
      router.replace({//跳转到登录页面
        name:'login',
        query:{
          redirect:router.currentRoute.fullPath//当前路由路径
        }
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    //不需要登陆的就直接放行
    next();
  }
})

export default router
