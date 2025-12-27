import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ProgramContainerProps {
    title: string;
    onExit: () => void;
    children: React.ReactNode;
}

const ProgramContainer: React.FC<ProgramContainerProps> = ({ title, onExit, children }) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-950 p-4 md:p-8 font-mono">
            {/* Outer Holographic Container */}
            <div className="w-full max-w-5xl h-[85vh] flex flex-col relative bg-gray-900/80 backdrop-blur-md border border-cyan-500/30 rounded-lg shadow-[0_0_40px_rgba(6,182,212,0.15)] overflow-hidden">

                {/* Header Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-900/90 border-b border-cyan-500/30">
                    <div className="flex items-center gap-3">
                        {/* Window Controls Decoration */}
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                        </div>
                        <h2 className="ml-4 text-cyan-400 font-bold tracking-wider uppercase text-sm drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
                            {title}
                        </h2>
                    </div>

                    <button
                        onClick={onExit}
                        className="p-1.5 rounded-md text-cyan-500/70 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200 group"
                        title="Terminate Program"
                    >
                        <XMarkIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                {/* CRT Scanline Overlay (Optional aesthetic touch) */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%] mix-blend-overlay opacity-20"></div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-auto p-6 relative z-10 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-gray-900">
                    {children}
                </div>

                {/* Footer Status Bar */}
                <div className="px-4 py-2 bg-gray-900/90 border-t border-cyan-500/30 flex justify-between items-center text-[10px] text-cyan-700 uppercase tracking-widest">
                    <span>SYS.STATUS: ONLINE</span>
                    <span>MEM: OPTIMAL</span>
                </div>
            </div>
        </div>
    );
};

export default ProgramContainer;
