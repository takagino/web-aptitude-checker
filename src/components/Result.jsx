import { motion } from 'motion/react';
import { RefreshCcw, ClipboardList } from 'lucide-react';

const Result = ({ result, onReset }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full overflow-y-auto p-6 flex flex-col items-center"
    >
      <div className="text-center mb-6">
        <div className="w-32 h-32 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          {/* ここに result.imagePath の画像が入ります */}
          <span className="text-4xl">🐱</span>
        </div>
        <h2 className="text-blue-600 font-bold text-sm">{result.catchcopy}</h2>
        <h1 className="text-3xl font-black text-slate-800">{result.title}</h1>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl mb-6 w-full text-sm leading-relaxed border border-slate-100">
        <p className="font-bold text-blue-700 mb-1">AIの診断理由：</p>
        {result.aiReason}
      </div>

      <div className="grid grid-cols-1 gap-3 w-full mb-8">
        <button
          onClick={() => alert('制作の流れポップアップを表示（予定）')}
          className="flex items-center justify-center gap-2 py-4 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100"
        >
          <ClipboardList size={20} />
          制作の流れを見る
        </button>

        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
        >
          <RefreshCcw size={18} />
          もう一度診断する
        </button>
      </div>
    </motion.div>
  );
};

export default Result;
