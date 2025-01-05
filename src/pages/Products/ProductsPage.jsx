import React, { useState, useEffect } from "react";
import ProductList from "../../components/Product/ProductList";
import api from "../../services/api"; // API service
import ProductForm from "../../components/Product/ProductForm";

const ProductPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Fungsi untuk memperbarui produk
  const handleUpdateProduct = async (productId, updatedProduct) => {
    try {
      const response = await api.put(`/products/${productId}`, updatedProduct);

      if (response.status === 200) {
        // Update produk dalam state setelah berhasil diperbarui
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productId ? { ...product, ...updatedProduct } : product
          )
        );
      }
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  // Fungsi untuk menghapus produk
  const handleDeleteProduct = async (productId) => {
    try {
      const response = await api.delete(`/products/${productId}`);

      if (response.status === 200) {
        // Hapus produk dari state setelah berhasil dihapus
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <ProductForm/>
      <ProductList
        products={products}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
      />
    </div>
  );
};

export default ProductPage;
