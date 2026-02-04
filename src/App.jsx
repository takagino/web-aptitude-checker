import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import Intro from './components/Intro';
import Chat from './components/Chat';
import Result from './components/Result';
import { jobData } from './data/jobData';

function App() {
  const [step, setStep] = useState('intro'); // 現在の画面
  const [diagnosisResult, setDiagnosisResult] = useState(null); // 最終結果

  const handleStart = () => setStep('chat');
  const handleFinish = (aiData) => {
    // IDを元に静的なデータを取得
    const jobDetails = jobData.find((j) => j.id === Number(aiData.job_id));

    if (jobDetails) {
      setDiagnosisResult({
        ...jobDetails,
        aiReason: aiData.aiReason,
        scores: aiData.scores, // ここでスコアを保存
      });
      setStep('result');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl h-[700px] overflow-hidden relative border-8 border-white">
        <AnimatePresence mode="wait">
          {step === 'intro' && <Intro key="intro" onStart={handleStart} />}
          {step === 'chat' && <Chat key="chat" onFinish={handleFinish} />}
          {step === 'result' && (
            <Result
              key="result"
              result={diagnosisResult}
              onReset={() => setStep('intro')}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
