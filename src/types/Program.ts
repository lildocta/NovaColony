import React from 'react';

export interface Program {
    id: string;
    name: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    component: React.ComponentType<{ onExit: () => void }>;
}
