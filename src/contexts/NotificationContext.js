import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    
    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      console.log('🔔 Notification added. Total unread:', updated.filter(n => !n.isRead).length);
      return updated;
    });
    
    return newNotification;
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => {
      const updated = prev.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      );
      console.log('📖 Notification marked as read. Total unread:', updated.filter(n => !n.isRead).length);
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(notif => ({ ...notif, isRead: true }));
      console.log('📖 All notifications marked as read');
      return updated;
    });
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => {
      const updated = prev.filter(notif => notif.id !== notificationId);
      console.log('🗑️ Notification deleted. Total unread:', updated.filter(n => !n.isRead).length);
      return updated;
    });
  };

  const getUnreadCount = () => {
    const count = notifications.filter(notif => !notif.isRead).length;
    return count;
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      getUnreadCount
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
