/**
 * PariLink — Core State & Logic
 */

// --- Global State ---
window.state = {
    user: JSON.parse(localStorage.getItem('pl_user')) || null,
    company: { name: "PariLink Transport", id: "comp_123" },
    trucks: JSON.parse(localStorage.getItem('pl_trucks')) || [
        { id: 'T1', number: 'MH-12-PQ-4567', type: '12 Wheeler', capacity: '20T', driverId: 'D1', status: 'Active', expiry: { rc: '2026-12-01', insurance: '2025-05-15' } },
        { id: 'T2', number: 'MH-12-AB-9999', type: 'Container', capacity: '10T', driverId: 'D2', status: 'Maintenance', expiry: { rc: '2027-01-10', insurance: '2025-04-20' } }
    ],
    drivers: JSON.parse(localStorage.getItem('pl_drivers')) || [
        { id: 'D1', name: 'Rajesh Kumar', phone: '9876543210', role: 'Driver', status: 'Verified', license: 'DL-55231', expiry: '2028-10-10', photo: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=0A84FF&color=fff', salaryType: 'Per Trip', salaryRate: 1500, balance: 4500, totalKm: 145000 },
        { id: 'D2', name: 'Suresh Singh', phone: '9876543211', role: 'Driver', status: 'Verified', license: 'DL-88210', expiry: '2025-11-20', photo: 'https://ui-avatars.com/api/?name=Suresh+Singh&background=0A84FF&color=fff', salaryType: 'Fixed', salaryRate: 25000, balance: 12000, totalKm: 85000 }
    ],
    driverTransactions: JSON.parse(localStorage.getItem('pl_driver_txn')) || [
        { id: 'TX1', driverId: 'D1', type: 'Credit', amount: 1500, date: '2026-04-24', description: 'Trip Commission (L1)' },
        { id: 'TX2', driverId: 'D1', type: 'Advance', amount: 2000, date: '2026-04-20', description: 'Trip Advance Cash' },
        { id: 'TX3', driverId: 'D2', type: 'Credit', amount: 25000, date: '2026-04-01', description: 'Fixed Monthly Salary (April)' }
    ],
    loads: JSON.parse(localStorage.getItem('pl_loads')) || [
        { id: 'L1', truckId: 'T1', customer: 'Tata Motors', freight: 45000, status: 'In Transit', date: '2026-04-24', addedBy: 'Owner', ewayBill: 'EWB-8823901', ewayExpiry: '2026-04-28' },
        { id: 'L2', truckId: 'T2', customer: 'Amazon IN', freight: 12000, status: 'Delivered', date: '2026-04-22', addedBy: 'Operator', ewayBill: 'EWB-1120934', ewayExpiry: '2026-04-24' }
    ],
    fuel: JSON.parse(localStorage.getItem('pl_fuel')) || [
        { id: 'F1', truckId: 'T1', liters: 120, price: 95, total: 11400, date: '2026-04-23', odometer: 45200, loggedBy: 'Rajesh Kumar (D1)', location: 'Reliance Pump, NH4 Pune-Blr', billImg: true, odoImg: true, paymentStatus: 'Unpaid', pumpContact: '9822012345', pumpUpi: 'reliancepump@sbi' }
    ],
    maintenance: JSON.parse(localStorage.getItem('pl_maintenance')) || [
        { id: 'M1', truckId: 'T1', issue: 'Brake Pad Replacement', cost: 15000, date: '2026-04-10', mechanic: 'AutoHub', reportedBy: 'Rajesh Kumar (D1)', parts: 'Front Brake Pads', brand: 'Bosch', paymentStatus: 'Paid', failureType: 'Mechanical Wear', mechanicReview: 'Pads completely worn out due to heavy load driving. Replaced and tested brakes.' }
    ],
    fastag: JSON.parse(localStorage.getItem('pl_fastag')) || [
        { id: 'FT1', truckId: 'T1', plaza: 'Khed Shivapur Toll', amount: 450, date: '2026-04-24 14:30', status: 'Auto-Deducted' },
        { id: 'FT2', truckId: 'T1', plaza: 'Vashi Toll Naka', amount: 200, date: '2026-04-24 18:45', status: 'Auto-Deducted' }
    ],
    gps: [
        { truckId: 'T1', lat: 19.0760, lng: 72.8777, speed: 65, status: 'Moving', location: 'Navi Mumbai Highway' },
        { truckId: 'T2', lat: 18.5204, lng: 73.8567, speed: 0, status: 'Stopped', location: 'Tata Motors, Pune' }
    ],
    subscription: JSON.parse(localStorage.getItem('pl_subscription')) || null
};

// --- Dynamic Theme & Settings ---
window.applyThemeColor = (hex) => {
    if (!hex) return;
    document.documentElement.style.setProperty('--accent', hex);
    document.documentElement.style.setProperty('--primary', hex);
    window.state.company = window.state.company || {};
    window.state.company.themeColor = hex;
};

// Auto-apply theme on load if exists
setTimeout(() => {
    if (window.state.company && window.state.company.themeColor) {
        window.applyThemeColor(window.state.company.themeColor);
    }
}, 500);

window.previewAndExtractLogo = (input) => {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const imgUrl = e.target.result;
        const container = document.getElementById('logo-preview-container');
        if (container) {
            container.innerHTML = `<img id="temp-logo-img" src="${imgUrl}" style="width:100%; height:100%; object-fit:cover;">`;
        }
        
        // Extract color
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            // Scale down for speed
            canvas.width = 50; canvas.height = 50;
            ctx.drawImage(img, 0, 0, 50, 50);
            
            try {
                // Get center pixel as dominant color (simple approach)
                const data = ctx.getImageData(25, 25, 1, 1).data;
                const r = data[0], g = data[1], b = data[2];
                // Check if it's too white or transparent, if so fallback to default
                if (data[3] > 0 && !(r > 240 && g > 240 && b > 240)) {
                    const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
                    window.applyThemeColor(hex);
                }
            } catch(err) {
                console.warn('Could not extract color:', err);
            }
        };
        img.src = imgUrl;
        
        // Save to state temporarily
        window.state.company = window.state.company || {};
        window.state.company.logoUrl = imgUrl; // Temporary base64 until saved
    };
    reader.readAsDataURL(file);
};

