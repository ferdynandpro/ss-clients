import React, { useState } from 'react';
import api from '../../services/api';  // Import API service
import '../../assets/styles/components/product-add.css'; // Pastikan file CSS sudah diimport dengan benar

// Helper function to clean and format price input
const cleanPriceInput = (value) => {
    return value.replace(/[^0-9]/g, ''); // Hanya simpan karakter angka
};

const formatPrice = (value) => {
    return `Rp.${parseInt(value, 10).toLocaleString('id-ID')}`; // Format harga menjadi "Rp.xxx.xxx"
};

const ProductForm = ({ onAddProduct }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [barcode, setBarcode] = useState('');
    const [price, setPrice] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // State untuk pesan sukses

    const handlePriceChange = (e) => {
        const value = cleanPriceInput(e.target.value); // Membersihkan input harga
        setPrice(formatPrice(value)); // Format harga
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cleanedPrice = cleanPriceInput(price); // Hapus "Rp." dan pemisah
        const productData = { name, description, barcode, price: parseInt(cleanedPrice, 10) };

        try {
            // Gunakan API service untuk POST request
            const response = await api.post('/products', productData);

            if (response.status === 200 || response.status === 201) {
                onAddProduct(response.data); // Kirim data produk baru ke parent
                setName('');
                setDescription('');
                setPrice('');
                setBarcode('');
                setSuccessMessage('Produk berhasil ditambahkan!'); // Set pesan sukses
                setTimeout(() => setSuccessMessage(''), 3000); // Hapus pesan setelah 3 detik
            } else {
                console.error('gagal menambahkan data', response.data.message);
            }
        } catch (error) {
            console.error('kesalahan dalam menambahkan data:', error);
        }
    };

    return (
        <div className="add-customer">
            <div className="title">Tambahkan Produk</div>
            <form onSubmit={handleSubmit} className="form--container">
                <div className="form--container">
                    <div className="form--container item">
                        <label className="form--container label">Nama Produk:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form--container item">
                        <label className="form--container label">Barcode:</label>
                        <input
                            type="text"
                            value={barcode}
                            onChange={(e) => setBarcode(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form--container item">
                        <label className="form--container label">Harga Pokok:</label>
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
                        <label className="form--container label">Deskripsi:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="form-submit">Tambahkan Produk</button>
                </div>
            </form>

            {/* Pesan sukses */}
            {successMessage && <div className="message">{successMessage}</div>}
        </div>
    );
};

export default ProductForm;
