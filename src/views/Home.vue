<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="welcome-banner">
          <h1>欢迎使用校园评分系统</h1>
          <p>在这里，您可以查看和评价校园内的课程、外卖和生活用品</p>
          <div class="stats">
            <div class="stat-item">
              <span class="stat-value">帖子数：{{ categoriesCount }}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    
    <!-- 排序选择区域 -->
    <el-card class="sort-card">
      <div class="sort-header">
        <h2>分类排序</h2>
        <div class="sort-selector">
          <el-radio-group v-model="currentSort" @change="changeSortMethod">
            <el-radio-button label="newest">按时间排序</el-radio-button>
            <el-radio-button label="mostReviewed">按评论数排序</el-radio-button>
            <el-radio-button label="highestRated">按评分排序</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      
      <!-- 当选择按评分排序时显示的额外信息 -->
      <div v-if="currentSort === 'highestRated'" class="rating-info-banner">
        <el-alert
          title="评分说明"
          type="info"
          description="评分基于所有用户的评价计算得出，满分为5星（10分）。以下显示的是各分类的平均评分排名。"
          show-icon
          :closable="false"
        >
        </el-alert>
      </div>
      
      <!-- 排序结果展示 -->
      <div class="sort-results">
        <el-empty 
          v-if="sortedCategories.length === 0" 
          description="暂无数据"
        ></el-empty>
        
        <el-row :gutter="20" v-else>
          <el-col :xs="24" :sm="8" v-for="(category, index) in sortedCategories" :key="`${currentSort}-${category.type}`">
            <el-card class="category-card" shadow="hover" :class="{'high-rated': currentSort === 'highestRated' && index === 0}">
              <!-- 评分第一名标记 -->
              <div v-if="currentSort === 'highestRated' && index === 0" class="top-rated-badge">
                <el-tag type="danger" effect="dark">最高评分</el-tag>
              </div>
              
              <div class="category-title">{{ category.name || category.type }}</div>
              <div class="category-meta">
                <span class="post-count">{{ category.count }} 个对象</span>
                <span v-if="currentSort === 'newest'" class="category-time">{{ formatDate(category.createdAt) }}</span>
                <span v-if="currentSort === 'mostReviewed'" class="review-badge">
                  <el-badge :value="category.totalReviews" class="review-badge">
                    <i class="el-icon-chat-dot-square"></i>
                  </el-badge>
                </span>
                <span v-if="currentSort === 'highestRated'" class="rating-badge">
                  <el-tag :type="getRatingTagType(category.avgRating)">{{ category.avgRating.toFixed(1) }} 分</el-tag>
                </span>
              </div>
              
              <!-- 增强的评分展示（按评分排序时） -->
              <div class="category-rating" :class="{'enhanced': currentSort === 'highestRated'}">
                <el-rate 
                  v-model="category.avgRating" 
                  disabled 
                  show-score 
                  text-color="#ff9900"
                  score-template="{value} 分"
                ></el-rate>
                <span class="review-count">{{ category.totalReviews }} 条评价</span>
                
                <!-- 按评分排序时显示的额外评分细节 -->
                <div v-if="currentSort === 'highestRated'" class="rating-details">
                  <div class="rating-progress">
                    <span class="progress-label">用户满意度:</span>
                    <el-progress 
                      :percentage="calculateSatisfaction(category.avgRating)" 
                      :color="getSatisfactionColor(category.avgRating)"
                    ></el-progress>
                  </div>
                </div>
              </div>
              
              <div class="category-actions">
                <el-button type="primary" size="small" @click="viewCategoryDetail(category.type)">
                  查看详情
                </el-button>
                <el-button 
                  v-if="currentSort === 'highestRated'"
                  type="success" 
                  size="small" 
                  @click="viewRatingDetails(category.type)"
                >
                  评分分析
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import store from '@/store';

export default {
  name: 'HomeView',
  data() {
    return {
      currentSort: 'newest',
      sortedCategories: [],
      categoriesCount: 0
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      // 初始化时按最新排序
      this.changeSortMethod(this.currentSort);
      
      // 获取统计数据
      this.categoriesCount = store.getCategoriesCount();
    },
    changeSortMethod(sortMethod) {
      switch(sortMethod) {
        case 'newest':
          this.sortedCategories = store.getCategoriesByNewest(3);
          break;
        case 'mostReviewed':
          this.sortedCategories = store.getCategoriesByMostReviews(3);
          break;
        case 'highestRated':
          this.sortedCategories = store.getCategoriesByHighestRating(3);
          break;
        default:
          this.sortedCategories = store.getCategoriesByNewest(3);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    },
    viewCategoryDetail(type) {
      // 处理默认类别
      if (['course', 'food', 'goods'].includes(type)) {
        const routeMap = {
          'course': '/course',
          'food': '/food',
          'goods': '/goods'
        };
        this.$router.push(routeMap[type]);
      } else {
        // 处理自定义类别
        this.$router.push(`/custom?type=${type}`);
      }
    },
    // 计算用户满意度百分比（0-100）
    calculateSatisfaction(rating) {
      // 5分制转换为百分比
      return Math.min(100, Math.round((rating / 5) * 100));
    },
    // 根据评分获取满意度颜色
    getSatisfactionColor(rating) {
      if (rating >= 4) return '#67C23A'; // 高分绿色
      if (rating >= 3) return '#E6A23C'; // 中分黄色
      return '#F56C6C'; // 低分红色
    },
    // 根据评分获取标签类型
    getRatingTagType(rating) {
      if (rating >= 4) return 'success'; // 高分
      if (rating >= 3) return 'warning'; // 中分
      return 'danger'; // 低分
    },
    // 查看评分详细分析
    viewRatingDetails(type) {
      // 在实际应用中，这里可以跳转到一个详细分析页面
      // 现在简单使用消息提示
      this.$message({
        message: `${type} 的评分分析功能即将上线，敬请期待！`,
        type: 'info'
      });
    }
  }
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-banner {
  background-color: #ecf5ff;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 30px;
  text-align: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.welcome-banner h1 {
  color: #409EFF;
  margin-bottom: 10px;
}

.stats {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  margin: 0 20px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.sort-card {
  margin-bottom: 30px;
}

.sort-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #EBEEF5;
  padding-bottom: 10px;
}

.sort-header h2 {
  color: #303133;
  margin: 0;
}

.rating-info-banner {
  margin-bottom: 20px;
}

.sort-results {
  margin-top: 20px;
}

.category-card {
  height: 100%;
  margin-bottom: 20px;
  position: relative;
}

.high-rated {
  border: 1px solid #F56C6C;
  box-shadow: 0 0 8px rgba(245, 108, 108, 0.4);
}

.top-rated-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 1;
}

.category-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #303133;
}

.category-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #909399;
  font-size: 14px;
}

.category-rating {
  margin-bottom: 15px;
}

.category-rating.enhanced {
  padding: 10px;
  background-color: #f8f8f8;
  border-radius: 4px;
}

.review-count {
  margin-left: 10px;
  color: #909399;
  font-size: 12px;
}

.rating-details {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #E4E7ED;
}

.rating-progress {
  margin-top: 8px;
}

.progress-label {
  display: inline-block;
  width: 80px;
  font-size: 12px;
  color: #606266;
}

.category-actions {
  text-align: right;
  margin-top: 10px;
}

.rating-badge {
  font-weight: bold;
}

.review-badge {
  margin-left: 5px;
}
</style>