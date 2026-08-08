import React from 'react';
import { Truck, MapPin, CheckCircle, Clock, FileText, Phone } from 'lucide-react';

export default function CustomerTrackingPortal({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-500 rounded p-1.5">
            <Truck className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">PariLink Logistics</span>
        </div>
        <div className="text-sm text-slate-300">
          Tracking: <span className="font-mono font-medium text-white">{params.id}</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        
        {/* Status Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-emerald-500 p-6 text-white text-center">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-90" />
            <h1 className="text-3xl font-bold mb-1">In Transit - On Time</h1>
            <p className="text-emerald-100 font-medium">Expected Delivery: Today, 4:30 PM EST</p>
          </div>
          
          <div className="p-6">
            <div className="relative">
              {/* Progress Bar Line */}
              <div className="absolute top-5 left-8 right-8 h-1 bg-slate-100 rounded-full"></div>
              <div className="absolute top-5 left-8 w-1/2 h-1 bg-emerald-500 rounded-full"></div>
              
              <div className="flex justify-between relative z-10">
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 bg-emerald-500 text-white rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium mt-2">Picked Up</span>
                  <span className="text-xs text-slate-500">8:00 AM</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 bg-emerald-500 text-white rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                    <Truck className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium mt-2">In Transit</span>
                  <span className="text-xs text-slate-500">Current</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium mt-2 text-slate-400">Delivery</span>
                  <span className="text-xs text-slate-400">Est. 4:30 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-indigo-500" /> 
              Shipment Details
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">From</p>
                <p className="font-medium text-slate-800">Chicago Warehouse (Hub 1)</p>
                <p className="text-sm text-slate-600">123 Logistics Way, IL 60601</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">To</p>
                <p className="font-medium text-slate-800">Acme Corp HQ</p>
                <p className="text-sm text-slate-600">456 Industry Blvd, NY 10001</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5 text-indigo-500" /> 
              Driver & Vehicle
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-slate-500">JD</span>
                </div>
                <div>
                  <p className="font-bold text-slate-800">John Doe</p>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <Phone className="h-3 w-3" /> (555) 123-4567
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-sm text-slate-600">Freightliner Cascadia (2023)</p>
                <p className="text-sm text-slate-500 font-mono">Plate: TX-84920</p>
              </div>
            </div>
          </div>
        </div>

        {/* Document Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
           <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-500" /> 
            Documents
          </h3>
          <div className="flex flex-col gap-3">
            <button className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-slate-400" />
                <span className="font-medium text-sm text-slate-700">Bill of Lading</span>
              </div>
              <span className="text-xs font-medium text-indigo-600">Download</span>
            </button>
            <button className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-slate-400" />
                <span className="font-medium text-sm text-slate-700">Proof of Delivery</span>
              </div>
              <span className="text-xs font-medium text-slate-500">Pending</span>
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
