<template>
  <div v-if="searchHistorysList.length" class="history-container">
    <div class="title">
      <div>搜索历史</div>
      <div
        v-if="!isDelete"
        @click="isDelete = true"
        class="toutiao toutiao-shanchu"
      ></div>
      <div v-else class="delete-title">
        <span @click="deleteAll">全部删除</span
        ><span @click="isDelete = false">完成</span>
      </div>
    </div>
    <div class="history-wrapper">
      <van-grid :gutter="12" center class="grid-wrap" :column-num="5">
        <van-grid-item
          @click="handleDelete(index, item)"
          v-for="(item, index) in searchHistorysList"
          :key="index"
          :icon="isDelete ? 'clear' : ''"
          :text="item"
          class="grid-wrap-item"
        />
      </van-grid>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Grid, GridItem } from "vant";
import { setItem } from "@/utils/storage";
export default {
  name: "searchHistory",
  props: {
    searchHistorysList: {
      type: Array,
    },
  },
  data() {
    return {
      isDelete: false, //删除
    };
  },
  created() {},
  mounted() {},
  methods: {
    handleDelete(index, item) {
      if (this.isDelete) {
        this.searchHistorysList.splice(index, 1);
        //持久化处理,注意线上的接口只有全部删除的
        setItem("search-historys", this.searchHistorysList);
      } else {
        //非删除状态就跳转到搜索
        this.$emit("searchHistory", item);
      }
    },
    //删除所有记录，注意不能直接修改props
    deleteAll() {
      this.$emit("deleteAll");
    },
  },
  components: {
    ["van-grid"]: Grid,
    ["van-grid-item"]: GridItem,
  },
};
</script>

<style lang="less" scoped>
.history-container {
  box-sizing: border-box;
  padding: 15px;
  width: 100%;
  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .delete-title {
      color: #969799;
      font-size: 14px;
      span {
        margin: 0px 5px;
      }
    }
  }
  .grid-wrap {
    padding-left: unset !important;
    .grid-wrap-item {
      flex-basis: unset !important;
      position: relative;
      /deep/ .van-grid-item__content {
        border-radius: 10px;
        background-color: #fff;
        padding: 8px 10px;
      }
      /deep/ .van-grid-item__icon + .van-grid-item__text {
        margin: 0;
      }
      //图标位置
      /deep/ .van-grid-item__icon {
        position: absolute;
        right: 0px;
        &::before {
          position: absolute;
          top: -22px;
          right: -7px;
          font-size: 16px;
          color: #ccc;
        }
      }
    }
  }
}
</style>
