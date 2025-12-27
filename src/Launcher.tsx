import React from 'react';
import type { Program } from './types/Program';


interface LauncherProps {
    programs: Program[];
    onLaunch: (program: Program) => void;
}

const Launcher: React.FC<LauncherProps> = ({ programs, onLaunch }) => {
    return (
        <div className="min-h-screen bg-gray-950 text-cyan-500 font-mono flex flex-col items-center justify-center p-8 relative overflow-hidden">

            {/* Background Grid & Effects */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

            <header className="mb-16 text-center relative z-10">
                <div className="inline-block p-4 border border-cyan-500/30 bg-gray-900/80 backdrop-blur-sm rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                    <h1 className="text-6xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                        NovaColony
                    </h1>
                    <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent mt-2"></div>
                    <p className="text-cyan-700 text-sm mt-2 tracking-[0.3em] uppercase">System Ready // Awaiting Input</p>
                </div>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto relative z-10">
                {programs.map((program) => (
                    <button
                        key={program.id}
                        onClick={() => onLaunch(program)}
                        className="group relative flex flex-col items-center justify-center p-8 bg-gray-900/50 rounded-xl border border-cyan-800/50 hover:border-cyan-400 hover:bg-gray-800/80 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all duration-300 backdrop-blur-sm"
                    >
                        <div className="mb-6 p-4 rounded-full bg-cyan-950/30 group-hover:bg-cyan-900/50 transition-colors duration-300">
                            <program.icon className="w-16 h-16 text-cyan-600 group-hover:text-cyan-300 transition-colors duration-300 group-hover:drop-shadow-[0_0_8px_rgba(103,232,249,0.8)]" />
                        </div>
                        <h2 className="text-xl font-bold tracking-wider text-gray-400 group-hover:text-cyan-100 uppercase">
                            {program.name}
                        </h2>

                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-cyan-800 group-hover:border-cyan-400 transition-colors"></div>
                        <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-cyan-800 group-hover:border-cyan-400 transition-colors"></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-cyan-800 group-hover:border-cyan-400 transition-colors"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-cyan-800 group-hover:border-cyan-400 transition-colors"></div>
                    </button>
                ))}

                {programs.length === 0 && (
                    <div className="col-span-full text-center py-20 text-cyan-900 animate-pulse">
                        [NO MODULES DETECTED]
                    </div>
                )}
            </div>

            <footer className="absolute bottom-8 text-cyan-900 text-xs font-mono tracking-widest">
                TERMINAL_ID: 0x4829 // CONNECTED
            </footer>
        </div>
    );
};

export default Launcher;
