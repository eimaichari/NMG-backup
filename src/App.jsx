import { AuthProvider } from './context/AuthContext';
import { CartProvider }  from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import AppRouter         from './AppRouter';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <AppRouter />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