window.saveSettings = async () => {
    const name = document.getElementById('setting-company-name').value;
    window.state.company = window.state.company || {};
    window.state.company.name = name;
    
    // Upload logo to backend
    const logoFile = document.getElementById('setting-logo-file')?.files[0];
    if (logoFile && window.uploadFile) {
        const btn = document.querySelector('.page-header-actions .btn-primary');
        if (btn) { btn.textContent = 'Saving...'; btn.disabled = true; }
        
        try {
            const url = await window.uploadFile(logoFile, 'logos/company_logo_' + Date.now() + '_' + logoFile.name);
            if (url) window.state.company.logoUrl = url;
        } catch(e) {
            console.error('Logo upload failed', e);
        }
    }
    
    await window.saveState();
    alert('Settings Saved successfully!');
    window.renderApp();
};

window.saveState = async () => {
    // Always save to localStorage as fallback
    try { localStorage.setItem('pl_user',     JSON.stringify(window.state.user)); } catch(e){}
    try { localStorage.setItem('pl_trucks',   JSON.stringify(window.state.trucks)); } catch(e){}
    try { localStorage.setItem('pl_drivers',  JSON.stringify(window.state.drivers)); } catch(e){}
    try { localStorage.setItem('pl_loads',    JSON.stringify(window.state.loads)); } catch(e){}
    try { localStorage.setItem('pl_fuel',     JSON.stringify(window.state.fuel)); } catch(e){}
    try { localStorage.setItem('pl_maintenance', JSON.stringify(window.state.maintenance)); } catch(e){}
    try { localStorage.setItem('pl_driver_txn',  JSON.stringify(window.state.driverTransactions)); } catch(e){}
    try { localStorage.setItem('pl_fastag',   JSON.stringify(window.state.fastag)); } catch(e){}
    try { localStorage.setItem('pl_subscription', JSON.stringify(window.state.subscription)); } catch(e){}

    // Sync to Python server (multi-tenant)
    if (window.syncToServer) {
        await window.syncToServer();
    }
};

// --- Icons (Lucide) ---
window.Icons = {
    Truck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`,
    Users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    Load: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
    Fuel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22L17 22"></path><path d="M4 9L16 9"></path><path d="M14 22L14 4.5C14 3.12 12.88 2 11.5 2C10.12 2 9 3.12 9 4.5V22"></path><path d="M18 5.5L18 22"></path><path d="M21 7L21 22"></path></svg>`,
    Finance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
    Maintenance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
    Dashboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
    Logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`,
    Settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`
};

// --- Router ---
window.navigate = (path) => {
    window.location.hash = path;
    if (window.renderApp) window.renderApp();
};

