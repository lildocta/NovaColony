import React, { useState } from 'react';

interface Props {
    onExit: () => void;
}

const Counter: React.FC<Props> = () => {
    const [count, setCount] = useState(0);

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="p-8 border border-cyan-500/20 bg-cyan-950/20 rounded-2xl backdrop-blur-sm">
                <h1 className="text-2xl font-bold mb-8 text-cyan-400 uppercase tracking-widest text-center">
                    Sequence Counter
                </h1>

                <div className="flex items-center gap-8 mb-8">
                    <button
                        onClick={() => setCount(c => c - 1)}
                        className="w-16 h-16 rounded-full bg-gray-800 border-2 border-cyan-700 hover:border-cyan-400 text-cyan-400 text-3xl flex items-center justify-center transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] active:scale-95"
                    >
                        -
                    </button>

                    <div className="w-32 h-20 flex items-center justify-center bg-black/40 border border-cyan-900 rounded-lg">
                        <span className="text-6xl font-mono font-bold text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
                            {count}
                        </span>
                    </div>

                    <button
                        onClick={() => setCount(c => c + 1)}
                        className="w-16 h-16 rounded-full bg-gray-800 border-2 border-cyan-700 hover:border-cyan-400 text-cyan-400 text-3xl flex items-center justify-center transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] active:scale-95"
                    >
                        +
                    </button>
                </div>

                <div className="text-center text-xs text-cyan-700 font-mono">
                    VALUE_MODIFIED // {new Date().toLocaleTimeString()}
                </div>
            </div>
        </div>
    );
};

export default Counter;
