<template>
  <div class="userManagePage">
    <!-- 搜索表单 -->
    <a-form :model="searchParams" layout="inline">
      <a-form-item label="用户名">
        <a-input v-model:value="searchParams.userName" placeholder="请输入用户名" />
      </a-form-item>
      <a-form-item label="用户账号">
        <a-input v-model:value="searchParams.userAccount" placeholder="请输入用户账号" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSearch">查询</a-button>
      </a-form-item>
    </a-form>

    <!-- 用户列表 -->
    <a-table
      :columns="columns"
      :data-source="dataList"
      class="userManageTable"
      :pagination="pagination"
      @change="doPageChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userAvatar'">
          <a-image :src="record.userAvatar" style="width: 40px" alt="userAvatar" />
        </template>
        <template v-else-if="column.dataIndex === 'userRole'">
          <div v-if="record.userRole === 'admin'">
            <a-tag color="green">管理员</a-tag>
          </div>
          <div v-else>
            <a-tag color="blue">普通用户</a-tag>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.dataIndex === 'updateTime'">
          {{ dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button danger @click="doDelete(record.id)">删除</a-button>
            <a-button type="primary" @click="doUpdate(record.id)">编辑</a-button>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 编辑用户弹窗 -->
    <a-modal
      v-model:open="updateModalVisible"
      title="编辑用户信息"
      confirm-text="提交修改"
      cancel-text="取消"
      @ok="handleUpdateSubmit"
      @cancel="handleUpdateCancel"
    >
      <a-form
        :model="updateForm"
        label-col="{ span: 6 }"
        wrapper-col="{ span: 18 }"
        layout="horizontal"
      >
        <a-form-item label="用户ID（不可改）">
          <a-input v-model:value="updateForm.id" disabled />
        </a-form-item>
        <a-form-item label="用户账号">
          <a-input v-model:value="updateForm.userAccount"/>
        </a-form-item>
        <a-form-item label="用户名">
          <a-input v-model:value="updateForm.userName" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="用户头像">
          <a-input v-model:value="updateForm.userAvatar" placeholder="请输入头像URL" />
        </a-form-item>
        <a-form-item label="用户简介">
          <a-input v-model:value="updateForm.userProfile" placeholder="请输入用户简介" />
        </a-form-item>
        <a-form-item label="用户角色">
          <a-select v-model:value="updateForm.userRole" placeholder="请选择用户角色">
            <a-select-option value="admin">管理员</a-select-option>
            <a-select-option value="user">普通用户</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { listUserVoByPageUsingPost } from '@/api/userController'
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue'
import { ref, reactive, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { deleteUserUsingPost } from '@/api/userController'
// 新增：导入查询单个用户、更新用户的接口（需要你根据后端实际接口调整）
import { getUserByIdUsingGet } from '@/api/userController'
import { updateUserUsingPost } from '@/api/userController'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
  },
  {
    title: '简介',
    dataIndex: 'userProfile',
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

const dataList = ref<API.UserVO[]>([])
const total = ref<number>(0)

// 搜索条件
const searchParams = reactive<API.UserQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
  userAccount: '',
  userName: '',
})

// 分页参数
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
      page: '页',
    },
  }
})

// 分页变化
const doPageChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

// 查询用户列表
const fetchData = async () => {
  const res = await listUserVoByPageUsingPost({ ...searchParams })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = Number(res.data.data.total) ?? 0
    console.log(total.value + '条')
  } else {
    message.error('查询用户列表失败：' + res.data.message)
  }
}

// 搜索
const doSearch = () => {
  searchParams.current = 1
  fetchData()
}

// 删除用户
const doDelete = async (id: number) => {
  const res = await deleteUserUsingPost({ id })
  if (res.data.code === 0 && res.data.data) {
    message.success('删除成功')
    fetchData()
  } else {
    message.error('删除失败：' + res.data.message)
  }
}

// ---------------------- 新增：编辑用户相关逻辑 ----------------------
// 编辑弹窗显隐
const updateModalVisible = ref<boolean>(false)
// 编辑表单数据
const updateForm = reactive<API.UserVO>({
  id: 0,
  userAccount: '',
  userName: '',
  userAvatar: '',
  userProfile: '',
  userRole: '',
})

// 点击编辑按钮
const doUpdate = async (id: number) => {
  try {
    // 1. 根据ID查询用户详情
    const res = await getUserByIdUsingGet({ id })
    if (res.data.code === 0 && res.data.data) {
      // 2. 回显用户信息到表单
      const userInfo = res.data.data
      updateForm.id = userInfo.id
      updateForm.userAccount = userInfo.userAccount
      updateForm.userName = userInfo.userName
      updateForm.userAvatar = userInfo.userAvatar
      updateForm.userProfile = userInfo.userProfile
      updateForm.userRole = userInfo.userRole
      // 3. 打开弹窗
      updateModalVisible.value = true
    } else {
      message.error('获取用户信息失败：' + res.data.message)
    }
  } catch (err) {
    message.error('获取用户信息失败：网络异常')
  }
}

// 关闭编辑弹窗（取消）
const handleUpdateCancel = () => {
  updateModalVisible.value = false
  // 清空表单（可选）
  resetUpdateForm()
}

// 重置编辑表单
const resetUpdateForm = () => {
  updateForm.id = 0
  updateForm.userAccount = ''
  updateForm.userName = ''
  updateForm.userAvatar = ''
  updateForm.userProfile = ''
  updateForm.userRole = ''
}

// 提交编辑表单
const handleUpdateSubmit = async () => {
  try {
    // 1. 调用更新用户接口
    const res = await updateUserUsingPost(updateForm)
    if (res.data.code === 0) {
      message.success('修改用户信息成功')
      // 2. 关闭弹窗
      updateModalVisible.value = false
      // 3. 刷新用户列表
      fetchData()
      // 4. 重置表单
      resetUpdateForm()
    } else {
      message.error('修改失败：' + res.data.message)
    }
  } catch (err) {
    message.error('修改失败：网络异常')
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.userManageTable {
  margin-top: 20px;
}
</style>
