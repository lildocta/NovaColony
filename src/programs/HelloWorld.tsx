import React from 'react';

interface Props {
    onExit: () => void;
}

const HelloWorld: React.FC<Props> = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="text-6xl animate-bounce">👋</div>
            <h1 className="text-4xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                Hello World
            </h1>
            <p className="text-xl text-cyan-200 max-w-md mx-auto leading-relaxed">
                This program is running safely within the NovaColony OS container.
            </p>
        </div>
    );
};

export default HelloWorld;
