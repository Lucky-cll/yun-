<template>
  <div class="PictureManagePage">
    <a-flex justify="space-between">
      <h2 style="font-size: 30px">图片管理</h2>
      <a-space>
        <a-button type="primary" href="/add-picture" target="_blank">+ 创建图片</a-button>
        <a-button type="primary" href="/add-picture/Batch" target="_blank" ghost
          >+ 批量创建图片</a-button
        >
      </a-space>
    </a-flex>

    <a-form style="margin-bottom: 10px" layout="inline" :model="searchParams" @finish="doFinish">
      <a-form-item label="关键词" name="searchText">
        <a-input
          v-model:value="searchParams.searchText"
          placeholder="根据简介和名称输入"
          allowClear
        >
        </a-input>
      </a-form-item>
      <a-form-item label="图片类型" name="category">
        <a-input v-model:value="searchParams.category" placeholder="请输入图片类型" allowClear>
        </a-input>
      </a-form-item>
      <a-form-item label="图片标签" name="tags">
        <a-select
          mode="tags"
          v-model:value="searchParams.tags"
          placeholder="请输入图片标签"
          style="min-width: 180px"
          allowClear
        />
      </a-form-item>
      <a-form-item label="审核状态" name="reviewStatus">
        <a-select
          v-model:value="searchParams.reviewStatus"
          :options="PIC_REVIEW_STATUS_OPTIONS"
          placeholder="请输入审核状态"
          style="min-width: 180px"
          allow-clear
        />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit"> 查询 </a-button>
      </a-form-item>
    </a-form>
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="onPageChange"
      :scroll="{ x: 'content' }"
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
        <!-- 审核信息 -->
        <template v-if="column.dataIndex === 'reviewMessage'">
          <div>
            审核状态：{{
              PIC_REVIEW_STATUS_MAP[record.reviewStatus as keyof typeof PIC_REVIEW_STATUS_MAP]
            }}
          </div>
          <div>审核信息：{{ record.reviewMessage }}</div>
          <div>审核人：{{ record.reviewerId }}</div>
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
          <a-space wrap style="max-width: 50px">
            <a-button
              v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.PASS"
              type="link"
              size="small"
              @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.PASS)"
              >通过</a-button
            >
            <a-button
              v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.REJECT"
              type="link"
              size="small"
              @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.REJECT)"
              >拒绝</a-button
            >

            <a-button type="link" size="small" @click="handleEdit(record.id)">编辑</a-button>
            <a-button danger type="link" size="small" @click="handleDelete(record.id)"
              >删除</a-button
            >
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import {
  listPictureByPageUsingPost,
  deletePictureUsingPost,
  doPictureReviewUsingPost,
} from '@/api/pictureController'

import { ref, onMounted, reactive, computed } from 'vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import router from '@/router'
import {
  PIC_REVIEW_STATUS_MAP,
  PIC_REVIEW_STATUS_ENUM,
  PIC_REVIEW_STATUS_OPTIONS,
} from '@/constants/picture'
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
    width: 50,
    ellipsis: true,
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
    title: '审核信息',
    dataIndex: 'reviewMessage',
  },
  {
    title: '图片信息',
    dataIndex: 'picInfo',
  },
  {
    title: '用户 id',
    dataIndex: 'userId',
    width: 50,
    ellipsis: true,
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
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
  searchText: '',
  category: '',
  tags: [],
  reviewStatus: undefined as number | undefined,
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
const onPageChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
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
const doFinish = () => {
  searchParams.current = 1
  fetchDataList()
}
const handleDelete = async (id: number) => {
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 0 && res.data.data) {
    message.success('删除成功')
    fetchDataList()
  } else {
    message.error('删除失败：' + res.data.message)
  }
}
const handleReview = async (record: API.Picture, reviewStatus: number) => {
  const reviewMessage =
    reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS ? '管理员审核通过' : '管理员审核拒绝'
  const res = await doPictureReviewUsingPost({
    id: record.id,
    reviewStatus,
    reviewMessage,
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('审核操作成功')
    fetchDataList()
  } else {
    message.error('审核操作失败：' + res.data.message)
  }
}
onMounted(() => {
  fetchDataList()
})
</script>
