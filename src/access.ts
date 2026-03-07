import { message } from 'ant-design-vue'
import router from './router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
let firstFetchLoginUser: boolean = true

router.beforeEach(async (to, from, next) => {
  const loginUserStore = useLoginUserStore()
  let loginUser = loginUserStore.loginUser
  if (firstFetchLoginUser) {
    await loginUserStore.fetchLoginUser()
    loginUser = loginUserStore.loginUser
    firstFetchLoginUser = false
  }
  const toUrl = to.path
  if(toUrl.startsWith('/admin')){
    if(!loginUser || loginUser.userRole !== 'admin'){
      message.error('非管理员用户，不能访问管理员页面')
      next('/user/login')
      return
    }
  }
  next()
})
