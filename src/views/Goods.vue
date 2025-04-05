<template>
  <div class="goods-page">
    <div class="page-header">
      <h1>生活用品评分</h1>
      <p>在这里查看和评价校园内的生活用品</p>
    </div>
    
    <post-list :posts="goods" type="goods" />
    
    <div class="empty-state" v-if="goods.length === 0">
      <el-empty description="暂无生活用品数据" />
      <el-button type="primary" @click="$router.push('/add-post')">添加新生活用品</el-button>
    </div>
  </div>
</template>

<script>
import PostList from '@/components/post/PostList.vue';
import store from '@/store';

export default {
  name: 'GoodsView',
  components: {
    PostList
  },
  data() {
    return {
      goods: []
    }
  },
  created() {
    this.loadGoods();
  },
  methods: {
    loadGoods() {
      this.goods = store.getPostsByType('goods');
    }
  }
}
</script>

<style scoped>
.goods-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
  text-align: center;
}

.page-header h1 {
  color: #409EFF;
  margin-bottom: 10px;
}

.empty-state {
  margin-top: 50px;
  text-align: center;
}
</style>