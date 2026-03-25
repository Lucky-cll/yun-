<template>
  <div class="pictureDetailPage">
    <a-spin v-if="loading" tip="加载中..."></a-spin>
    <a-row v-else :gutter="[16, 16]">
      <!-- 图片展示区 -->
      <a-col :sm="24" :md="16" :xl="18">
        <a-card title="图片预览">
          <a-image style="max-height: 600px; object-fit: contain" :src="picture.url" />
        </a-card>
      </a-col>
      <!-- 图片信息区 -->
      <a-col :sm="24" :md="8" :xl="6">
        <a-card title="图片信息">
          <a-descriptions :column="1">
            <a-descriptions-item label="作者">
              <a-space>
                <a-avatar :size="24" :src="picture.user?.userAvatar" />
                <div>{{ picture.user?.userName }}</div>
              </a-space>
            </a-descriptions-item>
            <a-descriptions-item label="名称">
              {{ picture.name ?? '未命名' }}
            </a-descriptions-item>
            <a-descriptions-item label="简介">
              {{ picture.introduction ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="分类">
              {{ picture.category ?? '默认' }}
            </a-descriptions-item>
            <a-descriptions-item label="标签">
              <a-tag v-for="tag in picture.tags" :key="tag">
                {{ tag }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="格式">
              {{ picture.picFormat ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="宽度">
              {{ picture.picWidth ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="高度">
              {{ picture.picHeight ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="宽高比">
              {{ picture.picScale ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="大小">
              {{ formatSize(picture.picSize) }}
            </a-descriptions-item>
            <a-descriptions-item label="主色调">
              <a-space>
                {{ picture.picColor ?? '-' }}
                <div
                  v-if="picture.picColor"
                  :style="{
                    backgroundColor: toHexColor(picture.picColor),
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                  }"
                ></div>
              </a-space>
            </a-descriptions-item>
          </a-descriptions>
          <ShareModal ref="shareModal" :link="shareLink" />
          <a-space wrap>
            <a-button v-if="canEdit" type="default" @click="doEdit">
              编辑
              <template #icon>
                <EditOutlined />
              </template>
            </a-button>
            <a-button v-if="canEdit" danger @click="doDelete">
              删除
              <template #icon>
                <DeleteOutlined />
              </template>
            </a-button>
            <a-button type="primary" @click="doDownload">
              免费下载
              <template #icon>
                <DownloadOutlined />
              </template>
            </a-button>
            <a-button type="primary" ghost @click="(e: MouseEvent)=>doShare(picture, e)">
              分享
              <template #icon>
                <share-alt-outlined />
              </template>
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { getPictureVoByIdUsingGet } from '@/api/pictureController'
import { message } from 'ant-design-vue'
import { formatSize } from '@/utils'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { DeleteOutlined, EditOutlined, DownloadOutlined, ShareAltOutlined } from '@ant-design/icons-vue'
import { deletePictureUsingPost } from '@/api/pictureController'
import router from '@/router'
import ShareModal from '@/components/ShareModal.vue'
import { downloadImage, toHexColor } from '@/utils'
interface props {
  id: string
}
const props = defineProps<props>()
const picture = ref<API.PictureVO>({})
const loginUserStore = useLoginUserStore()
const loading = ref(true)
const shareLink = ref<string>()
const shareModal = ref()

const canEdit = computed(() => {
  const loginUser = loginUserStore.loginUser
  if (!loginUser.id) {
    return false
  }
  const user = picture.value.user ?? {}
  return loginUser.id === user.id || loginUser.userRole === 'admin'
})
// 分享
const doShare = (picture: API.PictureVO, e: MouseEvent) => {
  e.stopPropagation()
  shareLink.value = window.location.protocol + '//' + window.location.host + '/picture/' + picture.id
  if(shareModal.value) {
    shareModal.value.openModal()
  }
}
// 编辑
const doEdit = () => {
  router.push({
    path: '/add-picture',
    query: {
      id: picture.value.id,
      spaceId: picture.value.spaceId,
    },
  })
}
// 删除
const doDelete = async () => {
  if (loading.value) {
    message.warning('图片数据未加载完成，无法删除')
    return
  }
  const id = picture.value.id
  if (!id) {
    return
  }
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
  } else {
    message.error('删除失败')
  }
}

// 获取图片详情
const fetchPictureDetail = async () => {
  try {
    loading.value = true
    const res = await getPictureVoByIdUsingGet({
      id: props.id as unknown as number,
    })
    if (res.data.code === 0 && res.data.data) {
      picture.value = res.data.data
      loading.value = false
    } else {
      message.error('获取图片详情失败，' + res.data.message)
      loading.value = false
    }
  } catch (e: any) {
    message.error('获取图片详情失败：' + e.message)
  }
}
const doDownload = () => {
  downloadImage(picture.value.url, picture.value.name)
}

onMounted(() => {
  fetchPictureDetail()
})
</script>

<style scoped></style>
