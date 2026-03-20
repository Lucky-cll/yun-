<template>
  <div class="addPictureBatchPage">
    <h2 style="margin-bottom: 16px">批量创建图片</h2>
    <a-form layout="vertical" :model="formData" @finish="handleSubmit">
      <a-form-item label="关键词" name="searchText">
        <a-input v-model:value="formData.searchText" placeholder="请输入关键词" />
      </a-form-item>
      <a-form-item label="抓取数量" name="count">
        <a-input
          v-model:value="formData.count"
          placeholder="请输入抓取数量"
          :min="1"
          style="min-width: 180"
          :max="30"
          allowClear
        />
      </a-form-item>
      <a-form-item label="名称前缀" name="namePrefix">
        <a-input
          v-model:value="formData.namePrefix"
          placeholder="请输入名称前缀,会自动添加序号"
          allowClear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%" :loading="loading"
          >执行任务</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import router from '@/router'
import { uploadPictureByBatchUsingPost } from '@/api/pictureController'
import { f } from 'vue-router/dist/router-CWoNjPRp.mjs'
const loading = ref(false)
const formData = reactive<API.PictureUploadByBatchRequest>({
  searchText: '',
  count: 10,
  namePrefix: '',
})
const handleSubmit = async (values: any) => {
  try {
    loading.value = true
    const res = await uploadPictureByBatchUsingPost({ ...formData })
    if (res.data.code === 0 && res.data.data) {
      message.success(`任务创建成功,共创建${res.data.data}张图片`)
      router.push({
        path: '/',
      })
    } else {
      message.error('创建失败' + res.data.message)
    }
  } catch (e) {
    message.error('创建失败' + e)
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
h2 {
  text-align: center;
}
.addPictureBatchPage {
  max-width: 500px;
  margin: 0 auto;
}
</style>
