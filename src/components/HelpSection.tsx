import React from 'react';
import { 
  AlertTriangle, 
  Compass, 
  Smile, 
  Brain, 
  Lock
} from 'lucide-react';

export default function HelpSection() {
  return (
    <div className="space-y-5 pb-24" id="help-articles-section">
      {/* SECTION 1: EXPLAINER OF MOUTH-BRAIN AXIS */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-xs space-y-4" id="axis-explainer">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5" id="about-title">
          <span>🧠</span>
          O Eixo Boca-Cérebro no Autismo (TEA)
        </h3>

        <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
          <p>
            Tradicionalmente, muito se discute sobre o eixo <strong>intestino-cérebro</strong>. No entanto, estudos recentes na neurobiologia destacam que o <strong>eixo boca-cérebro</strong> desempenha um papel igualmente transformador, principalmente no Transtorno do Espectro Autista (TEA).
          </p>
          
          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 space-y-2.5">
            <h4 className="font-bold text-sky-900 flex items-center gap-1.5 text-xs">
              <span>🦷</span>
              Conexões Biológicas Chave:
            </h4>
            <ul className="list-disc pl-4 space-y-2 text-[11px] text-slate-600">
              <li>
                <strong>Disbiose Oral:</strong> A boca abriga a segunda maior comunidade microbiana do corpo. Desequilíbrios na flora gengival abrem caminho para patógenos liberarem lipopolissacarídeos (LPS) no sangue, provocando neuroinflamação.
              </li>
              <li>
                <strong>O Fagoma Oral:</strong> Refere-se à comunidade de fagos (vírus bacterianos). Alterações nessa população geram metabólitos que alcançam as terminações do nervo vago e barreira hematoencefálica.
              </li>
              <li>
                <strong>Estresse Oxidativo:</strong> A sobrecarga imunológica por micróbios cariogênicos induz estresse oxidativo, comumente relacionado a picos de agitação motora, hipersensibilidade sensorial extrema e indisposição comportamental.
              </li>
              <li>
                <strong>Seletividade Alimentar:</strong> Dor dental silenciosa ou gengivite crônica invisível muitas vezes é o gatilho oculto para episódios de seletividade alimentar severa ou crises sensoriais durante as refeições.
              </li>
            </ul>
          </div>
          
          <p>
            Monitorar estes sinais em conjunto com parâmetros comportamentais permite aos cuidadores e profissionais de saúde mapear padrões de bem-estar mais sutis e adotar medidas integrativas preventivas com antecedência.
          </p>
        </div>
      </div>

      {/* SECTION 2: HOW TO USE GUIDE */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-xs space-y-4" id="guide-section">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
          <Compass className="w-5 h-5 text-sky-500" />
          Guia de Utilização
        </h3>

        <div className="space-y-3.5 text-xs text-slate-600">
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-xs shrink-0">1</div>
            <div>
              <p className="font-semibold text-slate-700">Verifique a Data de Registro</p>
              <p className="text-slate-400 mt-0.5">Use "Hoje" ou escolha uma data específica no calendário para lançamentos retroativos.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-xs shrink-0">2</div>
            <div>
              <p className="font-semibold text-slate-700">Preencha as Seções Clínicas</p>
              <p className="text-slate-400 mt-0.5">Informe os níveis de higiene bucal, sintomas apresentados, comportamento predominante e intervenções efetuadas.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-xs shrink-0">3</div>
            <div>
              <p className="font-semibold text-slate-700">Salve Localmente</p>
              <p className="text-slate-400 mt-0.5">Os dados são armazenados de forma 100% offline no seu dispositivo para preservar a privacidade do seu filho.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-xs shrink-0">4</div>
            <div>
              <p className="font-semibold text-slate-700">Exporte seu Relatório</p>
              <p className="text-slate-400 mt-0.5">Baixe os dados estruturados em formato CSV ou JSON para levar em consultas médicas ou fonoaudiológicas.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: ACADEMIC & DEVELOPMENT CREDITS */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-xs space-y-4" id="academic-credits">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5" id="academic-credits-title">
          <span>🏫</span>
          Desenvolvimento Científico e Acadêmico
        </h3>

        <div className="text-xs text-slate-600 space-y-4">
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/60 space-y-1">
            <p className="font-bold text-[9px] text-emerald-800 uppercase tracking-widest">Iniciativa / Laboratório</p>
            <p className="text-slate-800 font-semibold text-xs leading-snug">
              Laboratório de Bioinformática e Ciências Ômicas (LaBiOmicS)
            </p>
            <p className="text-[10px] text-emerald-700/80 font-medium">
              Universidade de Mogi das Cruzes (UMC)
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-1">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest flex items-center gap-1">
                <span>👨‍🏫</span> Orientação Científica
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-700 pl-1">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0"></span>
                  <strong>Prof. Dr. Fabiano Bezerra Menegidio</strong>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0"></span>
                  <span>Prof. Dr. Robson Rodrigues da Silva</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0"></span>
                  <span>Profa. Dra. Elis Andrade de Lima Zutin</span>
                </li>
              </ul>
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-2">
              <h4 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest flex items-center gap-1">
                <span>🎓</span> Equipe de Desenvolvimento
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-700 pl-1">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                  <span>Sara Martins Puim</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                  <span>Jaqueline Ramalho de Freitas</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                  <span>Matheus Maia da Cunha</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: CORE MEDICAL DISCLAIMER (CRITICAL CRITERIA) */}
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 space-y-3 shadow-xs" id="section-disclaimer">
        <div className="flex items-center gap-2.5 text-rose-800">
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide font-display">AVISO LEGAL DE ISENÇÃO DE RESPONSABILIDADE</h4>
            <p className="text-[10px] text-rose-550 font-semibold mt-0.5">Por favor, leia atentamente antes de usar</p>
          </div>
        </div>

        <p className="text-[11px] text-rose-900 leading-relaxed font-semibold">
          ATENÇÃO: Esta ferramenta digital NÃO realiza diagnóstico médico, NÃO substitui avaliação clínica de especialistas e NÃO deve guiar decisões isoladas de tratamento.
        </p>
        <p className="text-[11px] text-rose-800 leading-relaxed">
          O monitoramento destina-se puramente ao registro de comportamento sintomático de apoio para os pais. O acompanhamento regular com odontopediatras, fonoaudiólogos e neuropediatras é indispensável e insubstituível.
        </p>
      </div>

      {/* FOOTER EXTRA INFORMATION GIVING CLARITY ABOUT LOCAL SECURITY */}
      <div className="bg-slate-100/60 border border-slate-200/50 rounded-2xl p-5 text-center text-[10px] text-slate-400 space-y-2" id="data-privacy-card">
        <div className="flex items-center justify-center gap-1.5 font-bold text-slate-500">
          <Lock className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
          Conformidade e Segurança LGPD
        </div>
        <p className="leading-relaxed max-w-xs mx-auto">
          Os dados do BocaCérebro Kids residem permanentemente no seu dispositivo via armazenamento isolado do navegador (IndexedDB) e nunca são transmitidos para servidores externos.
        </p>
        <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-150 px-2 py-0.5 rounded-full font-bold select-none text-[9px] mt-1">
          <span>🛡️</span> Consentimento Parental Ativo (LGPD Art. 14)
        </div>
      </div>
    </div>
  );
}
