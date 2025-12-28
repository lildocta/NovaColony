import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Billboard, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { ArrowLeftIcon } from '@heroicons/react/24/outline'; // Importing an icon for the back button
import { useGame } from '../context/GameContext';
import type { StarData, PlanetData, Selection } from '../types/Galaxy';

interface StarMapProps {
    onExit: () => void;
}

const PlanetNode = ({
    planet,
    isSelected,
    onClick,
    isScanned
}: {
    planet: PlanetData;
    isSelected: boolean;
    onClick: (planet: PlanetData) => void;
    isScanned: boolean;
}) => {
    const mesh = useRef<THREE.Mesh>(null!);
    const orbitRef = useRef<THREE.Group>(null!);

    useFrame((_state, delta) => {
        if (orbitRef.current) {
            orbitRef.current.rotation.y += planet.speed * delta * 0.5;
        }
    });

    return (
        <group ref={orbitRef} rotation={[0, planet.angle, 0]}>
            <mesh
                position={[planet.distance, 0, 0]}
                ref={mesh}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick(planet);
                }}
            >
                <sphereGeometry args={[planet.size, 16, 16]} />
                <meshStandardMaterial
                    color={isSelected ? "#00ff00" : planet.color}
                    emissive={isSelected ? "#00aa00" : (isScanned ? planet.color : "#000000")}
                    emissiveIntensity={isSelected ? 1 : (isScanned ? 0.5 : 0)}
                    // Dim if not scanned
                    opacity={isScanned ? 1 : 0.3}
                    transparent={!isScanned}
                />
            </mesh>
            {/* Orbit path visualization - Only visible when scanned */}
            {isScanned && (
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[planet.distance - 0.05, planet.distance + 0.05, 64]} />
                    <meshBasicMaterial color={isSelected ? "#00ff00" : "#ffffff"} opacity={isSelected ? 0.3 : 0.1} transparent side={THREE.DoubleSide} />
                </mesh>
            )}

            {isScanned && (
                <Billboard follow={true} lockX={false} lockY={false} lockZ={false} position={[planet.distance, planet.size + 1, 0]}>
                    <Text
                        fontSize={isSelected ? 1 : 0.6}
                        color={isSelected ? "#00ff00" : "white"}
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.05}
                        outlineColor="black"
                        fillOpacity={isSelected ? 1 : 0.7}
                    >
                        {planet.name}
                    </Text>
                </Billboard>
            )}
        </group>
    );
};

const StarNode = ({
    star,
    selectedId,
    onSelect,
    isCurrentSystem,
    isScanned
}: {
    star: StarData;
    selectedId: string | number | undefined;
    onSelect: (selection: Selection) => void;
    isCurrentSystem: boolean;
    isScanned: boolean;
}) => {
    const mesh = useRef<THREE.Mesh>(null!);

    useFrame((_state, _delta) => {
        // Animation logic if needed
    });

    const isStarSelected = selectedId === star.id;

    return (
        <group position={star.position}>
            {/* The Star itself */}
            <mesh
                ref={mesh}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect({ type: 'star', data: star });
                }}
            >
                <sphereGeometry args={[star.size, 32, 32]} />
                <MeshDistortMaterial
                    color={star.color}
                    emissive={star.color}
                    emissiveIntensity={2}
                    toneMapped={false}
                    distort={0.4}
                    speed={2}
                />
            </mesh>

            <Sparkles count={100} scale={star.size * 4} size={6} speed={0.2} opacity={0.5} color={star.color} />

            {/* Star Label */}
            <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
                <Text
                    fontSize={isStarSelected ? 3 : 2}
                    color={isStarSelected ? "#00ff00" : "white"}
                    anchorX="center"
                    anchorY="middle"
                    position={[0, star.size + 2, 0]}
                    outlineWidth={0.1}
                    outlineColor="black"
                >
                    {star.name}
                </Text>
            </Billboard>

            {/* Planets - Only visible if current system */}
            {isCurrentSystem && star.planets.map((planet) => (
                <PlanetNode
                    key={planet.id}
                    planet={planet}
                    isSelected={selectedId === planet.id}
                    onClick={() => {
                        if (isScanned) {
                            onSelect({ type: 'planet', data: planet, starName: star.name });
                        }
                    }}
                    isScanned={isScanned}
                />
            ))}

            {/* Selection Highlight Ring for Star */}
            {isStarSelected && (
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[star.size + 0.5, star.size + 1, 32]} />
                    <meshBasicMaterial color="#00ff00" opacity={0.5} transparent side={THREE.DoubleSide} />
                </mesh>
            )}
        </group>
    );
};

