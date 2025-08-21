import { create } from 'zustand';
import axios from 'axios';

// A helper function to get the user from localStorage
const getUserFromStorage = () => {
  try {
    // Make sure to handle the case where 'user' is not in storage
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    return null;
  }
};

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  user: getUserFromStorage(), // Read user object from storage on init

  login: async (email, password) => {
    const { data } = await axios.post('http://localhost:8080/api/auth/login', { email, password });
    
    // Create a user object without the token
    const userDetails = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    };

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userDetails)); // Save user object to storage
    
    set({ token: data.token, user: userDetails });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Remove user from storage on logout
    set({ token: null, user: null });
  },
}));

export default useAuthStore;