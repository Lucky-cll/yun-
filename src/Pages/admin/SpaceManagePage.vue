<template>
  <div class="spaceManagePage">
    <a-flex justify="space-between">
      <h1>空间管理</h1>
      <a-space>
        <a-space>
          <a-button type="primary" href="/add-space" target="_blank">+ 创建空间</a-button>
          <a-button type="primary" ghost href="/space-analyze?queryPublic=1" target="_blank">
            分析公共图库
          </a-button>
          <a-button type="primary" ghost href="/space-analyze?queryAll=1" target="_blank">
            分析全空间
          </a-button>
        </a-space>
      </a-space>
    </a-flex>
    <a-form style="margin-bottom: 10px" layout="inline" :model="searchParams" @finish="doFinish">
      <a-form-item label="空间名称" name="spaceName">
        <a-input v-model:value="searchParams.spaceName" placeholder="根据空间名称输入" allowClear>
        </a-input>
      </a-form-item>
      <a-form-item label="空间级别" name="spaceLevel">
        <a-select
          v-model:value="searchParams.spaceLevel"
          :options="SPACE_LEVEL_OPTIONS"
          placeholder="请输入空间级别"
          style="min-width: 180px"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="用户id" name="userId">
        <a-input v-model:value="searchParams.userId" placeholder="请输入用户id" allowClear>
        </a-input>
      </a-form-item>
      <a-form-item label="空间类别" name="spaceType">
        <a-select
          v-model:value="searchParams.spaceType"
          :options="SPACE_TYPE_OPTIONS"
          placeholder="请输入空间类别"
          style="min-width: 180px"
          allow-clear
        />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit"> 查询 </a-button>
      </a-form-item>
    </a-form>
    <a-table
      class="space-table"
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="onPageChange"
      :scroll="{ x: 'content' }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'spaceLevel'">
          <a-tag>{{ SPACE_LEVEL_MAP[record.spaceLevel as keyof typeof SPACE_LEVEL_MAP] }}</a-tag>
        </template>
        <template v-if="column.dataIndex === 'spaceUseInfo'">
          <div>大小：{{ formatSize(record.totalSize) }}/{{ formatSize(record.maxSize) }}</div>
          <div>图片数量：{{ record.totalCount }}/{{ record.maxCount }}</div>
        </template>
        <!-- 空间类别 -->
        <template v-if="column.dataIndex === 'spaceType'">
          <a-tag>{{ SPACE_TYPE_MAP[record.spaceType] }}</a-tag>
        </template>

        <template v-else-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.dataIndex === 'editTime'">
          {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.dataIndex === 'action'">
          <a-space style="max-width: 50px">
            <a-button type="link" size="small" :href="`/add-space?id=${record.id}`">编辑</a-button>
            <a-button danger type="link" size="small" @click="handleDelete(record.id)"
              >删除</a-button
            >
            <a-button type="link" :href="`/space-analyze?spaceId=${record.id}`" target="_blank"
              >分析</a-button
            >
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { h, ref, reactive, computed, onMounted } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { listSpaceByPageUsingPost, deleteSpaceUsingPost } from '@/api/spaceController'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { SPACE_LEVEL_MAP, SPACE_LEVEL_OPTIONS, SPACE_TYPE_MAP , SPACE_TYPE_OPTIONS} from '@/constants/space.ts'
import dayjs from 'dayjs'
import { formatSize } from '@/utils/index.ts'
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '空间名称',
    dataIndex: 'spaceName',
  },
  {
    title: '空间级别',
    dataIndex: 'spaceLevel',
  },
  {
    title: '空间类别',
    dataIndex: 'spaceType',
  },

  {
    title: '使用情况',
    dataIndex: 'spaceUseInfo',
  },
  {
    title: '用户 id',
    dataIndex: 'userId',
    width: 80,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '编辑时间',
    dataIndex: 'editTime',
  },
  {
    dataIndex: 'action',
    title: '操作',
    key: 'action',
  },
]
const dataList = ref<API.SpaceVO[]>([])
const total = ref<number>(0)
const searchParams = reactive<API.SpaceQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
})
const pagination = computed(() => {
  return {
    current: searchParams.current ?? 1,
    pageSize: searchParams.pageSize ?? 10,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total: number) => `共 ${total} 条`,
    locale: {
      ...zhCN,
      items_per_page: '条/页',
      jump_to: '跳至',
    },
  }
})
const fetchDataList = async () => {
  const res = await listSpaceByPageUsingPost({
    ...searchParams,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取空间列表数据失败：' + res.data.message)
  }
}
const onPageChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchDataList()
}
const doFinish = () => {
  searchParams.current = 1
  fetchDataList()
}
const handleDelete = async (id: number) => {
  const res = await deleteSpaceUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除空间成功')
    fetchDataList()
  } else {
    message.error('删除空间失败：' + res.data.message)
  }
}
onMounted(() => {
  fetchDataList()
})
</script>
<style scoped>
.space-table :deep(.ant-table-thead > tr > th) {
  text-align: center !important; /* !important 确保覆盖默认样式 */
}
.space-table :deep(.ant-table-tbody > tr > td) {
  text-align: center;
}
</style>
