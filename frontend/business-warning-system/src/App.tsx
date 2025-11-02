import { ScrollToTop } from '@/shared/components/common/ScrollToTop'
import { Toaster } from '@/shared/components/ui/toaster'
import { AuthProvider } from '@/app/providers/AuthProvider'
import { QueryProvider } from '@/app/providers/QueryProvider'
import { AppRoutes } from '@/app/routes'

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <AppRoutes />
        <ScrollToTop />
        <Toaster />
      </AuthProvider>
    </QueryProvider>
  )
}

export default App
