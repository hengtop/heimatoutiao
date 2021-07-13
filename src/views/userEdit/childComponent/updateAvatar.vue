<template>
  <div class="update-avatar-container">
    <img class="preview-avatar" :src="image" ref="image" />
    <van-nav-bar
      class="app-nav-bar"
      left-text="取消"
      right-text="确定"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
  </div>
</template>

<script type="text/ecmascript-6">
import { NavBar } from "vant";
import { editUserPhoto } from "@/network/api/user";
import { showToast } from "@/utils/toast";
//引入图片裁切库
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
export default {
  name: "updateAvatar",
  props: {
    file: {
      required: true,
    },
  },
  data() {
    return {
      image: URL.createObjectURL(this.file), //转换成Bolb url预览
      cropper:null//裁切器实例
    };
  },
  created() {},
  mounted() {
    this.cropperInit();
  },
  methods: {
    async onConfirm() {
      showToast({
        type: "loading",
        message: "上传中",
        forbidclick: true,
        duration:0
      });
      const file = await this.getCroppedCanvas();
      //如果要求content-type是multipart/form-data，
      //则一定要提交FormData数据对象，专门用于文件上传，不能提交{}
      const fd = new FormData();
      fd.append("photo", file);
      try {
        const {
          data: { data },
        } = await editUserPhoto(fd);
        this.$emit("update-image", data.photo);
        showToast({
          message: "修改成功",
          duration: 1000,
        });
        this.$emit("close");
      } catch (error) {
        console.log(error);
      }
    },
    //裁切库初始化
    cropperInit() {
      const image = this.$refs.image;
      this.cropper = new Cropper(image, {
        viewMode: 1,
        dragMode: "move",
        aspectRatio: 1,
        cropBoxMovable: false,
        cropBoxResizable: false,
        background: false,
        movable: true,
      });
    },
    //获取裁切图片
    getCroppedCanvas() {
      return new Promise((resolve) => {
        this.cropper.getCroppedCanvas().toBlob((blob) => {
          resolve(blob);
        });
      });
    }
  },
  components: {
    ["van-nav-bar"]: NavBar,
  },
};
</script>

<style lang="less" scoped>
.update-avatar-container {
  height: 100%;
  position: relative;
  .app-nav-bar {
    background-color: #000 !important;
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
  }
  .preview-avatar {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: block;
    max-width: 100%;
  }
}
</style>
