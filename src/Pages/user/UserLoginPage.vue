<template>
  <div class="userLoginPage">
    <h1>智能云图库-用户登录</h1>
    <div class="desc">企业级智能协同云图库</div>

    <a-form
      :model="formState"
      layout="vertical"
      autocomplete="off"
      @finish="handleLoginSubmit"
      @finishFailed="handleLoginSubmitFailed"
      class="login-form"
    >
      <a-form-item
        name="userAccount"
        :rules="[{ required: true, message: '请输入用户名' }]"
      >
        <a-input v-model:value="formState.userAccount" placeholder="请输入用户名" />
      </a-form-item>

      <a-form-item
        name="userPassword"
        :rules="[{ required: true, message: '请输入用户密码', min: 8 }]"
      >
        <a-input-password v-model:value="formState.userPassword" placeholder="请输入用户密码" />
      </a-form-item>
      <div class="tips">
        没有密码?
        <RouterLink to="/user/register">点击注册</RouterLink>
      </div>

      <a-form-item>
        <a-button class="login-btn" type="primary" html-type="submit">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import { userLoginUsingPost } from '@/api/userController'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const loginUserStore = useLoginUserStore()

const formState = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
})
const handleLoginSubmit = async  (values: any) => {
  const res = await userLoginUsingPost(values)
  if(res.data.code === 0 && res.data.data){
    await loginUserStore.fetchLoginUser()
    message.success('登录成功')
    router.push({
      path: '/',
      replace: true
    })
  }else{
    message.error("登录失败："+res.data.message)
  }
}

const handleLoginSubmitFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
</script>
<style scoped>
h1 {
  font-size: 36px;
  text-align: center;
}
.desc {
  font-size: 18px;
  text-align: center;
  margin-bottom: 30px;
  color: #888;
}
.userLoginPage {
  margin: 0 auto;
  max-width: 560px;
  background-image: url('@/assets/你的背景图.jpg');
  background-size: cover; /* 背景图铺满容器 */
  background-position: center; /* 背景图居中 */
  background-repeat: no-repeat; /* 禁止重复 */
}
.login-btn {
  width: 100%;
}
.tips {
  font-size: 14px;
  text-align: right;
  margin-bottom: 10px;
}
</style>
