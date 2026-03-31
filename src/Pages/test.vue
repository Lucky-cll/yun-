
<template>
  <div class="test-container">
    <SpaceUsageAnalyze :queryAll="false" :queryPublic="false" spaceId="2033824571690266625" />
  </div>
  <div>
     <SpaceCategoryAnalyze :queryAll="false" :queryPublic="false" spaceId="2033824571690266625" />
  </div>
  <div>
    <SpaceTagAnalyze :queryAll="false" :queryPublic="false" spaceId="2033824571690266625" />
  </div>
  <div>
    <SpaceSizeAnalyze :queryAll="false" :queryPublic="false" spaceId="2033824571690266625" />
  </div>
  <div>
    <SpaceUserAnalyze :queryAll="false" :queryPublic="false" spaceId="2033824571690266625" />
  </div>
  <div>
    <SpaceRankAnalyze/>
  </div>

</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import SpaceUsageAnalyze from '@/components/SpaceUsageAnalyze.vue'
import SpaceCategoryAnalyze from '@/components/SpaceCategoryAnalyze.vue'
import SpaceTagAnalyze from '@/components/SpaceTagAnalyze.vue'
import SpaceSizeAnalyze from '@/components/SpaceSizeAnalyze.vue'
import SpaceUserAnalyze from '@/components/SpaceUserAnalyze.vue'
import SpaceRankAnalyze from '@/components/SpaceRankAnalyze.vue'
</script>

<style scoped>

</style>
