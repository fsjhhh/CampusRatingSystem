import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/course',
    name: 'Course',
    component: () => import('../views/Course.vue')
  },
  {
    path: '/food',
    name: 'Food',
    component: () => import('../views/Food.vue')
  },
  {
    path: '/goods',
    name: 'Goods',
    component: () => import('../views/Goods.vue')
  },
  {
    path: '/add-post',
    name: 'AddPost',
    component: () => import('../views/AddPost.vue')
  },
  {
    path: '/detail/:type/:id',
    name: 'Detail',
    component: () => import('../views/Detail.vue')
  },
  {
    path: '/custom',
    name: 'Custom',
    component: () => import('../views/Custom.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router