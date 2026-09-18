import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AdminHeader from '../../components/admin/AdminHeader'

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-offwhite">
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      <div className="flex-1 min-w-0">
        <AdminHeader />
        <div className="p-5 md:p-8">
          <Outlet />
        </div>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontSize: '14px', borderRadius: '12px' },
          success: { iconTheme: { primary: '#F5B82E', secondary: '#111' } },
        }}
      />
    </div>
  )
}
