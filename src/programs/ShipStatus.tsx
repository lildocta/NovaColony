import { useGame } from '../context/GameContext';

const ShipStatus = () => {
    const { state } = useGame();
    const { thrusters } = state;
    const { engines } = thrusters;

    // Helper for Engine Status Bar
    const EngineStatus = ({ name, data, side }: { name: string, data: { integrity: number, currentOutput: number }, side: 'left' | 'right' }) => (
        <div className={`flex flex-col gap-1 w-32 ${side === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
            <span className="text-theme-primary font-mono text-xs uppercase tracking-widest">{name}</span>
            <div className="w-full h-1 bg-theme-surface border border-theme-primary/30">
                <div
                    className="h-full bg-theme-primary transition-all duration-300"
                    style={{ width: `${data.integrity}%` }}
                />
            </div>
            <div className="flex justify-between w-full text-[10px] text-theme-primary/60 font-mono">
                <span>INT: {Math.round(data.integrity)}%</span>
                <span>OUT: {Math.round(data.currentOutput)}%</span>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full w-full bg-theme-bg/90 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)] opacity-10 pointer-events-none">
                {Array.from({ length: 400 }).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-theme-primary/20" />
                ))}
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-4 border-b border-theme-primary/20 bg-theme-surface/80 backdrop-blur-md">
                <div className="flex items-center gap-4 font-mono text-xs text-theme-primary">
                    <div className="flex flex-col items-end">
                        <span className="opacity-60">VELOCITY</span>
                        <span className="text-lg">{thrusters.velocity.toFixed(2)} m/s</span>
                    </div>
                    <div className="h-8 w-px bg-theme-primary/30" />
                    <div className="flex flex-col items-end">
                        <span className="opacity-60">ACCEL</span>
                        <span className="text-lg">{thrusters.acceleration.toFixed(2)} G</span>
                    </div>
                </div>
            </div>

            {/* Main Content - Schematic */}
            <div className="relative flex-grow flex items-center justify-center p-8">

                {/* Center Ship Schematic (Simplified Shape) */}
                <div className="relative w-64 h-96 border-2 border-theme-primary/50 bg-theme-surface/50 clip-path-ship flex items-center justify-center before:absolute before:inset-0 before:bg-theme-primary/10">

                    {/* Internal Structure Visuals */}
                    <div className="absolute top-10 w-32 h-16 border border-theme-primary/30 rounded-t-full" />
                    <div className="absolute bottom-10 w-24 h-24 border border-theme-accent/30 rounded-full animate-pulse-slow opacity-50" />

                    <span className="font-mono text-xs text-theme-primary/40 mt-[-40px]">NC-1701</span>
                </div>

                {/* Engine Callouts */}
                {/* Port */}
                <div className="absolute left-[15%] top-[40%]">
                    <EngineStatus name="Port Stabilizer" data={engines.port} side="left" />
                    <div className="absolute top-2 right-[-60px] w-[50px] h-px bg-theme-primary/30 rotate-12 origin-left" />
                </div>

                {/* Starboard */}
                <div className="absolute right-[15%] top-[40%]">
                    <EngineStatus name="Starboard Stabilizer" data={engines.starboard} side="right" />
                    <div className="absolute top-2 left-[-60px] w-[50px] h-px bg-theme-primary/30 -rotate-12 origin-right" />
                </div>

                {/* Ventral (Bottom Left for visuals) */}
                <div className="absolute left-[20%] bottom-[20%]">
                    <EngineStatus name="Ventral Maneuvering" data={engines.ventral} side="left" />
                    <div className="absolute top-2 right-[-50px] w-[40px] h-px bg-theme-primary/30 -rotate-45 origin-left" />
                </div>

                {/* Dorsal (Bottom Right for visuals) */}
                <div className="absolute right-[20%] bottom-[20%]">
                    <EngineStatus name="Dorsal Maneuvering" data={engines.dorsal} side="right" />
                    <div className="absolute top-2 left-[-50px] w-[40px] h-px bg-theme-primary/30 rotate-45 origin-right" />
                </div>

                {/* Main Engine */}
                <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <div className="h-8 w-px bg-theme-primary/30 mb-2" />
                    <div className="w-48">
                        <div className="flex justify-between text-xs font-mono text-theme-primary mb-1">
                            <span>MAIN DRIVE</span>
                            <span>{Math.round(engines.main.currentOutput)}% OUTPUT</span>
                        </div>
                        <div className="w-full h-2 bg-theme-surface border border-theme-accent/50 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-theme-primary to-theme-accent transition-all duration-200"
                                style={{ width: `${engines.main.currentOutput}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-[10px] text-theme-primary/60 mt-1 font-mono">
                            <span>INTEGRITY: {engines.main.integrity}%</span>
                        </div>
                    </div>
                </div>

            </div>

            <style>{`
                .clip-path-ship {
                    clip-path: polygon(50% 0%, 100% 25%, 85% 100%, 15% 100%, 0% 25%);
                }
                .animate-pulse-slow {
                    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
};

export default ShipStatus;
