<template>
  <div class="custom-page">
    <div v-if="type" class="page-content">
      <div class="page-header">
        <h1>{{ type }} 评分</h1>
        <p>在这里查看和评价自定义分类的对象</p>
      </div>
      
      <post-list :posts="posts" :type="type" />
      
      <div class="empty-state" v-if="posts.length === 0">
        <el-empty :description="`暂无${type}数据`" />
        <el-button type="primary" @click="$router.push('/add-post')">添加新{{ type }}</el-button>
      </div>
    </div>
    
    <el-empty description="分类不存在" v-else></el-empty>
  </div>
</template>

<script>
import PostList from '@/components/post/PostList.vue';
import store from '@/store';

export default {
  name: 'CustomView',
  components: {
    PostList
  },
  data() {
    return {
      type: '',
      posts: []
    }
  },
  created() {
    this.loadCustomPosts();
  },
  watch: {
    // 监听路由变化，重新加载数据
    '$route.query.type': 'loadCustomPosts'
  },
  methods: {
    loadCustomPosts() {
      const type = this.$route.query.type;
      if (type && store.state.posts[type]) {
        this.type = type;
        this.posts = store.getPostsByType(type);
      } else {
        this.type = '';
        this.posts = [];
      }
    }
  }
}
</script>

<style scoped>
.custom-page {
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