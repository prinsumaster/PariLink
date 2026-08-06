/**
 * PariLink — Firebase Cloud Backend
 * Zero server needed. Works from any device, anywhere.
 * Auth: Firebase Authentication
 * Database: Cloud Firestore (multi-tenant isolated)
 * Storage: Firebase Storage (logos, photos)
 */

// ═══════════════════════════════════════════════════════════════════════════════
// FIREBASE CONFIG — Replace with YOUR Firebase project credentials
// Go to: Firebase Console → Project Settings → Your Apps → Config
// ═══════════════════════════════════════════════════════════════════════════════

const firebaseConfig = {
    apiKey: "AIzaSyAYrZqP8cVCpQDvD2kmiOD5nnp0RQpAMac",
    authDomain: "parilink-tms-f34ec.firebaseapp.com",
    projectId: "parilink-tms-f34ec",
    storageBucket: "parilink-tms-f34ec.firebasestorage.app",
    messagingSenderId: "856773557844",
    appId: "1:856773557844:web:25c64d41b6bff344b0f7c1"
};

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALIZE FIREBASE
// ═══════════════════════════════════════════════════════════════════════════════

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Enable offline persistence for Firestore (works without internet!)
db.enablePersistence({ synchronizeTabs: true }).catch(err => {
    console.warn('Firestore persistence:', err.code);
});

// Super Admin email (only this user gets admin access)
const SUPER_ADMIN_EMAIL = 'admin@parilink.com';

// ═══════════════════════════════════════════════════════════════════════════════
// AUTHENTICATION
// ═══════════════════════════════════════════════════════════════════════════════

window.fbSignIn = async (authObj, email, pass) => {
    const cred = await auth.signInWithEmailAndPassword(email, pass);
    const uid = cred.user.uid;

    // Get user profile from Firestore
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) throw { code: 'user-not-found', message: 'Account not found in system.' };

    const userData = userDoc.data();
    const companyId = userData.company_id;

    // Check subscription
    const subscription = await checkSubscription(companyId);

    const user = {
        uid: uid,
        email: cred.user.email,
        companyId: companyId,
        role: userData.role || 'owner'
    };
    window._serverUser = user;
    return { user, subscription };
};

window.fbSignUp = async (authObj, email, pass) => {
    const cred = await auth.createUserWithEmailAndPassword(email, pass);
    const uid = cred.user.uid;
    const companyId = 'COMP_' + uid.substring(0, 8).toUpperCase();
    const companyName = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1) + ' Transport';

    // Create user profile
    await db.collection('users').doc(uid).set({
        email: email,
        company_id: companyId,
        role: 'owner',
        created_at: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Create company document with demo data
    const demoState = {
        company: { name: companyName, id: companyId },
        trucks: [
            { id: 'T1', number: 'MH-12-PQ-4567', type: '12 Wheeler', capacity: '20T', driverId: 'D1', status: 'Active', expiry: { rc: '2026-12-01', insurance: '2025-05-15' } },
            { id: 'T2', number: 'MH-12-AB-9999', type: 'Container', capacity: '10T', driverId: 'D2', status: 'Maintenance', expiry: { rc: '2027-01-10', insurance: '2025-04-20' } }
        ],
        drivers: [
            { id: 'D1', name: 'Rajesh Kumar', phone: '9876543210', role: 'Driver', status: 'Verified', license: 'DL-55231', expiry: '2028-10-10', photo: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=0A84FF&color=fff', salaryType: 'Per Trip', salaryRate: 1500, balance: 0, totalKm: 0 },
            { id: 'D2', name: 'Suresh Singh', phone: '9876543211', role: 'Driver', status: 'Verified', license: 'DL-88210', expiry: '2025-11-20', photo: 'https://ui-avatars.com/api/?name=Suresh+Singh&background=0A84FF&color=fff', salaryType: 'Fixed', salaryRate: 25000, balance: 0, totalKm: 0 }
        ],
        loads: [], fuel: [], maintenance: [], driverTransactions: [], fastag: [],
        updated_at: firebase.firestore.FieldValue.serverTimestamp()
    };
    await db.collection('companies').doc(companyId).set(demoState);

    // Create license/subscription (30-day free trial)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    await db.collection('licenses').doc(companyId).set({
        company_id: companyId,
        company_name: companyName,
        owner_email: email,
        plan: 'trial',
        status: 'active',
        expiry_date: expiryDate.toISOString().split('T')[0],
        created_at: firebase.firestore.FieldValue.serverTimestamp()
    });

    const subscription = { allowed: true, status: 'active', days_remaining: 30, plan: 'trial' };

    const user = { uid, email, companyId, role: 'owner' };
    window._serverUser = user;
    return { user, subscription };
};

