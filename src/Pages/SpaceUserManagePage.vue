<template>
  <div class="spaceUserManagePage">
    <h1>空间成员管理</h1>
    <a-form layout="inline" :model="formData" @finish="handleSubmit">
      <a-form-item label="用户 id" name="userId">
        <a-input v-model:value="formData.userId" placeholder="请输入用户 id" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">添加用户</a-button>
      </a-form-item>
    </a-form>
    <a-table
      class="space-user-table"
      :columns="columns"
      :data-source="dataList"
      :scroll="{ x: 'content' }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userInfo'">
          <a-avatar :src="record.user?.userAvatar"></a-avatar>
          <span>{{ record.user?.userName }}</span>
        </template>
        <template v-if="column.dataIndex === 'spaceRole'">
          <a-select
            v-model:value="record.spaceRole"
            :options="SPACE_ROLE_OPTIONS"
            @change="(value: string) => editSpaceUserRole(value, record)"
          />
        </template>

        <template v-else-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space style="max-width: 50px">
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
import { h, ref, reactive, computed, onMounted } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import {
  listSpaceUserUsingPost,
  editSpaceUserUsingPost,
  deleteSpaceUserUsingPost,
  addSpaceUserUsingPost,
} from '@/api/spaceUserController'
import { SPACE_ROLE_OPTIONS } from '@/constants/space'
import dayjs from 'dayjs'
const formData = reactive<API.SpaceUserAddRequest>({
  userId: '',
})
// 表格列
const columns = [
  {
    title: '用户',
    dataIndex: 'userInfo',
  },
  {
    title: '角色',
    dataIndex: 'spaceRole',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

const dataList = ref<API.SpaceUserVO[]>([])
interface props {
  id: string
}
const props = defineProps<props>()
const fetchDataList = async () => {
  const spaceId = props.id
  if (!spaceId) {
    return
  }
  const res = await listSpaceUserUsingPost({
    spaceId: spaceId,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data ?? []
  } else {
    message.error('获取空间成员列表失败：' + res.data.message)
  }
}
const editSpaceUserRole = async (spaceRole: string, record: API.SpaceUserVO) => {
  const res = await editSpaceUserUsingPost({
    id: record.id,
    spaceRole: spaceRole,
  })
  if (res.data.code === 0) {
    message.success('修改成功')
    fetchDataList()
  } else {
    message.error('修改失败：' + res.data.message)
  }
}
const handleDelete = async (id: string) => {
  const res = await deleteSpaceUserUsingPost({
    id: id,
  })
  if (res.data.code === 0) {
    message.success('删除成功')
    fetchDataList()
  } else {
    message.error('删除失败：' + res.data.message)
  }
}
const handleSubmit = async () => {
  const spaceId = props.id
  if (!spaceId) {
    return
  }
  const res = await addSpaceUserUsingPost({
    spaceId: spaceId,
    ...formData,
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('添加成功')
    fetchDataList()
  } else {
    message.error('添加失败：' + res.data.message)
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
