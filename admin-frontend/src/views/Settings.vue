<template>
  <div class="settings">
    <el-form :model="settings" label-width="150px">
      <el-form-item label="网站标题">
        <el-input v-model="settings.site_title.value" />
        <span class="help-text">{{ settings.site_title.description }}</span>
      </el-form-item>
      <el-form-item label="网站副标题">
        <el-input v-model="settings.site_subtitle.value" />
        <span class="help-text">{{ settings.site_subtitle.description }}</span>
      </el-form-item>
      <el-form-item label="网站描述">
        <el-input v-model="settings.site_description.value" type="textarea" :rows="3" />
        <span class="help-text">{{ settings.site_description.description }}</span>
      </el-form-item>
      <el-form-item label="网站作者">
        <el-input v-model="settings.site_author.value" />
        <span class="help-text">{{ settings.site_author.description }}</span>
      </el-form-item>
      <el-form-item label="网站地址">
        <el-input v-model="settings.site_url.value" />
        <span class="help-text">{{ settings.site_url.description }}</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSave" :loading="loading">保存设置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '../utils/request'

const loading = ref(false)
const settings = reactive({
  site_title: { value: '', description: '' },
  site_subtitle: { value: '', description: '' },
  site_description: { value: '', description: '' },
  site_author: { value: '', description: '' },
  site_url: { value: '', description: '' }
})

const loadSettings = async () => {
  try {
    const res = await request.get('/settings')
    Object.assign(settings, res.data)
  } catch (error) {
    ElMessage.error('获取设置失败')
  }
}

const handleSave = async () => {
  loading.value = true
  try {
    const data = {}
    Object.keys(settings).forEach(key => {
      data[key] = settings[key].value
    })
    await request.put('/settings', data)
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadSettings()
})
</script>

<style scoped>
.settings {
  padding: 20px;
  max-width: 600px;
}

.help-text {
  display: block;
  color: #999;
  font-size: 12px;
  margin-top: 4px;
}
</style>