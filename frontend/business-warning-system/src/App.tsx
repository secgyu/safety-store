import { AuthProvider } from '@/app/providers/AuthProvider'
import { QueryProvider } from '@/app/providers/QueryProvider'
import { AppRoutes } from '@/app/routes'
import { Toaster } from '@/shared/components/ui/toaster'

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </QueryProvider>
  )
}

export default App
