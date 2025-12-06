import React, { useState, useRef, useEffect } from 'react';
import { SCENARIO_DATA, PATIENT_PROFILE } from './constants';
import { AROverlay } from './components/AROverlay';
import { DialogueInterface } from './components/DialogueInterface';
import { Play, ShieldAlert, FileText, Camera, Box } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<'landing' | 'briefing' | 'simulation'>('landing');
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentStage = SCENARIO_DATA[currentStageIndex];
  const progress = ((currentStageIndex) / SCENARIO_DATA.length) * 100;

  // Initialize Camera for AR view
  useEffect(() => {
    if (appState === 'simulation') {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Camera access failed:", err);
          // Fallback handled by CSS background if camera fails
        }
      };
      startCamera();
    }
  }, [appState]);

  const handleNext = () => {
    if (currentStageIndex < SCENARIO_DATA.length - 1) {
      setCurrentStageIndex(prev => prev + 1);
    }
  };

  const handleRestart = () => {
      setCurrentStageIndex(0);
      setAppState('landing');
  };

  if (appState === 'landing') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516549655169-df83a0833860?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>

        <div className="relative z-10 max-w-2xl w-full text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/50 mb-6 animate-pulse">
            <ShieldAlert size={16} />
            <span className="text-xs font-bold tracking-wider">MODULE 3: HIGH DIFFICULTY</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
            Shared Decision Making <br />
            <span className="text-cyan-400">AR Simulation</span>
          </h1>
          
          <p className="text-lg text-slate-300 mb-8 max-w-lg mx-auto leading-relaxed">
            Train in navigating complex clinical scenarios with AR assistance.
          </p>

          <button 
            onClick={() => setAppState('briefing')}
            className="group relative inline-flex items-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
          >
            <Play fill="currentColor" size={20} />
            Start Module
          </button>
          
          <div className="mt-8 flex justify-center gap-4 text-xs text-slate-500">
             <span className="flex items-center gap-1"><Camera size={12}/> Camera Access Required</span>
             <span className="flex items-center gap-1"><Box size={12}/> WebAR Compatible</span>
          </div>
        </div>
      </div>
    );
  }

  if (appState === 'briefing') {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative">
             <div className="max-w-3xl w-full glass-panel p-8 rounded-2xl border-l-4 border-cyan-500 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-4">
                    <FileText className="text-cyan-400" size={32} />
                    <div>
                        <h2 className="text-2xl font-bold text-white">Mission Briefing</h2>
                        <p className="text-slate-400 text-sm">Review patient details before engaging.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <h3 className="text-cyan-500 text-sm font-bold uppercase mb-2">Patient Profile</h3>
                        <p className="text-white text-lg font-bold mb-1">{PATIENT_PROFILE.name} ({PATIENT_PROFILE.age}세/남)</p>
                        <p className="text-slate-300 text-sm mb-4">{PATIENT_PROFILE.condition}</p>
                        
                        <h3 className="text-cyan-500 text-sm font-bold uppercase mb-2">Current Status</h3>
                        <p className="text-slate-300 text-sm">{PATIENT_PROFILE.status}</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                        <h3 className="text-cyan-500 text-sm font-bold uppercase mb-2">Clinical History</h3>
                        <p className="text-slate-300 text-sm leading-relaxed mb-4">{PATIENT_PROFILE.history}</p>
                        
                        <h3 className="text-cyan-500 text-sm font-bold uppercase mb-2">Social Context</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">{PATIENT_PROFILE.social}</p>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button 
                        onClick={() => setAppState('landing')}
                        className="px-6 py-3 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                        Back
                    </button>
                    <button 
                        onClick={() => setAppState('simulation')}
                        className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-cyan-900/50 transition-all"
                    >
                        Enter Simulation <Play size={16} fill="currentColor"/>
                    </button>
                </div>
             </div>
        </div>
    )
  }

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col">
      {/* Real Camera Feed */}
      <div className="absolute inset-0 z-0 bg-black">
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover"
          />
          {/* Fallback Image if camera fails or loads slow */}
          <img 
             src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop" 
             className={`absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-1000 ${videoRef.current?.srcObject ? 'opacity-0' : 'opacity-60'}`}
             alt="Fallback patient view"
          />
          <div className="absolute inset-0 ar-grid opacity-30 pointer-events-none"></div>
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/80 pointer-events-none"></div>
      </div>

      {/* Progress Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-slate-800 z-50">
        <div 
          className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4] transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* AR HUD Layers */}
      <AROverlay patient={PATIENT_PROFILE} currentStage={currentStage} />

      {/* Interactive Dialogue Layer */}
      <DialogueInterface 
        stage={currentStage} 
        onNext={handleNext} 
        isLastStage={currentStageIndex === SCENARIO_DATA.length - 1}
        onRestart={handleRestart}
      />
      
    </div>
  );
};

export default App;