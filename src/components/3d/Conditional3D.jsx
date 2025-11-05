import { Suspense, lazy } from 'react'
import { usePerformanceMonitor } from '@/hooks/use-performance-monitor'
import Skeleton from '@/components/Skeleton'

// Lazy load 3D and 2D chart components
const BarChart3D = lazy(() => import('./BarChart3D'))

// Placeholder 2D chart (you can replace with actual 2D chart component)
function BarChart2D({ data }) {
  return (
    <div className="w-full h-[500px] bg-gray-900/20 rounded-lg p-6">
      <div className="space-y-4">
        {data.map((item, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/80">{item.label}</span>
              <span className="text-[#D4AF37] font-semibold">{item.value}</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-4">
              <div
                className="h-4 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700]"
                style={{
                  width: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%`,
                  transition: 'width 1s ease-out'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Conditional3D({ data, type = 'bar' }) {
  const { profile } = usePerformanceMonitor()

  return (
    <Suspense fallback={<Skeleton className="w-full h-[500px]" />}>
      {profile.enable3D ? (
        <BarChart3D data={data} />
      ) : (
        <BarChart2D data={data} />
      )}
    </Suspense>
  )
}
