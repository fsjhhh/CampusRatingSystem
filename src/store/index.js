import { reactive } from 'vue'

// 初始数据
const initialPosts = {
  course: [
    { id: 1, name: '大学语文', avgRating: 0, reviews: [], createdAt: new Date('2025-03-01').toISOString() },
    { id: 2, name: '高等数学', avgRating: 0, reviews: [], createdAt: new Date('2025-03-05').toISOString() },
    { id: 3, name: '大学英语', avgRating: 0, reviews: [], createdAt: new Date('2025-03-10').toISOString() }
  ],
  food: [
    { id: 1, name: '食堂一楼', avgRating: 0, reviews: [], createdAt: new Date('2025-03-15').toISOString() },
    { id: 2, name: '食堂二楼', avgRating: 0, reviews: [], createdAt: new Date('2025-03-20').toISOString() },
    { id: 3, name: '食堂三楼', avgRating: 0, reviews: [], createdAt: new Date('2025-03-25').toISOString() }
  ],
  stores: [
    { id: 1, name: '文具店', avgRating: 0, reviews: [], createdAt: new Date('2025-03-28').toISOString() },
    { id: 2, name: '超市', avgRating: 0, reviews: [], createdAt: new Date('2025-04-01').toISOString() },
    { id: 3, name: '日用品店', avgRating: 0, reviews: [], createdAt: new Date('2025-04-03').toISOString() }
  ]
}

// 帖子类别的元数据
const initialCategoryMeta = {
  course: { 
    name: '课程', 
    createdAt: new Date('2025-02-20').toISOString(),
    totalReviews: 0,
    avgRating: 0
  },
  food: { 
    name: '食堂', 
    createdAt: new Date('2025-02-22').toISOString(),
    totalReviews: 0,
    avgRating: 0
  },
  stores: { 
    name: '商店', 
    createdAt: new Date('2025-02-25').toISOString(),
    totalReviews: 0,
    avgRating: 0
  }
}

// 从本地存储加载数据或使用初始数据
const loadData = () => {
  const savedData = localStorage.getItem('campusRating')
  return savedData ? JSON.parse(savedData) : initialPosts
}

// 从本地存储加载类别元数据或使用初始数据
const loadCategoryMeta = () => {
  const savedMeta = localStorage.getItem('campusRatingMeta')
  return savedMeta ? JSON.parse(savedMeta) : initialCategoryMeta
}

// 创建响应式状态
const state = reactive({
  posts: loadData(),
  categoryMeta: loadCategoryMeta()
})

// 保存数据到本地存储
const saveData = () => {
  localStorage.setItem('campusRating', JSON.stringify(state.posts))
  localStorage.setItem('campusRatingMeta', JSON.stringify(state.categoryMeta))
}

// 更新类别元数据
const updateCategoryMeta = () => {
  Object.keys(state.posts).forEach(type => {
    const posts = state.posts[type]
    let totalRating = 0
    let totalReviews = 0
    
    posts.forEach(post => {
      totalReviews += post.reviews.length
      post.reviews.forEach(review => {
        totalRating += review.rating
      })
    })
    
    if (!state.categoryMeta[type]) {
      state.categoryMeta[type] = {
        name: type,
        createdAt: new Date().toISOString(),
        totalReviews: 0,
        avgRating: 0
      }
    }
    
    state.categoryMeta[type].totalReviews = totalReviews
    state.categoryMeta[type].avgRating = totalReviews > 0 ? totalRating / totalReviews : 0
  })
  
  saveData()
}

// 添加新帖子
const addPost = (type, name) => {
  if (!state.posts[type]) {
    state.posts[type] = []
  }
  
  // 检查是否存在重名的评分对象
  const isDuplicate = state.posts[type].some(post => post.name.toLowerCase() === name.toLowerCase());
  if (isDuplicate) {
    return { success: false, message: '该类别下已存在同名评分对象' };
  }
  
  const newId = state.posts[type].length > 0 
    ? Math.max(...state.posts[type].map(p => p.id)) + 1 
    : 1

  state.posts[type].push({
    id: newId,
    name,
    avgRating: 0,
    reviews: [],
    createdAt: new Date().toISOString()
  })
  
  // 如果是新类别，添加元数据
  if (!state.categoryMeta[type]) {
    state.categoryMeta[type] = {
      name: type,
      createdAt: new Date().toISOString(),
      totalReviews: 0,
      avgRating: 0
    }
  }
  
  saveData()
  return { success: true, message: '添加成功' };
}

// 添加评论和评分
const addReview = (type, id, rating, comment, username = '匿名用户', images = []) => {
  const post = state.posts[type].find(p => p.id === id)
  
  if (post) {
    post.reviews.push({
      id: post.reviews.length + 1,
      username,
      rating,
      comment,
      images, // 添加图片数据
      date: new Date().toISOString()
    })
    
    // 重新计算平均评分
    const totalRating = post.reviews.reduce((sum, review) => sum + review.rating, 0)
    post.avgRating = totalRating / post.reviews.length
    
    // 更新类别元数据
    updateCategoryMeta()
    
    saveData()
  }
}

