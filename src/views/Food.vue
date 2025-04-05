<template>
  <div class="food-page">
    <div class="page-header">
      <h1>外卖评分</h1>
      <p>在这里查看和评价校内外卖</p>
    </div>
    
    <post-list :posts="foods" type="food" />
    
    <div class="empty-state" v-if="foods.length === 0">
      <el-empty description="暂无外卖数据" />
      <el-button type="primary" @click="$router.push('/add-post')">添加新外卖</el-button>
    </div>
  </div>
</template>

<script>
import PostList from '@/components/post/PostList.vue';
import store from '@/store';

export default {
  name: 'FoodView',
  components: {
    PostList
  },
  data() {
    return {
      foods: []
    }
  },
  created() {
    this.loadFoods();
  },
  methods: {
    loadFoods() {
      this.foods = store.getPostsByType('food');
    }
  }
}
</script>

<style scoped>
.food-page {
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