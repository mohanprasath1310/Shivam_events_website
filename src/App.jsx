import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

import PublicLayout from './components/layout/PublicLayout'
import Home from './pages/public/Home'
import About from './pages/public/About'
import Services from './pages/public/Services'
import ServiceDetail from './pages/public/ServiceDetail'
import Gallery from './pages/public/Gallery'
import Videos from './pages/public/Videos'
import Contact from './pages/public/Contact'
import Booking from './pages/public/Booking'

import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import ProtectedRoute from './pages/admin/ProtectedRoute'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminHomeContent from './pages/admin/AdminHomeContent'
import AdminServices from './pages/admin/AdminServices'
import AdminGallery from './pages/admin/AdminGallery'
import AdminVideos from './pages/admin/AdminVideos'
import AdminPricing from './pages/admin/AdminPricing'
import AdminBookings from './pages/admin/AdminBookings'
import AdminMessages from './pages/admin/AdminMessages'
import AdminTestimonials from './pages/admin/AdminTestimonials'
import AdminContact from './pages/admin/AdminContact'
import AdminSettings from './pages/admin/AdminSettings'

// Scrolls to top on every page navigation and on refresh
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book" element={<Booking />} />
        </Route>

        {/* Admin auth */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin dashboard (protected) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="home-content" element={<AdminHomeContent />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="videos" element={<AdminVideos />} />
          <Route path="pricing" element={<AdminPricing />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="contact" element={<AdminContact />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
              <h1 className="font-heading text-4xl font-bold">404</h1>
              <p className="text-black/50 mt-2">Page not found</p>
              <a href="/" className="text-gold-dark text-sm font-medium mt-4 underline">
                Back to Home
              </a>
            </div>
          }
        />
      </Routes>
    </>
  )
}