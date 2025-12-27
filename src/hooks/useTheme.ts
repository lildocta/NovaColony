import { useEffect } from 'react';
import { useGame } from '../context/GameContext';

export const useTheme = () => {
    const { state, updateTheme } = useGame();
    const { theme } = state;

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--theme-primary', theme.primary);
        root.style.setProperty('--theme-accent', theme.accent);
        root.style.setProperty('--theme-bg', theme.background);
        root.style.setProperty('--theme-surface', theme.surface);
    }, [theme]);

    // Also return theme setters for convenience
    return {
        theme,
        updateTheme,
    };
};
