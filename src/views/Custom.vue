<template>
  <div class="custom-page">
    <div v-if="type" class="page-content">
      <div class="page-header">
        <h1>{{ type }} 评分</h1>
        <p>在这里查看和评价自定义分类的对象</p>
        <el-button type="primary" @click="showAddForm = true" class="add-button">
          <i class="el-icon-plus"></i> 添加新{{ type }}
        </el-button>
      </div>
      
      <!-- 添加新对象表单 -->
      <el-dialog :title="`添加新${type}`" v-model="showAddForm" width="500px">
        <el-form :model="newPost" :rules="rules" ref="addForm" label-width="100px">
          <el-form-item :label="`${type}名称`" prop="name">
            <el-input v-model="newPost.name" :placeholder="`请输入${type}名称`"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">添加</el-button>
            <el-button @click="showAddForm = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      
      <post-list :posts="posts" :type="type" />
      
      <div class="empty-state" v-if="posts.length === 0">
        <el-empty :description="`暂无${type}数据`" />
        <el-button type="primary" @click="showAddForm = true">添加新{{ type }}</el-button>
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
      posts: [],
      showAddForm: false,
      newPost: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
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
    },
    submitForm() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          // 添加新对象
          store.addPost(this.type, this.newPost.name);
          this.$message.success(`${this.type}添加成功`);
          this.showAddForm = false;
          this.newPost.name = '';
          this.loadCustomPosts(); // 重新加载数据
        } else {
          return false;
        }
      });
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
  position: relative;
}

.page-header h1 {
  color: #409EFF;
  margin-bottom: 10px;
}

.add-button {
  margin-top: 15px;
}

.empty-state {
  margin-top: 50px;
  text-align: center;
}
</style>