import { ref, computed } from 'vue'

export const use2DPatterns = () => {
  const selectedPatterns = ref([])
  
  // Define 2D patterns with Myanmar names
  const patterns = [
    {
      id: 'even_even',
      name: 'စုံစုံ',
      nameEn: 'Even-Even',
      description: 'နှစ်လုံးစလုံး စုံဂဏန်း',
      descriptionEn: 'Both digits are even',
      generate: () => {
        const numbers = []
        for (let i = 0; i <= 9; i += 2) {
          for (let j = 0; j <= 9; j += 2) {
            numbers.push(i * 10 + j)
          }
        }
        return numbers
      }
    },
    {
      id: 'odd_odd',
      name: 'မမ',
      nameEn: 'Odd-Odd',
      description: 'နှစ်လုံးစလုံး မဂဏန်း',
      descriptionEn: 'Both digits are odd',
      generate: () => {
        const numbers = []
        for (let i = 1; i <= 9; i += 2) {
          for (let j = 1; j <= 9; j += 2) {
            numbers.push(i * 10 + j)
          }
        }
        return numbers
      }
    },
    {
      id: 'even_odd',
      name: 'စုံမ',
      nameEn: 'Even-Odd',
      description: 'ပထမလုံး စုံ၊ ဒုတိယလုံး မ',
      descriptionEn: 'First digit even, second digit odd',
      generate: () => {
        const numbers = []
        for (let i = 0; i <= 9; i += 2) {
          for (let j = 1; j <= 9; j += 2) {
            numbers.push(i * 10 + j)
          }
        }
        return numbers
      }
    },
    {
      id: 'odd_even',
      name: 'မစုံ',
      nameEn: 'Odd-Even',
      description: 'ပထမလုံး မ၊ ဒုတိယလုံး စုံ',
      descriptionEn: 'First digit odd, second digit even',
      generate: () => {
        const numbers = []
        for (let i = 1; i <= 9; i += 2) {
          for (let j = 0; j <= 9; j += 2) {
            numbers.push(i * 10 + j)
          }
        }
        return numbers
      }
    },
    {
      id: 'same_digits',
      name: 'တူတူ',
      nameEn: 'Same Digits',
      description: 'နှစ်လုံးတူညီသော ဂဏန်းများ',
      descriptionEn: 'Both digits are the same',
      generate: () => {
        return [0, 11, 22, 33, 44, 55, 66, 77, 88, 99]
      }
    },
    {
      id: 'reverse_pairs',
      name: 'ပြောင်းပြန်',
      nameEn: 'Reverse Pairs',
      description: 'ပြောင်းပြန် ဂဏန်းများ',
      descriptionEn: 'Reverse digit pairs',
      generate: () => {
        return [12, 21, 13, 31, 14, 41, 15, 51, 16, 61, 17, 71, 18, 81, 19, 91, 
                23, 32, 24, 42, 25, 52, 26, 62, 27, 72, 28, 82, 29, 92,
                34, 43, 35, 53, 36, 63, 37, 73, 38, 83, 39, 93,
                45, 54, 46, 64, 47, 74, 48, 84, 49, 94,
                56, 65, 57, 75, 58, 85, 59, 95,
                67, 76, 68, 86, 69, 96,
                78, 87, 79, 97,
                89, 98]
      }
    },
    {
      id: 'sum_single',
      name: 'ပေါင်းတစ်လုံး',
      nameEn: 'Sum Single Digit',
      description: 'ပေါင်းလဒ် တစ်လုံးဂဏန်း',
      descriptionEn: 'Sum of digits is single digit',
      generate: () => {
        const numbers = []
        for (let i = 0; i < 100; i++) {
          const first = Math.floor(i / 10)
          const second = i % 10
          if ((first + second) < 10) {
            numbers.push(i)
          }
        }
        return numbers
      }
    },
    {
      id: 'sum_double',
      name: 'ပေါင်းနှစ်လုံး',
      nameEn: 'Sum Double Digit',
      description: 'ပေါင်းလဒ် နှစ်လုံးဂဏန်း',
      descriptionEn: 'Sum of digits is double digit',
      generate: () => {
        const numbers = []
        for (let i = 0; i < 100; i++) {
          const first = Math.floor(i / 10)
          const second = i % 10
          if ((first + second) >= 10) {
            numbers.push(i)
          }
        }
        return numbers
      }
    },
    {
      id: 'ascending',
      name: 'တက်လမ်း',
      nameEn: 'Ascending',
      description: 'ပထမလုံး < ဒုတိယလုံး',
      descriptionEn: 'First digit < Second digit',
      generate: () => {
        const numbers = []
        for (let i = 0; i < 10; i++) {
          for (let j = i + 1; j < 10; j++) {
            numbers.push(i * 10 + j)
          }
        }
        return numbers
      }
    },
    {
      id: 'descending',
      name: 'ဆင်းလမ်း',
      nameEn: 'Descending',
      description: 'ပထမလုံး > ဒုတိယလုံး',
      descriptionEn: 'First digit > Second digit',
      generate: () => {
        const numbers = []
        for (let i = 1; i < 10; i++) {
          for (let j = 0; j < i; j++) {
            numbers.push(i * 10 + j)
          }
        }
        return numbers
      }
    }
  ]
  
  // Toggle pattern selection
  const togglePattern = (patternId) => {
    const index = selectedPatterns.value.indexOf(patternId)
    if (index > -1) {
      selectedPatterns.value.splice(index, 1)
    } else {
      selectedPatterns.value.push(patternId)
    }
  }
  
  // Clear all pattern selections
  const clearPatterns = () => {
    selectedPatterns.value = []
  }
  
  // Get numbers from selected patterns
  const getSelectedNumbers = computed(() => {
    const allNumbers = new Set()
    
    selectedPatterns.value.forEach(patternId => {
      const pattern = patterns.find(p => p.id === patternId)
      if (pattern) {
        const numbers = pattern.generate()
        numbers.forEach(num => allNumbers.add(num))
      }
    })
    
    return Array.from(allNumbers).sort((a, b) => a - b)
  })
  
  // Get pattern by ID
  const getPattern = (patternId) => {
    return patterns.find(p => p.id === patternId)
  }
  
  // Check if pattern is selected
  const isPatternSelected = (patternId) => {
    return selectedPatterns.value.includes(patternId)
  }
  
  // Get pattern count
  const getPatternCount = (patternId) => {
    const pattern = patterns.find(p => p.id === patternId)
    return pattern ? pattern.generate().length : 0
  }
  
  return {
    // State
    patterns,
    selectedPatterns,
    
    // Actions
    togglePattern,
    clearPatterns,
    
    // Computed
    getSelectedNumbers,
    
    // Utilities
    getPattern,
    isPatternSelected,
    getPatternCount
  }
}