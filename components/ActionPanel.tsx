import React, { useRef, useEffect, useState } from 'react';
import type { Action } from '../types';
import HealthBar from './HealthBar';

interface ActionPanelProps {
  health: number;
  status: string;
  actions: Action[];
  onAction: (action: string) => void;
  disabled: boolean;
  history: string[];
  recap: string;
  onToggleInventory: () => void;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ health, status, actions, onAction, disabled, history, recap, onToggleInventory }) => {
  const historyEndRef = useRef<HTMLDivElement>(null);
  const [customAction, setCustomAction] = useState('');

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAction.trim() && !disabled) {
      onAction(customAction);
      setCustomAction('');
    }
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm md:rounded-lg shadow-xl h-full flex flex-col p-3 sm:p-4 md:p-6">
      <div className="flex-shrink-0 pt-4 md:pt-0">
        <div className="mb-4">
          <HealthBar health={health} />
        </div>

        <div className="flex justify-between items-center border-b-2 border-amber-400/20 pb-2 mb-3">
          <h2 className="text-xl md:text-2xl font-title text-amber-400">وضعیت شما</h2>
          <button 
            onClick={onToggleInventory}
            disabled={disabled}
            className="px-4 py-1 bg-gray-700 text-amber-300 rounded-md text-sm font-bold transition-colors hover:bg-gray-600 disabled:opacity-50"
          >
            موجودی
          </button>
        </div>
        <p className="text-gray-300 mb-3 text-sm md:text-base">{status}</p>

        {recap && recap.length > 0 && recap !== "N/A" && (
          <div className="mb-3 p-3 bg-gray-700/50 rounded-md border-r-4 border-blue-400">
            <p className="text-blue-200 italic text-sm">"{recap}"</p>
          </div>
        )}
      </div>

      <div className="flex-grow flex flex-col min-h-0">
        <h3 className="text-sm font-bold text-gray-400 mb-2 flex-shrink-0">گزارش ماجراجویی</h3>
        <div className="bg-gray-900/70 rounded-md p-3 flex-grow overflow-y-auto mb-4 min-h-24 max-h-52 md:max-h-none">
          {history.map((line, index) => (
            <p key={index} className={`whitespace-pre-wrap text-sm ${line.startsWith('>') ? 'text-amber-300' : 'text-gray-400 italic'}`}>
                {line}
            </p>
          ))}
          <div ref={historyEndRef} />
        </div>
      </div>
      
      <div className="flex-shrink-0">
        <h3 className="text-xl md:text-2xl font-title text-amber-400 pb-2 mb-3">چه کار می‌کنی؟</h3>
        <div className="grid grid-cols-1 gap-2">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => onAction(action.text)}
              disabled={disabled}
              className="w-full text-start p-2.5 sm:p-3 bg-gray-700 text-white rounded-md transition-all duration-200 hover:bg-amber-600 hover:shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              {action.text}
            </button>
          ))}
        </div>
        
        <div className="my-3 flex items-center gap-2">
          <hr className="flex-grow border-gray-600"/>
          <span className="text-gray-500 font-bold text-xs">یا</span>
          <hr className="flex-grow border-gray-600"/>
        </div>

        <form onSubmit={handleCustomSubmit} className="flex gap-2">
          <input
            type="text"
            value={customAction}
            onChange={(e) => setCustomAction(e.target.value)}
            placeholder="اقدام خود را بنویسید..."
            disabled={disabled}
            className="flex-grow bg-gray-900/70 border border-gray-600 rounded-md p-2.5 sm:p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={disabled || !customAction.trim()}
            className="px-5 py-2 bg-amber-700 text-white font-bold rounded-md transition-colors hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ارسال
          </button>
        </form>
      </div>
    </div>
  );
};

export default ActionPanel;