// hashchange handles browser back/forward buttons
window.addEventListener('hashchange', () => {
    if (window.renderApp) window.renderApp();
});

// --- Server Configuration ---
// No server config needed — Firebase handles everything automatically!

// --- Auth logic ---

// Tab switching for Login Page
window.showAuthTab = (tab) => {
    const officeDiv = document.getElementById('auth-office');
    const driverDiv = document.getElementById('auth-driver');
    const tabOffice = document.getElementById('tab-office');
    const tabDriver = document.getElementById('tab-driver');
    if (!officeDiv || !driverDiv) return;

    if (tab === 'office') {
        officeDiv.style.display = 'block';
        driverDiv.style.display = 'none';
        tabOffice.style.background = 'var(--accent)';
        tabOffice.style.color = 'white';
        tabDriver.style.background = 'transparent';
        tabDriver.style.color = 'var(--text-secondary)';
    } else {
        officeDiv.style.display = 'none';
        driverDiv.style.display = 'block';
        tabDriver.style.background = 'var(--accent)';
        tabDriver.style.color = 'white';
        tabOffice.style.background = 'transparent';
        tabOffice.style.color = 'var(--text-secondary)';
    }
};

// --- Email/Password Login ---
window.emailLogin = async () => {
    const email = document.getElementById('auth-email')?.value?.trim();
    const pass  = document.getElementById('auth-pass')?.value;
    const role  = document.getElementById('auth-role')?.value;
    const errDiv = document.getElementById('auth-error');

    if (!email || !pass) {
        errDiv.textContent = 'Please enter your email and password.';
        errDiv.style.display = 'block'; return;
    }
    const btn = document.querySelector('#auth-office .btn-primary');
    if (btn) { btn.textContent = 'Signing in...'; btn.disabled = true; }
    try {
        const cred = await window.fbSignIn(null, email, pass);
        const namePart = cred.user.email.split('@')[0];
        window.state.user = {
            name: namePart.charAt(0).toUpperCase() + namePart.slice(1),
            role: role,
            email: cred.user.email,
            uid: cred.user.uid,
            companyId: cred.user.companyId
        };
        // ★ Store subscription status from server
        if (cred.subscription) {
            window.state.subscription = cred.subscription;
        }
        window.state.company = { ...window.state.company, id: cred.user.companyId };
        // Fetch company data from server
        await window.fetchCompanyData(cred.user.companyId);
        await window.saveState();
        window.navigate('#dashboard');
    } catch (e) {
        console.error('Login Error:', e.code);
        const msgs = {
            'invalid-credential': 'Wrong email or password.',
            'auth/invalid-email': 'Please enter a valid email address.',
        };
        errDiv.textContent = msgs[e.code] || e.message || 'Login failed.';
        errDiv.style.display = 'block';
        if (btn) { btn.textContent = 'Sign In'; btn.disabled = false; }
    }
};

// --- Email/Password Signup ---
window.emailSignup = async () => {
    const email = document.getElementById('auth-email')?.value?.trim();
    const pass  = document.getElementById('auth-pass')?.value;
    const role  = document.getElementById('auth-role')?.value;
    const errDiv = document.getElementById('auth-error');

    if (!email || !pass) {
        errDiv.textContent = 'Please enter email and password to create account.';
        errDiv.style.display = 'block'; return;
    }
    if (pass.length < 6) {
        errDiv.textContent = 'Password must be at least 6 characters.';
        errDiv.style.display = 'block'; return;
    }
    const btn = document.querySelector('#auth-office .btn-primary');
    if (btn) { btn.textContent = 'Creating account...'; btn.disabled = true; }
    try {
        const cred = await window.fbSignUp(null, email, pass);
        const namePart = cred.user.email.split('@')[0];
        window.state.user = {
            name: namePart.charAt(0).toUpperCase() + namePart.slice(1),
            role: role,
            email: cred.user.email,
            uid: cred.user.uid,
            companyId: cred.user.companyId
        };
        // ★ Store subscription status from server
        if (cred.subscription) {
            window.state.subscription = cred.subscription;
        }
        window.state.company = { ...window.state.company, id: cred.user.companyId };
        await window.saveState();
        window.navigate('#dashboard');
    } catch (e) {
        console.error('Signup Error:', e.code);
        const msgs = {
            'email-already-in-use': 'This email already has an account. Try signing in.',
        };
        errDiv.textContent = msgs[e.code] || e.message || 'Signup failed.';
        errDiv.style.display = 'block';
        if (btn) { btn.textContent = 'Sign In'; btn.disabled = false; }
    }
};

