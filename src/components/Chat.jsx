import { useState } from 'react';
import { motion } from 'motion/react';
import { Send } from 'lucide-react';

const Chat = ({ onFinish }) => {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: 'こんにちは！診断を始めるよ。まずは、君の好きなことを教えてね！',
    },
  ]);

  // テスト用：ボタンを押すとID:1（Webデザイナー）の結果に飛ぶようにします
  const simulateFinish = () => {
    onFinish({
      job_id: 1,
      aiReason: '君のこだわり強めな性格は、まさにデザイナー向きだね！',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full bg-slate-50"
    >
      {/* チャット表示エリア */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3 rounded-2xl max-w-[80%] text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white shadow-sm border border-slate-200'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* 入力エリア（プロトタイプ） */}
      <div className="p-4 bg-white border-t space-y-2">
        <div className="flex gap-2">
          <input
            disabled
            placeholder="開発中は下のボタンを使ってね"
            className="flex-1 bg-slate-100 rounded-full px-4 text-xs"
          />
          <button className="p-2 bg-slate-200 rounded-full text-white">
            <Send size={20} />
          </button>
        </div>

        {/* 遷移確認用テストボタン */}
        <button
          onClick={simulateFinish}
          className="w-full py-2 bg-rose-500 text-white text-xs font-bold rounded-lg hover:bg-rose-600 transition-colors"
        >
          【デバッグ用】診断完了をシミュレート
        </button>
      </div>
    </motion.div>
  );
};

export default Chat;
