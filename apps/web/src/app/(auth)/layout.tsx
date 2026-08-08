export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-950 font-sans">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 relative z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-r border-slate-100 dark:border-slate-800">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {children}
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 overflow-hidden">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          {/* Glowing Orb Effects */}
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob" />
          <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000" />

          <div className="flex flex-col justify-center items-center h-full text-white p-12 relative z-20">
            <h1 className="text-5xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              PariLink Enterprise
            </h1>
            <p className="text-xl text-blue-100/80 text-center max-w-xl leading-relaxed font-light">
              The AI-powered operating system unifying dispatch, telematics, and financial automation for modern fleets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
