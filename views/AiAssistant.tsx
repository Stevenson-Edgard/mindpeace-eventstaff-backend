import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles, Bot, User, Mic, MicOff } from 'lucide-react';
import Markdown from 'react-markdown';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const AiAssistant: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Hello! I am Sister Nadia, your EventStaff AI Assistant. I can help you with event logistics, financial summaries, protocols, or any other questions you have about the event. How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        setInput('');
        // Send the message automatically
        const userText = transcript.trim();
        if (!userText) return;
        const newUserMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: userText };
        setMessages(prev => [...prev, newUserMsg]);
        setIsLoading(true);
        (async () => {
          try {
            const contents = messages.map(msg => ({
              role: msg.role,
              parts: [{ text: msg.text }]
            })).concat({ role: 'user', parts: [{ text: userText }] });
            const response = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: contents as any,
              config: {
                systemInstruction: "You are Sister Nadia, an AI assistant for the MindPeace EventStaff Pro app. You help event staff with operations, logistics, financial summaries, and protocols. The event has 1000 capacity, tickets are $50. Current check-in is around 842. Gross income is $42,100, outcome is $18,500. Be warm, helpful, and professional. Format your responses using Markdown.",
              }
            });
            const modelText = response.text || "I'm sorry, I couldn't generate a response.";
            setMessages(prev => [...prev, {
              id: (Date.now() + 1).toString(),
              role: 'model',
              text: modelText
            }]);
          } catch (error) {
            setMessages(prev => [...prev, {
              id: (Date.now() + 1).toString(),
              role: 'model',
              text: "I'm sorry, I encountered an error connecting to the intelligence server. Please try again later."
            }]);
          } finally {
            setIsLoading(false);
          }
        })();
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    
    const newUserMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: userText };
    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      // Format history for Gemini
      const contents = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      })).concat({ role: 'user', parts: [{ text: userText }] });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: contents as any,
        config: {
          systemInstruction: "You are Sister Nadia, an AI assistant for the MindPeace EventStaff Pro app. You help event staff with operations, logistics, financial summaries, and protocols. The event has 1000 capacity, tickets are $50. Current check-in is around 842. Gross income is $42,100, outcome is $18,500. Be warm, helpful, and professional. Format your responses using Markdown.",
        }
      });

      const modelText = response.text || "I'm sorry, I couldn't generate a response.";
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: modelText
      }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm sorry, I encountered an error connecting to the intelligence server. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background-dark min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 py-6 flex items-center justify-between sticky top-0 bg-background-dark/80 backdrop-blur-md z-10 border-b border-slate-800">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-slate-800 rounded-full text-white active:scale-95 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight font-display flex items-center">
              Sister Nadia <Sparkles className="w-4 h-4 text-primary ml-2" />
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Powered by Gemini</p>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 px-4 py-6 overflow-y-auto hide-scrollbar flex flex-col space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 overflow-hidden ${msg.role === 'user' ? 'bg-slate-700 ml-3' : 'bg-primary/20 text-primary mr-3 border border-primary/30'}`}>
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-slate-300" />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=100&h=100" 
                    alt="Sister Nadia" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
              <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-slate-800 text-white rounded-tr-sm' : 'bg-primary/10 border border-primary/20 text-slate-200 rounded-tl-sm'}`}>
                <div className="text-sm prose prose-invert prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 max-w-none">
                  <Markdown>{msg.text}</Markdown>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex max-w-[85%] flex-row">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 overflow-hidden bg-primary/20 text-primary mr-3 border border-primary/30">
                <img 
                  src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=100&h=100" 
                  alt="Sister Nadia" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-slate-200 rounded-tl-sm flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <div className="fixed bottom-[85px] left-1/2 -translate-x-1/2 w-full max-w-[430px] p-4 bg-gradient-to-t from-background-dark via-background-dark to-transparent">
        <form onSubmit={handleSend} className="relative flex items-center space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening..." : "Ask about the event..."}
              className={`w-full bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-full py-3.5 pl-5 pr-12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-lg ${isListening ? 'ring-2 ring-primary border-primary animate-pulse' : ''}`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={toggleListening}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'text-slate-400 hover:text-primary'}`}
              disabled={isLoading}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3.5 bg-primary text-white rounded-full disabled:opacity-50 disabled:bg-slate-700 transition-all active:scale-90 shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiAssistant;