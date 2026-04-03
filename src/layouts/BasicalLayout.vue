<template>
  <div id="basicalLayout">
    <a-layout>
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout>
        <GlobalSider />
        <a-layout-content class="content" :style="{ borderBottom: 'none' }">
          <div class="main-content">
            <router-view />
          </div>
        </a-layout-content>
      </a-layout>

      <a-layout-footer class="footer">
        <a href="https://github.com/Lucky-cll/yun-" target="_blank">github by lucky-cll</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>
<script setup lang="ts">
import GlobalHeader from '../components/GlobalHeader.vue'
import GlobalSider from '../components/GlobalSider.vue'
</script>
<style scoped>
#basicalLayout {
  height: 100vh;
  width: 100%;
}

#basicalLayout .footer {
  background-color: #efefef;
  padding: 16px;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  z-index: 10;
}

#basicalLayout .content {
  background-color: white;
  margin: 1px;
  padding-bottom: 70px;
}

#basicalLayout .header {
  background-color: white;
  margin-bottom: 1px;
}
#basicalLayout :deep(.ant-meun-root) {
  border-bottom: none !important;
  border-inline-end: none !important;
}
</style>
