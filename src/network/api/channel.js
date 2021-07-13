

/* 
  频道列表相关
*/

import request from '@/network/index'

//获取所有的频道列表
export const getAllChannels = () => {
  return request({
    method:'get',
    url:'/app/v1_0/channels'
  });
}