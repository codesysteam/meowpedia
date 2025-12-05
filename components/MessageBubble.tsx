import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Basic formatter for Markdown-like bolding and lists since we aren't using a heavy library
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Bold handling (**text**)
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <div key={i} className={`min-h-[1.2em] ${line.startsWith('- ') || line.startsWith('* ') ? 'pl-4' : ''}`}>
           {line.startsWith('### ') && <h3 className="text-lg font-bold text-cat-800 mt-2 mb-1">{line.replace('### ', '')}</h3>}
           {!line.startsWith('### ') && parts.map((part, j) => {
             if (part.startsWith('**') && part.endsWith('**')) {
               return <strong key={j} className="text-cat-800">{part.slice(2, -2)}</strong>;
             }
             return <span key={j}>{part}</span>;
           })}
        </div>
      );
    });
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-md ${isUser ? 'bg-indigo-100' : 'bg-cat-200'}`}>
          <span className="text-xl">{isUser ? '👤' : '😸'}</span>
        </div>

        {/* Bubble */}
        <div 
          className={`
            p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed
            ${isUser 
              ? 'bg-indigo-500 text-white rounded-tr-none' 
              : 'bg-white text-gray-700 rounded-tl-none border border-cat-100'
            }
          `}
        >
          {isUser ? (
            <p>{message.text}</p>
          ) : (
            <div className="space-y-1">
              {formatText(message.text)}
              
              {/* Grounding Sources */}
              {message.groundingMetadata?.groundingChunks && message.groundingMetadata.groundingChunks.length > 0 && (
                <div className="mt-4 pt-3 border-t border-cat-100">
                  <p className="text-xs font-bold text-cat-400 mb-2">🔎 参考资料 (来源):</p>
                  <div className="flex flex-wrap gap-2">
                    {message.groundingMetadata.groundingChunks.map((chunk, idx) => {
                      if (chunk.web?.uri && chunk.web?.title) {
                        return (
                          <a 
                            key={idx}
                            href={chunk.web.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-cat-50 text-cat-600 px-2 py-1 rounded-full border border-cat-200 hover:bg-cat-100 transition-colors truncate max-w-[200px]"
                          >
                            🔗 {chunk.web.title}
                          </a>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};