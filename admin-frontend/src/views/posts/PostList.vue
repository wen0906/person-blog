<template>
  <div class="post-list">
    <div class="search-bar">
      <el-input v-model="keyword" placeholder="搜索文章标题" style="width: 250px; margin-right: 10px;" @keyup.enter="loadPosts" />
      <el-select v-model="categoryId" placeholder="选择分类" style="width: 150px; margin-right: 10px;" clearable>
        <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
      </el-select>
      <el-select v-model="status" placeholder="状态" style="width: 120px; margin-right: 10px;" clearable>
        <el-option label="草稿" value="draft" />
        <el-option label="已发布" value="published" />
      </el-select>
      <el-button type="primary" @click="loadPosts">搜索</el-button>
      <el-button type="success" @click="goCreate">新增文章</el-button>
    </div>
    <el-table :data="posts" border>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="title" label="标题" min-width="300">
        <template #default="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="category_name" label="分类" width="120" />
      <el-table-column label="标签" width="150">
        <template #default="scope">
          <el-tag v-for="tag in scope.row.tags" :key="tag.id" size="small" style="margin-right: 4px;">{{ tag.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'published' ? 'success' : 'info'">{{ scope.row.status === 'published' ? '已发布' : '草稿' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="top" label="置顶" width="80">
        <template #default="scope">
          <el-switch :value="scope.row.top === 1" @change="toggleTop(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="views" label="浏览" width="80" />
      <el-table-column prop="created_at" label="创建时间" width="180" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button type="primary" size="small" @click="goEdit(scope.row.id)">编辑</el-button>
          <el-button type="danger" size="small" @click="deletePost(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 50]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '../../utils/request'

const router = useRouter()
const posts = ref([])
const categories = ref([])
const keyword = ref('')
const categoryId = ref('')
const status = ref('')
const page = ref(1)
const limit = ref(10)
const total = ref(0)

const loadPosts = async () => {
  try {
    const res = await request.get('/posts', {
      params: {
        page: page.value,
        limit: limit.value,
        category_id: categoryId.value,
        status: status.value,
        keyword: keyword.value
      }
    })
    posts.value = res.data.list
    total.value = res.data.total
    page.value = res.data.page
    limit.value = res.data.limit
  } catch (error) {
    ElMessage.error('获取文章列表失败')
  }
}

const loadCategories = async () => {
  try {
    const res = await request.get('/categories')
    categories.value = res.data
  } catch (error) {
    ElMessage.error('获取分类失败')
  }
}

const goCreate = () => {
  router.push('/posts/create')
}

const goEdit = (id) => {
  router.push(`/posts/edit/${id}`)
}

const deletePost = (row) => {
  ElMessageBox.confirm('确定要删除这篇文章吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await request.delete(`/posts/${row.id}`)
      ElMessage.success('删除成功')
      loadPosts()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

const toggleTop = async (row) => {
  try {
    await request.put(`/posts/${row.id}`, { ...row, top: row.top === 1 ? 0 : 1 })
    ElMessage.success('更新成功')
    loadPosts()
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

const handleSizeChange = (val) => {
  limit.value = val
  page.value = 1
  loadPosts()
}

const handleCurrentChange = (val) => {
  page.value = val
  loadPosts()
}

onMounted(() => {
  loadPosts()
  loadCategories()
})
</script>

<style scoped>
.post-list {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.el-pagination {
  margin-top: 20px;
  text-align: right;
}
</style>