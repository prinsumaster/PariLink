/**
 * PariLink — UI Components
 */

window.Sidebar = () => {
    const role = window.state.user.role;
    const links = [
        { name: 'Dashboard', path: '#dashboard', icon: window.Icons.Dashboard, roles: ['owner', 'operator', 'accountant'] },
        { name: 'Live Tracking', path: '#tracking', icon: '[GPS]', roles: ['owner', 'operator'] },
        { name: 'Trucks', path: '#trucks', icon: window.Icons.Truck, roles: ['owner', 'operator'] },
        { name: 'Drivers', path: '#drivers', icon: window.Icons.Users, roles: ['owner', 'operator'] },
        { name: 'Loads', path: '#loads', icon: window.Icons.Load, roles: ['owner', 'operator'] },
        { name: 'Fastag & Tolls', path: '#fastag', icon: '[TAG]', roles: ['owner', 'operator', 'accountant'] },
        { name: 'Fuel', path: '#fuel', icon: window.Icons.Fuel, roles: ['owner', 'operator', 'accountant'] },
        { name: 'Maintenance', path: '#maintenance', icon: window.Icons.Maintenance, roles: ['owner', 'operator'] },
        { name: 'Finance', path: '#finance', icon: window.Icons.Finance, roles: ['owner', 'accountant'] },
        { name: 'Settings', path: '#settings', icon: window.Icons.Settings || '⚙️', roles: ['owner'] },
    ];

    const companyLogo = window.state.company?.logoUrl
        ? `<img src="${window.state.company.logoUrl}" style="width: 32px; height: 32px; border-radius: 8px; object-fit: cover;">`
        : `<div class="sidebar-brand-icon">[TRUCK]</div>`;

    const companyName = window.state.company?.name || 'PariLink';

    // Show subscription warning if < 7 days remaining
    const sub = window.state.subscription;
    const subWarning = (sub && sub.days_remaining <= 7 && sub.days_remaining > 0) ? `
        <div style="margin: 0.5rem; padding: 0.5rem 0.75rem; background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.3); border-radius: 8px; font-size: 0.75rem; color: #f59e0b;">
            ⚠️ Subscription expires in <strong>${sub.days_remaining} days</strong>
        </div>
    ` : '';

    return `
        <aside class="sidebar">
            <div class="sidebar-brand">
                ${companyLogo}
                <div>
                    <h1>${companyName}</h1>
                    <small>Your Transport Link</small>
                </div>
            </div>
            
            ${subWarning}
            
            <div class="sidebar-section-label">Main Menu</div>
            <nav class="sidebar-nav">
                ${links.filter(l => l.roles.includes(role)).map(link => `
                    <a href="javascript:void(0)" onclick="window.navigate('${link.path}')" class="nav-item ${window.location.hash === link.path ? 'active' : ''}">
                        ${link.icon} <span>${link.name}</span>
                    </a>
                `).join('')}
            </nav>
            
            <div class="sidebar-footer">
                <div class="sidebar-user">
                    <div class="sidebar-avatar">${window.state.user.name[0]}</div>
                    <div class="sidebar-user-info">
                        <p>${window.state.user.name}</p>
                        <span>${window.state.user.role}</span>
                    </div>
                </div>
                <button onclick="window.logout()" class="sidebar-logout">
                    ${window.Icons.Logout} Logout
                </button>
            </div>
        </aside>
    `;
};

