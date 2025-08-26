import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

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

const AppRouter = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default AppRouter;