import { ref, onMounted, onUnmounted } from 'vue'
import { useApi } from './useApi'

export const useAnnouncements = () => {
  const api = useApi()
  
  const announcements = ref([])
  const currentIndex = ref(0)
  const loading = ref(false)
  const autoScrollInterval = ref(null)
  
  // Demo announcements data
  const demoAnnouncements = [
    {
      id: 1,
      message: '🎉 ယနေ့ 2D မနက်ပိုင်း ရလဒ် 47 ထွက်ပါပြီ! ဆုရသူများ ဂုဏ်ယူပါ!',
      type: 'success',
      priority: 'high',
      isActive: true
    },
    {
      id: 2,
      message: '⚽ BawDi နှင့် Maung ဘောလုံး လောင်းကစား မကြာမီ စတင်မည်! စောင့်ကြည့်ပါ!',
      type: 'info',
      priority: 'medium',
      isActive: true
    },
    {
      id: 3,
      message: '💰 ယနေ့ညနေ 4:30 PM 2D ထုတ်ပေါက်မှု အတွက် အချိန်မီ လောင်းကစားပါ!',
      type: 'warning',
      priority: 'high',
      isActive: true
    },
    {
      id: 4,
      message: '🔥 3D လောင်းကစား - လ၏ ၁၆ ရက်နေ့ 3:00 PM တွင် ထုတ်ပေါက်မည်!',
      type: 'info',
      priority: 'medium',
      isActive: true
    },
    {
      id: 5,
      message: '📱 မိုဘိုင်းဘဏ်များဖြင့် လုံခြုံစွာ ငွေဖြည့်နိုင်ပါသည် - KBZ Pay, Wave Money, CB Pay',
      type: 'info',
      priority: 'low',
      isActive: true
    },
    {
      id: 6,
      message: '🎯 ကံကောင်းသော နံပါတ်များ ရွေးချယ်ပြီး ကြီးမားသော ဆုငွေများ ရယူပါ!',
      type: 'success',
      priority: 'medium',
      isActive: true
    }
  ]
  
  // Load announcements from API or use demo data
  const loadAnnouncements = async () => {
    loading.value = true
    
    try {
      // Try to load from API (placeholder for future implementation)
      // const response = await api.getAnnouncements()
      
      // For now, use demo data
      announcements.value = demoAnnouncements.filter(ann => ann.isActive)
    } catch (error) {
      // Fallback to demo data
      announcements.value = demoAnnouncements.filter(ann => ann.isActive)
    } finally {
      loading.value = false
    }
  }
  
  // Auto-scroll through announcements
  const startAutoScroll = () => {
    if (announcements.value.length > 1) {
      autoScrollInterval.value = setInterval(() => {
        currentIndex.value = (currentIndex.value + 1) % announcements.value.length
      }, 4000) // Change announcement every 4 seconds
    }
  }
  
  // Stop auto-scroll
  const stopAutoScroll = () => {
    if (autoScrollInterval.value) {
      clearInterval(autoScrollInterval.value)
      autoScrollInterval.value = null
    }
  }
  
  // Manual navigation
  const goToNext = () => {
    if (announcements.value.length > 1) {
      currentIndex.value = (currentIndex.value + 1) % announcements.value.length
      resetAutoScroll()
    }
  }
  
  const goToPrevious = () => {
    if (announcements.value.length > 1) {
      currentIndex.value = currentIndex.value === 0 
        ? announcements.value.length - 1 
        : currentIndex.value - 1
      resetAutoScroll()
    }
  }
  
  const goToIndex = (index) => {
    if (index >= 0 && index < announcements.value.length) {
      currentIndex.value = index
      resetAutoScroll()
    }
  }
  
  // Reset auto-scroll timer
  const resetAutoScroll = () => {
    stopAutoScroll()
    startAutoScroll()
  }
  
  // Get announcement type styling
  const getAnnouncementStyle = (type) => {
    const styles = {
      success: {
        bg: 'bg-green-500/20',
        border: 'border-green-500/30',
        text: 'text-green-300',
        icon: '🎉'
      },
      warning: {
        bg: 'bg-yellow-500/20',
        border: 'border-yellow-500/30',
        text: 'text-yellow-300',
        icon: '⚠️'
      },
      info: {
        bg: 'bg-blue-500/20',
        border: 'border-blue-500/30',
        text: 'text-blue-300',
        icon: 'ℹ️'
      },
      error: {
        bg: 'bg-red-500/20',
        border: 'border-red-500/30',
        text: 'text-red-300',
        icon: '❌'
      }
    }
    return styles[type] || styles.info
  }
  
  // Lifecycle management
  onMounted(() => {
    loadAnnouncements().then(() => {
      startAutoScroll()
    })
  })
  
  onUnmounted(() => {
    stopAutoScroll()
  })
  
  return {
    // State
    announcements,
    currentIndex,
    loading,
    
    // Actions
    loadAnnouncements,
    goToNext,
    goToPrevious,
    goToIndex,
    startAutoScroll,
    stopAutoScroll,
    
    // Utilities
    getAnnouncementStyle
  }
}