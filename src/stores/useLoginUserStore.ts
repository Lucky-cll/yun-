import { defineStore } from 'pinia'
import { ref } from 'vue'
import {getUserByIdUsingGet} from '@/api/userController'
export const useLoginUserStore = defineStore('loginUser', () => {
  const loginUser = ref<any>({
    userName:'未登录'
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
    // 测试用户登录，3 秒后登录
    setTimeout(() => {
      loginUser.value = { userName: 'test用户', id: 1 }
    }, 3000)
  }

  return { loginUser, setLoginUser, getLoginUser, fetchLoginUser }
})
