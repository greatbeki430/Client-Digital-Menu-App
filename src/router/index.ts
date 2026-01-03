import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

// ========== TYPE DECLARATIONS ==========
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    guestOnly?: boolean
    description?: string
  }
}

// ========== ROUTE DEFINITIONS ==========
const routes: RouteRecordRaw[] = [
  // ========== PUBLIC ROUTES (For Restaurant Customers) ==========
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'), // Main digital menu
    meta: {
      title: 'Digital Menu',
      description: 'Browse our delicious menu categories',
    },
  },
  // {
  //   path: '/menu',
  //   name: 'PublicMenu',
  //   component: () => import('@/views/menu/PublicMenuView.vue'),
  //   meta: {
  //     title: 'Our Menu',
  //     description: 'Explore our full menu',
  //   },
  // },

  {
    path: '/menu',
    name: 'PublicMenu',
    component: () => import('@/views/dashboard/MenuItemsView.vue'),
    meta: {
      title: 'Our Menu',
      description: 'Explore our full menu',
    },
  },
  {
    path: '/categories',
    name: 'PublicCategories',
    component: () => import('@/views/menu/CategoriesView.vue'),
    meta: {
      title: 'Menu Categories',
      description: 'View all menu categories',
    },
  },

  // ========== AUTHENTICATION ROUTES ==========
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: {
      title: 'Login',
      guestOnly: true,
      description: 'Login to manage your restaurant menu',
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: {
      title: 'Register',
      guestOnly: true,
      description: 'Register your restaurant',
    },
  },

  // ========== PROTECTED ADMIN DASHBOARD ROUTES ==========
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/DashboardView.vue'),
    meta: {
      title: 'Dashboard',
      requiresAuth: true,
      description: 'Restaurant management dashboard',
    },
  },
  {
    path: '/dashboard/categories',
    name: 'DashboardCategories',
    component: () => import('@/views/dashboard/CategoriesView.vue'),
    meta: {
      title: 'Manage Categories',
      requiresAuth: true,
      description: 'Manage menu categories',
    },
  },
  {
    path: '/dashboard/categories/create',
    name: 'DashboardCategoryCreate',
    component: () => import('@/views/dashboard/CategoryCreateView.vue'),
    meta: {
      title: 'Create Category',
      requiresAuth: true,
      description: 'Create new menu category',
    },
  },
  {
    path: '/dashboard/categories/:id/edit',
    name: 'DashboardCategoryEdit',
    component: () => import('@/views/dashboard/CategoryEditView.vue'),
    meta: {
      title: 'Edit Category',
      requiresAuth: true,
      description: 'Edit menu category',
    },
    props: true,
  },
  {
    path: '/dashboard/menu-items',
    name: 'DashboardMenuItems',
    component: () => import('@/views/dashboard/MenuItemsView.vue'),
    meta: {
      title: 'Manage Menu Items',
      requiresAuth: true,
      description: 'Manage menu items',
    },
  },
  {
    path: '/dashboard/menu-items/create',
    name: 'DashboardMenuItemCreate',
    component: () => import('@/views/dashboard/MenuItemCreateView.vue'),
    meta: {
      title: 'Create Menu Item',
      requiresAuth: true,
      description: 'Create new menu item',
    },
  },
  {
    path: '/dashboard/menu-items/:id/edit',
    name: 'DashboardMenuItemEdit',
    component: () => import('@/views/dashboard/MenuItemEditView.vue'),
    meta: {
      title: 'Edit Menu Item',
      requiresAuth: true,
      description: 'Edit menu item',
    },
    props: true,
  },
  // =======MENU DETAIL ROUTE=======
  {
    path: '/categories/:id',
    name: 'CategoryDetail',
    component: () => import('@/views/menu/CategoryDetailView.vue'),
    meta: {
      title: 'Category Details',
      description: 'View category details and items',
    },
    props: true,
  },

  // ========== LEGAL & SUPPORT ROUTES ==========
  {
    path: '/privacy',
    name: 'PrivacyPolicy',
    component: () => import('@/views/PrivacyPolicy.vue'),
    meta: {
      title: 'Privacy Policy',
      description: 'Privacy policy for Digital Menu application',
    },
  },
  {
    path: '/terms',
    name: 'TermsOfService',
    component: () => import('@/views/TermsOfService.vue'),
    meta: {
      title: 'Terms of Service',
      description: 'Terms of service for Digital Menu application',
    },
  },
  {
    path: '/contact',
    name: 'ContactUs',
    component: () => import('@/views/ContactUs.vue'),
    meta: {
      title: 'Contact Us',
      description: 'Contact Digital Menu support team',
    },
  },

  // ========== 404 NOT FOUND ==========
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: 'Page Not Found',
      description: 'Page not found',
    },
  },
]

// ========== ROUTER INSTANCE ==========
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

// ========== NAVIGATION GUARD ==========
router.beforeEach(
  async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    console.log('🛡️ Router guard - Navigating from:', from.path, 'to:', to.path)

    // For development, disabling auth checks ONLY for Menu Items
    if (import.meta.env.DEV && to.path === '/dashboard/menu-items') {
      console.log('🚧 DEV MODE: Bypassing auth check for Menu Items page only')
      next()
      return
    }

    // All other routes use normal auth logic
    try {
      const { useAuthStore } = await import('@/stores/auth')
      const authStore = useAuthStore()

      // Checking authentication status
      const isAuthenticated = authStore.isAuthenticated
      console.log('✅ Auth status for route', to.path, ':', isAuthenticated)

      // Routes that require authentication
      if (to.meta.requiresAuth && !isAuthenticated) {
        console.warn('❌ Auth required but not authenticated for:', to.path)
        next({ name: 'Login' })
        return
      }

      // Routes only for guests (login/register when already logged in)
      if (to.meta.guestOnly && isAuthenticated) {
        console.warn('⚠️ Guest-only route but authenticated for:', to.path)
        next({ name: 'Dashboard' })
        return
      }

      console.log('✅ Navigation allowed to:', to.path)
      next()
    } catch (error) {
      console.error('❌ Router guard error:', error)
      next()
    }
  },
)

// ========== PAGE TITLE AND META TAGS ==========
router.afterEach((to: RouteLocationNormalized) => {
  // page title
  const title = to.meta?.title || 'Client Digital Menu'
  const appName = 'Client Digital Menu'
  document.title = `${title} | ${appName}`

  // meta description
  const description =
    to.meta?.description || 'Digital menu application for restaurants, cafes, and hotels'
  updateMetaTag('description', description)

  // meta tags
  updateMetaTag('og:title', title)
  updateMetaTag('og:description', description)
})

// ========== HELPER FUNCTIONS ==========
function updateMetaTag(name: string, content: string): void {
  let metaTag =
    document.querySelector(`meta[name="${name}"]`) ||
    document.querySelector(`meta[property="${name}"]`)

  if (!metaTag) {
    metaTag = document.createElement('meta')
    if (name.startsWith('og:')) {
      metaTag.setAttribute('property', name)
    } else {
      metaTag.setAttribute('name', name)
    }
    document.head.appendChild(metaTag)
  }

  metaTag.setAttribute('content', content)
}

export default router
