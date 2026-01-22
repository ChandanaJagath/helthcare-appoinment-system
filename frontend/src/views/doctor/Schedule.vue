<template>
  <div class="schedule">
    <div class="page-header">
      <h1>Manage Schedule</h1>
      <button @click="showAddSlotModal = true" class="btn btn-primary">
        <span class="icon">➕</span> Add Time Slot
      </button>
    </div>

    <div class="schedule-content">
      <!-- Weekly Schedule View -->
      <div class="schedule-card">
        <div class="card-header">
          <h2>
            <span class="icon">📅</span>
            Weekly Schedule
          </h2>
          <div class="week-navigation">
            <button @click="previousWeek" class="btn btn-sm btn-secondary">← Previous</button>
            <span class="current-week">{{ currentWeekRange }}</span>
            <button @click="nextWeek" class="btn btn-sm btn-secondary">Next →</button>
          </div>
        </div>

        <div class="schedule-grid">
          <div 
            v-for="day in weekDays" 
            :key="day.date" 
            class="schedule-day"
            :class="{ 'today': day.isToday, 'weekend': day.isWeekend }"
          >
            <div class="day-header">
              <h3>{{ day.name }}</h3>
              <span class="day-date">{{ day.dateDisplay }}</span>
            </div>
            <div class="time-slots">
              <div 
                v-for="slot in getDaySlots(day.date)" 
                :key="slot.id"
                class="time-slot"
                :class="slot.status"
              >
                <span class="slot-time">{{ slot.time }}</span>
                <span class="slot-status">{{ slot.status }}</span>
                <button 
                  @click="removeSlot(slot.id)" 
                  class="btn-remove"
                  title="Remove slot"
                >
                  ✕
                </button>
              </div>
              <div v-if="getDaySlots(day.date).length === 0" class="no-slots">
                No slots available
              </div>
            </div>
            <button 
              @click="openAddSlotModal(day.date)" 
              class="btn-add-slot"
            >
              + Add Slot
            </button>
          </div>
        </div>
      </div>

      <!-- Available Time Slots Summary -->
      <div class="schedule-card">
        <div class="card-header">
          <h2>
            <span class="icon">⏰</span>
            Available Time Slots
          </h2>
        </div>
        <div class="slots-summary">
          <div class="summary-item">
            <span class="summary-label">Total Slots:</span>
            <span class="summary-value">{{ totalSlots }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Available:</span>
            <span class="summary-value available">{{ availableSlots }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Booked:</span>
            <span class="summary-value booked">{{ bookedSlots }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Slot Modal -->
    <div v-if="showAddSlotModal" class="modal-overlay" @click="showAddSlotModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Add Time Slot</h2>
          <button @click="showAddSlotModal = false" class="btn-close">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Date</label>
            <input 
              v-model="newSlot.date" 
              type="date" 
              class="form-input"
              :min="today"
            />
          </div>
          <div class="form-group">
            <label>Time</label>
            <input 
              v-model="newSlot.time" 
              type="time" 
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>Duration (minutes)</label>
            <select v-model="newSlot.duration" class="form-input">
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showAddSlotModal = false" class="btn btn-secondary">Cancel</button>
          <button @click="addSlot" class="btn btn-primary">Add Slot</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DoctorSchedule',
  data() {
    return {
      showAddSlotModal: false,
      currentWeekStart: new Date(),
      timeSlots: [],
      newSlot: {
        date: '',
        time: '',
        duration: 30
      }
    }
  },
  computed: {
    today() {
      return new Date().toISOString().split('T')[0]
    },
    weekDays() {
      const days = []
      const start = new Date(this.currentWeekStart)
      start.setDate(start.getDate() - start.getDay()) // Start from Sunday
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(start)
        date.setDate(start.getDate() + i)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const dateOnly = new Date(date)
        dateOnly.setHours(0, 0, 0, 0)
        
        days.push({
          date: date.toISOString().split('T')[0],
          name: date.toLocaleDateString('en-US', { weekday: 'long' }),
          dateDisplay: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          isToday: dateOnly.getTime() === today.getTime(),
          isWeekend: date.getDay() === 0 || date.getDay() === 6
        })
      }
      return days
    },
    currentWeekRange() {
      const start = new Date(this.currentWeekStart)
      start.setDate(start.getDate() - start.getDay())
      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    },
    totalSlots() {
      return this.timeSlots.length
    },
    availableSlots() {
      return this.timeSlots.filter(s => s.status === 'available').length
    },
    bookedSlots() {
      return this.timeSlots.filter(s => s.status === 'booked').length
    }
  },
  mounted() {
    this.loadSchedule()
  },
  methods: {
    loadSchedule() {
      // In a real app, this would fetch from the API
      // For now, we'll use mock data
      this.timeSlots = [
        { id: 1, date: this.today, time: '09:00', duration: 30, status: 'available' },
        { id: 2, date: this.today, time: '10:00', duration: 30, status: 'booked' },
        { id: 3, date: this.today, time: '14:00', duration: 30, status: 'available' }
      ]
    },
    getDaySlots(date) {
      return this.timeSlots
        .filter(slot => slot.date === date)
        .sort((a, b) => a.time.localeCompare(b.time))
    },
    openAddSlotModal(date) {
      this.newSlot.date = date
      this.newSlot.time = '09:00'
      this.showAddSlotModal = true
    },
    addSlot() {
      if (!this.newSlot.date || !this.newSlot.time) {
        this.$toast?.error('Please fill in all fields')
        return
      }
      
      const newId = Math.max(...this.timeSlots.map(s => s.id), 0) + 1
      this.timeSlots.push({
        id: newId,
        date: this.newSlot.date,
        time: this.newSlot.time,
        duration: parseInt(this.newSlot.duration),
        status: 'available'
      })
      
      this.showAddSlotModal = false
      this.newSlot = { date: '', time: '', duration: 30 }
      this.$toast?.success('Time slot added successfully')
    },
    removeSlot(slotId) {
      if (confirm('Are you sure you want to remove this time slot?')) {
        this.timeSlots = this.timeSlots.filter(s => s.id !== slotId)
        this.$toast?.success('Time slot removed')
      }
    },
    previousWeek() {
      const newDate = new Date(this.currentWeekStart)
      newDate.setDate(newDate.getDate() - 7)
      this.currentWeekStart = newDate
    },
    nextWeek() {
      const newDate = new Date(this.currentWeekStart)
      newDate.setDate(newDate.getDate() + 7)
      this.currentWeekStart = newDate
    }
  }
}
</script>

<style scoped>
.schedule {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--dark-color);
  margin: 0;
}

