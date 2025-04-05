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
      </div>
    </el-card>
  </div>
</template>

<script>
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
  methods: {
    viewDetails(id) {
      this.$router.push(`/detail/${this.type}/${id}`);
    },
    ratePost(id) {
      this.$router.push(`/detail/${this.type}/${id}?rate=true`);
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
}
</style>