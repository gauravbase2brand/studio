
'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

const initialUsers = {
    'superadmin@example.com': { id: '1', name: 'Super Admin', email: 'superadmin@example.com', role: 'SUPER_ADMIN' },
    'admin@example.com': { id: '2', name: 'Admin User', email: 'admin@example.com', role: 'ADMIN' },
    'owner@example.com': { id: '3', name: 'Restaurant Owner', email: 'owner@example.com', role: 'RESTAURANT_OWNER' },
    'driver@example.com': { id: '4', name: 'Driver', email: 'driver@example.com', role: 'DRIVER' },
    'support@example.com': { id: '5', name: 'Support', email: 'support@example.com', role: 'SUPPORT' },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      
      const storedUsers = localStorage.getItem('allUsers');
      if (storedUsers) {
        setAllUsers(JSON.parse(storedUsers));
      } else {
        const usersArray = Object.values(initialUsers);
        setAllUsers(usersArray);
        localStorage.setItem('allUsers', JSON.stringify(usersArray));
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
      localStorage.removeItem('user');
      localStorage.removeItem('allUsers');
    } finally {
      setLoading(false);
    }
  }, []);

  
  const updateUserInStorage = (users) => {
    localStorage.setItem('allUsers', JSON.stringify(users));
    setAllUsers(users);
  }

  const login = (email) => {
    const userPool = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const userData = userPool.find(u => u.email === email);
    
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      router.push('/dashboard');
    } else {
      const newUser = {
        id: `${new Date().getTime()}`,
        name: 'New User',
        email: email,
        role: 'RESTAURANT_OWNER',
      };
      register(newUser, true);
    }
  };

  const register = (userData, fromLogin = false) => {
    const newUser = {
      id: userData.id || `${new Date().getTime()}`,
      ...userData,
    };
    const updatedUsers = [...allUsers, newUser];
    updateUserInStorage(updatedUsers);
    
    if (!fromLogin) {
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      router.push('/dashboard');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const updateUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    const updatedUsers = allUsers.map(u => u.id === userData.id ? userData : u);
    updateUserInStorage(updatedUsers);
  };
  
  const updateUserRole = (userId, newRole) => {
    const updatedUsers = allUsers.map(u => u.id === userId ? { ...u, role: newRole } : u);
    updateUserInStorage(updatedUsers);
    if (user && user.id === userId) {
      updateUser({ ...user, role: newRole });
    }
  }

  return (
    <AuthContext.Provider value={{ user, allUsers, login, register, logout, updateUser, updateUserRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const withAuth = 
  (WrappedComponent) => {
  const Wrapper = (props) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.replace('/login');
      }
    }, [user, loading, router]);

    if (loading || !user) {
      return (
         <div className="flex items-center justify-center h-screen">
            <div>Loading...</div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
  return Wrapper;
};
