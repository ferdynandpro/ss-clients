// Helper function to format price to IDR (Rupiah)
export const formatPrice = (price) => {
  const cleanedPrice = price.replace(/\D/g, '');
  const formattedPrice = cleanedPrice.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp ${formattedPrice}`;
};
// Helper function to clean price input (remove 'Rp' and non-numeric characters)
export const cleanPriceInput = (price) => {
  return price.replace(/\D/g, ''); // Remove all non-numeric characters
};
