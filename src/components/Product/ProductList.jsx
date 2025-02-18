import React, { useState, useEffect } from 'react';
import ProductForm from './ProductForm';
import ConfirmationModal from '../../components/Alert/ConfirmationModal'; // Import the modal
import { cleanPriceInput } from '../../utils/formatPrice';
import api from '../../services/api';
import '../../assets/styles/components/product-list.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [errors, setErrors] = useState({ name: false, price: false });
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsResponse, discountsResponse] = await Promise.all([
          api.get('/products'),
          api.get('/discounts'),
        ]);
        const sortedProducts = productsResponse.data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setProducts(sortedProducts);
        setFilteredProducts(sortedProducts.slice(0, 50));
        setDiscounts(discountsResponse.data);
      } catch (error) {
        console.error('Gagal memuat data:', error.response?.data || error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddProduct = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    setFilteredProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = async (updatedProduct) => {
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
      const sortedProducts = products
        .map((product) => (product.id === updatedProduct.id ? { ...product, ...data } : product))
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setProducts(sortedProducts);
      setFilteredProducts(sortedProducts);
      setEditingProduct(null);
      setErrors({ name: false, price: false });
    } catch (error) {
      console.error('Gagal memperbarui data:', error.response?.data || error.message);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await api.delete(`/products/${productToDelete.id}`);
      const sortedProducts = products.filter((product) => product.id !== productToDelete.id);
      setProducts(sortedProducts);
      setFilteredProducts(sortedProducts);
      setProductToDelete(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Gagal menghapus data:', error.response?.data || error.message);
    }
  };

  const confirmDeleteProduct = (product) => {
    setProductToDelete(product);
    setIsModalOpen(true);
  };

  const cancelDelete = () => {
    setProductToDelete(null);
    setIsModalOpen(false);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query))||
      (product.barcode && product.barcode.toLowerCase().includes(query))
    );
    setFilteredProducts(filtered.slice(0, 50));
  };

  const hasDiscount = (productId) => discounts.some((discount) => discount.product_id === productId);

  return (
    <div className="container">
      <div className="titles">Data Produk</div>
      <ProductForm onAddProduct={handleAddProduct} />
      <div className="search-container">
        <input
          type="text"
          placeholder="Cari produk..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      <div className="table-container">
        {isLoading ? (
          <p>Loading data...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                {/* <th className="product-id">ID</th> */}
                <th>Nama</th>
                <th>Deskripsi</th>
                <th>Barcode</th>
                <th>Harga Pokok</th>
                <th className="product-action">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const hasDiscounts = hasDiscount(product.id);
                  return (
                    <tr key={product.id}>
                      {/* <td className="product-id">{product.id}</td> */}
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
                            className="editable-input"
                            type="text"
                            value={editingProduct.barcode}
                            onChange={(e) =>
                              setEditingProduct((prev) => ({
                                ...prev,
                                barcode: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          product.barcode || 'N/A'
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
                      <td className="product-action">
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
                              disabled={hasDiscounts}
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
                  <td colSpan="5">Tidak Ada Produk Tersedia</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        <ConfirmationModal
          isOpen={isModalOpen}
          message={`Apakah Anda ingin menghapus "${productToDelete?.name}"?`}
          onConfirm={handleDeleteProduct}
          onCancel={cancelDelete}
        />
      </div>
    </div>
  );
};

export default ProductList;
