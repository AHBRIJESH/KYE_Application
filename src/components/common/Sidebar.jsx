import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './css/Sidebar.css';

function Sidebar({ isOpen, onToggle }) {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth > 768);
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState(new Set());

  // Handle resize
  const handleResize = useCallback(() => {
    if (window.innerWidth <= 768) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest('.menu-button') &&
        !e.target.closest('.submenu')
      ) {
        setExpandedItems(new Set());
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleExpand = (key) => {
    const newSet = new Set(expandedItems);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      // Close siblings under same parent
      const parentKey = key.split('.').slice(0, -1).join('.');
      const keysToClose = Array.from(newSet).filter(k => k.startsWith(parentKey) && k !== key);
      keysToClose.forEach(k => newSet.delete(k));
      newSet.add(key);
    }
    setExpandedItems(newSet);
  };

  const handleLinkClick = useCallback(() => {
    if (window.innerWidth <= 768) {
      onToggle();
    }
  }, [onToggle]);

  // Menu structure — deep nesting supported
  const menuItems = [
    { to: '/home', icon: 'bi-house-door', label: 'Home' },
    {
      label: 'Exception Management',
      icon: 'bi-exclamation-triangle',
      key: 'exception',
      submenu: [
        { to: '/exception/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
      ]
    },
    { to: '/notes', icon: 'bi-journal-text', label: 'Audit Notes' },
    { to: '/enquiry', icon: 'bi-question-circle', label: 'Audit Enquiry' },
    {
      label: 'Reports',
      icon: 'bi-file-earmark-bar-graph',
      key: 'reports',
      submenu: [
        {
          label: 'One Click Analysis Reports',
          key: 'one-click',
          submenu: [
            { to: '/reports/one-click/summary', icon: 'bi-bar-chart', label: 'Summary' },
            { to: '/reports/one-click/risk', icon: 'bi-shield-check', label: 'Ranked by Risk' },
          ]
        },
        {
          label: 'Online Reports',
          key: 'online',
          submenu: [
            {
              label: 'User Based Reports',
              key: 'user-based',
              submenu: [
                { to: '/reports/user/summary', icon: 'bi-person', label: 'Summary' },
                { to: '/reports/user/risk', icon: 'bi-exclamation-circle', label: 'Ranked by Risk' },
              ]
            },
            {
              label: 'Role Based Reports',
              key: 'role-based',
              submenu: [
                { to: '/reports/role/summary', icon: 'bi-list-task', label: 'Summary' },
                { to: '/reports/role/risk', icon: 'bi-exclamation-triangle', label: 'Ranked by Risk' },
                { to: '/reports/role/tcode', icon: 'bi-code-slash', label: 'TCode Level Risk Details' },
                { to: '/reports/role/executions', icon: 'bi-clock-history', label: 'Member TCode Executions' },
                { to: '/reports/role/remediations', icon: 'bi-patch-check', label: 'Remediations' },
              ]
            },
            {
              label: 'Executions Reports',
              key: 'executions',
              submenu: [
                { to: '/reports/executions/summary', icon: 'bi-clock', label: 'Summary' },
              ]
            }
          ]
        }
      ]
    },
    {
      label: 'Admin',
      icon: 'bi-gear',
      key: 'admin',
      submenu: [
        {
          label: 'Organization Master',
          key: 'org-master',
          submenu: [
            { to: '/admin/org/level1', icon: 'bi-building', label: 'Org Master Level 1' },
            { to: '/admin/org/level2', icon: 'bi-building', label: 'Org Master Level 2' },
            { to: '/admin/org/level3', icon: 'bi-building', label: 'Org Master Level 3' },
            { to: '/admin/org/level4', icon: 'bi-building', label: 'Org Master Level 4' },
            { to: '/admin/org/level5', icon: 'bi-building', label: 'Org Master Level 5' },
            { to: '/admin/org/level6', icon: 'bi-building', label: 'Org Master Level 6' },
            { to: '/admin/org/level7', icon: 'bi-building', label: 'Org Master Level 7' },
            { to: '/admin/org/level8', icon: 'bi-building', label: 'Org Master Level 8' },
            { to: '/admin/org/level9', icon: 'bi-building', label: 'Org Master Level 9' },
            { to: '/admin/org/level10', icon: 'bi-building', label: 'Org Master Level 10' },
          ]
        },
        {
          label: 'User Master',
          key: 'user-master',
          submenu: [
            { to: '/admin/user/persona', icon: 'bi-person-badge', label: 'User Persona Master' },
            { to: '/admin/user/create', icon: 'bi-person-plus', label: 'Create Users Manually' },
            { to: '/admin/user/import', icon: 'bi-file-earmark-spreadsheet', label: 'Import Users From Excel' },
            { to: '/admin/user/ad', icon: 'bi-box-arrow-in-up-right', label: 'Active Directory Integration' },
          ]
        },
        {
          label: 'User Authorization',
          key: 'user-auth',
          submenu: [
            { to: '/admin/auth/roles', icon: 'bi-key', label: 'Roles & Permissions' },
          ]
        },
        {
          label: 'User Bulk Authorization',
          key: 'bulk-auth',
          submenu: [
            { to: '/admin/bulk/import', icon: 'bi-cloud-upload', label: 'Bulk Import' },
          ]
        }
      ]
    },
    { to: '/help', icon: 'bi-book', label: 'Help & Training' },
  ];

  const isActive = (item) => {
    if (item.to && location.pathname === item.to) return true;
    if (item.submenu) {
      return item.submenu.some(sub => isActive(sub));
    }
    return false;
  };

  // Recursively render menu items
  const renderMenuItems = (items, depth = 0) => {
    return items.map((item, index) => (
      <li key={index} className="nav-link">
        {/* Main Item */}
        <div className="menu-item-wrapper">
          {item.submenu ? (
            <button
              ref={el => {
                if (el && expandedItems.has(item.key)) {
                  const rect = el.getBoundingClientRect();
                  const left = rect.left + rect.width + 8; // 8px gap
                  const top = rect.top;

                  const submenuEl = document.getElementById(`submenu-${item.key}`);
                  if (submenuEl) {
                    submenuEl.style.left = `${left}px`;
                    submenuEl.style.top = `${top}px`;
                  }
                }
              }}
              onClick={() => toggleExpand(item.key)}
              className={`menu-button ${expandedItems.has(item.key) ? 'expanded' : ''}`}
              aria-expanded={expandedItems.has(item.key)}
              aria-controls={`submenu-${item.key}`}
            >
              <i className={item.icon}></i>
              <span className="text nav-text">{item.label}</span>
              <i className="bi bi-chevron-right arrow"></i>
            </button>
          ) : (
            <Link
              to={item.to}
              className={location.pathname === item.to ? 'active' : ''}
              onClick={handleLinkClick}
              aria-current={location.pathname === item.to ? 'page' : undefined}
            >
              <i className={item.icon}></i>
              <span className="text nav-text">{item.label}</span>
            </Link>
          )}
        </div>

        {/* Floating Submenu — positioned via JS */}
        {item.submenu && (
          <ul
            id={`submenu-${item.key}`}
            className={`submenu ${expandedItems.has(item.key) ? 'open' : ''}`}
            style={{
              position: 'fixed',
              top: '0px',
              left: '0px',
              width: '200px',
              background: '#3a4d7e',
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              zIndex: 1001,
              display: expandedItems.has(item.key) ? 'block' : 'none',
              transition: 'all 0.2s ease',
              opacity: expandedItems.has(item.key) ? 1 : 0,
              transform: expandedItems.has(item.key) ? 'translateX(0)' : 'translateX(-10px)',
            }}
          >
            {renderMenuItems(item.submenu, depth + 1)}
          </ul>
        )}
      </li>
    ));
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && window.innerWidth <= 768 && (
        <div 
          className="sidebar-overlay" 
          onClick={onToggle}
          role="presentation"
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <nav
        className={`sidebar ${isCollapsed ? 'close' : ''}`}
        aria-label="Main navigation"
      >
        {/* Header */}
        <header>
          <div className="image-text">
            <div className="image" aria-label="Audit Workflow Logo"></div>
            <div className="text logo-text">
              <span className="name">ADS Audit</span>
              <span className="profession">Workflow</span>
            </div>
          </div>
          <i 
            className='bi bi-chevron-right toggle' 
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label="Toggle sidebar"
          ></i>
        </header>

        {/* Menu */}
        <div className="menu-bar">
          <ul className="menu-links">
            {renderMenuItems(menuItems)}
          </ul>
        </div>

        {/* Logout */}
        <div className="bottom-content">
          <li className="nav-link">
            <button 
              onClick={onToggle}
              className="logout-link"
              aria-label="Logout"
            >
              <i className='bi bi-box-arrow-right icon'></i>
              <span className="text nav-text">Logout</span>
            </button>
          </li>
        </div>
      </nav>
    </>
  );
}

export default Sidebar;