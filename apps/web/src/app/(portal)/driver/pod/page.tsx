import React from 'react';

export default function DriverPodPage() {
  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-white mb-4">Proof of Delivery</h1>
      
      <div className="bg-slate-800 rounded-2xl p-5 mb-4 border border-slate-700">
        <p className="text-sm text-slate-400 mb-2">Instructions</p>
        <p className="text-sm text-slate-200">Please capture a clear photo of the stamped LR/Bilty document. Ensure all 4 corners are visible. Signatures must be readable.</p>
      </div>

      {/* Camera / Upload Section */}
      <div className="border-2 border-dashed border-slate-600 rounded-2xl p-8 mb-6 flex flex-col items-center justify-center text-center bg-slate-800/50">
        <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </div>
        <h3 className="text-white font-semibold mb-1">Open Camera</h3>
        <p className="text-xs text-slate-400">or upload from gallery</p>
      </div>

      {/* E-Signature */}
      <div className="bg-slate-800 rounded-2xl p-5 mb-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-3">Consignee E-Signature</h3>
        <div className="bg-white rounded-xl h-40 w-full mb-3 border-2 border-slate-200" />
        <button className="text-sm text-slate-400 hover:text-white">Clear Signature</button>
      </div>

      <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition-colors active:scale-95 flex justify-center items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
        Submit POD to Queue
      </button>

      <p className="text-xs text-center text-slate-500 mt-4">
        Images will be queued in IndexedDB and uploaded automatically when connection restores.
      </p>
    </div>
  );
}
