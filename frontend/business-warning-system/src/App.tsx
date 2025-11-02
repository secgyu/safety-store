import { ScrollToTop } from '@/shared/components/common/ScrollToTop'
import { Toaster } from '@/shared/components/ui/toaster'
import { AuthProvider } from './providers/AuthProvider'
import { QueryProvider } from './providers/QueryProvider'
import { AppRoutes } from './routes'

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
