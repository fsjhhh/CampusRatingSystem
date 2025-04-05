<template>
  <div class="food-page">
    <div class="page-header">
      <h1>外卖评分</h1>
      <p>在这里查看和评价校内外卖</p>
      <el-button type="primary" @click="showAddForm = true" class="add-button">
        <i class="el-icon-plus"></i> 添加新外卖
      </el-button>
    </div>
    
    <!-- 添加新外卖表单 -->
    <el-dialog title="添加新外卖" v-model="showAddForm" width="500px">
      <el-form :model="newPost" :rules="rules" ref="addForm" label-width="80px">
        <el-form-item label="外卖名称" prop="name">
          <el-input v-model="newPost.name" placeholder="请输入外卖名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">添加</el-button>
          <el-button @click="showAddForm = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    
    <post-list :posts="foods" type="food" />
    
    <div class="empty-state" v-if="foods.length === 0">
      <el-empty description="暂无外卖数据" />
      <el-button type="primary" @click="showAddForm = true">添加新外卖</el-button>
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
      foods: [],
      showAddForm: false,
      newPost: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入外卖名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.loadFoods();
  },
  methods: {
    loadFoods() {
      this.foods = store.getPostsByType('food');
    },
    submitForm() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          // 添加新外卖
          store.addPost('food', this.newPost.name);
          this.$message.success('外卖添加成功');
          this.showAddForm = false;
          this.newPost.name = '';
          this.loadFoods(); // 重新加载数据
        } else {
          return false;
        }
      });
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