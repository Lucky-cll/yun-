<template>
  <div id="basicalLayout">
    <a-layout style="height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <div>
          <router-view />
        </div>
      </a-layout-content>
      <a-layout-footer class="footer">
        <a href="hhtps://www.codefather.cn" target="_blank">编程导航 by lucky斩</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>
<script setup lang="ts">
import GlobalHeader from '../components/GlobalHeader.vue'
</script>
<style scoped>
#basicalLayout .footer {
  background-color: #efefef;
  padding: 16px;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
}
#basicalLayout .content {
  background-color: white;
  margin: 10px;
}
#basicalLayout .header {
  background-color: white;
  margin-bottom: 10px;
}
</style>
