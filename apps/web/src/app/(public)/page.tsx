import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Truck, BarChart3, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'PariLink | Modern Logistics Operating System',
  description: 'The all-in-one platform for Indian transport and logistics companies.',
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-24 md:py-32 lg:py-40 bg-slate-50 dark:bg-slate-900">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Run your entire fleet on <span className="text-blue-600">Autopilot</span>
            </h1>
            <p className="max-w-[700px] mx-auto text-xl text-slate-600 dark:text-slate-300 mb-8">
              PariLink unifies dispatch, GPS telemetry, and invoicing into one powerful platform. Built specifically for modern Indian transporters.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg">
                <Link href="/book-demo" className="flex items-center">
                  Book a Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                <Link href="/features">Explore Features</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-20">
          <div className="container px-4 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Live Control Tower</h3>
              <p className="text-slate-600">Track every vehicle and trip in real-time on a single unified map interface.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Invoicing</h3>
              <p className="text-slate-600">Drivers upload PODs from the mobile app, letting you generate invoices in seconds.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
              <p className="text-slate-600">Bank-grade encryption and granular role-based access control for your data.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
