import { ref, watch } from 'vue'

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const storedValue = localStorage.getItem(key)
  const value = ref<T>(storedValue ? JSON.parse(storedValue) : initialValue)

  watch(
    value,
    (newValue) => {
      if (newValue === null || newValue === undefined) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, JSON.stringify(newValue))
      }
    },
    { deep: true },
  )

  const setValue = (newValue: T) => {
    value.value = newValue
  }

  const removeValue = () => {
    value.value = initialValue
    localStorage.removeItem(key)
  }

  return {
    value,
    setValue,
    removeValue,
  }
}

// Helper functions for common use cases
export const useFavorites = () => {
  const { value: favorites, setValue: setFavorites } = useLocalStorage<number[]>('favorites', [])

  const toggleFavorite = (id: number) => {
    const index = favorites.value.indexOf(id)
    if (index === -1) {
      setFavorites([...favorites.value, id])
    } else {
      setFavorites(favorites.value.filter((favId) => favId !== id))
    }
  }

  const isFavorite = (id: number) => {
    return favorites.value.includes(id)
  }

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  }
}
