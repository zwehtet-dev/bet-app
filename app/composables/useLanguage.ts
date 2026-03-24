import { onMounted } from 'vue'

export const useLanguage = () => {
  const locale = useState<'en' | 'mm'>('locale', () => 'mm')

  const setLocale = (newLocale: 'en' | 'mm') => {
    locale.value = newLocale
    if (process.client) {
      localStorage.setItem('locale', newLocale)
    }
  }

  const toggleLocale = () => {
    setLocale(locale.value === 'en' ? 'mm' : 'en')
  }

  const t = (en: string, mm: string) => {
    return locale.value === 'mm' ? mm : en
  }

  // Initialize from localStorage only on client after mount
  onMounted(() => {
    if (process.client) {
      const savedLocale = localStorage.getItem('locale') as 'en' | 'mm' | null
      if (savedLocale && savedLocale !== locale.value) {
        locale.value = savedLocale
      }
    }
  })

  return {
    locale,
    setLocale,
    toggleLocale,
    t
  }
}
