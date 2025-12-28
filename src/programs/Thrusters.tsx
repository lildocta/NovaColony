import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGame } from '../context/GameContext';
import * as THREE from 'three';

interface ThrustersProps {
    onExit: () => void;
}

// --- Visual Components ---

const StarField = ({ velocity }: { velocity: number }) => {
    const count = 2000;
    const mesh = useRef<THREE.Points>(null!);

    // Generate initial positions
    const [positions] = useState<Float32Array>(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 400;     // x
            pos[i * 3 + 1] = (Math.random() - 0.5) * 400;   // y
            pos[i * 3 + 2] = (Math.random() - 0.5) * 400;   // z
        }
        return pos;
    });

    useFrame((_state, delta) => {
        if (!mesh.current) return;

        // Move stars on Z axis based on velocity
        // Base speed 5, plus velocity factor
        const speed = 5 + (velocity * 2);

        // Cast explicit (unsafe type cast to convince TS) or just create a copy of the type logic needed, 
        // but since we aren't changing size, we can just access buffer attribute
        const positions = mesh.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < count; i++) {
            // Move Z towards camera
            positions[i * 3 + 2] += speed * delta * 50;

            // Respawn if behind camera
            if (positions[i * 3 + 2] > 50) {
                positions[i * 3 + 2] = -350;
                positions[i * 3] = (Math.random() - 0.5) * 400;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
            }
        }
        mesh.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial size={0.5} color="#ffffff" transparent opacity={0.8} />
        </points>
    );
};

const PlayerShip = ({ velocity, turnRate }: { velocity: number, turnRate: number }) => {
    const group = useRef<THREE.Group>(null!);

    useFrame((state) => {
        if (group.current) {
            // Bank logic based on turnRate
            // Target bank angle
            const targetBank = -turnRate * 0.5;
            group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetBank, 0.1);

            // Bobbing motion
            group.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
        }
    });

    return (
        <group ref={group} rotation={[0, Math.PI, 0]}>
            {/* Main Body */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1, 0.5, 3]} />
                <meshStandardMaterial color="#334155" />
            </mesh>
            {/* Wings */}
            <mesh position={[1.5, 0, 1]}>
                <boxGeometry args={[2, 0.1, 1.5]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>
            <mesh position={[-1.5, 0, 1]}>
                <boxGeometry args={[2, 0.1, 1.5]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>
            {/* Engine Glow */}
            <mesh position={[0, 0, 1.6]}>
                <planeGeometry args={[0.8, 0.3]} />
                <meshBasicMaterial
                    color="#f59e0b"
                    toneMapped={false}
                    opacity={0.5 + Math.min(velocity / 100, 0.5)}
                    transparent
                />
            </mesh>
        </group>
    );
};

// --- Main Program ---

const Thrusters: React.FC<ThrustersProps> = ({ onExit }) => {
    const { setThrusterVelocity } = useGame();

    // Flight State
    const [velocity, setVelocity] = useState(0);
    const [turnRate, setTurnRate] = useState(0); // -1 (left) to 1 (right)

    // Keyboard Input
    const keys = useRef<{ [key: string]: boolean }>({});

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => keys.current[e.key.toLowerCase()] = true;
        const handleKeyUp = (e: KeyboardEvent) => keys.current[e.key.toLowerCase()] = false;

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Game Loop Logic (via generic interval for state updates outside Canvas)
    useEffect(() => {
        const interval = setInterval(() => {
            // Adjust Velocity (W/S)
            if (keys.current['w']) setVelocity(v => Math.min(100, v + 2));
            if (keys.current['s']) setVelocity(v => Math.max(0, v - 2));

            // Adjust Turn (A/D)
            let targetTurn = 0;
            if (keys.current['a']) targetTurn = 1;
            if (keys.current['d']) targetTurn = -1;

            // Smooth Turn
            setTurnRate(prev => {
                const step = 0.1;
                if (Math.abs(targetTurn - prev) < step) return targetTurn;
                return prev + (targetTurn > prev ? step : -step);
            });

            // Update Global Context
            setThrusterVelocity(velocity);

        }, 16); // ~60fps
        return () => clearInterval(interval);
    }, [velocity, setThrusterVelocity]);

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
            </div>

            {/* Viewport */}
            <div className="flex-grow relative">
                <Canvas camera={{ position: [0, 2, -6], fov: 75 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, -10]} />
                    <StarField velocity={velocity} />
                    <PlayerShip velocity={velocity} turnRate={turnRate} />
                </Canvas>

                {/* HUD Overlay */}
                <div className="absolute inset-0 pointer-events-none p-10 flex flex-col justify-between">
                    {/* Top Center Heading */}
                    <div className="text-center">
                        <div className="inline-block bg-black/50 border border-theme-primary/30 px-6 py-2 rounded-b-lg backdrop-blur">
                            <div className="text-2xl font-bold text-theme-primary">{Math.round(velocity * 120)} km/h</div>
                            <div className="text-xs text-gray-400 uppercase tracking-widest">Velocity</div>
                        </div>
                    </div>

                    {/* Controls Hint */}
                    <div className="text-center mb-8">
                        <div className="inline-block text-white/50 text-xs font-mono bg-black/50 px-4 py-2 rounded">
                            [W/S] THROTTLE  •  [A/D] BANK
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Thrusters;
