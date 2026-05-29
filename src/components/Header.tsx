import React from 'react';
import { Brain, Smile } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-sky-500 text-white pt-6 pb-5 px-6 rounded-b-3xl shadow-lg sticky top-0 z-30" id="app-header">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-sky-400 border-2 border-sky-300" id="logo-container">
            <span className="text-xl">🧠</span>
            <span className="absolute -bottom-1 -right-1 text-xs">🪥</span>
          </div>
          <div>
            <h1 className="text-xl font-display font-bold tracking-tight text-white" id="app-title">
              BocaCérebro <span className="text-sky-200">Kids</span>
            </h1>
            <p className="text-[11px] text-sky-100 font-medium tracking-wide opacity-95" id="app-subtitle">
              Eixo Boca-Cérebro no Autismo (TEA)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-sky-600/50 backdrop-blur-xs text-sky-100 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-sky-400/30" id="offline-badge">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Offline Ativo
        </div>
      </div>
    </header>
  );
}
