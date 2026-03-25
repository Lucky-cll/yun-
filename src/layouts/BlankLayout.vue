<template>
  <!-- 空白布局：仅渲染路由内容，无任何多余元素 -->
  <router-view />
</template>

<script setup lang="ts">
// 无业务逻辑，仅作为路由容器
</script>

<style scoped>
/* 重置默认样式，确保全屏 */
:deep(html), :deep(body) {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>
