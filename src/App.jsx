import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ToastProvider } from './components/ui/Toast.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import { DataProvider } from './context/DataContext.jsx'
import { AuthProvider } from './components/features/auth/AuthContext.jsx'
import { ProtectedRoute } from './components/features/auth/ProtectedRoute.jsx'
import { AppLayout } from './components/layout/AppLayout.jsx'
import { ErrorBoundary } from './components/common/ErrorBoundary.jsx'
import { Skeleton } from './components/ui/Skeleton.jsx'

const LoginPage = lazy(() => import('./pages/LoginPage.jsx'))
const OverviewPage = lazy(() => import('./pages/OverviewPage.jsx'))
const OrdersPage = lazy(() => import('./pages/OrdersPage.jsx'))
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage.jsx'))
const ProductsPage = lazy(() => import('./pages/ProductsPage.jsx'))
const CustomersPage = lazy(() => import('./pages/CustomersPage.jsx'))
const CustomerDetailPage = lazy(() => import('./pages/CustomerDetailPage.jsx'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage.jsx'))
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'))

function PageFallback() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="grid grid-cols-4 gap-4 mt-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-lg mt-2" />
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageFallback />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageFallback />}>
            <OverviewPage />
          </Suspense>
        ),
      },
      {
        path: 'orders',
        element: (
          <Suspense fallback={<PageFallback />}>
            <OrdersPage />
          </Suspense>
        ),
      },
      {
        path: 'orders/:orderId',
        element: (
          <Suspense fallback={<PageFallback />}>
            <OrderDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'products',
        element: (
          <Suspense fallback={<PageFallback />}>
            <ProductsPage />
          </Suspense>
        ),
      },
      {
        path: 'customers',
        element: (
          <Suspense fallback={<PageFallback />}>
            <CustomersPage />
          </Suspense>
        ),
      },
      {
        path: 'customers/:customerId',
        element: (
          <Suspense fallback={<PageFallback />}>
            <CustomerDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'analytics',
        element: (
          <Suspense fallback={<PageFallback />}>
            <AnalyticsPage />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<PageFallback />}>
            <SettingsPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<PageFallback />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
])

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <NotificationProvider>
              <DataProvider>
                <RouterProvider router={router} />
              </DataProvider>
            </NotificationProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
