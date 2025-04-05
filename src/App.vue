<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <el-menu
          :router="true"
          mode="horizontal"
          class="menu"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/course">课程评分</el-menu-item>
          <el-menu-item index="/food">外卖评分</el-menu-item>
          <el-menu-item index="/goods">生活用品评分</el-menu-item>
          
          <!-- 自定义分类菜单 -->
          <el-sub-menu index="custom" v-if="customTypes.length > 0">
            <template #title>自定义分类</template>
            <el-menu-item 
              v-for="type in customTypes" 
              :key="type"
              :index="`/custom?type=${type}`">
              {{ type }}
            </el-menu-item>
          </el-sub-menu>
          
          <el-menu-item index="/add-post">添加新评分对象</el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <div class="search-container" v-if="!isAddPostRoute">
          <el-input
            v-model="searchQuery"
            placeholder="搜索评分对象..."
            prefix-icon="el-icon-search"
            clearable
            @keyup.enter="performSearch"
          >
            <template #append>
              <el-button @click="performSearch">搜索</el-button>
            </template>
          </el-input>
        </div>
        
        <!-- 搜索结果 -->
        <div class="search-results" v-if="showSearchResults">
          <h2>搜索结果</h2>
          <el-button size="small" @click="clearSearch" style="margin-bottom: 10px">
            清除搜索
          </el-button>
          
          <el-empty description="未找到匹配结果" v-if="searchResults.length === 0"></el-empty>
          
          <el-card v-for="result in searchResults" :key="`${result.type}-${result.id}`" class="search-result-card">
            <div class="search-result-content">
              <div class="result-info">
                <h3>{{ result.name }}</h3>
                <p>分类：{{ result.type }}</p>
                <div class="rating-display">
                  <el-rate
                    v-model="result.avgRating"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value} 分"
                  ></el-rate>
                </div>
              </div>
              <div class="result-actions">
                <el-button 
                  type="primary" 
                  size="small" 
                  @click="goToDetail(result.type, result.id)">
                  查看详情
                </el-button>
              </div>
            </div>
          </el-card>
        </div>
        
        <router-view v-if="!showSearchResults" />
      </el-main>
      <el-footer>
        <p>校园评分系统 &copy; 2025</p>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import store from '@/store';

export default {
  name: 'App',
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      showSearchResults: false
    }
  },
  computed: {
    customTypes() {
      return Object.keys(store.state.posts).filter(type => 
        !['course', 'food', 'goods'].includes(type)
      );
    },
    isAddPostRoute() {
      return this.$route.path === '/add-post';
    }
  },
  methods: {
    performSearch() {
      if (!this.searchQuery.trim()) {
        this.showSearchResults = false;
        return;
      }
      
      const query = this.searchQuery.trim().toLowerCase();
      const results = [];
      
      // 遍历所有类型的帖子
      Object.entries(store.state.posts).forEach(([type, posts]) => {
        posts.forEach(post => {
          if (post.name.toLowerCase().includes(query)) {
            results.push({
              id: post.id,
              name: post.name,
              type: type,
              avgRating: post.avgRating
            });
          }
        });
      });
      
      this.searchResults = results;
      this.showSearchResults = true;
    },
    clearSearch() {
      this.searchQuery = '';
      this.showSearchResults = false;
    },
    goToDetail(type, id) {
      this.$router.push(`/detail/${type}/${id}`);
    }
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  min-height: 100vh;
}

.app-container {
  height: 100vh;
}

.el-container {
  height: 100%;
}

.el-header {
  padding: 0;
}

.menu {
  width: 100%;
}

.el-main {
  padding: 20px;
  background-color: #f5f7fa;
  overflow-y: auto;
}

.el-footer {
  text-align: center;
  background-color: #545c64;
  color: #fff;
  line-height: 60px;
}

.search-container {
  max-width: 600px;
  margin: 0 auto 20px;
}

.search-results {
  max-width: 800px;
  margin: 0 auto;
}

.search-result-card {
  margin-bottom: 15px;
}

.search-result-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-info {
  flex: 1;
}

.result-info h3 {
  margin-top: 0;
  margin-bottom: 5px;
}

.result-info p {
  color: #909399;
  margin-bottom: 5px;
}
</style>
