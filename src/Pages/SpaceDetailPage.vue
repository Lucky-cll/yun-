<template>
  <div class="spaceDetail">
    <!-- 空间信息 -->
    <a-flex justify="space-between">
      <h2>{{ space.spaceName }}（私有空间）</h2>
      <a-space size="middle">
        <a-button type="primary" :href="`/add-picture?spaceId=${spaceId}`" target="_blank">
          + 创建图片
        </a-button>
        <a-button :icon="h(EditOutlined)" @click="doBatchEdit"> 批量编辑</a-button>

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
    <PictureList :dataList="dataList" :loading="loading" showOp :onReload="fetchData" />
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
import { ref, onMounted, reactive, h } from 'vue'
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
import { EditOutlined } from '@ant-design/icons-vue'
import 'vue3-colorpicker/style.css'
import BatchEditPictureModal from '@/components/BatchEditPictureModal.vue'
interface props {
  id: string
}
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
</script>
<style scoped></style>
