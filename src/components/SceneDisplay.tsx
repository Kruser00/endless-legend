import React from 'react';

interface SceneDisplayProps {
  description: string;
}

const SceneDisplay: React.FC<SceneDisplayProps> = ({ description }) => {
  return (
    <div className="w-full bg-gray-800/50 backdrop-blur-sm md:rounded-lg shadow-lg p-4 md:p-6 lg:p-8">
      <p className="text-base sm:text-lg md:text-xl font-bold text-gray-200 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default SceneDisplay;