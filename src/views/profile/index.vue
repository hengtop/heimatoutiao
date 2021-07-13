<template>
  <div class="profile-container">
    <div class="user-info">
      <div v-if="user">
        <div class="base-info">
          <van-cell-group class="background-none" :border="false">
            <van-cell class="background-none" center>
              <van-image
                class="avatar"
                slot="icon"
                round
                fit="cover"
                :src="userInfo.photo"
              />
              <div class="user-nickname" slot="title">{{ userInfo.name }}</div>
              <van-button class="update-btn" size="small" round to="/user/edit"
                >编辑资料</van-button
              >
            </van-cell>
          </van-cell-group>
        </div>
        <van-grid class="data-info" :border="false">
          <van-grid-item class="data-info-item" text="文字">
            <div class="text-wrap" slot="text">
              <div class="count">{{ userInfo.art_count }}</div>
              <div class="text">头条</div>
            </div>
          </van-grid-item>
          <van-grid-item class="data-info-item" text="文字">
            <div class="text-wrap" slot="text">
              <div class="count">{{ userInfo.follow_count }}</div>
              <div class="text">关注</div>
            </div>
          </van-grid-item>
          <van-grid-item class="data-info-item" text="文字">
            <div class="text-wrap" slot="text">
              <div class="count">{{ userInfo.fans_count }}</div>
              <div class="text">粉丝</div>
            </div>
          </van-grid-item>
          <van-grid-item class="data-info-item" text="文字">
            <div class="text-wrap" slot="text">
              <div class="count">{{ userInfo.like_count }}</div>
              <div class="text">获赞</div>
            </div>
          </van-grid-item>
        </van-grid>
      </div>
      <div v-else class="no-login">
        <van-image
          class="default-avatar"
          slot="icon"
          round
          fit="cover"
          :src="require('@/assets/img/avatar-nologin.png')"
          @click="
            $router.push({
              name: 'login',
              query: {
                redirect: '/profile',
              },
            })
          "
        />
        <div class="text">登录 / 注册</div>
      </div>
    </div>
    <van-grid class="nav-grid mb-5" :column-num="2" :border="false">
      <van-grid-item
        class="nav-grid-item"
        icon-prefix="toutiao"
        icon="shoucang"
        text="收藏"
      />
      <van-grid-item
        class="nav-grid-item"
        icon-prefix="toutiao"
        icon="lishi"
        text="历史"
      />
    </van-grid>
    <van-cell title="消息通知" is-link to="/" />
    <van-cell class="mb-5" title="小智同学" is-link to="/user/chat" />
    <van-cell
      v-if="user"
      class="logout-cell"
      title="退出登录"
      @click="onLogout"
    />
  </div>
</template>

<script type="text/ecmascript-6">
import {
  Cell,
  CellGroup,
  Image as VanImage,
  Button,
  Grid,
  GridItem,
} from "vant";
//映射到组件
import { mapState } from "vuex";
import { showDialog } from "@/utils/dialog";
import { getUserInfo } from "@/network/api/user";
export default {
  name: "profile",
  data() {
    return {
      userInfo: {},
    };
  },
  created() {
    if (this.user) {
      this.loadUserInfo();
    }
  },
  mounted() {},
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    //处理退出
    async onLogout() {
      try {
        const res = await showDialog("退出提示", "确定退出吗？");
        console.log(res);
        console.log("退出成功");
        //清除登录状态,响应式的会更新视图
        this.$store.commit("setUser", null);
      } catch (error) {
        console.log(error);
        console.log("取消退出");
      }
    },
    async loadUserInfo() {
      try {
        const {
          data: { data: userInfo },
        } = await getUserInfo();
        this.userInfo = userInfo;
        console.log(userInfo);
      } catch (error) {
        console.log(error);
      }
    },
  },
  components: {
    ["van-cell"]: Cell,
    ["van-cell-group"]: CellGroup,
    ["van-image"]: VanImage,
    ["van-button"]: Button,
    ["van-grid"]: Grid,
    ["van-grid-item"]: GridItem,
  },
};
</script>

<style lang="less" scoped>
.profile-container {
  .user-info {
    background: url("../../assets/img/banner.png") no-repeat;
    background-size: cover;
    /* 去除单元格默认背景颜色 */
    .background-none {
      background-color: unset;
    }
    /deep/ .van-grid-item__content {
      background-color: unset;
    }
    .base-info {
      box-sizing: border-box;
      padding: 38px 0px 12px;
      height: 115px;
      background-color: unset;
      .avatar {
        width: 66px;
        height: 66px;
        border: 1px solid #fff;
      }
      .user-nickname {
        margin-left: 12px;
        color: #fff;
        font-size: 15px;
      }
      .update-btn {
        height: 20px;
        font-size: 10px;
        color: #666;
      }
    }
    .data-info {
      height: 65px;
      padding: 5px 0;
      .data-info-item {
        height: 100%;
        color: #fff;
        .text-wrap {
          text-align: center;
          .count {
            font-size: 18px;
            font-family: Arial, Helvetica, sans-serif;
          }
          .text {
            font-size: 11.5px;
          }
        }
      }
    }
    .no-login {
      height: 180px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .default-avatar {
        width: 66px;
        height: 66px;
        border: 1px solid #fff;
      }
      .text {
        margin-top: 10px;
        font-size: 14px;
        color: #fff;
      }
    }
  }
  .nav-grid {
    height: 70px;
    .nav-grid-item {
      height: 100%;
      /deep/ .toutiao {
        font-size: 22px;
      }
      /deep/ .toutiao-shoucang {
        color: #eb5253;
      }
      /deep/ .toutiao-lishi {
        color: #ff9d1d;
      }
      /deep/ .van-grid-item__text {
        font-size: 14px;
        color: #333;
        letter-spacing: 8px;
        text-indent: 8px; /* 解决单独使用letter-spacing不居中问题 */
      }
    }
  }
  .logout-cell {
    text-align: center;
    font-size: 15px;
    color: #d86262;
  }
  .mb-5 {
    margin-bottom: 5px;
  }
}
</style>
