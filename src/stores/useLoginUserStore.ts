import { defineStore } from 'pinia'
import { ref } from 'vue'
import {getUserByIdUsingGet, getLoginUserUsingGet} from '@/api/userController'
export const useLoginUserStore = defineStore('loginUser', () => {
  const loginUser = ref<API.LoginUserVO>({
    userName: '未登录',
  })
  function setLoginUser(newLoginUser:any) {
    loginUser.value = newLoginUser
  }
  async function getLoginUser() {
    // const res = await getCurrentUser()
    // if (res.data.code === 20000) {
    //   setLoginUser(res.data.data)
    // }
  }
  async function fetchLoginUser() {
   const res = await getLoginUserUsingGet()
   if(res.data.code === 0 && res.data.data){
    loginUser.value = res.data.data
   }
  }

  return { loginUser, setLoginUser, getLoginUser, fetchLoginUser }
})
