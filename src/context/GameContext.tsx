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
}

interface GameContextType {
    state: GameState;
    updateTheme: (settings: Partial<ThemeSettings>) => void;
    setSelection: (selection: Selection | null) => void;
    modifyPower: (amount: number) => boolean;
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
        <GameContext.Provider value={{ state, updateTheme, setSelection, modifyPower, saveGame, loadGame, savedSlots }}>
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
