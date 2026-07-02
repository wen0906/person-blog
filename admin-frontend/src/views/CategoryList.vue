<template>
  <div class="category-list">
    <div class="search-bar">
      <el-button type="success" @click="showAddDialog = true">新增分类</el-button>
    </div>
    <el-table :data="categories" border>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="名称" width="150" />
      <el-table-column prop="description" label="描述" min-width="200" />
      <el-table-column prop="sort_order" label="排序" width="80" />
      <el-table-column prop="created_at" label="创建时间" width="180" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button type="primary" size="small" @click="editCategory(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteCategory(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="editForm.id ? '编辑分类' : '新增分类'" :visible.sync="showAddDialog">
      <el-form :model="editForm" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.description" type="textarea" :rows="3" placeholder="分类描述" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="editForm.sort_order" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '../utils/request'

const categories = ref([])
const showAddDialog = ref(false)
const formRef = ref(null)

const editForm = reactive({
  id: '',
  name: '',
  description: '',
  sort_order: 0
})

const rules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
}

const loadCategories = async () => {
  try {
    const res = await request.get('/categories')
    categories.value = res.data
  } catch (error) {
    ElMessage.error('获取分类失败')
  }
}

const editCategory = (row) => {
  editForm.id = row.id
  editForm.name = row.name
  editForm.description = row.description || ''
  editForm.sort_order = row.sort_order || 0
  showAddDialog.value = true
}

const deleteCategory = (row) => {
  ElMessageBox.confirm('确定要删除这个分类吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await request.delete(`/categories/${row.id}`)
      ElMessage.success('删除成功')
      loadCategories()
    } catch (error) {
      ElMessage.error(error.response?.data?.message || '删除失败')
    }
  }).catch(() => {})
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (editForm.id) {
          await request.put(`/categories/${editForm.id}`, editForm)
          ElMessage.success('更新成功')
        } else {
          await request.post('/categories', editForm)
          ElMessage.success('创建成功')
        }
        showAddDialog.value = false
        loadCategories()
        editForm.id = ''
        editForm.name = ''
        editForm.description = ''
        editForm.sort_order = 0
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.category-list {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}
</style>