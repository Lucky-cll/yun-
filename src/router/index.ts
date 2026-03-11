import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/Pages/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/user/login',
      name: '用户登录',
      component: () => import('@/Pages/user/UserLoginPage.vue'),
    },
    {
      path: '/user/register',
      name: '用户注册',
      component: () => import('@/Pages/user/UserRegisterPage.vue'),
    },
    {
      path : '/admin/userManage',
      name: '用户管理',
      component: () => import('@/Pages/admin/UserManagePage.vue'),
    },
    {
      path: '/user/userInfo',
      name: '用户中心',
      component: () => import('@/Pages/user/userInfo.vue'),
    },
    {
      path: '/add-picture',
      name: '上传图片',
      component: () => import('@/Pages/AddPicturePage.vue'),
    },
    {
      path:'/admin/pictureManage',
      name:'图片管理',
      component: () => import('@/Pages/admin/PictureManagePage.vue'),
    }
  ],
})

export default router
