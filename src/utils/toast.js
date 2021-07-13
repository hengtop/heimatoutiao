
import {Toast} from 'vant'
//封装toast组件
export const showToast = (options) => {
  return new Promise((resolve) => {
    Toast({
      forbidClick:true,
      ...options,
      onClose:() => {
        resolve()
      }
    });
  });
}