import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useGame } from '../context/GameContext';

const ThemeProgram: React.FC = () => {
    const { theme, updateTheme } = useTheme();
    const { saveGame, loadGame, savedSlots } = useGame();

    const handleColorChange = (key: keyof typeof theme) => (e: React.ChangeEvent<HTMLInputElement>) => {
        updateTheme({ [key]: e.target.value });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            {/* Theme Controls */}
            <section className="bg-theme-surface/50 border border-theme-primary/30 rounded-xl p-8 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-theme-primary mb-6 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-8 bg-theme-accent"></span>
                    Visual Interface Systems
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-gray-400">Primary System Color</label>
                            <div className="flex items-center gap-4 bg-black/20 p-3 rounded-lg border border-gray-800">
                                <input
                                    type="color"
                                    value={theme.primary}
                                    onChange={handleColorChange('primary')}
                                    className="bg-transparent w-12 h-12 rounded cursor-pointer border-none"
                                />
                                <span className="font-mono text-theme-primary">{theme.primary}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-gray-400">Background/Void Color</label>
                            <div className="flex items-center gap-4 bg-black/20 p-3 rounded-lg border border-gray-800">
                                <input
                                    type="color"
                                    value={theme.background}
                                    onChange={handleColorChange('background')}
                                    className="bg-transparent w-12 h-12 rounded cursor-pointer border-none"
                                />
                                <span className="font-mono text-gray-400">{theme.background}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-gray-400">Accent/Warning Color</label>
                            <div className="flex items-center gap-4 bg-black/20 p-3 rounded-lg border border-gray-800">
                                <input
                                    type="color"
                                    value={theme.accent}
                                    onChange={handleColorChange('accent')}
                                    className="bg-transparent w-12 h-12 rounded cursor-pointer border-none"
                                />
                                <span className="font-mono text-theme-accent">{theme.accent}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-gray-400">Surface/Panel Color</label>
                            <div className="flex items-center gap-4 bg-black/20 p-3 rounded-lg border border-gray-800">
                                <input
                                    type="color"
                                    value={theme.surface}
                                    onChange={handleColorChange('surface')}
                                    className="bg-transparent w-12 h-12 rounded cursor-pointer border-none"
                                />
                                <span className="font-mono text-gray-400">{theme.surface}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Save System Controls */}
            <section className="bg-theme-surface/50 border border-theme-primary/30 rounded-xl p-8 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-theme-primary mb-6 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-8 bg-green-500"></span>
                    State Persistence
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {['slot1', 'slot2', 'slot3'].map((slot) => (
                        <div key={slot} className="flex flex-col gap-3 p-4 border border-gray-800 rounded bg-black/40">
                            <h3 className="font-mono text-gray-300 font-bold uppercase">{slot}</h3>
                            <div className="text-xs text-gray-500 font-mono mb-2">
                                {savedSlots.includes(slot) ? 'DATA_PRESENCE: DETECTED' : 'DATA_PRESENCE: NULL'}
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-auto">
                                <button
                                    onClick={() => saveGame(slot)}
                                    className="px-3 py-2 bg-theme-primary/20 hover:bg-theme-primary/40 text-theme-primary border border-theme-primary/50 rounded text-xs uppercase tracking-wider font-bold transition-all"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => loadGame(slot)}
                                    disabled={!savedSlots.includes(slot)}
                                    className="px-3 py-2 bg-theme-accent/20 hover:bg-theme-accent/40 text-theme-accent border border-theme-accent/50 rounded text-xs uppercase tracking-wider font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    Load
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ThemeProgram;
