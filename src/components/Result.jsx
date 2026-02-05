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
  ArrowRightCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { jobData } from '../data/jobData';
import { NEO_CARD, NEO_LABEL } from '../data/theme';

const Result = ({ result, onReset }) => {
  const [showFlow, setShowFlow] = useState(false);
  const jobDetails = jobData.find((j) => j.id === Number(result.id));

  useEffect(() => {
    const duration = 200;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 100,
        origin: { x: 0 },
        colors: [
          '#00FF94',
          '#FF5C00',
          '#7000FF',
          '#FFDE00',
          '#00E0FF',
          '#FF00E5',
        ],
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 100,
        origin: { x: 1 },
        colors: [
          '#00FF94',
          '#FF5C00',
          '#7000FF',
          '#FFDE00',
          '#00E0FF',
          '#FF00E5',
        ],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
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

      <div className="flex-1 overflow-y-auto p-4 space-y-12 custom-scrollbar pb-20">
        {/* --- GROUP 1: 診断結果 --- */}
        <section className="space-y-6 pt-4">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              className="inline-block bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6"
            >
              <img
                src={`/images/${jobDetails.imagePath}`}
                className="w-40 h-40 object-contain mx-auto"
                alt={jobDetails.title}
              />
            </motion.div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-2 text-black">
              {jobDetails.title}
            </h1>
            <div className="bg-black text-[#00FF94] inline-block px-3 py-1 text-xs uppercase italic transform -rotate-1">
              {jobDetails.catchcopy}
            </div>
          </div>

          {/* パワーメーター */}
          <div className={`${NEO_CARD}`}>
            <div className="flex items-center gap-2 mb-4 border-b-2 border-black pb-2">
              <Zap size={18} fill="black" />
              <span className="text-xs font-black uppercase tracking-widest">
                Talent Analysis
              </span>
            </div>
            <div className="space-y-4">
              {stats.map((stat) => (
                <div key={stat.key} className="space-y-1">
                  <div className="flex justify-between text-[12px] uppercase font-black italic text-slate-500 px-1">
                    <span>{stat.label}</span>
                    <span className="text-black">
                      {result.scores?.[stat.key]}%
                    </span>
                  </div>
                  <div className="h-5 bg-[#F1F3F5] border-2 border-black relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.scores?.[stat.key]}%` }}
                      transition={{ duration: 1.2, ease: 'steps(10)' }}
                      className={`h-full ${stat.color} border-r-2 border-black`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AIメッセージ */}
          <div className={`${NEO_CARD} bg-black text-white`}>
            <div className="absolute top-4 right-4 text-[#FFDE00] opacity-50">
              <Heart fill="#FFDE00" size={24} />
            </div>
            <h4 className="text-[#FFDE00] font-black italic mb-3 text-sm uppercase tracking-widest">
              AI's Voice
            </h4>
            <p className="text-[14px] leading-relaxed relative z-10 italic font-medium">
              {result.aiReason}
            </p>
          </div>
        </section>

        <hr className="border-t-4 border-dashed border-black/20 mx-4" />

        {/* --- GROUP 2: 業種の説明 --- */}
        <section className="space-y-8">
          <div className={`${NEO_LABEL} bg-[#00E0FF] -rotate-2`}>
            <h2 className="text-xl font-black italic uppercase tracking-tighter">
              About Job
            </h2>
          </div>

          {/* 概要 */}
          <div className="space-y-4">
            <div className={`${NEO_CARD}`}>
              <p className="text-[15px] leading-relaxed text-slate-900">
                {jobDetails.description}
              </p>
            </div>
          </div>

          {/* ミッション */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <BookOpen size={20} strokeWidth={3} className="text-[#FF00E5]" />
              <h3 className="text-lg font-black italic uppercase tracking-tighter">
                Main Missions
              </h3>
            </div>
            <div className="grid gap-3">
              {jobDetails.responsibilities.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border-2 border-black p-4 flex gap-4 items-center"
                >
                  <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-sm italic shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-black text-[14px] leading-tight mb-0.5">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 相棒 */}
          <div className={`${NEO_CARD}`}>
            <div className="flex items-center gap-2 mb-4 border-b-2 border-black pb-2">
              <Users size={18} strokeWidth={3} />
              <h3 className="text-sm font-black italic uppercase tracking-widest text-slate-600">
                Best Buddies
              </h3>
            </div>
            <div className="grid gap-4">
              {jobDetails.compatibility.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <h4 className="font-black text-[14px] text-[#FF5C00] flex items-center gap-1">
                    <ArrowRightCircle size={14} /> {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed italic pl-5">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="border-t-4 border-dashed border-black/20 mx-4" />

        {/* --- GROUP 3: この業種になるには？ --- */}
        <section className="space-y-6 pb-6">
          <div className={`${NEO_LABEL} bg-[#FFDE00] rotate-2`}>
            <h2 className="text-xl font-black italic uppercase tracking-tighter">
              Next Step
            </h2>
          </div>

          <div className={`${NEO_CARD}`}>
            <div className="absolute -top-4 -right-4 opacity-10 rotate-12">
              <GraduationCap size={100} fill="black" />
            </div>

            <div className="relative z-10 space-y-4">
              <h3 className="text-lg font-black flex items-center gap-2 text-black">
                <GraduationCap
                  className="text-[#7000FF]"
                  size={24}
                  strokeWidth={3}
                />
                どうすればなれる？
              </h3>
              {/* jobData.jsに新しく追加された howToBecome を表示 */}
              <p className="text-[15px] leading-relaxed text-slate-800 bg-[#F1F3F5] p-4 border-l-8 border-[#7000FF]">
                {jobDetails.howToBecome ||
                  'この職業を目指すには、専門的なスキルと情熱が必要です。トライデントで一緒に学びましょう！'}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* 固定フッター */}
      <footer className="p-4 pb-10 bg-white border-t-4 border-black flex gap-3 z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <motion.button
          whileHover={{
            x: -4,
            y: -4,
            boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)',
            backgroundColor: '#00FF94',
          }}
          whileTap={{
            x: 4,
            y: 4,
            boxShadow: '0px 0px 0px 0px rgba(0,0,0,1)',
            backgroundColor: '#00CC76',
          }}
          transition={{ type: 'tween', duration: 0.1 }}
          onClick={() => setShowFlow(true)}
          className="flex-1 bg-[#00FF94] border-4 border-black py-4 font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 uppercase italic transition-colors"
        >
          <ClipboardList size={24} strokeWidth={3} />
          Workflow
        </motion.button>

        <motion.button
          whileHover={{
            rotate: 90,
            backgroundColor: '#FFDE00',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
          }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'tween', duration: 0.1 }}
          onClick={onReset}
          className="w-16 h-16 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <RefreshCcw size={28} strokeWidth={3} />
        </motion.button>
      </footer>
    </div>
  );
};

export default Result;