window.fbSignOut = async () => {
    await auth.signOut();
    window._serverUser = null;
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUBSCRIPTION / LICENSE CHECK
// ═══════════════════════════════════════════════════════════════════════════════

async function checkSubscription(companyId) {
    try {
        const licDoc = await db.collection('licenses').doc(companyId).get();
        if (!licDoc.exists) return { allowed: false, status: 'no-license', days_remaining: 0, plan: 'none' };

        const lic = licDoc.data();
        if (lic.status === 'suspended') return { allowed: false, status: 'suspended', days_remaining: 0, plan: lic.plan };

        const expiry = new Date(lic.expiry_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const daysRemaining = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));

        if (daysRemaining < 0) return { allowed: false, status: 'expired', days_remaining: 0, plan: lic.plan };
        return { allowed: true, status: 'active', days_remaining: daysRemaining, plan: lic.plan };
    } catch (e) {
        console.error('Subscription check failed:', e);
        return { allowed: true, status: 'unknown', days_remaining: 999, plan: 'unknown' };
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATA SYNC — Save company state to Firestore
// ═══════════════════════════════════════════════════════════════════════════════

window.syncToServer = async () => {
    if (!window.state.user || !window.state.user.companyId) return;

    try {
        await db.collection('companies').doc(window.state.user.companyId).set({
            trucks:             window.state.trucks || [],
            drivers:            window.state.drivers || [],
            loads:              window.state.loads || [],
            fuel:               window.state.fuel || [],
            maintenance:        window.state.maintenance || [],
            driverTransactions: window.state.driverTransactions || [],
            fastag:             window.state.fastag || [],
            company:            window.state.company || {},
            updated_at:         firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        console.log('[SYNC] Data saved to Firebase Cloud.');
    } catch (e) {
        console.warn('[SYNC] Firebase sync failed, data saved locally.', e.message);
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// DATA FETCH — Pull company data from Firestore
// ═══════════════════════════════════════════════════════════════════════════════

window.fetchCompanyData = async (companyId) => {
    try {
        const doc = await db.collection('companies').doc(companyId).get();
        if (!doc.exists) {
            console.warn('[FETCH] No company data found.');
            return false;
        }

        const data = doc.data();
        if (data.trucks)             window.state.trucks             = data.trucks;
        if (data.drivers)            window.state.drivers            = data.drivers;
        if (data.loads)              window.state.loads              = data.loads;
        if (data.fuel)               window.state.fuel               = data.fuel;
        if (data.maintenance)        window.state.maintenance        = data.maintenance;
        if (data.driverTransactions) window.state.driverTransactions = data.driverTransactions;
        if (data.fastag)             window.state.fastag             = data.fastag;
        if (data.company) {
            window.state.company = { ...window.state.company, ...data.company };
            if (window.state.company.themeColor && window.applyThemeColor) {
                window.applyThemeColor(window.state.company.themeColor);
            }
        }

        // Check subscription
        const subscription = await checkSubscription(companyId);
        window.state.subscription = subscription;
        try { localStorage.setItem('pl_subscription', JSON.stringify(subscription)); } catch(e){}

        console.log('[FETCH] Company data loaded from Firebase.');
        return true;
    } catch (e) {
        console.warn('[FETCH] Firebase fetch failed.', e.message);
        return false;
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// FILE UPLOAD — Firebase Storage
// ═══════════════════════════════════════════════════════════════════════════════

window.uploadFile = async (file, path) => {
    if (!file) return null;
    try {
        const storageRef = storage.ref(path);
        const snapshot = await storageRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();
        console.log('[UPLOAD] File uploaded:', downloadURL);
        return downloadURL;
    } catch (e) {
        console.error('Upload failed:', e);
        return null;
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// DRIVER LOGIN — Search across companies for matching driver
// ═══════════════════════════════════════════════════════════════════════════════

window.driverLoginFirebase = async (name, pin) => {
    // Get all companies and search for the matching driver
    const snapshot = await db.collection('companies').get();

    for (const doc of snapshot.docs) {
        const companyId = doc.id;
        const data = doc.data();
        const drivers = data.drivers || [];

        for (const d of drivers) {
            const driverName = (d.name || '').toLowerCase();
            const expectedPin = String(d.phone || '0000').slice(-4);

            if ((driverName.startsWith(name.toLowerCase()) || driverName.includes(name.toLowerCase())) && expectedPin === pin) {
                // Found matching driver! Check subscription
                const subscription = await checkSubscription(companyId);

                return {
                    driver_id: d.id,
                    name: d.name,
                    company_id: companyId,
                    role: 'driver',
                    subscription: subscription
                };
            }
        }
    }
    throw { code: 'invalid-driver-credentials', message: 'Name or PIN incorrect.' };
};

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN FUNCTIONS — For Super Admin (Vishal)
// ═══════════════════════════════════════════════════════════════════════════════

window.adminGetAllCompanies = async () => {
    const licensesSnap = await db.collection('licenses').orderBy('created_at', 'desc').get();
    const licenses = [];

    for (const doc of licensesSnap.docs) {
        const lic = doc.data();
        lic.company_id = doc.id;

        // Calculate days remaining
        try {
            const expiry = new Date(lic.expiry_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            lic.days_remaining = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
        } catch (e) {
            lic.days_remaining = 0;
        }

        // Get company stats
        try {
            const compDoc = await db.collection('companies').doc(doc.id).get();
            if (compDoc.exists) {
                const cd = compDoc.data();
                lic.truck_count = (cd.trucks || []).length;
                lic.driver_count = (cd.drivers || []).length;
                lic.load_count = (cd.loads || []).length;
            } else {
                lic.truck_count = lic.driver_count = lic.load_count = 0;
            }
        } catch (e) {
            lic.truck_count = lic.driver_count = lic.load_count = 0;
        }

        licenses.push(lic);
    }
    return licenses;
};

window.adminGetStats = async (licenses) => {
    const total = licenses.length;
    const active = licenses.filter(l => l.status === 'active' && l.days_remaining >= 0).length;
    const expired = licenses.filter(l => l.days_remaining < 0 && l.status !== 'suspended').length;
    const suspended = licenses.filter(l => l.status === 'suspended').length;
    const trials = licenses.filter(l => l.plan === 'trial').length;
    return { total_companies: total, active, expired, suspended, trials };
};

window.adminExtendLicense = async (companyId, days, plan) => {
    const licDoc = await db.collection('licenses').doc(companyId).get();
    if (!licDoc.exists) return false;

    const lic = licDoc.data();
    let baseDate;
    try {
        const currentExpiry = new Date(lic.expiry_date);
        const today = new Date();
        baseDate = currentExpiry > today ? currentExpiry : today;
    } catch (e) {
        baseDate = new Date();
    }
    baseDate.setDate(baseDate.getDate() + days);

    const updates = {
        expiry_date: baseDate.toISOString().split('T')[0],
        status: 'active'
    };
    if (plan) updates.plan = plan;

    await db.collection('licenses').doc(companyId).update(updates);
    return true;
};

window.adminSuspendCompany = async (companyId) => {
    await db.collection('licenses').doc(companyId).update({ status: 'suspended' });
};

window.adminActivateCompany = async (companyId) => {
    await db.collection('licenses').doc(companyId).update({ status: 'active' });
};

window.adminDeleteCompany = async (companyId) => {
    await db.collection('licenses').doc(companyId).delete();
    await db.collection('companies').doc(companyId).delete();
    // Note: Firebase Auth user deletion requires Admin SDK (server-side)
    // The user account will remain but have no data access
};

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH STATE LISTENER — Auto-restore session
// ═══════════════════════════════════════════════════════════════════════════════

auth.onAuthStateChanged(async (firebaseUser) => {
    if (firebaseUser) {
        try {
            const userDoc = await db.collection('users').doc(firebaseUser.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                const user = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    companyId: userData.company_id,
                    role: userData.role || 'owner'
                };
                window._serverUser = user;

                // Only auto-restore if we're on the login page
                if (!window.state.user || !window.state.user.companyId) {
                    window.state.user = user;
                    window.state.company = { ...window.state.company, id: userData.company_id };
                    localStorage.setItem('pl_user', JSON.stringify(user));
                    await window.fetchCompanyData(userData.company_id);
                    if (window.renderApp) window.renderApp();
                }
            }
        } catch (e) {
            console.warn('Auth state restore failed:', e);
        }
    }
});

window._apiReady = true;
console.log("🔥 PariLink Firebase Cloud Backend Ready");
