import React, { useState } from 'react';
import '../../assets/styles/components/product-add.css'; // Make sure the CSS file is correctly imported

// Helper function to clean and format price input
const cleanPriceInput = (value) => {
    return value.replace(/[^0-9]/g, ''); // Only keep numeric characters
};

const formatPrice = (value) => {
    return `Rp.${parseInt(value, 10).toLocaleString('id-ID')}`; // Format to "Rp.xxx.xxx"
};

const ProductForm = ({ onAddProduct }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // State for success message

    const handlePriceChange = (e) => {
        const value = cleanPriceInput(e.target.value); // Clean input
        setPrice(formatPrice(value)); // Format price
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cleanedPrice = cleanPriceInput(price); // Remove "Rp." and separators
        const productData = { name, description, price: parseInt(cleanedPrice, 10) };

        try {
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });

            const result = await response.json();
            if (response.ok) {
                onAddProduct(result);
                setName('');
                setDescription('');
                setPrice('');
                setSuccessMessage('Product successfully added!'); // Set success message
                setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
            } else {
                console.error('Failed to add product', result.message);
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <div className="add-customer">
            <div className="title">Add Product</div>
            <form onSubmit={handleSubmit} className="form--container">
                <div className="form--container">
                    <div className="form--container item">
                        <label className="form--container label">Product Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form--container item">
                        <label className="form--container label">Price:</label>
                        <input
                            type="text"
                            value={price}
                            onChange={handlePriceChange}
                            className="form-input"
                            required
                        />
                    </div>
                </div>
                <div className="form--container">
                    <div className="form--container item">
                        <label className="form--container label">Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="form-submit">Add Product</button>
                </div>
            </form>

            {/* Success notification */}
            {successMessage && <div className="message">{successMessage}</div>}
        </div>
    );
};

export default ProductForm;
