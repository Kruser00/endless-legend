

import React from 'react';

interface HealthBarProps {
  health: number;
}

const HealthBar: React.FC<HealthBarProps> = ({ health }) => {
    const healthPercentage = Math.max(0, Math.min(100, health));
    const color = healthPercentage > 60 ? 'bg-green-600' : healthPercentage > 30 ? 'bg-yellow-500' : 'bg-red-700';

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-gray-300">سلامتی</span>
                <span className="text-sm font-bold text-white tabular-nums">{health} / 100</span>
            </div>
            <div
                className="w-full bg-gray-900/50 rounded-full h-3 border border-gray-700"
                role="progressbar"
                aria-valuenow={health}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Player health"
            >
                <div
                    className={`${color} h-full rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${healthPercentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default HealthBar;