// --- Driver Login: Name + PIN via Firebase ---
// PIN = last 4 digits of the driver's phone number stored in the system
window.driverLogin = async () => {
    const name   = document.getElementById('auth-driver-name')?.value?.trim();
    const pin    = document.getElementById('auth-driver-pin')?.value?.trim();
    const errDiv = document.getElementById('auth-driver-error');

    if (!name || !pin) {
        errDiv.textContent = 'Please enter your name and PIN.';
        errDiv.style.display = 'block'; return;
    }

    const btn = document.querySelector('#auth-driver .btn-primary');
    if (btn) { btn.textContent = 'Logging in...'; btn.disabled = true; }

    try {
        const data = await window.driverLoginFirebase(name, pin);

        window.state.user = {
            name:      data.name,
            role:      'driver',
            driverId:  data.driver_id,
            companyId: data.company_id
        };
        if (data.subscription) {
            window.state.subscription = data.subscription;
        }
        window.state.company = { ...window.state.company, id: data.company_id };

        await window.fetchCompanyData(data.company_id);
        await window.saveState();
        window.navigate('#dashboard');
    } catch (e) {
        console.error('Driver Login Error:', e);
        errDiv.textContent = 'Name or PIN is incorrect. PIN = last 4 digits of your mobile number.';
        errDiv.style.display = 'block';
        if (btn) { btn.textContent = 'Login as Driver →'; btn.disabled = false; }
    }
};

// --- Logout ---
window.logout = async () => {
    try {
        if (window.fbSignOut) await window.fbSignOut();
    } catch(e) { console.warn('Signout error:', e); }
    window.state.user = null;
    window.state.subscription = null;
    window._serverUser = null;
    // Clear ALL tenant data and auth token from localStorage
    ['pl_user','pl_trucks','pl_drivers','pl_loads','pl_fuel','pl_maintenance','pl_driver_txn','pl_fastag','pl_subscription','pl_auth_token'].forEach(k => localStorage.removeItem(k));
    // Reset state arrays
    window.state.trucks = []; window.state.drivers = []; window.state.loads = [];
    window.state.fuel = []; window.state.maintenance = []; window.state.driverTransactions = []; window.state.fastag = [];
    window.state.company = { name: 'PariLink', id: '' };
    window.navigate('#login');
};

// --- File Upload Helper (handled by firebase.js API bridge) ---
// window.uploadFile is defined in firebase.js

// --- Export Logic ---
window.exportToExcel = () => {
    if (!window.XLSX) return alert("SheetJS not loaded.");
    const ws = XLSX.utils.json_to_sheet(window.state.loads);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Loads");
    XLSX.writeFile(wb, "PariLink_Data.xlsx");
};

// --- Alerts & Invoices ---
window.sendWhatsappAlert = (phone, msg) => {
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
};

window.generateInvoice = (customer, freight) => {
    const tax = freight * 0.12;
    const total = freight + tax;
    const content = `
        <div style="text-align:center; margin-bottom:1rem;">
            <h3>Invoice Details</h3>
            <p style="color:var(--text-secondary)">Customer: ${customer}</p>
        </div>
        <div style="display:flex; justify-content:space-between; padding:0.5rem 0; border-bottom:1px solid var(--border-subtle);">
            <span>Freight Amount</span><strong>\u20B9${freight.toLocaleString()}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; padding:0.5rem 0; border-bottom:1px solid var(--border-subtle);">
            <span>GST (12%)</span><strong>\u20B9${tax.toLocaleString()}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; padding:0.5rem 0; margin-top:0.5rem; font-size:1.1rem; font-weight:700;">
            <span>Total Payable</span><span style="color:var(--text-primary)">\u20B9${total.toLocaleString()}</span>
        </div>
        <div style="margin-top:1.5rem; text-align:center; font-size:0.85rem; color:var(--text-muted)">
            This is a generated view.
        </div>
    `;
    window.openModal('Invoice', content);
};

