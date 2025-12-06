import React, { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, MessageCircle, CheckCircle, AlertCircle, RefreshCcw, Volume2 } from 'lucide-react';
import { ScenarioStage, DialogueOption } from '../types';

interface DialogueInterfaceProps {
  stage: ScenarioStage;
  onNext: () => void;
  isLastStage: boolean;
  onRestart: () => void;
}

export const DialogueInterface: React.FC<DialogueInterfaceProps> = ({ stage, onNext, isLastStage, onRestart }) => {
  const [showScript, setShowScript] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{correct: boolean, msg: string} | null>(null);
  const [patientResponding, setPatientResponding] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load voices reliably
  useEffect(() => {
    const loadVoices = () => {
      const availVoices = window.speechSynthesis.getVoices();
      setVoices(availVoices);
    };
    
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Enhanced TTS function
  const speakNurseLine = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop previous
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      
      // Try to find a good Korean voice
      const koreanVoice = voices.find(v => v.lang.includes('ko') && v.name.includes('Google'));
      if (koreanVoice) {
          utterance.voice = koreanVoice;
      } else {
          // Fallback to any Korean voice
          const anyKo = voices.find(v => v.lang.includes('ko'));
          if (anyKo) utterance.voice = anyKo;
      }
      
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleOptionClick = (option: DialogueOption) => {
    setSelectedOption(option.id);
    setFeedback({
      correct: option.correct,
      msg: option.guidance
    });
    
    // Play audio for the selected option (Nurse's voice)
    speakNurseLine(option.text);

    if (option.correct) {
      setPatientResponding(true);
      // Simulate patient listening then responding
      setTimeout(() => {
        setPatientResponding(false);
      }, 3500); // Give a bit more time for the nurse audio to finish
    }
  };

  const handleProceed = () => {
    window.speechSynthesis.cancel();
    setSelectedOption(null);
    setFeedback(null);
    setShowScript(false);
    onNext();
  };

  return (
    <div className="absolute bottom-0 left-0 w-full z-20 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Context Hint */}
        <div className="mb-4">
             <div className="inline-block glass-panel px-4 py-2 rounded-lg text-cyan-200 text-sm border-l-4 border-cyan-500 shadow-lg shadow-cyan-900/20 backdrop-blur-xl">
              <span className="font-bold mr-2 text-cyan-400">AR CONTEXT:</span>
              {stage.context}
            </div>
        </div>

        {/* Main Interaction Area */}
        <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900/90">
          
          {/* Header Actions */}
          <div className="flex items-center justify-between p-3 bg-slate-800/50 border-b border-slate-700">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                <span className="text-xs font-bold text-cyan-500 uppercase tracking-widest">Voice Interaction Active</span>
             </div>
             <div className="flex gap-4">
                <button 
                  onClick={() => setShowScript(!showScript)}
                  className="text-xs flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                >
                  <BookOpen size={14} />
                  {showScript ? 'Hide Full Script' : 'Show Full Script'}
                </button>
             </div>
          </div>

          <div className="p-6">
            {/* If script is shown, overlay it */}
            {showScript ? (
              <div className="mb-6 bg-slate-800 p-4 rounded-lg border border-slate-600 max-h-60 overflow-y-auto">
                <h3 className="text-cyan-400 font-bold mb-2 text-sm uppercase">Recommended Script</h3>
                {stage.nurseScript.map((line, i) => (
                  <p key={i} className="mb-2 text-slate-200 leading-relaxed text-sm">
                    <span className="text-cyan-600 font-bold mr-2">Nurse:</span> 
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              // Interactive Choices
              <div className="grid grid-cols-1 gap-3 mb-6">
                {stage.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionClick(option)}
                    disabled={!!selectedOption && option.id !== selectedOption}
                    className={`
                      text-left p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden
                      ${selectedOption === option.id 
                        ? (option.correct ? 'bg-green-900/30 border-green-500' : 'bg-red-900/30 border-red-500')
                        : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700 hover:border-cyan-500/50'}
                      ${!!selectedOption && option.id !== selectedOption ? 'opacity-50 grayscale' : 'opacity-100'}
                    `}
                  >
                    <div className="flex items-start gap-3 relative z-10">
                      <div className={`mt-1 p-1 rounded-full ${selectedOption === option.id ? 'bg-white text-black' : 'bg-slate-700 text-slate-400 group-hover:bg-cyan-500 group-hover:text-white'}`}>
                        {selectedOption === option.id ? <Volume2 size={16} className="animate-pulse" /> : <MessageCircle size={16} />}
                      </div>
                      <div>
                         <p className="text-sm md:text-base font-medium text-slate-100">{option.text}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Feedback & Patient Response Area */}
            {feedback && (
              <div className="animate-fade-in-up">
                {feedback.correct ? (
                  <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-xl mb-4">
                     <div className="flex items-center gap-2 text-green-400 font-bold mb-1 text-sm">
                        <CheckCircle size={16} />
                        <span>Excellent Choice</span>
                     </div>
                     <p className="text-green-100 text-sm mb-4">{feedback.msg}</p>

                     {/* Simulated Patient Response */}
                     <div className="bg-slate-900/80 p-4 rounded-lg border-l-4 border-purple-500">
                        <p className="text-xs text-purple-400 font-bold mb-1 uppercase">Patient Response</p>
                        {patientResponding ? (
                           <div className="flex items-center gap-1 h-5">
                             <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                             <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                             <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                             <span className="text-xs text-purple-300 ml-2">Patient Speaking...</span>
                           </div>
                        ) : (
                           <p className="text-white italic">"{stage.patientResponse}"</p>
                        )}
                     </div>
                  </div>
                ) : (
                  <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-xl mb-4">
                     <div className="flex items-center gap-2 text-red-400 font-bold mb-1 text-sm">
                        <AlertCircle size={16} />
                        <span>Try Again</span>
                     </div>
                     <p className="text-red-100 text-sm">{feedback.msg}</p>
                     <button 
                       onClick={() => { setSelectedOption(null); setFeedback(null); }}
                       className="mt-3 text-xs bg-red-900 hover:bg-red-800 text-white px-3 py-1.5 rounded"
                     >
                       Retry
                     </button>
                  </div>
                )}
              </div>
            )}

            {/* Next Button */}
            {feedback?.correct && !patientResponding && (
              <div className="flex justify-end mt-4">
                {isLastStage ? (
                   <button 
                   onClick={onRestart}
                   className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-cyan-900/50 transition-all transform hover:scale-105"
                 >
                   <RefreshCcw size={20} />
                   Restart Module
                 </button>
                ) : (
                  <button 
                  onClick={handleProceed}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-blue-900/50 transition-all transform hover:scale-105"
                >
                  Next Stage
                  <ArrowRight size={20} />
                </button>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};