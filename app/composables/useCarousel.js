import { ref, onMounted, onUnmounted } from 'vue'
import { useApi } from './useApi'

export const useCarousel = () => {
  const api = useApi()

  const carouselImages = ref([])
  const currentSlide = ref(0)
  const loading = ref(false)
  const autoSlideInterval = ref(null)

  // Fallback carousel data
  const fallbackCarouselData = [
    { id: 1, imageUrl: '', title: '2D3D လောင်းကစား', subtitle: 'ယနေ့ပဲ စတင်လိုက်ပါ', isActive: true, bgColor: 'from-blue-600 to-purple-600' },
    { id: 2, imageUrl: '', title: 'ကံကောင်းသော နံပါတ်များ', subtitle: 'သင့်အတွက် အကောင်းဆုံး', isActive: true, bgColor: 'from-green-600 to-blue-600' },
    { id: 3, imageUrl: '', title: 'ကြီးမားသော ဆုငွေများ', subtitle: 'အနိုင်ရဖို့ အခွင့်အလမ်း', isActive: true, bgColor: 'from-yellow-600 to-red-600' }
  ]

  const loadCarouselImages = async () => {
    loading.value = true

    try {
      const response = await api.getCarouselImages()
      console.log('API carousel response:', response)

      if (response.msgState === 'data' && response.data && response.data.length > 0) {
        carouselImages.value = response.data.map((img, index) => ({
          id: img.id,
          imageUrl: img.imageUrl || img.link, // API returns 'link', we map to 'imageUrl'
          title: '',
          subtitle: '',
          isActive: img.isActive !== false,
          sortNo: img.sortNo,
          bgColor: ['from-blue-600 to-purple-600', 'from-green-600 to-blue-600', 'from-yellow-600 to-red-600', 'from-purple-600 to-pink-600', 'from-indigo-600 to-blue-600'][index % 5]
        }))
        console.log('Mapped carousel images:', carouselImages.value)
      } else {
        console.log('Using fallback carousel data')
        carouselImages.value = fallbackCarouselData
      }
    } catch (error) {
      console.error('Carousel load error:', error)
      carouselImages.value = fallbackCarouselData
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
    currentSlide.value = (currentSlide.value + 1) % carouselImages.value.length
    resetAutoSlide()
  }

  const prevSlide = () => {
    currentSlide.value = currentSlide.value === 0 ? carouselImages.value.length - 1 : currentSlide.value - 1
    resetAutoSlide()
  }

  const startAutoSlide = () => {
    if (carouselImages.value.length > 1) {
      autoSlideInterval.value = setInterval(() => { nextSlide() }, 4000)
    }
  }

  const stopAutoSlide = () => {
    if (autoSlideInterval.value) {
      clearInterval(autoSlideInterval.value)
      autoSlideInterval.value = null
    }
  }

  const resetAutoSlide = () => {
    stopAutoSlide()
    startAutoSlide()
  }

  const touchStart = ref({ x: 0, y: 0 })
  const touchEnd = ref({ x: 0, y: 0 })

  const handleTouchStart = (e) => { touchStart.value = { x: e.touches[0].clientX, y: e.touches[0].clientY } }
  const handleTouchMove = (e) => { touchEnd.value = { x: e.touches[0].clientX, y: e.touches[0].clientY } }
  const handleTouchEnd = () => {
    const deltaX = touchStart.value.x - touchEnd.value.x
    const deltaY = touchStart.value.y - touchEnd.value.y
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      deltaX > 0 ? nextSlide() : prevSlide()
    }
  }

  onMounted(() => { loadCarouselImages(); startAutoSlide() })
  onUnmounted(() => { stopAutoSlide() })

  return {
    carouselImages, currentSlide, loading,
    loadCarouselImages, goToSlide, nextSlide, prevSlide, startAutoSlide, stopAutoSlide,
    handleTouchStart, handleTouchMove, handleTouchEnd
  }
}
