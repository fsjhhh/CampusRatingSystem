<template>
  <div class="post-list">
    <div v-if="posts.length > 0">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="8" v-for="post in posts" :key="`${type}-${post.id}`">
          <el-card shadow="hover" class="post-card">
            <div class="post-title">{{ post.name }}</div>
            <div class="post-rating">
              <span class="rating-label">平均评分：</span>
              <el-rate 
                :model-value="post.avgRating" 
                disabled 
                size="default"
              ></el-rate>
              <span class="rating-value">{{ post.avgRating.toFixed(1) }}</span>
            </div>
            <div class="post-reviews">
              <span>{{ post.reviews.length }} 条评价</span>
            </div>
            <div class="post-actions">
              <el-button type="primary" size="small" @click="viewDetail(post.id)">查看详情</el-button>
              <el-button type="danger" size="small" @click="confirmDelete(post.id, post.name)">删除</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div v-else class="empty-message">
      <el-empty description="暂无帖子，请添加新的评分帖子"></el-empty>
    </div>

    <!-- 删除确认对话框 -->
    <el-dialog
      title="确认删除"
      v-model="deleteDialogVisible"
      width="30%">
      <span>确定要删除帖子"{{ postToDelete.name }}"吗？该操作无法恢复。</span>
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
      postToDelete: {
        id: null,
        name: ''
      }
    }
  },
  methods: {
    viewDetail(id) {
      this.$router.push(`/detail/${this.type}/${id}`);
    },
    confirmDelete(id, name) {
      this.postToDelete = {
        id,
        name
      };
      this.deleteDialogVisible = true;
    },
    deletePost() {
      const result = store.deletePost(this.type, this.postToDelete.id);
      if (result) {
        this.$message.success('帖子删除成功');
        this.deleteDialogVisible = false;
        this.$emit('refresh'); // 通知父组件刷新数据
      } else {
        this.$message.error('删除失败');
      }
    }
  }
}
</script>

<style scoped>
.post-list {
  margin-bottom: 30px;
}

.post-card {
  margin-bottom: 20px;
  height: 100%;
}

.post-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #303133;
}

.post-rating {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.rating-label {
  margin-right: 5px;
  color: #606266;
}

.rating-value {
  margin-left: 5px;
  color: #F56C6C;
  font-weight: bold;
}

.post-reviews {
  margin-bottom: 15px;
  color: #909399;
}

.post-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.empty-message {
  margin: 40px 0;
}
</style>