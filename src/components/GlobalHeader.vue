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
        <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" @click="doMenuclick" />
      </a-col>
      <a-col flex="120px">
        <div class="user-login-status">
          <div v-if="userStore.loginUser.id">
            {{ userStore.loginUser.userName ?? "无名" }}
          </div>
          <div v-else>
            <a-button type="primary" href="/user/login">登录</a-button>
          </div>

        </div>
      </a-col>
    </a-row>
  </div>
</template>
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
</style>
<script lang="ts" setup>
import { h, onMounted, ref } from 'vue'
import { AppstoreOutlined, HomeOutlined } from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
const userStore = useLoginUserStore()
const items = ref<MenuProps['items']>([
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '首页',
    title: '首页',
  },
  {
    key: '/about',
    icon: () => h(AppstoreOutlined),
    label: '关于',
    title: '关于',
  },

  {
    key: '编程导航',
    label: h('a', { href: 'https://www.codefather.cn', target: '_blank' }, '编程导航'),
    title: '编程导航',
  },
])
const current = ref<string[]>(['/'])
const router = useRouter()
const doMenuclick = ({ key }: { key: string }) => {
  //router.push({path:key})
  router.push(key)
}
router.afterEach((to,from,next)=>{
  current.value = [to.path]
})
onMounted(()=>{
  userStore.fetchLoginUser()
})
</script>
