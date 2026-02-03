import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

const Intro = ({ onStart }) => {
  return (
    <motion.div
      // 画面切り替え時のフェードイン・アウト
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-between h-full p-8 text-center"
    >
      <div className="flex-1 flex flex-col items-center">
        {/* メインビジュアル */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative mb-8"
        >
          <img src="/images/main-visual.png" alt="Web才能発見" />
        </motion.div>

        {/* 説明文 */}
        <div className="space-y-3 text-[15px] text-slate-600 leading-relaxed wrap-anywhere break-keep">
          <p>
            いくつかの質問に答えるだけで、
            <wbr />
            君の性格や得意なことにぴったりの職種を診断します。
          </p>
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-blue-700 font-medium">
            💡 操作はカンタン！チャット形式で答えるだけ。
          </div>
        </div>
      </div>

      {/* スタートボタン */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="w-full py-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-bold text-xl shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group"
      >
        診断をスタートする
        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
      </motion.button>

      <p className="mt-4 text-[11px] text-slate-400">
        ※この診断にはGemini AIを使用しています
      </p>
    </motion.div>
  );
};

export default Intro;
