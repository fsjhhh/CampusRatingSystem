<template>
  <div class="detail-page">
    <div v-if="post" class="post-content">
      <div class="page-header">
        <h1>{{ post.name }}</h1>
        <div class="category-info">
          <el-tag :type="getCategoryType">{{ getCategory }}</el-tag>
        </div>
      </div>
      
      <el-card class="rating-card">
        <div class="rating-header">
          <h2>评分概览</h2>
          <span class="review-count">{{ post.reviews.length }} 条评价</span>
        </div>
        
        <div class="rating-summary">
          <div class="average-rating">
            <span class="rating-label">平均评分</span>
            <div class="rating-score">{{ post.avgRating.toFixed(1) }}</div>
            <el-rate v-model="post.avgRating" disabled></el-rate>
          </div>
        </div>
      </el-card>
      
      <!-- 添加评价区域 -->
      <el-card class="add-review-card">
        <div class="card-header">
          <h2>添加评价</h2>
        </div>
        
        <el-form :model="reviewForm" :rules="rules" ref="reviewForm" label-width="100px">
          <el-form-item label="评分" prop="rating">
            <el-rate v-model="reviewForm.rating" :texts="ratingTexts" show-text></el-rate>
          </el-form-item>
          <el-form-item label="评价内容" prop="content">
            <el-input 
              type="textarea" 
              v-model="reviewForm.content" 
              rows="4"
              placeholder="请输入您对这个帖子的评价..."
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitReview">提交评价</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      
      <!-- 评价列表 -->
      <el-card class="reviews-card" v-if="post.reviews.length > 0">
        <div class="card-header">
          <h2>全部评价</h2>
        </div>
        
        <div class="reviews-list">
          <div v-for="(review, index) in post.reviews" :key="index" class="review-item">
            <div class="review-header">
              <el-rate v-model="review.rating" disabled></el-rate>
              <span class="review-date">{{ formatDate(review.date) }}</span>
            </div>
            <div class="review-content">{{ review.content }}</div>
          </div>
        </div>
      </el-card>
      
      <el-card class="no-reviews-card" v-else>
        <el-empty description="暂无评价" />
        <div class="empty-action">
          <p>成为第一个评价者，分享您的意见！</p>
        </div>
      </el-card>
      
      <div class="page-actions">
        <el-button @click="goBack">返回</el-button>
      </div>
    </div>
    
    <div v-else class="not-found">
      <el-empty description="帖子不存在"></el-empty>
      <el-button @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import store from '@/store';

export default {
  name: 'DetailView',
  data() {
    return {
      post: null,
      reviewForm: {
        rating: 0,
        content: ''
      },
      rules: {
        rating: [
          { required: true, message: '请给帖子评分', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入评价内容', trigger: 'blur' }
        ]
      },
      ratingTexts: ['很差', '较差', '一般', '较好', '很好']
    }
  },
  created() {
    this.loadPost();
  },
  methods: {
    loadPost() {
      const { type, id } = this.$route.params;
      this.post = store.getPostById(type, parseInt(id));
    },
    goBack() {
      this.$router.back();
    },
    submitReview() {
      this.$refs.reviewForm.validate((valid) => {
        if (!valid) return;

        const { type, id } = this.$route.params;
        store.addReview(
          type,
          parseInt(id),
          this.reviewForm.rating,
          this.reviewForm.content
        );

        this.reviewForm = {
          rating: 0,
          content: ''
        };

        this.loadPost();
        this.$message.success('评价提交成功');
      });
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    },
    getCategoryType() {
      return this.post.category === '热门' ? 'success' : 'info';
    },
    getCategory() {
      return this.post.category || '未知分类';
    }
  }
}
</script>

<style scoped>
.detail-page {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.category-info {
  margin-left: 10px;
}

.rating-card {
  margin: 20px 0;
}

.rating-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rating-summary {
  margin-top: 15px;
}

.average-rating {
  display: flex;
  align-items: center;
}

.rating-label {
  margin-right: 10px;
}

.rating-score {
  font-size: 24px;
  font-weight: bold;
  margin-right: 10px;
}

.add-review-card {
  margin: 20px 0;
}

.card-header {
  margin-bottom: 10px;
}

.reviews-card {
  margin-top: 30px;
}

.reviews-list {
  margin-top: 10px;
}

.review-item {
  margin-bottom: 20px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.review-date {
  color: #909399;
}

.review-content {
  margin-top: 10px;
  white-space: pre-line;
  color: #606266;
}

.no-reviews-card {
  margin-top: 30px;
  text-align: center;
}

.empty-action {
  margin-top: 10px;
}

.page-actions {
  margin-top: 20px;
  text-align: center;
}
</style>