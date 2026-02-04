import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { jobData } from '../data/jobData';

// --- 定数・ロジックの分離 ---
const MODEL = 'gemini-2.5-flash-lite';
const TOTAL_QUESTIONS = 10;
const JOB_LIST_TEXT = jobData.map((j) => `${j.id}:${j.title}`).join(', ');

// プロンプト
const SYSTEM_INSTRUCTION = `
あなたは専門学校のカウンセラー兼、適性診断エンジンです。
10問の対話から5つのステータス（各0-100）を測定し、最適なWeb職種を1つ判定します。
判定対象：${JOB_LIST_TEXT}

【5つの測定ステータス】
1. Planning（企画・設計）
2. Creative（表現・感性）
3. Technical（論理・構築）
4. Analysis（共感・分析）
5. Communication（伝える・おもてなし）

【職種判定の優先順位マッピング】
・Webデザイナー：Creative > Analysis
・フロントエンドエンジニア：Technical > Creative
・バックエンドエンジニア：Technical > Planning
・Webディレクター：Planning > Communication
・Webマーケター：Analysis > Planning
・UXデザイナー：Analysis > Creative
・Webライター：Communication > Analysis
・動画クリエイター：Creative > Technical
・イラストレーター：Creative > Communication
・SNS運用担当：Communication > Creative

【対話の厳守ルール】
1. 質問は1つずつ。全10問完走するまで絶対に診断結果（JSON）を出さない。
2. 進行：Planning(Q1,2) → Creative(Q3,4) → Technical(Q5,6) → Analysis(Q7,8) → Communication(Q9,10)
3. 構成：[前の回答への短めの共感や感想] + [【質問X/10】] + [質問]
4. 形式：自由記述式のみ（選択式・はい/いいえは一切禁止）。
5. 質問内容：Web、デザイン、IT等の専門用語や直接的な質問は一切禁止。
6. メタ発言禁止：「〇〇力を測る」等の意図説明は絶対に行わない。
7. 追加会話禁止：回答に深掘りせず、即座に次の質問番号へ移ること。
8. 外見：Markdown（**）禁止。150文字以内のフレンドリーな口調で、こまめに改行すること。
9. バリエーション：高校生が共感できる日常の何気ないシーンを質問毎に変えて提示すること。

【診断完了時の挙動】
Q10の回答後、以下のJSONのみを出力（挨拶・解説文の付随は厳禁）。
{"job_id": ID, "aiReason": "エピソードを引用した150文字程度の熱い解説", "scores": {"planning": 点数, "creative": 点数, "technical": 点数, "analysis": 点数, "communication": 点数}}
`;

// JSON抽出ユーティリティ
const extractJson = (text) => {
  if (!text) return null;
  const start = text.indexOf('{');
  if (start === -1) return null;
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === '{') depth++;
    if (text[i] === '}') depth--;
    if (depth === 0) return text.substring(start, i + 1);
  }
  return null;
};

const Chat = ({ onFinish }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  // SDKの初期化
  const client = useMemo(
    () =>
      new GoogleGenAI({
        apiKey: import.meta.env.VITE_GEMINI_API_KEY,
      }),
    [],
  );

  const currentQuestionNumber = useMemo(() => {
    return messages.filter((m) => m.role === 'model').length;
  }, [messages]);

  // 初回起動
  useEffect(() => {
    const startDiagnosis = async () => {
      setIsLoading(true);
      try {
        const initialPrompt =
          '診断を開始してください。最初の質問をお願いします。';
        const result = await client.models.generateContent({
          model: MODEL,
          config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 1.0 },
          contents: [{ role: 'user', parts: [{ text: initialPrompt }] }],
        });

        setMessages([
          { role: 'user', text: initialPrompt, hidden: true },
          { role: 'model', text: result.text },
        ]);
      } catch (err) {
        console.error('Initial Error:', err);
        setError('うまく開始できなかったみたい。ページを更新してみてね。');
      } finally {
        setIsLoading(false);
      }
    };
    startDiagnosis();
  }, [client]);

  const handleSend = async (retryInput = null) => {
    const targetInput = retryInput || input;
    if (!targetInput.trim() || isLoading) return;

    setError(null);
    let newMessages;
    if (retryInput) {
      newMessages = [...messages];
    } else {
      newMessages = [...messages, { role: 'user', text: targetInput }];
      setMessages(newMessages);
      setInput('');
    }

    setIsLoading(true);
    try {
      const result = await client.models.generateContent({
        model: MODEL,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 1.0,
          maxOutputTokens: 1000,
        },
        contents: newMessages.map((m) => ({
          role: m.role,
          parts: [{ text: m.text }],
        })),
      });

      const responseText = result.text;
      const jsonStr = extractJson(responseText);

      if (jsonStr) {
        const parsedData = JSON.parse(jsonStr);
        onFinish(parsedData);
        return;
      }

      setMessages((prev) => [...prev, { role: 'model', text: responseText }]);
    } catch (err) {
      console.error('Send Error:', err);
      setError(
        'ごめんね、今AIがちょっと混み合っているみたい。もう一度送ってみてね。',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* ヘッダー：プログレスバー */}
      <header className="bg-white border-b p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-1.5 rounded-lg">
              <Sparkles size={16} className="text-blue-600" />
            </div>
            <span className="text-sm font-black text-slate-700 uppercase tracking-tighter">
              AIが診断中...
            </span>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
            {currentQuestionNumber} / {TOTAL_QUESTIONS}
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
            animate={{
              width: `${(currentQuestionNumber / TOTAL_QUESTIONS) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </header>

      {/* チャットエリア */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {messages
            .filter((m) => !m.hidden)
            .map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-4 rounded-3xl max-w-[85%] text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-100'
                      : 'bg-white text-slate-700 rounded-tl-none border border-slate-200'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start px-2"
          >
            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
              <Loader2 className="animate-spin text-blue-400" size={20} />
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border border-red-100 rounded-2xl mx-2 flex flex-col items-center gap-3"
          >
            <p className="text-xs text-red-600 font-bold text-center">
              {error}
            </p>
            <button
              onClick={() => handleSend(messages[messages.length - 1]?.text)}
              className="text-xs bg-white text-red-500 px-6 py-2 rounded-full font-black border border-red-200 shadow-sm active:scale-95 transition-all"
            >
              もう一度送ってみる
            </button>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* フッター：入力エリア */}
      <footer className="p-4 pb-8 bg-white border-t flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 bg-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-400 text-[15px] transition-all"
          placeholder={isLoading ? 'AIが考え中...' : '答えを入力してね...'}
          disabled={isLoading}
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 text-white w-14 h-14 rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center active:scale-90 transition-all disabled:bg-slate-200 disabled:shadow-none"
        >
          <Send size={22} />
        </button>
      </footer>
    </div>
  );
};

export default Chat;
