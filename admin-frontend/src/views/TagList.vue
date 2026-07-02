<template>
  <div class="tag-list">
    <div class="search-bar">
      <el-input v-model="keyword" placeholder="搜索标签" style="width: 250px; margin-right: 10px;" @keyup.enter="loadTags" />
      <el-button type="primary" @click="loadTags">搜索</el-button>
      <el-button type="success" @click="showAddDialog = true">新增标签</el-button>
    </div>
    <el-table :data="tags" border>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="名称" width="150" />
      <el-table-column prop="post_count" label="文章数" width="100" />
      <el-table-column prop="created_at" label="创建时间" width="180" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button type="primary" size="small" @click="editTag(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteTag(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="editForm.id ? '编辑标签' : '新增标签'" :visible.sync="showAddDialog">
      <el-form :model="editForm" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入标签名称" />
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

const tags = ref([])
const showAddDialog = ref(false)
const formRef = ref(null)
const keyword = ref('')

const editForm = reactive({
  id: '',
  name: ''
})

const rules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
}

const loadTags = async () => {
  try {
    const res = await request.get('/tags')
    if (keyword.value) {
      tags.value = res.data.filter(t => t.name.includes(keyword.value))
    } else {
      tags.value = res.data
    }
  } catch (error) {
    ElMessage.error('获取标签失败')
  }
}

const editTag = (row) => {
  editForm.id = row.id
  editForm.name = row.name
  showAddDialog.value = true
}

const deleteTag = (row) => {
  ElMessageBox.confirm('确定要删除这个标签吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await request.delete(`/tags/${row.id}`)
      ElMessage.success('删除成功')
      loadTags()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (editForm.id) {
          await request.put(`/tags/${editForm.id}`, editForm)
          ElMessage.success('更新成功')
        } else {
          await request.post('/tags', editForm)
          ElMessage.success('创建成功')
        }
        showAddDialog.value = false
        loadTags()
        editForm.id = ''
        editForm.name = ''
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

onMounted(() => {
  loadTags()
})
</script>

<style scoped>
.tag-list {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}
</style>