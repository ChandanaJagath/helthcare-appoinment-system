<template>
  <div class="calendar-component">
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
  name: 'Calendar',
  components: {
    FullCalendar
  },
  props: {
    events: {
      type: Array,
      default: () => []
    },
    selectable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: this.events,
        selectable: this.selectable,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick
      }
    }
  },
  watch: {
    events: {
      handler(newEvents) {
        this.calendarOptions.events = newEvents
      },
      deep: true
    }
  },
  methods: {
    handleDateSelect(selectInfo) {
      this.$emit('date-select', selectInfo)
    },
    handleEventClick(clickInfo) {
      this.$emit('event-click', clickInfo)
    }
  }
}
</script>

<style>
@import '@fullcalendar/core/vdom.css';
</style>
