<template>
  <div class="detail-page">
    <div v-if="post" class="post-detail">
      <el-page-header @back="goBack" :content="post.name" />
      
      <el-card class="post-info-card">
        <h2>{{ post.name }}</h2>
        <div class="rating-info">
          <el-rate
            v-model="post.avgRating"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value} 分"
          ></el-rate>
          <span class="review-count">{{ post.reviews.length }} 条评价</span>
        </div>
      </el-card>
      
      <!-- 评分表单 -->
      <el-card class="rating-form-card" v-if="showRatingForm">
        <h3>添加评价</h3>
        <el-form :model="ratingForm" label-width="80px">
          <el-form-item label="您的评分">
            <el-rate
              v-model="ratingForm.rating"
              :max="5"
              show-score
              :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            ></el-rate>
          </el-form-item>
          <el-form-item label="您的昵称">
            <el-input v-model="ratingForm.username" placeholder="匿名"></el-input>
          </el-form-item>
          <el-form-item label="评价内容">
            <el-input
              type="textarea"
              v-model="ratingForm.comment"
              :rows="4"
              placeholder="请输入您的评价内容"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitRating">提交评价</el-button>
            <el-button @click="showRatingForm = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      
      <!-- 评论列表 -->
      <div class="reviews-section">
        <div class="reviews-header">
          <h3>用户评价 ({{ post.reviews.length }})</h3>
          <el-button type="primary" @click="showRatingForm = true" v-if="!showRatingForm">
            添加评价
          </el-button>
        </div>
        
        <el-empty description="暂无评价" v-if="post.reviews.length === 0"></el-empty>
        
        <el-timeline v-else>
          <el-timeline-item
            v-for="review in post.reviews"
            :key="review.id"
            :timestamp="formatDate(review.date)"
            placement="top"
          >
            <el-card>
              <div class="review-header">
                <span class="reviewer">{{ review.username || '匿名用户' }}</span>
                <el-rate
                  v-model="review.rating"
                  disabled
                  show-score
                  text-color="#ff9900"
                ></el-rate>
              </div>
              <div class="review-content">
                {{ review.comment }}
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
    
    <el-empty description="帖子不存在" v-else></el-empty>
  </div>
</template>

<script>
import store from '@/store';

export default {
  name: 'DetailView',
  data() {
    return {
      post: null,
      showRatingForm: false,
      ratingForm: {
        rating: 0,
        username: '',
        comment: ''
      }
    }
  },
  created() {
    this.loadPost();
    // 如果URL参数中有rate=true，自动显示评分表单
    if (this.$route.query.rate === 'true') {
      this.showRatingForm = true;
    }
  },
  methods: {
    loadPost() {
      const { type, id } = this.$route.params;
      this.post = store.getPostById(type, parseInt(id));
    },
    goBack() {
      this.$router.back();
    },
    submitRating() {
      if (this.ratingForm.rating === 0) {
        this.$message.warning('请先进行评分');
        return;
      }
      
      const { type, id } = this.$route.params;
      store.addReview(
        type,
        parseInt(id),
        this.ratingForm.rating,
        this.ratingForm.comment,
        this.ratingForm.username || '匿名用户'
      );
      
      // 重置表单
      this.ratingForm = {
        rating: 0,
        username: '',
        comment: ''
      };
      
      this.showRatingForm = false;
      this.loadPost(); // 重新加载帖子数据
      
      this.$message.success('评价提交成功');
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
  }
}
</script>

<style scoped>
.detail-page {
  max-width: 800px;
  margin: 0 auto;
}

.post-info-card {
  margin: 20px 0;
}

.rating-info {
  display: flex;
  align-items: center;
  margin-top: 15px;
}

.review-count {
  margin-left: 15px;
  color: #909399;
}

.rating-form-card {
  margin: 20px 0;
}

.reviews-section {
  margin-top: 30px;
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.reviewer {
  font-weight: bold;
  color: #409EFF;
}

.review-content {
  margin-top: 10px;
  white-space: pre-line;
  color: #606266;
}
</style>