import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from './services/geminiService';
import { Message, SUGGESTED_QUESTIONS, CatFact } from './types';
import { LoadingPaw } from './components/LoadingPaw';
import { MessageBubble } from './components/MessageBubble';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showIntro, setShowIntro] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    // Dismiss intro if it's the first message
    if (showIntro) setShowIntro(false);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for context
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await sendMessageToGemini(text, history);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        groundingMetadata: response.groundingMetadata
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: '喵呜！遇到了一点小问题，请稍后再试一次喵~',
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (fact: CatFact) => {
    handleSend(fact.description);
  };

  return (
    <div className="flex flex-col h-screen bg-cat-50 text-gray-800 font-sans overflow-hidden">
      
      {/* Header */}
      <header className="flex-none bg-white border-b border-cat-100 px-6 py-4 shadow-sm z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-cat-500 text-white p-2 rounded-xl shadow-lg transform -rotate-6">
            <span className="text-2xl">🐱</span>
          </div>
          <div>
            <h1 className="text-2xl font-cute text-cat-600 tracking-wide">MeowPedia</h1>
            <p className="text-xs text-cat-400 font-bold">喵喵百科全书 - 懂基因也懂卖萌</p>
          </div>
        </div>
        <div className="hidden md:block text-sm text-gray-400">
           Powered by Gemini
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 relative">
        <div className="max-w-3xl mx-auto min-h-full flex flex-col">
          
          {/* Intro / Empty State */}
          {showIntro && messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-10 fade-in">
              <div className="text-center space-y-4">
                <div className="text-6xl animate-bounce-slow">😻</div>
                <h2 className="text-3xl font-cute text-cat-800">欢迎来到喵喵百科！</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  我是喵博士。无论你想了解猫咪的<span className="text-cat-500 font-bold">隐性基因</span>，
                  还是<span className="text-cat-500 font-bold">圆滚滚的外形</span>，都可以问我哦！
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                {SUGGESTED_QUESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(item)}
                    className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md hover:border-cat-300 border border-transparent transition-all group text-left"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-800 group-hover:text-cat-600 transition-colors">{item.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages List */}
          <div className={`flex-1 ${showIntro ? 'hidden' : 'block'}`}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-6">
                 <div className="flex max-w-[85%] items-end gap-3">
                   <div className="w-10 h-10 rounded-full bg-cat-200 flex items-center justify-center shrink-0">
                      <span className="text-xl">😸</span>
                   </div>
                   <LoadingPaw />
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

        </div>
      </main>

      {/* Input Area */}
      <footer className="flex-none bg-white p-4 border-t border-cat-100">
        <div className="max-w-3xl mx-auto relative">
          <div className="relative flex items-center bg-gray-50 rounded-full border-2 border-cat-100 focus-within:border-cat-400 focus-within:ring-2 focus-within:ring-cat-100 transition-all shadow-inner">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="问问喵博士关于猫咪的一切..."
              className="flex-1 bg-transparent px-6 py-4 outline-none text-gray-700 placeholder-gray-400 rounded-l-full"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className={`
                mr-2 p-3 rounded-full transition-all duration-300
                ${input.trim() && !isLoading 
                  ? 'bg-cat-500 text-white shadow-md hover:bg-cat-600 transform hover:scale-105 active:scale-95' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
          <div className="text-center mt-2">
            <span className="text-[10px] text-gray-400">喵博士可能偶尔会犯错，请核实重要信息喵。</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;