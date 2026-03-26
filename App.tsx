/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Calendar, 
  MessageSquare, 
  Mic, 
  Settings, 
  ChevronLeft, 
  CloudRain, 
  Thermometer,
  Info,
  CheckCircle2,
  AlertCircle,
  Languages,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CROPS, TRANSLATIONS } from './constants';
import { CropInfo, Disease, AdvisoryMessage } from './types';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type View = 'home' | 'diagnosis' | 'advisory' | 'chat';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [lang, setLang] = useState<'en' | 'sw'>('en');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<Disease | null>(null);
  const [messages, setMessages] = useState<AdvisoryMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState('');
  
  const t = TRANSLATIONS[lang];
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

  // Simulate offline diagnosis
  const handleDiagnosis = async (image: string) => {
    setIsAnalyzing(true);
    // In a real app, this would call a TFLite model on-device
    setTimeout(() => {
      // Mock result for demo
      const randomCrop = CROPS[Math.floor(Math.random() * CROPS.length)];
      const randomDisease = randomCrop.diseases[Math.floor(Math.random() * randomCrop.diseases.length)];
      setDiagnosisResult({ ...randomDisease, confidence: 0.85 + Math.random() * 0.1 });
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: AdvisoryMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: text,
        config: {
          systemInstruction: `You are Kilimo Smart, an expert agricultural advisor for smallholder farmers in East Africa (Kenya, Uganda, Tanzania). 
          Provide advice in ${lang === 'sw' ? 'Swahili' : 'English'}. 
          Focus on climate-smart agriculture, organic pest control, and local best practices. 
          Always ground your advice in KALRO (Kenya Agricultural and Livestock Research Organization) and FAO guidelines.
          Keep responses concise, practical, and easy to understand for someone with low digital literacy.
          If the user asks about pests/diseases, mention specific local solutions like neem oil or crop rotation.
          End every response with "Source: KALRO/FAO Guidelines".`,
        }
      });

      const assistantMsg: AdvisoryMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || "Sorry, I cannot answer right now.",
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error("AI Error:", error);
    }
  };

  const toggleLanguage = () => setLang(l => l === 'en' ? 'sw' : 'en');

  return (
    <div className="min-h-screen bg-shamba-cream flex flex-col md:flex-row">
      {/* Desktop Sidebar / Mobile Header */}
      <header className="md:w-64 lg:w-72 bg-white md:border-r border-gray-100 flex flex-col sticky top-0 md:h-screen z-50">
        <div className="p-6 flex justify-between items-center md:block">
          <div className="flex items-center gap-2">
            {view !== 'home' && (
              <button onClick={() => setView('home')} className="p-2 -ml-2 md:hidden">
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            <h1 className="text-xl lg:text-2xl font-bold text-shamba-green serif">Kilimo Smart</h1>
          </div>
          
          <div className="flex items-center gap-3 md:mt-8">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-shamba-cream text-sm font-bold text-shamba-green border border-shamba-green/10"
            >
              <Languages className="w-4 h-4" />
              {lang === 'en' ? 'SW' : 'EN'}
            </button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-col gap-2 p-4 flex-1">
          <DesktopNavButton active={view === 'home'} icon={<Settings className="w-5 h-5" />} label="Dashboard" onClick={() => setView('home')} />
          <DesktopNavButton active={view === 'diagnosis'} icon={<Camera className="w-5 h-5" />} label={t.diagnosis} onClick={() => setView('diagnosis')} />
          <DesktopNavButton active={view === 'advisory'} icon={<Calendar className="w-5 h-5" />} label={t.advisory} onClick={() => setView('advisory')} />
          <DesktopNavButton active={view === 'chat'} icon={<MessageSquare className="w-5 h-5" />} label={t.chat} onClick={() => setView('chat')} />
        </nav>

        <div className="hidden md:block p-6 border-t border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-shamba-accent" />
            <div>
              <p className="text-sm font-bold">Farmer Victor</p>
              <p className="text-xs text-gray-400">Kakamega, KE</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 pb-24 md:pb-8 overflow-y-auto max-w-6xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="card p-8 bg-shamba-green text-white relative overflow-hidden md:min-h-[200px] flex flex-col justify-center">
                <div className="relative z-10 max-w-lg">
                  <h2 className="text-3xl md:text-4xl font-bold mb-3 serif">{t.welcome}</h2>
                  <p className="opacity-90 text-lg">Your AI-powered companion for climate-smart farming in East Africa.</p>
                </div>
                <div className="absolute -right-8 -bottom-8 opacity-10">
                  <CloudRain className="w-64 h-64" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <MenuButton 
                  icon={<Camera className="w-8 h-8" />}
                  label={t.diagnosis}
                  sublabel="Take a photo of your crop to detect diseases"
                  onClick={() => setView('diagnosis')}
                  color="bg-emerald-50 text-emerald-700"
                />
                <MenuButton 
                  icon={<Calendar className="w-8 h-8" />}
                  label={t.advisory}
                  sublabel="Get localized planting schedules and weather"
                  onClick={() => setView('advisory')}
                  color="bg-amber-50 text-amber-700"
                />
                <MenuButton 
                  icon={<MessageSquare className="w-8 h-8" />}
                  label={t.chat}
                  sublabel="Chat with our expert AI for farming advice"
                  onClick={() => setView('chat')}
                  color="bg-blue-50 text-blue-700"
                />
              </div>

              <div className="mt-12">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 px-1">Farmer Community Stories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map(i => (
                    <div key={i} className="card p-6 flex gap-5 items-center">
                      <div className="w-16 h-16 rounded-2xl bg-shamba-accent flex-shrink-0" />
                      <div>
                        <p className="text-base italic leading-relaxed">"Kilimo Smart helped me save my maize crop from armyworms! The Swahili advice was so easy to follow."</p>
                        <p className="text-sm font-bold mt-3 text-shamba-green">— Mama Njeri, Kakamega County</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'diagnosis' && (
            <motion.div 
              key="diagnosis"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <div className="text-center space-y-6">
                <div className="w-full aspect-video md:aspect-[21/9] card flex flex-col items-center justify-center border-dashed border-2 border-shamba-green/30 bg-white overflow-hidden relative">
                  {isAnalyzing ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 border-4 border-shamba-green border-t-transparent rounded-full animate-spin" />
                      <p className="font-bold text-shamba-green text-lg">{t.analyzing}</p>
                    </div>
                  ) : diagnosisResult ? (
                    <div className="w-full h-full p-8 flex flex-col md:flex-row gap-8 text-left">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-shamba-green mb-4">
                          <CheckCircle2 className="w-6 h-6" />
                          <span className="font-bold text-lg">{t.results}</span>
                        </div>
                        <h3 className="text-3xl font-bold serif">{lang === 'sw' ? diagnosisResult.swahiliName : diagnosisResult.name}</h3>
                        <div className="mt-3 inline-block px-4 py-1.5 rounded-full bg-shamba-green/10 text-shamba-green text-sm font-bold">
                          Confidence: {(diagnosisResult.confidence! * 100).toFixed(0)}%
                        </div>
                        
                        <div className="mt-8 space-y-6">
                          <div>
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t.treatment}</h4>
                            <p className="text-lg mt-2 leading-relaxed">{diagnosisResult.treatment}</p>
                          </div>
                          <div className="p-6 rounded-3xl bg-amber-50 border border-amber-100">
                            <h4 className="text-sm font-bold text-amber-800 uppercase flex items-center gap-2 mb-2">
                              <Info className="w-5 h-5" /> {t.organic}
                            </h4>
                            <p className="text-base text-amber-900 leading-relaxed">{diagnosisResult.organicTreatment}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:w-64 flex flex-col justify-end">
                        <button 
                          onClick={() => setDiagnosisResult(null)}
                          className="btn-secondary w-full"
                        >
                          Scan Another Plant
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center p-12">
                      <Camera className="w-20 h-20 text-shamba-green opacity-10 mb-6" />
                      <button 
                        onClick={() => handleDiagnosis('dummy')}
                        className="btn-primary text-lg px-10 py-5"
                      >
                        <Camera className="w-6 h-6" />
                        {t.takePhoto}
                      </button>
                      <p className="text-sm text-gray-400 mt-6 font-medium">Supported Crops: Maize, Beans, Cassava, Potatoes</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'advisory' && (
            <motion.div 
              key="advisory"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="card p-6 bg-blue-50 border-blue-100 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center">
                    <CloudRain className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-800 font-bold uppercase tracking-widest">Rainfall Forecast</p>
                    <p className="text-2xl font-bold text-blue-900">Moderate Rains</p>
                  </div>
                </div>
                <div className="card p-6 bg-orange-50 border-orange-100 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-orange-600/10 flex items-center justify-center">
                    <Thermometer className="w-8 h-8 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-orange-800 font-bold uppercase tracking-widest">Temperature</p>
                    <p className="text-2xl font-bold text-orange-900">24°C - 28°C</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card p-8">
                  <h3 className="text-xl font-bold serif mb-8 flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-shamba-green" />
                    Planting Calendar - Western Kenya
                  </h3>
                  <div className="space-y-6">
                    {CROPS.map(crop => (
                      <div key={crop.id} className="flex gap-6 items-start pb-6 border-b border-gray-50 last:border-0">
                        <div className="w-14 h-14 rounded-2xl bg-shamba-cream flex items-center justify-center flex-shrink-0 font-bold text-xl text-shamba-green serif">
                          {crop.name[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="text-lg font-bold">{lang === 'sw' ? crop.swahiliName : crop.name}</h4>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-shamba-green uppercase bg-shamba-green/5 px-2 py-1 rounded">
                              <CheckCircle2 className="w-3 h-3" /> Ideal
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{crop.plantingSeason}</p>
                          <p className="text-xs text-gray-400 mt-2 italic">{crop.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="card p-6 bg-shamba-green text-white">
                    <h4 className="text-sm font-bold uppercase flex items-center gap-2 mb-4">
                      <AlertCircle className="w-4 h-4" /> {t.plantingTip}
                    </h4>
                    <p className="text-base opacity-90 leading-relaxed">
                      Ensure soil is moist before planting maize. Use compost to improve soil fertility in sandy areas of Busia.
                    </p>
                    <p className="text-[10px] mt-4 opacity-60 italic">{t.source}</p>
                  </div>
                  
                  <div className="card p-6">
                    <h4 className="text-sm font-bold uppercase text-gray-400 mb-4">Market Trends</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Maize (90kg)</span>
                        <span className="font-bold text-emerald-600">KES 4,200 ↑</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Beans (90kg)</span>
                        <span className="font-bold text-emerald-600">KES 9,500 ↑</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'chat' && (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto flex flex-col h-[75vh] md:h-[80vh]"
            >
              <div className="flex-1 overflow-y-auto space-y-6 p-4 md:p-6 bg-white rounded-3xl shadow-sm border border-gray-50 no-scrollbar">
                {messages.length === 0 && (
                  <div className="text-center py-24 opacity-30">
                    <MessageSquare className="w-20 h-20 mx-auto mb-6" />
                    <p className="text-xl font-medium">{t.voicePrompt}</p>
                    <p className="text-sm mt-2">Ask about pests, fertilizers, or market prices.</p>
                  </div>
                )}
                {messages.map(m => (
                  <div 
                    key={m.id} 
                    className={cn(
                      "max-w-[90%] md:max-w-[75%] p-5 rounded-3xl text-base leading-relaxed",
                      m.role === 'user' 
                        ? "bg-shamba-green text-white ml-auto rounded-tr-none shadow-md" 
                        : "bg-shamba-cream text-gray-800 mr-auto rounded-tl-none border border-shamba-green/5"
                    )}
                  >
                    <div className="prose prose-sm md:prose-base prose-invert max-w-none">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                    {m.role === 'assistant' && (
                      <button className="mt-4 flex items-center gap-2 text-xs font-bold text-shamba-green uppercase hover:opacity-70 transition-opacity">
                        <Volume2 className="w-4 h-4" /> Listen to Audio
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3 items-center bg-white p-2 rounded-full shadow-lg border border-gray-100">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                  placeholder={lang === 'sw' ? "Andika swali lako hapa..." : "Ask your farming question here..."}
                  className="flex-1 px-6 py-4 text-base focus:outline-none bg-transparent"
                />
                <button 
                  onClick={() => handleSendMessage(inputText)}
                  className="w-14 h-14 rounded-full bg-shamba-green text-white flex items-center justify-center flex-shrink-0 hover:scale-105 active:scale-95 transition-transform shadow-md"
                >
                  <Mic className={cn("w-7 h-7", isRecording && "animate-pulse text-red-400")} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 px-8 py-5 flex justify-between items-center z-50">
        <NavIcon active={view === 'home'} icon={<Settings className="w-7 h-7" />} onClick={() => setView('home')} />
        <NavIcon active={view === 'diagnosis'} icon={<Camera className="w-7 h-7" />} onClick={() => setView('diagnosis')} />
        <NavIcon active={view === 'advisory'} icon={<Calendar className="w-7 h-7" />} onClick={() => setView('advisory')} />
        <NavIcon active={view === 'chat'} icon={<MessageSquare className="w-7 h-7" />} onClick={() => setView('chat')} />
      </nav>
    </div>
  );
}

function DesktopNavButton({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all text-left",
        active 
          ? "bg-shamba-green text-white shadow-lg shadow-shamba-green/20" 
          : "text-gray-500 hover:bg-shamba-cream hover:text-shamba-green"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function MenuButton({ icon, label, sublabel, onClick, color }: { icon: React.ReactNode, label: string, sublabel: string, onClick: () => void, color: string }) {
  return (
    <button 
      onClick={onClick}
      className="card p-6 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left transition-all hover:translate-y-[-4px] hover:shadow-xl active:scale-[0.98]"
    >
      <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-sm", color)}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-xl serif text-gray-900">{label}</h3>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">{sublabel}</p>
      </div>
    </button>
  );
}

function NavIcon({ active, icon, onClick }: { active: boolean, icon: React.ReactNode, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-2 transition-all relative",
        active ? "text-shamba-green scale-110" : "text-gray-300"
      )}
    >
      {icon}
      {active && (
        <motion.div 
          layoutId="nav-dot" 
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-shamba-green" 
        />
      )}
    </button>
  );
}
