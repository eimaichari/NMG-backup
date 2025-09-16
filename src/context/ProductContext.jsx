import { createContext, useContext, useEffect, useState } from 'react';
import { 
  getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc 
} from 'firebase/firestore';
import { db } from '../utils/firebase';

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from Firestore
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
      console.error(err);
    }
  };

  // Fetch categories from Firestore
  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesData);
    } catch (err) {
      setError('Failed to fetch categories');
      console.error(err);
    }
  };

  // Add a new product
  const addProduct = async (productData) => {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        available: true,
        createdAt: new Date().toISOString(),
      });
      setProducts([...products, { id: docRef.id, ...productData, available: true }]);
    } catch (err) {
      setError('Failed to add product');
      console.error(err);
    }
  };

  // Add a new category
  const addCategory = async (categoryName) => {
    try {
      const docRef = await addDoc(collection(db, 'categories'), {
        name: categoryName,
        createdAt: new Date().toISOString(),
      });
      setCategories([...categories, { id: docRef.id, name: categoryName }]);
    } catch (err) {
      setError('Failed to add category');
      console.error(err);
    }
  };

  // Delete a product
  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(products.filter((product) => product.id !== id));
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
    }
  };

  // Toggle product availability
  const toggleAvailability = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, 'products', id), { available: !currentStatus });
      setProducts(
        products.map((product) =>
          product.id === id ? { ...product, available: !currentStatus } : product
        )
      );
    } catch (err) {
      setError('Failed to update availability');
      console.error(err);
    }
  };

  // NEW: Add updateProduct function to handle editing products
  const updateProduct = async (id, productData) => {
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        ...productData,
        updatedAt: new Date().toISOString(),
      });
      setProducts(
        products.map((product) =>
          product.id === id ? { ...product, ...productData } : product
        )
      );
    } catch (err) {
      setError('Failed to update product');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const value = {
    products,
    categories,
    loading,
    error,
    addProduct,
    addCategory,
    deleteProduct,
    toggleAvailability,
    updateProduct, // NEW: Expose updateProduct function in context
    fetchProducts, // Expose fetchProducts to allow manual refresh
    fetchCategories, // Expose fetchCategories to allow manual refresh
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsContext;
