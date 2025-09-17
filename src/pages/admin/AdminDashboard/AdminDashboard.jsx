import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useProducts } from '../../../context/ProductContext';
import { Link, Navigate } from 'react-router-dom';
import { storage } from '../../../utils/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { products, categories, loading: productsLoading, error, addProduct, addCategory, deleteProduct, toggleAvailability, updateProduct, fetchProducts } = useProducts(); // ADDED: fetchProducts from context
  
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editProductId, setEditProductId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_rands: '',
    image_urls: ['', '', ''],
    category: '',
  });
  const [imageFiles, setImageFiles] = useState([null, null, null]);
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts(); // ENSURE: Initial fetch on mount
  }, [fetchProducts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e, index) => {
    if (e.target.files[0]) {
      const newImageFiles = [...imageFiles];
      newImageFiles[index] = e.target.files[0];
      setImageFiles(newImageFiles);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.name || !formData.price_rands || !formData.category || !(formData.image_urls.some(url => url) || imageFiles.some(file => file !== null))) {
      setFormError('Name, price, category, and at least one image are required');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const imageUrls = await Promise.all(imageFiles.map(async (file, index) => {
        if (file) {
          const imageRef = ref(storage, `products-services/${Date.now()}_${index}_${file.name}`);
          await uploadBytes(imageRef, file);
          return await getDownloadURL(imageRef);
        }
        return formData.image_urls[index] || '';
      }));

      const productData = { ...formData, image_urls: imageUrls.filter(url => url) };

      if (editProductId) {
        await updateProduct(editProductId, productData);
        setEditProductId(null);
      } else {
        await addProduct(productData);
      }

      setFormData({ id: '', name: '', description: '', price_rands: '', image_urls: ['', '', ''], category: '' });
      setImageFiles([null, null, null]);
      setShowForm(false);
      await fetchProducts(); // ADDED: Refresh products after submission
    } catch (err) {
      setFormError('Failed to save product: ' + err.message);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setEditProductId(product.id);
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      price_rands: product.price_rands,
      image_urls: product.image_urls || [product.image_url || '', '', ''],
      category: product.category,
    });
    setImageFiles([null, null, null]);
    setShowForm(true);
  };

  const handleRemoveImage = (index) => {
    const newImageUrls = [...formData.image_urls];
    newImageUrls[index] = '';
    setFormData({ ...formData, image_urls: newImageUrls });

    const newImageFiles = [...imageFiles];
    newImageFiles[index] = null;
    setImageFiles(newImageFiles);
  };

  const handleCancel = () => {
    setFormData({ id: '', name: '', description: '', price_rands: '', image_urls: ['', '', ''], category: '' });
    setImageFiles([null, null, null]);
    setEditProductId(null);
    setShowForm(false);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory) return;
    await addCategory(newCategory);
    setNewCategory("");
    fetchProducts(); // ADDED: Refresh categories/products
  };

  if (authLoading) return <div className={styles.loading}>Authenticating...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Admin Dashboard</h2>

      <button className={styles.addButton} onClick={() => { setShowForm(true); setEditProductId(null); }}>
        Add Product +
      </button>
      {showForm && (
        <form className={styles.productForm} onSubmit={handleSubmit}>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Product Name" className={styles.input} />
          <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Product Description" className={styles.input} />
          <input type="number" name="price_rands" value={formData.price_rands} onChange={handleInputChange} placeholder="Price (Rands)" className={styles.input} />

          <select name="category" value={formData.category} onChange={handleInputChange} className={styles.input}>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          <div className={styles.newCategory}>
            <input type="text" placeholder="New Category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className={styles.input} />
            <button onClick={handleAddCategory} type="button" className={styles.submitButton}>+ Add Category</button>
          </div>

          <div className={styles.imageUploads}>
            {formData.image_urls.map((url, index) => (
              <div key={index} className={styles.imageUpload}>
                <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, index)} className={styles.input} />
                {url && 
                  <>
                    <img src={url} alt={`Preview ${index + 1}`} className={styles.imagePreview} />
                    <button
                      type="button"
                      className={styles.removeImageBtn}
                      onClick={() => handleRemoveImage(index)}
                      aria-label="Remove image"
                    >
                      &#10005;
                    </button>
                  </>
                }
              </div>
            ))}
          </div>

          {formError && <p className={styles.error}>{formError}</p>}
          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : editProductId ? 'Update Product' : 'Add Product'}
          </button>
          <button type="button" className={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </button>
        </form>
      )}

      <div className={styles.productList}>
        <h3 className={styles.sectionTitle}>Products</h3>
        {error && <p className={styles.error}>{error}</p>}
        {productsLoading ? (
          <p className={styles.loading}>Loading products...</p>
        ) : (
          products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className={styles.productItem}>
                <div className={styles.productImages}>
                  {(product.image_urls || [product.image_url])
                    .filter(Boolean)
                    .map((url, index) => (
                      <img
                        key={`${product.id}-${url}-${index}`}
                        src={url}
                        alt={`${product.name} ${index + 1}`}
                        className={styles.productThumb}
                      />
                    ))}
                </div>
                <div>
                  <span className={styles.productName}>{product.name}</span>
                  <p>{product.description}</p>
                  <p>Price: R{product.price_rands}</p>
                  <p>Category: {product.category}</p>
                  <p>Status: {product.available ? 'Available' : 'Unavailable'}</p>
                </div>
                <div className={styles.actions}>
                  <button onClick={() => handleEdit(product)} className={styles.toggleButton}>Edit</button>
                  <button onClick={() => { toggleAvailability(product.id, product.available); fetchProducts(); }} className={styles.toggleButton}>
                    {product.available ? 'Set Unavailable' : 'Set Available'}
                  </button>
                  <button onClick={() => { deleteProduct(product.id); }} className={styles.deleteButton}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p>No products available.</p>
          )
        )}
      </div>

      <Link to="/products" className={styles.continueShopping}>Back to Products</Link>
    </div>
  );
};

export default AdminDashboard;