// 删除特定帖子
const deletePost = (type, id) => {
  if (state.posts[type]) {
    const index = state.posts[type].findIndex(p => p.id === id);
    if (index !== -1) {
      state.posts[type].splice(index, 1);
      
      // 更新类别元数据
      updateCategoryMeta();
      
      saveData();
      return true;
    }
  }
  return false;
}

// 删除整个类别
const deleteCategory = (type) => {
  if (state.posts[type] && !['course', 'food', 'stores'].includes(type)) {
    delete state.posts[type];
    delete state.categoryMeta[type];
    
    saveData();
    return true;
  }
  return false;
}

// 获取特定类型的所有帖子
const getPostsByType = (type) => {
  return state.posts[type] || []
}

// 获取特定帖子详情
const getPostById = (type, id) => {
  const post = state.posts[type]?.find(p => p.id === id) || null
  if (post) {
    return {
      ...post,
      type
    }
  }
  return null
}

// 添加新的帖子类型
const addPostType = (type) => {
  // 检查类型是否已存在
  if (state.posts[type]) {
    return { success: false, message: '该类别已存在' };
  }
  
  // 检查是否为保留类型名称
  if (['course', 'food', 'stores'].includes(type.toLowerCase())) {
    return { success: false, message: '该类别已存在' };
  }

  if (['课程', '食堂', '商店'].includes(type.toLowerCase())) {
    return { success: false, message: '该类别已存在' };
  }
  
  // 创建新类别
  state.posts[type] = [];
  
  state.categoryMeta[type] = {
    name: type,
    createdAt: new Date().toISOString(),
    totalReviews: 0,
    avgRating: 0
  };
  
  saveData();
  return { success: true, message: '添加类别成功' };
}

// 获取所有帖子的数量
const getPostsCount = () => {
  let count = 0
  Object.values(state.posts).forEach(posts => {
    count += posts.length
  })
  return count
}

// 获取所有评论的数量
const getReviewsCount = () => {
  let count = 0
  Object.values(state.posts).forEach(posts => {
    posts.forEach(post => {
      count += post.reviews.length
    })
  })
  return count
}

// 获取按最新时间排序的所有帖子
const getPostsByNewest = (limit = 3) => {
  const allPosts = []
  
  Object.entries(state.posts).forEach(([type, posts]) => {
    posts.forEach(post => {
      allPosts.push({
        ...post,
        type
      })
    })
  })
  
  return allPosts
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit)
}

// 获取按评论数量排序的所有帖子
const getPostsByMostReviews = (limit = 3) => {
  const allPosts = []
  
  Object.entries(state.posts).forEach(([type, posts]) => {
    posts.forEach(post => {
      allPosts.push({
        ...post,
        type
      })
    })
  })
  
  return allPosts
    .sort((a, b) => b.reviews.length - a.reviews.length)
    .slice(0, limit)
}

// 获取按平均评分排序的所有帖子
const getPostsByHighestRating = (limit = 3) => {
  const allPosts = []
  
  Object.entries(state.posts).forEach(([type, posts]) => {
    posts.forEach(post => {
      allPosts.push({
        ...post,
        type
      })
    })
  })
  
  return allPosts
    .filter(post => post.reviews.length > 0) // 只包含有评论的帖子
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, limit)
}

// 获取所有帖子类别
const getAllCategories = () => {
  return Object.keys(state.posts).map(type => ({
    type,
    ...state.categoryMeta[type],
    count: state.posts[type].length
  }))
}

// 获取按最新创建时间排序的帖子类别
const getCategoriesByNewest = (limit = 3) => {
  return getAllCategories()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit)
}

// 获取按评论数量排序的帖子类别
const getCategoriesByMostReviews = (limit = 3) => {
  return getAllCategories()
    .sort((a, b) => b.totalReviews - a.totalReviews)
    .slice(0, limit)
}

// 获取按平均评分排序的帖子类别
const getCategoriesByHighestRating = (limit = 3) => {
  return getAllCategories()
    .filter(category => category.totalReviews > 0)
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, limit)
}

// 获取所有分类的数量
const getCategoriesCount = () => {
  return Object.keys(state.posts).length;
}

// 初始化时更新所有类别元数据
updateCategoryMeta()

export default {
  state,
  addPost,
  addReview,
  getPostsByType,
  getPostById,
  addPostType,
  getPostsCount,
  getReviewsCount,
  getPostsByNewest,
  getPostsByMostReviews,
  getPostsByHighestRating,
  getAllCategories,
  getCategoriesByNewest,
  getCategoriesByMostReviews,
  getCategoriesByHighestRating,
  deletePost,
  deleteCategory,
  getCategoriesCount
}