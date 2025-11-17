'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function PerformanceMonitor() {
  const pathname = usePathname()

  useEffect(() => {
    const navigationStart = performance.now()

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming
          console.log('📊 Navigation Performance:', {
            path: pathname,
            domContentLoaded: `${navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart}ms`,
            loadComplete: `${navEntry.loadEventEnd - navEntry.loadEventStart}ms`,
            domInteractive: `${navEntry.domInteractive - navEntry.fetchStart}ms`,
            totalLoadTime: `${navEntry.loadEventEnd - navEntry.fetchStart}ms`,
          })
        }
      }
    })

    observer.observe({ entryTypes: ['navigation'] })

    // Measure client-side navigation
    const handleLoad = () => {
      const loadTime = performance.now() - navigationStart
      console.log('🚀 Page Transition Time:', {
        path: pathname,
        time: `${loadTime.toFixed(2)}ms`,
      })
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
    }

    return () => {
      observer.disconnect()
      window.removeEventListener('load', handleLoad)
    }
  }, [pathname])

  return null
}
