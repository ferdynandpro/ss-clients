import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "../../assets/styles/components/discount-list.css";
import ConfirmationModal from "../../components/Alert/ConfirmationModal"; // Import the modal

const DiscountList = ({ refreshTrigger }) => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editableDiscounts, setEditableDiscounts] = useState({});
  const [editableMOQ, setEditableMOQ] = useState({}); // For MOQ edit
  const [search, setSearch] = useState("");
  const [filteredDiscounts, setFilteredDiscounts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [exactSearch, setExactSearch] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [discountToDelete, setDiscountToDelete] = useState(null); // State for the discount to be deleted
  const [validationErrors, setValidationErrors] = useState({}); // State for validation errors

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await api.get("/discounts");
        const sortedDiscounts = response.data.sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated));
        setDiscounts(sortedDiscounts);
        setFilteredDiscounts(sortedDiscounts);
        setLoading(false);
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil data diskon");
        setLoading(false);
      }
    };
    fetchDiscounts();
  }, [refreshTrigger]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0, // No decimals
      maximumFractionDigits: 0, // No decimals
    }).format(amount);
  };
  const handleSearchChange = (e) => {
    const value = e.target.value.trim().toLowerCase();
    setSearch(value);
    setExactSearch(false);
  
    if (value) {
      const filtered = discounts.filter((discount) => {
        const customerName = discount.customer?.customer_name?.toLowerCase();
        const phoneNumber = discount.customer?.phone_number?.toLowerCase();
        const productName = discount.Product?.name?.toLowerCase();
        const barcode = discount.Product?.barcode?.toLowerCase(); // Pastikan barcode ada di sini
  
        return (
          (customerName && customerName.includes(value)) ||
          (phoneNumber && phoneNumber.includes(value)) ||
          (productName && productName.includes(value)) ||
          (barcode && barcode.includes(value)) // Sekarang barcode bisa dicari!
        );
      });
  
      setFilteredDiscounts(filtered);
    } else {
      setFilteredDiscounts(discounts); // Jika input kosong, tampilkan semua data
    }
  };
  
  
  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setExactSearch(true);
  
      const searchLower = search.trim().toLowerCase();
  
      const exactMatches = discounts.filter((discount) => {
        const customerMatch = discount.customer?.customer_name?.toLowerCase() === searchLower;
        const phoneMatch = discount.customer?.phone_number?.toLowerCase() === searchLower;
        const productMatch = discount.Product?.name?.toLowerCase() === searchLower;
        const barcodeMatch = discount.Product?.barcode?.toLowerCase() === searchLower; // Pencocokan barcode
  
        return customerMatch || phoneMatch || productMatch || barcodeMatch;
      });
  
      setFilteredDiscounts(exactMatches);
      setSuggestions([]);
    }
  };
  
  
  
  const handleSuggestionClick = (suggestion) => {
    const searchValue = suggestion.customer?.customer_name || suggestion.Product?.name || suggestion.Product?.barcode;
    setSearch(searchValue);
    setSuggestions([]);
    setExactSearch(true);
  
    const exactMatches = discounts.filter(
      (discount) =>
        discount.customer?.customer_name?.toLowerCase() === searchValue.toLowerCase() ||
        discount.customer?.phone_number?.toLowerCase() === searchValue.toLowerCase() ||
        discount.Product?.name?.toLowerCase() === searchValue.toLowerCase() ||
        discount.Product?.barcode?.toLowerCase() === searchValue.toLowerCase() // Tambahkan barcode
    );
  
    setFilteredDiscounts(exactMatches);
  };
  
  

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await api.get("/discounts");
        const sortedDiscounts = response.data.sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated));
        setDiscounts(sortedDiscounts);
        setFilteredDiscounts(sortedDiscounts);
        console.log("Discount Data:", sortedDiscounts); // Tambahkan ini untuk debugging
        setLoading(false);
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil data diskon");
        setLoading(false);
      }
    };
    fetchDiscounts();
  }, [refreshTrigger]);
  

  const handlePriceChange = (discountId, newPrice) => {
    const formattedPrice = newPrice.replace(/[^\d]/g, ""); // Remove any non-numeric characters
    setEditableDiscounts((prev) => ({
      ...prev,
      [discountId]: formattedPrice,
    }));
  };

  const handleMOQChange = (discountId, newMOQ) => {
    setEditableMOQ((prev) => ({
      ...prev,
      [discountId]: newMOQ,
    }));
  };

  const handleSave = async (discountId) => {
    const updatedPrice = editableDiscounts[discountId];
    const updatedMOQ = editableMOQ[discountId];

    if (!updatedPrice && !updatedMOQ) {
      setValidationErrors((prev) => ({
        ...prev,
        [discountId]: "Harga dan MOQ tidak boleh kosong",
      }));
      return;
    }

    const lastEditedBy = localStorage.getItem('username'); // Get the username from localStorage

    try {
      const response = await api.put(`/discounts/${discountId}`, {
        discount_price: updatedPrice,
        minimum_order_quantity: updatedMOQ,
        last_edited_by: lastEditedBy,  // Include the username of the person making the edit
      });

      setDiscounts((prev) =>
        prev.map((discount) =>
          discount.id === discountId
            ? {
                ...discount,
                discount_price: updatedPrice,
                minimum_order_quantity: updatedMOQ,
                last_updated: response.data.discount.last_updated,
                last_edited_by: response.data.discount.last_edited_by,
              }
            : discount
        )
      );

      setEditableDiscounts((prev) => {
        const newEditableDiscounts = { ...prev };
        delete newEditableDiscounts[discountId];
        return newEditableDiscounts;
      });

      setEditableMOQ((prev) => {
        const newEditableMOQ = { ...prev };
        delete newEditableMOQ[discountId];
        return newEditableMOQ;
      });

      setValidationErrors((prev) => {
        const newValidationErrors = { ...prev };
        delete newValidationErrors[discountId];
        return newValidationErrors;
      });
    } catch (err) {
      setError("Terjadi kesalahan saat memperbarui diskon");
    }
  };

  const handleDelete = (discountId) => {
    setIsModalOpen(true);
    setDiscountToDelete(discountId); // Set the discount to be deleted
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/discounts/${discountToDelete}`);
      setDiscounts((prev) => prev.filter((discount) => discount.id !== discountToDelete));
      setFilteredDiscounts((prev) =>
        prev.filter((discount) => discount.id !== discountToDelete)
      );
      setDiscountToDelete(null);
      setIsModalOpen(false);  // Close the modal after deleting
    } catch (err) {
      setError("Terjadi kesalahan saat menghapus diskon");
    }
  };

  const cancelDelete = () => {
    setDiscountToDelete(null);
    setIsModalOpen(false);  // Close the modal if canceled
  };

  const handleCancelEdit = (discountId) => {
    setEditableDiscounts((prev) => {
      const newEditableDiscounts = { ...prev };
      delete newEditableDiscounts[discountId];
      return newEditableDiscounts;
    });

    setEditableMOQ((prev) => {
      const newEditableMOQ = { ...prev };
      delete newEditableMOQ[discountId];
      return newEditableMOQ;
    });
  };

  return (
    <div className="table-container">
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        onKeyDown={handleSearchSubmit}
        placeholder="Cari berdasarkan nama pelanggan, nomor telepon, atau nama produk"
        className="search-input"
      />

      <div className="discount-list-search">
        {suggestions.length > 0 && (
          <ul className="suggestion-list">
            {suggestions.map((discount) => (
              <li
                key={discount.id}
                onClick={() => handleSuggestionClick(discount)}
              >
                {discount.customer?.customer_name || discount.Product?.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="discount-error">{error}</p>}
      {loading && <p className="discount-loading">Memuat...</p>}

      {!loading && !error && (
        <div className="table-scroll-container">
          <table className="data-table">
            <thead>
              <tr>
                <th className="discount-table-header number disc-tablee">No.HP</th>
                <th className="discount-table-header disc-tablee">Nama Pelanggan</th>
                <th className="discount-table-header disc-tablee">Nama Produk</th>
                <th className="discount-table-header disc-tablee">barcode</th>
                <th className="discount-table-header disc-tablee">MOQ</th>
                <th className="discount-table-header harga disc-tablee">Harga Diskon</th>
                <th className="discount-table-header last--update">Terakhir Diperbaharui</th>
                <th className="discount-table-header last--edited">Diedit oleh</th>
                <th className="discount-table-header aksi">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredDiscounts.map((discount) => (
                <tr key={discount.id} className="discount-row">
                  <td className="discount-cell disc-tablee">
                    {discount.customer?.phone_number || "N/A"}
                  </td>
                  <td className="discount-cell disc-tablee">
                    {discount.customer?.customer_name || "N/A"}
                  </td>
                  <td className="discount-cell disc-tablee">
                    {discount.Product?.name || "N/A"}
                  </td>
                  <td className="discount-cell disc-tablee">
                    {discount.Product?.barcode || "N/A"}
                  </td>
                  <td className="discount-cell disc-tablee">
                    {editableMOQ[discount.id] !== undefined ? (
                      <input
                        type="text"
                        className={`editable-input ${validationErrors[discount.id] ? "error" : ""}`}
                        value={editableMOQ[discount.id]}
                        onChange={(e) => handleMOQChange(discount.id, e.target.value)}
                      />
                    ) : (
                      discount.minimum_order_quantity || "N/A"
                    )}
                  </td>
                  <td className="discount-cell disc-tablee">
                    {editableDiscounts[discount.id] !== undefined ? (
                      <input
                        type="number"
                        className={`editable-input ${validationErrors[discount.id] ? "error" : ""}`}
                        value={editableDiscounts[discount.id]}
                        onChange={(e) => handlePriceChange(discount.id, e.target.value)}
                      />
                    ) : (
                      formatCurrency(discount.discount_price || 0)
                    )}
                    {validationErrors[discount.id] && (
                      <span className="validation-error">
                        {validationErrors[discount.id]}
                      </span>
                    )}
                  </td>
                  <td className="discount-cell last--update">
                    {discount.last_updated
                      ? formatDate(discount.last_updated)
                      : "N/A"}
                  </td>
                  <td className="discount-cell last--edited">
                    {discount.last_edited_by || "N/A"}
                  </td>
                  <td className="discount-cell discount-actions aksi">
                    {editableDiscounts[discount.id] !== undefined ||
                    editableMOQ[discount.id] !== undefined ? (
                      <>
                        <button
                          onClick={() => handleSave(discount.id)}
                          className="action-button confirm-button"
                        >
                          Simpan
                        </button>
                        <button
                          onClick={() => handleCancelEdit(discount.id)}
                          className="action-button cancel-button"
                        >
                          Batal
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditableDiscounts((prev) => ({
                              ...prev,
                              [discount.id]: discount.discount_price,
                            }));
                            setEditableMOQ((prev) => ({
                              ...prev,
                              [discount.id]: discount.minimum_order_quantity,
                            }));
                          }}
                          className="action-button edit-button"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(discount.id)}
                          className="action-button delete-button"
                        >
                          Hapus
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        message="Apakah Anda yakin ingin menghapus diskon ini?"
      />
    </div>
  );
};

export default DiscountList;
