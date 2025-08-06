import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface SceneDisplayProps {
  image: string | null;
  description: string;
  isLoading: boolean;
}

const SceneDisplay: React.FC<SceneDisplayProps> = ({ image, description, isLoading }) => {
  return (
    <div className="relative w-full aspect-[16/9] md:aspect-auto md:h-full overflow-hidden shadow-2xl bg-gray-800 flex items-center justify-center text-gray-400 md:rounded-lg">
      {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 z-20">
              <LoadingSpinner />
              <p className="mt-2 font-bold text-lg animate-pulse">در حال ترسیم صحنه...</p>
          </div>
      )}
      
      {image ? (
        <img
          src={image}
          alt="Scene from the adventure"
          className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
          style={{ opacity: isLoading ? 0 : 1 }}
        />
      ) : (
        <div className="w-full h-full bg-black"></div>
      )
    }

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 md:p-6 lg:p-8">
        <p className="text-sm sm:text-base md:text-lg font-bold text-gray-200 leading-relaxed shadow-black [text-shadow:_0_1px_2px_var(--tw-shadow-color)]">
          {description}
        </p>
      </div>
    </div>
  );
};

export default SceneDisplay;