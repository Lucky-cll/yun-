<template>
  <div class="picture-url-upload">
    <a-input-group compact>
      <a-input v-model:value="fileUrl" style="width: calc(100% - 120px)" />
      <a-button type="primary" style="width: 120px" :loading="loading" @click="handleUpload">提交</a-button>
    </a-input-group>
    <div class="picture-wrapper">
      <img picture?.url :src="picture?.url"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

import { message } from 'ant-design-vue'
import type { UploadProps } from 'ant-design-vue'
import { uploadPictureByUrlUsingPost } from '@/api/pictureController'
interface Props {
  picture?: API.PictureVO
  onSuccess?: (newPicture: API.PictureVO) => void
}
const props = defineProps<Props>()
const fileUrl = ref<string>('')
const loading = ref<boolean>(false)
const handleUpload = async () => {
  loading.value = true
  try {
    const params: API.PictureUploadRequest = { fileUrl: fileUrl.value }
    if (props.picture) {
      params.id = props.picture.id
    }
    const res = await uploadPictureByUrlUsingPost(params)
    if (res.data.code === 0 && res.data.data) {
      message.success('图片上传成功')
      props.onSuccess?.(res.data.data)
    } else {
      message.error('图片上传失败：' + res.data.message)
    }
  } catch (error) {
    message.error('图片上传失败')
  } finally {
    loading.value = false
  }
}

const beforeUpload = (file: UploadProps['fileList'][number]) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('不支持上传非JPG/PNG格式的图片')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过2MB..')
  }
  return isJpgOrPng && isLt2M
}
</script>
<style scoped>
.picture-url-upload {
  margin-bottom: 16px;
}
.picture-url-upload img {
  max-width: 100%;
  max-height: 480px;
}
.picture-wrapper{
  margin-top: 16px;
  text-align: center;
}
</style>
