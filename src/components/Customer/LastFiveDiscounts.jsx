import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "../../assets/styles/components/discount-list.css"; // Menggunakan file CSS yang sama
import { formatCurrency, formatDate } from "../../utils/Format"; // Format helper
import '../../assets/styles/components/last-five.css'

const LastFiveDiscounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await api.get("/discounts");
        const sortedDiscounts = response.data.sort(
          (a, b) => new Date(b.last_updated) - new Date(a.last_updated)
        );
        setDiscounts(sortedDiscounts.slice(0, 5)); // Ambil 5 diskon terakhir
        setLoading(false);
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil data diskon");
        setLoading(false);
      }
    };
    fetchDiscounts();
  }, []);

  return (
    <div className="table-container">
      <h3>5 Diskon Terakhir</h3>

      {loading && <p className="discount-loading">Memuat...</p>}
      {error && <p className="discount-error">{error}</p>}

      {!loading && !error && (
        <div className="table-scroll-container">
          <table className="data-table">
            <thead>
              <tr>
                <th className="discount-table-header disc-tablee">Nama Pelanggan</th>
                <th className="discount-table-header disc-tablee">Nama Produk</th>
                <th className="discount-table-header harga disc-tablee">Harga Diskon</th>
                <th className="discount-table-header disc-tablee">MOQ</th>
                <th className="discount-table-header last--update">Terakhir Diperbaharui</th>
              </tr>
            </thead>

            <tbody>
              {discounts.map((discount) => (
                <tr key={discount.id} className="discount-row">
                  <td className="discount-cell disc-tablee">
                    {discount.customer?.customer_name || "N/A"}
                  </td>
                  <td className="discount-cell disc-tablee">
                    {discount.Product?.name || "N/A"}
                  </td>
                  <td className="discount-cell disc-tablee">
                    {formatCurrency(discount.discount_price || 0)}
                  </td>
                  <td className="discount-cell disc-tablee">
                    {discount.minimum_order_quantity || "N/A"}
                  </td>
                  <td className="discount-cell last--update">
                    {discount.last_updated
                      ? formatDate(discount.last_updated)
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LastFiveDiscounts;
