<template>
  <div id="homePage">
    <a-input-search
      class="search-bar"
      v-model:value="searchParams.searchText"
      placeholder="从海量图片中搜索"
      enter-button
      @search="onSearch"
    />
    <a-tabs v-model:activeKey="selectedCategory" @change="onSearch">
      <a-tab-pane key="all" tab="全部"></a-tab-pane>
      <a-tab-pane v-for="category in categoryList" :key="category" :tab="category"></a-tab-pane>
    </a-tabs>
    <div class="tags-bar">
      <span style="margin-right: 8px">标签:</span>
      <a-space :size="[0, 8]" wrap>
        <a-checkable-tag
          v-for="(tag, index) in tagList"
          :key="tag"
          v-model:checked="selectedTagList[index]"
          @change="onSearch"
        >
          {{ tag }}
        </a-checkable-tag>
      </a-space>
    </div>
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
      :loading="loading"
      :pagination="pagination"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item>
          <a-card hoverable @click="doPictureClick(picture)">
            <template #cover>
              <img alt="picture.name" loading="lazy" :src="picture.thumbnailUrl??picture.url" style="height: 120px; object-fit: cover" />
            </template>
            <a-card-meta :title="picture.name">
              <template #description>
                <a-flex>
                  <a-tag color="pink">{{ picture.category ?? '默认' }}</a-tag>
                  <a-tag v-for="tag in picture.tags" :color="getTagColor(tag)" :key="tag">{{
                    tag
                  }}</a-tag>
                </a-flex>
              </template>
            </a-card-meta>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { listPictureVoByPageUsingPost } from '@/api/pictureController'
import { message } from 'ant-design-vue'
import { listPictureTagCategoryUsingGet } from '@/api/pictureController'
import router from '@/router'
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
const total = ref(0)
const dataList = ref<API.PictureVO[]>([])
const loading = ref(false)
const selectedCategory = ref<string>('all')
const categoryList = ref<string[]>([])
const tagList = ref<string[]>([])
const selectedTagList = ref<string[]>([])
const searchParams = reactive({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
  searchText: '',
})
const pagination = computed(() => {
  return {
    total: total.value,
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    onChange: (current: number, pageSize: number) => {
      searchParams.current = current
      searchParams.pageSize = pageSize
      fetchData()
    },
  }
})
const fetchData = async () => {
  loading.value = true
  const params = {
    ...searchParams,
    category: '',
    tags: [] as string[],
  }
  if (selectedCategory.value !== 'all') {
    params.category = selectedCategory.value
  }
  if (selectedTagList.value.length > 0) {
    selectedTagList.value.forEach((item, index) => {
      if (item) {
        params.tags.push(tagList.value[index])
      }
    })
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
const onSearch = () => {
  searchParams.current = 1
  fetchData()
}
const getTagCotegoryOptions = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    categoryList.value = res.data.data.categoryList ?? []
    tagList.value = res.data.data.tagList ?? []
  } else {
    message.error('获取标签分类失败：' + res.data.message)
  }
}
const doPictureClick = (picture: API.PictureVO) => {
  router.push({
    name: '图片详情',
    params: {
      id: picture.id,
    },
  })
}
onMounted(() => {
  getTagCotegoryOptions()
  fetchData()
})
</script>
<style scoped>
.search-bar {
  display: block;
  max-width: 450px;
  margin: 0 auto 36px;
}
.tags-bar {
  margin-bottom: 16px;
}
</style>
