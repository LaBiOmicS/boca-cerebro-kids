import React, { useState, useRef } from 'react';
import { DailyRecord } from '../types';
import { 
  Download, 
  Edit2, 
  Trash2, 
  Calendar, 
  ShieldAlert, 
  Activity,
  FileDown,
  Info,
  CalendarCheck,
  Upload,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

interface HistoryListProps {
  records: DailyRecord[];
  onEdit: (record: DailyRecord) => void;
  onDelete: (date: string) => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onImportJSON: (imported: DailyRecord[]) => void;
  onClearAll: () => void;
}

export default function HistoryList({
  records,
  onEdit,
  onDelete,
  onExportCSV,
  onExportJSON,
  onImportJSON,
  onClearAll
}: HistoryListProps) {
  const [deleteConfirmDate, setDeleteConfirmDate] = useState<string | null>(null);
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatDateLabel = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'short' });
      }
    } catch (e) {
      // fallback
    }
    return dateStr;
  };

  const getHygieneBadge = (status: DailyRecord['hygiene']) => {
    switch (status) {
      case 'Fácil':
        return <span className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold px-3 py-1 rounded-full">😊 Fácil</span>;
      case 'Com Resistência':
        return <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full">😟 Resistência</span>;
      case 'Não Conseguiu':
        return <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold px-3 py-1 rounded-full">😰 Impedido</span>;
      default:
        return <span className="inline-flex items-center bg-slate-100 text-slate-500 text-xs px-2.5 py-1 rounded-full">Não Informado</span>;
    }
  };

  const getBehaviorBadge = (status: DailyRecord['behavior']) => {
    switch (status) {
      case 'Calmo':
        return <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full">✨ Calmo</span>;
      case 'Agitado':
        return <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full">⚡ Agitado</span>;
      case 'Crise/Meltdown':
        return <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-1 rounded-full">🚨 Crise</span>;
      default:
        return <span className="inline-flex items-center bg-slate-100 text-slate-500 text-xs px-2.5 py-1 rounded-full">Não Informado</span>;
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (Array.isArray(parsed)) {
          // simple schema validation
          const isValid = parsed.every(r => r && typeof r === 'object' && typeof r.date === 'string');
          if (isValid) {
            onImportJSON(parsed);
          } else {
            setImportError('Estrutura de arquivo inválida. Forneça um arquivo JSON exportado por este app.');
          }
        } else {
          setImportError('O arquivo selecionado não contém uma listagem de registros válidos.');
        }
      } catch (err) {
        setImportError('Erro ao processar arquivo JSON. Certifique-se de que é um formato correto.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset file input
  };

  return (
    <div className="space-y-6 pb-24" id="history-section">
      
      {/* LOCAL STORAGE WARNING BANNER */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 space-y-3.5 shadow-xs" id="privacy-warning-box">
        <div className="flex items-start gap-3 text-amber-900">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-650 text-amber-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-850 uppercase tracking-wide">Privacidade e Armazenamento 100% Local</h4>
            <p className="text-xs text-amber-600 font-medium mt-0.5 leading-relaxed">
              O BocaCérebro Kids <strong>não envia os dados do seu filho para a internet ou servidores externos</strong>.
            </p>
          </div>
        </div>
        <p className="text-xs text-amber-850 leading-relaxed font-semibold">
          ⚠️ ATENÇÃO: As informações ficam salvas unicamente neste navegador (IndexedDB). Se você desinstalar o navegador, limpar o histórico de navegação ou formatar o dispositivo, esses registros serão excluídos permanentemente.
        </p>
        <div className="flex items-center gap-1.5 p-3 bg-white/60 rounded-xl border border-amber-200/50 text-xs text-amber-900 leading-normal font-medium">
          <Lightbulb className="w-4 h-4 shrink-0 text-amber-600" />
          <span>Fazer exportações periódicas (backups) garante que você nunca perderá o histórico clínico da criança.</span>
        </div>
      </div>

      {/* EXPORT / IMPORT CONTROLS BOX */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-xs space-y-4" id="export-controls">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 animate-pulse">
            <Download className="w-5 h-5 text-sky-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-700">Compartilhar e Guardar Dados</h3>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              Leve os relatórios consolidados em formato amigável para apresentar aos neuropediatras, dentistas ou fonoaudiólogos e enriqueça a avaliação clínica.
            </p>
          </div>
        </div>

        {/* Action Buttons: Export */}
        <div className="space-y-3">
          {records.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={onExportCSV}
                className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl py-3.5 px-4 shadow-sm active:scale-95 transition text-xs"
                id="btn-export-csv"
                title="Consolida relatórios no formato compatível com planilhas Excel"
              >
                <FileDown className="w-4 h-4" />
                Baixar Planilha (CSV)
              </button>
              <button
                onClick={onExportJSON}
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-2xl py-3.5 px-4 shadow-sm active:scale-95 transition text-xs"
                id="btn-export-json"
                title="Exporta o arquivo de backup completo para restaurar posteriormente"
              >
                <Download className="w-4 h-4" />
                Backup Geral (JSON)
              </button>
            </div>
          ) : (
            <div className="text-center py-4 text-xs text-slate-400 italic bg-slate-50 rounded-2xl border border-dashed border-slate-200/60">
              Registre o primeiro dia de check-in para liberar os botões de download.
            </div>
          )}

          <div className="border-t border-slate-100 pt-3 flex flex-col gap-3">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".json" 
              onChange={handleFileChange} 
            />
            <button
              onClick={handleImportClick}
              className="w-full flex items-center justify-center gap-2 bg-sky-50 hover:bg-sky-100 text-sky-700 hover:text-sky-850 font-bold rounded-2xl py-3 px-4 border border-sky-100 transition active:scale-95 text-xs"
              id="btn-trigger-import"
            >
              <Upload className="w-4 h-4" />
              Restaurar de Backup Anterior (Importar JSON)
            </button>

            {importError && (
              <p className="text-[11px] font-semibold text-rose-500 mt-2 bg-rose-50 border border-rose-100 p-2.5 rounded-xl animate-fadeIn">
                ⚠️ {importError}
              </p>
            )}

            {/* LGPD Right to be Forgotten / Erasure controls */}
            {records.length > 0 && (
              <div className="border-t border-rose-100/50 pt-3 mt-1" id="lgpd-erasure-section">
                {!showWipeConfirm ? (
                  <button
                    onClick={() => setShowWipeConfirm(true)}
                    className="w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100/80 text-rose-750 text-rose-700 font-bold rounded-2xl py-2.5 px-4 transition active:scale-95 text-xs"
                    id="btn-wipe-all-pre"
                    title="Apaga permanentemente todos os seus dados deste dispositivo"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir Tudo (Direito de Eliminação - LGPD)
                  </button>
                ) : (
                  <div className="bg-rose-50 border border-rose-250 border-rose-200 rounded-2xl p-4 space-y-3 animate-fadeIn" id="wipe-confirmation-card">
                    <p className="text-xs font-bold text-rose-900 leading-normal">
                      ⚠️ Tem certeza absoluta? Esta ação é irreversível e apagará TODOS os {records.length} registros salvos localmente neste navegador!
                    </p>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setShowWipeConfirm(false)}
                        className="px-3.5 py-2 text-xs font-bold border border-slate-200 bg-white rounded-xl text-slate-600 hover:bg-slate-50 transition active:scale-95"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => {
                          onClearAll();
                          setShowWipeConfirm(false);
                        }}
                        className="px-4 py-2 text-xs font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition active:scale-95"
                        id="btn-wipe-all-confirm"
                      >
                        Confirmar Exclusão Total
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TIMELINE LIST */}
      <div className="space-y-4" id="history-timeline-list">
        <h3 className="text-sm font-bold text-slate-550 uppercase tracking-widest px-1 flex items-center gap-1.5">
          <CalendarCheck className="w-4.5 h-4.5 text-emerald-500" />
          Histórico de Acompanhamento ({records.length} {records.length === 1 ? 'dia' : 'dias'})
        </h3>

        {records.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/60 text-center space-y-4 shadow-xs" id="empty-history-placeholder">
            <div className="w-14 h-14 bg-slate-50 text-slate-350 rounded-full flex items-center justify-center mx-auto" id="empty-icon-container">
              <span className="text-3xl">🗓️</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-600">Nenhum registro encontrado</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Comece completando o formulário na aba de "Check-in" para salvar o primeiro dia no banco local.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => {
              const hasSymptoms = record.symptomHalito || record.symptomGastro || record.symptomSeletividade;
              const hasInterventions = record.intProbiotico || record.intXilitol || record.intMedicacao;

              return (
                <div 
                  key={record.date} 
                  className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-xs hover:border-slate-300 transition space-y-3.5"
                  id={`record-card-${record.date}`}
                >
                  {/* Card Header: Date & Control Buttons */}
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-sky-50 text-sky-600 shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-750 text-slate-705 uppercase tracking-wide">
                        {formatDateLabel(record.date)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onEdit(record)}
                        className="p-1 px-3 py-1.5 rounded-xl border border-slate-100 hover:bg-slate-50 text-blue-600 text-xs flex items-center gap-1 font-bold transition active:scale-95"
                        title="Editar"
                        id={`btn-edit-${record.date}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Editar
                      </button>
                      <button
                        onClick={() => setDeleteConfirmDate(record.date)}
                        className="p-1 px-3 py-1.5 rounded-xl border border-slate-100 hover:bg-rose-50 text-rose-600 text-xs flex items-center gap-1 font-bold transition active:scale-95"
                        title="Excluir"
                        id={`btn-delete-${record.date}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Apagar
                      </button>
                    </div>
                  </div>

                  {/* Confirmation Modal Inline */}
                  {deleteConfirmDate === record.date && (
                    <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl flex flex-col gap-2.5 animate-fadeIn" id="delete-confirm-panel">
                      <div className="flex items-start gap-1.5 text-xs text-rose-700">
                        <Info className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="font-semibold leading-relaxed">Deseja apagar permanentemente esse dia de registro? Essa ação não pode ser desfeita.</span>
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <button 
                          onClick={() => setDeleteConfirmDate(null)} 
                          className="px-3.5 py-2 text-xs font-bold border border-slate-200 bg-white rounded-xl text-slate-600 hover:bg-slate-50 transition active:scale-95"
                        >
                          Cancelar
                        </button>
                        <button 
                          onClick={() => {
                            onDelete(record.date);
                            setDeleteConfirmDate(null);
                          }} 
                          className="px-3.5 py-2 text-xs font-bold bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition active:scale-95"
                        >
                          Confirmar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Badges Overview Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-slate-100">
                    <div className="space-y-1">
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Higiene</div>
                      <div>{getHygieneBadge(record.hygiene)}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Humor / Foco</div>
                      <div>{getBehaviorBadge(record.behavior)}</div>
                    </div>
                  </div>

                  {/* Secondary Symptoms row */}
                  {hasSymptoms && (
                    <div className="space-y-1.5 pb-0.5" id="record-symptoms-list">
                      <div className="text-xs text-slate-550 text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
                        Sintomas Detectados
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {record.symptomHalito && (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-100">Hálito Alterado</span>
                        )}
                        {record.symptomGastro && (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-100">Desconforto Gastro</span>
                        )}
                        {record.symptomSeletividade && (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-100">Seletividade Extrema</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Interventions list row */}
                  {hasInterventions && (
                    <div className="space-y-1.5 pb-0.5" id="record-interventions-list">
                      <div className="text-xs text-slate-550 text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-teal-405 text-sky-505 text-sky-500" />
                        Intervenções
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {record.intProbiotico && (
                          <span className="px-2.5 py-1 bg-sky-50 text-sky-800 text-xs font-semibold rounded-lg border border-sky-100">Probiótico</span>
                        )}
                        {record.intXilitol && (
                          <span className="px-2.5 py-1 bg-sky-50 text-sky-800 text-xs font-semibold rounded-lg border border-sky-100">Xilitol</span>
                        )}
                        {record.intMedicacao && (
                          <span className="px-2.5 py-1 bg-sky-50 text-sky-800 text-xs font-semibold rounded-lg border border-sky-100">Medicação</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Optional Notes Row */}
                  {record.notes && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 text-sm text-slate-600 italic break-words leading-relaxed" id="record-notes">
                      "{record.notes}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
