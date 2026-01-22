<template>
  <div class="admin-users">
    <div class="page-header">
      <div>
        <h1>User Management</h1>
        <p class="page-subtitle">Manage patients, doctors, and administrators</p>
      </div>
      <button @click="showCreateModal = true" class="btn btn-primary">
        <span>➕</span>
        Add New User
      </button>
    </div>

    <!-- Filters -->
    <div class="filters card">
      <div class="filter-group">
        <label class="form-label">Filter by Role</label>
        <select v-model="filters.role" class="form-control" @change="loadUsers">
          <option value="">All Roles</option>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div class="filter-group">
        <label class="form-label">Search</label>
        <input
          v-model="filters.search"
          type="text"
          class="form-control"
          placeholder="Search by name or email..."
          @input="loadUsers"
        />
      </div>
    </div>

    <!-- Users Table -->
    <div class="card">
      <div v-if="loading" class="loading-container">
        <LoadingSpinner message="Loading users..." />
      </div>
      <div v-else-if="users.length === 0" class="empty-state">
        <div class="empty-state-icon">👤</div>
        <h3>No users found</h3>
        <p>Try adjusting your filters or add a new user.</p>
      </div>
      <div v-else class="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>
                <div class="user-cell">
                  <div class="user-avatar-small">{{ user.name.charAt(0).toUpperCase() }}</div>
                  <span>{{ user.name }}</span>
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>
                <span :class="['role-badge', user.role]">{{ user.role }}</span>
              </td>
              <td>{{ user.phone || 'N/A' }}</td>
              <td>{{ formatDate(user.created_at) }}</td>
              <td>
                <div class="action-buttons">
                  <button @click="editUser(user)" class="btn btn-outline btn-sm">
                    ✏️ Edit
                  </button>
                  <button 
                    @click="deleteUser(user.id)" 
                    class="btn btn-danger btn-sm"
                    :disabled="user.id === currentUserId"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit User Modal -->
    <div v-if="showCreateModal || editingUser" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ editingUser ? 'Edit User' : 'Create New User' }}</h2>
          <button @click="closeModal" class="modal-close">✕</button>
        </div>
        <form @submit.prevent="saveUser" class="modal-body">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input v-model="userForm.name" type="text" class="form-control" required />
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input v-model="userForm.email" type="email" class="form-control" required />
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input 
              v-model="userForm.password" 
              type="password" 
              class="form-control" 
              :required="!editingUser"
              :placeholder="editingUser ? 'Leave blank to keep current' : 'Minimum 8 characters'"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Role</label>
            <select v-model="userForm.role" class="form-control" required>
              <option value="">Select role</option>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div v-if="userForm.role === 'doctor'" class="form-group">
            <label class="form-label">Specialization</label>
            <input v-model="userForm.specialization" type="text" class="form-control" />
          </div>
          <div v-if="userForm.role === 'doctor'" class="form-group">
            <label class="form-label">License Number</label>
            <input v-model="userForm.license_number" type="text" class="form-control" />
          </div>
          <div v-if="userForm.role === 'doctor'" class="form-group">
            <label class="form-label">Consultation Fee</label>
            <input v-model="userForm.consultation_fee" type="number" step="0.01" class="form-control" />
          </div>
          <div class="form-group">
            <label class="form-label">Phone</label>
            <input v-model="userForm.phone" type="tel" class="form-control" />
          </div>
          <div class="modal-footer">
            <button type="button" @click="closeModal" class="btn btn-outline">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              <span v-if="saving" class="spinner spinner-sm"></span>
              {{ saving ? 'Saving...' : 'Save User' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import adminService from '../../services/adminService'
import LoadingSpinner from '../../components/LoadingSpinner.vue'

export default {
  name: 'AdminUsers',
  components: {
    LoadingSpinner
  },
  data() {
    return {
      users: [],
      loading: false,
      filters: {
        role: '',
        search: ''
      },
      showCreateModal: false,
      editingUser: null,
      saving: false,
      userForm: {
        name: '',
        email: '',
        password: '',
        role: '',
        phone: '',
        specialization: '',
        license_number: '',
        consultation_fee: ''
      }
    }
  },
  computed: {
    currentUserId() {
      return this.$store.getters['auth/user']?.id
    }
  },
  async mounted() {
    await this.loadUsers()
  },
  methods: {
    async loadUsers() {
      this.loading = true
      try {
        const params = {}
        if (this.filters.role) params.role = this.filters.role
        if (this.filters.search) params.search = this.filters.search
        
        const response = await adminService.getUsers(params)
        this.users = response.data.data || response.data || []
      } catch (error) {
        console.error('Error loading users:', error)
        alert('Failed to load users')
      } finally {
        this.loading = false
      }
    },
    editUser(user) {
      this.editingUser = user
      this.userForm = {
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        phone: user.phone || '',
        specialization: '',
        license_number: '',
        consultation_fee: ''
      }
      this.showCreateModal = true
    },
    async saveUser() {
      this.saving = true
      try {
        if (this.editingUser) {
          await adminService.updateUser(this.editingUser.id, this.userForm)
        } else {
          await adminService.createUser(this.userForm)
        }
        this.closeModal()
        await this.loadUsers()
      } catch (error) {
        alert('Failed to save user: ' + (error.response?.data?.message || 'Unknown error'))
      } finally {
        this.saving = false
      }
    },
    async deleteUser(userId) {
      if (userId === this.currentUserId) {
        alert('You cannot delete your own account')
        return
      }
      
      if (!confirm('Are you sure you want to delete this user?')) {
        return
      }
      
      try {
        await adminService.deleteUser(userId)
        await this.loadUsers()
      } catch (error) {
        alert('Failed to delete user')
      }
    },
    closeModal() {
      this.showCreateModal = false
      this.editingUser = null
      this.userForm = {
        name: '',
        email: '',
        password: '',
        role: '',
        phone: '',
        specialization: '',
        license_number: '',
        consultation_fee: ''
      }
    },
    formatDate(date) {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString()
    }
  }
}
</script>

<style scoped>
.admin-users {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  color: var(--text-secondary);
  margin: 0;
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.filter-group {
  margin-bottom: 0;
}

.users-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: var(--light-color);
}

th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

td {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: var(--radius-lg);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
}

.modal-close:hover {
  background: var(--light-gray);
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .admin-users {
    padding: 1rem;
  }
  
  table {
    font-size: 0.875rem;
  }
  
  th, td {
    padding: 0.75rem 0.5rem;
  }
}
</style>
