/**
 * PariLink -- Secondary Pages & Summaries
 */

window.FuelPage = () => {
    return `
        <div class="fade-in">
            <div class="page-header">
                <h2>Fuel Analytics</h2>
                <button class="btn btn-primary" onclick="window.openFuelModal()">+ Log Fuel</button>
            </div>
            
            <div class="stats-row">
                <div class="stat-card">
                    <div class="stat-label">Total Fuel Expenditure</div>
                    <div class="stat-value">\u20B9${window.state.fuel.reduce((a,c)=>a+c.total,0).toLocaleString()}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Fleet Average Mileage</div>
                    <div class="stat-value">4.2 <span style="font-size: 1rem; color: var(--text-muted)">km/l</span></div>
                </div>
            </div>

            <div class="card">
                <div class="card-title">Consumption Log</div>
                <div class="table-wrap">
                    <table>
                        <thead><tr><th>Date</th><th>Truck</th><th>Volume</th><th>Rate/L</th><th>Total Amount</th><th>Odometer</th><th>Payment Status</th><th>Evidence</th></tr></thead>
                        <tbody>
                            ${window.state.fuel.map(f => `
                                <tr>
                                    <td>${f.date}</td>
                                    <td><strong>${f.truckId}</strong></td>
                                    <td>${f.liters} L</td>
                                    <td>\u20B9${f.price}</td>
                                    <td style="color:var(--rose-400)">\u20B9${(f.total || 0).toLocaleString()}</td>
                                    <td class="mono">${f.odometer} km</td>
                                    <td>${f.paymentStatus === 'Unpaid' ? '<span class="badge amber">Owner to Pay</span>' : '<span class="badge green">Paid by Driver</span>'}</td>
                                    <td>
                                        ${f.billImg ? '<button class="btn btn-sm btn-ghost" style="color:var(--accent)" onclick="window.showFuelProof(' + "'" + f.id + "'" + ')">Verify Proof</button>' : '<span style="font-size:0.75rem; color:var(--rose-400)">No Proof</span>'}
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

window.FinancePage = () => {
    const revenue = window.state.loads.reduce((a,c)=>a+c.freight,0);
    const expenses = window.state.fuel.reduce((a,c)=>a+c.total,0) + window.state.maintenance.reduce((a,c)=>a+c.cost,0);
    
    return `
        <div class="fade-in">
            <div class="page-header">
                <h2>Financial Overview & P&L</h2>
                <button class="btn btn-primary" onclick="window.exportToExcel()">Download Statement</button>
            </div>

            <div class="card" style="margin-bottom: 2rem;">
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; text-align: center;">
                    <div>
                        <div class="stat-label">Gross Revenue</div>
                        <div class="stat-value">\u20B9${revenue.toLocaleString()}</div>
                    </div>
                    <div>
                        <div class="stat-label">Operating Expenses</div>
                        <div class="stat-value">- \u20B9${expenses.toLocaleString()}</div>
                    </div>
                    <div style="border-left: 1px solid var(--glass-border); padding-left: 2rem;">
                        <div class="stat-label">Net Profit</div>
                        <div class="stat-value">\u20B9${(revenue - expenses).toLocaleString()}</div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-title">Generated GST Invoices</div>
                <div class="table-wrap">
                    <table>
                        <thead><tr><th>Invoice ID</th><th>Billed To</th><th>Taxable</th><th>GST (12%)</th><th>Total Value</th><th>Payment Status</th></tr></thead>
                        <tbody>
                            ${window.state.loads.map((l, i) => `
                                <tr>
                                    <td><strong style="color:var(--blue-400)">INV-2026-00${i+1}</strong></td>
                                    <td>${l.customer}</td>
                                    <td>\u20B9${l.freight.toLocaleString()}</td>
                                    <td style="color:var(--text-secondary)">\u20B9${(l.freight * 0.12).toFixed(2)}</td>
                                    <td><strong>\u20B9${(l.freight * 1.12).toFixed(2)}</strong></td>
                                    <td><span class="badge green">Paid</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
};

window.MaintenancePage = () => {
    return `
        <div class="fade-in">
            <div class="page-header">
                <h2>Service & Maintenance</h2>
                <button class="btn btn-primary" onclick="window.openMaintenanceModal()">+ Log Repair</button>
            </div>
            <div class="card">
                <div class="table-wrap">
                    <table>
                        <thead><tr><th>Date</th><th>Vehicle</th><th>Failure & Diagnosis</th><th>Parts Replaced</th><th>Service Center</th><th>Total Cost</th><th>Payment Status</th><th>Reported By</th></tr></thead>
                        <tbody>
                            ${window.state.maintenance.map(m => `
                                <tr>
                                    <td>${m.date}</td>
                                    <td><strong>${m.truckId}</strong></td>
                                    <td>${m.issue}<br><span style="font-size:0.75rem; color:var(--text-muted)">Type: ${m.failureType || 'General'}</span></td>
                                    <td>${m.parts ? `<span style="font-size:0.85rem">${m.parts}</span><br><span style="font-size:0.7rem; color:var(--text-muted)">Brand: ${m.brand || 'OEM'}</span>` : `<span style="color:var(--text-muted)">N/A</span>`}</td>
                                    <td><span style="color:var(--text-secondary)">${m.mechanic}</span><br><button class="btn btn-sm btn-ghost" style="padding:0; height:auto; color:var(--accent); font-size:0.7rem;" onclick="alert('Mechanic Review:\\n${m.mechanicReview || 'No notes provided.'}')">View Notes</button></td>
                                    <td style="color:var(--rose-400)">\u20B9${(m.cost || 0).toLocaleString()}</td>
                                    <td>${m.paymentStatus === 'Unpaid' ? '<span class="badge amber">Owner to Pay</span>' : '<span class="badge green">Paid by Driver</span>'}</td>
                                    <td><span style="font-size: 0.75rem;">${m.reportedBy || 'System'}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
};

// Returns HTML string — called by driver.js renderApp after DOM is ready
window._buildTruckSummary = (truckId) => {
    const truck = window.state.trucks.find(t => t.id === truckId);
    if (!truck) return `<div class="fade-in" style="padding:2rem; text-align:center; color:var(--text-muted)">Truck not found.</div>`;

    const truckLoads = window.state.loads.filter(l => l.truckId === truckId);
    const truckFuel  = window.state.fuel.filter(f => f.truckId === truckId);
    const truckMaint = window.state.maintenance.filter(m => m.truckId === truckId);

    const revenue  = truckLoads.reduce((a,c) => a+c.freight, 0);
    const expenses = truckFuel.reduce((a,c) => a+c.total, 0) + truckMaint.reduce((a,c) => a+c.cost, 0);

    const timeline = [
        ...truckLoads.map(l => ({ date: l.date, title: 'Trip Started', desc: `To ${l.customer} — \u20B9${l.freight.toLocaleString()}`, icon: '[TRUCK]' })),
        ...truckFuel.map(f  => ({ date: f.date, title: 'Fuel Logged',  desc: `${f.liters}L @ \u20B9${f.price}/L — \u20B9${f.total.toLocaleString()}`, icon: '[FUEL]' })),
        ...truckMaint.map(m => ({ date: m.date, title: 'Maintenance',  desc: `${m.issue} — \u20B9${m.cost.toLocaleString()}`, icon: '[REPAIR]' }))
    ].sort((a,b) => new Date(b.date) - new Date(a.date));

    const assignedDriver = window.state.drivers.find(d => d.id === truck.driverId);

    return `
        <div class="fade-in">
            <div class="page-header" style="justify-content: flex-start; gap: 1rem;">
                <button onclick="window.navigate('#trucks')" class="btn btn-ghost" style="padding: 0.5rem 0.75rem;">← Back</button>
                <h2>Vehicle Profile: <span style="color:var(--blue-400)">${truck.number}</span></h2>
            </div>

            <div class="stats-row">
                <div class="stat-card">
                    <div class="stat-label">Net Profit Generated</div>
                    <div class="stat-value" style="color:${(revenue-expenses)>=0?'var(--text-primary)':'var(--rose-400)'}">\u20B9${(revenue - expenses).toLocaleString()}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Total Trips</div>
                    <div class="stat-value">${truckLoads.length}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Status</div>
                    <div class="stat-value" style="font-size:1.2rem;"><span class="badge ${truck.status==='Active'?'green':'amber'}">${truck.status}</span></div>
                </div>
            </div>

            <div class="grid-2">
                <div class="card">
                    <div class="card-title">Compliance & Documents</div>
                    <div style="display:flex; flex-direction:column; gap:1rem; margin-top:1rem;">
                        <div style="display:flex; justify-content:space-between; padding-bottom:0.75rem; border-bottom:1px solid var(--border-subtle);">
                            <span style="color:var(--text-secondary)">RC Book Validity</span>
                            <span class="badge green">Valid till ${truck.expiry.rc}</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; padding-bottom:0.75rem; border-bottom:1px solid var(--border-subtle);">
                            <span style="color:var(--text-secondary)">Insurance Policy</span>
                            <span class="badge amber">Expires ${truck.expiry.insurance}</span>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span style="color:var(--text-secondary)">PUC Certificate</span>
                            <span class="badge green">Active & Valid</span>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-title">Assigned Driver</div>
                    ${assignedDriver ? `
                    <div style="display: flex; align-items: center; gap: 1.25rem; margin-top: 1.5rem;">
                        <img src="${assignedDriver.photo || 'https://ui-avatars.com/api/?name='+assignedDriver.name+'&background=0A84FF&color=fff'}" style="width: 64px; height: 64px; border-radius: 50%; border: 2px solid var(--glass-border);">
                        <div>
                            <h3 style="margin-bottom:0.25rem;">${assignedDriver.name}</h3>
                            <p style="color:var(--text-secondary); font-size:0.85rem;">[PHONE] ${assignedDriver.phone}</p>
                            <span class="badge blue" style="margin-top:0.5rem;">License till ${assignedDriver.expiry}</span>
                        </div>
                    </div>
                    ` : '<p style="color:var(--text-muted); margin-top:1rem;">No driver assigned.</p>'}
                </div>
            </div>

            <div class="card" style="margin-top: 1.5rem;">
                <div class="card-title">P&L Breakdown</div>
                <div style="margin-top: 1rem;">
                    <div class="pl-row"><span>Total Freight Revenue</span><strong>+ \u20B9${revenue.toLocaleString()}</strong></div>
                    <div class="pl-row"><span>Fuel Costs</span><strong style="color:var(--rose-400)">- \u20B9${truckFuel.reduce((a,c)=>a+c.total,0).toLocaleString()}</strong></div>
                    <div class="pl-row"><span>Maintenance & Repairs</span><strong style="color:var(--rose-400)">- \u20B9${truckMaint.reduce((a,c)=>a+c.cost,0).toLocaleString()}</strong></div>
                    <div class="pl-row total"><span>Net Operating Profit</span><span>\u20B9${(revenue - expenses).toLocaleString()}</span></div>
                </div>
            </div>

            <div class="card" style="margin-top: 1.5rem;">
                <div class="card-title">Activity Timeline</div>
                <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
                    ${timeline.length === 0 ? '<p style="color:var(--text-muted); font-size:0.85rem;">No recent activity for this truck.</p>' : ''}
                    ${timeline.map(item => `
                        <div style="display: flex; align-items: flex-start; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--glass-border);">
                            <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--glass-bg); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink:0; border: 1px solid var(--glass-border);">${item.icon}</div>
                            <div>
                                <h4 style="margin-bottom: 0.25rem;">${item.title} <span style="font-size:0.75rem; color:var(--text-muted); font-weight: 400; margin-left:0.5rem;">${item.date}</span></h4>
                                <p style="font-size:0.85rem; color:var(--text-secondary);">${item.desc}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
};

