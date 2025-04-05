<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="welcome-banner">
          <h1>欢迎使用校园评分系统</h1>
          <p>在这里，您可以查看和评价校园内的课程、外卖和生活用品</p>
        </div>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="category-cards">
      <el-col :xs="24" :sm="12" :md="8" v-for="category in categories" :key="category.path">
        <el-card class="category-card" :body-style="{ padding: '0px' }">
          <div class="category-image">
            <img :src="category.image" class="image" />
          </div>
          <div style="padding: 14px;">
            <h2>{{ category.name }}</h2>
            <p>{{ category.description }}</p>
            <div class="bottom">
              <el-button type="primary" @click="$router.push(category.path)">
                查看{{ category.name }}
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      categories: [
        {
          name: '课程评分',
          path: '/course',
          description: '查看和评价校内课程，帮助其他同学选择课程',
          image: 'https://via.placeholder.com/300x200?text=课程'
        },
        {
          name: '外卖评分',
          path: '/food',
          description: '校内外卖评价，找到最好吃的美食',
          image: 'https://via.placeholder.com/300x200?text=外卖'
        },
        {
          name: '生活用品评分',
          path: '/goods',
          description: '校园周边生活用品评价，方便生活',
          image: 'https://via.placeholder.com/300x200?text=生活用品'
        }
      ]
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

.category-cards {
  margin-bottom: 30px;
}

.category-card {
  margin-bottom: 20px;
  transition: all 0.3s;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
}

.category-image {
  text-align: center;
  background-color: #f5f7fa;
}

.image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.bottom {
  margin-top: 15px;
  text-align: center;
}
</style>