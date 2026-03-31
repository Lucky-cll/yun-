<template>
  <a-card title="空间上传排名分析">
    <v-chart :option="options" style="height: 320px" />
  </a-card>
</template>
<script lang="ts" setup>
import VChart from 'vue-echarts'
import 'echarts'
import { computed, ref, onMounted, watchEffect } from 'vue'
import { getSpaceRankAnalyzeUsingPost } from '@/api/spaceAnalyzeController.ts'
import { message } from 'ant-design-vue'

const loading = ref(true)
const dataList = ref<API.Space[]>([])

const options = computed(() => {
  const spaceNames = dataList.value.map((item) => item.spaceName)
  const usageData = dataList.value.map((item) => (item.totalSize as number / (1024 * 1024)).toFixed(2)) // 转为 MB

  return {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: spaceNames,
    },
    yAxis: {
      type: 'value',
      name: '空间使用量 (MB)',
    },
    series: [
      {
        name: '空间使用量 (MB)',
        type: 'bar',
        data: usageData,
        itemStyle: {
          color: '#5470C6', // 自定义柱状图颜色
        },
      },
    ],
  }
})

const fetchData = async () => {
  loading.value = true
  // 只传后端定义的参数，其他多余参数全部删掉
  const res = await getSpaceRankAnalyzeUsingPost({
    topN: 10, // 可以自定义，比如要前20名就传20
  })
  if (res.data.code === 0) {
    dataList.value = res.data.data ?? []
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
  loading.value = false
}
// 确保组件初始化时获取数据
onMounted(() => {
  fetchData()
})

// 监听属性变化，重新获取数据
watchEffect(() => {
  fetchData()
})
</script>

<style scoped></style>
