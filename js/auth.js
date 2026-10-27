/**
 * PathSetu Unified Authentication & Session Manager
 * Handles login, registration, authenticated API requests, top navigation user menu,
 * and page route protection with zero deceptive states.
 */

const PathSetuAuth = (function () {
  'use strict';

  let currentUser = null;
  let isChecked = false;

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          currentUser = data.user;
        } else {
          currentUser = null;
        }
      } else {
        currentUser = null;
      }
    } catch (e) {
      console.warn('PathSetu Auth check connection notice:', e);
      currentUser = null;
    }
    isChecked = true;
    renderTopNavUser();
    return currentUser;
  }

  async function register(name, email, password, confirmPassword) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        confirm_password: confirmPassword
      })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Registration failed.');
    }
    currentUser = data.user;
    renderTopNavUser();
    return data;
  }

  async function login(email, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email: email, password: password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Login failed.');
    }
    currentUser = data.user;
    renderTopNavUser();
    return data;
  }

  async function logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout network error:', e);
    }
    currentUser = null;
    window.location.href = '/login';
  }

  function getCurrentUser() {
    return currentUser;
  }

  async function requireAuth(redirectTo = '/login') {
    if (!isChecked) {
      await checkAuth();
    }
    if (!currentUser) {
      const currentPath = window.location.pathname;
      window.location.href = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
      return false;
    }
    return true;
  }

  function renderTopNavUser() {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions) return;

    // Check if user container already exists
    let userContainer = document.getElementById('topNavUserContainer');
    if (!userContainer) {
      userContainer = document.createElement('div');
      userContainer.id = 'topNavUserContainer';
      userContainer.className = 'user-menu-container';
      headerActions.prepend(userContainer);
    }

    if (currentUser) {
      const initials = currentUser.name ? currentUser.name.trim()[0].toUpperCase() : 'S';
      userContainer.innerHTML = `
        <button class="user-avatar-btn" id="btnUserMenu" aria-label="Student Account Menu">
          <div class="user-avatar-icon">${initials}</div>
          <span style="max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${currentUser.name}</span>
          <span style="font-size: 0.72rem; color: var(--color-text-secondary);">▼</span>
        </button>
        <div class="user-dropdown-menu" id="userDropdownMenu" role="menu">
          <div class="user-dropdown-header">
            <strong>${currentUser.name}</strong>
            <span class="small text-muted">${currentUser.email}</span>
          </div>
          <a href="/dashboard" class="user-dropdown-item">📊 My Dashboard</a>
          <a href="/profile" class="user-dropdown-item">✍️ Student Profile</a>
          <a href="/roadmap" class="user-dropdown-item">🗺️ My Roadmap</a>
          <div style="border-top: 1px solid var(--color-border); margin: 4px 0;"></div>
          <button class="user-dropdown-item text-danger" id="btnLogoutAction" style="width:100%; text-align:left;">
            🚪 Sign Out
          </button>
        </div>
      `;

      const btnMenu = document.getElementById('btnUserMenu');
      const dropMenu = document.getElementById('userDropdownMenu');
      if (btnMenu && dropMenu) {
        btnMenu.onclick = (e) => {
          e.stopPropagation();
          dropMenu.classList.toggle('show');
        };
      }

      const btnLogout = document.getElementById('btnLogoutAction');
      if (btnLogout) {
        btnLogout.onclick = () => logout();
      }

      // Hide guest CTA buttons if present
      const guestCta = headerActions.querySelector('.btn-primary[href="profile.html"], .btn-primary[href="/login"]');
      if (guestCta) {
        guestCta.style.display = 'none';
      }
    } else {
      userContainer.innerHTML = `
        <a href="/login" class="btn btn-sm btn-outline" style="border-radius: var(--radius-full); font-weight: 600;">
          Sign In
        </a>
      `;
    }
  }

  // Close dropdown on window click
  window.addEventListener('click', () => {
    const dropMenu = document.getElementById('userDropdownMenu');
    if (dropMenu && dropMenu.classList.contains('show')) {
      dropMenu.classList.remove('show');
    }
  });

  // Auto initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
  });

  return {
    checkAuth: checkAuth,
    register: register,
    login: login,
    logout: logout,
    getCurrentUser: getCurrentUser,
    requireAuth: requireAuth,
    renderTopNavUser: renderTopNavUser
  };
})();

