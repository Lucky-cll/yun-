<template>
  <div class="globalSider">
    <a-layout-sider
      v-if="loginUserStore.loginUser.id"
      class="sider"
      breakpoint="lg"
      width="200"
      collapsed-width="0"
    >
      <a-menu v-model:selectedKeys="current" mode="inline" :items="items" @click="doMenuclick">
      </a-menu>
    </a-layout-sider>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { PictureOutlined, UserOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
const loginUserStore = useLoginUserStore()
const router = useRouter()
const items = [
  {
    key: '/',
    icon: () => h(PictureOutlined),
    label: '公共空间',
    title: '公共空间',
  },
  {
    key: '/my-space',
    icon: () => h(UserOutlined),
    label: '私人空间',
    title: '私人空间',
  },
]
const current = ref(['/'])
router.afterEach((to, from, next) => {
  current.value = [to.path]
})
const doMenuclick = ({ key }: { key: string }) => {
  //router.push({path:key})
  router.push(key)
}
</script>
<style scoped>
.globalSider {
  background-color: white !important;
}
.globalSider :deep(.ant-layout-sider) {
  background: none !important;
}
</style>