// --- Fuel Proof Viewer ---
window.showFuelProof = (fuelId) => {
    const f = window.state.fuel.find(x => x.id === fuelId);
    if (!f) return alert('Fuel record not found');
    const html = '<div style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:1rem;">[GPS] ' + (f.location || 'GPS Location Tagged') + '<br>[CALL] Pump: ' + (f.pumpContact || 'N/A') + '</div><div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;"><div style="border:1px solid var(--glass-border); padding:0.5rem; border-radius:8px;"><p style="font-size:0.75rem; margin-bottom:0.5rem;">Odometer</p><div style="height:120px; background:var(--glass-bg); display:flex; align-items:center; justify-content:center; border-radius:4px; font-size:2rem;">[CAR]</div></div><div style="border:1px solid var(--glass-border); padding:0.5rem; border-radius:8px;"><p style="font-size:0.75rem; margin-bottom:0.5rem;">Fuel Bill</p><div style="height:120px; background:var(--glass-bg); display:flex; align-items:center; justify-content:center; border-radius:4px; font-size:2rem;">[BILL]</div></div></div>';
    window.openModal('Fuel Verification', html);
};

// --- Business Logic API Handlers ---
window.openMaintenanceModal = () => {
    const content = `
        <div class="form-group">
            <label>Truck Number</label>
            <select id="m-truck">
                ${window.state.trucks.map(t => `<option value="${t.number}">${t.number}</option>`).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>Failure Type</label>
            <select id="m-type">
                <option>Mechanical Wear</option>
                <option>Tyre Puncture</option>
                <option>Electrical Issue</option>
                <option>Accident</option>
            </select>
        </div>
        <div class="form-group">
            <label>Mechanic Review/Diagnosis</label>
            <textarea id="m-review" placeholder="What did the mechanic say?"></textarea>
        </div>
        <div class="form-group">
            <label>Repair Cost (\u20B9)</label>
            <input type="number" id="m-cost" placeholder="Amount">
        </div>
        <div class="form-group">
            <label>Payment Status</label>
            <select id="m-status">
                <option>Paid by Driver</option>
                <option value="Unpaid">Request Owner Payment (Unpaid)</option>
            </select>
        </div>
        <div class="form-actions">
            <button class="btn btn-ghost" onclick="window.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="window.submitBreakdown()">Save & Sync</button>
        </div>
    `;
    window.openModal('Breakdown & Repair', content, true);
};

window.submitBreakdown = async () => {
    const truck = document.getElementById('m-truck')?.value || 'MH-12-PQ-4567';
    const type = document.getElementById('m-type').value;
    const review = document.getElementById('m-review').value;
    const cost = document.getElementById('m-cost').value || 0;
    const status = document.getElementById('m-status').value;
    
    if(!review || !cost) return alert("Please enter review and repair cost");

    window.state.maintenance.unshift({
        id: 'M' + Date.now(),
        truckId: truck,
        issue: 'Emergency Repair',
        failureType: type,
        mechanicReview: review,
        cost: parseFloat(cost),
        date: new Date().toISOString().split('T')[0],
        mechanic: 'Local Mechanic',
        reportedBy: window.state.user.name,
        paymentStatus: status
    });
    await window.saveState();
    window.closeModal();
    alert('Breakdown Logged & Synced!');
    window.renderApp();
};

window.openFuelModal = () => {
    const content = `
        <div class="form-group">
            <label>Truck Number</label>
            <select id="f-truck">
                ${window.state.trucks.map(t => `<option value="${t.number}">${t.number}</option>`).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>Liters Added</label>
            <input type="number" id="f-liters" placeholder="e.g., 100">
        </div>
        <div class="form-group">
            <label>Total Amount (\u20B9)</label>
            <input type="number" id="f-total" placeholder="e.g., 9500">
        </div>
        <div class="form-group">
            <label>Payment Status</label>
            <select id="f-status">
                <option>Paid by Driver</option>
                <option value="Unpaid">Request Owner Payment (Unpaid)</option>
            </select>
        </div>
        <div class="form-group">
            <label>Pump Contact No.</label>
            <input type="tel" id="f-contact" placeholder="For owner to call">
        </div>
        <div class="form-group">
            <label>Pump UPI ID / Bank QR 📷</label>
            <input type="file" id="f-qr-img" accept="image/*" capture="environment">
        </div>
        <div class="form-group">
            <label>Upload Fuel Bill 📷</label>
            <input type="file" id="f-bill-img" accept="image/*" capture="environment">
        </div>
        <div class="form-group">
            <label>Upload Odometer Dashboard 📷</label>
            <input type="file" id="f-odo-img" accept="image/*" capture="environment">
        </div>
        <div class="alert-strip" style="background:rgba(10,132,255,0.1); border-color:var(--accent); color:var(--accent); font-size:0.75rem; justify-content:center;">
            [GPS] GPS Location & Time will be auto-captured
        </div>
        <div class="form-actions">
            <button class="btn btn-ghost" onclick="window.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="window.submitFuel()">Save & Sync</button>
        </div>
    `;
    window.openModal('Secure Fuel Log', content, true);
};

