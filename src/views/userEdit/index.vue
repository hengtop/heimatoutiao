<template>
  <div class="user-edit-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 信息单元格 -->
    <van-cell class="avatar-wrapper" title="头像" is-link center>
      <van-image class="avatar" round fit="cover" :src="userInfo.photo" />
    </van-cell>
    <input
      class="file-input"
      type="file"
      ref="file"
      accept="image/*"
      @change="chooseImge"
    />
    <van-cell
      title="昵称"
      is-link
      :value="userInfo.name"
      @click="showPopupName = true"
    />
    <van-cell
      title="性别"
      is-link
      :value="userInfo.gender === 0 ? '男' : '女'"
      @click="showPopupGender = true"
    />
    <van-cell
      title="生日"
      is-link
      :value="userInfo.birthday"
      @click="showPopupBirthday = true"
    />

    <van-popup
      class="pop-name"
      position="bottom"
      :style="{ height: '100%' }"
      v-model="showPopupName"
    >
      <!-- 
        v-model就是如下两段代码的简写
        @input="userInfo.name = $event"
        :value="userInfo.name"
        但是注意子组件props要改成value，$emit事件要声明成input
        多个数据的同时绑定就需要使用到 .sync修饰符 相当于
        @update:属性名="userInfo.name = $event"
        :属性名="userInfo.name"
       -->
      <updateName
        v-if="showPopupName"
        @close="showPopupName = false"
        v-model="userInfo.name"
    /></van-popup>
    <!-- 编辑性别 -->
    <van-popup position="bottom" v-model="showPopupGender">
      <updateGender
        v-if="showPopupGender"
        @close="showPopupGender = false"
        v-model="userInfo.gender"
      />
    </van-popup>
    <!-- 编辑生日 -->
    <van-popup position="bottom" v-model="showPopupBirthday">
      <updateBirthday
        v-if="showPopupBirthday"
        @close="showPopupBirthday = false"
        v-model="userInfo.birthday"
      />
    </van-popup>
    <!-- 编辑头像 -->
    <van-popup
      class="pop-avatar"
      position="bottom"
      :style="{ height: '100%' }"
      v-model="showPopupAvatar"
    >
      <updateAvatar
        v-if="showPopupAvatar"
        :file="previewImage"
        @update-image="userInfo.photo = $event"
        @close="showPopupAvatar = false"
      />
    </van-popup>
  </div>
</template>

<script type="text/ecmascript-6">
import { NavBar, Cell, Image as VanImage, Popup, Field, Button } from "vant";
import updateName from "./childComponent/updateName";
import updateGender from "./childComponent/updateGender";
import updateBirthday from "./childComponent/updateBirthday";
import updateAvatar from "./childComponent/updateAvatar";
import { getUserEdit } from "@/network/api/user";

export default {
  name: "userEdit",
  data() {
    return {
      userInfo: {},
      showPopupName: false, //弹出层修改name
      showPopupGender: false, //修改性别
      showPopupBirthday: false, //修改生日
      showPopupAvatar: false, //编辑头像
      previewImage: null, //上传预览图片
    };
  },
  created() {
    this.loadUserEdit();
  },
  mounted() {},
  methods: {
    //获取用户信息
    async loadUserEdit() {
      try {
        const {
          data: { data },
        } = await getUserEdit();
        this.userInfo = data;
      } catch (error) {
        console.log(error);
      }
    },
    chooseImge() {
      //返回文件对象
      const file = this.$refs.file.files[0];
      this.previewImage = file;
      this.showPopupAvatar = true;
      //解决选择相同的文件不触发本事件,手动清空file的value
      this.$refs.file.value = "";
    },
  },
  components: {
    ["van-nav-bar"]: NavBar,
    ["van-cell"]: Cell,
    ["van-image"]: VanImage,
    ["van-popup"]: Popup,
    ["van-button"]: Button,
    updateName,
    updateGender,
    updateBirthday,
    updateAvatar,
  },
};
</script>

<style lang="less" scoped>
.user-edit-container {
  position: relative;
  .file-input {
    z-index: 99;
    position: absolute;
    top: 46px;
    width: 100%;
    height: 57px;
    opacity: 0;
  }
  .avatar {
    width: 30px;
    height: 30px;
  }
  .pop-name {
    background-color: #f5f7f9;
  }
  .pop-avatar {
    background-color: #000;
  }
}
</style>
