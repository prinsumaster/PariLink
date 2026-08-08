import React from 'react';

export default function CustomerDocumentsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Document Center</h1>
          <p className="text-slate-500 mt-1">Access Proof of Delivery (PODs), contracts, and e-way bills.</p>
        </div>
        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder="Search documents..." 
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </header>
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
              <th className="py-4 px-6 font-medium">Document Name</th>
              <th className="py-4 px-6 font-medium">Type</th>
              <th className="py-4 px-6 font-medium">Related Load</th>
              <th className="py-4 px-6 font-medium">Upload Date</th>
              <th className="py-4 px-6 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {[
              { id: 1, name: 'POD_LOD-9823_Signed.pdf', type: 'POD', load: 'LOD-9823', date: 'Oct 23, 2026' },
              { id: 2, name: 'EwayBill_LOD-9823.pdf', type: 'E-Way Bill', load: 'LOD-9823', date: 'Oct 22, 2026' },
              { id: 3, name: 'Contract_2026_Q4.pdf', type: 'Contract', load: '-', date: 'Oct 01, 2026' },
            ].map(doc => (
              <tr key={doc.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-medium text-slate-900 flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  {doc.name}
                </td>
                <td className="py-4 px-6 text-slate-600">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">{doc.type}</span>
                </td>
                <td className="py-4 px-6 text-blue-600 font-medium hover:underline cursor-pointer">{doc.load}</td>
                <td className="py-4 px-6 text-slate-600">{doc.date}</td>
                <td className="py-4 px-6 text-right">
                  <button className="text-blue-600 font-medium hover:text-blue-700 hover:underline">Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
