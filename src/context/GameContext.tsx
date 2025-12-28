import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { StarData, Selection, PlanetData } from '../types/Galaxy';

// --- Types ---

export interface ThemeSettings {
    primary: string;
    accent: string;
    background: string;
    surface: string;
}

export interface GameState {
    theme: ThemeSettings;
    galaxy: StarData[];
    selection: Selection | null;
    power: number;
    maxPower: number;
    shields: {
        active: boolean;
        integrity: number;
        maxIntegrity: number;
    };
    thrusters: {
        active: boolean;
        velocity: number;
        acceleration: number;
        integrity: number;
        engines: {
            [key: string]: {
                integrity: number;     // 0-100% health
                currentOutput: number; // 0-100% usage
            };
        };
    };
    // Navigation
    currentLocation: [number, number, number];
    currentSystemId: number | null; // ID of the star we are at (if any)
    isSystemScanned: boolean;
}

interface GameContextType {
    state: GameState;
    updateTheme: (settings: Partial<ThemeSettings>) => void;
    setSelection: (selection: Selection | null) => void;
    modifyPower: (amount: number) => boolean;
    toggleShields: () => void;
    setThrusterVelocity: (velocity: number) => void;
    damageSystem: (system: 'shields' | 'thrusters' | 'reactor', amount: number) => void;
    travelToStar: (starId: number) => void;
    scanSystem: () => void;
    saveGame: (slotId: string) => void;
    loadGame: (slotId: string) => void;
    savedSlots: string[];
}

// --- Defaults ---

const DEFAULT_THEME: ThemeSettings = {
    primary: '#06b6d4', // cyan-500
    accent: '#f59e0b',  // amber-500
    background: '#030712', // gray-950
    surface: '#111827', // gray-900
};

const DEFAULT_STATE: GameState = {
    theme: DEFAULT_THEME,
    galaxy: [],
    selection: null,
    power: 50,
    maxPower: 100,
    shields: {
        active: false,
        integrity: 100,
        maxIntegrity: 100,
    },
    thrusters: {
        active: false,
        velocity: 0,
        acceleration: 0,
        integrity: 100,
        engines: {
            main: { integrity: 100, currentOutput: 0 },
            port: { integrity: 100, currentOutput: 0 },
            starboard: { integrity: 100, currentOutput: 0 },
            ventral: { integrity: 100, currentOutput: 0 },
            dorsal: { integrity: 100, currentOutput: 0 },
        },
    },
    currentLocation: [0, 0, 0], // Start at origin (System 0)
    currentSystemId: 0,         // Start at System 0
    isSystemScanned: false,
};

// --- Generation Logic (Moved from StarMap) ---

const generatePlanets = (starId: number): PlanetData[] => {
    const count = Math.floor(Math.random() * 3) + 3; // 3 to 5 planets
    const planets: PlanetData[] = [];
    const colors = ["#aa8866", "#44aa88", "#cc4444", "#8888aa", "#dddddd"];
    const planetTypes = ["Gas Giant", "Terrestrial", "Ice Giant", "Dwarf Planet"];

    for (let i = 0; i < count; i++) {
        planets.push({
            id: starId * 100 + i,
            distance: 8 + (i * 5) + (Math.random() * 2),
            size: Math.random() * 0.4 + 0.2,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: (Math.random() * 0.5 + 0.2) * (Math.random() > 0.5 ? 1 : -1),
            angle: Math.random() * Math.PI * 2,
            name: `P-${starId}-${i + 1}`,
            type: planetTypes[Math.floor(Math.random() * planetTypes.length)],
        });
    }
    return planets;
};

const generateGalaxy = (): StarData[] => {
    const stars: StarData[] = [];
    const starNames = ["HPL-118b", "HPL-118c", "HPL-118d", "HPL-118e"];
    const starTypes = ["Red Dwarf", "Blue Giant", "Yellow Dwarf", "Neutron Star"];
    const colors = ["#ffccaa", "#aaccff", "#ffffff", "#ffaa55"];

    const positions: [number, number, number][] = [
        [0, 0, 0],
        [40, 20, -30],
        [-30, -10, 40],
        [20, -40, -20]
    ];

    for (let i = 0; i < 4; i++) {
        stars.push({
            id: i,
            position: positions[i] || [0, 0, 0],
            name: starNames[i] || `HIP-${i}`,
            size: Math.random() * 1.5 + 2.0,
            color: colors[i % colors.length],
            type: starTypes[i % starTypes.length],
            planets: generatePlanets(i),
        });
    }
    return stars;
};

