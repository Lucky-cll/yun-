<template>
  <div class="spaceDetail">
    <!-- 空间信息 -->
    <a-flex justify="space-between">
      <h2 v-if="space.spaceType === 1">{{ space.spaceName }}(团队空间)</h2>
      <h2 v-else>{{ space.spaceName }}（私有空间）</h2>

      <a-space size="middle">
        <a-button
          type="primary"
          v-if="canUploadPicture"
          :href="`/add-picture?spaceId=${spaceId}`"
          target="_blank"
        >
          + 创建图片
        </a-button>
        <a-button
          type="primary"
          ghost
          :icon="h(TeamOutlined)"
          :href="`/spaceUserManage/${id}`"
          target="_blank"
          v-if="canManageSpaceUser"
        >
          成员管理
        </a-button>

        <a-button
          :icon="h(BarChartOutlined)"
          :href="`/space-analyze?spaceId=${spaceId}`"
          target="_blank"
          type="primary"
          ghost
        >
          空间分析</a-button
        >
        <a-button :icon="h(EditOutlined)" @click="doBatchEdit" v-if="canEditPicture">  批量编辑</a-button>

        <a-tooltip
          :title="`占用空间 ${formatSize(space.totalSize)} / ${formatSize(space.maxSize)}`"
        >
          <a-progress
            type="circle"
            :size="42"
            :percent="
              space.totalSize && space.maxSize
                ? ((space.totalSize * 100) / space.maxSize).toFixed(1)
                : 0
            "
          />
        </a-tooltip>
      </a-space>
    </a-flex>
    <PictureSearchForm :onSearch="onSearch" />
    <!-- 按颜色搜索 -->
    <a-form-item label="按颜色搜索" style="margin-top: 16px">
      <color-picker format="hex" @pureColorChange="onColorChange" />
    </a-form-item>
    <BatchEditPictureModal
      ref="batchEditPictureModalRef"
      :spaceId="spaceId"
      :onSuccess="onBatchPictureEditSuccess"
      :pictureList="dataList"
    />
    <!-- 图片列表 -->
    <PictureList :dataList="dataList" :loading="loading"  :canEdit="canEditPicture" :canDelete="canDeletePicture" showOp :onReload="fetchData" />
    <a-pagination
      style="text-align: right"
      v-model:current="searchParams.current"
      v-model:pageSize="searchParams.pageSize"
      :total="total"
      :show-total="() => `图片总数 ${total} / ${space.maxCount}`"
      @change="onPageChange"
    />
  </div>
</template>
<script setup lang="ts">
import PictureSearchForm from '@/components/PictureSearchForm.vue'
import { ref, onMounted, reactive, h, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getSpaceVoByIdUsingGet } from '@/api/spaceController'
import {
  listPictureVoByPageUsingPost,
  searchPictureByColorUsingPost,
} from '@/api/pictureController'
import { message } from 'ant-design-vue'
import { formatSize } from '@/utils/index'
import PictureList from '@/components/PictureList.vue'
import { ColorPicker } from 'vue3-colorpicker'
import { BarChartOutlined, EditOutlined, TeamOutlined } from '@ant-design/icons-vue'
import 'vue3-colorpicker/style.css'
import { computed } from 'vue'
import { SPACE_PERMISSION_ENUM } from '@/constants/space'
import BatchEditPictureModal from '@/components/BatchEditPictureModal.vue'
interface props {
  id: string
}
// 通用权限检查函数
function createPermissionChecker(permission: string) {
  return computed(() => {
    return (space.value.permissionList ?? []).includes(permission)
  })
}

// 定义权限检查
const canManageSpaceUser = createPermissionChecker(SPACE_PERMISSION_ENUM.SPACE_USER_MANAGE)
const canUploadPicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_UPLOAD)
const canEditPicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_EDIT)
const canDeletePicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_DELETE)

const props = defineProps<props>()
const spaceId = props.id
const space = ref<API.SpaceVO>({})
const batchEditPictureModalRef = ref()
const onSearch = (newSearchParams: API.PictureQueryRequest) => {
  // 完全替换，不要 ... 展开旧的 searchParams
  searchParams.value = {
    ...newSearchParams,
    current: 1,
    pageSize: 12,
    sortField: 'createTime',
    sortOrder: 'descend',
  }
  fetchData()
}
const doBatchEdit = () => {
  if (batchEditPictureModalRef.value) {
    batchEditPictureModalRef.value.openModal()
  }
}
const onBatchPictureEditSuccess = () => {
  fetchData()
}

const onColorChange = async (color: string) => {
  const res = await searchPictureByColorUsingPost({
    picColor: color,
    spaceId: props.id,
  })
  if (res.data.code === 0 && res.data.data) {
    const data = res.data.data ?? []
    dataList.value = data
    total.value = data.length
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}

const fetchSpaceDetail = async () => {
  try {
    const res = await getSpaceVoByIdUsingGet({ id: spaceId })
    if (res.data.code === 0 && res.data.data) {
      space.value = res.data.data
    } else {
      message.error('获取空间详情失败：' + res.data.message)
    }
  } catch (e: any) {
    message.error('获取空间详情失败：' + e.message)
  }
}
onMounted(() => {
  fetchSpaceDetail()
})
const total = ref<number>(0)
const dataList = ref<API.PictureVO[]>([])
const loading = ref(true)
const searchParams = ref<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
})
const onPageChange = (current: number, pageSize: number) => {
  searchParams.value.current = current
  searchParams.value.pageSize = pageSize
  fetchData()
}
const fetchData = async () => {
  loading.value = true
  const params = {
    ...searchParams.value,
    spaceId: spaceId,
  }
  const res = await listPictureVoByPageUsingPost(params)
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data?.records ?? []
    total.value = res.data.data?.total ?? 0
  } else {
    message.error('获取图片列表失败：' + res.data.message)
  }
  loading.value = false
}

onMounted(() => {
  fetchData()
})
watch(
  () => props.id,
  (newSpaceId) => {
    fetchSpaceDetail()
    fetchData()
  },
)
</script>
<style scoped></style>
