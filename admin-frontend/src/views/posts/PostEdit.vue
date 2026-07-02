<template>
  <div class="post-edit">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入文章标题" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="form.category_id" placeholder="选择分类" style="width: 200px;" clearable>
          <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="标签">
        <el-select v-model="form.tags" multiple placeholder="选择标签" style="width: 300px;">
          <el-option v-for="tag in tags" :key="tag.id" :label="tag.name" :value="tag.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="摘要">
        <el-input v-model="form.excerpt" type="textarea" :rows="3" placeholder="文章摘要" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input v-model="form.content" type="textarea" :rows="20" placeholder="文章内容（支持Markdown）" style="width: 100%; font-family: monospace;" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio label="draft">草稿</el-radio>
          <el-radio label="published">已发布</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="置顶">
        <el-switch v-model="form.top" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="loading">保存</el-button>
        <el-button @click="goBack">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '../../utils/request'

const router = useRouter()
const route = useRoute()
const formRef = ref(null)
const loading = ref(false)
const categories = ref([])
const tags = ref([])

const form = reactive({
  title: '',
  content: '',
  excerpt: '',
  category_id: '',
  status: 'draft',
  top: 0,
  tags: []
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
}

const loadCategories = async () => {
  try {
    const res = await request.get('/categories')
    categories.value = res.data
  } catch (error) {
    ElMessage.error('获取分类失败')
  }
}

const loadTags = async () => {
  try {
    const res = await request.get('/tags')
    tags.value = res.data
  } catch (error) {
    ElMessage.error('获取标签失败')
  }
}

const loadPost = async () => {
  const id = route.params.id
  if (id) {
    try {
      const res = await request.get(`/posts/${id}`)
      const data = res.data
      form.title = data.title
      form.content = data.content
      form.excerpt = data.excerpt || ''
      form.category_id = data.category_id || ''
      form.status = data.status
      form.top = data.top
      form.tags = data.tags.map(t => t.id)
    } catch (error) {
      ElMessage.error('获取文章失败')
    }
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const id = route.params.id
        if (id) {
          await request.put(`/posts/${id}`, form)
          ElMessage.success('更新成功')
        } else {
          await request.post('/posts', form)
          ElMessage.success('创建成功')
        }
        router.push('/posts')
      } catch (error) {
        ElMessage.error(error.response?.data?.message || '操作失败')
      } finally {
        loading.value = false
      }
    }
  })
}

const goBack = () => {
  router.push('/posts')
}

onMounted(() => {
  loadCategories()
  loadTags()
  loadPost()
})
</script>

<style scoped>
.post-edit {
  padding: 20px;
}
</style>