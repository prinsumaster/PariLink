import React from 'react';

export default function FleetSensorsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col h-full">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Live IoT Sensors</h1>
          <p className="text-slate-500 mt-1">Real-time telemetry and diagnostics from the active fleet.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg border border-emerald-100 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          WebSocket Connected
        </div>
      </header>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden text-slate-300">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-800 border-b border-slate-700 text-sm text-slate-400">
              <th className="py-4 px-6 font-medium">Asset ID</th>
              <th className="py-4 px-6 font-medium">Location</th>
              <th className="py-4 px-6 font-medium">Speed</th>
              <th className="py-4 px-6 font-medium">Fuel Level</th>
              <th className="py-4 px-6 font-medium">Engine Temp</th>
              <th className="py-4 px-6 font-medium text-right">Last Ping</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                <td className="py-4 px-6 font-medium text-white flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  TRK-0{i}89
                </td>
                <td className="py-4 px-6 text-slate-400 font-mono">19.07, 72.87</td>
                <td className="py-4 px-6 text-slate-300">{60 + i * 2} km/h</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${80 - i * 10}%` }}></div>
                    </div>
                    <span className="text-xs">{80 - i * 10}%</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-300">{85 + i}°C</td>
                <td className="py-4 px-6 text-right text-slate-500">2s ago</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
