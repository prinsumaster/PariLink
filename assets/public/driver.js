/**
 * PariLink — Driver App & Main Render Engine
 */

// ─── Mobile Bottom Navigation (replaces sidebar on phones) ────────────────────
window.MobileNav = () => {
    const hash = window.location.hash || '#dashboard';
    const role = window.state.user?.role || 'owner';
    if (role === 'driver') return ''; // drivers get their own UI

    const tabs = [
        { name: 'Home', path: '#dashboard', icon: window.Icons.Dashboard },
        { name: 'Trucks', path: '#trucks', icon: window.Icons.Truck },
        { name: 'Loads', path: '#loads', icon: window.Icons.Load },
        { name: 'Fuel', path: '#fuel', icon: window.Icons.Fuel },
        { name: 'More', path: '#more', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>` }
    ];

    // Secondary pages shown in "More" menu
    const moreItems = [
        { name: 'Drivers', path: '#drivers', icon: window.Icons.Users, roles: ['owner', 'operator'] },
        { name: 'Maintenance', path: '#maintenance', icon: window.Icons.Maintenance, roles: ['owner', 'operator'] },
        { name: 'FASTag', path: '#fastag', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`, roles: ['owner', 'operator', 'accountant'] },
        { name: 'Finance', path: '#finance', icon: window.Icons.Finance, roles: ['owner', 'accountant'] },
        { name: 'Tracking', path: '#tracking', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"/></svg>`, roles: ['owner', 'operator'] },
        { name: 'Settings', path: '#settings', icon: window.Icons.Settings || '⚙️', roles: ['owner'] },
    ].filter(item => item.roles.includes(role));

    // Check if current page is one of the "more" items
    const isMoreActive = moreItems.some(m => hash === m.path || hash.startsWith(m.path + '/'));

    return `
        <div class="mobile-more-backdrop" id="more-backdrop" onclick="window.toggleMoreMenu(false)"></div>
        <div class="mobile-more-menu" id="more-menu">
            ${moreItems.map(item => `
                <button class="mobile-more-item" onclick="window.toggleMoreMenu(false); window.navigate('${item.path}')">
                    ${item.icon} ${item.name}
                </button>
            `).join('')}
            <div style="border-top: 1px solid var(--glass-border); margin: 0.25rem 0;"></div>
            <button class="mobile-more-item" style="color: #f87171;" onclick="window.toggleMoreMenu(false); window.logout()">
                ${window.Icons.Logout} Logout
            </button>
        </div>
        <nav class="mobile-nav">
            <div class="mobile-nav-inner">
                ${tabs.map(tab => {
                    const isActive = tab.path === '#more'
                        ? isMoreActive
                        : (hash === tab.path || hash.startsWith(tab.path + '/'));
                    const onClick = tab.path === '#more'
                        ? `window.toggleMoreMenu()`
                        : `window.toggleMoreMenu(false); window.navigate('${tab.path}')`;
                    return `
                        <button class="mobile-nav-btn ${isActive ? 'active' : ''}" onclick="${onClick}">
                            ${tab.icon}
                            <span>${tab.name}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        </nav>
    `;
};

window.toggleMoreMenu = (forceState) => {
    const menu = document.getElementById('more-menu');
    const backdrop = document.getElementById('more-backdrop');
    if (!menu || !backdrop) return;
    const show = typeof forceState === 'boolean' ? forceState : !menu.classList.contains('visible');
    menu.classList.toggle('visible', show);
    backdrop.classList.toggle('visible', show);
};

// ─── Driver App (Mobile View) ────────────────────────────────────────────────
window.DriverApp = () => {
    const driverId = window.state.user?.driverId || 'D1';
    const driver   = window.state.drivers.find(d => d.id === driverId) || window.state.drivers[0];
    const myLoad   = window.state.loads.find(l => l.truckId === (driver?.truckId || ''));
    const myTruck  = window.state.trucks.find(t => t.driverId === driverId);

    const myEarned   = window.state.driverTransactions
        .filter(t => t.driverId === driverId && t.type === 'Credit')
        .reduce((a, c) => a + c.amount, 0);
    const myAdvances = window.state.driverTransactions
        .filter(t => t.driverId === driverId && t.type === 'Advance')
        .reduce((a, c) => a + c.amount, 0);

    return `
        <div class="driver-shell slide-up">
            <div class="driver-header">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div>
                        <p style="color:rgba(255,255,255,0.7); font-size:0.85rem; margin-bottom:0.25rem;">Welcome back,</p>
                        <h1>${driver?.name || window.state.user.name}</h1>
                        <p style="margin-top:0.25rem; opacity:0.8; font-size:0.9rem;">[TRUCK] ${myTruck?.number || 'No truck assigned'}</p>
                    </div>
                    <button onclick="window.logout()" class="btn btn-sm btn-ghost" style="color:white; border-color:rgba(255,255,255,0.3)">Exit</button>
                </div>
            </div>
            
            <div class="driver-content">
                ${myLoad ? `
                <div class="driver-trip-card">
                    <div style="font-size:0.75rem; color:rgba(255,255,255,0.6); margin-bottom:0.5rem; text-transform:uppercase; letter-spacing:0.05em;">Current Trip</div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                        <span style="color:rgba(255,255,255,0.7); font-size:0.85rem;">Client</span>
                        <strong>${myLoad.customer}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:1rem;">
                        <span style="color:rgba(255,255,255,0.7); font-size:0.85rem;">Status</span>
                        <span class="badge blue">${myLoad.status}</span>
                    </div>
                    <button class="driver-status-btn" onclick="
                        window.state.loads.find(l=>l.id==='${myLoad.id}').status='Delivered';
                        window.saveState();
                        alert('[OK] Status updated to DELIVERED!');
                        window.renderApp();
                    ">
                        Mark as Delivered ✓
                    </button>
                </div>
                ` : `
                <div class="driver-trip-card" style="text-align:center; padding:2rem;">
                    <div style="font-size:2rem; margin-bottom:0.5rem;">[FLAG]</div>
                    <p style="color:rgba(255,255,255,0.7);">No active trip assigned.</p>
                    <p style="font-size:0.8rem; color:rgba(255,255,255,0.5); margin-top:0.25rem;">Contact your manager for assignment.</p>
                </div>
                `}

                <div class="driver-actions">
                    <div class="driver-action-btn" style="background: var(--blue-500); border-color: var(--blue-400);" onclick="window.openModal('E-Way Bill', '<div style=\\'text-align:center\\'><div style=\\'font-size:1.5rem; font-weight:700; margin-bottom:1rem;\\'>EWB-8823901</div><img src=\\'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=EWB-8823901\\' style=\\'border-radius:8px;\\'><p style=\\'margin-top:1rem; color:var(--text-secondary); font-size:0.85rem;\\'>Valid till: 28 Apr 2026<br>Vehicle: MH-12-PQ-4567</p></div>')">
                        <div>[DOC]</div>
                        E-Way Bill
                    </div>
                    <div class="driver-action-btn" onclick="window.openModal('Upload POD', '<div class=\\'form-group\\'><label>Proof of Delivery Photo</label><input type=\\'file\\' id=\\'pod-file\\' accept=\\'image/*\\' capture=\\'environment\\'></div><div class=\\'form-actions\\'><button class=\\'btn btn-ghost\\' onclick=\\'window.closeModal()\\'>Cancel</button><button class=\\'btn btn-primary\\' onclick=\\'window.uploadPOD()\\'>Upload to Cloud</button></div>', true)">
                        <div>[DOC]</div>
                        Upload POD
                    </div>
                    <div class="driver-action-btn" onclick="window.openFuelModal()">
                        <div>${window.Icons.Fuel}</div>
                        Log Fuel
                    </div>
                    <div class="driver-action-btn" onclick="window.openMaintenanceModal()">
                        <div>${window.Icons.Maintenance}</div>
                        Breakdown
                    </div>
                </div>

                <div class="driver-trip-card" style="margin-top: 1.5rem; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem;">
                        <h3 style="margin:0; font-size:1rem;">My Earnings & Khata</h3>
                        <span style="font-size: 1.1rem; font-weight: 600;">${(driver?.balance || 0) >= 0 ? '+' : ''}\u20B9${(driver?.balance || 0).toLocaleString()}</span>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; text-align:center;">
                        <div style="background:rgba(255,255,255,0.05); padding:0.75rem; border-radius:8px;">
                            <div style="font-size:0.75rem; color:rgba(255,255,255,0.6)">Earned</div>
                            <div style="font-weight:600; margin-top:0.25rem;">\u20B9${myEarned.toLocaleString()}</div>
                        </div>
                        <div style="background:rgba(255,255,255,0.05); padding:0.75rem; border-radius:8px;">
                            <div style="font-size:0.75rem; color:rgba(255,255,255,0.6)">Advances</div>
                            <div style="font-weight:600; margin-top:0.25rem;">\u20B9${myAdvances.toLocaleString()}</div>
                        </div>
                    </div>
                    <button class="btn btn-sm btn-ghost" style="width:100%; margin-top:0.75rem; justify-content:center;" onclick="window.navigate('#driver-khata/${driverId}')">View Full History →</button>
                </div>
            </div>
        </div>
    `;
};

// POD Upload helper for driver
window.uploadPOD = async () => {
    const file = document.getElementById('pod-file')?.files[0];
    if (!file) { alert('Please select a photo first.'); return; }
    const url = await window.uploadFile(file, `pods/${Date.now()}_${file.name}`);
    window.closeModal();
    alert(url ? '[OK] POD uploaded to cloud successfully!' : '[PHONE] POD saved (will sync when online).');
};

// ─── Main Render Engine ───────────────────────────────────────────────────────
window.renderApp = () => {
    const appDiv = document.getElementById('app');
    if (!appDiv) return;

    const hash = window.location.hash || '#dashboard';

    // ── Super Admin Panel Route ──
    if (hash === '#superadmin') {
        if (window._adminSession) {
            appDiv.innerHTML = window.SuperAdminDashboard();
        } else {
            appDiv.innerHTML = window.SuperAdminLoginPage();
        }
        return;
    }

    // Show login screen if not logged in
    if (!window.state.user) {
        appDiv.innerHTML = window.LoginPage();
        return;
    }

    // ★ SUBSCRIPTION CHECK — Block access if expired or suspended
    const sub = window.state.subscription;
    if (sub && !sub.allowed) {
        appDiv.innerHTML = window.SubscriptionExpiredPage();
        return;
    }

    // ── Driver View ──
    if (window.state.user.role === 'driver') {
        if (hash.startsWith('#driver-khata/')) {
            const id = hash.split('/')[1];
            appDiv.innerHTML = `
                <div class="driver-shell slide-up" style="background:var(--bg-main); padding-top:1rem;">
                    <main id="main-content-area" style="max-width:800px; margin:0 auto; padding:1rem; padding-bottom: 5rem;"></main>
                </div>
            `;
            window.DriverKhataPage(id);
            return;
        }
        appDiv.innerHTML = window.DriverApp();
        return;
    }

    // ── Office View (Owner / Operator / Accountant) ──

    // Dynamic sub-routes that need an empty shell first
    if (hash.startsWith('#truck-summary/')) {
        const truckId = hash.split('/')[1];
        appDiv.innerHTML = `
            <div class="app-shell">
                ${window.Sidebar()}
                <main class="main-area" id="main-content-area"></main>
            </div>
            ${window.MobileNav()}
        `;
        // Populate after DOM is ready
        const area = document.getElementById('main-content-area');
        if (area) area.innerHTML = window._buildTruckSummary(truckId);
        return;
    }

    if (hash.startsWith('#driver-khata/')) {
        const id = hash.split('/')[1];
        appDiv.innerHTML = `
            <div class="app-shell">
                ${window.Sidebar()}
                <main class="main-area" id="main-content-area"></main>
            </div>
            ${window.MobileNav()}
        `;
        window.DriverKhataPage(id);
        return;
    }

    // Standard page routing
    let pageHtml = '';
    switch (hash) {
        case '#tracking':    pageHtml = window.TrackingPage();    break;
        case '#fastag':      pageHtml = window.FastagPage();      break;
        case '#trucks':      pageHtml = window.TruckPage();       break;
        case '#drivers':     pageHtml = window.DriverPage();      break;
        case '#loads':       pageHtml = window.LoadPage();        break;
        case '#fuel':        pageHtml = window.FuelPage();        break;
        case '#maintenance': pageHtml = window.MaintenancePage(); break;
        case '#finance':     pageHtml = window.FinancePage();     break;
        case '#settings':    pageHtml = window.SettingsPage();    break;
        case '#dashboard':
        default:             pageHtml = window.DashboardPage();   break;
    }

    appDiv.innerHTML = `
        <div class="app-shell">
            ${window.Sidebar()}
            <main class="main-area">
                ${pageHtml}
            </main>
        </div>
        ${window.MobileNav()}
    `;
};

// Initial boot — runs after all scripts are loaded
window.renderApp();
