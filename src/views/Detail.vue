<template>
  <div class="detail-page">
    <div v-if="post" class="post-content">
      <div class="page-header">
        <h1>{{ post.name }}</h1>
        <div class="category-info">
          <el-tag :type="getCategoryType()">{{ getCategory() }}</el-tag>
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
            <el-rate 
              :model-value="post.avgRating" 
              disabled 
              :max="5"
              text-color="#ff9900"
            ></el-rate>
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
            <el-rate 
              v-model="reviewForm.rating" 
              :texts="ratingTexts" 
              show-text
              :max="5"
            ></el-rate>
          </el-form-item>
          <el-form-item label="评价内容" prop="content">
            <el-input 
              type="textarea" 
              v-model="reviewForm.content" 
              rows="4"
              placeholder="请输入您对这个帖子的评价..."
            ></el-input>
          </el-form-item>
          <el-form-item label="上传图片">
            <el-upload
              class="upload-demo"
              action="#"
              :auto-upload="false"
              :limit="3"
              :on-change="handleImageChange"
              :on-remove="handleImageRemove"
              :file-list="reviewForm.imageFiles"
              :http-request="handleUpload"
              list-type="picture-card">
              <i class="el-icon-plus"></i>
              <template #tip>
                <div class="el-upload__tip">
                  只能上传jpg/png文件，且不超过2MB
                </div>
              </template>
            </el-upload>
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
              <el-rate 
                :model-value="review.rating" 
                disabled 
                :max="5"
                text-color="#ff9900"
              ></el-rate>
              <span class="review-date">{{ formatDate(review.date) }}</span>
            </div>
            <div class="review-content">{{ review.comment }}</div>
            <!-- 显示评论图片 -->
            <div class="review-images" v-if="review.images && review.images.length > 0">
              <el-image 
                v-for="(image, imgIndex) in review.images" 
                :key="imgIndex"
                :src="image"
                :preview-src-list="review.images"
                fit="cover"
                class="review-image"
              ></el-image>
            </div>
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
        content: '',
        imageFiles: [], // 用于存储上传的图片文件列表
        images: []     // 用于存储转换后的base64图片数据
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
    // 处理自定义上传逻辑
    handleUpload(options) {
      // 这里不需要实际上传到服务器，只是模拟一个成功的响应
      if (options.file) {
        options.onSuccess && options.onSuccess();
      } else {
        options.onError && options.onError();
      }
    },
    // 处理图片更改事件
    handleImageChange(file) {
      // 验证文件类型和大小
      const isJPGOrPNG = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      
      if (!isJPGOrPNG) {
        this.$message.error('图片只能是JPG或PNG格式!');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过2MB!');
        return false;
      }
      
      // 将图片转换为base64格式
      const reader = new FileReader();
      reader.onload = (e) => {
        this.reviewForm.images.push(e.target.result);
      };
      reader.readAsDataURL(file.raw);
      
      return true;
    },
    // 处理图片移除事件
    handleImageRemove(file) {
      const index = this.reviewForm.imageFiles.findIndex(f => f.uid === file.uid);
      if (index !== -1) {
        this.reviewForm.imageFiles.splice(index, 1);
        this.reviewForm.images.splice(index, 1);
      }
    },
    submitReview() {
      this.$refs.reviewForm.validate((valid) => {
        if (!valid) return;

        const { type, id } = this.$route.params;
        store.addReview(
          type,
          parseInt(id),
          this.reviewForm.rating,
          this.reviewForm.content,
          '匿名用户', // 用户名
          this.reviewForm.images // 传递图片数据
        );

        this.reviewForm = {
          rating: 0,
          content: '',
          imageFiles: [],
          images: []
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
      // 随机返回一种标签颜色
      const colors = ['success', 'info', 'warning', 'danger', 'primary'];
      const randomIndex = Math.floor(Math.random() * colors.length);
      return colors[randomIndex];
    },
    getCategory() {
      const categoryNames = {
        'food': '食堂',
        'stores': '商品',
        'course': '课程'
      };
      
      // 如果是预定义的分类，直接返回对应的名称
      if (categoryNames[this.post.type]) {
        return categoryNames[this.post.type];
      }
      
      // 如果是自定义分类，从store中获取分类元数据的名称
      if (store.state.categoryMeta[this.post.type]) {
        return store.state.categoryMeta[this.post.type].name || this.post.type;
      }
      
      // 如果都没找到，返回原始类型名称而不是'未知分类'
      return this.post.type;
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

.review-images {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.review-image {
  width: 100px;
  height: 100px;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  object-fit: cover;
  cursor: pointer;
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