import api from "./api";

// Get the token from localStorage (if available) to send with authenticated requests
const getAuthToken = () => localStorage.getItem('token');

// Login Service
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "An unexpected error occurred" };
  }
};

// Register Service with Improved Error Handling
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data; // Successful registration
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data.message || "An unexpected error occurred.";
      
      // Specific handling for known errors (e.g., username already exists)
      if (error.response.data.message === "Username already exists") {
        throw new Error("Username is already taken. Please choose another one.");
      } else if (error.response.data.message === "Password must be at least 6 characters") {
        throw new Error("Password must be at least 6 characters long.");
      } else {
        throw new Error(errorMessage);
      }
    } else {
      // Handle network-related issues or unexpected errors
      throw new Error("An unexpected error occurred. Please try again later.");
    }
  }
};



// Fetch User Details
export const fetchUserDetails = async () => {
  try {
    const token = getAuthToken(); // Get the token from localStorage
    const response = await api.get("/user/me", {
      headers: {
        Authorization: `Bearer ${token}`, // Send token in Authorization header
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "An unexpected error occurred" };
  }
};
