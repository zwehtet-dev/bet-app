import { ref, onMounted, onUnmounted } from 'vue'
import { useApi } from './useApi'
import { useApiCache } from './useApiCache'

// Singleton state for caching across components
const carouselImages = ref([])
const currentSlide = ref(0)
const loading = ref(false)
const isLoaded = ref(false)

export const useCarousel = () => {
  const api = useApi()
  const cache = useApiCache()
  
  let autoSlideInterval = null

  const fallbackCarouselData = [
    { id: 1, imageUrl: '', title: '2D3D လောင်းကစား', subtitle: 'ယနေ့ပဲ စတင်လိုက်ပါ', isActive: true, bgColor: 'from-blue-600 to-purple-600' },
    { id: 2, imageUrl: '', title: 'ကံကောင်းသော နံပါတ်များ', subtitle: 'သင့်အတွက် အကောင်းဆုံး', isActive: true, bgColor: 'from-green-600 to-blue-600' },
    { id: 3, imageUrl: '', title: 'ကြီးမားသော ဆုငွေများ', subtitle: 'အနိုင်ရဖို့ အခွင့်အလမ်း', isActive: true, bgColor: 'from-yellow-600 to-red-600' }
  ]

  const loadCarouselImages = async () => {
    // Return cached data if available
    if (isLoaded.value && carouselImages.value.length > 0) {
      return { success: true, cached: true }
    }
    
    // Check cache
    const cached = cache.get('carousel')
    if (cached) {
      carouselImages.value = cached
      isLoaded.value = true
      return { success: true, cached: true }
    }

    loading.value = true

    try {
      const response = await api.getCarouselImages()

      if (response.msgState === 'data' && response.data?.length > 0) {
        const images = response.data.map((img, index) => ({
          id: img.id,
          imageUrl: img.imageUrl || img.link,
          title: '',
          subtitle: '',
          isActive: img.isActive !== false,
          sortNo: img.sortNo,
          bgColor: ['from-blue-600 to-purple-600', 'from-green-600 to-blue-600', 'from-yellow-600 to-red-600', 'from-purple-600 to-pink-600', 'from-indigo-600 to-blue-600'][index % 5]
        }))
        
        carouselImages.value = images
        cache.set('carousel', images)
        isLoaded.value = true
      } else {
        carouselImages.value = fallbackCarouselData
        isLoaded.value = true
      }
      
      return { success: true }
    } catch (error) {
      console.error('Carousel load error:', error)
      carouselImages.value = fallbackCarouselData
      isLoaded.value = true
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  const goToSlide = (index) => {
    if (index >= 0 && index < carouselImages.value.length) {
      currentSlide.value = index
      resetAutoSlide()
    }
  }

  const nextSlide = () => {
    if (carouselImages.value.length > 0) {
      currentSlide.value = (currentSlide.value + 1) % carouselImages.value.length
    }
  }

  const prevSlide = () => {
    if (carouselImages.value.length > 0) {
      currentSlide.value = currentSlide.value === 0 
        ? carouselImages.value.length - 1 
        : currentSlide.value - 1
    }
  }

  const startAutoSlide = () => {
    if (carouselImages.value.length > 1 && !autoSlideInterval) {
      autoSlideInterval = setInterval(nextSlide, 5000)
    }
  }

  const stopAutoSlide = () => {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval)
      autoSlideInterval = null
    }
  }

  const resetAutoSlide = () => {
    stopAutoSlide()
    startAutoSlide()
  }

  // Touch handling with debounce
  const touchStart = ref({ x: 0, y: 0 })
  const touchEnd = ref({ x: 0, y: 0 })
  let touchTimeout = null

  const handleTouchStart = (e) => { 
    touchStart.value = { x: e.touches[0].clientX, y: e.touches[0].clientY } 
  }
  
  const handleTouchMove = (e) => { 
    touchEnd.value = { x: e.touches[0].clientX, y: e.touches[0].clientY } 
  }
  
  const handleTouchEnd = () => {
    if (touchTimeout) clearTimeout(touchTimeout)
    
    touchTimeout = setTimeout(() => {
      const deltaX = touchStart.value.x - touchEnd.value.x
      const deltaY = touchStart.value.y - touchEnd.value.y
      
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        deltaX > 0 ? nextSlide() : prevSlide()
      }
    }, 10)
  }

  // Cleanup on unmount
  const cleanup = () => {
    stopAutoSlide()
    if (touchTimeout) clearTimeout(touchTimeout)
  }

  return {
    carouselImages,
    currentSlide,
    loading,
    loadCarouselImages,
    goToSlide,
    nextSlide,
    prevSlide,
    startAutoSlide,
    stopAutoSlide,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    cleanup
  }
}
