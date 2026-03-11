<template>
  <div id="addPicturePage">
    <h2 style="margin-bottom: 16px">
      {{ route.query?.id ? '修改图片' : '创建图片' }}
    </h2>
    <PictureUpdate :picture="picture" :onSuccess="onSuccess" />
    <a-form
      v-if="picture"
      ref="formRef"
      layout="vertical"
      :model="pictureForm"
      @finish="handleSubmit"
    >
      <a-form-item label="名称" name="name">
        <a-input v-model:value="pictureForm.name" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item label="简介" name="introduction">
        <a-textarea
          v-model:value="pictureForm.introduction"
          placeholder="请输入简介"
          :rows="2"
          autoSize
          allowClear
        />
      </a-form-item>
      <a-form-item label="分类" name="category">
        <a-auto-complete
          :options="categoryList"
          v-model:value="pictureForm.category"
          placeholder="请输入分类"
          allowClear
        />
      </a-form-item>
      <a-form-item label="标签" name="tags">
        <a-select
          v-model:value="pictureForm.tags"
          mode="tags"
          placeholder="请输入标签"
          :options="tagList"
          style="width: 100%"
          allowClear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">创建</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import PictureUpdate from '@/components/PictureUpdate.vue'
import { reactive, ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { editPictureUsingPost, listPictureTagCategoryUsingGet , getPictureVoByIdUsingGet} from '@/api/pictureController'
import router from '@/router'
import { useRoute } from 'vue-router'
interface options {
  label: string
  value: string
}
const picture = ref<API.PictureVO>()
const pictureForm = reactive<API.PictureEditRequest>({})
const tagList = ref<options[]>([])
const categoryList = ref<options[]>([])
const formRef = ref<any>(null)
const route = useRoute()
const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
  pictureForm.name = newPicture.name
}
const handleSubmit = async (values: any) => {
  const pictureId = picture.value?.id
  if (!pictureId) {
    message.error('图片不存在')
    return
  }
  const res = await editPictureUsingPost({
    id: pictureId,
    ...values,
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('图片创建成功')
    formRef.value.resetFields()
    picture.value = undefined
    // 跳转到图片详情页
    router.push({
      path: `/picture/${pictureId}`,
    })
  } else {
    message.error('图片创建失败：' + res.data.message)
  }
}
const getTagCategoryList = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    tagList.value = (res.data.data.tagList ?? []).map((item) => ({
      label: item,
      value: item,
    }))
    categoryList.value = (res.data.data.categoryList ?? []).map((item) => ({
      label: item,
      value: item,
    }))
  } else {
    message.error('获取标签分类失败：' + res.data.message)
  }
}

// 获取老数据
const getOldPicture = async () => {
  // 获取数据
  const id = Number(route.query?.id)
  if (id) {
    const res = await getPictureVoByIdUsingGet({
      id : id,
    })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data
      picture.value = data
      pictureForm.name = data.name
      pictureForm.introduction = data.introduction
      pictureForm.category = data.category
      pictureForm.tags = data.tags
    }
  }
}

onMounted(() => {
  getTagCategoryList()
  getOldPicture()
})
</script>
<style scoped>
#addPicturePage {
  max-width: 720px;
  margin: 0 auto;
}
h2 {
  font-size: 24px;
  color: #333;
  text-align: center;
}
</style>