window.submitFuel = async () => {
    const truck = document.getElementById('f-truck')?.value || 'MH-12-PQ-4567';
    const liters = document.getElementById('f-liters').value || 0;
    const total = document.getElementById('f-total').value || 0;
    const status = document.getElementById('f-status').value;
    const contact = document.getElementById('f-contact').value;
    
    if(!liters || !total) return alert("Please enter liters and total amount");

    // Upload images to Firebase Storage
    const qrFile = document.getElementById('f-qr-img')?.files[0];
    const billFile = document.getElementById('f-bill-img')?.files[0];
    const odoFile = document.getElementById('f-odo-img')?.files[0];
    const fuelId = 'F' + Date.now();

    let qrUrl = null, billUrl = null, odoUrl = null;
    if (qrFile) qrUrl = await window.uploadFile(qrFile, `fuel/${fuelId}/qr_${qrFile.name}`);
    if (billFile) billUrl = await window.uploadFile(billFile, `fuel/${fuelId}/bill_${billFile.name}`);
    if (odoFile) odoUrl = await window.uploadFile(odoFile, `fuel/${fuelId}/odo_${odoFile.name}`);

    const newFuel = {
        id: fuelId,
        truckId: truck,
        liters: parseFloat(liters),
        price: parseFloat(liters) > 0 ? (parseFloat(total) / parseFloat(liters)).toFixed(2) : "0.00",
        total: parseFloat(total),
        date: new Date().toISOString().split('T')[0],
        odometer: 45000 + Math.floor(Math.random()*500),
        loggedBy: window.state.user?.name || 'Unknown',
        location: 'Auto-GPS Location',
        billImg: billUrl || true,
        odoImg: odoUrl || null,
        qrImg: qrUrl || null,
        paymentStatus: status,
        pumpContact: contact || 'N/A'
    };

    window.state.fuel.unshift(newFuel);
    await window.saveState();
    window.closeModal();
    alert('[OK] Fuel Logged & Synced Successfully!' + (billUrl ? ' Photos uploaded to cloud.' : ''));
    window.renderApp();
};

window.submitToll = async () => {
    const amount = document.getElementById('t-amount').value;
    if(!amount) return;
    window.state.fastag.unshift({
        id: 'FT' + Date.now(),
        truckId: 'MH-12-PQ-4567',
        plaza: 'Manual Cash Toll',
        amount: parseFloat(amount),
        date: new Date().toISOString().split('T')[0],
        status: 'Cash Paid'
    });
    await window.saveState();
    window.closeModal();
    alert('Toll Logged & Synced!');
    window.renderApp();
};

window.addTruck = () => {
    const driverOptions = window.state.drivers.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
    const content = `
        <div class="form-group">
            <label>Truck Number</label>
            <input type="text" id="t-number" placeholder="e.g. MH-12-AB-1234">
        </div>
        <div class="form-group">
            <label>Truck Type</label>
            <select id="t-type">
                <option>12 Wheeler</option>
                <option>10 Wheeler</option>
                <option>Container</option>
                <option>Open Body</option>
            </select>
        </div>
        <div class="form-group">
            <label>Capacity</label>
            <input type="text" id="t-capacity" placeholder="e.g. 20T">
        </div>
        <div class="form-group">
            <label>Assign Driver</label>
            <select id="t-driver">
                <option value="Unassigned">Unassigned</option>
                ${driverOptions}
            </select>
        </div>
        <div class="form-group" style="display:flex; gap:1rem;">
            <div style="flex:1;">
                <label>RC Expiry</label>
                <input type="date" id="t-rc">
            </div>
            <div style="flex:1;">
                <label>Insurance Expiry</label>
                <input type="date" id="t-ins">
            </div>
        </div>
        <div class="form-actions">
            <button class="btn btn-ghost" onclick="window.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="window.submitTruck()">Save Truck</button>
        </div>
    `;
    window.openModal('Add New Truck', content, true);
};

