<template>
  <div class="custom-page">
    <div v-if="type" class="page-content">
      <div class="page-header">
        <h1>{{ type }} 评分</h1>
        <p>在这里查看和评价自定义分类的帖子</p>
        <div class="header-actions">
          <el-button type="primary" @click="showAddForm = true" class="add-button">
            <i class="el-icon-plus"></i> 添加新{{ type }}帖子
          </el-button>
          <el-button type="danger" @click="confirmDeleteCategory" class="delete-button">
            <i class="el-icon-delete"></i> 删除整个分类
          </el-button>
        </div>
      </div>
      
      <!-- 添加新对象表单 -->
      <el-dialog :title="`添加新${type}帖子`" v-model="showAddForm" width="500px">
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
      
      <!-- 删除分类确认对话框 -->
      <el-dialog
        title="确认删除分类"
        v-model="deleteCategoryDialogVisible"
        width="30%">
        <span>确定要删除整个"{{ type }}"分类吗？该操作将删除该分类下的所有帖子和评价，且无法恢复。</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="deleteCategoryDialogVisible = false">取消</el-button>
            <el-button type="danger" @click="deleteCategory">确认删除</el-button>
          </span>
        </template>
      </el-dialog>
      
      <post-list :posts="posts" :type="type" @refresh="loadCustomPosts" />
      
      <div class="empty-state" v-if="posts.length === 0">
        <el-empty :description="`暂无${type}数据`" />
        <el-button type="primary" @click="showAddForm = true">添加新{{ type }}帖子</el-button>
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
      deleteCategoryDialogVisible: false,
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
          const result = store.addPost(this.type, this.newPost.name);
          if (result.success) {
            this.$message.success(`${this.type}添加成功`);
            this.showAddForm = false;
            this.newPost.name = '';
            this.loadCustomPosts(); // 重新加载数据
          } else {
            this.$message.error(result.message);
          }
        } else {
          return false;
        }
      });
    },
    confirmDeleteCategory() {
      this.deleteCategoryDialogVisible = true;
    },
    deleteCategory() {
      // 只允许删除自定义分类，默认分类不允许删除
      const result = store.deleteCategory(this.type);
      if (result) {
        this.$message.success(`分类"${this.type}"删除成功`);
        this.deleteCategoryDialogVisible = false;
        // 重定向到首页
        this.$router.push('/');
      } else {
        this.$message.error('无法删除默认分类');
        this.deleteCategoryDialogVisible = false;
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
  position: relative;
}

.page-header h1 {
  color: #409EFF;
  margin-bottom: 10px;
}

.header-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 15px;
}

.add-button, .delete-button {
  margin-top: 15px;
}

.empty-state {
  margin-top: 50px;
  text-align: center;
}
</style>