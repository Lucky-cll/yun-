<script setup lang="ts">
import BasicalLayout from '@/layouts/BasicalLayout.vue'
import { healthUsingGet } from './api/mainController'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
healthUsingGet().then((res) => {
  console.log(res)
})
</script>

<template>
  <div id="app">
    <BasicalLayout />
  </div>
</template>

<style scoped></style>
