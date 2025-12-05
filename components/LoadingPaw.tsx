import React from 'react';

export const LoadingPaw: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 p-4 bg-white rounded-2xl rounded-tl-none shadow-sm max-w-[100px]">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-cat-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-cat-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-cat-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
      <span className="text-cat-400 text-xs font-bold">思考中...</span>
    </div>
  );
};