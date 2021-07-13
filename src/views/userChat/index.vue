<template>
  <div class="hello">
    <input id="inputArea" type="text">
    <button @click="sendMsgToServer">发送消息给服务端</button>
  </div>
</template>

<script>
import io from 'socket.io-client';
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods:{
    sendMsgToServer(){
      /*socket.emit('hello','xxx') 表示，服务端上定义了一个监听'hello'的socket，
      即服务端有代码
      socket.on('hello',(data) => {
        //这是接收到的客户端消息
        console.log(data);
      })
       */
      socket.emit('hello',document.getElementById("inputArea").value);
    }
  },
  created() {
    //一定要移除旧的message监听，否则会出现重复监听的状况
    socket.removeListener('message');
    //这是移除所有监听
    //socket.removeAllListeners();
    socket.on('message',(data) =>{
      console.log(data)
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
