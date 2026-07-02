import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('../views/Layout.vue'),
    redirect: '/posts',
    children: [
      {
        path: '/posts',
        name: 'Posts',
        component: () => import('../views/posts/PostList.vue')
      },
      {
        path: '/posts/create',
        name: 'PostCreate',
        component: () => import('../views/posts/PostEdit.vue')
      },
      {
        path: '/posts/edit/:id',
        name: 'PostEdit',
        component: () => import('../views/posts/PostEdit.vue')
      },
      {
        path: '/categories',
        name: 'Categories',
        component: () => import('../views/CategoryList.vue')
      },
      {
        path: '/tags',
        name: 'Tags',
        component: () => import('../views/TagList.vue')
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('../views/Settings.vue')
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/')
  } else {
    next()
  }
})

export default router