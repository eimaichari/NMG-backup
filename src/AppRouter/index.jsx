import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import UserRoute from '../components/auth/UserRoute.jsx';
import AdminRoute from '../components/auth/AdminRoute.jsx';
import { ProductsProvider } from '../context/ProductContext.jsx';

import NavBar from '../components/NavBar/NavBar.jsx';
import Footer from '../components/Footer/Footer.jsx';

import HomePage from '../pages/HomePage/HomePage.jsx';
import AboutPage from '../pages/AboutPage/AboutPage';
import ContactPage from '../pages/ContactPage/ContactPage';
import ProductsPage from '../pages/ProductsPage/ProductsPage';
import CartPage from '../pages/CartPage/CartPage';
import CheckoutPage from '../pages/CheckoutPage/CheckoutPage';
import SignInPage from '../pages/auth/SignIn/SignInPage';
import SignupPage from '../pages/auth/SignupPage/SignupPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard/AdminDashboard.jsx';
import OrdersPage from '../pages/admin/OrdersPage/OrdersPage.jsx';

import ProductDetailsPage from '../pages/ProductDetails/ProductDetails.jsx';
 
const AppRouter = () => {
  return (
    <AuthProvider>
      <ProductsProvider>
        <Router>
          <NavBar />
          <Routes>

            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/auth/signin" element={<SignInPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />

            {/* User Routes */}
            <Route element={<UserRoute />}>
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/orders" element={<OrdersPage />} />
            </Route>
          </Routes>
          <Footer />
        </Router>
      </ProductsProvider>
    </AuthProvider>
  );
};

export default AppRouter;