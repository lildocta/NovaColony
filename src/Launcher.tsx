import React from 'react';
import type { Program } from './types/Program';
import { useAuth } from './context/AuthContext';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { notify } from './utils/notifications';

interface LauncherProps {
    programs: Program[];
    onLaunch: (program: Program) => void;
}

const Launcher: React.FC<LauncherProps> = ({ programs, onLaunch }) => {
    const { user } = useAuth();

    const handleProgramClick = (program: Program) => {
        const minLevel = program.minPermissionLevel ?? 0;
        if (user.permissions >= minLevel) {
            onLaunch(program);
        } else {
            console.warn('Access Denied: Insufficient Clearance');
            notify.error('ACCESS DENIED', `Required Level: ${minLevel}`);
        }
    };

    return (
        <div className="min-h-screen bg-theme-bg text-theme-primary font-mono flex flex-col items-center justify-center p-8 relative overflow-hidden transition-colors duration-500">

            {/* Background Grid & Effects */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

            <header className="mb-16 text-center relative z-10">
                <div className="inline-block p-4 border border-theme-primary/30 bg-theme-surface/80 backdrop-blur-sm rounded-lg shadow-[0_0_30px_rgba(var(--theme-primary),0.15)]">
                    <h1 className="text-6xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-theme-primary to-blue-600 drop-shadow-[0_0_10px_rgba(var(--theme-primary),0.5)]">
                        NovaColony
                    </h1>
                    <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-theme-primary to-transparent mt-2"></div>
                    <div className="flex justify-between items-center mt-2 text-xs uppercase tracking-[0.3em]">
                        {/* <span className="text-theme-primary/70">System Ready</span> */}
                        <span className="text-theme-accent/80">User: {user.username} [{user.permissions}]</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto relative z-10">
                {programs.map((program) => {
                    const isLocked = user.permissions < (program.minPermissionLevel ?? 0);

                    return (
                        <button
                            key={program.id}
                            onClick={() => handleProgramClick(program)}
                            className={`group relative flex flex-col items-center justify-center p-8 rounded-xl border transition-all duration-300 backdrop-blur-sm
                ${isLocked
                                    ? 'bg-red-950/20 border-red-900/40 cursor-not-allowed opacity-80 hover:bg-red-900/20'
                                    : 'bg-theme-surface/50 border-theme-primary/20 hover:border-theme-primary hover:bg-theme-surface/90 hover:shadow-[0_0_25px_rgba(var(--theme-primary),0.25)]'
                                }
              `}
                        >
                            <div className={`mb-6 p-4 rounded-full transition-colors duration-300
                 ${isLocked ? 'bg-red-900/10' : 'bg-theme-bg/50 group-hover:bg-theme-bg/80'}
              `}>
                                {isLocked ? (
                                    <LockClosedIcon className="w-16 h-16 text-red-700/60" />
                                ) : (
                                    <program.icon className="w-16 h-16 text-theme-primary/80 group-hover:text-theme-primary transition-colors duration-300 group-hover:drop-shadow-[0_0_8px_rgba(var(--theme-primary),0.8)]" />
                                )}
                            </div>

                            <h2 className={`text-xl font-bold tracking-wider uppercase
                ${isLocked ? 'text-red-900' : 'text-gray-400 group-hover:text-theme-primary'}
              `}>
                                {program.name}
                            </h2>
                        </button>
                    );
                })}
            </div>

            <footer className="absolute bottom-8 text-theme-primary/50 text-xs font-mono tracking-widest">
                TERMINAL_ID: 0x4829 // SYSTEM: CONNECTED // AUTH: ACTIVE
            </footer>
        </div>
    );
};

export default Launcher;
