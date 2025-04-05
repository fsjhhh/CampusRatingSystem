<template>
  <div class="goods-page">
    <div class="page-header">
      <h1>生活用品评分</h1>
      <p>在这里查看和评价校园内的生活用品</p>
      <el-button type="primary" @click="showAddForm = true" class="add-button">
        <i class="el-icon-plus"></i> 添加新生活用品帖子
      </el-button>
    </div>
    
    <!-- 添加新生活用品表单 -->
    <el-dialog title="添加新生活用品帖子" v-model="showAddForm" width="500px">
      <el-form :model="newPost" :rules="rules" ref="addForm" label-width="100px">
        <el-form-item label="生活用品名称" prop="name">
          <el-input v-model="newPost.name" placeholder="请输入生活用品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">添加</el-button>
          <el-button @click="showAddForm = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    
    <post-list :posts="goods" type="goods" @refresh="loadGoods" />
    
    <div class="empty-state" v-if="goods.length === 0">
      <el-empty description="暂无生活用品数据" />
      <el-button type="primary" @click="showAddForm = true">添加新生活用品帖子</el-button>
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
      goods: [],
      showAddForm: false,
      newPost: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入生活用品名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.loadGoods();
  },
  methods: {
    loadGoods() {
      this.goods = store.getPostsByType('goods');
    },
    submitForm() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          // 添加新生活用品
          const result = store.addPost('goods', this.newPost.name);
          if (result.success) {
            this.$message.success('生活用品添加成功');
            this.showAddForm = false;
            this.newPost.name = '';
            this.loadGoods(); // 重新加载数据
          } else {
            this.$message.error(result.message);
          }
        } else {
          return false;
        }
      });
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