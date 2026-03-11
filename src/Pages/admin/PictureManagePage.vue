<template>
  <div class="PictureManagePage">
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="onPageChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'url'">
          <a-image :src="record.url" :preview-src-list="[record.url]" :width="120" />
        </template>
        <template v-else-if="column.dataIndex === 'tags'">
          <a-space>
            <a-tag
              v-for="tag in JSON.parse(record.tags || '[]')"
              :key="tag"
              :color="getTagColor(tag)"
            >
              {{ tag }}
            </a-tag>
          </a-space>
        </template>
        <template v-else-if="column.dataIndex === 'picInfo'">
          <div>格式：{{ record.picFormat }}</div>
          <div>宽度：{{ record.picWidth }}</div>
          <div>高度：{{ record.picHeight }}</div>
          <div>宽高比：{{ record.picScale }}</div>
          <div>大小：{{ (record.picSize / 1024).toFixed(2) }}KB</div>
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
         {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.dataIndex === 'editTime'">
         {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.dataIndex === 'action'">
         <a-space>
          <a-button type="primary" size="small" @click="handleEdit(record.id)">编辑</a-button>
          <a-button danger size="small" @click="handleDelete(record.id)">删除</a-button>
         </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { listPictureByPageUsingPost } from '@/api/pictureController'

import { ref, onMounted, reactive, computed } from 'vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import router from '@/router'
// 颜色池（可自由增减）
const tagColors = ['blue', 'green', 'purple', 'cyan', 'magenta', 'orange', 'red', 'teal', 'gold']

// 简单哈希函数：根据标签字符串计算出一个数字，再映射到颜色池索引
const getTagColor = (tag: string) => {
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % tagColors.length
  return tagColors[index]
}
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '图片',
    dataIndex: 'url',
  },
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '简介',
    dataIndex: 'introduction',
    ellipsis: true,
  },
  {
    title: '类型',
    dataIndex: 'category',
  },
  {
    title: '标签',
    dataIndex: 'tags',
  },
  {
    title: '图片信息',
    dataIndex: 'picInfo',
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
    title: '操作',
    key: 'action',
    dataIndex: 'action',
  },
]

const dataList = ref<API.Picture[]>([])
const total = ref<number>(0)
const searchParams = reactive({
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
  const res = await listPictureByPageUsingPost({
    ...searchParams,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取图片列表失败：' + res.data.message)
  }
}
const onPageChange = (page: number, pageSize: number) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  fetchDataList()
}
const handleEdit = (id: number) => {
  router.push({
    path: '/add-picture',
    query: {
      id: id,
    },
  })
}
const handleDelete = (id: number) => {


}
onMounted(() => {
  fetchDataList()
})
</script>
