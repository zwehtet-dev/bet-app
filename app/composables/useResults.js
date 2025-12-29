import { ref, computed } from 'vue'
import { useApi } from './useApi'
import { useApiCache } from './useApiCache'

// Singleton state for caching across components
const raw2DData = ref([])
const raw3DData = ref([])
const results2D = ref([])
const results3D = ref([])
const liveResult = ref(null)
const loading = ref(false)
const lastFetchTime = ref(0)
const CACHE_DURATION = 60000 // 1 minute

export const useResults = () => {
  const api = useApi()
  const cache = useApiCache()

  const parseDate = (dateStr) => {
    if (!dateStr) return null
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/')
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
      }
    }
    return dateStr
  }

  const process2DData = (rawData) => {
    const processed = []
    if (!rawData) return processed
    if (!Array.isArray(rawData)) rawData = [rawData]
    
    rawData.forEach((day, dayIndex) => {
      if (!day || typeof day !== 'object') return
      
      const date = parseDate(day.date)
      const dayEntry = {
        date,
        displayDate: day.date,
        isToday: dayIndex === 0,
        live: day.live,
        slots: []
      }

      if (day.result_1200) {
        dayEntry.slots.push({ time: '12:01 PM', timeKey: '1200', result: day.result_1200, set: day.set_1200, value: day.val_1200 })
      }
      if (day.result_430) {
        dayEntry.slots.push({ time: '4:30 PM', timeKey: '430', result: day.result_430, set: day.set_430, value: day.val_430 })
      }
      if (day.modern_930 || day.internet_930) {
        dayEntry.slots.push({ time: '09:30 AM', timeKey: '930', modern: day.modern_930, internet: day.internet_930, isModernInternet: true })
      }
      if (day.result_1100) {
        dayEntry.slots.push({ time: '11:00 AM', timeKey: '1100', result: day.result_1100, set: day.set_1100, value: day.val_1100 })
      }
      if (day.modern_200 || day.internet_200) {
        dayEntry.slots.push({ time: '02:00 PM', timeKey: '200', modern: day.modern_200, internet: day.internet_200, isModernInternet: true })
      }
      if (day.result_300) {
        dayEntry.slots.push({ time: '03:00 PM', timeKey: '300', result: day.result_300, set: day.set_300, value: day.val_300 })
      }

      if (dayEntry.slots.length > 0) processed.push(dayEntry)
    })

    return processed
  }

  const process3DData = (rawData) => {
    const processed = []
    if (!Array.isArray(rawData)) return processed
    
    rawData.forEach(item => {
      const date = parseDate(item.date) || item.date
      const number = item.threed || item.number || item.result
      
      if (number) {
        processed.push({ date, displayDate: item.date, number, session: item.session || 'Draw' })
      }
    })

    return processed
  }

  const load2DResults = async (forceRefresh = false) => {
    if (!forceRefresh && results2D.value.length > 0 && Date.now() - lastFetchTime.value < CACHE_DURATION) {
      return { success: true, cached: true }
    }

    // Check cache
    const cached = cache.get('2DHistory')
    if (!forceRefresh && cached) {
      raw2DData.value = cached
      results2D.value = process2DData(cached)
      if (cached.length > 0 && cached[0].live) {
        liveResult.value = { number: cached[0].live, date: parseDate(cached[0].date), isLive: true }
      }
      return { success: true, cached: true }
    }

    try {
      const response = await api.get2DResultHistory()
      
      if (response.msgState === 'data' && response.data) {
        let dataArray = Array.isArray(response.data) ? response.data : [response.data]
        
        raw2DData.value = dataArray
        results2D.value = process2DData(dataArray)
        cache.set('2DHistory', dataArray)
        
        if (dataArray.length > 0 && dataArray[0].live) {
          liveResult.value = { number: dataArray[0].live, date: parseDate(dataArray[0].date), isLive: true }
        }
        
        return { success: true }
      }
      return { success: false }
    } catch (error) {
      console.error('Failed to load 2D results:', error)
      return { success: false, error }
    }
  }

  const load3DResults = async (forceRefresh = false) => {
    if (!forceRefresh && results3D.value.length > 0 && Date.now() - lastFetchTime.value < CACHE_DURATION) {
      return { success: true, cached: true }
    }

    // Check cache
    const cached = cache.get('3DResults')
    if (!forceRefresh && cached) {
      raw3DData.value = cached
      results3D.value = process3DData(cached)
      return { success: true, cached: true }
    }

    try {
      const response = await api.get3DResults()
      
      if (response.msgState === 'data' && response.data) {
        const dataArray = Array.isArray(response.data) ? response.data : []
        raw3DData.value = dataArray
        results3D.value = process3DData(dataArray)
        cache.set('3DResults', dataArray)
        return { success: true }
      }
      return { success: false }
    } catch (error) {
      console.error('Failed to load 3D results:', error)
      return { success: false, error }
    }
  }

  const loadResults = async (forceRefresh = false) => {
    if (!forceRefresh && results2D.value.length > 0 && results3D.value.length > 0) {
      const timeSinceLastFetch = Date.now() - lastFetchTime.value
      if (timeSinceLastFetch < CACHE_DURATION) {
        return { live2D: true, result3D: true, cached: true }
      }
    }

    loading.value = true

    try {
      const [result2D, result3D] = await Promise.all([
        load2DResults(forceRefresh),
        load3DResults(forceRefresh)
      ])

      lastFetchTime.value = Date.now()

      return { live2D: result2D.success, result3D: result3D.success }
    } catch (error) {
      console.error('Failed to load results:', error)
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  const refreshLive2D = async () => {
    try {
      const response = await api.get2DResultHistory()
      
      if (response.msgState === 'data' && response.data) {
        const dataArray = Array.isArray(response.data) ? response.data : [response.data]
        
        if (dataArray.length > 0) {
          raw2DData.value = dataArray
          results2D.value = process2DData(dataArray)
          cache.set('2DHistory', dataArray)
          
          if (dataArray[0].live) {
            liveResult.value = { number: dataArray[0].live, date: parseDate(dataArray[0].date), isLive: true }
          }
        }
        return { success: true }
      }
      return { success: false }
    } catch (error) {
      return { success: false, error }
    }
  }

  // Schedule helpers
  const get2DSchedule = () => {
    const schedule = []
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dayOfWeek = date.getDay()

      if (dayOfWeek === 0 || dayOfWeek === 6) continue

      schedule.push({ date: date.toISOString().split('T')[0], time: '12:01 PM', session: 'Morning', dayName: date.toLocaleDateString('en-US', { weekday: 'short' }) })
      schedule.push({ date: date.toISOString().split('T')[0], time: '4:30 PM', session: 'Evening', dayName: date.toLocaleDateString('en-US', { weekday: 'short' }) })
    }

    return schedule.slice(0, 10)
  }

  const get3DSchedule = () => {
    const schedule = []
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
      const targetMonth = currentMonth + monthOffset
      const targetYear = currentYear + Math.floor(targetMonth / 12)
      const adjustedMonth = targetMonth % 12

      const firstDate = new Date(targetYear, adjustedMonth, 1, 16, 30)
      if (firstDate >= today) {
        schedule.push({ date: firstDate.toISOString().split('T')[0], time: '4:30 PM', session: 'First Draw', dayName: firstDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) })
      }

      const sixteenthDate = new Date(targetYear, adjustedMonth, 16, 16, 30)
      if (sixteenthDate >= today) {
        schedule.push({ date: sixteenthDate.toISOString().split('T')[0], time: '4:30 PM', session: 'Second Draw', dayName: sixteenthDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) })
      }
    }

    return schedule.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 6)
  }

  const getTimeUntilNextDraw = (gameType) => {
    const nextDraw = gameType === '2D' ? get2DSchedule()[0] : get3DSchedule()[0]
    if (!nextDraw) return null

    const now = new Date()
    const [time, period] = nextDraw.time.split(' ')
    const [hours, minutes] = time.split(':').map(Number)
    let hour24 = hours
    if (period === 'PM' && hours !== 12) hour24 += 12
    if (period === 'AM' && hours === 12) hour24 = 0
    
    const drawTime = new Date(nextDraw.date)
    drawTime.setHours(hour24, minutes, 0, 0)
    
    const diff = drawTime - now
    if (diff <= 0) return 'Draw time passed'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hrs}h ${mins}m`
    if (hrs > 0) return `${hrs}h ${mins}m`
    return `${mins}m`
  }

  const next2DDraw = computed(() => get2DSchedule()[0] || null)
  const next3DDraw = computed(() => get3DSchedule()[0] || null)
  const timeUntilNext2D = computed(() => getTimeUntilNextDraw('2D'))
  const timeUntilNext3D = computed(() => getTimeUntilNextDraw('3D'))
  const hasLiveResult = computed(() => !!liveResult.value)
  const hasData = computed(() => results2D.value.length > 0 || results3D.value.length > 0)

  return {
    results2D, results3D, liveResult, loading, hasData,
    loadResults, load2DResults, load3DResults, refreshLive2D,
    next2DDraw, next3DDraw, timeUntilNext2D, timeUntilNext3D, hasLiveResult
  }
}
