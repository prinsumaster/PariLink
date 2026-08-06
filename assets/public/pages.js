/**
 * PariLink — Core Pages (Dashboard, Trucks, Drivers, Loads)
 */

window.DashboardPage = () => {
    const totalFreight = window.state.loads.reduce((acc, curr) => acc + curr.freight, 0);
    const totalFuel = window.state.fuel.reduce((acc, curr) => acc + curr.total, 0);
    const totalMaintenance = window.state.maintenance.reduce((acc, curr) => acc + curr.cost, 0);
    const profit = totalFreight - totalFuel - totalMaintenance;

    return `
        <div class="fade-in">
            <div class="page-header">
                <h2>Business Intelligence</h2>
                <div class="page-header-actions">
                    <button class="btn btn-ghost" onclick="window.exportToExcel()">Export Report</button>
                    <button class="btn btn-primary" onclick="window.addLoad()">+ New Load</button>
                </div>
            </div>
            
            <div class="stats-row">
                <div class="stat-card">
                    <div class="stat-label">Total Revenue</div>
                    <div class="stat-value">\u20B9${totalFreight.toLocaleString()}</div>
                    <span class="stat-change up">↑ 12.5%</span>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Total Expenses</div>
                    <div class="stat-value">\u20B9${(totalFuel + totalMaintenance).toLocaleString()}</div>
                    <span class="stat-change down">↓ 2.4%</span>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Net Profit</div>
                    <div class="stat-value">\u20B9${profit.toLocaleString()}</div>
                    <span class="stat-change up">↑ 8.2% margin</span>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Active Fleet</div>
                    <div class="stat-value">${window.state.trucks.length}</div>
                    <span class="stat-change">All operational</span>
                </div>
            </div>

            <div class="grid-3-1">
                <div class="card">
                    <div class="card-title">Recent Shipments</div>
                    <div class="table-wrap">
                        <table>
                            <thead><tr><th>Truck</th><th>Client</th><th>Amount</th><th>Status</th></tr></thead>
                            <tbody>
                                ${window.state.loads.slice(0, 5).map(load => `
                                    <tr>
                                        <td><strong>${load.truckId}</strong></td>
                                        <td>${load.customer}</td>
                                        <td>\u20B9${load.freight.toLocaleString()}</td>
                                        <td><span class="badge ${load.status === 'Delivered' ? 'green' : 'blue'}">${load.status}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="card">
                    <div class="card-title">Alerts & Notifications</div>
                    <div style="margin-top: 1rem;">
                        <div class="alert-strip warning" style="display:flex; justify-content:space-between; align-items:center;">
                            <div style="display:flex; gap:1rem; align-items:center;">
                                ${window.Icons.Maintenance} 
                                <div><strong>MH-12-PQ-4567</strong><br/><span style="opacity:0.8">Insurance expires in 15 days</span></div>
                            </div>
                            <button class="btn btn-sm btn-ghost" style="color:#25D366; border-color:rgba(37,211,102,0.3);" onclick="window.sendWhatsappAlert('919876543210', 'Alert from PariLink TMS: Vehicle MH-12-PQ-4567 Insurance expires in 15 days. Please renew immediately.')">[MSG] WhatsApp Alert</button>
                        </div>
                        <div class="alert-strip danger" style="display:flex; justify-content:space-between; align-items:center;">
                            <div style="display:flex; gap:1rem; align-items:center;">
                                ${window.Icons.Truck}
                                <div><strong>MH-12-AB-9999</strong><br/><span style="opacity:0.8">Scheduled for maintenance</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

window.TruckPage = () => {
    return `
        <div class="fade-in">
            <div class="page-header">
                <h2>Fleet Management</h2>
                <button class="btn btn-primary" onclick="window.addTruck()">+ Add Truck</button>
            </div>
            <div class="card">
                <div class="table-wrap">
                    <table>
                        <thead><tr><th>Vehicle No.</th><th>Type</th><th>Driver</th><th>RC Expiry</th><th>Status</th><th>Action</th></tr></thead>
                        <tbody>
                            ${window.state.trucks.map(truck => `
                                <tr>
                                    <td><strong>${truck.number}</strong></td>
                                    <td><span style="color:var(--text-secondary)">${truck.type}</span></td>
                                    <td>${window.state.drivers.find(d => d.id === truck.driverId)?.name || 'Unassigned'}</td>
                                    <td>${truck.expiry.rc}</td>
                                    <td><span class="badge ${truck.status === 'Active' ? 'green' : 'amber'}">${truck.status}</span></td>
                                    <td><button class="btn btn-sm btn-ghost" onclick="window.navigate('#truck-summary/${truck.id}')">View Details</button></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
};

window.DriverPage = () => {
    return `
        <div class="fade-in">
            <div class="page-header">
                <h2>Employee Management</h2>
                <button class="btn btn-primary" onclick="window.addDriver()">+ Add Employee</button>
            </div>
            <div class="card">
                <div class="table-wrap">
                    <table>
                        <thead><tr><th>Name</th><th>Contact</th><th>License #</th><th>Valid Till</th><th>Verification</th><th>Action</th></tr></thead>
                        <tbody>
                            ${window.state.drivers.map(driver => `
                                <tr>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                                            <img src="${driver.photo}" alt="Avatar" style="width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--glass-border);">
                                            <div>
                                                <strong>${driver.name}</strong><br>
                                                <span style="font-size:0.75rem;color:var(--text-secondary)">${driver.role}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>${driver.phone}</td>
                                    <td><span class="mono">${driver.license}</span></td>
                                    <td>${driver.expiry}</td>
                                    <td><span class="badge ${driver.status === 'Verified' ? 'green' : 'amber'}">${driver.status}</span></td>
                                    <td><button class="btn btn-sm btn-ghost" onclick="window.navigate('#driver-khata/${driver.id}')">View Ledger</button></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
};

window.LoadPage = () => {
    return `
        <div class="fade-in">
            <div class="page-header">
                <h2>Shipments & Loads</h2>
                <div class="page-header-actions">
                    <button class="btn btn-ghost" onclick="window.exportToExcel()">Export Excel</button>
                    <button class="btn btn-primary" onclick="window.addLoad()">+ New Load</button>
                </div>
            </div>
            <div class="card">
                <div class="table-wrap">
                    <table>
                        <thead><tr><th>ID</th><th>Assigned Truck</th><th>Client</th><th>Freight Amount</th><th>E-Way Bill</th><th>Status</th><th>Dispatch Date</th><th>Added By</th><th>Invoice</th></tr></thead>
                        <tbody>
                            ${window.state.loads.map(load => `
                                <tr>
                                    <td><span style="color:var(--text-secondary)">#${load.id}</span></td>
                                    <td><strong>${load.truckId}</strong></td>
                                    <td>${load.customer}</td>
                                    <td>\u20B9${load.freight.toLocaleString()}</td>
                                    <td>${load.ewayBill ? `<span class="badge blue mono">${load.ewayBill}</span><br><span style="font-size:0.7rem; color:var(--text-muted)">Exp: ${load.ewayExpiry}</span>` : `<button class="btn btn-sm btn-ghost" onclick="alert('Upload E-Way Bill')">+ Add</button>`}</td>
                                    <td><span class="badge ${load.status === 'Delivered' ? 'green' : 'amber'}">${load.status}</span></td>
                                    <td>${load.date}</td>
                                    <td><span style="color:var(--text-muted); font-size: 0.75rem;">${load.addedBy || 'System'}</span></td>
                                    <td>
                                        ${load.status === 'Delivered' ? `<button class="btn btn-sm btn-primary" onclick="window.generateInvoice('${load.customer}', ${load.freight})">Generate Invoice</button>` : `<button class="btn btn-sm btn-ghost" disabled>Pending Delivery</button>`}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
};
