<template>
  <div class="channel-edit-container">
    <van-cell center :border="false" class="cell-wrap">
      <div slot="title" class="title">我的频道</div>
      <van-button
        type="danger"
        plain
        round
        size="mini"
        class="edit-btn"
        @click="onEdit"
        >{{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>
    <van-grid :gutter="12" :border="false" class="grid-wrap">
      <van-grid-item
        class="grid-wrap-item"
        :class="{ 'is-active': channelActive === index }"
        :icon="isEdit && index !== 0 ? 'clear' : ''"
        v-for="(item, index) in userChannelsList"
        :key="item.id"
        :text="item.name"
        @click="onUserChannel(item.id, index)"
      />
    </van-grid>
    <van-cell center :border="false" class="cell-wrap rec">
      <div slot="title" class="title">频道推荐</div>
    </van-cell>
    <van-grid :gutter="12" :border="false" class="grid-wrap">
      <van-grid-item
        class="grid-wrap-item"
        v-for="item in recChannelsList"
        :key="item.id"
        :text="item.name"
        @click="onAddChannel(item)"
      />
    </van-grid>
  </div>
</template>

<script type="text/ecmascript-6">
import { Cell, Button, Grid, GridItem } from "vant";
import { getAllChannels } from "@/network/api/channel";
import { addUserChannels, deleteUserChannels } from "@/network/api/user";
import { mapState } from "vuex";
import { setItem } from "@/utils/storage";
export default {
  name: "channelEdit",
  props: {
    userChannelsList: {
      //我的频道
      type: Array,
      required: true,
    },
    //当前选中的频道
    channelActive: {
      type: Number,
      default() {
        return 0;
      },
    },
  },
  data() {
    return {
      allChannelsList: [], //所有频道
      isEdit: false, //控制编辑按钮的显示状态
    };
  },
  computed: {
    ...mapState(["user"]),
    recChannelsList() {
      //所有频道减去我的频道
      return this.allChannelsList.filter((allChannelItem) => {
        return !this.userChannelsList.find(
          (userChannelItem) => userChannelItem.id === allChannelItem.id
        );
      });
    },
  },
  created() {
    this.getAllChannelsList();
  },
  mounted() {},
  methods: {
    //计算属性会观测内部依赖数据的变化而重新求值
    //获取所有频道处理得出推荐列表
    async getAllChannelsList() {
      try {
        const {
          data: {
            data: { channels },
          },
        } = await getAllChannels();
        this.allChannelsList.push(...channels);
      } catch (error) {
        console.log(error);
      }
    },
    //添加频道数据请求
    async addchannels(channels) {
      try {
        const res = await addUserChannels({
          channels: [
            {
              id: channels.id,
              seq: this.userChannelsList.length,
            },
          ],
        });
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
    //删除频道数据请求
    async deleteChannel(id) {
      try {
        const res = await deleteUserChannels(id);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
    //添加频道
    onAddChannel(item) {
      this.userChannelsList.push(item);
      //todo 数据持久化
      if (this.user) {
        //登录了，数据同步到后台
        this.addchannels(item);
      } else {
        //未登录就同步到本地
        setItem("user-channels", this.userChannelsList);
      }
    },
    //编辑按钮
    onEdit() {
      this.isEdit = !this.isEdit;
    },
    //我的频道点击事件
    onUserChannel(id, index) {
      //编辑状态时点击删除频道,推荐频道是不能删除的
      if (this.isEdit && index !== 0) {
        this.deleteUserChannel(id, index);
      } else {
        //非编辑状态点击就是切换到改频道展示页面
        this.switchChannel(index);
      }
    },
    //删除
    deleteUserChannel(id, index) {
      //如果删除的是高亮选择前的频道就需要将索引减一保证显示准确
      if (index <= this.channelActive) {
        this.$emit("updateAction", this.channelActive - 1);
      }
      this.userChannelsList.splice(index, 1);
      //数据持久化
      if (this.user) {
        //登录了，数据同步到后台
        this.deleteChannel(id);
      } else {
        //未登录就同步到本地
        setItem("user-channels", this.userChannelsList);
      }
    },
    //切换
    switchChannel(index) {
      this.$emit("switchChannel", index);
    },
  },
  components: {
    ["van-cell"]: Cell,
    ["van-button"]: Button,
    ["van-grid"]: Grid,
    ["van-grid-item"]: GridItem,
  },
};
</script>

<style lang="less" scoped>
.channel-edit-container {
  padding: 55px 16px 20px;
  .rec {
    margin-top: 30px;
  }
  .cell-wrap {
    margin-bottom: 9px;
    .title {
      font-size: 16px;
    }
    .edit-btn {
      border: 1px solid #f85a5a;
      .van-button__text {
        padding: 6.5px 10px;
      }
    }
  }
  .grid-wrap {
    .grid-wrap-item {
      /deep/ .van-grid-item__content {
        border-radius: 4px;
        background-color: #f4f5f6;
        padding: 12px 0px;
      }
      /deep/ .van-grid-item__icon + .van-grid-item__text {
        margin: 0;
      }
      //图标位置
      /deep/ .van-grid-item__icon {
        position: relative;
        &::before {
          position: absolute;
          top: -20px;
          right: -42px;
          font-size: 20px;
          color: #ccc;
        }
      }
    }
    //高亮选中的频道
    .is-active {
      /deep/ .van-grid-item__text {
        color: #3296fa !important;
      }
    }
  }
}
</style>
