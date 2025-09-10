import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './css/Header.css';

const Header = memo(() => {
  const { currentUser, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New audit assigned', message: 'You have been assigned to audit project #AUD-2023-045', time: '10 minutes ago', read: false },
    { id: 2, title: 'Exception resolved', message: 'Exception #EX-2023-112 has been resolved by the team', time: '1 hour ago', read: false },
    { id: 3, title: 'Report approved', message: 'Your quarterly audit report has been approved', time: '3 hours ago', read: false }
  ]);

  const userDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  // Load saved language
  useEffect(() => {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) setLanguage(savedLang);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handlers
  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to log out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout]);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  }, []);

  const handleLanguageChange = useCallback((e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    localStorage.setItem('preferredLanguage', newLang);
  }, []);

  const handleAccountSettings = useCallback(() => {
    window.location.href = '/settings/profile';
  }, []);

  const formatLastLogin = useCallback(() => {
    const lastLogin = localStorage.getItem('lastLogin') || new Date().toISOString();
    return new Date(lastLogin).toLocaleString(navigator.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const toggleDropdown = useCallback((setter, otherSetter) => {
    return () => {
      setter(prev => !prev);
      if (otherSetter) otherSetter(false);
    };
  }, []);

  const handleKeyDown = useCallback((e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="top-bar" role="banner">
      <div className="top-bar-right">
        {/* Last Login - Hidden on Mobile */}
        <div className="last-login" aria-live="polite">
          Last logged in: <time dateTime={formatLastLogin()}>{formatLastLogin()}</time>
        </div>

        {/* Language Selector */}
        <div className="language-toggle">
          <label htmlFor="language-select" className="visually-hidden">Select Language</label>
          <select
            id="language-select"
            value={language}
            onChange={handleLanguageChange}
            aria-label="Select language"
          >
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="fr">FR</option>
          </select>
        </div>

        {/* Notifications */}
        <div
          className="notification-bell"
          onClick={toggleDropdown(setShowNotifications, setShowUserDropdown)}
          ref={notificationDropdownRef}
          aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => handleKeyDown(e, toggleDropdown(setShowNotifications, setShowUserDropdown))}
        >
          <i className="bi bi-bell" aria-hidden="true"></i>
          {unreadCount > 0 && (
            <span className="notification-badge" aria-label={`${unreadCount} unread notifications`}>
              {unreadCount}
            </span>
          )}

          {showNotifications && (
            <div className="notification-dropdown" role="dialog" aria-modal="true">
              <div className="notification-header">
                <h3>Notifications</h3>
                <button
                  className="mark-read"
                  onClick={(e) => {
                    e.stopPropagation();
                    markAllAsRead();
                  }}
                  disabled={unreadCount === 0}
                  aria-label="Mark all as read"
                >
                  Mark all as read
                </button>
              </div>

              <div className="notification-list" role="list">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => handleKeyDown(e, () => markAsRead(notification.id))}
                      aria-label={`${notification.title}: ${notification.message}`}
                    >
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <div className="notification-time">{notification.time}</div>
                    </div>
                  ))
                ) : (
                  <div className="no-notifications">No new notifications</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div
          className="user-info"
          onClick={toggleDropdown(setShowUserDropdown, setShowNotifications)}
          ref={userDropdownRef}
          aria-label="User menu"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => handleKeyDown(e, toggleDropdown(setShowUserDropdown, setShowNotifications))}
        >
          <div className="user-profile">
            <div className="user-avatar" aria-label={`User ${currentUser?.name || 'Unknown'}`}>
              {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="user-name">{currentUser?.name || 'User'}</span>
            <i className="bi bi-chevron-down" aria-hidden="true"></i>
          </div>

          {showUserDropdown && (
            <div className="user-dropdown" role="menu">
              <div className="user-details">
                <p><strong>Emp ID:</strong> <span>ET-123</span></p>
                <p><strong>Full Name:</strong> <span>{currentUser?.name || 'N/A'}</span></p>
                <p><strong>Persona:</strong> <span>Senior Auditor</span></p>
                <p>
                  <strong>Work Status:</strong>
                  <span className="status-wrapper">
                    <span className="status-indicator status-busy" aria-label="Busy"></span>
                    Busy
                  </span>
                </p>
              </div>

              <div className="user-actions">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleAccountSettings}
                  aria-label="Account Settings"
                >
                  <i className="bi bi-person-gear" aria-hidden="true"></i>
                  Account Settings
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  aria-label="Logout"
                >
                  {isLoggingOut ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span className="ms-1">Logging out...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-right" aria-hidden="true"></i>
                      <span className="ms-1">Logout</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
});

export default Header;