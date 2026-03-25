<template>
  <a-modal
    v-model:visible="visible"
    :footer="false"
    :title="title"
    width="420px"
    @cancel="closeModal"
    class="share-modal"
  >
    <div class="share-box">
      <!-- 分享链接 -->
      <div class="section link-section">
        <div class="label">
          <span class="icon">🔗</span> 分享链接
        </div>
        <a-input
          :value="link"
          readonly
          class="link-input"
        >
          <template #addonAfter>
            <a-button type="primary" size="small" @click="copyLink" class="copy-btn">
              复制
            </a-button>
          </template>
        </a-input>
      </div>

      <!-- 二维码 -->
      <div class="section qrcode-section">
        <div class="label">
          <span class="icon">📱</span> 扫码访问
        </div>
        <div class="qrcode-box">
          <a-qrcode :value="link || ''" :size="140" color="#1890ff" />
          <p class="tip">手机扫码即可查看</p>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'

const visible = ref(false)

interface Props {
  title?: string
  link?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: () => '分享图片',
  link: () => 'https://gitee.com/lucky-slash/yun-picture-frontend'
})

// 打开弹窗
const openModal = () => {
  visible.value = true
}

// 关闭弹窗
const closeModal = () => {
  visible.value = false
}

// 复制链接（修复版）
const copyLink = async () => {
  if (!props.link) {
    message.warning('暂无链接可复制')
    return
  }
  try {
    await navigator.clipboard.writeText(props.link)
    message.success('链接复制成功 ✅')
  } catch (err) {
    // 降级方案：兼容旧浏览器
    const input = document.createElement('input')
    input.value = props.link
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    message.success('链接复制成功 ✅')
  }
}

defineExpose({
  openModal
})
</script>

<style scoped>
.share-box {
  padding: 16px 12px;
}

.section {
  margin-bottom: 28px;
}

.label {
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 12px;
  gap: 6px;
}

.icon {
  font-size: 18px;
}

.link-input {
  border-radius: 8px;
}

.copy-btn {
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  border: none;
  border-radius: 0 6px 6px 0;
  transition: all 0.3s ease;
}

.copy-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

.qrcode-section {
  text-align: center;
  margin-bottom: 8px;
}

.qrcode-box {
  display: inline-block;
  padding: 16px;
  background: #f0f7ff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.12);
  transition: all 0.3s ease;
}

.qrcode-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.18);
}

.tip {
  margin-top: 10px;
  font-size: 12px;
  color: #8c8c8c;
}

/* 弹窗整体活力样式 */
:deep(.ant-modal) {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

:deep(.ant-modal-header) {
  border-bottom: 1px solid #e6f7ff;
  padding: 18px 24px;
  background: #fafafa;
}

:deep(.ant-modal-title) {
  font-size: 18px;
  font-weight: 700;
  color: #1890ff;
}

:deep(.ant-modal-body) {
  padding: 24px;
}

:deep(.ant-modal-close) {
  top: 18px;
  right: 20px;
}
</style>
