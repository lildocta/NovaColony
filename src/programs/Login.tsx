import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LockClosedIcon, FingerPrintIcon } from '@heroicons/react/24/outline';
import { notify } from '../utils/notifications';

interface Props {
    onExit: () => void;
}

const Login: React.FC<Props> = ({ onExit }) => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const success = await login(username, password);
        setLoading(false);

        if (success) {
            notify.success('IDENTITY CONFIRMED', `Welcome back, ${username.toUpperCase()}`);
            onExit();
        } else {
            setError('ACCESS DENIED: INVALID CREDENTIALS');
            notify.error('ACCESS DENIED', 'Invalid Credentials');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto">
            <div className="w-full bg-theme-surface/80 border border-theme-primary/40 rounded-xl p-8 backdrop-blur-md shadow-[0_0_50px_rgba(var(--theme-primary),0.1)]">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 rounded-full bg-theme-primary/10 flex items-center justify-center mb-4 border border-theme-primary/30">
                        <LockClosedIcon className="w-10 h-10 text-theme-primary" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-widest uppercase text-theme-primary">Identity Confirmation</h1>
                    <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-theme-primary/50 to-transparent mt-4"></div>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-theme-primary/70">Personnel ID</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-black/40 border border-theme-primary/30 rounded py-3 px-4 text-theme-primary font-mono focus:border-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-primary transition-all placeholder-theme-primary/20"
                            placeholder="ENTER ID..."
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-theme-primary/70">Passcode</label>
                        <input
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/40 border border-theme-primary/30 rounded py-3 px-4 text-theme-primary font-mono focus:border-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-primary transition-all placeholder-theme-primary/20"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded flex items-center gap-2 text-red-500 text-xs font-bold tracking-wide animate-pulse">
                            <FingerPrintIcon className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 mt-4 bg-theme-primary/20 hover:bg-theme-primary/30 border border-theme-primary/50 text-theme-primary font-bold tracking-widest uppercase rounded transition-all hover:shadow-[0_0_20px_rgba(var(--theme-primary),0.4)] disabled:opacity-50 disabled:cursor-wait relative overflow-hidden group"
                    >
                        {loading ? <span className="animate-pulse">AUTHENTICATING...</span> : 'INITIALIZE SESSION'}
                        <div className="absolute inset-0 bg-theme-primary/10 translate-x-[-100%] group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-[10px] text-theme-primary/40 font-mono">
                        SECURE TERMINAL // UNAUTHORIZED ACCESS IS A CLASS A FELONY
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
