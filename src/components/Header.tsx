import React from 'react';
import { Brain, Sparkles, ShieldCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-sky-500 via-sky-500 to-indigo-500 text-white pt-6 pb-5 px-6 rounded-b-3xl shadow-lg sticky top-0 z-30" id="app-header">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          {/* HD Crisp Vector Layered Logo */}
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner" id="logo-container">
            <Brain className="w-7 h-7 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]" />
            {/* Embedded vector shine badge for oral health connection */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-sky-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-display font-bold tracking-tight text-white" id="app-title">
              BocaCérebro <span className="text-sky-200">Kids</span>
            </h1>
            <p className="text-xs text-sky-100 font-bold tracking-wide opacity-95" id="app-subtitle">
              Eixo Boca-Cérebro no Autismo (TEA)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-sky-600/50 backdrop-blur-xs text-sky-100 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-sky-400/30 font-sans" id="offline-badge">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Offline Ativo
        </div>
      </div>
    </header>
  );
}
