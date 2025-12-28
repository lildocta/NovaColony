import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { notify } from '../utils/notifications';

interface DockingProps {
    onExit: () => void;
}

type DockingStatus = 'SEARCHING' | 'ALIGNING' | 'DOCKED';

// --- Visual Components ---

const DockingPort = ({ position, aligned }: { position: THREE.Vector3, aligned: boolean }) => {
    const mesh = useRef<THREE.Group>(null!);

    useFrame((_state) => {
        if (mesh.current) {
            // Gentle rotation
            mesh.current.rotation.z += 0.005;
        }
    });

    return (
        <group ref={mesh} position={position}>
            {/* Outer Ring */}
            <mesh>
                <torusGeometry args={[1.5, 0.1, 16, 100]} />
                <meshStandardMaterial
                    color={aligned ? "#10b981" : "#f59e0b"}
                    emissive={aligned ? "#10b981" : "#f59e0b"}
                    emissiveIntensity={0.5}
                />
            </mesh>
            {/* Inner Guides */}
            <mesh rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[2.5, 0.05, 0.1]} />
                <meshStandardMaterial color={aligned ? "#10b981" : "#d97706"} />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI / 4]}>
                <boxGeometry args={[2.5, 0.05, 0.1]} />
                <meshStandardMaterial color={aligned ? "#10b981" : "#d97706"} />
            </mesh>
        </group>
    );
};

const Crosshair = () => {
    return (
        <group>
            <mesh>
                <ringGeometry args={[0.05, 0.08, 32]} />
                <meshBasicMaterial color="#06b6d4" transparent opacity={0.8} />
            </mesh>
            <mesh>
                <ringGeometry args={[0.5, 0.52, 32]} />
                <meshBasicMaterial color="#06b6d4" transparent opacity={0.3} />
            </mesh>
        </group>
    );
};

// --- Game Logic Component (Must be inside Canvas) ---

const DockingScene = ({
    keys,
    onUpdate
}: {
    keys: React.MutableRefObject<{ [key: string]: boolean }>,
    onUpdate: (score: number, status: DockingStatus) => void
}) => {
    // Local State for visuals
    const [shipPos, setShipPos] = useState(new THREE.Vector3(0, 0, 0));
    const [targetPos, setTargetPos] = useState(new THREE.Vector3(0, 0, -5));

    // Logic Refs
    const shipPosRef = useRef(new THREE.Vector3(0, 0, 0));
    const targetPosRef = useRef(new THREE.Vector3(0, 0, -5));
    const scoreRef = useRef(0);
    const statusRef = useRef<DockingStatus>('ALIGNING');

    useFrame((state, delta) => {
        if (statusRef.current === 'DOCKED') return;

        // --- Moves ---

        // Drifting Target
        const time = state.clock.elapsedTime;
        targetPosRef.current.x = Math.sin(time * 0.5) * 2.5;
        targetPosRef.current.y = Math.cos(time * 0.7) * 1.5;

        // Player Control
        const speed = 3 * delta;
        if (keys.current['w']) shipPosRef.current.y += speed;
        if (keys.current['s']) shipPosRef.current.y -= speed;
        if (keys.current['a']) shipPosRef.current.x -= speed;
        if (keys.current['d']) shipPosRef.current.x += speed;

        // --- Alignment Check ---
        const dx = Math.abs(shipPosRef.current.x - targetPosRef.current.x);
        const dy = Math.abs(shipPosRef.current.y - targetPosRef.current.y);
        const threshold = 0.3;

        const isAligned = dx < threshold && dy < threshold;

        if (isAligned) {
            scoreRef.current += delta * 20; // Charge up
            if (scoreRef.current >= 100) {
                scoreRef.current = 100;
                statusRef.current = 'DOCKED';
                onUpdate(100, 'DOCKED');
                notify.success("DOCKING SUCCESSFUL", "Hardpoint Locked. Systems Integrated.");
                return; // Stop updating after dock
            }
        } else {
            scoreRef.current = Math.max(0, scoreRef.current - delta * 10); // Decay
        }

        // Sync Visuals
        // Update parent store periodically or every frame? Every frame needed for smoothness of bar
        onUpdate(scoreRef.current, statusRef.current);

        // Update local state for React re-render of scene components
        setShipPos(shipPosRef.current.clone());
        setTargetPos(targetPosRef.current.clone());
    });

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />

            <DockingPort
                position={new THREE.Vector3(
                    targetPos.x - shipPos.x,
                    targetPos.y - shipPos.y,
                    -5
                )}
                aligned={scoreRef.current > 0}
            />

            <Crosshair />
            <gridHelper rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -10]} args={[40, 40, 0x111827, 0x050505]} />
        </>
    );
};

// --- Main Program ---

const Docking: React.FC<DockingProps> = ({ onExit }) => {

    // HUD State
    const [status, setStatus] = useState<DockingStatus>('ALIGNING');
    const [alignmentScore, setAlignmentScore] = useState(0);

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

    return (
        <div className="relative w-full h-full bg-black overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 w-full p-4 z-10 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto">
                    <button onClick={onExit} className="px-4 py-2 bg-theme-surface/80 border border-theme-primary/30 text-theme-primary rounded">
                        ABORT DOCKING
                    </button>
                </div>
            </div>

            <div className="flex-grow relative">
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                    <DockingScene
                        keys={keys}
                        onUpdate={(score, newStatus) => {
                            setAlignmentScore(score);
                            // Avoid setting status state redundantly if we can, to reduce logic overhead
                            if (newStatus !== status) setStatus(newStatus);
                        }}
                    />
                </Canvas>

                {/* HUD */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">

                    {/* Alignment Bar */}
                    <div className="mt-64 w-64 bg-gray-900 border border-gray-700 h-4 rounded-full overflow-hidden relative">
                        <div
                            className={`h-full transition-all duration-75 ${status === 'DOCKED' ? 'bg-green-500' : 'bg-theme-accent'}`}
                            style={{ width: `${Math.min(100, alignmentScore)}%` }}
                        />
                    </div>
                    <div className="mt-2 text-xs font-mono text-theme-primary tracking-widest">
                        {status === 'DOCKED' ? 'DOCKING COMPLETE' : 'ALIGNMENT LOCK...'}
                    </div>

                    {status === 'DOCKED' && (
                        <div className="mt-8 bg-green-900/50 border border-green-500 p-6 rounded backdrop-blur animate-pulse">
                            <div className="text-2xl font-bold text-green-400">SUCCESS</div>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-10 w-full text-center pointer-events-none">
                    <div className="inline-block text-white/50 text-xs font-mono bg-black/50 px-4 py-2 rounded">
                        USE [WASD] TO ALIGN WITH TARGET
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Docking;
