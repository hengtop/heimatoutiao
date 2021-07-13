<template>
  <div class="update-gender-container">
    <van-picker
      title="标题"
      show-toolbar
      :default-index="defaultIndex"
      :columns="columns"
      @confirm="onConfirm"
      @cancel="$emit('close')"
    />
  </div>
</template>

<script type="text/ecmascript-6">
import { Picker } from "vant";
import { editUserProfile } from "@/network/api/user";
import { showToast } from "@/utils/toast";
export default {
  name: "updateGender",
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      columns: ["男", "女"],
      defaultIndex: this.value, //默认选中项
    };
  },
  created() {},
  mounted() {},
  methods: {
    async onConfirm(value, index) {
      showToast({
        type: "loading",
        message: "保存中",
        forbidclick: true,
      });
      try {
        await editUserProfile({
          gender: index,
        });
        this.$emit("input", index);
        showToast({
          message: "修改成功",
          duration: 1000,
        });
        this.$emit("close");
      } catch (error) {
        console.log(error);
      }
    }
  },
  components: {
    ["van-picker"]: Picker,
  },
};
</script>

<style lang="less" scoped>
</style>
