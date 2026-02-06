import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';

const Intro = ({ onStart }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center justify-between h-full p-10 text-center bg-[#F8F9FA]"
    >
      <motion.div
        animate={{ y: [-5, -10, -5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <h1>
          <img
            src="/images/main-visual.png"
            alt="AIが判定！Web才能発見 適職診断"
            className="scale-[1.5]"
          />
        </h1>
      </motion.div>

      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2 text-lg font-black tracking-tighter italic text-slate-800">
          <Zap size={20} fill="#FFDE00" strokeWidth={3} />
          <p>10個の質問で</p>
          <Zap size={20} fill="#FFDE00" strokeWidth={3} />
        </div>

        <h2 className="text-2xl font-black tracking-tighter leading-tight text-black">
          <span className="text-[#FF5C00] text-3xl italic underline decoration-8 decoration-[#00FF94]/30 underline-offset-[-4px]">
            「Webの才能」
          </span>{' '}
          を暴き出す！
        </h2>

        <p className="text-[14px] font-bold text-slate-400 italic">
          # 所要時間：約3分
        </p>
      </div>

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
        onClick={onStart}
        className="w-full py-6 bg-[#FF5C00] text-white border-4 border-black font-black text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3 transition-all"
      >
        診断スタート！
        <ArrowRight size={32} strokeWidth={3} />
      </motion.button>
      <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
        Powered by Gemini AI
      </p>
    </motion.div>
  );
};

export default Intro;
