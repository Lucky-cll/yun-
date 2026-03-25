<template>
  <div class="pictureupload">
    <a-upload
      list-type="picture-card"
      :show-upload-list="false"
      :customRequest="handleUpload"
      :before-upload="beforeUpload"
    >
      <img v-if="picture?.url" :src="picture.url" alt="avatar" />
      <div v-else>
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">点击或拖拽图片上传</div>
      </div>
    </a-upload>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { UploadChangeParam, UploadProps } from 'ant-design-vue'
import { uploadPictureUsingPost } from '@/api/pictureController'
interface Props {
  picture?: API.PictureVO
  spaceId?: number | string
  onSuccess?: (newPicture: API.PictureVO) => void
}
const props = defineProps<Props>()

const fileList = ref([])
const loading = ref<boolean>(false)
const imageUrl = ref<string>('')
const handleUpload = async ({ file }: any) => {
  loading.value = true
  try {
    const params: API.PictureUploadRequest = props.picture ? { id: props.picture.id } : {}
    params.spaceId = props.spaceId
    const res = await uploadPictureUsingPost(params, {}, file)
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
.pictureupload :deep(.ant-upload) {
  background-color: rgba(105, 220, 226, 0.3);
  width: 100% !important;
  height: 100% !important;
  min-width: 152px;
  min-height: 152px;
}
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.pictureupload img {
  max-width: 100%;
  max-height: 480px;
}
</style>
