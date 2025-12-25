import { ref, computed } from 'vue'
import { useApi } from './useApi'

export const useResults = () => {
  const api = useApi()
  
  const results2D = ref([])
  const results3D = ref([])
  const loading = ref(false)
  
  // 2D Schedule: Mon-Fri at 12:00 PM and 4:30 PM
  // 3D Schedule: 1st and 16th of each month at 3:00 PM
  
  const get2DSchedule = () => {
    const schedule = []
    const today = new Date()
    const currentDay = today.getDay() // 0 = Sunday, 1 = Monday, etc.
    
    // Generate next few 2D draws (Mon-Fri, 12:00 PM and 4:30 PM)
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dayOfWeek = date.getDay()
      
      // Skip weekends (Saturday = 6, Sunday = 0)
      if (dayOfWeek === 0 || dayOfWeek === 6) continue
      
      // Add morning session (12:00 PM)
      schedule.push({
        date: date.toISOString().split('T')[0],
        time: '12:00 PM',
        session: 'Morning',
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' })
      })
      
      // Add evening session (4:30 PM)
      schedule.push({
        date: date.toISOString().split('T')[0],
        time: '4:30 PM',
        session: 'Evening',
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' })
      })
    }
    
    return schedule.slice(0, 10) // Return next 10 draws
  }
  
  const get3DSchedule = () => {
    const schedule = []
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    
    // Generate next few 3D draws (1st and 16th of each month at 3:00 PM)
    for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
      const targetMonth = currentMonth + monthOffset
      const targetYear = currentYear + Math.floor(targetMonth / 12)
      const adjustedMonth = targetMonth % 12
      
      // 1st of the month
      const firstDate = new Date(targetYear, adjustedMonth, 1, 15, 0) // 3:00 PM
      if (firstDate >= today) {
        schedule.push({
          date: firstDate.toISOString().split('T')[0],
          time: '3:00 PM',
          session: 'First Draw',
          dayName: firstDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
        })
      }
      
      // 16th of the month
      const sixteenthDate = new Date(targetYear, adjustedMonth, 16, 15, 0) // 3:00 PM
      if (sixteenthDate >= today) {
        schedule.push({
          date: sixteenthDate.toISOString().split('T')[0],
          time: '3:00 PM',
          session: 'Second Draw',
          dayName: sixteenthDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
        })
      }
    }
    
    return schedule.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 6)
  }
  
  // Generate demo results based on schedule
  const generateDemo2DResults = () => {
    const demoResults = [
      {
        date: '2024-12-24',
        session: 'Morning',
        time: '12:00 PM',
        number: '47',
        dayName: 'Tue'
      },
      {
        date: '2024-12-23',
        session: 'Evening',
        time: '4:30 PM',
        number: '23',
        dayName: 'Mon'
      },
      {
        date: '2024-12-23',
        session: 'Morning',
        time: '12:00 PM',
        number: '91',
        dayName: 'Mon'
      },
      {
        date: '2024-12-20',
        session: 'Evening',
        time: '4:30 PM',
        number: '68',
        dayName: 'Fri'
      },
      {
        date: '2024-12-20',
        session: 'Morning',
        time: '12:00 PM',
        number: '15',
        dayName: 'Fri'
      }
    ]
    return demoResults
  }
  
  const generateDemo3DResults = () => {
    const demoResults = [
      {
        date: '2024-12-16',
        session: 'Second Draw',
        time: '3:00 PM',
        number: '582',
        dayName: '16 Dec'
      },
      {
        date: '2024-12-01',
        session: 'First Draw',
        time: '3:00 PM',
        number: '149',
        dayName: '1 Dec'
      },
      {
        date: '2024-11-16',
        session: 'Second Draw',
        time: '3:00 PM',
        number: '736',
        dayName: '16 Nov'
      },
      {
        date: '2024-11-01',
        session: 'First Draw',
        time: '3:00 PM',
        number: '204',
        dayName: '1 Nov'
      }
    ]
    return demoResults
  }
  
  // Load results from API or use demo data
  const loadResults = async () => {
    loading.value = true
    
    try {
      // Try to load from API
      const [response2D, response3D] = await Promise.all([
        api.get2DLiveResults(),
        api.get3DResults()
      ])
      
      if (response2D.msgState === 'data' && response2D.data.length > 0) {
        results2D.value = response2D.data
      } else {
        results2D.value = generateDemo2DResults()
      }
      
      if (response3D.msgState === 'data' && response3D.data.length > 0) {
        results3D.value = response3D.data
      } else {
        results3D.value = generateDemo3DResults()
      }
    } catch (error) {
      // Fallback to demo data
      results2D.value = generateDemo2DResults()
      results3D.value = generateDemo3DResults()
    } finally {
      loading.value = false
    }
  }
  
  // Get next draw times
  const getNext2DDraw = () => {
    const schedule = get2DSchedule()
    return schedule[0] || null
  }
  
  const getNext3DDraw = () => {
    const schedule = get3DSchedule()
    return schedule[0] || null
  }
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        weekday: 'short'
      })
    }
  }
  
  // Get time until next draw
  const getTimeUntilNextDraw = (gameType) => {
    const nextDraw = gameType === '2D' ? getNext2DDraw() : getNext3DDraw()
    if (!nextDraw) return null
    
    const now = new Date()
    const drawTime = new Date(`${nextDraw.date} ${nextDraw.time}`)
    const diff = drawTime - now
    
    if (diff <= 0) return 'Draw time passed'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }
  
  // Computed properties
  const recent2DResults = computed(() => results2D.value.slice(0, 3))
  const recent3DResults = computed(() => results3D.value.slice(0, 3))
  
  const next2DDraw = computed(() => getNext2DDraw())
  const next3DDraw = computed(() => getNext3DDraw())
  
  const timeUntilNext2D = computed(() => getTimeUntilNextDraw('2D'))
  const timeUntilNext3D = computed(() => getTimeUntilNextDraw('3D'))
  
  return {
    // State
    results2D,
    results3D,
    loading,
    
    // Actions
    loadResults,
    get2DSchedule,
    get3DSchedule,
    
    // Utilities
    formatDate,
    getTimeUntilNextDraw,
    
    // Computed
    recent2DResults,
    recent3DResults,
    next2DDraw,
    next3DDraw,
    timeUntilNext2D,
    timeUntilNext3D
  }
}