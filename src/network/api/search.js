import request from "../index"

//搜索联想
export const getSearchSuggestion = q => {
  return request({
    method:'get',
    url:'/app/v1_0/suggestion',
    params:{
      q //搜索关键词
    }
  })
}

//获取搜索结果
export const getSearchResult = params => {
  return request({
    method:'get',
    url:'/app/v1_0/search',
    params
  })
}

//获取搜索历史
export const getHistorysList = () => {
  return request({
    method:'get',
    url:'/app/v1_0/search/histories',
  })
}

//删除历史记录
export const deleteHistory = () => {
  return request({
    method:'delete',
    url:' /app/v1_0/search/histories'
  })
}