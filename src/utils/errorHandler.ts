export interface ApiError {
  response?: {
    data?: {
      message?: string
      errors?: Record<string, string | string[]>
    }
  }
  message?: string
}

export const handleApiError = (
  error: unknown,
): {
  message: string
  errors?: Record<string, string>
} => {
  console.error('API Error:', error)

  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as ApiError
    const responseData = apiError.response?.data

    if (responseData?.errors) {
      const formattedErrors: Record<string, string> = {}
      Object.keys(responseData.errors).forEach((field) => {
        const errorValue = responseData.errors![field]
        formattedErrors[field] = Array.isArray(errorValue)
          ? (errorValue[0] ?? '')
          : (errorValue ?? '')
      })


      return {
        message: responseData.message || 'Please fix the errors above',
        errors: formattedErrors,
      }
    } else if (responseData?.message) {
      return { message: responseData.message }
    }
  }

  // Check if it's a standard Error object
  if (error instanceof Error) {
    return { message: error.message }
  }

  return { message: 'An unexpected error occurred. Please try again.' }
}
