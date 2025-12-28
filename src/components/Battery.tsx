import React from 'react';

interface BatteryProps {
    current: number;
    max: number;
    segments?: number;
    label?: string;
    variant?: 'default' | 'small' | 'vertical';
    charging?: boolean;
    className?: string; // Allow extra styling overrides
}

const Battery: React.FC<BatteryProps> = ({
    current,
    max,
    segments = 3,
    label,
    variant = 'default',
    charging = false,
    className = ''
}) => {
    // Clamp values
    const safeCurrent = Math.max(0, Math.min(current, max));
    const percentage = safeCurrent / max;
    const filledSegments = Math.ceil(percentage * segments);

    // Dynamic Colors based on charge level
    const getSegmentColor = () => {
        if (charging) return 'bg-cyan-400 animate-pulse'; // Charging state

        // If this segment is "filled" calculate its specific color or global color
        // Low power warning for first segment if total power is low
        if (percentage <= 0.2) return 'bg-red-500';
        if (percentage <= 0.5) return 'bg-amber-500';
        return 'bg-cyan-500';
    };

    return (
        <div className={`p-4 rounded-lg border border-cyan-900/50 bg-black/40 backdrop-blur-sm ${className}`}>
            {label && (
                <div className="flex justify-between items-end mb-2">
                    <span className="text-cyan-500 font-bold uppercase tracking-widest text-xs">
                        {label}
                    </span>
                    <span className="text-gray-400 font-mono text-xs">
                        {Math.round(percentage * 100)}%
                    </span>
                </div>
            )}

            <div className={`flex gap-1 ${variant === 'vertical' ? 'flex-col-reverse h-32 w-8' : 'flex-row w-full h-8'}`}>
                {Array.from({ length: segments }).map((_, index) => {
                    // Check if this segment is active
                    // For horizontal: 0 is left. For vertical: 0 is bottom (handled by flex-col-reverse)
                    const isActive = index < filledSegments;

                    return (
                        <div
                            key={index}
                            className={`
                                flex-1 rounded-sm transition-all duration-300 border border-gray-800
                                ${isActive
                                    ? getSegmentColor() + ' shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                                    : 'bg-gray-900/50'
                                }
                            `}
                        />
                    );
                })}
            </div>

            {/* Numeric read out below for detailed view */}
            {variant === 'default' && (
                <div className="mt-2 text-right">
                    <span className="font-mono text-[10px] text-gray-600">
                        {safeCurrent.toFixed(1)} / {max} MW
                    </span>
                </div>
            )}
        </div>
    );
};

export default Battery;
