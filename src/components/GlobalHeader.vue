<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <a-col flex="200px">
        <router-link to="/">
          <div class="title-bar">
            <img class="logo" src="../assets/logo.png" alt="logo" />
            <div class="title">智能云图库</div>
          </div>
        </router-link>
      </a-col>
      <a-col flex="auto">
        <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          @click="doMenuclick"
        />
      </a-col>
      <a-col flex="120px">
        <div class="user-login-status">
          <div v-if="userStore.loginUser.id">
            <a-dropdown>
              <a-space>
                <a-avatar :size="32" :src="userStore.loginUser.userAvatar" />
                {{ userStore.loginUser.userName ?? '无名' }}
              </a-space>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a href="javascript:;" @click="doLogout"><LogoutOutlined /> 退出登录</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:;" @click="doUserInfo"><HeartOutlined /> 用户中心</a>
                  </a-menu-item>
                  <a-menu-item>
                    <router-link to="/my-space">
                      <UserOutlined />
                      我的空间
                    </router-link>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <div v-else>
            <router-link to="/user/login">
              <a-button type="primary">登录</a-button>
            </router-link>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { h, onMounted, ref } from 'vue'
import {
  AppstoreOutlined,
  HomeOutlined,
  LogoutOutlined,
  HeartOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { userLogoutUsingPost } from '@/api/userController'
import { message } from 'ant-design-vue'
import { computed } from 'vue'
const userStore = useLoginUserStore()
const originalItems = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '首页',
    title: '首页',
  },
  {
    key: '/admin/userManage',
    icon: () => h(AppstoreOutlined),
    label: '用户管理',
    title: '用户管理',
  },
  {
    key: '/add-picture',
    icon: () => h(PlusOutlined),
    label: '上传图片',
    title: '上传图片',
  },
  {
    key: '/admin/pictureManage',
    icon: () => h(AppstoreOutlined),
    label: '图片管理',
    title: '图片管理',
  },
  {
    key: '/admin/spaceManage',
    icon: () => h(AppstoreOutlined),
    label: '空间管理',
    title: '空间管理',
  },
  {
    key: '编程导航',
    label: h('a', { href: 'https://www.codefather.cn', target: '_blank' }, '编程导航'),
    title: '编程导航',
  },
]
const filterMenu = (menus = [] as MenuProps['items']) => {
  return menus?.filter((item) => {
    if ((item?.key as string).startsWith('/admin')) {
      const loginUser = userStore.loginUser
      if (!loginUser || loginUser.userRole !== 'admin') {
        return false
      }
    }
    return true
  })
}
const items = computed(() => filterMenu(originalItems))
const current = ref<string[]>(['/'])
const router = useRouter()
const doMenuclick = ({ key }: { key: string }) => {
  //router.push({path:key})
  router.push(key)
}
router.afterEach((to, from, next) => {
  current.value = [to.path]
})

// 退出登录
const doLogout = async () => {
  const res = await userLogoutUsingPost()
  if (res.data.code === 0) {
    userStore.setLoginUser({
      userName: '未登录',
    })
    message.success('退出登录成功')
    router.push({
      path: '/user/login',
      replace: true,
    })
  } else {
    message.error('退出登录失败：' + res.data.message)
  }
}
// 跳转用户中心
const doUserInfo = async () => {
  router.push({
    path: '/user/userInfo',
    replace: true,
  })
}
onMounted(() => {})
</script>
<style scoped>
#globalHeader .title-bar {
  display: flex;
  align-items: center;
}
.logo {
  width: 48px;
  height: 48px;
}
.title {
  font-size: 24px;
  color: black;
  margin-left: 10px;
}
.user-login-status {
  display: flex;
  align-items: center;
  padding: 10px;
}
.logo {
  border-radius: 8px;
}
</style>
