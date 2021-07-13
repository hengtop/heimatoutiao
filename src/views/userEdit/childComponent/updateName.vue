<template>
  <div class="update-name-container">
    <van-nav-bar
      title="修改昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
    <van-field
      class="field"
      v-model="message"
      maxlength="7"
      placeholder="请输入昵称"
      show-word-limit
    />
  </div>
</template>

<script type="text/ecmascript-6">
import { NavBar, Field } from "vant";
import { editUserProfile } from "@/network/api/user";
import { showToast } from "@/utils/toast";
export default {
  name: "updateName",
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      message: this.value,
    };
  },
  created() {},
  mounted() {},
  methods: {
    async onConfirm() {
      showToast({
        type: "loading",
        message: "保存中",
        forbidclick: true,
      });
      //请求提交更新
      try {
        await editUserProfile({
          name: this.message,
        });
        this.$emit("input", this.message);
        showToast({
          message: "修改成功",
          duration: 1000,
        });
        this.$emit("close");
      } catch (err) {
        if (err && err.response && err.response.status === 409) {
          await showToast({
            type: "fail",
            message: "昵称已存在",
            duration: 1000,
          });
        }
      }
    },
  },
  components: {
    ["van-nav-bar"]: NavBar,
    ["van-field"]: Field,
  },
};
</script>

<style lang="less" scoped>
.update-name-container {
  .field {
    margin-top: 10px;
    /deep/.van-field__word-limit {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
</style>
