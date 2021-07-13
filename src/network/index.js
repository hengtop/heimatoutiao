import axios from 'axios';
import JSONbig from 'json-bigint';
import { showToast } from '@/utils/toast';
//这里在非组件中获取store中的数据，这里单独加载store，和在组件中使用this.$store 是一个意思
import store from '@/store/index';
import router from '@/router/index';

//专门用来请求token的
const refreshTokenRq = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',
})

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',
  transformResponse: [function (data) {
    // Do whatever you want to transform the data
    // console.log(data)

    // 后端返回的数据可能不是 JSON 格式字符串
    // 如果不是的话，那么 JSONbig.parse 调用就会报错
    // 所以我们使用 try-catch 来捕获异常，处理异常的发生
    try {
      // 如果转换成功，则直接把结果返回
      return JSONbig.parse(data)
    } catch (err) {
      console.log('转换失败', err)
      // 如果转换失败了，则进入这里
      // 我们在这里把数据原封不动的直接返回给请求使用
      return data
    }

    // axios 默认在内部使用 JSON.parse 来转换处理原始数据
    // return JSON.parse(data)
  }]
});
//请求拦截器
request.interceptors.request.use((config) => {
  const { user } = store.state;
  //如果有就统一添加headers信息
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  //处理之后要返回config
  return config;
}, (error) => {
  return Promise.reject(error);
});

//响应拦截器
request.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  //2xx状态码都会进入这里
  const status = error.response.status;
  if (status === 400) {
    //参数错误
    showToast({
      type: 'fail',
      message: '参数错误',
      duration: 1000
    });
  } else if (status === 401) {

    const { user } = store.state;
    if (!user || !user.token.trim()) {
      //处理token失效
      showToast({
        type: 'fail',
        message: '请重新登录',
        duration: 1000
      });
      store.commit('setUser', null);
      redirectLogin();
    } else {
      //刷新token
      try {
        const { data } = await refreshTokenRq({
          method: 'put',
          url: '/app/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${user.refresh_token}`
          }
        });
        console.log(data.data);
        user.token = data.data.token;
        store.commit('setUser', user);
        console.log(error.config);
        //获取请求参数重新发一次请求
        return request(error.config);
      } catch (error) {
        showToast({
          type: 'fail',
          message: '请重新登录',
          duration: 1000
        });
        store.commit('setUser', null);
        console.log("err");
        redirectLogin();

      }
    }
  } else if (status === 403) {
    //无权限
    showToast({
      type: 'fail',
      message: '没有权限',
      duration: 1000
    });
  } else if (status >= 500) {
    //服务端异常
    showToast({
      type: 'fail',
      message: '服务端异常  ',
      duration: 1000
    });
  }
  return Promise.reject(error);
})


function redirectLogin() {
  router.replace({
    name:'login',
    query:{
      redirect:router.currentRoute.fullPath//当前路由路径
    }
  });
}

export default request;