import { reactive } from 'vue'

export interface ValidationRule {
  validate: (value: unknown, allValues?: Record<string, unknown>) => boolean
  message: string
}


export interface ValidationRules {
  [key: string]: ValidationRule[]
}

export const useFormValidation = <T extends Record<string, unknown>>(
  formData: T,
  rules: ValidationRules,
) => {
  const errors = reactive<Record<string, string>>({})

  const validateField = (field: keyof T): boolean => {
    const value = formData[field]
    const fieldRules = rules[field as string] || []

    for (const rule of fieldRules) {
      if (!rule.validate(value)) {
        errors[field as string] = rule.message
        return false
      }
    }

    delete errors[field as string]
    return true
  }

  const validateForm = (): boolean => {
    let isValid = true

    Object.keys(rules).forEach((field) => {
      if (!validateField(field as keyof T)) {
        isValid = false
      }
    })

    return isValid
  }

  const resetErrors = () => {
    Object.keys(errors).forEach((key) => {
      delete errors[key]
    })
  }

  return {
    errors,
    validateField,
    validateForm,
    resetErrors,
  }
}

// Common validation rules
export const validators = {
  required: (message = 'This field is required'): ValidationRule => ({
    validate: (value: unknown) => {
      if (typeof value === 'string') {
        return value.trim().length > 0
      }
      return value !== null && value !== undefined && value !== ''
    },
    message,
  }),

  email: (message = 'Please enter a valid email'): ValidationRule => ({
    validate: (value: unknown) => {
      const email = String(value)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value: unknown) => String(value).length >= min,
    message: message || `Must be at least ${min} characters`,
  }),

  phone: (message = 'Please enter a valid phone number'): ValidationRule => ({
    validate: (value: unknown) => {
      const phone = String(value)
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
      return phoneRegex.test(phone.replace(/\D/g, ''))
    },
    message,
  }),

  match: (fieldToMatch: string, message?: string): ValidationRule => ({
    validate: (value: unknown, allValues?: Record<string, unknown>) => {
      return value === allValues?.[fieldToMatch]
    },
    message: message || 'Values do not match',
  }),
}
