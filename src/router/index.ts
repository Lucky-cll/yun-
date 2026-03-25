import { createRouter, createWebHistory } from 'vue-router'
import BasicalLayout from '@/layouts/BasicalLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 布局路由 - 包含基础布局
    {
      path: '/',
      component: BasicalLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/Pages/HomePage.vue'),
        },
        {
          path: 'user/userInfo',
          name: '用户中心',
          component: () => import('@/Pages/user/userInfo.vue'),
        },
        {
          path: 'add-picture',
          name: '上传图片',
          component: () => import('@/Pages/AddPicturePage.vue'),
        },
        {
          path: 'admin/userManage',
          name: '用户管理',
          component: () => import('@/Pages/admin/UserManagePage.vue'),
        },
        {
          path: 'admin/pictureManage',
          name: '图片管理',
          component: () => import('@/Pages/admin/PictureManagePage.vue'),
        },
        {
          path: 'picture/:id',
          name: '图片详情',
          component: () => import('@/Pages/PictureDetailPage.vue'),
          props: true,
        },
        {
          path: 'add-picture/batch',
          name: '批量上传图片',
          component: () => import('@/Pages/addPictureBatchPage.vue'),
        },
        {
          path: 'admin/spaceManage',
          name: '空间管理',
          component: () => import('@/Pages/admin/SpaceManagePage.vue'),
        },
        {
          path: 'add-space',
          name: '添加空间',
          component: () => import('@/Pages/AddSpacePage.vue'),
        },
        {
          path: 'my-space',
          name: '我的空间',
          component: () => import('@/Pages/MySpacePage.vue'),
        },
        {
          path: 'space/:id',
          name: '空间详情',
          component: () => import('@/Pages/SpaceDetailPage.vue'),
          props: true,
        },
        {
          path: '/search-picture',
          name: '图片搜索',
          component: () => import('@/Pages/SearchPicturePage.vue'),
        },
      ],
    },
    // 不需要基础布局的页面
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
    // 404 页面 - 不使用基础布局
    {
      path: '/404',
      name: 'NotFound',
      component: () => import('@/Pages/NotFoundPage.vue'),
    },
    // 通配符路由：所有未匹配的路由跳404
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404',
    },
  ],
})

export default router
