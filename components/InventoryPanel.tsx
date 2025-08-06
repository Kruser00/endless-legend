import React from 'react';

interface InventoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: string[];
}

const InventoryPanel: React.FC<InventoryPanelProps> = ({ isOpen, onClose, inventory }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-md p-6 border border-amber-500/20 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-3">
          <h2 className="text-2xl font-title text-amber-400">موجودی شما</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-3xl leading-none p-1">&times;</button>
        </div>
        
        {inventory.length > 0 ? (
          <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {inventory.map((item, index) => (
              <li key={index} className="bg-gray-900/50 p-3 rounded-md text-gray-300 border-r-2 border-amber-500/50">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic text-center py-8">کوله‌پشتی شما خالی است.</p>
        )}

        <button 
          onClick={onClose}
          className="mt-6 w-full p-2 bg-amber-600 text-white font-bold rounded-md hover:bg-amber-500 transition-colors"
        >
          بستن
        </button>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default InventoryPanel;