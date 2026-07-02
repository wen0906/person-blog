<template>
  <div class="profile">
    <el-card>
      <h3>个人信息</h3>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户名">{{ user?.username }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ user?.email || '未设置' }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card style="margin-top: 20px;">
      <h3>修改密码</h3>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="form.oldPassword" type="password" placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入新密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleChangePassword" :loading="loading">修改密码</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '../utils/request'

const formRef = ref(null)
const loading = ref(false)
const user = ref({})

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const rules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { min: 6, message: '密码长度至少6位', trigger: 'blur' }],
  confirmPassword: [{ required: true, message: '请确认新密码', trigger: 'blur' }, { validator: confirmValidator, trigger: 'blur' }]
}

const confirmValidator = (rule, value, callback) => {
  if (value !== form.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const loadUser = async () => {
  try {
    const res = await request.get('/auth/me')
    user.value = res.data
  } catch (error) {
    ElMessage.error('获取用户信息失败')
  }
}

const handleChangePassword = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await request.post('/auth/change-password', {
          oldPassword: form.oldPassword,
          newPassword: form.newPassword
        })
        ElMessage.success('密码修改成功')
        form.oldPassword = ''
        form.newPassword = ''
        form.confirmPassword = ''
      } catch (error) {
        ElMessage.error(error.response?.data?.message || '修改失败')
      } finally {
        loading.value = false
      }
    }
  })
}

onMounted(() => {
  loadUser()
})
</script>

<style scoped>
.profile {
  padding: 20px;
}

h3 {
  margin-bottom: 20px;
  font-size: 16px;
}
</style>