<template>
  <div class="fullscreen-404">
    <a-result
      status="404"
      title="抱歉，你访问的页面不存在"
      sub-title="可能是地址错误、页面已删除，或你输入的URL有误，请检查后重试"
    >
      <template #extra>
        <a-space>
          <a-button type="primary" @click="goBack">返回上一页</a-button>
          <a-button @click="goHome">回到首页</a-button>
        </a-space>
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const goBack = () => router.go(-1)
const goHome = () => router.push('/')
</script>

<style scoped>
.fullscreen-404 {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}
</style>
