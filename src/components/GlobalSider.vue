<template>
  <div class="globalSider">
    <a-layout-sider
      v-if="loginUserStore.loginUser.id"
      class="sider"
      breakpoint="lg"
      width="200"
      collapsed-width="0"
    >
      <a-menu v-model:selectedKeys="current" mode="inline" :items="items" @click="doMenuclick">
      </a-menu>
    </a-layout-sider>
  </div>
</template>
<script lang="ts" setup>
import { ref, watchEffect,h, computed, } from 'vue'
import { useRouter } from 'vue-router'
import { PictureOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons-vue'
import { SPACE_TYPE_ENUM } from '@/constants/space.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { listMyTeamSpaceUsingPost } from '@/api/spaceUserController'
import { message } from 'ant-design-vue'
const loginUserStore = useLoginUserStore()
const router = useRouter()

const fixeditems = [
  {
    key: '/',
    icon: () => h(PictureOutlined),
    label: '公共空间',
    title: '公共空间',
  },
  {
    key: '/my-space',
    icon: () => h(UserOutlined),
    label: '私人空间',
    title: '私人空间',
  },
  {
    key: '/add-space?type='+SPACE_TYPE_ENUM.TEAM,
    label: '创建团队',
    title: '创建团队',
    icon: () => h(TeamOutlined),
  }
]
const teamSpaceList = ref<API.SpaceUserVO[]>([])
const items = computed(() => {
  if(teamSpaceList.value.length < 0){
    return fixeditems
  }
  const teamSpaceItems = teamSpaceList.value.map((spaceUser) => {
    const space = spaceUser.space
    return {
      key: '/space/' + spaceUser.spaceId,
      label: space?.spaceName,
    }
  })
   const teamSpaceMeunGrop = {
      type: 'group',
      label: '我的团队',
      key:'teamSpace',
      children: teamSpaceItems,
    }
    return [...fixeditems,teamSpaceMeunGrop]
})

const fetchMyTeamSpaceList = async () => {
  const res = await listMyTeamSpaceUsingPost()
  if(res.data.code === 0 && res.data.data){
    teamSpaceList.value = res.data.data
  }else{
    message.error(res.data.message + '获取团队空间失败')
  }
}

const current = ref(['/'])
router.afterEach((to, from, next) => {
  current.value = [to.path]
})
const doMenuclick = ({ key }: { key: string }) => {
  //router.push({path:key})
  router.push(key)
}
watchEffect(() => {
  if(loginUserStore.loginUser.id){
    fetchMyTeamSpaceList()
  }
})
</script>
<style scoped>
.globalSider {
  background-color: white !important;
}
.globalSider :deep(.ant-layout-sider) {
  background: none !important;
}
</style>
