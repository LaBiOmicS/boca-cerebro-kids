import React, { useState, useEffect } from 'react';
import { DailyRecord } from './types';
import { 
  openLocalDB, 
  saveDailyRecord, 
  getDailyRecord, 
  getAllDailyRecords, 
  deleteDailyRecord,
  clearAllDailyRecords
} from './db';
import Header from './components/Header';
import DailyForm from './components/DailyForm';
import HistoryList from './components/HistoryList';
import HelpSection from './components/HelpSection';
import { 
  PlusCircle, 
  History, 
  BookOpen, 
  CheckCircle2, 
  X,
  Sparkles,
  Info
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'registro' | 'historico' | 'ajuda'>('registro');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState<DailyRecord>({
    date: new Date().toISOString().split('T')[0],
    hygiene: '',
    symptomHalito: false,
    symptomGastro: false,
    symptomSeletividade: false,
    behavior: '',
    intProbiotico: false,
    intXilitol: false,
    intMedicacao: false,
    notes: '',
    updatedAt: Date.now()
  });

  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [lgpdConsentAccepted, setLgpdConsentAccepted] = useState<boolean>(() => {
    return localStorage.getItem('boca_cerebro_kids_consent') === 'accepted';
  });

  // Auto-dismiss toast helper
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load records count on mount
  useEffect(() => {
    loadAllRecords();
  }, []);

  // Whenever the date changes, load that date's record if it exists
  useEffect(() => {
    let active = true;
    async function fetchRecordForDate() {
      try {
        const existing = await getDailyRecord(selectedDate);
        if (active) {
          if (existing) {
            setCurrentRecord(existing);
          } else {
            // Generate clean initial values for this date
            setCurrentRecord({
              date: selectedDate,
              hygiene: '',
              symptomHalito: false,
              symptomGastro: false,
              symptomSeletividade: false,
              behavior: '',
              intProbiotico: false,
              intXilitol: false,
              intMedicacao: false,
              notes: '',
              updatedAt: Date.now()
            });
          }
        }
      } catch (e: any) {
        showToast(e.message || 'Erro ao carregar dados do dia.', 'error');
      }
    }
    fetchRecordForDate();
    return () => {
      active = false;
    };
  }, [selectedDate]);

  const loadAllRecords = async () => {
    try {
      const all = await getAllDailyRecords();
      setRecords(all);
    } catch (e: any) {
      showToast(e.message || 'Erro ao carregar histórico local.', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveDailyRecord(currentRecord);
      await loadAllRecords();
      showToast('Registro do dia persistido localmente com sucesso! ✨', 'success');
      
      // Prompt user to check the timeline or celebrate!
      setTimeout(() => {
        setActiveTab('historico');
      }, 1000);
    } catch (e: any) {
      showToast(e.message || 'Falha ao salvar dados.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditRecord = (record: DailyRecord) => {
    setSelectedDate(record.date);
    setCurrentRecord({ ...record });
    setActiveTab('registro');
    showToast(`Carregado registro de ${record.date} para edição.`, 'info');
  };

  const handleDeleteRecord = async (date: string) => {
    try {
      await deleteDailyRecord(date);
      await loadAllRecords();
      showToast(`Registro de ${date} excluído com sucesso.`, 'info');

      // If delete requested was for selected date, reset form inputs
      if (selectedDate === date) {
        setCurrentRecord({
          date: selectedDate,
          hygiene: '',
          symptomHalito: false,
          symptomGastro: false,
          symptomSeletividade: false,
          behavior: '',
          intProbiotico: false,
          intXilitol: false,
          intMedicacao: false,
          notes: '',
          updatedAt: Date.now()
        });
      }
    } catch (e: any) {
      showToast(e.message || 'Falha ao excluir registro.', 'error');
    }
  };

  const handleClearAllRecords = async () => {
    try {
      await clearAllDailyRecords();
      await loadAllRecords();
      // Reset currently selected record to initial blank state
      setCurrentRecord({
        date: selectedDate,
        hygiene: '',
        symptomHalito: false,
        symptomGastro: false,
        symptomSeletividade: false,
        behavior: '',
        intProbiotico: false,
        intXilitol: false,
        intMedicacao: false,
        notes: '',
        updatedAt: Date.now()
      });
      showToast('Todos os registros locais foram excluídos em conformidade com o Direito ao Esquecimento da LGPD. 🗑️', 'info');
    } catch (e: any) {
      showToast('Falha ao excluir base de dados: ' + e.message, 'error');
    }
  };

  const handleImportJSON = async (importedRecords: any[]) => {
    try {
      let count = 0;
      for (const rec of importedRecords) {
        if (rec && typeof rec === 'object' && rec.date) {
          await saveDailyRecord({
            date: String(rec.date),
            hygiene: (rec.hygiene ? String(rec.hygiene) : '') as any,
            symptomHalito: Boolean(rec.symptomHalito),
            symptomGastro: Boolean(rec.symptomGastro),
            symptomSeletividade: Boolean(rec.symptomSeletividade),
            behavior: (rec.behavior ? String(rec.behavior) : '') as any,
            intProbiotico: Boolean(rec.intProbiotico),
            intXilitol: Boolean(rec.intXilitol),
            intMedicacao: Boolean(rec.intMedicacao),
            notes: rec.notes ? String(rec.notes) : '',
            updatedAt: typeof rec.updatedAt === 'number' ? rec.updatedAt : Date.now()
          });
          count++;
        }
      }
      await loadAllRecords();
      
      // Refresh current records if edited record date is affected
      const currentSelectedFromDb = await getDailyRecord(selectedDate);
      if (currentSelectedFromDb) {
        setCurrentRecord(currentSelectedFromDb);
      }
      showToast(`${count} registros importados e salvos com sucesso no seu dispositivo!  ✨`, 'success');
    } catch (e: any) {
      showToast('Falha na importação: ' + e.message, 'error');
    }
  };

  // Export functions
  const handleExportCSV = () => {
    if (records.length === 0) {
      showToast('Sem registros para exportar.', 'info');
      return;
    }

    try {
      const headers = [
        "Data", 
        "Higiene Bucal", 
        "Halito Alterado (Sim/Nao)", 
        "Desconforto Gastrointestinal (Sim/Nao)", 
        "Seletividade Alimentar Extrema (Sim/Nao)", 
        "Comportamento Predominante", 
        "Intervencao Probiotico (Sim/Nao)", 
        "Intervencao Xilitol (Sim/Nao)", 
        "Intervencao Medicacao Regular (Sim/Nao)", 
        "Observacoes"
      ];

      const csvRows = [
        headers.join(';'), // Semicolon works beautifully for Brazilian-configured Microsoft Excel
        ...records.map(r => [
          r.date,
          r.hygiene || "Nao Informado",
          r.symptomHalito ? "Sim" : "Nao",
          r.symptomGastro ? "Sim" : "Nao",
          r.symptomSeletividade ? "Sim" : "Nao",
          r.behavior || "Nao Informado",
          r.intProbiotico ? "Sim" : "Nao",
          r.intXilitol ? "Sim" : "Nao",
          r.intMedicacao ? "Sim" : "Nao",
          `"${(r.notes || "").replace(/"/g, '""')}"`
        ].join(';'))
      ];

      const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(csvRows.join("\n"));
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      link.setAttribute("download", `BocaCerebro_Kids_Relatorio_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Arquivo CSV baixado com sucesso! Envie para o especialista.', 'success');
    } catch (e: any) {
      showToast('Erro ao formatar CSV: ' + e.message, 'error');
    }
  };

  const handleExportJSON = () => {
    if (records.length === 0) {
      showToast('Sem registros para exportar.', 'info');
      return;
    }

    try {
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(records, null, 2)
      )}`;
      const link = document.createElement("a");
      link.setAttribute("href", jsonString);
      link.setAttribute("download", `BocaCerebro_Kids_Database_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Banco de dados em formato JSON baixado com sucesso!', 'success');
    } catch (e: any) {
      showToast('Erro ao exportar JSON: ' + e.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f9ff] flex flex-col font-sans" id="app-root-container">
      {/* Header */}
      <Header />

      {/* Main Responsive Content */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-5 pb-28" id="app-main-content">
        
        {!lgpdConsentAccepted ? (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-xs space-y-5 animate-fadeIn" id="lgpd-consent-card">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto" id="consent-icon-container">
                <span className="text-2xl">🛡️</span>
              </div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Privacidade e Consentimento Parental</h2>
              <p className="text-xs text-sky-600 font-bold uppercase tracking-wider">Acordo Geral de Proteção de Dados (LGPD)</p>
            </div>

            <div className="text-xs text-slate-600 space-y-4 leading-relaxed max-h-72 overflow-y-auto pr-1 border-b border-b-slate-100 pb-2">
              <p>
                Olá, pai, mãe ou cuidador(a)! Conforme os requisitos da <strong>LGPD brasileira (Lei nº 13.709/18 - Art. 14)</strong>, o tratamento de dados pessoais de crianças deve ser realizado com consentimento específico de um dos responsáveis.
              </p>
              
              <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100/50 space-y-2.5 text-slate-700">
                <p className="font-bold text-[11px] text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                  🛡️ Segurança e Privacidade (CIA):
                </p>
                <ul className="list-disc pl-4 space-y-2 text-[11px] text-slate-650">
                  <li><strong>Confidencialidade:</strong> As informações do seu filho de saúde diária (como hálito, comportamento e intestino) são mantidas <strong>100% salvas de forma estritamente local</strong> neste navegador de internet (IndexedDB). Nenhum dado é mandado ou processado em nuvem.</li>
                  <li><strong>Integridade:</strong> Você possui controle para exportar relatórios intactos em planilhas ou de forma completa para backups seguros.</li>
                  <li><strong>Disponibilidade:</strong> Funcionamento integral em cenários sem rede/internet corporativa ou móvel.</li>
                </ul>
              </div>

              <p>
                <strong>Seus Direitos como Titular (Art. 18):</strong><br />
                Você retém domínio total sobre os dados médicos compilados. Você pode alterar, apagar de forma individual ou redefinir a base inteira a qualquer momento pela opção <em>"Excluir Tudo"</em> na aba Histórico (Direito ao Esquecimento).
              </p>
            </div>

            {/* Checkbox agreements */}
            <div className="space-y-3 pt-1">
              <label className="flex items-start gap-3.5 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  id="chk-consent-guardian"
                  className="mt-0.5 rounded border-slate-300 text-sky-500 focus:ring-sky-400 bg-white cursor-pointer h-5 w-5 shrink-0"
                />
                <span className="text-xs text-slate-600 font-medium leading-normal">
                  Declaro que sou o <strong>responsável legal</strong> pela criança monitorada.
                </span>
              </label>

              <label className="flex items-start gap-3.5 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  id="chk-consent-local-storage"
                  className="mt-0.5 rounded border-slate-300 text-sky-500 focus:ring-sky-400 bg-white cursor-pointer h-5 w-5 shrink-0"
                />
                <span className="text-xs text-slate-600 font-medium leading-normal">
                  Consinto com o preenchimento de dados de hábitos e humor <strong>estritamente locais</strong> no dispositivo.
                </span>
              </label>
            </div>

            <button
              onClick={() => {
                const chk1 = document.getElementById('chk-consent-guardian') as HTMLInputElement;
                const chk2 = document.getElementById('chk-consent-local-storage') as HTMLInputElement;
                if (chk1?.checked && chk2?.checked) {
                  localStorage.setItem('boca_cerebro_kids_consent', 'accepted');
                  setLgpdConsentAccepted(true);
                  showToast('Termo e consentimento LGPD aceito com sucesso! ✨', 'success');
                } else {
                  showToast('Por favor, assinale as duas declarações acima para liberar o portal.', 'error');
                }
              }}
              className="w-full flex items-center justify-center bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl py-3.5 px-4 shadow-sm active:scale-95 transition text-xs"
              id="btn-accept-lgpd-consent"
            >
              Aceitar e Iniciar Registro Seguro
            </button>
          </div>
        ) : (
          <>
            {/* State Banner - Warn if database is empty on start */}
            {records.length === 0 && activeTab === 'registro' && (
              <div className="mb-4.5 p-4 bg-sky-50 border border-sky-100 rounded-3xl text-xs text-sky-900 flex items-start gap-2.5 animate-fadeIn" id="welcome-tip-card">
                <span className="text-lg shrink-0">✨</span>
                <div>
                  <p className="font-bold">Bem-vindo(a) ao BocaCérebro Kids!</p>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">Utilize o formulário abaixo para registrar o acompanhamento diário. Seus dados são salvos localmente e podem ser consultados na aba Histórico.</p>
                </div>
              </div>
            )}

            {/* Tab Viewport Router */}
            <div className="tab-viewport" id="tab-router-container">
              {activeTab === 'registro' && (
                <DailyForm 
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  record={currentRecord}
                  onChange={setCurrentRecord}
                  onSave={handleSave}
                  isSaving={isSaving}
                />
              )}

              {activeTab === 'historico' && (
                <HistoryList 
                  records={records}
                  onEdit={handleEditRecord}
                  onDelete={handleDeleteRecord}
                  onExportCSV={handleExportCSV}
                  onExportJSON={handleExportJSON}
                  onImportJSON={handleImportJSON}
                  onClearAll={handleClearAllRecords}
                />
              )}

              {activeTab === 'ajuda' && (
                <HelpSection />
              )}
            </div>
          </>
        )}
      </main>

      {/* Toast Notification Banner (Floating Over Layout) */}
      {toast && (
        <div 
          className="fixed bottom-24 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-xl flex items-start gap-3 z-50 animate-slideUp" 
          id="system-toast"
        >
          <div className="mt-0.5">
            {toast.type === 'success' && <span className="text-sm">🌟</span>}
            {toast.type === 'info' && <span className="text-sm">ℹ️</span>}
            {toast.type === 'error' && <span className="text-sm">⚠️</span>}
          </div>
          <p className="text-xs font-semibold text-slate-100 flex-1 leading-normal">
            {toast.message}
          </p>
          <button 
            onClick={() => setToast(null)} 
            className="text-slate-400 hover:text-slate-100 transition p-0.5 rounded-lg hover:bg-slate-800"
            id="close-toast-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sticky Bottom Touch-Navigation Bar (Mobile-First Layout) */}
      <nav 
        className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md rounded-t-3xl border-t border-slate-200/50 px-4 py-2.5 shadow-[0_-5px_15px_rgba(0,0,0,0.03)] z-40" 
        id="app-bottom-navbar"
      >
        <div className="max-w-md mx-auto grid grid-cols-3 gap-1">
          {/* TAB 1: Registro */}
          <button
            type="button"
            onClick={() => setActiveTab('registro')}
            className={`flex flex-col items-center justify-center py-2 rounded-2xl transition active:scale-95 ${
              activeTab === 'registro' 
                ? 'bg-sky-50 text-sky-600 font-bold' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
            id="nav-tab-registro"
          >
            <span className={`text-lg ${activeTab === 'registro' ? 'scale-110' : 'opacity-80'} transition-transform`}>📝</span>
            <span className="text-[10px] mt-0.5 tracking-tight font-bold">Check-in</span>
          </button>

          {/* TAB 2: Histórico */}
          <button
            type="button"
            onClick={() => setActiveTab('historico')}
            className={`flex flex-col items-center justify-center py-2 rounded-2xl transition active:scale-95 ${
              activeTab === 'historico' 
                ? 'bg-sky-50 text-sky-600 font-bold' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
            id="nav-tab-historico"
          >
            <div className="relative">
              <span className={`text-lg ${activeTab === 'historico' ? 'scale-110' : 'opacity-80'} transition-transform`}>🗓️</span>
              {records.length > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-emerald-500 text-white font-extrabold text-[8px] h-3.5 min-w-3.5 px-1 rounded-full flex items-center justify-center border border-white">
                  {records.length}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-bold">Histórico</span>
          </button>

          {/* TAB 3: Ajuda / Ciência */}
          <button
            type="button"
            onClick={() => setActiveTab('ajuda')}
            className={`flex flex-col items-center justify-center py-2 rounded-2xl transition active:scale-95 ${
              activeTab === 'ajuda' 
                ? 'bg-sky-50 text-sky-600 font-bold' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
            id="nav-tab-ajuda"
          >
            <span className={`text-lg ${activeTab === 'ajuda' ? 'scale-110' : 'opacity-80'} transition-transform`}>📚</span>
            <span className="text-[10px] mt-0.5 tracking-tight font-bold">Saber Mais</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
