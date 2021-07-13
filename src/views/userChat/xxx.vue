/* <template> */
  <div class="user-chat-container">
    <van-nav-bar
      class="app-nav-bar"
      title="小智同学"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 消息列表 -->
    <van-cell-group class="message-list">
      <van-cell>hahahh</van-cell>
      <van-cell>hahahh</van-cell>
      <van-cell>hahahh</van-cell>
      <van-cell>hahahh</van-cell>
      <van-cell>hahahh</van-cell>
      <van-cell>hahahh</van-cell>
      <van-cell>hahahh</van-cell>
      <van-cell>hahahh</van-cell>
      <van-cell>hahahh</van-cell>
      <van-cell>hahahh</van-cell>
      <van-cell>hahahh</van-cell>
      <van-cell>hahahh</van-cell>

      <van-cell>hahahh</van-cell>
      <van-cell>hahahh</van-cell><van-cell>hahahh</van-cell
      ><van-cell>hahahh</van-cell><van-cell>hahahh</van-cell>
    </van-cell-group>
    <!-- 发送消息 -->
    <div class="send-wrapper">
      <van-cell-group>
        <van-field v-model="message" placeholder="发送消息" :border="false">
          <van-button slot="extra" size="small" type="info">发送</van-button>
        </van-field>
      </van-cell-group>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { NavBar, CellGroup, Cell, Field, Button } from "vant";
import io from 'socket.io-client';
//建立连接
const socket = io('http://ttapi.research.itcast.cn');
socket.on('connect', function() {
    console.log('连接建立成功');
})
export default {
  name: "userChat",
  data() {
    return {
      message: "",
    };
  },
  created() {},
  mounted() {},
  methods: {},
  components: {
    ["van-nav-bar"]: NavBar,
    ["van-cell-group"]: CellGroup,
    ["van-cell"]: Cell,
    ["van-field"]: Field,
    ["van-button"]: Button,
  },
};
</script>

<style lang="less" scoped>
.user-chat-container {
  position: relative;
  .message-list {
    position: fixed;
    left: 0;
    right: 0;
    top: 46px;
    bottom: 52px;
    overflow: auto;
  }
  .send-wrapper {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>
