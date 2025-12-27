import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Home' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: {
      title: 'Login',
      guestOnly: true,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: {
      title: 'Register',
      guestOnly: true,
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/DashboardView.vue'),
    meta: {
      title: 'Dashboard',
      requiresAuth: true,
    },
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('@/views/dashboard/CategoriesView.vue'),
    meta: {
      title: 'Menu Categories',
      requiresAuth: true,
    },
  },
  {
    path: '/categories/create',
    name: 'CategoryCreate',
    component: () => import('@/views/dashboard/CategoryCreateView.vue'),
    meta: {
      title: 'Create Category',
      requiresAuth: true,
    },
  },
  {
    path: '/categories/:id/edit',
    name: 'CategoryEdit',
    component: () => import('@/views/dashboard/CategoryEditView.vue'),
    meta: {
      title: 'Edit Category',
      requiresAuth: true,
    },
    props: true,
  },
  {
    path: '/menu-items',
    name: 'MenuItems',
    component: () => import('@/views/dashboard/MenuItemsView.vue'),
    meta: {
      title: 'Menu Items',
      requiresAuth: true,
    },
  },
  {
    path: '/menu-items/create',
    name: 'MenuItemCreate',
    component: () => import('@/views/dashboard/MenuItemCreateView.vue'),
    meta: {
      title: 'Create Menu Item',
      requiresAuth: true,
    },
  },
  {
    path: '/menu-items/:id/edit',
    name: 'MenuItemEdit',
    component: () => import('@/views/dashboard/MenuItemEditView.vue'),
    meta: {
      title: 'Edit Menu Item',
      requiresAuth: true,
    },
    props: true,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Page Not Found' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash }
    }
    return { top: 0 }
  },
})

// Navigation guard
router.beforeEach((to, from, next) => {
  import('@/stores/auth').then(({ useAuthStore }) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next('/login')
    } else if (to.meta.guestOnly && authStore.isAuthenticated) {
      next('/dashboard')
    } else {
      next()
    }
  })
})

// Update page title
router.afterEach((to) => {
  const title = (to.meta.title as string) || 'Client Digital Menu'
  document.title = `${title} - Client Digital Menu`
})

export default router