window.LoginPage = () => {
    return `
        <div class="auth-screen">
            <div class="auth-box fade-in">
                <div class="auth-logo">PariLink</div>
                <p class="auth-tagline">The premium transport management system</p>
                
                <div id="auth-tabs" style="display: flex; gap: 0; margin-bottom: 1.5rem; border-radius: var(--radius); overflow: hidden; border: 1px solid var(--glass-border);">
                    <button onclick="window.showAuthTab('office')" id="tab-office" class="btn" style="flex:1; border-radius:0; background: var(--accent); color:white; border:none; padding: 0.75rem;">Office Login</button>
                    <button onclick="window.showAuthTab('driver')" id="tab-driver" class="btn" style="flex:1; border-radius:0; background: transparent; color:var(--text-secondary); border:none; padding: 0.75rem;">Driver Login</button>
                </div>

                <!-- Office Login (Email/Password) -->
                <div id="auth-office">
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" id="auth-email" placeholder="owner@company.com" style="width:100%;">
                    </div>
                    <div class ="form-group">
                        <label>Password</label>
                        <input type="password" id="auth-pass" placeholder="••••••••" style="width:100%;">
                    </div>
                    <div class="form-group">
                        <label>Login As</label>
                        <select id="auth-role" style="width:100%;">
                            <option value="owner">Owner / Admin</option>
                            <option value="operator">Operator / Manager</option>
                            <option value="accountant">Accountant</option>
                        </select>
                    </div>
                    <div id="auth-error" style="color: #f87171; font-size: 0.8rem; margin-bottom: 1rem; display:none;"></div>
                    <button onclick="window.emailLogin()" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem;">Sign In</button>
                    <p style="text-align: center; margin-top: 1rem; font-size: 0.8rem; color: var(--text-secondary);">
                        New account? <a href="#" onclick="window.emailSignup()" style="color: var(--accent); text-decoration: none;">Create Account</a>
                    </p>
                </div>

                <!-- Driver Login (Name + PIN) -->
                <div id="auth-driver" style="display:none;">
                    <div style="background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.3); border-radius: var(--radius); padding: 0.75rem 1rem; margin-bottom: 1.25rem; font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5;">
                        [LOCK] <strong style="color:var(--text-primary)">Driver PIN Login</strong><br>
                        Enter your name and your <strong>4-digit PIN</strong>.<br>
                        Your PIN = <strong>last 4 digits</strong> of your registered mobile number.
                    </div>
                    <div class="form-group">
                        <label>Your Name</label>
                        <input type="text" id="auth-driver-name" placeholder="e.g. Rajesh Kumar" style="width:100%;" autocomplete="name">
                    </div>
                    <div class="form-group">
                        <label>4-Digit PIN</label>
                        <input type="password" id="auth-driver-pin" placeholder="••••" maxlength="4" style="width:100%; letter-spacing: 0.5rem; font-size: 1.4rem; text-align: center;" inputmode="numeric">
                    </div>
                    <div id="auth-driver-error" style="color: #f87171; font-size: 0.8rem; margin-bottom: 1rem; display:none; padding: 0.5rem; background: rgba(248,113,113,0.1); border-radius: 6px;"></div>
                    <button onclick="window.driverLogin()" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem;">Login as Driver →</button>
                </div>
            </div>
        </div>
    `;
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUBSCRIPTION EXPIRED / SUSPENDED PAGE
// ═══════════════════════════════════════════════════════════════════════════════

window.SubscriptionExpiredPage = () => {
    const sub = window.state.subscription || {};
    const isSuspended = sub.status === 'suspended';
    const title = isSuspended ? 'Account Suspended' : 'Subscription Expired';
    const icon = isSuspended ? '🚫' : '⏰';
    const message = isSuspended
        ? 'Your account has been suspended by the PariLink administrator. Please contact support to resolve this issue.'
        : 'Your free trial or subscription has expired. To continue using PariLink, please contact support to recharge your plan.';
    
    return `
        <div class="auth-screen" style="background: linear-gradient(135deg, #0f0f0f 0%, #1a0000 100%);">
            <div class="auth-box fade-in" style="max-width: 480px; text-align: center; border-color: rgba(239,68,68,0.3);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">${icon}</div>
                <h2 style="font-size: 1.6rem; font-weight: 700; margin-bottom: 0.5rem; color: #f87171;">${title}</h2>
                <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6; margin-bottom: 2rem;">
                    ${message}
                </p>
                
                <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: var(--radius); padding: 1.25rem; margin-bottom: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: var(--text-muted); font-size: 0.85rem;">Company</span>
                        <span style="font-weight: 500;">${window.state.company?.name || 'N/A'}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: var(--text-muted); font-size: 0.85rem;">Plan</span>
                        <span class="badge" style="background: rgba(239,68,68,0.15); color: #f87171; border-color: rgba(239,68,68,0.3);">${(sub.plan || 'trial').toUpperCase()}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-muted); font-size: 0.85rem;">Status</span>
                        <span style="color: #f87171; font-weight: 600;">${isSuspended ? 'Suspended' : 'Expired'}</span>
                    </div>
                </div>

                <a href="https://wa.me/919876543210?text=Hi%20PariLink%2C%20my%20subscription%20has%20expired.%20Company%3A%20${encodeURIComponent(window.state.company?.name || '')}%20ID%3A%20${encodeURIComponent(window.state.user?.companyId || '')}.%20Please%20help%20me%20recharge." 
                   target="_blank"
                   class="btn btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; margin-bottom: 0.75rem; background: #25D366; border: none;">
                    💬 Contact PariLink Support on WhatsApp
                </a>
                <button onclick="window.logout()" class="btn btn-ghost" style="width: 100%; justify-content: center; padding: 0.85rem;">
                    ← Logout
                </button>
            </div>
        </div>
    `;
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUPER ADMIN PANEL — Only accessible by Vishal
// ═══════════════════════════════════════════════════════════════════════════════

window.SuperAdminLoginPage = () => {
    return `
        <div class="auth-screen" style="background: linear-gradient(135deg, #0f0f0f 0%, #0a001a 100%);">
            <div class="auth-box fade-in" style="max-width: 400px; border-color: rgba(139,92,246,0.3);">
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🛡️</div>
                    <h2 style="font-size: 1.3rem; font-weight: 700; color: #a78bfa;">PariLink Admin Panel</h2>
                    <p style="color: var(--text-muted); font-size: 0.8rem;">Authorized access only</p>
                </div>
                <div class="form-group">
                    <label>Admin Email</label>
                    <input type="email" id="admin-email" placeholder="admin@parilink.com" style="width:100%;">
                </div>
                <div class="form-group">
                    <label>Admin Password</label>
                    <input type="password" id="admin-pass" placeholder="••••••••" style="width:100%;">
                </div>
                <div id="admin-error" style="color: #f87171; font-size: 0.8rem; margin-bottom: 1rem; display:none;"></div>
                <button onclick="window.adminLogin()" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; background: #8b5cf6;">
                    🔐 Access Admin Panel
                </button>
                <button onclick="window.navigate('#login')" class="btn btn-ghost" style="width: 100%; justify-content: center; margin-top: 0.75rem;">
                    ← Back to Normal Login
                </button>
            </div>
        </div>
    `;
};

window.SuperAdminDashboard = () => {
    const stats = window._adminStats || {};
    const licenses = window._adminLicenses || [];

    return `
        <div style="min-height: 100vh; background: var(--bg-deep); background-image: var(--bg-gradient); padding: 2rem;">
            <div style="max-width: 1200px; margin: 0 auto;">
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem;">
                    <div>
                        <h1 style="font-size: 1.6rem; font-weight: 700;">🛡️ PariLink Master Control</h1>
                        <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.25rem;">Manage all client subscriptions & access</p>
                    </div>
                    <div style="display: flex; gap: 0.75rem;">
                        <button onclick="window.adminRefresh()" class="btn btn-ghost">🔄 Refresh</button>
                        <button onclick="window._adminSession = null; window.navigate('#login')" class="btn btn-ghost" style="color: #f87171;">Logout</button>
                    </div>
                </div>

                <!-- Stats Cards -->
                <div class="stats-row" style="margin-bottom: 2rem;">
                    <div class="stat-card" style="border-color: rgba(139,92,246,0.3);">
                        <div class="stat-label">Total Companies</div>
                        <div class="stat-value" style="color: #a78bfa;">${stats.total_companies || 0}</div>
                    </div>
                    <div class="stat-card" style="border-color: rgba(16,185,129,0.3);">
                        <div class="stat-label">Active</div>
                        <div class="stat-value" style="color: #10b981;">${stats.active || 0}</div>
                    </div>
                    <div class="stat-card" style="border-color: rgba(239,68,68,0.3);">
                        <div class="stat-label">Expired</div>
                        <div class="stat-value" style="color: #ef4444;">${stats.expired || 0}</div>
                    </div>
                    <div class="stat-card" style="border-color: rgba(245,158,11,0.3);">
                        <div class="stat-label">Suspended</div>
                        <div class="stat-value" style="color: #f59e0b;">${stats.suspended || 0}</div>
                    </div>
                </div>

                <!-- Companies Table -->
                <div class="card">
                    <div class="card-title" style="display: flex; justify-content: space-between; align-items: center;">
                        <span>All Client Companies</span>
                        <span style="font-size: 0.75rem; color: var(--text-muted);">${licenses.length} total</span>
                    </div>
                    <div class="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Company</th>
                                    <th>Owner Email</th>
                                    <th>Plan</th>
                                    <th>Status</th>
                                    <th>Expiry</th>
                                    <th>Days Left</th>
                                    <th>Fleet</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${licenses.length === 0 ? '<tr><td colspan="8" style="text-align:center; color:var(--text-muted); padding:2rem;">No companies registered yet.</td></tr>' : ''}
                                ${licenses.map(lic => {
                                    const isActive = lic.status === 'active' && lic.days_remaining >= 0;
                                    const isSuspended = lic.status === 'suspended';
                                    const isExpired = lic.days_remaining < 0 && lic.status !== 'suspended';
                                    const statusBadge = isSuspended 
                                        ? '<span class="badge" style="background:rgba(245,158,11,0.15); color:#f59e0b; border-color:rgba(245,158,11,0.3);">Suspended</span>'
                                        : isExpired
                                        ? '<span class="badge" style="background:rgba(239,68,68,0.15); color:#ef4444; border-color:rgba(239,68,68,0.3);">Expired</span>'
                                        : '<span class="badge" style="background:rgba(16,185,129,0.15); color:#10b981; border-color:rgba(16,185,129,0.3);">Active</span>';
                                    
                                    const daysColor = lic.days_remaining <= 0 ? '#ef4444' : lic.days_remaining <= 7 ? '#f59e0b' : '#10b981';
                                    
                                    return `
                                        <tr>
                                            <td>
                                                <strong>${lic.company_name || 'Unknown'}</strong><br>
                                                <span style="font-size:0.7rem; color:var(--text-muted);">${lic.company_id}</span>
                                            </td>
                                            <td style="font-size:0.85rem;">${lic.owner_email || 'N/A'}</td>
                                            <td><span class="badge">${(lic.plan || 'trial').toUpperCase()}</span></td>
                                            <td>${statusBadge}</td>
                                            <td style="font-size:0.85rem;">${lic.expiry_date || 'N/A'}</td>
                                            <td style="color: ${daysColor}; font-weight: 600;">${lic.days_remaining}</td>
                                            <td style="font-size:0.8rem; color:var(--text-secondary);">
                                                🚛${lic.truck_count || 0} 👤${lic.driver_count || 0} 📦${lic.load_count || 0}
                                            </td>
                                            <td>
                                                <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
                                                    <button class="btn btn-sm" style="background:rgba(16,185,129,0.15); color:#10b981; border-color:rgba(16,185,129,0.3); font-size:0.7rem;" onclick="window.adminAction('extend', '${lic.company_id}', 30)">+30d</button>
                                                    <button class="btn btn-sm" style="background:rgba(59,130,246,0.15); color:#3b82f6; border-color:rgba(59,130,246,0.3); font-size:0.7rem;" onclick="window.adminAction('extend', '${lic.company_id}', 90)">+90d</button>
                                                    <button class="btn btn-sm" style="background:rgba(139,92,246,0.15); color:#8b5cf6; border-color:rgba(139,92,246,0.3); font-size:0.7rem;" onclick="window.adminAction('extend', '${lic.company_id}', 365)">+1yr</button>
                                                    ${isSuspended 
                                                        ? `<button class="btn btn-sm" style="background:rgba(16,185,129,0.15); color:#10b981; border-color:rgba(16,185,129,0.3); font-size:0.7rem;" onclick="window.adminAction('activate', '${lic.company_id}')">✅ Activate</button>`
                                                        : `<button class="btn btn-sm" style="background:rgba(245,158,11,0.15); color:#f59e0b; border-color:rgba(245,158,11,0.3); font-size:0.7rem;" onclick="window.adminAction('suspend', '${lic.company_id}')">⏸ Suspend</button>`
                                                    }
                                                    <button class="btn btn-sm" style="background:rgba(239,68,68,0.15); color:#ef4444; border-color:rgba(239,68,68,0.3); font-size:0.7rem;" onclick="if(confirm('⚠️ DELETE ${lic.company_name}? This CANNOT be undone!')) window.adminAction('delete', '${lic.company_id}')">🗑 Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN LOGIC
// ═══════════════════════════════════════════════════════════════════════════════

window._adminSession = null;
window._adminStats = {};
window._adminLicenses = [];

// Admin password for the admin panel (checked locally — Firebase Auth handles the real auth)
const ADMIN_PASSWORD = 'parilink2026';

window.adminLogin = async () => {
    const email = document.getElementById('admin-email')?.value?.trim();
    const pass = document.getElementById('admin-pass')?.value;
    const errDiv = document.getElementById('admin-error');

    if (!email || !pass) {
        errDiv.textContent = 'Enter admin credentials.';
        errDiv.style.display = 'block';
        return;
    }

    // Check admin credentials
    if (email !== 'admin@parilink.com' || pass !== ADMIN_PASSWORD) {
        errDiv.textContent = 'Invalid admin credentials.';
        errDiv.style.display = 'block';
        return;
    }

    try {
        window._adminSession = true;
        await window.adminRefresh();
        window.renderApp();
    } catch(e) {
        errDiv.textContent = 'Firebase error: ' + e.message;
        errDiv.style.display = 'block';
    }
};

window.adminRefresh = async () => {
    if (!window._adminSession) return;
    try {
        const licenses = await window.adminGetAllCompanies();
        const stats = await window.adminGetStats(licenses);
        window._adminLicenses = licenses;
        window._adminStats = stats;
        window.renderApp();
    } catch(e) {
        console.error('Admin refresh failed:', e);
    }
};

window.adminAction = async (action, companyId, days) => {
    if (!window._adminSession) return;
    try {
        if (action === 'extend') {
            await window.adminExtendLicense(companyId, days || 30);
        } else if (action === 'suspend') {
            await window.adminSuspendCompany(companyId);
        } else if (action === 'activate') {
            await window.adminActivateCompany(companyId);
        } else if (action === 'delete') {
            if (!confirm('⚠️ PERMANENTLY delete this company and all their data?')) return;
            await window.adminDeleteCompany(companyId);
        }
        alert(`✅ Action "${action}" completed successfully!`);
        await window.adminRefresh();
    } catch(e) {
        alert('❌ Failed: ' + e.message);
    }
};

// Simple Modal System
window.openModal = (title, contentHTML, hideDefaultButtons = false) => {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'active-modal';
    modal.innerHTML = `
        <div class="modal-box">
            <h3 class="modal-title">${title}</h3>
            ${contentHTML}
            ${!hideDefaultButtons ? `
            <div class="form-actions">
                <button class="btn btn-ghost" onclick="window.closeModal()">Cancel</button>
                <button class="btn btn-primary" onclick="window.closeModal()">Save</button>
            </div>
            ` : ''}
        </div>
    `;
    document.body.appendChild(modal);
};

window.closeModal = () => {
    const modal = document.getElementById('active-modal');
    if (modal) modal.remove();
};
