import { create } from 'zustand';
import axios from 'axios';


const getUserFromStorage = () => {
  try {
    
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    return null;
  }
};

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  user: getUserFromStorage(), 

  login: async (email, password) => {
    const { data } = await axios.post('http://localhost:8080/api/auth/login', { email, password });
    
    
    const userDetails = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    };

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userDetails)); 
    
    set({ token: data.token, user: userDetails });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); 
    set({ token: null, user: null });
  },
}));

export default useAuthStore;