/* 封装缓存使用的几个方法 */

export const getItem = (name) => {
  const data = window.localStorage.getItem(name);
  try {
    return JSON.parse(data)
  } catch (error) {
    //data不是json字符串，直接返回
    return data
  }

}

export const setItem = (name, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value);
  }
  window.localStorage.setItem(name, value);

}

export const removeItem = name => {
  window.localStorage.removeItem(name);
}