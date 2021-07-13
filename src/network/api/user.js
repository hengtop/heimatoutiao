//用户相关模块

import request from '../index'
//登录注册
export const login = data => {
  return request({
    method: 'post',
    url: '/app/v1_0/authorizations',
    data
  });
}

//发送短信验证码
export const sendSms = mobile => {
  return request({
    method: 'get',
    url: `/app/v1_0/sms/codes/${mobile}`
  });
}

//获取用户自己信息
export const getUserInfo = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/user'
  });
}

//获取用户频道列表
export const getUserChannels = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/user/channels'
  });
}

//修改用户频道列表，这里这个接口有问题
export const addUserChannels = (data) => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/channels',
    data
  })
}

//删除用户频道
export const deleteUserChannels = channelId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${channelId}`
  })
}

//关注用户
export const addFollow = userId => {
  return request({
    method: 'post',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

//取消关注
export const cancelFollow = userId => {
  return request({
    method: 'delete',
    url: `/app/v1_0/user/followings/${userId}`
  })
}

//文章收藏
export const addArticleCollect = articleId => {
  return request({
    method: 'post',
    url: '/app/v1_0/article/collections',
    data: {
      target: articleId
    }
  })
}


//取消文章收藏
export const cancelArticleCollect = articleId => {
  return request({
    method: 'delete',
    url: `/app/v1_0/article/collections/${articleId}`
  })
}

//文章点赞
export const addArticleLike = articleId => {
  return request({
    method: 'post',
    url: '/app/v1_0/article/likings',
    data: {
      target: articleId
    }
  })
}

//取消文章点赞
export const cancelArticleLike = articleId => {
  return request({
    method:'delete',
    url:`/app/v1_0/article/likings/${articleId}`
  })
}

//获取用户编辑数据

export const getUserEdit = () => {
  return request({
    method:'get',
    url:"/app/v1_0/user/profile"
  })
}

//修改用户个人资料
export const editUserProfile = data => {
  return request({
    method:'patch',
    url:'/app/v1_0/user/profile',
    data
  })
}

//修改用户照片资料
export const editUserPhoto = data => {
  return request({
    method:'patch',
    url:'/app/v1_0/user/photo',
    data
  })
}