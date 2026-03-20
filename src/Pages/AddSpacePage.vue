<template>
  <div class="addSpacePage">
    <h2 style="margin-bottom: 16px">{{ route.query?.id ? '编辑空间' : '创建空间' }}</h2>
    <a-form layout="vertical" :model="formData" @finish="handleSubmit">
      <a-form-item label="空间名称" name="name">
        <a-input v-model:value="formData.spaceName" placeholder="请输入空间名称" />
      </a-form-item>
      <a-form-item label="空间级别" name="spaceLevel">
        <a-select
          v-model:value="formData.spaceLevel"
          :options="SPACE_LEVEL_OPTIONS"
          placeholder="请选择空间级别"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%" :loading="loading"
          >创建空间</a-button
        >
      </a-form-item>
    </a-form>
    <a-card title="空间级别介绍" class="space-level-card">
      <a-typography-paragraph class="level-tip">
        * 目前仅支持开通普通版，如需升级空间，请添加微信联系
        <a class="link">xxxxxxxxxxx</a>。
      </a-typography-paragraph>
      <a-typography-paragraph
        v-for="spaceLevel in spaceLevelList"
        :key="spaceLevel.text"
        class="level-item"
      >
        {{ spaceLevel.text }}： 大小 {{ formatSize(spaceLevel.maxSize) }}， 数量
        {{ spaceLevel.maxCount }}
      </a-typography-paragraph>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import router from '@/router'
import { addSpaceUsingPost, listSpaceLevelUsingGet, getSpaceByIdUsingGet, updateSpaceUsingPost } from '@/api/spaceController'
import { SPACE_LEVEL_ENUM, SPACE_LEVEL_OPTIONS } from '@/constants/space'
import { formatSize } from '@/utils'
import { useRoute } from 'vue-router'
const loading = ref(false)
const formData = reactive<API.SpaceAddRequest>({
  spaceName: '',
  spaceLevel: SPACE_LEVEL_ENUM.COMMON,
})
const oldSpace = ref<API.SpaceVO>()
  const route = useRoute()
const getOldSpace = async () => {
  if (route.query.id) {
    const res = await getSpaceByIdUsingGet({
      id: route.query.id as string,
    })
    if (res.data.code === 0 && res.data.data) {
      oldSpace.value = res.data.data
      formData.spaceName = res.data.data.spaceName
      formData.spaceLevel = res.data.data.spaceLevel
    }
  }
}
const handleSubmit = async (values: any) => {
  const spaceId = oldSpace.value?.id
  loading.value = true
  let res
  // 更新
  if (spaceId) {
    res = await updateSpaceUsingPost({
      id: spaceId,
      ...formData,
    })
  } else {
    // 创建
    res = await addSpaceUsingPost({
      ...formData,
    })
  }
  if (res.data.code === 0 && res.data.data) {
    message.success('操作成功')
    let path = `/space/${spaceId ?? res.data.data}`
    router.push({
      path,
    })
  } else {
    message.error('操作失败，' + res.data.message)
  }
  loading.value = false
}

const spaceLevelList = ref<API.SpaceLevel[]>([])

// 获取空间级别
const fetchSpaceLevelList = async () => {
  const res = await listSpaceLevelUsingGet()
  if (res.data.code === 0 && res.data.data) {
    spaceLevelList.value = res.data.data
  } else {
    message.error('加载空间级别失败，' + res.data.message)
  }
}

onMounted(() => {
  fetchSpaceLevelList()
  getOldSpace()
})
</script>
<style scoped>
h2 {
  text-align: center;
}
.addSpacePage {
  max-width: 500px;
  margin: 0 auto;
}
/* 卡片整体样式优化 */
.space-level-card {
  margin-top: 20px; /* 和表单拉开距离，不挤 */
  border-radius: 8px !important; /* 圆角更柔和，不生硬 */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04) !important; /* 轻微阴影，提升层次感 */
  padding: 0 16px 16px !important; /* 内边距优化，内容不贴边 */
}

/* 卡片标题样式 */
.space-level-card :deep(.ant-card-head-title) {
  font-size: 16px;
  font-weight: 600;
  color: #2f5496; /* 柔和的蓝色，不刺眼 */
  padding: 12px 0;
}

/* 提示文字样式 */
.level-tip {
  color: #666; /* 浅灰色，阅读不费力 */
  font-size: 14px;
  line-height: 1.6; /* 行高优化，易读 */
  margin-bottom: 12px !important; /* 和下面的级别信息拉开距离 */
}

/* 链接样式优化 */
.link {
  color: #1890ff !important; /* AntD默认主色，统一风格 */
  text-decoration: none;
  font-weight: 500;
}
.link:hover {
  text-decoration: underline; /* hover加下划线，交互更友好 */
}

/* 级别信息行样式 */
.level-item {
  color: #555; /* 适中的灰色，不刺眼 */
  font-size: 14px;
  line-height: 1.8; /* 行高加大，不拥挤 */
  padding: 4px 0; /* 上下留白，区分每行 */
  margin: 0 !important; /* 去掉默认间距，更规整 */
}
</style>
