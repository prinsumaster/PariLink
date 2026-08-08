'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Scan, X, PackageSearch } from 'lucide-react';
import { useCamera } from '@/hooks/mobile/useCamera';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function BarcodeScannerPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { stream, startCamera, stopCamera } = useCamera();
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    startCamera('environment');
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      setScanning(true);
      
      // Hardware scanner integration goes here
    }
  }, [stream]);

  const handleScanSuccess = (code: string) => {
    toast.success(`Scanned: ${code}`);
    stopCamera();
    router.push(`/warehouse/inventory?code=${code}`);
  };

  return (
    <div className="h-screen bg-black flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-50 bg-gradient-to-b from-black/60 to-transparent pt-safe">
        <h1 className="text-white font-semibold text-lg drop-shadow-md">Scan Barcode</h1>
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/20">
          <X className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex-1 relative flex items-center justify-center">
        {stream ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="absolute inset-0 w-full h-full object-cover"
              onLoadedMetadata={() => videoRef.current?.play()}
            />
            {/* Scanner Overlay Guide */}
            <div className="relative z-10 w-64 h-32 border-2 border-green-500 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-green-500 -mt-1 -ml-1"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-green-500 -mt-1 -mr-1"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-green-500 -mb-1 -ml-1"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-green-500 -mb-1 -mr-1"></div>
              
              {/* Scan Line Animation */}
              {scanning && (
                <div className="w-full h-0.5 bg-green-500 shadow-[0_0_8px_2px_rgba(34,197,94,0.5)] absolute top-0 animate-[scan_2s_ease-in-out_infinite]"></div>
              )}
            </div>
            <p className="absolute bottom-24 text-white font-medium drop-shadow-md">Align barcode within the frame</p>
          </>
        ) : (
          <div className="text-center text-white/50 space-y-4">
            <PackageSearch className="h-12 w-12 mx-auto animate-pulse" />
            <p>Initializing Camera...</p>
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />
    </div>
  );
}
