<template>
  <div class="course-page">
    <div class="page-header">
      <h1>课程评分</h1>
      <p>在这里查看和评价校内课程</p>
    </div>
    
    <post-list :posts="courses" type="course" />
    
    <div class="empty-state" v-if="courses.length === 0">
      <el-empty description="暂无课程数据" />
      <el-button type="primary" @click="$router.push('/add-post')">添加新课程</el-button>
    </div>
  </div>
</template>

<script>
import PostList from '@/components/post/PostList.vue';
import store from '@/store';

export default {
  name: 'CourseView',
  components: {
    PostList
  },
  data() {
    return {
      courses: []
    }
  },
  created() {
    this.loadCourses();
  },
  methods: {
    loadCourses() {
      this.courses = store.getPostsByType('course');
    }
  }
}
</script>

<style scoped>
.course-page {
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