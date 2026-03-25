<template>
  <div class="mySpace">
    <p>正在跳转,请稍后...</p>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { listSpaceVoByPageUsingPost } from '@/api/spaceController'
import { message } from 'ant-design-vue'
const router = useRouter()
const loginUserStore = useLoginUserStore()
const checkUSerSpace = async () => {
  const loginUser = loginUserStore.loginUser
  if (!loginUser?.id) {
    router.replace('/user/login')
    return
  }
  const res = await listSpaceVoByPageUsingPost({
    current: 1,
    pageSize: 1,
    userId: loginUser.id,
  })
  if(res.data.code === 0){
    if(res.data?.data?.records && res.data?.data?.records?.length > 0){
      const space = res.data?.data?.records[0]
      router.replace(`/space/${space.id}`)
    }else{
      router.replace('/add-space')
      message.warn('您暂无空间,请先创建空间')
    }
  }else{
    message.error('获取空间失败' + res.data.message)
  }
}
onMounted(() => {
  checkUSerSpace()
})
</script>
<style scoped></style>
