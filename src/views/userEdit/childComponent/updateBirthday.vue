<template>
  <div class="update-birthday-container">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onConfirm"
      @cancel="$emit('close')"
    />
  </div>
</template>

<script type="text/ecmascript-6">
import { DatetimePicker } from "vant";
import { editUserProfile } from "@/network/api/user";
import { showToast } from "@/utils/toast";
export default {
  name: "updateBirthday",
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      minDate: new Date(1900, 0, 0),
      maxDate: new Date(2100, 11, 11),
      currentDate: new Date(this.value),
    };
  },
  created() {},
  mounted() {},
  methods: {
    async onConfirm(value) {
      const stringYear = `${value.getFullYear()}-${
        value.getMonth() + 1
      }-${value.getDate()}`;
      showToast({
        type: "loading",
        message: "保存中",
        forbidclick: true,
      });
      try {
        await editUserProfile({
          birthday: stringYear,
        });
        this.$emit("input", stringYear);
        showToast({
          message: "修改成功",
          duration: 1000,
        });
        this.$emit("close");
      } catch (error) {
        console.log(error);
      }
    },
  },
  components: {
    ["van-datetime-picker"]: DatetimePicker,
  },
};
</script>

<style lang="less" scoped>
</style>
