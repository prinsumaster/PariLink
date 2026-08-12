import Link from 'next/link';
import { ArrowRight, Truck, Shield, Zap, Activity, CheckCircle2, Globe2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const demoUrl = process.env.NEXT_PUBLIC_DEMO_URL || 'mailto:sales@parilink.com?subject=PariLink Demo Request';
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-blue-200 dark:selection:bg-blue-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-all">
        <div className="flex items-center space-x-2 group cursor-pointer">
          <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            PariLink
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-400">
          <Link href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Platform</Link>
          <Link href="#solutions" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Solutions</Link>
          <Link href="#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</Link>
          <Link href="/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
            <Zap className="w-4 h-4 text-amber-500" /> Copilot
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Sign in</Link>
          <Link href={demoUrl} passHref>
            <Button>Book Demo</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-white dark:from-blue-950/20 dark:via-slate-950 dark:to-slate-950"></div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
          <div className="w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-blue-200 dark:border-blue-800/50">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>Turn Operational Chaos into Profitable Control</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-slate-900 dark:text-white mb-8">
            The OS for the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Modern Fleet.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
            PariLink is the Enterprise Logistics Control Tower that unifies your fleet, freight, warehouse, and finances into a single intelligent platform.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href={demoUrl} passHref>
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-xl">
                Book a Demo <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#features" passHref>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg rounded-xl border-slate-300 dark:border-slate-800">
                See the Platform
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Trust Banner */}
      <div className="border-y border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">Trusted by logistics leaders worldwide</p>
          <div className="flex justify-center gap-12 flex-wrap opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-2xl font-bold font-serif">MAERSK</span>
            <span className="text-2xl font-bold tracking-tighter">XPO</span>
            <span className="text-2xl font-bold font-mono">C.H. ROBINSON</span>
            <span className="text-2xl font-bold tracking-widest">DSV</span>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Everything you need to scale</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Replace dozens of fragmented tools with one cohesive operating system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Globe2 className="w-6 h-6" />,
              title: "AI-Powered Dispatch",
              desc: "Predictive routing and automated load matching to eliminate empty miles and maximize driver utilization."
            },
            {
              icon: <Activity className="w-6 h-6" />,
              title: "Real-Time Telematics",
              desc: "Live GPS tracking, fuel monitoring, and harsh braking alerts integrated directly with order fulfillment."
            },
            {
              icon: <Zap className="w-6 h-6" />,
              title: "Zero-Leakage Billing",
              desc: "Automated invoice generation triggered instantly upon electronic Proof of Delivery (ePOD) upload."
            },
          ].map((feature, i) => (
            <div key={i} className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:shadow-xl dark:hover:shadow-blue-900/10 transition-all group">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-16">
            Pay for what you use. No hidden fees. No complex contracts.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            {/* Starter Plan */}
            <div className="p-8 rounded-3xl bg-slate-800 border border-slate-700">
              <h3 className="text-2xl font-semibold mb-2">Growth</h3>
              <p className="text-slate-400 mb-6">For fleets up to 150 vehicles.</p>
              <div className="mb-6">
                <span className="text-5xl font-bold">Custom</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Command Center Dashboard', 'Fleet & Load Management', 'Standard Invoicing', '30-Day Paid Pilot Available'].map((item, i) => (
                  <li key={i} className="flex items-center text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 mr-3 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href={demoUrl} passHref>
                <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white" variant="secondary">Start a Pilot</Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-blue-600 to-indigo-700 border border-blue-500 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-400 text-blue-950 text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
              <h3 className="text-2xl font-semibold mb-2">Enterprise</h3>
              <p className="text-blue-200 mb-6">For complex operations needing WMS and AI.</p>
              <div className="mb-6">
                <span className="text-5xl font-bold">Custom</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Unlimited vehicles & users', 'Native WMS Integration', 'AI Copilot & Predictive Routing', '24/7 Dedicated Support'].map((item, i) => (
                  <li key={i} className="flex items-center text-white">
                    <CheckCircle2 className="w-5 h-5 text-blue-300 mr-3 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href={demoUrl} passHref>
                <Button className="w-full bg-white text-blue-700 hover:bg-blue-50">Book a Demo</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Truck className="w-6 h-6 text-blue-600" />
            <span className="text-lg font-bold">PariLink</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            © {new Date().getFullYear()} PariLink, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
