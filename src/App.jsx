import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import Intro from './components/Intro';
import Chat from './components/Chat';
import Result from './components/Result';
import { jobData } from './data/jobData';

const MOCK_RESULT = {
  ...jobData.find((j) => j.id === 1),
  aiReason:
    '君の回答からは、細部への並々ならぬこだわりと、使う人への深い思いやりが感じられたよ！それはWebの世界では「最高のユーザー体験」を創り出す武器になる。チームを支え、画面の向こうの誰かを笑顔にするデザイナーとして活躍する姿が目に浮かぶよ！',
  scores: {
    planning: 80,
    creative: 100,
    technical: 40,
    analysis: 90,
    communication: 70,
  },
};

function App() {
  // const [step, setStep] = useState('intro');
  // const [diagnosisResult, setDiagnosisResult] = useState(null);

  const [step, setStep] = useState('result');
  const [diagnosisResult, setDiagnosisResult] = useState(MOCK_RESULT);

  const handleStart = () => setStep('chat');
  const handleFinish = (aiData) => {
    const jobDetails = jobData.find((j) => j.id === Number(aiData.job_id));
    if (jobDetails) {
      setDiagnosisResult({
        ...jobDetails,
        aiReason: aiData.aiReason,
        scores: aiData.scores,
      });
      setStep('result');
    }
  };

  return (
    <div className="min-h-[800px] h-screen bg-[#FFDE00] flex items-center justify-center p-10 font-bold selection:bg-[#00E0FF]">
      <div className="w-full max-w-xl bg-white border-[6px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full relative flex flex-col">
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
