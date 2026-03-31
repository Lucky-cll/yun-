<template>
  <a-modal
    class="image-out-ai-modal"
    v-model:visible="visible"
    title="AI扩展图片"
    :footer="false"
    @cancel="closeModal"
  >
    <a-row :gutter="16">
      <a-col span="12">
        <h4>原始图片</h4>
        <img :src="picture?.url" :alt="picture?.name" style="max-width: 100%" />
      </a-col>
      <a-col span="12">
        <h4>扩图结果</h4>
        <img
          v-if="resultImageUrl"
          :src="resultImageUrl"
          :alt="picture?.name"
          style="max-width: 100%"
        />
      </a-col>
    </a-row>
    <div style="margin-bottom: 16px" />
    <a-flex gap="16" justify="center">
      <a-button type="primary" ghost @click="createTask" :loading="!!taskId">生成图片</a-button>
      <a-button type="primary" @click="handleUpload" :loading="uploadLoading" v-if="resultImageUrl">应用结果</a-button>
    </a-flex>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  createPictureOutPaintingTaskUsingPost,
  getPictureOutPaintingTaskUsingGet,
  uploadPictureByUrlUsingPost,
} from '@/api/pictureController'
import { onUnmounted } from 'vue'

interface Props {
  picture?: API.PictureVO
  spaceId?: string | number
  onSuccess?: (newPicture: any) => void
}

const props = defineProps<Props>()
const resultImageUrl = ref<string>()
let taskId = ref<string>()

// 前端校验图片尺寸（不解构，最稳妥）
const checkImageSize = (): boolean => {
  if (!props.picture) {
    message.error('图片信息不存在')
    return false
  }

  const width = props.picture.picWidth
  const height = props.picture.picHeight

  if (!width || !height) {
    message.error('图片宽高信息缺失，无法扩图')
    return false
  }

  if (width >= 512 && height >= 512) {
    return true
  } else {
    message.error(`图片尺寸不符合要求（${width}×${height}px）\n宽高必须 ≥ 512px 才能使用AI扩图`)
    return false
  }
}

// 创建任务
const createTask = async () => {
  if (!props.picture?.id) {
    message.error('图片信息不存在')
    return
  }

  // 前端拦截，尺寸不合格直接阻止
  const isValid = checkImageSize()
  if (!isValid) return

  try {
    const res = await createPictureOutPaintingTaskUsingPost({
      pictureId: props.picture.id,
      parameters: {
        xScale: 2,
        yScale: 2,
      },
    })

    if (res.data.code === 0 && res.data.data) {
      message.success('创建任务成功，请耐心等待')
      taskId.value = res.data.data.output?.taskId
      startPolling()
    } else {
      message.error('创建任务失败：' + res.data.message)
    }
  } catch (error) {
    message.error('创建任务异常')
    taskId.value = undefined
  }
}

// 轮询相关
let pollingTimer: ReturnType<typeof setInterval> | null = null

const clearPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
  }
  taskId.value = undefined
}

const startPolling = () => {
  if (!taskId.value) return

  pollingTimer = setInterval(async () => {
    try {
      const res = await getPictureOutPaintingTaskUsingGet({
        taskId: taskId.value,
      })

      if (res.data.code === 0 && res.data.data) {
        const taskResult = res.data.data.output

        if (taskResult?.taskStatus === 'SUCCEEDED') {
          message.success('扩图任务成功')
          resultImageUrl.value = taskResult.outputImageUrl || ''
          clearPolling()
        } else if (taskResult?.taskStatus === 'FAILED') {
          message.error('扩图失败：' + (taskResult.message || '未知原因'))
          clearPolling()
        }
      }
    } catch (error) {
      message.error('查询任务状态失败')
      clearPolling()
    }
  }, 3000)
}

onUnmounted(() => {
  clearPolling()
})

// 上传应用结果
const uploadLoading = ref(false)

const handleUpload = async () => {
  if (!resultImageUrl.value) {
    message.error('暂无结果可应用')
    return
  }

  uploadLoading.value = true
  try {
    const params: API.PictureUploadRequest = {
      fileUrl: resultImageUrl.value,
      spaceId: props.spaceId,
    }
    if (props.picture) {
      params.id = props.picture.id
    }

    const res = await uploadPictureByUrlUsingPost(params)
    if (res.data.code === 0) {
      message.success('应用成功')
      props.onSuccess?.(res.data.data)
      closeModal()
    } else {
      message.error('应用失败：' + res.data.message)
    }
  } catch (error) {
    message.error('上传异常')
  } finally {
    uploadLoading.value = false
  }
}

// 弹窗控制
const visible = ref(false)

const openModal = () => {
  visible.value = true
}

const closeModal = () => {
  visible.value = false
  clearPolling()
  resultImageUrl.value = undefined
}

defineExpose({ openModal })
</script>

<style scoped>
.image-out-ai-modal {
  text-align: center;
}
</style>
