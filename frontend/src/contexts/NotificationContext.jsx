import React, { createContext, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';

export const NotificationContext = createContext(null);

const NOTIFICATIONS_KEY = 'intern_portal_notifications';

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  // Load notifications from LocalStorage on mount/user change
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    let list = [];
    if (data) {
      list = JSON.parse(data);
    } else {
      // Seed default mock notifications
      list = [
        {
          id: 'notif-1',
          userId: 'admin-id',
          role: 'ROLE_ADMIN',
          title: 'New Submission Pending',
          desc: 'System Intern submitted "Frontend Project Setup".',
          time: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
          read: false,
          type: 'SUBMISSION'
        },
        {
          id: 'notif-2',
          userId: 'admin-id',
          role: 'ROLE_ADMIN',
          title: 'Leave Request Received',
          desc: 'System Intern applied for Sick Leave.',
          time: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
          read: false,
          type: 'LEAVE'
        },
        {
          id: 'notif-3',
          userId: 'intern-id',
          role: 'ROLE_INTERN',
          title: 'New Task Assigned',
          desc: 'Complete dashboard charts layout integrations.',
          time: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
          read: false,
          type: 'TASK'
        },
        {
          id: 'notif-4',
          userId: 'intern-id',
          role: 'ROLE_INTERN',
          title: 'Submission Approved 🎉',
          desc: 'Your submissions for authentication setup was accepted.',
          time: new Date(Date.now() - 1000 * 60 * 480).toISOString(), // 8 hours ago
          read: true,
          type: 'SUBMISSION'
        }
      ];
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list));
    }

    // Filter to notifications that match the current user's role (ROLE_ADMIN vs ROLE_INTERN)
    const userRole = user.role;
    const userSpecificList = list.filter(n => n.role === userRole);
    setNotifications(userSpecificList);
  }, [user]);

  const saveToStorage = (updatedList) => {
    // We load all, merge updated user specific list, and save
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    let allNotifs = data ? JSON.parse(data) : [];
    
    if (user) {
      // Remove current user specific role notifications
      allNotifs = allNotifs.filter(n => n.role !== user.role);
      // Concat updated ones
      allNotifs = [...allNotifs, ...updatedList];
    }
    
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(allNotifs));
  };

  const addNotification = (title, desc, type, role) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      role: role || (user?.role === 'ROLE_ADMIN' ? 'ROLE_INTERN' : 'ROLE_ADMIN'), // target role
      title,
      desc,
      time: new Date().toISOString(),
      read: false,
      type
    };

    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    const allNotifs = data ? JSON.parse(data) : [];
    allNotifs.push(newNotif);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(allNotifs));

    // If target role is the same as current logged in user, update state
    if (user && user.role === newNotif.role) {
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const markAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    saveToStorage(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    saveToStorage(updated);
  };

  const clearNotifications = () => {
    setNotifications([]);
    saveToStorage([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
