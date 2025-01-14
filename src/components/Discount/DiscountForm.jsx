import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "../../assets/styles/components/discount-form.css"; // Make sure the CSS file is imported

const DiscountForm = ({ onSuccess }) => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [minimumOrderQuantity, setMinimumOrderQuantity] = useState(""); // Ensure it's a string
  const [message, setMessage] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchProduct, setSearchProduct] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await api.get("/customers");
        setCustomers(customersResponse.data);

        const productsResponse = await api.get("/products");
        setProducts(productsResponse.data);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchCustomer) {
      const filtered = customers.filter((customer) =>
        customer.customer_name.toLowerCase().includes(searchCustomer.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers([]);
    }
  }, [searchCustomer, customers]);

  useEffect(() => {
    if (searchProduct) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchProduct.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchProduct, products]);

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer.customer_name);
    setSearchCustomer(customer.customer_name);
    setFilteredCustomers([]);
  };

  const handleSelectProduct = (productName) => {
    setSelectedProduct(productName);
    setSearchProduct(productName);
    setFilteredProducts([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer || !selectedProduct || !discountPrice || !minimumOrderQuantity) {
      setMessage("Semua wajib diisi!");
      return;
    }

    try {
      const discountData = {
        customer_name: selectedCustomer,
        product_name: selectedProduct,
        discount_price: parseFloat(discountPrice),
        minimum_order_quantity: minimumOrderQuantity, // Keep it as a string
      };

      const response = await api.post("/discounts", discountData);
      setMessage(response.data.message || "Data diskon berhasi ditambahkan");

      // Reset form fields
      setSelectedCustomer("");
      setSelectedProduct("");
      setDiscountPrice("");
      setMinimumOrderQuantity(""); // Reset minimumOrderQuantity
      setSearchCustomer("");
      setSearchProduct("");

      // Notify parent to refresh data
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating discount:", error);
      setMessage("gagal membuat data.");
    }
  };

  return (
    <div className="add-customer"> {/* Container for the form */}
      <h2 className="title">Tambahkan Diskon</h2>
      {message && <p className="message">{message}</p>}

      <div className="form--container">
        <label className="form--container label">Nama Pelanggan:</label>
        <input
          type="text"
          className="form-input"
          value={searchCustomer}
          onChange={(e) => setSearchCustomer(e.target.value)}
          placeholder="masukkan nama Pelanggan..."
        />
        {filteredCustomers.length > 0 && (
          <ul className="discount-form-suggestions">
            {filteredCustomers.map((customer) => (
              <li
                key={customer.id}
                className="discount-form-suggestion-item"
                onClick={() => handleSelectCustomer(customer)}
              >
                {customer.customer_name} - {customer.phone_number}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="form--container">
        <label className="form--container label">Produk:</label>
        <input
          type="text"
          className="form-input"
          value={searchProduct}
          onChange={(e) => setSearchProduct(e.target.value)}
          placeholder="masukkan nama produk..."
        />
        {filteredProducts.length > 0 && (
          <ul className="discount-form-suggestions">
            {filteredProducts.map((product) => (
              <li
                key={product.id}
                className="discount-form-suggestion-item"
                onClick={() => handleSelectProduct(product.name)}
              >
                {product.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="form--container">
        <label className="form--container label">Harga Diskon:</label>
        <input
          type="number"
          className="form-input"
          value={discountPrice}
          onChange={(e) => setDiscountPrice(e.target.value)}
          placeholder="masukkan harga diskon..."
        />
      </div>

      <div className="form--container">
        <label className="form--container label">Minimum Order Quantity:</label>
        <input
          type="text" // Ensure it's a string input field
          className="form-input"
          value={minimumOrderQuantity}
          onChange={(e) => setMinimumOrderQuantity(e.target.value)}
          placeholder="masukkan minimal order quantity..."
        />
      </div>

      <button type="submit" className="form-submit" onClick={handleSubmit}>
        Tambahkan Diskon
      </button>
    </div>
  );
};

export default DiscountForm;
