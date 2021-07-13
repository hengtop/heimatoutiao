import request from '../index'

//获取文章列表数据
export const getArticles = params => {
  return request({
    method: 'get',
    url: '/app/v1_1/articles',
    params
  });
}

//获取新闻详情
export const getArticlesDetail = article_id => {
  return request({
    method:'get',
    url:`/app/v1_0/articles/${article_id}`
  })
}

//获取文章评论列表和回复列表
export const getCommentsList = params => {
  return request({
    method:'get',
    url:'/app/v1_0/comments',
    params
  })
}

//发送评论
export const sendComment = data => {
  return request({
    method:'post',
    url:'/app/v1_0/comments',
    data
  })
}