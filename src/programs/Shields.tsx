import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGame } from '../context/GameContext';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import * as THREE from 'three';

interface ShieldsProps {
    onExit: () => void;
}

const ShieldBubble = ({ active, integrity }: { active: boolean; integrity: number }) => {
    const mesh = useRef<THREE.Mesh>(null!);

    // Create hexagonal pattern material shader or simply use wireframe for now
    // Using standard material with wireframe for sci-fi look

    useFrame((state, delta) => {
        if (mesh.current) {
            mesh.current.rotation.y += delta * 0.1;
            mesh.current.rotation.z += delta * 0.05;

            // Pulse effect if active
            if (active) {
                const scale = 2 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
                mesh.current.scale.set(scale, scale, scale);
            }
        }
    });

    const color = useMemo(() => {
        if (!active) return "#333";
        if (integrity > 50) return "#06b6d4"; // Cyan
        if (integrity > 20) return "#f59e0b"; // Amber
        return "#ef4444"; // Red
    }, [active, integrity]);

    return (
        <mesh ref={mesh} scale={[2, 2, 2]}>
            <icosahedronGeometry args={[1, 2]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={active ? 0.5 : 0}
                wireframe
                transparent
                opacity={active ? 0.6 : 0.1}
            />
        </mesh>
    );
};

const Shields: React.FC<ShieldsProps> = ({ onExit }) => {
    const { state, toggleShields } = useGame();
    const { shields } = state;

    return (
        <div className="relative w-full h-full bg-black overflow-hidden flex flex-col">
            {/* Header */}
            <div className="absolute top-0 left-0 w-full p-4 z-10 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto">
                    <button
                        onClick={onExit}
                        className="px-4 py-2 bg-theme-surface/80 border border-theme-primary/30 text-theme-primary rounded hover:bg-theme-surface hover:text-white transition-colors backdrop-blur-sm"
                    >
                        BACK TO TERMINAL
                    </button>
                </div>
                <div className="text-right pointer-events-auto">
                    <div className={`text-xs uppercase tracking-widest mb-1 ${shields.active ? 'text-green-400' : 'text-red-400'}`}>
                        System Status: {shields.active ? 'ONLINE' : 'OFFLINE'}
                    </div>
                </div>
            </div>

            <div className="flex-grow flex items-center justify-center relative">
                {/* 3D View */}
                <div className="absolute inset-0 z-0">
                    <Canvas camera={{ position: [0, 0, 6] }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} />
                        <ShieldBubble active={shields.active} integrity={shields.integrity} />
                        <gridHelper args={[20, 20, 0x111827, 0x111827]} rotation={[Math.PI / 2, 0, 0]} position={[0, -3, 0]} />
                    </Canvas>
                </div>

                {/* Main Controls */}
                <div className="z-10 w-full max-w-2xl px-8 pointer-events-none">
                    <div className="flex justify-between items-end">
                        {/* Status Panel */}
                        <div className="bg-theme-surface/80 border border-theme-primary/30 p-6 rounded-lg backdrop-blur-md pointer-events-auto w-64">
                            <h3 className="text-theme-primary text-sm font-bold uppercase tracking-widest mb-4">Integrity Monitor</h3>

                            <div className="mb-2 flex justify-between text-xs text-gray-400">
                                <span>FIELD STRENGTH</span>
                                <span>{shields.integrity}%</span>
                            </div>
                            <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden mb-6">
                                <div
                                    className={`h-full transition-all duration-500 ${shields.integrity < 30 ? 'bg-red-500' : 'bg-theme-primary'}`}
                                    style={{ width: `${shields.integrity}%` }}
                                ></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="p-2 border border-theme-primary/10 rounded bg-black/20">
                                    <div className="text-xs text-gray-500 mb-1">DRAIN</div>
                                    <div className="text-theme-accent font-mono">15 MW</div>
                                </div>
                                <div className="p-2 border border-theme-primary/10 rounded bg-black/20">
                                    <div className="text-xs text-gray-500 mb-1">RECHARGE</div>
                                    <div className="text-green-500 font-mono">5%/s</div>
                                </div>
                            </div>
                        </div>

                        {/* Toggle Switch */}
                        <div className="pointer-events-auto">
                            <button
                                onClick={toggleShields}
                                className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-300 shadow-[0_0_50px_rgba(0,0,0,0.5)]
                                    ${shields.active
                                        ? 'bg-theme-primary/20 border-theme-primary text-theme-primary shadow-[0_0_30px_rgba(var(--theme-primary),0.4)]'
                                        : 'bg-gray-900/80 border-gray-700 text-gray-500 hover:border-gray-500'
                                    }
                                `}
                            >
                                <ShieldCheckIcon className="w-12 h-12 mb-2" />
                                <span className="text-xs font-bold tracking-widest uppercase">
                                    {shields.active ? 'DISENGAGE' : 'ENGAGE'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shields;
