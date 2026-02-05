import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RefreshCcw,
  ClipboardList,
  Zap,
  Heart,
  Star,
  Target,
  Users,
  BookOpen,
  GraduationCap,
  X,
  ArrowRightCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { jobData } from '../data/jobData';
import { NEO_CARD, NEO_LABEL } from '../data/theme';

const Result = ({ result, onReset }) => {
  const [showFlow, setShowFlow] = useState(false);
  const jobDetails = jobData.find((j) => j.id === Number(result.id));

  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#FFDE00', '#00E0FF', '#FF00E5', '#00FF94'],
    });
  }, []);

  if (!jobDetails) return null;

  const stats = [
    { label: '企画・設計', key: 'planning', color: 'bg-[#00E0FF]' },
    { label: '表現・感性', key: 'creative', color: 'bg-[#FF00E5]' },
    { label: '論理・構築', key: 'technical', color: 'bg-[#7000FF]' },
    { label: '共感・分析', key: 'analysis', color: 'bg-[#00FF94]' },
    { label: '伝える力', key: 'communication', color: 'bg-[#FF5C00]' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#E8EDF2] relative overflow-hidden font-bold">
      {/* ヘッダー：デザイン優先の英語 */}
      <header className="bg-white border-b-4 border-black p-4 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <Star size={18} fill="black" />
          <span className="text-sm font-black italic uppercase tracking-tighter">
            Diagnostic Report
          </span>
        </div>
        <div className="bg-[#FFDE00] border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase italic">
          Complete!
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-12 custom-scrollbar pb-24">
        {/* --- GROUP 1: 診断結果 --- */}
        <section className="space-y-6 pt-4 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={`${NEO_CARD} inline-block !p-4 !shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]`}
          >
            <img
              src={`/images/${jobDetails.imagePath}`}
              className="w-60 h-60 mx-auto"
              alt={jobDetails.title}
            />
          </motion.div>

          <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none text-black">
            {jobDetails.title}
          </h1>
          <div className="bg-black text-[#00FF94] inline-block px-3 py-1 text-xs uppercase italic transform -rotate-1 italic">
            {jobDetails.catchcopy}
          </div>

          {/* 才能分析グラフ */}
          <div className={NEO_CARD}>
            <div className="flex items-center gap-2 mb-4 border-b-2 border-black pb-2 text-xs font-black uppercase tracking-widest">
              <Zap size={16} fill="black" /> 才能分析レポート
            </div>
            <div className="space-y-4 text-left">
              {stats.map((s) => (
                <div key={s.key} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black uppercase italic opacity-50 px-1">
                    <span>{s.label}</span>
                    <span>{result.scores?.[s.key]}%</span>
                  </div>
                  <div className="h-4 bg-slate-100 border-2 border-black overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.scores?.[s.key]}%` }}
                      transition={{ duration: 1, ease: 'steps(10)' }}
                      className={`h-full ${s.color} border-r-2 border-black`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AIアドバイス */}
          <div
            className={`${NEO_CARD} !bg-black text-white !text-left relative overflow-hidden`}
          >
            <h4 className="text-[#FFDE00] italic text-xs mb-2 uppercase tracking-widest">
              AIアドバイス
            </h4>
            <p className="text-sm leading-relaxed italic relative z-10">
              {result.aiReason}
            </p>
            <Heart
              className="absolute -bottom-2 -right-2 opacity-20"
              size={60}
              fill="white"
            />
          </div>
        </section>

        <hr className="border-t-4 border-dashed border-black/10 mx-4" />

        {/* --- GROUP 2: 業種の説明 --- */}
        <section className="space-y-8">
          <div className={`${NEO_LABEL} bg-[#00E0FF] -rotate-2 ml-2 text-sm`}>
            この職業について
          </div>

          <div className={NEO_CARD}>
            <p className="text-[15px] leading-relaxed text-left text-slate-800">
              {jobDetails.description}
            </p>
          </div>

          {/* 主なミッション */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1 text-black">
              <BookOpen size={20} strokeWidth={3} className="text-[#FF00E5]" />
              <h3 className="text-lg font-black italic uppercase tracking-tighter">
                主なミッション
              </h3>
            </div>
            <div className="grid gap-3">
              {jobDetails.responsibilities.map((r, i) => (
                <div
                  key={i}
                  className="bg-white border-2 border-black p-4 flex gap-4 items-start text-left"
                >
                  <div className="w-8 h-8 bg-black text-white text-xs flex items-center justify-center font-black italic shrink-0 mt-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-black text-[15px] leading-tight mb-1">
                      {r.title}
                    </h4>
                    <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
                      {r.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 最高の相棒 */}
          <div className={NEO_CARD}>
            <div className="flex items-center gap-2 mb-4 border-b-2 border-black pb-2 text-[10px] uppercase font-black opacity-50">
              <Users size={16} strokeWidth={3} /> 最高の相棒
            </div>
            <div className="space-y-4 text-left">
              {jobDetails.compatibility.map((c, i) => (
                <div key={i} className="group">
                  <div className="text-[13px] font-black text-[#FF5C00] flex items-center gap-1.5 mb-1">
                    <ArrowRightCircle size={14} strokeWidth={3} /> {c.title}
                  </div>
                  <p className="text-[11px] text-slate-500 italic pl-5 leading-relaxed">
                    {c.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="border-t-4 border-dashed border-black/10 mx-4" />

        {/* --- GROUP 3: 今日からできること --- */}
        <section className="space-y-6 pb-6">
          <div className={`${NEO_LABEL} bg-[#FFDE00] rotate-1 ml-2 text-sm`}>
            日常トレーニング
          </div>

          <div className={`${NEO_CARD} !bg-white text-left`}>
            <div className="flex items-center gap-2 mb-6 relative z-10">
              <Zap
                className="text-[#7000FF]"
                size={28}
                strokeWidth={3}
                fill="#7000FF"
              />
              <h3 className="text-lg font-black tracking-tighter italic uppercase text-black">
                今日からチャレンジ！
              </h3>
            </div>

            <ul className="space-y-4">
              {jobDetails.howToBecome &&
                jobDetails.howToBecome.map((step, i) => (
                  <li
                    key={i}
                    className="flex gap-4 items-start bg-slate-50 p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div className="bg-[#7000FF] text-white text-[10px] font-black italic px-2 py-1 shrink-0 mt-0.5">
                      STEP {i + 1}
                    </div>
                    <p className="text-[13px] font-bold leading-relaxed text-slate-800">
                      {step}
                    </p>
                  </li>
                ))}
            </ul>

            <p className="mt-8 text-[11px] font-black italic text-slate-400 text-center uppercase tracking-widest">
              — Just one step a day —
            </p>
          </div>
        </section>
      </div>

      {/* 固定フッター */}
      <footer className="p-4 pb-10 bg-white border-t-4 border-black flex gap-3 z-30 shadow-[0_-8px_20px_rgba(0,0,0,0.05)]">
        <motion.button
          whileHover={{
            y: 4,
            boxShadow: '0px 0px 0px 0px rgba(0,0,0,1)',
          }}
          transition={{
            type: 'tween',
            ease: 'easeOut',
            duration: 0,
          }}
          onClick={() => setShowFlow(true)}
          className="flex-1 bg-[#00FF94] border-4 border-black py-4 font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase italic flex items-center justify-center gap-2"
        >
          <ClipboardList size={22} strokeWidth={3} /> 制作の流れ
        </motion.button>
        <motion.button
          whileHover={{
            rotate: 90,
            backgroundColor: '#FFDE00',
            boxShadow: '0px 0px 0px 0px rgba(0,0,0,1)',
          }}
          transition={{
            type: 'tween',
            ease: 'easeOut',
            duration: 0,
          }}
          onClick={onReset}
          className="w-16 h-16 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <RefreshCcw size={28} strokeWidth={3} />
        </motion.button>
      </footer>

      {/* Workflowモーダル */}
      <AnimatePresence>
        {showFlow && <WorkflowModal onClose={() => setShowFlow(false)} />}
      </AnimatePresence>
    </div>
  );
};

const WorkflowModal = ({ onClose }) => {
  const steps = [
    {
      title: '企画・ヒアリング',
      desc: 'クライアントの悩みを聞き、解決策を考えます。',
    },
    {
      title: '設計・構成',
      desc: 'サイトの地図を作り、使いやすさを追求します。',
    },
    { title: 'デザイン制作', desc: '見た目や空気感を色とカタチで表現します。' },
    {
      title: '実装・コーディング',
      desc: 'プログラムを書いて、ブラウザで動かします。',
    },
    { title: '公開・運用', desc: '世界中に公開し、さらに使いやすく育てます。' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ y: 50, scale: 0.9 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 50, scale: 0.9 }}
        className={`${NEO_CARD} w-full max-h-[80vh] overflow-y-auto !bg-[#FFDE00] !p-0`}
      >
        <div className="sticky top-0 bg-black text-white p-4 flex justify-between items-center z-10">
          <span className="font-black italic uppercase tracking-widest text-sm">
            制作の流れ
          </span>
          <button
            onClick={onClose}
            className="hover:rotate-90 transition-transform"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>
        <div className="p-6 space-y-6 text-left">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-4 relative">
              {i !== steps.length - 1 && (
                <div className="absolute left-[15px] top-10 bottom-[-20px] w-1 bg-black/20" />
              )}
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black italic shrink-0 z-10 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)]">
                {i + 1}
              </div>
              <div className="pb-4">
                <h4 className="font-black text-[17px] leading-tight mb-1">
                  {s.title}
                </h4>
                <p className="text-[13px] font-medium opacity-80 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
          <button
            onClick={onClose}
            className="w-full py-4 bg-black text-white font-black uppercase italic mt-4 active:scale-95 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]"
          >
            閉じる
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Result;
