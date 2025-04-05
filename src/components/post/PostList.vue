<template>
  <div class="post-list">
    <el-card class="post-card" v-for="post in posts" :key="post.id" shadow="hover">
      <div class="post-info">
        <h3>{{ post.name }}</h3>
        <div class="rating-display">
          <div class="stars">
            <el-rate
              v-model="post.avgRating"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value} 分"
            ></el-rate>
          </div>
          <div class="review-count">
            {{ post.reviews.length }} 条评价
          </div>
        </div>
      </div>
      <div class="buttons">
        <el-button type="primary" @click="viewDetails(post.id)">查看详情</el-button>
        <el-button type="success" @click="ratePost(post.id)">评价</el-button>
        <el-button type="danger" @click="confirmDelete(post.id)">删除</el-button>
      </div>
    </el-card>
    
    <!-- 删除确认对话框 -->
    <el-dialog
      title="确认删除"
      v-model="deleteDialogVisible"
      width="30%">
      <span>确定要删除这个评分对象吗？该操作将无法恢复。</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="deletePost">确认删除</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store';

export default {
  name: 'PostList',
  props: {
    posts: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      deleteDialogVisible: false,
      postIdToDelete: null
    }
  },
  methods: {
    viewDetails(id) {
      this.$router.push(`/detail/${this.type}/${id}`);
    },
    ratePost(id) {
      this.$router.push(`/detail/${this.type}/${id}?rate=true`);
    },
    confirmDelete(id) {
      this.postIdToDelete = id;
      this.deleteDialogVisible = true;
    },
    deletePost() {
      if (this.postIdToDelete) {
        const result = store.deletePost(this.type, this.postIdToDelete);
        if (result) {
          this.$message.success('删除成功');
          this.$emit('refresh'); // 通知父组件刷新数据
        } else {
          this.$message.error('删除失败');
        }
        this.deleteDialogVisible = false;
        this.postIdToDelete = null;
      }
    }
  }
}
</script>

<style scoped>
.post-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.post-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.post-info {
  margin-bottom: 15px;
}

.rating-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}

.review-count {
  color: #909399;
  font-size: 14px;
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  flex-wrap: wrap;
}

.buttons .el-button {
  margin-bottom: 5px;
}
</style>