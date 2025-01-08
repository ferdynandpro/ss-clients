import React, { useState, useEffect } from 'react';
import ProductForm from './ProductForm';
import ConfirmationModal from '../../components/Alert/ConfirmationModal'; // Import the modal
import { cleanPriceInput } from '../../utils/formatPrice';
import api from '../../services/api';
import '../../assets/styles/components/product-list.css'; // Ensure this is the same CSS used in CustomerTable

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [productToDelete, setProductToDelete] = useState(null); // Product to delete
  const [errors, setErrors] = useState({ name: false, price: false }); // Error state for validation

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, discountsResponse] = await Promise.all([
          api.get('/products'),
          api.get('/discounts'),
        ]);
        setProducts(productsResponse.data);
        setFilteredProducts(productsResponse.data);
        setDiscounts(discountsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error.response?.data || error.message);
      }
    };

    fetchData();
  }, []);

  // Handle adding a new product
  const handleAddProduct = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
    setFilteredProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  // Handle updating a product
  const handleUpdateProduct = async (updatedProduct) => {
    // Validate that name and price are not empty
    if (!updatedProduct.name.trim() || !updatedProduct.price.trim()) {
      setErrors({
        name: !updatedProduct.name.trim(),
        price: !updatedProduct.price.trim(),
      });
      return;
    }

    try {
      const cleanedPrice = cleanPriceInput(updatedProduct.price);
      const productData = { ...updatedProduct, price: cleanedPrice };

      const { data } = await api.put(`/products/${updatedProduct.id}`, productData);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === updatedProduct.id ? { ...product, ...data } : product
        )
      );
      setFilteredProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === updatedProduct.id ? { ...product, ...data } : product
        )
      );
      setEditingProduct(null); // Close the editing mode
      setErrors({ name: false, price: false }); // Reset error states
    } catch (error) {
      console.error('Error updating product:', error.response?.data || error.message);
    }
  };

  // Handle deleting a product
  const handleDeleteProduct = async () => {
    try {
      await api.delete(`/products/${productToDelete.id}`);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productToDelete.id)
      );
      setFilteredProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productToDelete.id)
      );
      setProductToDelete(null);
      setIsModalOpen(false); // Close the modal after deletion
    } catch (error) {
      console.error('Error deleting product:', error.response?.data || error.message);
    }
  };

  const confirmDeleteProduct = (product) => {
    setProductToDelete(product);
    setIsModalOpen(true); // Open the modal
  };

  const cancelDelete = () => {
    setProductToDelete(null);
    setIsModalOpen(false); // Close the modal
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query))
    );
    setFilteredProducts(filtered);
  };

  const hasDiscount = (productId) =>
    discounts.some((discount) => discount.product_id === productId);

  return (
    <div className="container">
      <div className="titles">Product List</div>

      <ProductForm onAddProduct={handleAddProduct} />

      <div className="search-container">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className='product-id'>ID</th>
              <th >Name</th>
              <th>Description</th>
              <th>Price</th>
              <th className='product-action'>Action</th>
            </tr>
          </thead>
          <tbody>
  {filteredProducts.length > 0 ? (
    filteredProducts.map((product) => {
      const hasDiscounts = hasDiscount(product.id); // Check if the product has a discount
      return (
        <tr key={product.id}>
          <td className="product-id">{product.id}</td> {/* Kolom ID */}
          <td>
            {editingProduct?.id === product.id ? (
              <input
                className={`editable-input ${errors.name ? 'error-border' : ''}`}
                type="text"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            ) : (
              product.name
            )}
          </td>
          <td>
            {editingProduct?.id === product.id ? (
              <input
                className="editable-input"
                type="text"
                value={editingProduct.description}
                onChange={(e) =>
                  setEditingProduct((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            ) : (
              product.description || 'N/A'
            )}
          </td>
          <td>
            {editingProduct?.id === product.id ? (
              <input
                className={`editable-input ${errors.price ? 'error-border' : ''}`}
                type="text"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct((prev) => ({
                    ...prev,
                    price: e.target.value,
                  }))
                }
              />
            ) : (
              product.price
            )}
          </td>
          <td className="product-action"> {/* Kolom Action */}
            {editingProduct?.id === product.id ? (
              <>
                <button
                  className="action-button confirm-button"
                  onClick={() => handleUpdateProduct(editingProduct)}
                >
                  Simpan
                </button>
                <button
                  className="action-button cancel-button"
                  onClick={() => setEditingProduct(null)}
                >
                  Batal
                </button>
              </>
            ) : (
              <>
                <button
                  className="action-button edit-button"
                  onClick={() => setEditingProduct(product)}
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDeleteProduct(product)}
                  disabled={hasDiscounts} // Disable if product has discounts
                  className={`action-button delete-button ${hasDiscounts ? 'disabled-delete' : ''}`}
                >
                  Hapus
                </button>
              </>
            )}
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="5">No products available</td>
    </tr>
  )}
</tbody>

        </table>
        <ConfirmationModal
          isOpen={isModalOpen}
          message={`Are you sure you want to delete the product "${productToDelete?.name}"?`}
          onConfirm={handleDeleteProduct}
          onCancel={cancelDelete}
        />
      </div>
    </div>
  );
};

export default ProductList;
