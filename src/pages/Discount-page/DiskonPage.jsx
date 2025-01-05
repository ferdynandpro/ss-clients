import React, { useState } from "react";
import DiscountForm from "../../components/Discount/DiscountForm";
import DiscountList from "../../components/Discount/DiscountList";

const DiskonPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => !prev);
  };

  return (
    <div className="container">
      <h1 className="titles">Diskon Pelanggan</h1>
      <DiscountForm onSuccess={handleRefresh} />
      <DiscountList refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default DiskonPage;
