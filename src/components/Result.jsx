import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCcw, ClipboardList, X, Users, Wrench } from 'lucide-react';
import { jobData } from '../data/jobData';

const Result = ({ result, onReset }) => {
  const [showFlow, setShowFlow] = useState(false);

  // 10職種から詳細を引く（案Bのパターン）
  const jobDetails = jobData.find((j) => j.id === Number(result.id));
  if (!jobDetails) return null;

  return (
    <div className="h-full bg-white relative overflow-y-auto pb-24">
      <div className="p-6">
        {/* キャラクター表示部分（省略） */}
        <div className="text-center mb-8">
          <img
            src={`/images/${jobDetails.imagePath}`}
            className="w-40 h-40 mx-auto"
          />
          <h1 className="text-2xl font-black mt-4">{jobDetails.title}</h1>
        </div>

        {/* 才能ステータス（グラフ） */}
        <div className="bg-slate-50 p-6 rounded-[2rem] mb-8 space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-4">
            Talent Stats
          </h3>
          {[
            { label: '企画・設計', key: 'planning' },
            { label: '表現・感性', key: 'creative' },
            { label: '論理・構築', key: 'technical' },
            { label: '共感・分析', key: 'analysis' },
            { label: '伝える・おもてなし', key: 'communication' },
          ].map((stat) => (
            <div key={stat.key} className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold px-1">
                <span className="text-slate-600">{stat.label}</span>
                <span className="text-blue-600">
                  {result.scores?.[stat.key]}%
                </span>
              </div>
              <div className="h-2 bg-white rounded-full overflow-hidden border border-slate-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.scores?.[stat.key]}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-blue-500 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>

        {/* AI診断メッセージ */}
        <div className="bg-blue-600 text-white p-6 rounded-[2rem] mb-8 shadow-xl shadow-blue-100">
          <p className="text-sm leading-relaxed">{result.aiReason}</p>
        </div>

        {/* 仕事内容・相棒などのセクション（省略） */}
      </div>

      {/* 固定フッター（省略） */}
      {/* FlowModal（省略） */}
    </div>
  );
};

export default Result;
