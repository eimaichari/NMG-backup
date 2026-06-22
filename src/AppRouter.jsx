import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import NavBar      from './components/NavBar/NavBar';
import Footer      from './components/Footer/Footer';
import CartDrawer  from './components/CartDrawer/CartDrawer';
import PageLoader  from './components/PageLoader/PageLoader';

// ── Lazy page imports — each becomes its own bundle chunk ──
const HomePage       = lazy(() => import('./pages/HomePage/HomePage'));
const ProductsPage   = lazy(() => import('./pages/ProductsPage/ProductsPage'));
const ProductDetails = lazy(() => import('./pages/ProductDetails/ProductDetails'));
const CartPage       = lazy(() => import('./pages/CartPage/CartPage'));
const CheckoutPage   = lazy(() => import('./pages/CheckoutPage/CheckoutPage'));
const OrderSuccess   = lazy(() => import('./pages/OrderSuccess/OrderSuccess'));
const AboutPage      = lazy(() => import('./pages/AboutPage/AboutPage'));
const ContactPage    = lazy(() => import('./pages/ContactPage/ContactPage'));
const ProfilePage    = lazy(() => import('./pages/ProfilePage/ProfilePage'));
const SignInPage     = lazy(() => import('./pages/auth/SignIn/SignInPage'));
const SignUpPage     = lazy(() => import('./pages/auth/SignUp/SignUpPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard/AdminDashboard'));
const AdminOrders    = lazy(() => import('./pages/admin/OrdersPage/OrdersPage'));
const NotFoundPage   = lazy(() => import('./pages/NotFound/NotFoundPage'));

// ── Guards ──────────────────────────────────────────────────
function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  return user ? children : <Navigate to="/signin" replace />;
}

function RequireAdmin({ children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/signin" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

function RequireGuest({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  return !user ? children : <Navigate to="/" replace />;
}

// ── Scroll to top on route change ───────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

// ── Layout wrapper (nav + footer on public pages) ───────────
function PublicLayout({ children }) {
  return (
    <>
      <NavBar />
      <CartDrawer />
      <main id="main-content">
        <Suspense fallback={<PageLoader />}>{children}</Suspense>
      </main>
      <Footer />
    </>
  );
}

function AdminLayout({ children }) {
  return (
    <>
      <NavBar adminMode />
      <main id="main-content" style={{ paddingTop: 'var(--nav-height)' }}>
        <Suspense fallback={<PageLoader />}>{children}</Suspense>
      </main>
    </>
  );
}

function AuthLayout({ children }) {
  return (
    <Suspense fallback={<PageLoader />}>{children}</Suspense>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Routes>
        {/* Public */}
        <Route path="/"          element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/products"  element={<PublicLayout><ProductsPage /></PublicLayout>} />
        <Route path="/products/:id" element={<PublicLayout><ProductDetails /></PublicLayout>} />
        <Route path="/about"     element={<PublicLayout><AboutPage /></PublicLayout>} />
        <Route path="/contact"   element={<PublicLayout><ContactPage /></PublicLayout>} />

        {/* Auth */}
        <Route path="/signin"    element={<AuthLayout><RequireGuest><SignInPage /></RequireGuest></AuthLayout>} />
        <Route path="/signup"    element={<AuthLayout><RequireGuest><SignUpPage /></RequireGuest></AuthLayout>} />

        {/* Protected user */}
        <Route path="/cart"      element={<PublicLayout><RequireAuth><CartPage /></RequireAuth></PublicLayout>} />
        <Route path="/checkout"  element={<PublicLayout><RequireAuth><CheckoutPage /></RequireAuth></PublicLayout>} />
        <Route path="/order-success/:id" element={<PublicLayout><RequireAuth><OrderSuccess /></RequireAuth></PublicLayout>} />
        <Route path="/profile"   element={<PublicLayout><RequireAuth><ProfilePage /></RequireAuth></PublicLayout>} />

        {/* Admin */}
        <Route path="/admin"     element={<AdminLayout><RequireAdmin><AdminDashboard /></RequireAdmin></AdminLayout>} />
        <Route path="/admin/orders" element={<AdminLayout><RequireAdmin><AdminOrders /></RequireAdmin></AdminLayout>} />

        {/* 404 */}
        <Route path="*"          element={<PublicLayout><NotFoundPage /></PublicLayout>} />
      </Routes>
    </BrowserRouter>
  );
}
