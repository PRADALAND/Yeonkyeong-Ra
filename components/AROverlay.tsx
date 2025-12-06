import React, { useEffect, useState } from 'react';
import { Activity, Heart, Thermometer, Wind, Target, Eye, ScanLine, User, CheckCircle, Smartphone } from 'lucide-react';
import { PatientProfile, ScenarioStage } from '../types';

interface AROverlayProps {
  patient: PatientProfile;
  currentStage: ScenarioStage;
}

export const AROverlay: React.FC<AROverlayProps> = ({ patient, currentStage }) => {
  // Simulate vital signs fluctuation
  const [hr, setHr] = useState(patient.vitals.hr);
  
  // Scanning Sequence State
  // 0: Initializing, 1: Wristband Found, 2: Face Found, 3: Starting, 4: Complete
  const [scanPhase, setScanPhase] = useState(0); 
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load voices for TTS
  useEffect(() => {
    const updateVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, []);

  // TTS Helper Function
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 1.1; // Slightly faster for system messages
      
      // Prefer Google Korean voice if available
      const korVoice = voices.find(v => v.lang.includes('ko') && v.name.includes('Google')) || 
                       voices.find(v => v.lang.includes('ko'));
      if (korVoice) utterance.voice = korVoice;
      
      window.speechSynthesis.speak(utterance);
    }
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      setHr(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Initialization Sequence Logic
  useEffect(() => {
      // Only run this sequence once when the component mounts (start of simulation)
      if (currentStage.id === 1) {
        setScanPhase(0);
        
        // Timeline for the boot sequence
        const t1 = setTimeout(() => setScanPhase(1), 1500); // Wristband Found
        const t2 = setTimeout(() => setScanPhase(2), 3500); // Face Found (delayed slightly to allow speech to finish)
        const t3 = setTimeout(() => setScanPhase(3), 5500); // Starting Msg
        const t4 = setTimeout(() => setScanPhase(4), 8000); // Done (Hide overlay)

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
        };
      } else {
        // If simply changing stages, don't re-run scan, just ensure it's hidden
        setScanPhase(4);
      }
  }, []);

  // Audio Feedback Effect monitoring scanPhase
  useEffect(() => {
    // Only speak during the intro sequence of stage 1
    if (currentStage.id !== 1) return;

    switch (scanPhase) {
      case 1:
        speak("환자 팔찌 인식 완료");
        break;
      case 2:
        speak("환자 얼굴 인식 완료");
        break;
      case 3:
        speak("인식 완료. 시나리오로 진입합니다.");
        break;
      default:
        break;
    }
  }, [scanPhase, currentStage.id, voices]); // voices dependency ensures we have loaded voices if possible

  const getSystemMessage = () => {
      switch(scanPhase) {
          case 0: return "환자 식별 코드 스캔 중...";
          case 1: return "환자 팔찌 인식 완료";
          case 2: return "환자 얼굴 인식 완료";
          case 3: return "인식 완료! 시나리오로 진입합니다.";
          default: return "";
      }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4 md:p-6">
      
      {/* Top Bar: Objective & Stage Indicator */}
      <div className={`flex justify-between items-start transition-opacity duration-1000 ${scanPhase < 3 ? 'opacity-0' : 'opacity-100'}`}>
        <div className="glass-panel p-4 rounded-xl max-w-md border-t-2 border-cyan-500">
          <div className="flex items-center gap-2 mb-2 text-cyan-400">
            <Target size={20} />
            <h2 className="font-bold text-sm tracking-widest uppercase">Objective</h2>
          </div>
          <h1 className="text-xl font-bold text-white mb-1">{currentStage.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {currentStage.indicators.map((ind, idx) => (
              <span key={idx} className="text-xs bg-cyan-900/50 text-cyan-200 px-2 py-1 rounded border border-cyan-500/30">
                {ind}
              </span>
            ))}
          </div>
        </div>

        {/* Vital Signs Panel (Top Right) */}
        <div className="glass-panel p-4 rounded-xl w-48 border-r-2 border-green-500">
          <div className="flex items-center justify-between mb-3 border-b border-gray-700 pb-2">
            <span className="text-xs text-gray-400 font-mono">ID: 9283-A</span>
            <span className="text-xs text-green-400 animate-pulse">● CONNECTED</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-400">
                <Heart size={18} className="animate-pulse" />
                <span className="text-xs uppercase">HR</span>
              </div>
              <span className="text-2xl font-mono font-bold text-white">{hr} <span className="text-xs text-gray-500">bpm</span></span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-400">
                <Activity size={18} />
                <span className="text-xs uppercase">BP</span>
              </div>
              <span className="text-xl font-mono font-bold text-white">{patient.vitals.bp}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400">
                <Wind size={18} />
                <span className="text-xs uppercase">SpO2</span>
              </div>
              <span className="text-xl font-mono font-bold text-white">{patient.vitals.spo2}<span className="text-xs text-gray-500">%</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Center Scanning Animation / Recognition Sequence */}
      {scanPhase < 4 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-full max-w-lg">
            
            {/* Reticle Visual */}
            <div className={`relative w-64 h-64 border-2 rounded-lg flex items-center justify-center transition-all duration-300 ${scanPhase === 1 || scanPhase === 2 ? 'border-green-500 bg-green-900/10' : 'border-cyan-500/50'}`}>
                
                {/* Corner Markers */}
                <div className={`absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 transition-colors ${scanPhase > 0 ? 'border-green-500' : 'border-cyan-500'}`}></div>
                <div className={`absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 transition-colors ${scanPhase > 0 ? 'border-green-500' : 'border-cyan-500'}`}></div>
                <div className={`absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 transition-colors ${scanPhase > 0 ? 'border-green-500' : 'border-cyan-500'}`}></div>
                <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 transition-colors ${scanPhase > 0 ? 'border-green-500' : 'border-cyan-500'}`}></div>
                
                {/* Scanning Laser Line */}
                {scanPhase === 0 && (
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent animate-scan"></div>
                )}

                {/* Icons based on phase */}
                <div className="scale-150 text-white drop-shadow-lg">
                    {scanPhase === 0 && <ScanLine size={48} className="text-cyan-400 animate-pulse" />}
                    {scanPhase === 1 && <Smartphone size={48} className="text-green-400 animate-bounce" />} {/* Wristband/Device */}
                    {scanPhase >= 2 && <User size={48} className="text-green-400" />}
                </div>
            </div>

            {/* Message Banner */}
            <div className="mt-8 bg-black/80 backdrop-blur-md px-8 py-4 rounded-full border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.8)] animate-fade-in-up text-center">
                <div className="flex items-center gap-3">
                    {scanPhase > 0 ? <CheckCircle className="text-green-500" /> : <Activity className="text-cyan-500 animate-spin" />}
                    <span className={`text-lg font-bold font-mono tracking-wide ${scanPhase === 3 ? 'text-cyan-300' : 'text-white'}`}>
                        {getSystemMessage()}
                    </span>
                </div>
            </div>

        </div>
      )}

      {/* AR Center Reticle (Passive State - After Scan) */}
      {scanPhase === 4 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
            <div className="w-12 h-12 border border-white/30 rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
        </div>
      )}

      {/* AR Context Hints (Floating near patient) - Visible after scan */}
      <div className={`absolute top-1/3 left-1/4 transform -translate-x-1/2 hidden md:block transition-opacity duration-500 ${scanPhase === 4 ? 'opacity-100' : 'opacity-0'}`}>
        <div className="glass-panel px-4 py-2 rounded-full border-l-4 border-yellow-500 flex items-center gap-2 animate-bounce-slow">
            <Eye size={16} className="text-yellow-500" />
            <span className="text-xs text-yellow-100 font-medium">Eye Contact: Intermittent</span>
        </div>
      </div>
      
      {/* Emotional State Analysis Overlay - Visible after scan */}
      <div className={`absolute top-1/3 right-1/4 transform translate-x-1/2 hidden md:block transition-opacity duration-500 ${scanPhase === 4 ? 'opacity-100' : 'opacity-0'}`}>
         <div className="glass-panel p-3 rounded-lg border-t-2 border-purple-500">
             <div className="text-xs text-purple-400 uppercase font-bold mb-1">Emotion Analysis</div>
             <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden mb-1">
                 <div className="h-full bg-purple-500 w-3/4"></div>
             </div>
             <div className="flex justify-between text-[10px] text-slate-300">
                 <span>Anxiety</span>
                 <span>72%</span>
             </div>
         </div>
      </div>

      {/* Bottom Bar is handled by Interface component */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-black/80 to-transparent -z-10"></div>
      
      <style>{`
        @keyframes scan {
            0% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(100%); opacity: 0; }
        }
        .animate-scan {
            animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
};
