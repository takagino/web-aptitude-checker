import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Loader2, Sparkles, Zap, Search } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../data/prompts';
import { jobData } from '../data/jobData';

const MODEL = 'gemini-2.5-flash-lite';
const TOTAL_QUESTIONS = 10;

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
  const [isCalculating, setIsCalculating] = useState(false);
  const [rouletteIndex, setRouletteIndex] = useState(0);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

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

  useEffect(() => {
    let interval;
    if (isCalculating) {
      interval = setInterval(() => {
        setRouletteIndex((prev) => (prev + 1) % jobData.length);
      }, 80);
    }
    return () => clearInterval(interval);
  }, [isCalculating]);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

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
      setTimeout(() => inputRef.current?.focus(), 0);
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
        setIsCalculating(true);

        setTimeout(() => {
          onFinish(parsedData);
        }, 2000);
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

  const isButtonDisabled = isLoading || isCalculating || !input.trim();

  return (
    <div className="flex flex-col h-full bg-[#E8EDF2] relative">
      <AnimatePresence>
        {isCalculating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#FFDE00] flex flex-col items-center justify-center p-10 text-center"
          >
            <div className="w-full max-w-xs bg-white border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 flex flex-col items-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="mb-4 bg-black text-white px-4 py-1 font-black italic text-xl uppercase"
              >
                Analyzing...
              </motion.div>

              <div className="h-40 flex items-center justify-center overflow-hidden mb-6">
                <img
                  src={`/images/${jobData[rouletteIndex].imagePath}`}
                  alt="scanning"
                  className="w-32 h-32 object-contain"
                />
              </div>

              <div className="text-2xl font-black italic tracking-tighter uppercase mb-4 border-b-4 border-black pb-2 w-full">
                {jobData[rouletteIndex].title}
              </div>
              <p className="font-bold text-sm">君の才能をスキャン中...</p>
            </div>

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              className="mt-10"
            >
              <Zap size={48} fill="black" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="bg-white border-b-4 border-black p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-2 px-1">
          <div className="flex items-center gap-2">
            <Zap size={18} fill="black" strokeWidth={3} />
            <span className="text-sm font-black italic uppercase tracking-widest">
              ANALYZING...
            </span>
          </div>
          <span className="text-sm font-black italic">
            {currentQuestionNumber} / {TOTAL_QUESTIONS}
          </span>
        </div>

        <div className="w-full h-4 bg-white border-4 border-black relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,black_10px,black_20px)]" />

          <motion.div
            className="h-full bg-[#00FF94] border-r-4 border-black relative z-10"
            animate={{
              width: `${(currentQuestionNumber / TOTAL_QUESTIONS) * 100}%`,
            }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {messages
            .filter((m) => !m.hidden)
            .map((msg, i) => (
              <motion.div
                key={i}
                initial={{ x: msg.role === 'user' ? 20 : -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-4 border-4 border-black font-bold text-[15px] leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-[#00E0FF] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none'
                      : 'bg-white shadow-[-4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      <footer className="p-4 pb-8 bg-white border-t-4 border-black flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 border-4 border-black bg-[#F1F3F5] px-4 py-4 font-black outline-none focus:bg-[#00FF94]/10 transition-all placeholder:text-slate-400"
          placeholder={isLoading ? 'SCANNING...' : 'INPUT ANSWER!'}
          disabled={isLoading || isCalculating}
        />
        <motion.button
          whileHover={
            !isButtonDisabled
              ? {
                  y: 2,
                  boxShadow: '0px 0px 0px 0px rgba(0,0,0,1)',
                }
              : {}
          }
          transition={{
            type: 'tween',
            ease: 'easeOut',
            duration: 0,
          }}
          onClick={() => handleSend()}
          disabled={isButtonDisabled}
          className="bg-[#FFDE00] border-4 border-black px-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors disabled:bg-slate-200"
        >
          <Send size={24} strokeWidth={3} />
        </motion.button>
      </footer>
    </div>
  );
};

export default Chat;
