import React, { createContext, useContext, useState, useEffect } from 'react';
import { PermissionLevel, DEFAULT_GUEST, type User } from '../types/User';

interface AuthContextType {
    user: User;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock User Database
const MOCK_USERS: Record<string, { pass: string; user: User }> = {
    'commander': {
        pass: 'override',
        user: {
            id: 'cmd-001',
            username: 'Commander Shephard',
            permissions: PermissionLevel.COMMANDER,
            department: 'Command',
        },
    },
    'engineer': {
        pass: 'plasma',
        user: {
            id: 'eng-042',
            username: 'Chief O\'Brien',
            permissions: PermissionLevel.OFFICER,
            department: 'Engineering',
        },
    },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User>(DEFAULT_GUEST);

    useEffect(() => {
        // Load persisted session
        const savedUser = localStorage.getItem('novacolony_auth_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error('Failed to restore session', e);
            }
        }
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        // Simulate network delay for realism
        await new Promise(resolve => setTimeout(resolve, 800));

        const account = MOCK_USERS[username.toLowerCase()];
        if (account && account.pass === password) {
            setUser(account.user);
            localStorage.setItem('novacolony_auth_user', JSON.stringify(account.user));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(DEFAULT_GUEST);
        localStorage.removeItem('novacolony_auth_user');
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: user.permissions > PermissionLevel.GUEST,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
