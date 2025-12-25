import { ref, onMounted, onUnmounted } from 'vue'
import { useApi } from './useApi'

export const useCarousel = () => {
  const api = useApi()
  
  const carouselImages = ref([])
  const currentSlide = ref(0)
  const loading = ref(false)
  const autoSlideInterval = ref(null)
  
  // Demo carousel data
  const demoCarouselData = [
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&h=400&fit=crop&crop=center',
      title: '2D3D လောင်းကစား',
      subtitle: 'ယနေ့ပဲ စတင်လိုက်ပါ',
      isActive: true,
      bgColor: 'from-blue-600 to-purple-600'
    },
    {
      id: 2,
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&crop=center',
      title: 'ကံကောင်းသော နံပါတ်များ',
      subtitle: 'သင့်အတွက် အကောင်းဆုံး',
      isActive: true,
      bgColor: 'from-green-600 to-blue-600'
    },
    {
      id: 3,
      imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=400&fit=crop&crop=center',
      title: 'ကြီးမားသော ဆုငွေများ',
      subtitle: 'အနိုင်ရဖို့ အခွင့်အလမ်း',
      isActive: true,
      bgColor: 'from-yellow-600 to-red-600'
    },
    {
      id: 4,
      imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop&crop=center',
      title: 'လုံခြုံသော ငွေပေးချေမှု',
      subtitle: 'မိုဘိုင်းဘဏ်များ ပံ့ပိုးမှု',
      isActive: true,
      bgColor: 'from-purple-600 to-pink-600'
    },
    {
      id: 5,
      imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop&crop=center',
      title: '24/7 ဝန်ဆောင်မှု',
      subtitle: 'အချိန်မရွေး လောင်းကစားပါ',
      isActive: true,
      bgColor: 'from-indigo-600 to-blue-600'
    }
  ]
  
  // Load carousel images
  const loadCarouselImages = async () => {
    loading.value = true
    
    try {
      const response = await api.getCarouselImages()
      
      if (response.msgState === 'data' && response.data.length > 0) {
        // Use API data if available
        carouselImages.value = response.data.filter(img => img.isActive)
      } else {
        // Fallback to demo data
        carouselImages.value = demoCarouselData
      }
    } catch (error) {
      // Use demo data on error
      carouselImages.value = demoCarouselData
    } finally {
      loading.value = false
    }
  }
  
  // Navigate to specific slide
  const goToSlide = (index) => {
    if (index >= 0 && index < carouselImages.value.length) {
      currentSlide.value = index
      resetAutoSlide()
    }
  }
  
  // Go to next slide
  const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % carouselImages.value.length
    resetAutoSlide()
  }
  
  // Go to previous slide
  const prevSlide = () => {
    currentSlide.value = currentSlide.value === 0 
      ? carouselImages.value.length - 1 
      : currentSlide.value - 1
    resetAutoSlide()
  }
  
  // Start auto slide
  const startAutoSlide = () => {
    if (carouselImages.value.length > 1) {
      autoSlideInterval.value = setInterval(() => {
        nextSlide()
      }, 4000) // Change slide every 4 seconds
    }
  }
  
  // Stop auto slide
  const stopAutoSlide = () => {
    if (autoSlideInterval.value) {
      clearInterval(autoSlideInterval.value)
      autoSlideInterval.value = null
    }
  }
  
  // Reset auto slide timer
  const resetAutoSlide = () => {
    stopAutoSlide()
    startAutoSlide()
  }
  
  // Handle touch/swipe events
  const touchStart = ref({ x: 0, y: 0 })
  const touchEnd = ref({ x: 0, y: 0 })
  
  const handleTouchStart = (e) => {
    touchStart.value = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    }
  }
  
  const handleTouchMove = (e) => {
    touchEnd.value = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    }
  }
  
  const handleTouchEnd = () => {
    const deltaX = touchStart.value.x - touchEnd.value.x
    const deltaY = touchStart.value.y - touchEnd.value.y
    
    // Only handle horizontal swipes (ignore vertical scrolling)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        nextSlide() // Swipe left - next slide
      } else {
        prevSlide() // Swipe right - previous slide
      }
    }
  }
  
  // Lifecycle management
  onMounted(() => {
    loadCarouselImages()
    startAutoSlide()
  })
  
  onUnmounted(() => {
    stopAutoSlide()
  })
  
  return {
    // State
    carouselImages,
    currentSlide,
    loading,
    
    // Actions
    loadCarouselImages,
    goToSlide,
    nextSlide,
    prevSlide,
    startAutoSlide,
    stopAutoSlide,
    
    // Touch handlers
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  }
}