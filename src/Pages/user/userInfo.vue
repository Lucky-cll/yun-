<template>
  <h1>用户信息</h1>
  <div class="userInfoPage">
    <a-card title="个人信息" class="info-card">
      <!-- 基础信息展示与修改 -->
      <a-form
        :model="userForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        layout="horizontal"
      >
        <a-form-item label="用户ID">
          <a-input v-model:value="userForm.id" disabled />
        </a-form-item>
        <a-form-item label="用户账号">
          <a-input v-model:value="userForm.userAccount" disabled />
        </a-form-item>
        <a-form-item label="用户名">
          <a-input v-model:value="userForm.userName" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="用户头像">
          <div class="avatar-group">
            <a-image :src="userForm.userAvatar" style="width: 80px; height: 80px; object-fit: cover; margin-bottom: 10px;" alt="头像" />
            <a-input v-model:value="userForm.userAvatar" placeholder="请输入头像URL" />
          </div>
        </a-form-item>
        <a-form-item label="用户简介">
          <a-textarea
            v-model:value="userForm.userProfile"
            :rows="4"
            placeholder="请输入用户简介"
          />
        </a-form-item>
        <a-form-item label="用户角色">
          <a-tag v-if="userForm.userRole === 'admin'" color="green">管理员</a-tag>
          <a-tag v-else color="blue">普通用户</a-tag>
        </a-form-item>
        <a-form-item label="创建时间">
          <a-input v-model:value="createTimeFormat" disabled />
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 6 }">
          <a-button type="primary" @click="saveUserInfo" :loading="saveLoading">保存修改</a-button>
        </a-form-item>
      </a-form>
    </a-card>


  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { getUserByIdUsingGet, updateUserUsingPost, userLogoutUsingPost } from '@/api/userController'

const router = useRouter()
const userStore = useLoginUserStore()

// 加载状态
const saveLoading = ref(false);
const pwdLoading = ref(false);

// 用户表单数据
const userForm = reactive({
  id: undefined,
  userAccount: '',
  userName: '',
  userAvatar: '',
  userProfile: '',
  userRole: '',
  createTime: '',
  updateTime: ''
})

// 创建时间格式化
const createTimeFormat = computed(() => {
  if (!userForm.createTime) return ''
  // 将时间戳转换为 YYYY-MM-DD HH:mm:ss 格式
  const date = new Date(userForm.createTime)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
})

// 获取用户信息
const fetchUserInfo = async () => {
  // 未登录则跳转到登录页
  if (!userStore.loginUser.id) {
    message.warning('请先登录')
    router.push('/user/login')
    return
  }

  try {
    // 根据当前登录用户ID查询详情 - 使用正确的GET接口
    const res = await getUserByIdUsingGet({ id: userStore.loginUser.id })
    if (res.data.code === 0 && res.data.data) {
      const userInfo = res.data.data
      // 回显用户信息
      Object.assign(userForm, {
        id: userInfo.id,
        userAccount: userInfo.userAccount,
        userName: userInfo.userName,
        userAvatar: userInfo.userAvatar || '',
        userProfile: userInfo.userProfile || '',
        userRole: userInfo.userRole || '',
        createTime: userInfo.createTime || '',
        updateTime: userInfo.updateTime || ''
      })
    } else {
      message.error('获取个人信息失败：' + res.data.message)
    }
  } catch (err: any) {
    console.error('获取个人信息失败', err)
    message.error(err.message || '获取个人信息失败：网络异常')
  }
}

// 保存个人信息修改
const saveUserInfo = async () => {
  // 基本验证
  if (!userForm.userName?.trim()) {
    message.error('用户名不能为空')
    return
  }

  saveLoading.value = true;
  try {
    // 调用更新用户接口
    const res = await updateUserUsingPost({
      id: userForm.id,
      userName: userForm.userName,
      userAvatar: userForm.userAvatar,
      userProfile: userForm.userProfile
    })

    if (res.data.code === 0) {
      message.success('个人信息修改成功')
      // 更新Pinia中的用户信息（同步到全局）
      userStore.setLoginUser({
        ...userStore.loginUser,
        userName: userForm.userName,
        userAvatar: userForm.userAvatar,
        userProfile: userForm.userProfile
      })

      // 重新获取最新用户信息
      await fetchUserInfo()
    } else {
      message.error('修改失败：' + res.data.message)
    }
  } catch (err: any) {
    console.error('修改用户信息失败', err)
    message.error(err.message || '修改失败：网络异常')
  } finally {
    saveLoading.value = false;
  }
}


onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
h1{
  text-align: center;

  margin-top: 10px;
}
.userInfoPage {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.info-card, .pwd-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.avatar-group img {
  margin-bottom: 10px;
}
</style>
