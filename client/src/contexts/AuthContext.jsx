import React, { createContext, useContext, useEffect, useState } from 'react';
import apiClient from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to fetch user profile
  const fetchUserProfile = async () => {
    try {
      console.log('Fetching user profile...');
      
      const response = await apiClient.get('/user/profile');

      if (response.status === 200) {
        const userData = response.data;
        console.log('User profile fetched:', userData);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('Not authenticated');
      } else {
        console.error('Error fetching user profile:', error);
      }
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Function to update user profile
  const updateProfile = async (profileData) => {
    try {
        // DEBUG: Log what we're sending to the server
        console.log('AuthContext - Sending profile data to server:', profileData);
        
        const response = await apiClient.put('/user/profile', profileData);

        if (response.status === 200) {
            // DEBUG: Log what we got back
            console.log('AuthContext - Received updated user data:', response.data);
            
            setUser(response.data);
            return { success: true, data: response.data };
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        return { 
            success: false, 
            error: error.response?.data?.message || 'An error occurred while updating your profile.' 
        };
    }
  };

  // Function to login
  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const data = response.data;

      if (response.status === 200) {
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, data };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.response?.data?.message || 'Network error' };
    }
  };

  // Function to signup
  const signup = async (email, password, username) => {
    try {
      const response = await apiClient.post('/auth/signup', { email, password, username });
      const data = response.data;

      if (response.status === 201) {
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, data };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.response?.data?.message || 'Network error' };
    }
  };

  // Function to logout
  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    updateProfile,
    login,
    signup, // <-- Export the new function
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};