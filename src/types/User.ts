export const PermissionLevel = {
    GUEST: 0,
    CREW: 1,
    OFFICER: 2,
    COMMANDER: 3,
    ADMIN: 4,
} as const;

export type PermissionLevelType = typeof PermissionLevel[keyof typeof PermissionLevel];

export interface User {
    id: string;
    username: string;
    permissions: PermissionLevelType;
    department?: string;
}

export const DEFAULT_GUEST: User = {
    id: 'guest',
    username: 'Guest',
    permissions: PermissionLevel.GUEST,
    department: 'Visitor',
};
