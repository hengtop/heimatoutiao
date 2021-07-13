import { Dialog } from 'vant'

export const showDialog = (title, message) => {
  return new Promise((resolve, reject) => {
    Dialog.confirm({
      title,
      message,
      confirmButtonColor:'#55a8fb'
    })
      .then(() => {
        // on confirm
        resolve("确认");
      })
      .catch(() => {
        // on cancel
        reject("失败");
      });
  })
}