import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { message } from 'ant-design-vue'
import router from '@/router'

// 区分开发和生产环境
const DEV_BASE_URL = "http://localhost:8123";
const PROD_BASE_URL = 'http://47.95.234.67'
// 创建 Axios 实例
const myAxios = axios.create({
  baseURL: PROD_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});


// 添加请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 添加响应拦截器
myAxios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    const { data } = response

    // 严格按照后端 ErrorCode 处理
    if (data.code === 40000) {
      message.error(data.message)
    } else if (data.code === 40100) {
      message.error(data.message)
      // 核心：确保能拿到当前路由地址
      const currentPath = router.currentRoute.value.path
      // 不是首页，才跳转登录
      if (currentPath !== '/') {
        router.push('/user/login')
      }
    } else if (data.code === 40101) {
      message.error(data.message)
    } else if (data.code === 40300) {
      message.error(data.message)
    } else if (data.code === 40400) {
      message.error(data.message)
    } else if (data.code === 50000) {
      message.error(data.message)
    } else if (data.code === 50001) {
      message.error(data.message)
    }

    return response
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error)
  },
)

export default myAxios
