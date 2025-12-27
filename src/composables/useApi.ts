import { ref } from 'vue'

export const useApi = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async <T>(
    apiCall: () => Promise<T>,
    errorMessage = 'An error occurred',
  ): Promise<T | null> => {
    loading.value = true
    error.value = null

    try {
      return await apiCall()
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const apiErr = err as {
          response?: { data?: { message?: string } }
        }

        error.value = apiErr.response?.data?.message || errorMessage
      } else if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = errorMessage
      }

      console.error(errorMessage, err)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    execute,
  }
}
