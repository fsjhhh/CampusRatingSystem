import { reactive } from 'vue'

// 初始数据
const initialPosts = {
  course: [
    { id: 1, name: '语文', avgRating: 0, reviews: [] },
    { id: 2, name: '数学', avgRating: 0, reviews: [] },
    { id: 3, name: '英语', avgRating: 0, reviews: [] }
  ],
  food: [
    { id: 1, name: '食堂一楼', avgRating: 0, reviews: [] },
    { id: 2, name: '食堂二楼', avgRating: 0, reviews: [] },
    { id: 3, name: '校外外卖', avgRating: 0, reviews: [] }
  ],
  goods: [
    { id: 1, name: '文具店', avgRating: 0, reviews: [] },
    { id: 2, name: '超市', avgRating: 0, reviews: [] },
    { id: 3, name: '日用品店', avgRating: 0, reviews: [] }
  ]
}

// 从本地存储加载数据或使用初始数据
const loadData = () => {
  const savedData = localStorage.getItem('campusRating')
  return savedData ? JSON.parse(savedData) : initialPosts
}

// 创建响应式状态
const state = reactive({
  posts: loadData()
})

// 保存数据到本地存储
const saveData = () => {
  localStorage.setItem('campusRating', JSON.stringify(state.posts))
}

// 添加新帖子
const addPost = (type, name) => {
  if (!state.posts[type]) {
    state.posts[type] = []
  }
  
  const newId = state.posts[type].length > 0 
    ? Math.max(...state.posts[type].map(p => p.id)) + 1 
    : 1

  state.posts[type].push({
    id: newId,
    name,
    avgRating: 0,
    reviews: []
  })
  
  saveData()
}

// 添加评论和评分
const addReview = (type, id, rating, comment, username = '匿名用户') => {
  const post = state.posts[type].find(p => p.id === id)
  
  if (post) {
    post.reviews.push({
      id: post.reviews.length + 1,
      username,
      rating,
      comment,
      date: new Date().toISOString()
    })
    
    // 重新计算平均评分
    const totalRating = post.reviews.reduce((sum, review) => sum + review.rating, 0)
    post.avgRating = totalRating / post.reviews.length
    
    saveData()
  }
}

// 获取特定类型的所有帖子
const getPostsByType = (type) => {
  return state.posts[type] || []
}

// 获取特定帖子详情
const getPostById = (type, id) => {
  return state.posts[type]?.find(p => p.id === id) || null
}

// 添加新的帖子类型
const addPostType = (type) => {
  if (!state.posts[type]) {
    state.posts[type] = []
    saveData()
    return true
  }
  return false
}

export default {
  state,
  addPost,
  addReview,
  getPostsByType,
  getPostById,
  addPostType
}