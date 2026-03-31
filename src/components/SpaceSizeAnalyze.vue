<template>
  <div class="space-size-analyze">
    <a-card title="空间图片大小分析">
      <v-chart :option="options" style="height: 320px; max-width: 100%" :loading="loading" />
    </a-card>
  </div>
</template>
<script lang="ts" setup>
import VChart from 'vue-echarts'
import 'echarts'
import { computed, ref, onMounted, watchEffect } from 'vue'
import { getSpaceSizeAnalyzeUsingPost } from '@/api/spaceAnalyzeController.ts'
import { message } from 'ant-design-vue'

const loading = ref(true)
const dataList = ref<API.SpaceSizeAnalyzeResponse[]>([])

interface props {
  queryAll: boolean
  queryPublic: boolean
  spaceId: string | number
}

const props = withDefaults(defineProps<props>(), {
  queryAll: false,
  queryPublic: false,
  spaceId: '',
})

const options = computed(() => {
  const pieData = dataList.value.map((item) => ({
    name: item.sizeRange,
    value: item.count,
  }))

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      top: 'bottom',
    },
    series: [
      {
        name: '图片大小',
        type: 'pie',
        radius: '50%',
        data: pieData,
      },
    ],
  }
})


const fetchData = async () => {
  loading.value = true
  const res = await getSpaceSizeAnalyzeUsingPost({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId,
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