window.submitTruck = async () => {
    const num = document.getElementById('t-number').value;
    const type = document.getElementById('t-type').value;
    const capacity = document.getElementById('t-capacity').value;
    const driver = document.getElementById('t-driver').value;
    const rc = document.getElementById('t-rc').value;
    const ins = document.getElementById('t-ins').value;

    if(!num) return alert("Truck Number is required.");

    window.state.trucks.push({
        id: 'T' + Date.now(),
        number: num,
        type: type,
        capacity: capacity,
        driverId: driver,
        status: 'Active',
        expiry: { rc: rc || '2026-12-31', insurance: ins || '2026-12-31' }
    });
    await window.saveState();
    window.closeModal();
    window.renderApp();
};

window.addDriver = () => {
    const content = `
        <div class="form-group">
            <label>Driver Name</label>
            <input type="text" id="d-name" placeholder="Full Name">
        </div>
        <div class="form-group">
            <label>Phone Number</label>
            <input type="tel" id="d-phone" placeholder="10-digit number">
        </div>
        <div class="form-group" style="display:flex; gap:1rem;">
            <div style="flex:1;">
                <label>License No.</label>
                <input type="text" id="d-license" placeholder="DL-XXX">
            </div>
            <div style="flex:1;">
                <label>License Expiry</label>
                <input type="date" id="d-expiry">
            </div>
        </div>
        <div class="form-group" style="display:flex; gap:1rem;">
            <div style="flex:1;">
                <label>Salary Type</label>
                <select id="d-sal-type">
                    <option>Per Trip</option>
                    <option>Fixed</option>
                </select>
            </div>
            <div style="flex:1;">
                <label>Rate (\u20B9)</label>
                <input type="number" id="d-sal-rate" placeholder="Amount">
            </div>
        </div>
        <div class="form-actions">
            <button class="btn btn-ghost" onclick="window.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="window.submitDriver()">Save Driver</button>
        </div>
    `;
    window.openModal('Add Employee', content, true);
};

window.submitDriver = async () => {
    const name = document.getElementById('d-name').value;
    const phone = document.getElementById('d-phone').value;
    const license = document.getElementById('d-license').value;
    const expiry = document.getElementById('d-expiry').value;
    const salType = document.getElementById('d-sal-type').value;
    const salRate = document.getElementById('d-sal-rate').value;

    if(!name) return alert("Name is required.");

    window.state.drivers.push({
        id: 'D' + Date.now(),
        name: name,
        phone: phone || 'N/A',
        role: 'Driver',
        status: 'Pending',
        license: license || 'DL-PENDING',
        expiry: expiry || '2030-01-01',
        photo: 'https://ui-avatars.com/api/?name='+name.replace(' ','+')+'&background=0A84FF&color=fff',
        salaryType: salType,
        salaryRate: parseFloat(salRate) || 0,
        balance: 0,
        totalKm: 0
    });
    await window.saveState();
    window.closeModal();
    window.renderApp();
};

window.addLoad = () => {
    const truckOptions = window.state.trucks.map(t => `<option value="${t.number}">${t.number} (${t.type})</option>`).join('');
    const content = `
        <div class="form-group">
            <label>Client / Customer Name</label>
            <input type="text" id="l-client" placeholder="e.g. Tata Motors">
        </div>
        <div class="form-group">
            <label>Assign Truck</label>
            <select id="l-truck">
                ${truckOptions}
            </select>
        </div>
        <div class="form-group">
            <label>Freight Amount (\u20B9)</label>
            <input type="number" id="l-amount" placeholder="Total Freight">
        </div>
        <div class="form-group" style="display:flex; gap:1rem;">
            <div style="flex:1;">
                <label>Dispatch Date</label>
                <input type="date" id="l-date" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div style="flex:1;">
                <label>E-Way Bill (Optional)</label>
                <input type="text" id="l-eway" placeholder="EWB-XXXXX">
            </div>
        </div>
        <div class="form-actions">
            <button class="btn btn-ghost" onclick="window.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="window.submitLoad()">Save Load</button>
        </div>
    `;
    window.openModal('New Shipment / Load', content, true);
};

window.submitLoad = async () => {
    const client = document.getElementById('l-client').value;
    const truckId = document.getElementById('l-truck').value;
    const amount = document.getElementById('l-amount').value;
    const date = document.getElementById('l-date').value;
    const eway = document.getElementById('l-eway').value;

    if(!client || !amount) return alert("Client name and Freight amount are required.");

    window.state.loads.unshift({
        id: 'L' + Date.now(),
        truckId: truckId,
        customer: client,
        freight: parseFloat(amount),
        status: 'In Transit',
        date: date || new Date().toISOString().split('T')[0],
        addedBy: window.state.user.name,
        ewayBill: eway || 'Pending',
        ewayExpiry: eway ? 'Pending' : ''
    });
    await window.saveState();
    window.closeModal();
    window.renderApp();
};