.schedule-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.schedule-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  overflow: hidden;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--light-color);
  flex-wrap: wrap;
  gap: 16px;
}

.card-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--dark-color);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.week-navigation {
  display: flex;
  align-items: center;
  gap: 16px;
}

.current-week {
  font-weight: 600;
  color: var(--dark-color);
  min-width: 200px;
  text-align: center;
}

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1px;
  background: var(--border-color);
}

.schedule-day {
  background: white;
  padding: 16px;
  min-height: 300px;
}

.schedule-day.today {
  background: #eff6ff;
}

.schedule-day.weekend {
  background: #f9fafb;
}

.day-header {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border-color);
}

.day-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--dark-color);
  margin: 0 0 4px 0;
}

.day-date {
  font-size: 12px;
  color: var(--text-muted);
}

.time-slots {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
  min-height: 150px;
}

.time-slot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  border-left: 3px solid;
}

.time-slot.available {
  background: #d1fae5;
  border-left-color: #10b981;
}

.time-slot.booked {
  background: #fee2e2;
  border-left-color: #ef4444;
}

.slot-time {
  font-weight: 600;
  color: var(--dark-color);
}

.slot-status {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  font-weight: 600;
}

.time-slot.available .slot-status {
  background: #10b981;
  color: white;
}

.time-slot.booked .slot-status {
  background: #ef4444;
  color: white;
}

.btn-remove {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: rgba(0,0,0,0.1);
  color: var(--danger-color);
}

.no-slots {
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
  padding: 20px;
}

.btn-add-slot {
  width: 100%;
  padding: 8px;
  border: 2px dashed var(--border-color);
  background: transparent;
  color: var(--text-muted);
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.btn-add-slot:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: var(--light-color);
}

.slots-summary {
  padding: 24px;
  display: flex;
  gap: 32px;
  justify-content: center;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.summary-label {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--dark-color);
}

.summary-value.available {
  color: #10b981;
}

.summary-value.booked {
  color: #ef4444;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--dark-color);
  margin: 0;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 24px;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-close:hover {
  background: var(--light-color);
  color: var(--dark-color);
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--dark-color);
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  background: white;
  color: var(--dark-color);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
}

.btn-secondary {
  background: var(--text-muted);
  color: white;
}

.btn-secondary:hover {
  background: #6b7280;
}

.icon {
  font-size: 16px;
}

@media (max-width: 768px) {
  .schedule-grid {
    grid-template-columns: 1fr;
  }
  
  .slots-summary {
    flex-direction: column;
    gap: 24px;
  }
  
  .week-navigation {
    width: 100%;
    justify-content: space-between;
  }
  
  .current-week {
    min-width: auto;
    font-size: 14px;
  }
}
</style>
