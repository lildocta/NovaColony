import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ArrowLeftIcon, BoltIcon } from '@heroicons/react/24/outline';
import { useGame } from '../context/GameContext';
import { notify } from '../utils/notifications';
import Battery from '../components/Battery';

interface ReactorProps {
    onExit: () => void;
}

const Core = ({ active }: { active: boolean }) => {
    const mesh = useRef<any>(null!);

    useFrame((_state, delta) => {
        if (mesh.current) {
            mesh.current.rotation.x += delta * (active ? 2 : 0.5);
            mesh.current.rotation.y += delta * (active ? 2 : 0.5);
        }
    });

    return (
        <mesh ref={mesh}>
            <octahedronGeometry args={[2, 0]} />
            <meshStandardMaterial
                color={active ? "#06b6d4" : "#555"}
                emissive={active ? "#06b6d4" : "#000"}
                emissiveIntensity={active ? 2 : 0}
                wireframe
            />
        </mesh>
    );
};

const Reactor: React.FC<ReactorProps> = ({ onExit }) => {
    const { state, modifyPower } = useGame();
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = () => {
        if (isGenerating) return;

        setIsGenerating(true);

        // Simulation of a task
        setTimeout(() => {
            modifyPower(25);
            notify.success('POWER CELLS CHARGED', 'Output: +25 MW');
            setIsGenerating(false);
        }, 2000);
    };

    return (
        <div className="relative w-full h-full bg-black overflow-hidden flex flex-col">
            {/* Header */}
            <div className="absolute top-0 left-0 w-full p-4 z-10 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto">
                    <button
                        onClick={onExit}
                        className="flex items-center gap-2 px-4 py-2 bg-theme-surface/80 border border-theme-primary/30 text-theme-primary rounded hover:bg-theme-surface hover:text-white transition-colors backdrop-blur-sm"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        <span>BACK TO TERMINAL</span>
                    </button>
                </div>
            </div>

            <div className="flex-grow flex items-center justify-center relative">
                {/* 3D Core View */}
                <div className="absolute inset-0 z-0">
                    <Canvas>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} />
                        <Core active={isGenerating} />
                    </Canvas>
                </div>

                {/* Control Panel */}
                <div className="z-10 bg-theme-surface/80 border border-theme-primary/30 p-8 rounded-lg backdrop-blur-md text-center max-w-md w-full">
                    <BoltIcon className={`w-12 h-12 mx-auto mb-4 ${isGenerating ? 'text-theme-primary animate-pulse' : 'text-gray-500'}`} />
                    <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest">Reactor Control</h2>
                    <p className="text-gray-400 mb-6 text-sm">
                        Current Output: {state.power} / {state.maxPower} MW
                    </p>

                    {/* Main Battery Display */}
                    <div className="mb-8">
                        <Battery
                            current={state.power}
                            max={state.maxPower}
                            segments={10}
                            label="Main Power Banks"
                            charging={isGenerating}
                            className="bg-gray-900/80 border-theme-primary/20"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 text-xs text-left">
                        <div className="bg-black/40 p-3 rounded border border-theme-primary/10">
                            <div className="text-gray-500 mb-1">SHIELDS</div>
                            <div className={state.shields.active ? "text-amber-500" : "text-gray-700"}>
                                {state.shields.active ? '-15 MW' : 'IDLE'}
                            </div>
                        </div>
                        <div className="bg-black/40 p-3 rounded border border-theme-primary/10">
                            <div className="text-gray-500 mb-1">THRUSTERS</div>
                            <div className={state.thrusters.active ? "text-amber-500" : "text-gray-700"}>
                                {state.thrusters.active ? `-${(state.thrusters.velocity * 0.5).toFixed(1)} MW` : 'IDLE'}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || state.power >= state.maxPower}
                        className={`w-full py-4 text-sm font-bold uppercase tracking-widest rounded border transition-all ${isGenerating
                            ? 'bg-theme-primary/10 border-theme-primary/30 text-theme-primary cursor-wait'
                            : state.power >= state.maxPower
                                ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-theme-primary hover:bg-theme-accent text-black border-transparent shadow-[0_0_15px_rgba(var(--theme-primary),0.5)]'
                            }`}
                    >
                        {isGenerating ? 'Charging...' : state.power >= state.maxPower ? 'Cells Full' : 'Initialize Charging Cycle'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reactor;
