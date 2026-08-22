import { CinematicMap } from '@/components/auth/cinematic-map';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0A0A0A] font-sans relative overflow-hidden text-white">
      {/* Background Map Animation */}
      <CinematicMap />

      {/* Foreground Form (Left Aligned, Frosted Glass) */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 relative z-10 w-full lg:w-[500px]">
        <div className="mx-auto w-full max-w-sm lg:w-[400px] glass p-8 border border-white/10 rounded-sm shadow-2xl relative">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md rounded-sm -z-10" />
          {children}
        </div>
      </div>
      
      {/* Marketing Copy (Right Side, floating over map) */}
      <div className="hidden lg:flex relative flex-1 flex-col justify-center items-end p-24 z-10 pointer-events-none">
        <div className="max-w-xl text-right animate-in fade-in slide-in-from-right-8 duration-1000 delay-500 fill-mode-both">
          <h1 className="text-5xl font-medium mb-6 tracking-tight text-white drop-shadow-lg">
            Command your fleet.
          </h1>
          <p className="text-xl text-white/70 leading-relaxed font-light drop-shadow-md">
            The AI-powered operating system unifying dispatch, telematics, and financial automation.
          </p>
        </div>
      </div>
    </div>
  );
}