// --- Context ---

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<GameState>(DEFAULT_STATE);
    const [savedSlots, setSavedSlots] = useState<string[]>([]);

    // Initialize Galaxy on mount if empty
    useEffect(() => {
        if (state.galaxy.length === 0) {
            setState(prev => ({
                ...prev,
                galaxy: generateGalaxy(),
            }));
        }
    }, []); // Run once on mount (or check dependency if needed, but empty is safer for init)

    // Check for list of saves
    useEffect(() => {
        const slots = Object.keys(localStorage).filter(k => k.startsWith('novacolony_save_'));
        setSavedSlots(slots.map(k => k.replace('novacolony_save_', '')));
    }, []);

    // Update Theme Helper
    const updateTheme = useCallback((settings: Partial<ThemeSettings>) => {
        setState(prev => ({
            ...prev,
            theme: { ...prev.theme, ...settings },
        }));
    }, []);

    const setSelection = useCallback((selection: Selection | null) => {
        setState(prev => ({
            ...prev,
            selection,
        }));
    }, []);

    const modifyPower = useCallback((amount: number) => {
        let success = false;
        setState(prev => {
            const newPower = prev.power + amount;
            if (newPower >= 0 && newPower <= prev.maxPower) {
                success = true;
                return { ...prev, power: newPower };
            }
            // Allow capping at max if gaining
            if (amount > 0 && newPower > prev.maxPower) {
                success = true;
                return { ...prev, power: prev.maxPower };
            }
            // Fail if cost (negative amount) makes power < 0
            return prev;
        });
        return success;
    }, []);

    const toggleShields = useCallback(() => {
        setState(prev => {
            const newState = { ...prev };
            newState.shields.active = !prev.shields.active;

            // Initial power cost/refund logic could go here, 
            // but for now we just toggle state. 
            // The simulation/tick loop would handle continuous drain.

            return newState;
        });
    }, []);

    const setThrusterVelocity = useCallback((velocity: number) => {
        setState(prev => {
            const targetVelocity = Math.max(0, Math.min(100, velocity));
            const active = targetVelocity > 0;
            const outputLevel = active ? Math.min(100, targetVelocity + 10) : 0; // Simple simulation of output needed

            return {
                ...prev,
                thrusters: {
                    ...prev.thrusters,
                    active,
                    velocity: targetVelocity,
                    acceleration: active ? (targetVelocity > prev.thrusters.velocity ? 5 : -2) : 0, // Mock acceleration
                    engines: {
                        main: { ...prev.thrusters.engines.main, currentOutput: outputLevel },
                        port: { ...prev.thrusters.engines.port, currentOutput: outputLevel * 0.1 }, // Stabilizers
                        starboard: { ...prev.thrusters.engines.starboard, currentOutput: outputLevel * 0.1 },
                        ventral: { ...prev.thrusters.engines.ventral, currentOutput: outputLevel * 0.05 },
                        dorsal: { ...prev.thrusters.engines.dorsal, currentOutput: outputLevel * 0.05 },
                    }
                }
            };
        });
    }, []);

    const damageSystem = useCallback((system: 'shields' | 'thrusters' | 'reactor', amount: number) => {
        setState(prev => {
            const newState = { ...prev };
            // Simple integrity reduction logic
            if (system === 'shields') {
                newState.shields.integrity = Math.max(0, prev.shields.integrity - amount);
            } else if (system === 'thrusters') {
                newState.thrusters.integrity = Math.max(0, prev.thrusters.integrity - amount);
            }
            // Add reactor damage logic if needed
            return newState;
        });
    }, []);

    const travelToStar = useCallback((starId: number) => {
        setState(prev => {
            const targetStar = prev.galaxy.find(s => s.id === starId);
            if (!targetStar) return prev; // Should not happen

            return {
                ...prev,
                currentLocation: targetStar.position,
                currentSystemId: targetStar.id,
                isSystemScanned: false, // Reset scan on new arrival
                selection: null, // Deselect to avoid confusion
            };
        });
        console.log(`[GameContext] Traveled to Star ID: ${starId}`);
    }, []);

    const scanSystem = useCallback(() => {
        setState(prev => ({
            ...prev,
            isSystemScanned: true,
        }));
        console.log(`[GameContext] System Scanned`);
    }, []);

    // Save Game
    const saveGame = (slotId: string) => {
        const key = `novacolony_save_${slotId}`;
        // Persist the entire state including galaxy
        localStorage.setItem(key, JSON.stringify(state));

        if (!savedSlots.includes(slotId)) {
            setSavedSlots(prev => [...prev, slotId]);
        }
        console.log(`[GameContext] Saved game to slot: ${slotId}`);
    };

    // Load Game
    const loadGame = (slotId: string) => {
        const key = `novacolony_save_${slotId}`;
        const serialized = localStorage.getItem(key);
        if (serialized) {
            try {
                const loadedState = JSON.parse(serialized);
                // Merge with default state to ensure structure integrity
                // Ensure loaded galaxy data matches types if needed, for now assume valid json
                setState({ ...DEFAULT_STATE, ...loadedState });
                console.log(`[GameContext] Loaded game from slot: ${slotId}`);
            } catch (e) {
                console.error('[GameContext] Failed to parse save file', e);
            }
        } else {
            console.warn(`[GameContext] No save found for slot: ${slotId}`);
        }
    };

    return (
        <GameContext.Provider value={{
            state,
            updateTheme,
            setSelection,
            modifyPower,
            toggleShields,
            setThrusterVelocity,
            damageSystem,
            travelToStar,
            scanSystem,
            saveGame,
            loadGame,
            savedSlots
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
