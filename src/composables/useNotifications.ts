import { Notify } from 'quasar'

export const useNotifications = () => {
  const showSuccess = (message: string, options?: object) => {
    Notify.create({
      type: 'positive',
      message,
      position: 'top',
      timeout: 3000,
      ...options,
    })
  }

  const showError = (message: string, options?: object) => {
    Notify.create({
      type: 'negative',
      message,
      position: 'top',
      timeout: 4000,
      ...options,
    })
  }

  const showInfo = (message: string, options?: object) => {
    Notify.create({
      type: 'info',
      message,
      position: 'top',
      timeout: 3000,
      ...options,
    })
  }

  const showWarning = (message: string, options?: object) => {
    Notify.create({
      type: 'warning',
      message,
      position: 'top',
      timeout: 3000,
      ...options,
    })
  }

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    notify: Notify.create, // Direct access to Notify.create for custom notifications
  }
}
