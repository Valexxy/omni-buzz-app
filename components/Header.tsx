'use client';
import { MapPin, Zap, Activity } from 'lucide-react';

export default function SmartHeader({ locationName }: { locationName: string }) {
  return (
    <header className="py-16 px-8 border-b border-white/5 bg-black overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[120px] rounded-full" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-green-500/10 border border-green-500/20">
            <Activity className="w-3 h-3 text-green-500 animate-pulse" />
            <span className="text-[9px] font-mono tracking-[0.3em] text-green-500 uppercase font-bold">
              Uplink Stable
            </span>
          </div>
          <span className="h-[1px] w-12 bg-white/10" />
          <span className="text-[9px] font-mono tracking-[0.3em] text-gray-500 uppercase">
            ID: 09-FCT-OMNI
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter text-white uppercase leading-[0.8]">
              Live in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                {locationName}
              </span>
            </h1>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="flex items-center gap-2 text-gray-400 font-mono text-sm">
              <MapPin className="w-4 h-4 text-green-500" />
              <span className="tracking-widest italic uppercase">Geofence: Active</span>
            </div>
            <p className="max-w-[280px] text-gray-500 text-[11px] leading-relaxed md:text-right border-l md:border-l-0 md:border-r border-green-500/30 pl-4 md:pl-0 md:pr-4">
              Hyper-local intelligence feed prioritizing {locationName} merchant districts and regional infrastructure logistics.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
