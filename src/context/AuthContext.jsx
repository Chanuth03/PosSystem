import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const DEFAULT_USERS = [
  { id: 1, username: 'admin', role: 'admin', lastActive: 'Just now' },
  { id: 2, username: 'cashier', role: 'cashier', lastActive: '1 hr ago' },
];

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUsers = localStorage.getItem('mock_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(DEFAULT_USERS);
      localStorage.setItem('mock_users', JSON.stringify(DEFAULT_USERS));
    }

    const savedActiveUser = localStorage.getItem('mock_active_user');
    if (savedActiveUser) {
      setActiveUser(JSON.parse(savedActiveUser));
    } else {
      setActiveUser(DEFAULT_USERS[0]); // Default to admin for now
      localStorage.setItem('mock_active_user', JSON.stringify(DEFAULT_USERS[0]));
    }
    
    setLoading(false);
  }, []);

  const saveUsers = (newUsers) => {
    setUsers(newUsers);
    localStorage.setItem('mock_users', JSON.stringify(newUsers));
  };

  const switchUser = (userId) => {
    const user = users.find(u => u.id === Number(userId));
    if (user) {
      setActiveUser(user);
      localStorage.setItem('mock_active_user', JSON.stringify(user));
    }
  };

  return (
    <AuthContext.Provider value={{ users, saveUsers, activeUser, switchUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
