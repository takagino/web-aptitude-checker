import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { jobData } from '../data/jobData';

// 1. 職種データをプロンプト用に整形
const JOB_LIST_TEXT = jobData
  .map((j) => `${j.id}:${j.title}(${j.catchcopy})`)
  .join(', ');

const SYSTEM_INSTRUCTION = `
あなたは専門学校のキャリアカウンセラーです。高校生との対話を通じて「Web制作の才能」を診断します。
以下の10個の職種から1つを選んでください：
${JOB_LIST_TEXT}

【ルール】
1. 質問は必ず1つずつ投げかけ、合計5〜7問で終了してください。
2. 専門用語は避け、フレンドリーな口調で接してください。
3. ★重要：Markdown記法（**など）は絶対に使用しないでください。
4. ★重要：一文が長くならないよう、適宜「改行」を入れて、スマホでも読みやすいリズムで書いてください。
5. 職種が確定したら、余計な挨拶は一切抜きで、必ずJSON形式のみを出力してください。
{"job_id": ID番号, "aiReason": "具体的な選定理由"}
`;

const Chat = ({ onFinish }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // 2. 新しいSDKの初期化
  const client = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });

  // JSON部分を抽出する関数（ご提示のロジックを組み込み）
  const extractJson = (text) => {
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

  // 初回起動時のメッセージ取得
  useEffect(() => {
    const fetchInitialQuestion = async () => {
      setIsLoading(true);
      try {
        const result = await client.models.generateContent({
          model: 'gemini-2.5-flash-lite',
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 1.0,
          },
          contents: [
            {
              role: 'user',
              parts: [
                { text: '診断を開始してください。最初の質問をお願いします。' },
              ],
            },
          ],
        });
        setMessages([{ role: 'model', text: result.text }]);
      } catch (error) {
        console.error('初期化エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialQuestion();
  }, []);

  const [error, setError] = useState(null);

  const handleSend = async (retryInput = null) => {
    const targetInput = retryInput || input; // 再試行時は引数から取得
    if (!targetInput || isLoading) return;

    setError(null); // エラーをリセット
    const newMessages = retryInput
      ? messages
      : [...messages, { role: 'user', text: targetInput }];

    if (!retryInput) {
      setMessages(newMessages);
      setInput('');
    }
    setIsLoading(true);

    try {
      const result = await client.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          // responseMimeType: 'application/json',
          temperature: 0.7,
        },
        contents: newMessages.map((m) => ({
          role: m.role,
          parts: [{ text: m.text }],
        })),
      });

      // ...（JSONパース処理などはそのまま）
      setMessages((prev) => [...prev, { role: 'model', text: result.text }]);
    } catch (err) {
      console.error('送信エラー:', err);
      // 503エラーやその他のAPIエラーをキャッチ
      setError(
        'ごめんね、今AIがちょっと混み合っているみたい。少し待ってからもう一度送ってくれるかな？',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-4 rounded-2xl max-w-[85%] text-[15px] shadow-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-200'
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {/* メッセージ表示ループの直後に追加 */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-2xl mx-4 my-2"
            >
              <p className="text-xs text-red-600 font-medium text-center">
                {error}
              </p>
              <button
                onClick={() => handleSend(messages[messages.length - 1].text)} // 最後の自分の発言を再送
                className="text-xs bg-white border border-red-200 text-red-500 px-4 py-1 rounded-full font-bold hover:bg-red-100 transition-colors"
              >
                もう一度送ってみる
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start px-2">
            <Loader2 className="animate-spin text-blue-400" />
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <footer className="p-4 bg-white border-t flex gap-2">
        <input
          type="text"
          autoComplete="one-time-code"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="scheme-light flex-1 bg-slate-100 rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          placeholder="答えを入力してね..."
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg active:scale-95 transition-transform disabled:bg-slate-300"
        >
          <Send size={20} />
        </button>
      </footer>
    </div>
  );
};

export default Chat;
