import { useNavigate } from 'react-router-dom'

// Ordered list of presentation pages for swipe navigation
const pageOrder = [
  '/home',
  '/dashboard',
  '/introduction',
  '/diagnostic',
  '/services',
  '/blueprint',
  '/casestudies',
  '/competitive-analysis',
  '/team',
  '/pricing'
]

export function useSwipeNavigation() {
  const navigate = useNavigate()

  const handleSwipe = (info) => {
    const currentPath = window.location.pathname.toLowerCase()

    // Find current page index
    const currentIndex = pageOrder.findIndex(path =>
      currentPath.includes(path.slice(1))
    )

    if (currentIndex === -1) {
      console.warn('Current page not in swipe navigation order:', currentPath)
      return
    }

    const { offset, velocity } = info
    const swipeThreshold = 50 // pixels
    const velocityThreshold = 500 // pixels per second

    // Swipe left -> next page
    if (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) {
      const nextIndex = Math.min(currentIndex + 1, pageOrder.length - 1)
      if (nextIndex !== currentIndex) {
        navigate(pageOrder[nextIndex])
      }
    }
    // Swipe right -> previous page
    else if (offset.x > swipeThreshold || velocity.x > velocityThreshold) {
      const prevIndex = Math.max(currentIndex - 1, 0)
      if (prevIndex !== currentIndex) {
        navigate(pageOrder[prevIndex])
      }
    }
  }

  const getCurrentPageIndex = () => {
    const currentPath = window.location.pathname.toLowerCase()
    return pageOrder.findIndex(path => currentPath.includes(path.slice(1)))
  }

  const getTotalPages = () => pageOrder.length

  return {
    handleSwipe,
    pageOrder,
    getCurrentPageIndex,
    getTotalPages
  }
}
