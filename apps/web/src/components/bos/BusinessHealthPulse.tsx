'use client';

import { useState, useEffect } from 'react';
import { Activity, TrendingUp, AlertTriangle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function BusinessHealthPulse() {
  const [operationalScore, setOperationalScore] = useState(85);
  const [financialScore, setFinancialScore] = useState(92);
  const [isOpen, setIsOpen] = useState(false);
  const [factors, setFactors] = useState({
    activeAnomalies: 2,
    unresolvedExceptions: 4,
    revenueMomentum: 'Strong',
    arAging: 'Low Risk',
  });

  useEffect(() => {
    // In a real implementation, we connect to EventSource at /api/v1/health/pulse
    // or /api/v1/events/stream and listen for 'BusinessHealth.Updated'.
    // Here we simulate live pulses for the demo.
    const interval = setInterval(() => {
      setOperationalScore((prev) => {
        const jump = Math.random() > 0.5 ? 1 : -1;
        return Math.min(100, Math.max(0, prev + jump));
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 70) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  const getTextColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-rose-500';
  };

  const avgScore = Math.round((operationalScore + financialScore) / 2);

  return (
    <div className="relative z-50">
      {/* Ambient Navbar Indicator */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 px-3 py-1.5 rounded-full border transition-all duration-300",
          getScoreColor(avgScore),
          "hover:bg-background/50 hover:shadow-sm"
        )}
      >
        <div className="relative flex h-2 w-2">
          {avgScore < 90 && (
            <span className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              avgScore < 70 ? "bg-rose-500" : "bg-amber-500"
            )}></span>
          )}
          <span className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            getTextColor(avgScore)
          )}></span>
        </div>
        <span className="text-xs font-bold tracking-wider uppercase">BOS Vitals: {avgScore}</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {/* Flyout Health Center */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="p-4 border-b border-border bg-muted/20">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Business Health Engine
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Real-time aggregate across all operating sectors.</p>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Operational */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Operational Score</span>
                <span className={cn("font-bold text-sm", getTextColor(operationalScore))}>{operationalScore}/100</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className={cn("h-1.5 rounded-full transition-all duration-500", getTextColor(operationalScore).replace('text', 'bg'))} style={{ width: `${operationalScore}%` }}></div>
              </div>
              <div className="flex gap-2 text-xs mt-2">
                <span className="bg-rose-500/10 text-rose-500 px-1.5 py-0.5 rounded border border-rose-500/20">{factors.activeAnomalies} Anomalies</span>
                <span className="bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20">{factors.unresolvedExceptions} Exceptions</span>
              </div>
            </div>

            {/* Financial */}
            <div className="space-y-2 pt-2 border-t border-border/50">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Financial Score</span>
                <span className={cn("font-bold text-sm", getTextColor(financialScore))}>{financialScore}/100</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className={cn("h-1.5 rounded-full transition-all duration-500", getTextColor(financialScore).replace('text', 'bg'))} style={{ width: `${financialScore}%` }}></div>
              </div>
              <div className="flex gap-2 text-xs mt-2">
                <span className="bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded border border-emerald-500/20">{factors.revenueMomentum} Momentum</span>
                <span className="bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded border border-emerald-500/20">{factors.arAging}</span>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-muted/30 border-t border-border">
            <Button variant="ghost" size="sm" className="w-full text-xs h-7 justify-between">
              View Detailed Diagnostic <TrendingUp className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
