import { computed, ref, onMounted, onUnmounted } from 'vue'
import type { AppBreakpoints } from '@/types'

export const useResponsive = () => {
  const breakpoints: AppBreakpoints = {
    mobile: 768,
    tablet: 1024,
    desktop: 769,
  }

  const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

  const updateWidth = () => {
    windowWidth.value = window.innerWidth
  }

  onMounted(() => {
    updateWidth()
    window.addEventListener('resize', updateWidth)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
  })

  const isMobile = computed(() => windowWidth.value < breakpoints.mobile)
  const isTablet = computed(
    () => windowWidth.value >= breakpoints.mobile && windowWidth.value < breakpoints.tablet,
  )
  const isDesktop = computed(() => windowWidth.value >= breakpoints.desktop)

  const breakpoint = computed(() => {
    if (isMobile.value) return 'mobile'
    if (isTablet.value) return 'tablet'
    return 'desktop'
  })

  return {
    isMobile,
    isTablet,
    isDesktop,
    breakpoint,
    windowWidth,
  }
}
