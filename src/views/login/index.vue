<template>
  <div class="login-container">
    <van-nav-bar
      class="app-nav-bar"
      title="登录/注册"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 只有表单验证通过才会调用submit -->
    <van-form
      @submit="onLogin"
      @failed="showFailed"
      ref="login-form"
      :show-error="false"
      :show-error-message="false"
      validate-first
    >
      <van-field
        v-model="user.mobile"
        icon-prefix="toutiao"
        left-icon="shouji"
        placeholder="请输入手机号"
        :rules="formRules.mobile"
        name="mobile"
      />
      <van-field
        v-model="user.code"
        clearable
        icon-prefix="toutiao"
        left-icon="yanzhengma"
        placeholder="请输入验证码"
        :rules="formRules.code"
        name="code"
      >
        <template #button>
          <van-button
            v-if="!isSend"
            class="send-btn"
            size="small"
            native-type="button"
            round
            :loading="sendSmsLoading"
            @click.prevent="sendCode"
            >发送验证码</van-button
          ><!-- 这里使用prevent字段禁止默认提交触发submit事件，但是点击一次后如果还在加载中再点击就会触发filed事件 -->
          <van-count-down
            v-else
            :time="1000 * 60"
            format="ss s"
            @finish="timeEnd"
          />
        </template>
      </van-field>
      <div class="login-btn-wrapper">
        <van-button class="login-btn" type="info" block>登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script type="text/ecmascript-6">
import { Button, NavBar, Field, Form, CountDown } from "vant";
import { login, sendSms } from "@/network/api/user";
import { showToast } from "@/utils/toast";
export default {
  name: "login",
  data() {
    return {
      user: {
        mobile: "13911111111",
        code: "246810",
      },
      formRules: {
        //正则匹配
        mobile: [
          { required: true, message: "请填写手机号" },
          { pattern: /^1[3-9][0-9]{9}$/, message: "手机号格式错误" },
        ],
        code: [
          { required: true, message: "请填写验证码" },
          { pattern: /^\d{6}$/, message: "验证码格式错误" },
        ],
      },
      isSend: false, //是否显示倒计时
      sendSmsLoading: false, //发送验证码后按钮显示文字
    };
  },
  created() {},
  mounted() {},
  methods: {
    //登录
    async onLogin() {
      showToast({
        type: "loading",
        message: "登录中",
        duration: 0,
      });
      try {
        const { data } = await login(this.user);
        showToast({
          type: "success",
          message: "登陆成功",
        });
        //将后端返回的用户数据放到容器中
        this.$store.commit("setUser", data.data);
        //清除页面缓存
        this.$store.commit('removeCachePage', 'layout');
        //跳转回上一个页面，或者首页
        this.$router.replace(this.$route.query.redirect || '/');
      } catch (error) {
        console.log(error);
        await showToast({
          type: "fail",
          message: "登陆失败",
        });
      }
    },
    //发送验证码
    async sendCode() {
      //发送前验证手机格式
      try {
        await this.$refs["login-form"].validate("mobile");
        //发送验证码
        this.sendSmsLoading = true; //显示验证码发送图标
        const res = await sendSms(this.user.mobile);
        console.log(res);
        this.isSend = true; //显示倒计时组件
      } catch (error) {
        let message = "";
        if (error && error.response && error.response.status === 429) {
          message = "发送太频繁了，请稍后重试";
        } else if (error.name === "mobile") {
          message = error.message;
        } else {
          //未知错误
          message = "发送失败，请稍后";
        }
        await showToast({
          message,
          duration: 1000,
          position: "top",
        });
      }
      this.sendSmsLoading = false; //关闭验证码发送图标
    },
    //验证失败的提示
    async showFailed(error) {
      console.log("只有登录按钮触发");
      if (error.errors[0]) {
        await showToast({
          message: error.errors[0].message,
          duration: 1000,
          position: "top",
        });
      }
    },
    //倒计时结束关闭倒计时组件，显示发送按钮
    timeEnd() {
      this.isSend = false;
    },
  },
  components: {
    ["van-nav-bar"]: NavBar,
    ["van-field"]: Field,
    ["van-button"]: Button,
    ["van-form"]: Form,
    ["van-count-down"]: CountDown,
  },
};
</script>

<style lang="less" scoped>
.login-container {
  .send-btn {
    width: 78px;
    height: 23px;
    background-color: #ededed;

    .van-button__text {
      color: #666;
      font-size: 11px;
    }
  }

  .login-btn-wrapper {
    padding: 26px 16px 0;
    margin: 0 auto;

    .login-btn {
      background-color: #6db4fb;
      border: none;

      .van-button__text {
        font-size: 15px;
      }
    }
  }
}
</style>