const StarMap: React.FC<StarMapProps> = ({ onExit }) => {
    const { state, setSelection, travelToStar, scanSystem } = useGame();
    const { galaxy, selection, currentLocation, currentSystemId, isSystemScanned } = state;

    return (
        <div className="relative w-full h-full bg-black overflow-hidden flex flex-col">
            {/* Header - Back Button Only */}
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

            {/* Selection/Action HUD */}
            {selection?.type === 'star' && (
                <div className="absolute bottom-8 right-8 z-20 pointer-events-auto flex flex-col items-end gap-2">
                    <h2 className="text-2xl text-theme-primary font-bold">{selection.data.name}</h2>
                    <div className="text-xs text-theme-primary/60 font-mono mb-2">
                        COORD: {selection.data.position.join(', ')}
                    </div>

                    {selection.data.id === currentSystemId ? (
                        !isSystemScanned ? (
                            <button
                                onClick={scanSystem}
                                className="px-6 py-3 bg-theme-primary text-black font-bold rounded shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:shadow-[0_0_25px_rgba(6,182,212,0.8)] transition-all animate-pulse"
                            >
                                INITIATE SYSTEM SCAN
                            </button>
                        ) : (
                            <div className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/50 rounded">
                                SYSTEM SCANNED
                            </div>
                        )
                    ) : (
                        <button
                            onClick={() => travelToStar(selection.data.id)}
                            className="px-6 py-3 bg-theme-accent text-black font-bold rounded hover:bg-theme-accent/80 transition-colors"
                        >
                            INITIATE HYPER-JUMP
                        </button>
                    )}
                </div>
            )}

            {/* 3D Scene */}
            <div className="flex-grow w-full h-full">
                <Canvas camera={{ position: [0, 50, 60], fov: 45 }}>
                    <color attach="background" args={['#050510']} />
                    <ambientLight intensity={0.2} />
                    <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" />

                    <Stars radius={200} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

                    {galaxy.map((star) => {
                        // Calculate relative position
                        const position: [number, number, number] = [
                            star.position[0] - currentLocation[0],
                            star.position[1] - currentLocation[1],
                            star.position[2] - currentLocation[2]
                        ];
                        const isCurrentSystem = star.id === currentSystemId;

                        return (
                            <StarNode
                                key={star.id}
                                star={{ ...star, position }} // Pass relative position
                                selectedId={selection?.type === 'star' ? selection.data.id : (selection?.type === 'planet' ? selection.data.id : undefined)}
                                onSelect={setSelection}
                                isCurrentSystem={isCurrentSystem}
                                isScanned={isCurrentSystem && isSystemScanned}
                            />
                        );
                    })}

                    <OrbitControls
                        enablePan={true}
                        enableZoom={true}
                        enableRotate={true}
                        minDistance={20}
                        maxDistance={300}
                    />
                    {/* Safe click handler to deselect */}
                    <mesh onClick={() => setSelection(null)} visible={false}>
                        <sphereGeometry args={[400, 32, 32]} />
                    </mesh>

                </Canvas>
            </div>
            <div className="absolute bottom-4 left-4 text-theme-primary/40 font-mono text-xs z-0 pointer-events-none">
                SECTOR: 7G-Alpha // SCANNING...
            </div>
        </div>
    );
};

export default StarMap;
