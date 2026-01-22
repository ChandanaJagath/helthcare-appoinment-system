import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/Register.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/auth/ForgotPassword.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/patient',
    component: () => import('../layouts/PatientLayout.vue'),
    meta: { requiresAuth: true, role: 'patient' },
    children: [
      {
        path: 'dashboard',
        name: 'PatientDashboard',
        component: () => import('../views/patient/Dashboard.vue')
      },
      {
        path: 'appointments',
        name: 'PatientAppointments',
        component: () => import('../views/patient/Appointments.vue')
      },
      {
        path: 'book-appointment',
        name: 'BookAppointment',
        component: () => import('../views/patient/BookAppointment.vue')
      },
      {
        path: 'medical-records',
        name: 'MedicalRecords',
        component: () => import('../views/patient/MedicalRecords.vue')
      },
      {
        path: 'profile',
        name: 'PatientProfile',
        component: () => import('../views/patient/Profile.vue')
      }
    ]
  },
  {
    path: '/doctor',
    component: () => import('../layouts/DoctorLayout.vue'),
    meta: { requiresAuth: true, role: 'doctor' },
    children: [
      {
        path: 'dashboard',
        name: 'DoctorDashboard',
        component: () => import('../views/doctor/Dashboard.vue')
      },
      {
        path: 'appointments',
        name: 'DoctorAppointments',
        component: () => import('../views/doctor/Appointments.vue')
      },
      {
        path: 'patients/:id',
        name: 'PatientDetails',
        component: () => import('../views/doctor/PatientDetails.vue')
      },
      {
        path: 'schedule',
        name: 'DoctorSchedule',
        component: () => import('../views/doctor/Schedule.vue')
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/Dashboard.vue')
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('../views/admin/Users.vue')
      },
      {
        path: 'appointments',
        name: 'AdminAppointments',
        component: () => import('../views/admin/Appointments.vue')
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        component: () => import('../views/admin/Settings.vue')
      }
    ]
  },
  {
    path: '/',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const requiredRole = to.meta.role
  const isAuthenticated = store.getters['auth/isAuthenticated']
  const userRole = store.getters['auth/userRole']

  // If route requires auth and user is not authenticated, redirect to login
  if (requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }

  // If route requires auth and user has wrong role, redirect to their dashboard
  if (requiresAuth && requiredRole && isAuthenticated && userRole && userRole !== requiredRole) {
    if (userRole === 'patient') {
      next('/patient/dashboard')
    } else if (userRole === 'doctor') {
      next('/doctor/dashboard')
    } else if (userRole === 'admin') {
      next('/admin/dashboard')
    } else {
      next('/login')
    }
    return
  }

  // If user is authenticated and trying to access auth pages, redirect to their dashboard
  if (!requiresAuth && isAuthenticated && userRole) {
    if (userRole === 'patient') {
      next('/patient/dashboard')
    } else if (userRole === 'doctor') {
      next('/doctor/dashboard')
    } else if (userRole === 'admin') {
      next('/admin/dashboard')
    } else {
      next()
    }
    return
  }

  // Allow access
  next()
})

export default router
