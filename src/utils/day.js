import Vue from 'vue'
//初始化day.js相关配置
import dayjs from 'dayjs'

//配置使用中文语言包
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

//配置使用相对时间
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)


//使用vue的过滤器包装一个函数
 Vue.filter('relativeTime', value => {
  return dayjs(value).from(dayjs())
});

Vue.filter('dateTime', value => {
  return dayjs(value).format('YYYY-MM-DD HH:mm')
});


