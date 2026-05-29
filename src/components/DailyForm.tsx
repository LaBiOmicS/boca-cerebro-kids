import React from 'react';
import { DailyRecord, HygieneStatus, BehaviorStatus } from '../types';
import { 
  Calendar, 
  Sparkles, 
  AlertCircle, 
  Smile, 
  Frown, 
  Activity, 
  ShieldAlert, 
  CheckCircle,
  Stethoscope,
  Pill,
  Candy,
  FileText
} from 'lucide-react';

interface DailyFormProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  record: DailyRecord;
  onChange: (updated: DailyRecord) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

export default function DailyForm({
  selectedDate,
  onDateChange,
  record,
  onChange,
  onSave,
  isSaving
}: DailyFormProps) {

  const handleHygieneChange = (status: HygieneStatus) => {
    onChange({ ...record, hygiene: status });
  };

  const handleBehaviorChange = (status: BehaviorStatus) => {
    onChange({ ...record, behavior: status });
  };

  const toggleSymptom = (key: 'symptomHalito' | 'symptomGastro' | 'symptomSeletividade') => {
    onChange({ ...record, [key]: !record[key] });
  };

  const toggleIntervention = (key: 'intProbiotico' | 'intXilitol' | 'intMedicacao') => {
    onChange({ ...record, [key]: !record[key] });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...record, notes: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  const setToday = () => {
    const today = new Date().toISOString().split('T')[0];
    onDateChange(today);
  };

  const setYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0];
    onDateChange(dateStr);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24" id="daily-checkin-form">
      {/* 1. Date Selector Block */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-xs" id="section-date">
        <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
          <Calendar className="w-5 h-5 text-sky-500" />
          Data do Registro
        </label>
        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="flex-1 min-w-[140px] px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-450 bg-slate-50 font-medium text-slate-700 text-sm transition"
            id="date-input"
            max={new Date().toISOString().split('T')[0]}
            required
          />
          <button
            type="button"
            onClick={setToday}
            className={`px-4 py-2.5 rounded-2xl text-sm font-semibold border transition active:scale-95 ${
              selectedDate === new Date().toISOString().split('T')[0]
                ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-100'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            id="btn-preset-today"
          >
            Hoje
          </button>
          <button
            type="button"
            onClick={setYesterday}
            className="px-4 py-2.5 rounded-2xl text-sm font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition active:scale-95"
            id="btn-preset-yesterday"
          >
            Ontem
          </button>
        </div>
      </div>

      {/* 2. Hygiene Block */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-xs space-y-3.5" id="section-hygiene">
        <div>
          <h3 className="text-base font-semibold text-slate-800 flex items-center gap-1.5">
            <span className="text-xl">🪥</span>
            Higiene Bucal
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Como foi o processo de escovação e adesão da criança hoje?
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2.5" id="hygiene-options-grid">
          {/* Option: Fácil */}
          <button
            type="button"
            onClick={() => handleHygieneChange('Fácil')}
            className={`flex flex-col items-center gap-2 p-3.5 text-center rounded-2xl border-2 transition active:scale-95 ${
              record.hygiene === 'Fácil'
                ? 'bg-sky-50 border-sky-500 text-sky-850 font-bold shadow-xs'
                : 'bg-slate-50 border-slate-100/50 text-slate-500 hover:bg-slate-100/40'
            }`}
            id="hygiene-easy"
          >
            <span className="text-xl">😊</span>
            <span className="text-xs font-semibold">Fácil</span>
          </button>

          {/* Option: Com Resistência */}
          <button
            type="button"
            onClick={() => handleHygieneChange('Com Resistência')}
            className={`flex flex-col items-center gap-2 p-3.5 text-center rounded-2xl border-2 transition active:scale-95 ${
              record.hygiene === 'Com Resistência'
                ? 'bg-amber-50 border-amber-500 text-amber-850 font-bold shadow-xs'
                : 'bg-slate-50 border-slate-100/50 text-slate-500 hover:bg-slate-100/40'
            }`}
            id="hygiene-resistant"
          >
            <span className="text-xl">😟</span>
            <span className="text-xs font-semibold leading-none">Resistência</span>
          </button>

          {/* Option: Não Conseguiu */}
          <button
            type="button"
            onClick={() => handleHygieneChange('Não Conseguiu')}
            className={`flex flex-col items-center gap-2 p-3.5 text-center rounded-2xl border-2 transition active:scale-95 ${
              record.hygiene === 'Não Conseguiu'
                ? 'bg-rose-50 border-rose-500 text-rose-850 font-bold shadow-xs'
                : 'bg-slate-50 border-slate-100/50 text-slate-500 hover:bg-slate-100/40'
            }`}
            id="hygiene-failed"
          >
            <span className="text-xl">😰</span>
            <span className="text-xs font-semibold leading-none">Recusa</span>
          </button>
        </div>
      </div>

      {/* 3. Symptoms Block */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-xs space-y-3.5" id="section-symptoms">
        <div>
          <h3 className="text-base font-semibold text-slate-800 flex items-center gap-1.5">
            <span className="text-xl">⚠️</span>
            Sintomas Observados
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Mapeie possíveis marcadores de neuroinflamação ou disbiose:
          </p>
        </div>

        <div className="space-y-3" id="symptoms-checkbox-group">
          {/* Symptom: Hálito Forte */}
          <label className={`flex items-start gap-3.5 p-3.5 rounded-2xl border transition cursor-pointer select-none ${
            record.symptomHalito 
              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-medium' 
              : 'bg-slate-50 border-slate-100 hover:bg-slate-100/40'
          }`} id="label-halito">
            <input
              type="checkbox"
              checked={record.symptomHalito}
              onChange={() => toggleSymptom('symptomHalito')}
              className="mt-0.5 w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400 bg-white cursor-pointer"
            />
            <div>
              <p className="text-sm font-semibold text-slate-855 text-slate-800">Hálito Forte (Odor Alterado)</p>
              <p className="text-xs text-slate-500 mt-0.5">Pode expressar desequilíbrio na flora gengival ou jejum prolongado.</p>
            </div>
          </label>

          {/* Symptom: Desconforto Gastrointestinal */}
          <label className={`flex items-start gap-3.5 p-3.5 rounded-2xl border transition cursor-pointer select-none ${
            record.symptomGastro 
              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-medium' 
              : 'bg-slate-50 border-slate-100 hover:bg-slate-100/40'
          }`} id="label-gastro">
            <input
              type="checkbox"
              checked={record.symptomGastro}
              onChange={() => toggleSymptom('symptomGastro')}
              className="mt-0.5 w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400 bg-white cursor-pointer"
            />
            <div>
              <p className="text-sm font-semibold text-slate-855 text-slate-800">Desconforto Gastrointestinal ou Dor</p>
              <p className="text-xs text-slate-500 mt-0.5">Gases excessivos, cólicas frequentes ou episódios de refluxo hoje.</p>
            </div>
          </label>

          {/* Symptom: Seletividade Alimentar Extrema */}
          <label className={`flex items-start gap-3.5 p-3.5 rounded-2xl border transition cursor-pointer select-none ${
            record.symptomSeletividade 
              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-medium' 
              : 'bg-slate-50 border-slate-100 hover:bg-slate-100/40'
          }`} id="label-seletividade">
            <input
              type="checkbox"
              checked={record.symptomSeletividade}
              onChange={() => toggleSymptom('symptomSeletividade')}
              className="mt-0.5 w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400 bg-white cursor-pointer"
            />
            <div>
              <p className="text-sm font-semibold text-slate-855 text-slate-800">Seletividade Alimentar Extrema</p>
              <p className="text-xs text-slate-500 mt-0.5">Rejeição aguçada a determinadas texturas ou cores específicas do prato.</p>
            </div>
          </label>
        </div>
      </div>

      {/* 4. Behavior Block */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-xs space-y-3.5" id="section-behavior">
        <div>
          <h3 className="text-base font-semibold text-slate-800 flex items-center gap-1.5">
            <span className="text-xl">🎭</span>
            Comportamento Predominante
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Selecione o estado comportamental mais presente nas últimas 24 horas:
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2.5" id="behavior-options-grid">
          {/* Calmo */}
          <button
            type="button"
            onClick={() => handleBehaviorChange('Calmo')}
            className={`flex flex-col items-center justify-center py-3.5 rounded-2xl border-2 transition active:scale-95 ${
              record.behavior === 'Calmo'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-850 font-bold shadow-xs'
                : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100/40'
            }`}
            id="behavior-calmo"
          >
            <span className="text-2xl mb-1">😊</span>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Calmo</span>
          </button>

          {/* Agitado */}
          <button
            type="button"
            onClick={() => handleBehaviorChange('Agitado')}
            className={`flex flex-col items-center justify-center py-3.5 rounded-2xl border-2 transition active:scale-95 ${
              record.behavior === 'Agitado'
                ? 'bg-amber-50 border-amber-300 text-amber-850 font-bold shadow-xs'
                : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100/40'
            }`}
            id="behavior-agitado"
          >
            <span className="text-2xl mb-1">😟</span>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">Agitado</span>
          </button>

          {/* Crise/Meltdown */}
          <button
            type="button"
            onClick={() => handleBehaviorChange('Crise/Meltdown')}
            className={`flex flex-col items-center justify-center py-3.5 rounded-2xl border-2 transition active:scale-95 ${
              record.behavior === 'Crise/Meltdown'
                ? 'bg-rose-50 border-rose-300 text-rose-850 font-bold shadow-xs'
                : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100/40'
            }`}
            id="behavior-crise"
          >
            <span className="text-2xl mb-1">😰</span>
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wide">Crise</span>
          </button>
        </div>
      </div>

      {/* 5. Interventions Block */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-xs space-y-3.5" id="section-interventions">
        <div>
          <h3 className="text-base font-semibold text-slate-800 flex items-center gap-1.5">
            <span className="text-xl">💊</span>
            Intervenções Efetuadas
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Garantir a administração correta de moduladores orais/intestinais:
          </p>
        </div>

        <div className="space-y-3" id="interventions-switches">
          {/* Input: Probiótico */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Probiótico Diário</p>
                <p className="text-xs text-slate-450 text-slate-500">Auxílio no controle de patógenos.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleIntervention('intProbiotico')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                record.intProbiotico ? 'bg-sky-500' : 'bg-slate-200'
              }`}
              id="switch-probiotico"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  record.intProbiotico ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Input: Xilitol */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Candy className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Uso de Xilitol / Polióis</p>
                <p className="text-xs text-slate-450 text-slate-500">Favorece mineralização saudável.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleIntervention('intXilitol')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                record.intXilitol ? 'bg-sky-500' : 'bg-slate-200'
              }`}
              id="switch-xilitol"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  record.intXilitol ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Input: Medicação */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <Pill className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Medicação de Rotina</p>
                <p className="text-xs text-slate-450 text-slate-500">Emprego pontual das prescrições.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleIntervention('intMedicacao')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                record.intMedicacao ? 'bg-sky-500' : 'bg-slate-200'
              }`}
              id="switch-medicacao"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  record.intMedicacao ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 6. Notes Block */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-xs space-y-3.5" id="section-notes">
        <label className="block text-base font-semibold text-slate-700 flex items-center gap-1.5">
          <FileText className="w-5 h-5 text-slate-400" />
          Observações Clínicas (Opcional)
        </label>
        <textarea
          value={record.notes || ''}
          onChange={handleNotesChange}
          placeholder="Anote distúrbios de sono, texturas específicas rejeitadas ou fatos singulares do dia..."
          rows={3}
          className="w-full px-4 py-3.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-450 text-slate-700 transition"
          id="notes-textarea"
        />
      </div>

      {/* Save Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-95 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
          id="btn-save-record"
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Salvando localmente...
            </>
          ) : (
            <>
              <span>💾</span>
              Salvar Registro Diário
            </>
          )}
        </button>
      </div>
    </form>
  );
}
