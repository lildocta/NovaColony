import React from 'react';
import { useGame } from '../context/GameContext';
import { notify } from '../utils/notifications';

const HUD: React.FC = () => {
    const { state, modifyPower } = useGame();
    const { selection, power, maxPower } = state;

    const handleAction = (cost: number, actionName: string) => {
        if (modifyPower(-cost)) {
            notify.success('ACTION INITIATED', `${actionName} active`);
        } else {
            notify.error('INSUFFICIENT POWER', `Required: ${cost} MW`);
        }
    };

    // Power Bar Calculation
    const powerPercent = (power / maxPower) * 100;
    const powerColor = powerPercent > 20 ? 'bg-theme-primary' : 'bg-red-500';

    return (
        <>
            {/* Power Monitor (Top Left) */}
            <div className="fixed top-4 left-4 z-[100] w-64 pointer-events-none fade-in slide-in-from-left-4 animate-in duration-500">
                <div className="bg-theme-surface/90 border border-theme-primary/30 p-3 rounded backdrop-blur-md shadow-[0_0_20px_rgba(var(--theme-primary),0.2)]">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-theme-primary font-bold text-xs uppercase tracking-widest">Reactor Core</span>
                        <span className="text-white font-mono text-xs">{power}/{maxPower} MW</span>
                    </div>
                    <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-700">
                        <div
                            className={`h-full ${powerColor} transition-all duration-500 ease-out`}
                            style={{ width: `${powerPercent}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Target Information Panel (Top Right) */}
            {selection && (
                <div className="fixed top-4 right-4 z-[100] w-80 pointer-events-none">
                    <div className="bg-theme-surface/90 border border-theme-primary/30 p-4 rounded backdrop-blur-md shadow-[0_0_20px_rgba(var(--theme-primary),0.2)] pointer-events-auto transition-all duration-300 animate-in fade-in slide-in-from-right-4">
                        <div className="flex justify-between items-center border-b border-theme-primary/30 pb-2 mb-3">
                            <h2 className="text-theme-primary font-bold text-sm uppercase tracking-widest">
                                Target Analysis
                            </h2>
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-theme-primary/50 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-theme-primary/30 rounded-full"></div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {selection.type === 'star' ? (
                                <>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-gray-400 text-xs uppercase tracking-wider">System</span>
                                        <span className="text-white font-mono text-lg font-bold">{selection.data.name}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-gray-400 text-xs uppercase tracking-wider">Class</span>
                                        <span className="text-theme-accent font-mono text-sm">{selection.data.type}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-gray-400 text-xs uppercase tracking-wider">Planets</span>
                                        <span className="text-theme-primary font-mono text-sm">{selection.data.planets.length} Detected</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-gray-400 text-xs uppercase tracking-wider">Coords</span>
                                        <span className="text-gray-500 font-mono text-xs">
                                            [{selection.data.position.map(n => n.toFixed(0)).join(', ')}]
                                        </span>
                                    </div>

                                    <div className="mt-4 pt-2 border-t border-theme-primary/10">
                                        <button
                                            onClick={() => handleAction(20, "Course Plotting")}
                                            className="w-full py-2 bg-theme-primary/20 hover:bg-theme-primary/40 text-theme-primary border border-theme-primary/50 rounded uppercase text-xs font-bold tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Plot Course (20 MW)
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-gray-400 text-xs uppercase tracking-wider">Object</span>
                                        <span className="text-white font-mono text-lg font-bold">{selection.data.name}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-gray-400 text-xs uppercase tracking-wider">Parent Star</span>
                                        <span className="text-gray-300 font-mono text-sm">{selection.starName}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-gray-400 text-xs uppercase tracking-wider">Type</span>
                                        <span className="text-theme-accent font-mono text-sm">{selection.data.type}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-gray-400 text-xs uppercase tracking-wider">Distance</span>
                                        <span className="text-gray-500 font-mono text-xs">{selection.data.distance.toFixed(2)} AU</span>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => handleAction(10, "Orbital Scan")}
                                            className="py-2 bg-theme-primary/10 hover:bg-theme-primary/20 text-theme-primary border border-theme-primary/30 rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
                                        >
                                            Scan (10 MW)
                                        </button>
                                        <button
                                            onClick={() => handleAction(50, "Probe Launch")}
                                            className="py-2 bg-theme-primary/10 hover:bg-theme-primary/20 text-theme-primary border border-theme-primary/30 rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
                                        >
                                            Probe (50 MW)
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Flavor text footer for HUD */}
                    <div className="mt-1 text-right">
                        <span className="text-[10px] text-theme-primary/40 font-mono">UPLINK_ESTABLISHED // DATA_STREAM_ACTIVE</span>
                    </div>
                </div>
            )}
        </>
    );
};

export default HUD;