// Keep old name as alias for backward compatibility
window.showTruckSummary = (truckId) => {
    const area = document.getElementById('main-content-area');
    if (area) area.innerHTML = window._buildTruckSummary(truckId);
};

window.DriverKhataPage = (driverId) => {
    const driver = window.state.drivers.find(d => d.id === driverId);
    const txns = window.state.driverTransactions.filter(t => t.driverId === driverId);
    const totalCredits = txns.filter(t => t.type === 'Credit').reduce((a,c) => a + c.amount, 0);
    const totalAdvances = txns.filter(t => t.type === 'Advance').reduce((a,c) => a + c.amount, 0);
    
    // Only owner and accountant can edit salary
    const canEditSalary = ['owner', 'accountant'].includes(window.state.user.role);
    // Only owner, operator, accountant can give advance / settle (NOT drivers)
    const canManageMoney = ['owner', 'operator', 'accountant'].includes(window.state.user.role);

    const html = `
        <div class="fade-in">
            <div class="page-header" style="justify-content: flex-start; gap: 1rem;">
                <button onclick="window.navigate('#drivers')" class="btn btn-ghost" style="padding: 0.5rem 0.75rem;">← Back</button>
                <h2>Driver Ledger: <span style="color:var(--text-primary)">${driver.name}</span></h2>
            </div>

            <div class="grid-2">
                <div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <img src="${driver.photo}" style="width: 56px; height: 56px; border-radius: 50%; border: 1px solid var(--glass-border);">
                            <div>
                                <h3>${driver.name}</h3>
                                <p style="color:var(--text-secondary); font-size:0.85rem;">Phone: ${driver.phone}</p>
                                <p style="color:var(--accent); font-size:0.85rem; margin-top:0.2rem; font-weight: 500;">[ROAD] ${(driver.totalKm || 0).toLocaleString()} km driven</p>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div class="stat-label">Khata Balance</div>
                            <div style="font-size: 1.8rem; font-weight: 600; color: ${(driver.balance || 0) >= 0 ? 'var(--text-primary)' : 'var(--rose-400)'}">
                                \u20B9${(driver.balance || 0).toLocaleString()}
                            </div>
                            <div style="margin-top:0.5rem; display:flex; gap:0.5rem; justify-content:flex-end;">
                                <span class="badge ${driver.status === 'Verified' ? 'green' : 'amber'}" style="font-size:0.65rem;" onclick="alert('Viewing Aadhar & Driving License (DL-${driver.license})')">ID Verified</span>
                            </div>
                        </div>
                    </div>

                    <div style="padding-top: 1.5rem; border-top: 1px solid var(--glass-border);">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <span class="stat-label">Salary Structure</span><br>
                                <strong style="font-size: 1.1rem;">${driver.salaryType || 'Not Set'}</strong> 
                                <span style="color:var(--text-secondary)">- \u20B9${(driver.salaryRate || 0).toLocaleString()} ${(driver.salaryType || 'Fixed') === 'Fixed' ? '/ month' : '/ trip'}</span>
                            </div>
                            ${canEditSalary ? `<button class="btn btn-sm btn-ghost" onclick="alert('Open Edit Salary Modal')">Edit Structure</button>` : ''}
                        </div>
                    </div>
                </div>

                <div class="card" style="display: flex; flex-direction: column; justify-content: center;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; text-align: center;">
                        <div style="padding: 1rem; background: var(--glass-bg); border-radius: var(--radius); border: 1px solid var(--glass-border);">
                            <div class="stat-label">Total Earned</div>
                            <div style="font-size: 1.4rem; margin-top: 0.5rem; font-weight: 500;">\u20B9${totalCredits.toLocaleString()}</div>
                        </div>
                        <div style="padding: 1rem; background: var(--glass-bg); border-radius: var(--radius); border: 1px solid var(--glass-border);">
                            <div class="stat-label">Advances Taken</div>
                            <div style="font-size: 1.4rem; margin-top: 0.5rem; font-weight: 500;">\u20B9${totalAdvances.toLocaleString()}</div>
                        </div>
                    </div>
                    ${canManageMoney ? '<div style="margin-top: 1.5rem; display: flex; gap: 1rem;"><button class="btn btn-primary" style="flex:1; justify-content:center;" onclick="window.addDriverTransaction(\'' + driver.id + '\')">Give Advance</button><button class="btn btn-ghost" style="flex:1; justify-content:center;" onclick="window.addDriverTransaction(\'' + driver.id + '\')">Settle Account</button></div>' : '<div style="margin-top:1.5rem; text-align:center; padding:1rem; background:var(--glass-bg); border-radius:var(--radius); border:1px solid var(--glass-border); color:var(--text-muted); font-size:0.85rem;">Only Owner / Operator / Accountant can manage payments</div>'}
                </div>
            </div>

            <div class="card" style="margin-top: 1.5rem;">
                <div class="card-title">Transaction History</div>
                <div class="table-wrap">
                    <table>
                        <thead><tr><th>Date</th><th>Description</th><th>Type</th><th>Method</th><th>Amount</th><th>Proof</th></tr></thead>
                        <tbody>
                            ${txns.map(t => `
                                <tr>
                                    <td>${t.date}</td>
                                    <td>${t.description}</td>
                                    <td><span class="badge ${t.type === 'Credit' ? 'green' : 'amber'}">${t.type}</span></td>
                                    <td><span class="badge ${t.paymentMethod === 'UPI' ? 'blue' : 'green'}">${t.paymentMethod || 'Cash'}</span></td>
                                    <td style="color: ${t.type === 'Credit' ? 'var(--text-primary)' : 'var(--text-muted)'}; font-weight: 500;">
                                        ${t.type === 'Credit' ? '+' : '-'} \u20B9${t.amount.toLocaleString()}
                                    </td>
                                    <td>${t.proofUrl ? '<button class="btn btn-sm btn-ghost" style="color:var(--accent)" onclick="window.openModal(\'Payment Proof\', \'<div style=text-align:center><img src=' + t.proofUrl + ' style=max-width:100%;border-radius:8px;max-height:400px /><p style=margin-top:1rem;color:var(--text-secondary);font-size:0.85rem>UPI Payment Screenshot</p></div>\')">View</button>' : '<span style="font-size:0.75rem; color:var(--text-muted)">' + (t.paymentMethod === 'UPI' ? 'Missing' : 'N/A') + '</span>'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('main-content-area').innerHTML = html;
};

window.FastagPage = () => {
    return `
        <div class="fade-in">
            <div class="page-header">
                <h2>Fastag & Toll Auto-Sync</h2>
                <div class="page-header-actions">
                    <button class="btn btn-ghost" onclick="alert('Syncing with NPCI...')">[SYNC] Sync Now</button>
                </div>
            </div>
            
            <div class="stats-row">
                <div class="stat-card">
                    <div class="stat-label">Total Tolls This Month</div>
                    <div class="stat-value">\u20B9${window.state.fastag.reduce((a,c)=>a+c.amount,0).toLocaleString()}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Fastag Wallet Balance</div>
                    <div class="stat-value" style="color:var(--text-primary)">\u20B912,450</div>
                    <span class="stat-change" style="color:var(--accent); cursor:pointer" onclick="window.rechargeFastag()">+ Recharge Wallet</span>
                </div>
            </div>

            <div class="card">
                <div class="card-title">Recent Toll Deductions</div>
                <div class="table-wrap">
                    <table>
                        <thead><tr><th>Date & Time</th><th>Truck</th><th>Toll Plaza</th><th>Amount</th><th>Status</th></tr></thead>
                        <tbody>
                            ${window.state.fastag.map(f => `
                                <tr>
                                    <td>${f.date}</td>
                                    <td><strong>${f.truckId}</strong></td>
                                    <td>${f.plaza}</td>
                                    <td style="color:var(--rose-400)">- \u20B9${f.amount}</td>
                                    <td><span class="badge green">Auto-Deducted</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
};

window.TrackingPage = () => {
    return `
        <div class="fade-in">
            <div class="page-header">
                <h2>Live Fleet Tracking</h2>
                <div class="page-header-actions">
                    <span class="badge blue">GPS Active</span>
                </div>
            </div>

            <div class="card" style="padding: 0; overflow: hidden; position: relative;">
                <div style="height: 500px; background: url('https://upload.wikimedia.org/wikipedia/commons/e/e4/Mumbai_Pune_Expressway_Map.png') center/cover; opacity: 0.5; filter: grayscale(100%) invert(100%);"></div>
                
                ${window.state.gps.map(g => `
                    <div style="position: absolute; top: ${Math.random() * 60 + 20}%; left: ${Math.random() * 60 + 20}%; background: ${g.speed > 0 ? 'var(--blue-500)' : 'var(--rose-500)'}; color: white; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.5); cursor: pointer;" onclick="alert('Truck: ${g.truckId}\\nLocation: ${g.location}\\nSpeed: ${g.speed} km/h')">
                        [TRUCK] ${g.truckId} <span style="font-size:0.75rem; font-weight:400; opacity:0.8; margin-left:0.5rem;">${g.speed} km/h</span>
                    </div>
                `).join('')}

                <div style="position: absolute; bottom: 1.5rem; left: 1.5rem; background: var(--glass-bg); backdrop-filter: blur(10px); border: 1px solid var(--glass-border); padding: 1rem; border-radius: var(--radius); width: 300px;">
                    <h4 style="margin-bottom: 1rem;">Active Vehicles</h4>
                    ${window.state.gps.map(g => `
                        <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; border-bottom: 1px solid var(--border-subtle); padding-bottom:0.5rem;">
                            <div>
                                <strong>${g.truckId}</strong><br>
                                <span style="font-size:0.75rem; color:var(--text-secondary)">${g.location}</span>
                            </div>
                            <div style="text-align:right;">
                                <span class="badge ${g.speed > 0 ? 'blue' : 'amber'}">${g.status}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
};

window.SettingsPage = () => {
    return `
        <div class="fade-in">
            <div class="page-header">
                <h2>Company Settings</h2>
                <div class="page-header-actions">
                    <button class="btn btn-primary" onclick="window.saveSettings()">Save Changes</button>
                </div>
            </div>
            
            <div class="card" style="max-width: 600px; margin: 0 auto;">
                <div class="form-group">
                    <label>Company Name</label>
                    <input type="text" id="setting-company-name" value="${window.state.company?.name || ''}" placeholder="e.g. PariLink Transport">
                </div>
                
                <div class="form-group" style="margin-top: 1.5rem;">
                    <label>Company Logo</label>
                    <div style="display: flex; gap: 1rem; align-items: flex-start;">
                        <div id="logo-preview-container" style="width: 80px; height: 80px; border-radius: var(--radius); border: 1px dashed var(--glass-border); overflow: hidden; background: var(--glass-bg); display: flex; align-items: center; justify-content: center;">
                            ${window.state.company?.logoUrl ? `<img src="${window.state.company.logoUrl}" style="width:100%; height:100%; object-fit:cover;">` : '<span style="color:var(--text-muted); font-size:0.8rem;">No Logo</span>'}
                        </div>
                        <div style="flex: 1;">
                            <input type="file" id="setting-logo-file" accept="image/*" onchange="window.previewAndExtractLogo(this)">
                            <small style="color:var(--text-muted); display:block; margin-top:0.5rem;">
                                Uploading a logo will automatically change the app's theme colors to match your brand!
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};