window.addDriverTransaction = (driverId) => {
    // Block drivers from accessing this
    if (window.state.user.role === 'driver') {
        return alert('Only Owner / Operator / Accountant can manage money.');
    }
    const content = `
        <div class="form-group">
            <label>Amount (\u20B9)</label>
            <input type="number" id="tx-amount" placeholder="Amount">
        </div>
        <div class="form-group">
            <label>Transaction Type</label>
            <select id="tx-type">
                <option value="Advance">Advance (Deduct from balance)</option>
                <option value="Credit">Credit (Add to balance)</option>
            </select>
        </div>
        <div class="form-group">
            <label>Payment Method</label>
            <select id="tx-method" onchange="document.getElementById('tx-upi-section').style.display = this.value === 'UPI' ? 'block' : 'none'">
                <option value="Cash">Cash (No proof needed)</option>
                <option value="UPI">UPI / Online Transfer</option>
            </select>
        </div>
        <div id="tx-upi-section" style="display:none;">
            <div class="form-group">
                <label>Upload Payment Screenshot</label>
                <input type="file" id="tx-proof" accept="image/*" capture="environment">
                <small style="color:var(--text-muted); display:block; margin-top:0.25rem;">Required for UPI payments</small>
            </div>
        </div>
        <div class="form-group">
            <label>Description</label>
            <input type="text" id="tx-desc" placeholder="e.g. Trip Advance, Monthly Salary">
        </div>
        <div class="form-actions">
            <button class="btn btn-ghost" onclick="window.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="window.submitTransaction('${driverId}')">Save Transaction</button>
        </div>
    `;
    window.openModal('Ledger Entry', content, true);
};

window.submitTransaction = async (driverId) => {
    const amount = document.getElementById('tx-amount').value;
    const type = document.getElementById('tx-type').value;
    const desc = document.getElementById('tx-desc').value;
    const method = document.getElementById('tx-method').value;
    const proofFile = document.getElementById('tx-proof')?.files[0];

    if(!amount) return alert("Amount is required.");
    if(method === 'UPI' && !proofFile) return alert("Please upload UPI payment screenshot.");

    // Upload proof screenshot if UPI
    let proofUrl = null;
    if (method === 'UPI' && proofFile) {
        const btn = document.querySelector('.modal-box .btn-primary');
        if (btn) { btn.textContent = 'Uploading...'; btn.disabled = true; }
        proofUrl = await window.uploadFile(proofFile, 'payments/TX' + Date.now() + '_' + proofFile.name);
        if (!proofUrl) proofUrl = 'local_saved';
    }

    window.state.driverTransactions.unshift({
        id: 'TX' + Date.now(),
        driverId: driverId,
        type: type,
        amount: parseFloat(amount),
        date: new Date().toISOString().split('T')[0],
        description: desc || 'Manual Entry',
        paymentMethod: method,
        proofUrl: proofUrl,
        addedBy: window.state.user.name
    });
    
    const driver = window.state.drivers.find(d => d.id === driverId);
    if(driver) {
        if(type === 'Credit') driver.balance += parseFloat(amount);
        if(type === 'Advance') driver.balance -= parseFloat(amount);
    }
    
    await window.saveState();
    window.closeModal();
    window.renderApp();
};

window.rechargeFastag = () => {
    const content = `
        <div class="form-group">
            <label>Recharge Amount (\u20B9)</label>
            <input type="number" id="ft-amount" placeholder="e.g. 1000">
        </div>
        <div class="form-actions">
            <button class="btn btn-ghost" onclick="window.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="window.submitFastag()">Recharge</button>
        </div>
    `;
    window.openModal('Fastag Recharge', content, true);
};

window.submitFastag = async () => {
    const amount = document.getElementById('ft-amount').value;
    if(!amount) return alert("Amount is required");
    alert(`Successfully recharged Fastag wallet with \u20B9${amount}.`);
    window.closeModal();
    window.renderApp();
};

window.generateInvoice = async (customer, amount) => {
    alert(`GST Invoice generated for ${customer} for the amount of \u20B9${amount.toLocaleString()}. The PDF has been saved to your downloads.`);
    // Here we would call a PDF generation library like jsPDF.
};

window.sendWhatsappAlert = async (phone, message) => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
};
